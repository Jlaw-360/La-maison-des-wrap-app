import { supabase } from '../src/services/supabase';

export async function fetchLiveAdminKPIs() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_amount, subtotal, tax_tps, tax_tvq, order_type, status, payment_status')
    .eq('payment_status', 'paid')
    .neq('status', 'cancelled');

  if (error || !orders || orders.length === 0) {
    return {
      totalRevenue: 0.00,
      totalOrders: 0,
      aov: 0.00,
      deliveryRevenue: 0.00,
      pickupRevenue: 0.00,
      tps: 0.00,
      tvq: 0.00,
    };
  }

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0.00;

  const deliveryRevenue = orders
    .filter(o => o.order_type === 'delivery')
    .reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

  const pickupRevenue = orders
    .filter(o => o.order_type === 'pickup')
    .reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

  const tps = orders.reduce((acc, o) => acc + Number(o.tax_tps || 0), 0);
  const tvq = orders.reduce((acc, o) => acc + Number(o.tax_tvq || 0), 0);

  return {
    totalRevenue,
    totalOrders,
    aov,
    deliveryRevenue,
    pickupRevenue,
    tps,
    tvq,
  };
}
