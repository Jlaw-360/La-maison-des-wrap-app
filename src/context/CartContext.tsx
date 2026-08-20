import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FulfillmentType, DropoffOption } from '../types';
import { PricingEngine } from '../services/PricingEngine';

interface CartContextType {
  cart: CartItem[];
  fulfillment: FulfillmentType;
  dropoff: DropoffOption;
  deliveryAddress: string;
  distanceKm: number;
  driverTip: number;
  summary: ReturnType<typeof PricingEngine.calculateOrderSummary>;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  setFulfillment: (mode: FulfillmentType) => void;
  setDropoff: (option: DropoffOption) => void;
  setDeliveryAddress: (address: string, distanceKm?: number) => void;
  setDriverTip: (tip: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery');
  const [dropoff, setDropoff] = useState<DropoffOption>('door');
  const [deliveryAddress, setDeliveryAddressState] = useState('1450 Rue Saint-Pierre, Drummondville, QC');
  const [distanceKm, setDistanceKm] = useState(3.5);
  const [driverTip, setDriverTip] = useState(0.00);

  const summary = PricingEngine.calculateOrderSummary(cart, distanceKm, fulfillment, driverTip);

  const addItem = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0
              ? { ...i, quantity: newQty, totalPrice: i.unitPrice * newQty }
              : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const setDeliveryAddress = (address: string, distance?: number) => {
    setDeliveryAddressState(address);
    if (distance !== undefined) {
      setDistanceKm(distance);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fulfillment,
        dropoff,
        deliveryAddress,
        distanceKm,
        driverTip,
        summary,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setFulfillment,
        setDropoff,
        setDeliveryAddress,
        setDriverTip,
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
