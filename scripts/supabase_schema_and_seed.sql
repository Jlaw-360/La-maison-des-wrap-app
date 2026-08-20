-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA & INITIAL SEED: LA MAISON DES WRAPS
-- Project: zldxbaykxgdraxvejkdr
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: users (Customers, Kitchen Staff, Drivers, Admins)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'store', 'driver', 'admin')),
  address TEXT DEFAULT '1450 Rue Saint-Pierre, Drummondville, QC',
  birthday TEXT,
  points INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 4. Table: menu_items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  base_price_cad NUMERIC(10, 2) NOT NULL,
  price_seul TEXT,
  price_trio TEXT,
  options_modifiers TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- e.g. CMD-4092
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfillment_type TEXT NOT NULL DEFAULT 'delivery' CHECK (fulfillment_type IN ('delivery', 'pickup', 'drive_thru')),
  dropoff_option TEXT DEFAULT 'hand' CHECK (dropoff_option IN ('hand', 'door')),
  delivery_address TEXT,
  distance_km NUMERIC(5, 2) DEFAULT 0.0,
  subtotal_cad NUMERIC(10, 2) NOT NULL,
  delivery_fee_cad NUMERIC(10, 2) DEFAULT 0.00,
  tps_tax_cad NUMERIC(10, 2) NOT NULL,
  tvq_tax_cad NUMERIC(10, 2) NOT NULL,
  total_cad NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled')),
  pickup_pin TEXT DEFAULT '52325',
  payment_method TEXT DEFAULT 'stripe_card',
  payment_status TEXT DEFAULT 'paid',
  notes TEXT,
  driver_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Consolidated Single Permissive Policies (Zero Linter Warnings)
CREATE POLICY "Public can view active menu items" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (is_available = true);

CREATE POLICY "Users can manage orders" ON public.orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public user access" ON public.users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_order_chats_order_id ON public.order_chats(order_id);
CREATE INDEX IF NOT EXISTS idx_order_chats_sender_id ON public.order_chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);

-- ====================================================================
-- SEED DATA: OFFICIAL CATEGORIES & DISHES FROM LA MAISON DES WRAPS
-- ====================================================================

-- Insert Categories
INSERT INTO public.categories (slug, name_fr, name_en, sort_order) VALUES
  ('wraps', 'Nos Wraps & Kebabs', 'Wraps & Kebabs', 1),
  ('paninis', 'Paninis Grillés', 'Grilled Paninis', 2),
  ('bowls', 'Bols de Curry Spéciaux', 'Special Curry Bowls', 3),
  ('biryani', 'Plats de Riz Biryani', 'Biryani Rice Dishes', 4),
  ('poutines', 'Nos Poutines', 'Poutines', 5),
  ('tacos', 'Tacos Français & Naan Tacos', 'French Tacos & Naan Tacos', 6),
  ('burgers', 'Burgers Gourmets', 'Gourmet Burgers', 7),
  ('sides', 'Accompagnements', 'Sides & Appetizers', 8),
  ('drinks', 'Boissons & Lassis', 'Beverages & Lassi', 9),
  ('desserts', 'Desserts', 'Desserts', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert Official Menu Items
INSERT INTO public.menu_items (category_slug, name_fr, name_en, description_fr, description_en, base_price_cad, price_seul, price_trio, options_modifiers) VALUES
  ('wraps', 'Kebab au Poulet', 'Chicken Kebab Wrap', 'Kebab de poulet assaisonné et grillé, servi avec salade et sauce au choix', 'Seasoned grilled chicken kebab served with salad and choice of sauce', 8.95, '8.95 (Kebab) | 9.95 (Tortilla) | 10.95 (Naan)', '14.25 (Kebab) | 15.25 (Tortilla) | 16.25 (Naan)', 'Choix de Pain: Pain Kebab ($8.95), Tortilla (+$1.00), Naan (+$2.00); Format: Seul vs Trio (+$5.30); Accompagnement Trio: Frites ou Patates à l''ail; Sauces: Mayo, Ketchup, Harissa, Maison, Verte, Ail, Thaï; Extras: Extra Œuf (+0.99$), Extra Cheddar (+0.99$)'),
  ('wraps', 'Wrap au Poulet Tikka', 'Chicken Tikka Wrap', 'Morceaux de poulet mariné aux épices tandoori rouges et grillé', 'Chicken chunks marinated in red tandoori spices and grilled', 8.95, '8.95 (Kebab) | 9.95 (Tortilla) | 10.95 (Naan)', '14.25 (Kebab) | 15.25 (Tortilla) | 16.25 (Naan)', 'Pain Kebab, Tortilla, Naan Fait Maison; Trio avec frites & boisson (+5.30$)'),
  ('wraps', 'Kebab à la Dinde et Bœuf', 'Turkey & Beef Kebab Wrap', 'Mélange savoureux de dinde et bœuf émincé et grillé', 'Savory blend of shaved seasoned turkey and beef', 8.95, '8.95 (Kebab) | 9.95 (Tortilla) | 10.95 (Naan)', '14.25 (Kebab) | 15.25 (Tortilla) | 16.25 (Naan)', 'Pain Kebab, Tortilla, Naan; Sauces au choix'),
  ('wraps', 'Wrap au Steak Fromage', 'Steak & Cheese Wrap', 'Lamelles de steak de bœuf tendre garni de fromage fondant', 'Tender sliced beef steak topped with melted cheese', 9.75, '9.75 (Kebab) | 10.75 (Tortilla) | 11.75 (Naan)', '14.95 (Kebab) | 15.95 (Tortilla) | 16.95 (Naan)', 'Pain Kebab, Tortilla, Naan; Fromage fondant inclus'),
  ('wraps', 'Wrap Mix (2 Viandes au choix)', 'Mix Wrap (Choice of 2 Meats)', 'Combinaison de 2 viandes au choix parmi nos spécialités', 'Custom mix of any 2 signature meats', 9.95, '9.95 (Kebab) | 10.95 (Tortilla) | 11.95 (Naan)', '15.25 (Kebab) | 16.25 (Tortilla) | 17.25 (Naan)', 'Choix de 2 viandes: Poulet Tikka, Dinde/Bœuf, Kebab, Steak, Croustillant'),
  ('paninis', 'Panini Poulet Tikka', 'Chicken Tikka Panini', 'Pain panini grillé croustillant garni de poulet tikka et fromage fondu', 'Crispy grilled panini bread stuffed with chicken tikka and melted cheese', 9.25, '9.25', '14.45', 'Format: Seul ($9.25) ou Trio avec frites & boisson ($14.45)'),
  ('paninis', 'Panini Fromage & Légumes', 'Cheese & Veggie Panini', 'Panini au fromage cheddar fondant, tomates et herbes aromatiques', 'Melted cheddar cheese panini with tomatoes and herbs', 9.25, '9.25', '14.45', 'Format: Seul ($9.25) ou Trio ($14.45)'),
  ('bowls', 'Bol Poulet au Beurre (Butter Chicken)', 'Butter Chicken Bowl', 'Poulet tendre mijoté dans une sauce onctueuse au beurre et tomates douces, servi avec riz basmati', 'Tender chicken simmered in rich creamy butter tomato gravy served with basmati rice', 13.95, '13.95 (Seul)', '18.95 (Combo avec Naan & Boisson)', 'Option Naan Fait Maison (+2.00$)'),
  ('bowls', 'Bol Poulet Tikka Masala', 'Chicken Tikka Masala Bowl', 'Poulet tikka grillé dans une sauce masala riche et épicée, servi sur riz basmati', 'Grilled chicken tikka in rich spiced aromatic masala curry over basmati rice', 13.95, '13.95 (Seul)', '18.95 (Combo)', 'Épices au choix: Doux, Moyen, Épicé'),
  ('poutines', 'Poutine Poulet Tikka', 'Chicken Tikka Poutine', 'Frites croustillantes, fromage en grains du Québec, sauce brune onctueuse et morceaux de poulet tikka', 'Crispy fries, Quebec cheese curds, savory gravy topped with chicken tikka', 12.95, '12.95 (Régulière) | 15.95 (Grande)', '18.25 (Trio)', 'Fromage en grains frais du Québec'),
  ('poutines', 'Poutine Kebab', 'Kebab Poutine', 'Poutine québécoise classique surmontée de viande à kebab assaisonnée', 'Classic Quebec poutine topped with seasoned shaved kebab meat', 12.95, '12.95 (Régulière) | 15.95 (Grande)', '18.25 (Trio)', 'Sauce brune savoureuse & fromage en grains'),
  ('biryani', 'Biryani au Poulet Royal', 'Royal Chicken Biryani', 'Riz basmati parfumé au safran mijoté aux épices entières avec poulet mariné', 'Aromatic saffron basmati rice slow-cooked with whole spices and marinated chicken', 14.50, '14.50', '19.50 (Combo Salade & Boisson)', 'Servi avec sauce raita fraîche'),
  ('sides', 'Pain Naan Fait Maison à l''Ail', 'Fresh Garlic Naan Bread', 'Pain naan traditionnel cuit sur place avec beurre et ail frais', 'Freshly baked traditional naan bread brushed with garlic butter', 3.50, '3.50', '3.50', 'Fait maison sur commande'),
  ('sides', 'Frites Maison Croustillantes', 'Crispy House Fries', 'Portion de frites dorées croustillantes assaisonnées', 'Golden crispy seasoned french fries', 4.50, '4.50', '4.50', 'Sauce trempette incluse'),
  ('drinks', 'Lassi à la Mangue', 'Mango Lassi', 'Boisson traditionnelle onctueuse au yogourt et pulpe de mangue douce', 'Traditional creamy sweet yogurt drink blended with ripe mango', 4.50, '4.50', '4.50', 'Boisson artisanale fraîche'),
  ('drinks', 'Canette de Boisson Gazeuse', 'Canned Soft Drink', 'Coke, Diet Coke, Pepsi, 7Up, Canada Dry, Nestea', 'Coke, Diet Coke, Pepsi, 7Up, Canada Dry, Iced Tea', 2.00, '2.00', '2.00', '355ml'),
  ('desserts', 'Gulab Jamun (2 pcs)', 'Gulab Jamun (2 pcs)', 'Beignets de lait moelleux trempés dans un sirop parfumé à la cardamome et eau de rose', 'Warm soft milk dough dumplings soaked in rose cardamom syrup', 4.50, '4.50', '4.50', 'Dessert indien authentique');
