// ====================================================================
// REACT NATIVE TYPE DEFINITIONS: LA MAISON DES WRAPS
// ====================================================================

export type Role = 'customer' | 'store' | 'driver' | 'admin';
export type FulfillmentType = 'delivery' | 'pickup' | 'drive_thru';
export type DropoffOption = 'door' | 'hand';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'stripe_card' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  address: string;
  birthday?: string;
  points: number;
  tier: 'Bronze' | 'Argent' | 'Or' | 'VIP';
  createdAt: string;
}

export interface BreadOption {
  id: string;
  name: 'Pain Kebab' | 'Pain Tortilla' | 'Pain Naan Fait Maison';
  extraPrice: number; // 0.00, 1.00, 2.00
}

export interface DrinkOption {
  id: string;
  name: string;
  isFreeWithTrio: boolean;
  extraPrice: number; // 0.00 for 355ml cans, 2.50 for Lassi, 1.50 for Chai
  category: 'canette' | 'lassi' | 'hot' | 'juice' | 'bottle';
}

export interface MenuItem {
  id: string;
  name_fr: string;
  name_en: string;
  category_slug: string;
  description_fr: string;
  description_en: string;
  base_price_cad: number;
  price_seul?: string;
  price_trio?: string;
  is_wrap: boolean;
  imageUrl?: string;
  is_available: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  bread?: BreadOption;
  isTrio: boolean;
  trioDrink?: DrinkOption;
  sauces: string[];
  extras: { name: string; price: number }[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. CMD-4092
  customer: {
    id?: string;
    name: string;
    phone: string;
    email: string;
  };
  items: CartItem[];
  fulfillment: {
    type: FulfillmentType;
    dropoff: DropoffOption;
    deliveryAddress: string;
    distanceKm: number;
    notes?: string;
  };
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tpsTax: number; // 5%
    tvqTax: number; // 9.975%
    driverTip: number;
    total: number;
  };
  status: OrderStatus;
  security: {
    pickupPin: string; // 4-digit verification PIN (e.g. "2325")
    qrCodeString: string; // "LMDW-CMD-4092-PIN2325"
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    currentLat?: number;
    currentLng?: number;
  };
  createdAt: string;
  updatedAt: string;
}
