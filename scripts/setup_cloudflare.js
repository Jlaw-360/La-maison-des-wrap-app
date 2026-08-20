const fs = require('fs');
const path = require('path');

console.log("Setting up Cloudflare Pages configuration...");

// 1. Create _redirects for Cloudflare Pages SPA Routing
const redirectsContent = `/kitchen /kitchen.html 200
/driver /driver.html 200
/delivery /driver.html 200
/admin /admin.html 200
/order /index.html 200
/menu /index.html 200
/scan /index.html 200
/chat /index.html 200
/profile /index.html 200
`;
fs.writeFileSync('_redirects', redirectsContent);
console.log('Created _redirects');

// 2. Create _headers for Cloudflare Pages Security & CORS
const headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Access-Control-Allow-Origin: *
`;
fs.writeFileSync('_headers', headersContent);
console.log('Created _headers');

// 3. Create Cloudflare Pages Functions in /functions/api/
if (!fs.existsSync('functions/api')) {
  fs.mkdirSync('functions/api', { recursive: true });
}

// Distance calculator function for Cloudflare
const distanceFunc = `export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { destinationAddress } = body || {};
    
    // Store origin: 998 110e Avenue, Drummondville, QC J2B 6X2
    const RESTAURANT_COORDS = { lat: 45.8824, lng: -72.4842 };
    
    if (!destinationAddress) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Adresse requise' 
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 400
      });
    }

    const apiKey = env.GOOGLE_MAPS_API_KEY || 'AIzaSyBZ2IVRkU5tGuZFnKqDdIpQmom18AT3AC4';
    const origins = "998 110e Avenue, Drummondville, QC J2B 6X2";
    const url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + encodeURIComponent(origins) + "&destinations=" + encodeURIComponent(destinationAddress) + "&key=" + apiKey;

    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      const distanceKm = element.distance.value / 1000;
      const durationMin = Math.round(element.duration.value / 60);

      // Dynamic Delivery Fee Calculation
      let deliveryFee = 3.99;
      if (distanceKm > 5) {
        deliveryFee += (distanceKm - 5) * 0.75;
      }
      deliveryFee = Math.round(deliveryFee * 100) / 100;

      return new Response(JSON.stringify({
        success: true,
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMin: durationMin,
        deliveryFee: deliveryFee,
        isDeliverable: distanceKm <= 25
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Default fallback Drummondville local rate
    return new Response(JSON.stringify({
      success: true,
      distanceKm: 4.5,
      durationMin: 15,
      deliveryFee: 3.99,
      isDeliverable: true,
      fallback: true
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 500
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
`;
fs.writeFileSync('functions/api/calculate-distance.js', distanceFunc);
console.log('Created functions/api/calculate-distance.js');

// Stripe payment intent for Cloudflare Pages
const stripeFunc = `export async function onRequestPost(context) {
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
`;
fs.writeFileSync('functions/api/create-payment-intent.js', stripeFunc);
console.log('Created functions/api/create-payment-intent.js');

// Add Cloudflare deploy script in package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['deploy:cloudflare'] = 'wrangler pages deploy . --project-name=la-maison-des-wraps';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('Updated package.json with deploy:cloudflare');
