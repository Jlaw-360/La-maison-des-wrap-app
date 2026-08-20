import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, MenuItem, OrderItemOption, FulfillmentType, DeliveryType, Order } from '../types';
import { createOrder } from '../services/supabase';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  fulfillmentType: FulfillmentType;
  deliveryType: DeliveryType;
  deliveryAddress: string;
  deliveryNotes: string;
  isRedeemingPoints: boolean;
  activeOrder: Order | null;
  subtotal: number;
  deliveryFee: number;
  tpsTax: number;
  tvqTax: number;
  total: number;
  pointsEarned: number;
  pointsRequired: number;
  addItem: (item: MenuItem, quantity: number, options: OrderItemOption) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setDeliveryType: (type: DeliveryType) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryNotes: (notes: string) => void;
  setIsRedeemingPoints: (val: boolean) => void;
  submitOrder: () => Promise<Order | null>;
  setActiveOrder: (order: Order | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, refreshUserData } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('hand_to_me');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('998 110e Avenue, Drummondville, QC');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [isRedeemingPoints, setIsRedeemingPoints] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Dynamic pricing calculations
  const calculateItemUnitPrice = (menuItem: MenuItem, options: OrderItemOption): number => {
    let price = menuItem.price_cad;

    // Bread modifier
    if (options.bread === 'tortilla') price += 1.0;
    if (options.bread === 'naan') price += 2.0;

    // Trio format modifier
    if (options.format === 'trio') {
      price += 5.30;
      if (options.drink_choice?.includes('jarritos')) price += 1.0;
      if (options.drink_choice?.includes('lassi')) price += 2.25;
    }

    // Extras
    if (options.extras?.includes('egg')) price += 0.99;
    if (options.extras?.includes('cheese')) price += 0.99;

    return parseFloat(price.toFixed(2));
  };

  const addItem = (menuItem: MenuItem, quantity: number, options: OrderItemOption) => {
    const unitPrice = calculateItemUnitPrice(menuItem, options);
    const lineTotal = parseFloat((unitPrice * quantity).toFixed(2));
    const newItem: CartItem = {
      cart_id: 'cart_' + Math.random().toString(36).substring(2, 9),
      menu_item: menuItem,
      quantity,
      unit_price: unitPrice,
      options,
      line_total: lineTotal,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cart_id !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.cart_id === cartId
          ? { ...i, quantity, line_total: parseFloat((i.unit_price * quantity).toFixed(2)) }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = parseFloat(items.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));
  const deliveryFee = fulfillmentType === 'delivery' ? 3.50 : 0.00;
  
  // Quebec tax engine (TPS 5.000% + TVQ 9.975%)
  const taxableBase = isRedeemingPoints ? 0.00 : subtotal + deliveryFee;
  const tpsTax = parseFloat((taxableBase * 0.05).toFixed(2));
  const tvqTax = parseFloat((taxableBase * 0.09975).toFixed(2));
  const total = isRedeemingPoints ? 0.00 : parseFloat((taxableBase + tpsTax + tvqTax).toFixed(2));

  // Points calculations (10 pts per $1 CAD spent)
  const pointsEarned = isRedeemingPoints ? 0 : Math.floor(subtotal * 10);
  const pointsRequired = items.reduce((sum, item) => sum + (item.menu_item.points_cost || 350) * item.quantity, 0);

  const submitOrder = async (): Promise<Order | null> => {
    if (items.length === 0) return null;

    const orderData: Omit<Order, 'id' | 'created_at'> = {
      order_number: Math.floor(1000 + Math.random() * 9000),
      customer_id: user?.id,
      customer_name: user?.full_name || 'Client Web/Mobile',
      customer_phone: user?.phone || '',
      customer_email: user?.email || '',
      fulfillment_type: fulfillmentType,
      delivery_type: deliveryType,
      delivery_address: fulfillmentType === 'delivery' ? deliveryAddress : 'Ramassage au 998 110e Avenue, Drummondville',
      delivery_notes: deliveryNotes,
      subtotal_cad: subtotal,
      delivery_fee_cad: deliveryFee,
      tps_tax_cad: tpsTax,
      tvq_tax_cad: tvqTax,
      total_cad: total,
      points_earned: pointsEarned,
      points_spent: isRedeemingPoints ? pointsRequired : 0,
      is_points_redemption: isRedeemingPoints,
      status: 'new',
    };

    const newOrder = await createOrder(orderData, items);
    if (newOrder) {
      setActiveOrder(newOrder);
      clearCart();
      if (refreshUserData) {
        await refreshUserData();
      }
    }
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        fulfillmentType,
        deliveryType,
        deliveryAddress,
        deliveryNotes,
        isRedeemingPoints,
        activeOrder,
        subtotal,
        deliveryFee,
        tpsTax,
        tvqTax,
        total,
        pointsEarned,
        pointsRequired,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setFulfillmentType,
        setDeliveryType,
        setDeliveryAddress,
        setDeliveryNotes,
        setIsRedeemingPoints,
        submitOrder,
        setActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
