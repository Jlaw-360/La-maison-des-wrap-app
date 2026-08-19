// Netlify Serverless Function for Stripe PaymentIntents (CAD)
// Reads secret key securely from Netlify Environment Variables (never hardcoded in Git)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    const { amountCad, orderId, customerName, customerEmail } = JSON.parse(event.body);

    const amountInCents = Math.round(parseFloat(amountCad) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      description: `Commande ${orderId || 'La Maison des Wraps'} - ${customerName || 'Client'}`,
      payment_method_types: ['card'],
      metadata: {
        orderId: orderId || 'CMD-4092',
        customerName: customerName || 'Client',
        customerEmail: customerEmail || 'client@lamaisondeswraps.ca',
        restaurant: 'La Maison des Wraps (Drummondville)'
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
