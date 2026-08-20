import { CartItem, FulfillmentType } from '../types';

export const QUEBEC_TAXES = {
  TPS_RATE: 0.05,     // 5.000%
  TVQ_RATE: 0.09975,  // 9.975%
};

export const RESTAURANT_LOCATION = {
  name: 'La Maison des Wraps',
  address: '998 110e Avenue, Drummondville, QC J2B 6X2',
  phone: '(819) 850-3972',
  lat: 45.8821,
  lng: -72.4842,
};

export class PricingEngine {
  /**
   * Calculates delivery fee based on distance in Drummondville
   * 0-5 km: Free ($0.00)
   * 5-10 km: $4.99
   * 10-15 km: $9.99
   */
  static calculateDeliveryFee(distanceKm: number, fulfillment: FulfillmentType): number {
    if (fulfillment !== 'delivery') return 0.00;
    if (distanceKm <= 5.0) return 0.00;
    if (distanceKm <= 10.0) return 4.99;
    return 9.99;
  }

  /**
   * Calculates complete tax and total breakdown in Canadian Dollars (CAD)
   */
  static calculateOrderSummary(
    items: CartItem[],
    distanceKm: number,
    fulfillment: FulfillmentType,
    driverTip: number = 0.00
  ) {
    const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
    const deliveryFee = this.calculateDeliveryFee(distanceKm, fulfillment);
    const taxableAmount = subtotal + deliveryFee;

    const tpsTax = Number((taxableAmount * QUEBEC_TAXES.TPS_RATE).toFixed(2));
    const tvqTax = Number((taxableAmount * QUEBEC_TAXES.TVQ_RATE).toFixed(2));
    const total = Number((taxableAmount + tpsTax + tvqTax + driverTip).toFixed(2));

    return {
      subtotal,
      deliveryFee,
      tpsTax,
      tvqTax,
      driverTip,
      total,
      currency: 'CAD',
    };
  }

  /**
   * Generates a 4-digit confirmation PIN for customer pickup & delivery verification
   */
  static generateSecurityPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Builds the formatted QR Code string
   */
  static generateQrPayload(orderNumber: string, pin: string): string {
    return `LMDW-${orderNumber}-PIN${pin}`;
  }
}
