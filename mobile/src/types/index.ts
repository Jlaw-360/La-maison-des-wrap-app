export type UserRole = 'client' | 'kitchen' | 'driver' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  points_balance: number;
  preferred_language: 'fr' | 'en';
  created_at?: string;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type DeliveryType = 'hand_to_me' | 'leave_at_door';
export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';

export interface BreadOption {
  id: string;
  name_fr: string;
  name_en: string;
  price_modifier: number;
}

export interface MenuItem {
  id: string;
  category: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  price_cad: number;
  points_cost?: number;
  image_url?: string;
  is_available: boolean;
  allows_bread_selection?: boolean;
  allows_trio?: boolean;
}

export interface OrderItemOption {
  bread?: string;
  format: 'seul' | 'trio';
  side_choice?: string;
  drink_choice?: string;
  sauces?: string[];
  extras?: string[];
  notes?: string;
}

export interface CartItem {
  cart_id: string;
  menu_item: MenuItem;
  quantity: number;
  unit_price: number;
  options: OrderItemOption;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: number | string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  driver_id?: string;
  fulfillment_type: FulfillmentType;
  delivery_type: DeliveryType;
  delivery_address?: string;
  delivery_notes?: string;
  subtotal_cad: number;
  delivery_fee_cad: number;
  tps_tax_cad: number;
  tvq_tax_cad: number;
  total_cad: number;
  points_earned: number;
  points_spent: number;
  is_points_redemption: boolean;
  status: OrderStatus;
  pickup_token?: string;
  delivery_token?: string;
  pickup_pin?: string;
  backup_pin?: string;
  driver_lat?: number | null;
  driver_lng?: number | null;
  dropoff_photo_url?: string | null;
  created_at: string;
  updated_at?: string;
  items?: CartItem[];
}

export interface OrderChat {
  id: string;
  order_id: string;
  sender_id?: string;
  sender_role: UserRole;
  recipient_type?: string;
  message: string;
  created_at: string;
}
