export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { amount, currency = 'cad', orderId, customerEmail } = body || {};
    const amountInCents = Math.round((amount || 15.00) * 100);
    const stripeKey = env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY_TEST;

    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe secret key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Direct Stripe API call on Edge (Zero dependencies required)
    const params = new URLSearchParams();
    params.append('amount', amountInCents.toString());
    params.append('currency', currency.toLowerCase());
    params.append('automatic_payment_methods[enabled]', 'true');
    params.append('metadata[orderId]', orderId || ("CMD-" + Date.now()));
    params.append('metadata[restaurant]', 'La Maison des Wraps Drummondville');
    params.append('metadata[customerEmail]', customerEmail || 'guest@lamaisondeswraps.ca');

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const intentData = await stripeRes.json();

    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: intentData.error?.message || 'Stripe error' }), {
        status: stripeRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return new Response(JSON.stringify({
      clientSecret: intentData.client_secret,
      id: intentData.id
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
