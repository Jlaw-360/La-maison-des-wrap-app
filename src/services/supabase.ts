import { createClient } from '@supabase/supabase-js';
import { UserProfile, Order, CartItem, OrderChat, UserRole, MenuItem } from '../types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ==========================================
// AUTHENTICATION & USER PROFILE
// ==========================================

export async function getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Error fetching user profile:', error.message);
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.error('getCurrentUserProfile exception:', err);
    return null;
  }
}

export async function upsertUserProfile(profile: Partial<UserProfile> & { name?: string }): Promise<UserProfile | null> {
  try {
    const payload = {
      ...profile,
      name: profile.name || profile.full_name || 'Client',
      full_name: profile.full_name || profile.name || 'Client',
    };
    const { data, error } = await supabase
      .from('users')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error upserting user profile:', error.message);
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.error('upsertUserProfile exception:', err);
    return null;
  }
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as UserProfile[]) || [];
  } catch (err) {
    console.error('fetchAllUsers error:', err);
    return [];
  }
}

export async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('updateUserRole error:', err);
    return false;
  }
}

// ==========================================
// ORDERS & REALTIME
// ==========================================

export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at'>,
  items: CartItem[]
): Promise<Order | null> {
  try {
    // Generate high-entropy pickup tokens & 4-digit PIN
    const pickupToken = 'PICK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const deliveryToken = 'DELIV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: orderData.customer_id,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        fulfillment_type: orderData.fulfillment_type,
        delivery_type: orderData.delivery_type,
        delivery_address: orderData.delivery_address,
        delivery_notes: orderData.delivery_notes,
        subtotal_cad: orderData.subtotal_cad,
        delivery_fee_cad: orderData.delivery_fee_cad,
        tps_tax_cad: orderData.tps_tax_cad,
        tvq_tax_cad: orderData.tvq_tax_cad,
        total_cad: orderData.total_cad,
        points_earned: orderData.points_earned,
        points_spent: orderData.points_spent,
        is_points_redemption: orderData.is_points_redemption,
        status: 'new',
        pickup_token: pickupToken,
        delivery_token: deliveryToken,
        pickup_pin: pin,
        backup_pin: pin,
      })
      .select()
      .single();

    if (orderErr) {
      console.error('Error inserting order:', orderErr.message);
      return null;
    }

    // Insert order items
    if (items && items.length > 0) {
      const orderItemsToInsert = items.map((item) => ({
        order_id: newOrder.id,
        menu_item_id: item.menu_item.id || null,
        item_name: item.menu_item.name_fr || item.menu_item.name_en,
        quantity: item.quantity,
        unit_price_cad: item.unit_price,
        item_options: item.options,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsErr) {
        console.warn('Error inserting order items:', itemsErr.message);
      }
    }

    // Deduct or add points to user if logged in
    if (orderData.customer_id) {
      const { data: userRecord } = await supabase
        .from('users')
        .select('points_balance')
        .eq('id', orderData.customer_id)
        .single();

      if (userRecord) {
        let newBalance = (userRecord.points_balance || 0) - (orderData.points_spent || 0);
        if (!orderData.is_points_redemption) {
          newBalance += (orderData.points_earned || 0);
        }
        await supabase
          .from('users')
          .update({ points_balance: Math.max(0, newBalance) })
          .eq('id', orderData.customer_id);
      }
    }

    return newOrder as Order;
  } catch (err) {
    console.error('createOrder exception:', err);
    return null;
  }
}

export async function fetchLiveOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return (data as Order[]) || [];
  } catch (err) {
    console.error('fetchLiveOrders error:', err);
    return [];
  }
}

export async function fetchCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Order[]) || [];
  } catch (err) {
    console.error('fetchCustomerOrders error:', err);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  additionalData: Partial<Order> = {}
): Promise<boolean> {
  try {
    const payload: any = { status, ...additionalData, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', orderId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return false;
  }
}

export async function updateDriverLocation(orderId: string, lat: number, lng: number): Promise<void> {
  try {
    await supabase
      .from('orders')
      .update({ driver_lat: lat, driver_lng: lng })
      .eq('id', orderId);
  } catch (err) {
    console.error('updateDriverLocation error:', err);
  }
}

// ==========================================
// CHAT SERVICES
// ==========================================

export async function sendOrderMessage(
  orderId: string,
  senderRole: UserRole,
  message: string,
  senderId?: string
): Promise<OrderChat | null> {
  try {
    const { data, error } = await supabase
      .from('order_chats')
      .insert({
        order_id: orderId,
        sender_role: senderRole,
        sender_id: senderId || null,
        message,
      })
      .select()
      .single();

    if (error) throw error;
    return data as OrderChat;
  } catch (err) {
    console.error('sendOrderMessage error:', err);
    return null;
  }
}

export async function fetchOrderChats(orderId: string): Promise<OrderChat[]> {
  try {
    const { data, error } = await supabase
      .from('order_chats')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as OrderChat[]) || [];
  } catch (err) {
    console.error('fetchOrderChats error:', err);
    return [];
  }
}

// ==========================================
// REALTIME SUBSCRIPTIONS
// ==========================================

export function subscribeToOrders(onUpdate: (payload: any) => void) {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToOrderChats(orderId: string, onMessage: (msg: OrderChat) => void) {
  const channel = supabase
    .channel(`order_chat:${orderId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_chats', filter: `order_id=eq.${orderId}` },
      (payload) => {
        onMessage(payload.new as OrderChat);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToUserProfile(userId: string, onUpdate: (user: UserProfile) => void) {
  const channel = supabase
    .channel(`user_profile:${userId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
      (payload) => {
        onUpdate(payload.new as UserProfile);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}


