const Stripe = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY_TEST;
    if (!secretKey) {
      console.warn('STRIPE_SECRET_KEY is not configured in environment variables');
      return res.status(500).json({ error: 'Stripe secret key is not configured' });
    }
    const stripe = new Stripe(secretKey);

    const { amount, currency = 'cad', orderId, customerEmail } = req.body || {};
    const amountInCents = Math.round((amount || 15.00) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: orderId || `CMD-${Date.now()}`,
        restaurant: 'La Maison des Wraps Drummondville',
        customerEmail: customerEmail || 'guest@lamaisondeswraps.ca'
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
