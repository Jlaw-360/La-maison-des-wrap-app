const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { amount, currency = 'cad', orderId, customerEmail } = req.body || {};
    const amountInCents = Math.round((amount || 15.00) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
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
