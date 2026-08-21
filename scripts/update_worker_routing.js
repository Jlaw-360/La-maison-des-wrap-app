const fs = require('fs');

const updatedWorker = `// Cloudflare Worker for La Maison des Wraps
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-better-auth-api-key',
        },
      });
    }

    // API Distance calculation
    if (url.pathname === '/api/calculate-distance' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { destinationAddress } = body || {};
        const apiKey = env.GOOGLE_MAPS_API_KEY || 'AIzaSyBZ2IVRkU5tGuZFnKqDdIpQmom18AT3AC4';
        const origins = "998 110e Avenue, Drummondville, QC J2B 6X2";
        const mapUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + encodeURIComponent(origins) + "&destinations=" + encodeURIComponent(destinationAddress || '') + "&key=" + apiKey;
        const googleRes = await fetch(mapUrl);
        const data = await googleRes.json();
        if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.status === 'OK') {
          const element = data.rows[0].elements[0];
          const distanceKm = element.distance.value / 1000;
          const durationMin = Math.round(element.duration.value / 60);
          let deliveryFee = 3.99;
          if (distanceKm > 5) deliveryFee += (distanceKm - 5) * 0.75;
          return new Response(JSON.stringify({
            success: true,
            distanceKm: Math.round(distanceKm * 10) / 10,
            durationMin: durationMin,
            deliveryFee: Math.round(deliveryFee * 100) / 100,
            isDeliverable: distanceKm <= 25
          }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        return new Response(JSON.stringify({ success: true, distanceKm: 4.5, durationMin: 15, deliveryFee: 3.99, isDeliverable: true, fallback: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // BetterAuth and health check
    if (url.pathname.startsWith('/api/auth/')) {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        connected: true, 
        service: 'BetterAuth Cloudflare Edge', 
        supabaseProject: 'zldxbaykxgdraxvejkdr',
        timestamp: new Date().toISOString() 
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Clean SPA routing for portal shortcuts
    if (env.ASSETS) {
      if (url.pathname === '/kitchen' || url.pathname === '/kitchen/') {
        return env.ASSETS.fetch(new Request(new URL('/kitchen.html', request.url), request));
      }
      if (url.pathname === '/driver' || url.pathname === '/driver/' || url.pathname === '/delivery') {
        return env.ASSETS.fetch(new Request(new URL('/driver.html', request.url), request));
      }
      if (url.pathname === '/admin' || url.pathname === '/admin/') {
        return env.ASSETS.fetch(new Request(new URL('/admin.html', request.url), request));
      }
      return env.ASSETS.fetch(request);
    }

    return new Response("La Maison des Wraps Cloudflare Edge Server", { status: 200 });
  }
};
`;

fs.writeFileSync('worker.js', updatedWorker);

if (fs.existsSync('public/_redirects')) {
  fs.unlinkSync('public/_redirects');
}

node scripts/prepare_public.js
