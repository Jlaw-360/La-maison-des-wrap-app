export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51U18R4EP3Grb2rSSVkDRnkguIJClznmXedbsFP8IjF0tKOyDmXVM3QRKFglXeRcKZnKg1KCJpvgX0Wj4o4hrCdil005JeuJkBg';

export interface StripeCardDetails {
  cardNumber: string;
  expiry: string; // MM/YY
  cvc: string;
  postalCode: string;
  cardholderName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function processStripePayment(
  amountCad: number,
  card: StripeCardDetails
): Promise<PaymentResult> {
  try {
    // Basic format validation
    const cleanNum = card.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 16) {
      return { success: false, error: 'Numéro de carte invalide (16 chiffres requis).' };
    }
    if (!card.expiry || !card.expiry.includes('/')) {
      return { success: false, error: 'Date d\'expiration invalide (format MM/AA requis).' };
    }
    if (!card.cvc || card.cvc.length < 3) {
      return { success: false, error: 'Code de sécurité (CVC) invalide.' };
    }

    // Simulate instant secure Stripe authorization & tokenization
    await new Promise((resolve) => setTimeout(resolve, 800));

    const txnId = 'txn_stripe_' + Math.random().toString(36).substring(2, 12).toUpperCase();
    return {
      success: true,
      transactionId: txnId,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Échec du traitement du paiement par carte.',
    };
  }
}
