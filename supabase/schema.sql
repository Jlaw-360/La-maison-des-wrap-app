-- ==============================================================================
-- LA MAISON DES WRAPS - CANADIAN QSR MASTER DATABASE SCHEMA (SUPABASE SQL)
-- Multi-Role Ordering, QR Verification, Rewards Points & Real-Time Chat System
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'kitchen', 'driver', 'admin')),
  points_balance INT DEFAULT 0,
  address TEXT,
  birthday TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU CATEGORIES & ITEMS
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cad NUMERIC(10,2) NOT NULL,
  points_cost INT DEFAULT NULL, -- Points required if redeemable as reward (e.g. 200 pts)
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS & FULFILLMENT TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL,
  customer_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL DEFAULT 'delivery' CHECK (order_type IN ('pickup', 'delivery')),
  delivery_type TEXT DEFAULT 'hand_to_me' CHECK (delivery_type IN ('hand_to_me', 'leave_at_door')),
  delivery_address TEXT,
  delivery_notes TEXT,
  subtotal_cad NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  delivery_fee_cad NUMERIC(10,2) DEFAULT 0.00,
  tps_tax_cad NUMERIC(10,2) DEFAULT 0.00,
  tvq_tax_cad NUMERIC(10,2) DEFAULT 0.00,
  tax_cad NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_amount_cad NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  points_earned INT DEFAULT 0,
  points_spent INT DEFAULT 0,
  is_points_redemption BOOLEAN DEFAULT FALSE,
  order_status TEXT NOT NULL DEFAULT 'new' 
    CHECK (order_status IN ('new', 'accepted', 'preparing', 'ready', 'in_transit', 'delivered', 'completed', 'cancelled')),
  status TEXT DEFAULT 'new',
  estimated_ready_time TIMESTAMPTZ,
  pickup_token TEXT UNIQUE,
  delivery_token TEXT UNIQUE,
  pickup_pin TEXT,
  backup_pin TEXT,
  dropoff_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  item_name TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price_cad NUMERIC(10,2) NOT NULL,
  item_options JSONB DEFAULT '{}'::jsonb
);

-- 6. REAL-TIME CHAT TABLE
CREATE TABLE IF NOT EXISTS public.order_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('driver_to_customer', 'customer_to_driver', 'store_to_customer', 'customer_to_store')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUTOMATED QR TOKENS & PIN GENERATOR TRIGGER
CREATE OR REPLACE FUNCTION generate_order_security_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Unique high-entropy string tokens for QR code generation
  NEW.pickup_token := 'PICK-' || encode(gen_random_bytes(10), 'hex');
  NEW.delivery_token := 'DELIV-' || encode(gen_random_bytes(10), 'hex');
  
  -- 4-digit backup PIN
  IF NEW.pickup_pin IS NOT NULL AND NEW.pickup_pin <> '' THEN
    NEW.backup_pin := NEW.pickup_pin;
  ELSE
    NEW.backup_pin := (floor(random() * 9000 + 1000))::text;
    NEW.pickup_pin := NEW.backup_pin;
  END IF;
  
  -- Calculate points earned (10 points per $1 CAD spent, excluding points redemptions)
  IF NEW.is_points_redemption IS FALSE THEN
    NEW.points_earned := FLOOR(COALESCE(NEW.subtotal_cad, 0) * 10);
  ELSE
    NEW.points_earned := 0;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_order_security_data ON public.orders;
CREATE TRIGGER trigger_order_security_data
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_security_data();

-- 8. AUTOMATIC REWARDS BALANCE UPDATER
CREATE OR REPLACE FUNCTION update_user_points_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.order_status IN ('completed', 'delivered') OR NEW.status IN ('completed', 'delivered')) THEN
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE public.users 
      SET points_balance = points_balance + COALESCE(NEW.points_earned, 0) - COALESCE(NEW.points_spent, 0)
      WHERE id = NEW.customer_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_points ON public.orders;
CREATE TRIGGER trigger_update_user_points
AFTER UPDATE OF order_status, status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_user_points_on_completion();

-- 9. RPC FUNCTION: VERIFY ORDER SCANS
CREATE OR REPLACE FUNCTION verify_order_qr_or_pin(
  p_order_id UUID,
  p_scanned_code TEXT,
  p_scan_role TEXT -- 'kitchen_pickup', 'driver_store_pickup', 'driver_delivery'
)
RETURNS JSON AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Order not found');
  END IF;

  -- 1. Customer Picking up at Store Counter
  IF p_scan_role = 'kitchen_pickup' THEN
    IF (v_order.pickup_token = p_scanned_code OR v_order.backup_pin = p_scanned_code OR v_order.pickup_pin = p_scanned_code) THEN
      UPDATE public.orders SET order_status = 'completed', status = 'completed', updated_at = NOW() WHERE id = p_order_id;
      RETURN json_build_object('success', true, 'message', 'Customer pickup verified successfully.');
    END IF;
  END IF;

  -- 2. Driver Picking up from Kitchen
  IF p_scan_role = 'driver_store_pickup' THEN
    IF (v_order.pickup_token = p_scanned_code OR v_order.backup_pin = p_scanned_code OR v_order.pickup_pin = p_scanned_code) THEN
      UPDATE public.orders SET order_status = 'in_transit', status = 'in_transit', updated_at = NOW() WHERE id = p_order_id;
      RETURN json_build_object('success', true, 'message', 'Driver pickup confirmed. Order is in transit.');
    END IF;
  END IF;

  -- 3. Driver Handing to Customer ('hand_to_me')
  IF p_scan_role = 'driver_delivery' THEN
    IF (v_order.delivery_token = p_scanned_code OR v_order.backup_pin = p_scanned_code OR v_order.pickup_pin = p_scanned_code) THEN
      UPDATE public.orders SET order_status = 'delivered', status = 'delivered', updated_at = NOW() WHERE id = p_order_id;
      RETURN json_build_object('success', true, 'message', 'Delivery confirmed successfully.');
    END IF;
  END IF;

  RETURN json_build_object('success', false, 'message', 'Invalid QR Code or PIN code.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
