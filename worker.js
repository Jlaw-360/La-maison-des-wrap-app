// Cloudflare Edge Worker for La Maison des Wraps
// Dual-Mode Routing: Supports both path-based and subdomain routing

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // 1. CORS Preflight
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

    // 2. Google Distance Matrix Calculation API
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

    // 3. BetterAuth & Health API
    if (url.pathname.startsWith('/api/auth/')) {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        connected: true, 
        service: 'BetterAuth Cloudflare Edge', 
        supabaseProject: env.SUPABASE_PROJECT_ID || 'zldxbaykxgdraxvejkdr',
        timestamp: new Date().toISOString() 
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 4. Subdomain-based Routing (admin.lamaisondeswraps.ca, kitchen.*, driver.*)
    let targetPath = url.pathname;

    if (host.startsWith('admin.')) {
      targetPath = targetPath === '/' ? '/admin.html' : targetPath;
    } else if (host.startsWith('kitchen.')) {
      targetPath = targetPath === '/' ? '/kitchen.html' : targetPath;
    } else if (host.startsWith('driver.') || host.startsWith('drive.')) {
      targetPath = targetPath === '/' ? '/driver.html' : targetPath;
    }

    // 5. Path-based Routing & Static Asset Serving
    if (env.ASSETS) {
      // Direct Portal Paths
      if (targetPath === '/kitchen' || targetPath === '/kitchen.html' || targetPath === '/kitchen/') {
        return env.ASSETS.fetch(new Request(new URL('/kitchen.html', request.url), request));
      }
      if (targetPath === '/driver' || targetPath === '/driver.html' || targetPath === '/driver/' || targetPath === '/delivery') {
        return env.ASSETS.fetch(new Request(new URL('/driver.html', request.url), request));
      }
      if (targetPath === '/admin' || targetPath === '/admin.html' || targetPath === '/admin/') {
        return env.ASSETS.fetch(new Request(new URL('/admin.html', request.url), request));
      }
      if (targetPath === '/' || targetPath === '' || targetPath === '/index.html') {
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }

      // Fetch static asset
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status === 404) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }
      return assetRes;
    }

    return new Response("La Maison des Wraps Cloudflare Edge Server", { status: 200 });
  }
};
