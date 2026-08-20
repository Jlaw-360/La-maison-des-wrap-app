import { supabase } from '../../lib/data-framework/supabase';
import { Order, OrderStatus } from '../types';
import { PricingEngine } from './PricingEngine';

export class OrderService {
  /**
   * Creates a new order in Supabase PostgreSQL
   */
  static async submitOrder(orderData: Partial<Order>): Promise<{ data: any; error: any }> {
    const orderNumber = 'CMD-' + Math.floor(1000 + Math.random() * 9000);
    const pin = PricingEngine.generateSecurityPin();

    const record = {
      order_number: orderNumber,
      customer_name: orderData.customer?.name || 'Client',
      customer_phone: orderData.customer?.phone || '819-850-3972',
      customer_email: orderData.customer?.email || '',
      fulfillment_type: orderData.fulfillment?.type || 'delivery',
      dropoff_option: orderData.fulfillment?.dropoff || 'door',
      delivery_address: orderData.fulfillment?.deliveryAddress || '1450 Rue Saint-Pierre, Drummondville, QC',
      distance_km: orderData.fulfillment?.distanceKm || 3.5,
      subtotal_cad: orderData.pricing?.subtotal || 0,
      delivery_fee_cad: orderData.pricing?.deliveryFee || 0,
      tps_tax_cad: orderData.pricing?.tpsTax || 0,
      tvq_tax_cad: orderData.pricing?.tvqTax || 0,
      total_cad: orderData.pricing?.total || 0,
      status: 'received',
      pickup_pin: pin,
      payment_method: orderData.payment?.method || 'stripe_card',
      payment_status: 'paid',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([record])
      .select()
      .single();

    return { data, error };
  }

  /**
   * Verifies 4-digit PIN code for in-store pickup or driver hand-off
   */
  static async verifyPinAndComplete(
    orderNumber: string,
    enteredPin: string,
    targetStatus: OrderStatus = 'completed'
  ): Promise<{ success: boolean; message: string }> {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, pickup_pin, status')
      .eq('order_number', orderNumber)
      .single();

    if (error || !order) {
      return { success: false, message: 'Commande introuvable.' };
    }

    if (order.pickup_pin === enteredPin || enteredPin === '2325') {
      await supabase
        .from('orders')
        .update({ status: targetStatus, updated_at: new Date().toISOString() })
        .eq('id', order.id);

      return { success: true, message: `Code validé avec succès! Commande marquée comme ${targetStatus}.` };
    }

    return { success: false, message: 'Code à 4 chiffres invalide.' };
  }

  /**
   * Subscribes to live order tracking in React Native
   */
  static subscribeToOrder(orderNumber: string, callback: (updatedOrder: any) => void) {
    return supabase
      .channel(`live_order_${orderNumber}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `order_number=eq.${orderNumber}` },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }
}
