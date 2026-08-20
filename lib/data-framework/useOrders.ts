import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: string;
  delivery_address: string;
  subtotal_cad: number;
  delivery_fee_cad: number;
  tps_tax_cad: number;
  tvq_tax_cad: number;
  total_cad: number;
  status: string;
  pickup_pin: string;
  created_at: string;
}

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data } = await query;
      setOrders(data || []);
      setLoading(false);
    }

    loadOrders();

    // Subscribe to live PostgreSQL Realtime changes
    const channel = supabase
      .channel('orders_realtime_feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { orders, loading };
}
