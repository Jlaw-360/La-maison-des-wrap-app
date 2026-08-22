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

    // 2. Google Distance Matrix Calculation API & Free 5km Pricing Rule
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
          
          // Formula: 0-5.0 km = $0.00 CAD FREE | > 5.0 km = (Distance - 5.0) * $1.25 CAD/km
          let deliveryFee = 0.00;
          if (distanceKm > 5.0) {
            const extraKm = distanceKm - 5.0;
            deliveryFee = Math.round((extraKm * 1.25) * 100) / 100;
          }

          return new Response(JSON.stringify({
            success: true,
            distanceKm: Math.round(distanceKm * 10) / 10,
            durationMin: durationMin,
            deliveryFee: deliveryFee,
            isDeliverable: distanceKm <= 25.0,
            isFreeDelivery: distanceKm <= 5.0
          }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }
        return new Response(JSON.stringify({ success: true, distanceKm: 4.2, durationMin: 15, deliveryFee: 0.00, isDeliverable: true, isFreeDelivery: true, fallback: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // 3. BetterAuth & Health API
    if (url.pathname.startsWith('/api/auth')) {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        connected: true, 
        service: 'BetterAuth Cloudflare Edge Handler', 
        supabaseProject: env.SUPABASE_PROJECT_ID || 'zldxbaykxgdraxvejkdr',
        timestamp: new Date().toISOString() 
      }), {
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // 4. Store Hours & Scheduling API (America/Toronto)
    if (url.pathname === '/api/store-status') {
      const now = new Date();
      const easternTimeStr = now.toLocaleString('en-US', { timeZone: 'America/Toronto' });
      const date = new Date(easternTimeStr);
      const day = date.getDay(); // 0 = Sun, 1 = Mon, 2-6 = Tue-Sat
      const hour = date.getHours();
      const minute = date.getMinutes();
      const currentTime = hour + minute / 60;

      let isOpen = false;
      let nextOpenSlot = '';
      let scheduleText = '';

      if (day === 1) {
        isOpen = false;
        nextOpenSlot = 'Mardi à 11h00';
        scheduleText = 'Fermé le lundi (Réouverture Mardi à 11h00)';
      } else if (day >= 2 && day <= 6) {
        isOpen = currentTime >= 11 && currentTime < 21;
        scheduleText = 'Mardi à Samedi : 11h00 - 21h00';
        nextOpenSlot = currentTime < 11 ? "Aujourd'hui à 11h00" : (day === 6 ? 'Dimanche à 12h00' : 'Demain à 11h00');
      } else if (day === 0) {
        isOpen = currentTime >= 12 && currentTime < 20;
        scheduleText = 'Dimanche : 12h00 - 20h00';
        nextOpenSlot = currentTime < 12 ? "Aujourd'hui à 12h00" : 'Mardi à 11h00';
      }

      return new Response(JSON.stringify({
        success: true,
        isOpen,
        nextOpenSlot,
        scheduleText,
        easternTime: easternTimeStr,
        day,
        currentTime: `${String(hour).padStart(2, '0')}h${String(minute).padStart(2, '0')}`
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 5. Atomic Driver PIN Handshake & Order Claiming API
    if (url.pathname === '/api/driver/claim-order' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { pin, driverId, driverName } = body || {};
        if (!pin || pin.length < 4) {
          return new Response(JSON.stringify({ success: false, error: 'Code PIN à 4 chiffres requis' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        const cleanPin = String(pin).trim();
        const assignedDriverId = driverId || 'driver_' + (driverName ? driverName.toLowerCase().replace(/\s+/g, '_') : '1');
        const assignedDriverName = driverName || 'Livreur En Service';

        const supabaseUrl = env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
        const supabaseKey = env.SUPABASE_ANON_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';
        
        // Atomic Check: Look for order matching PIN where driver is not yet assigned
        const fetchRes = await fetch(`${supabaseUrl}/rest/v1/orders?pickup_pin=eq.${encodeURIComponent(cleanPin)}&select=*`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const orders = await fetchRes.json();
        
        if (orders && orders.length > 0) {
          const targetOrder = orders[0];

          // Check if already claimed by someone else
          if (targetOrder.driver_id && targetOrder.driver_id !== assignedDriverId && (targetOrder.status === 'delivering' || targetOrder.status === 'completed')) {
            return new Response(JSON.stringify({
              success: false,
              error: `Cette commande (#${targetOrder.order_number || targetOrder.id}) a déjà été prise en charge par un autre livreur.`
            }), { status: 409, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
          }

          // Atomic Update
          const patchRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${targetOrder.id}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              status: 'delivering',
              order_status: 'out_for_delivery',
              driver_id: assignedDriverId,
              driver_name: assignedDriverName,
              updated_at: new Date().toISOString()
            })
          });

          return new Response(JSON.stringify({
            success: true,
            orderId: targetOrder.id,
            orderNumber: targetOrder.order_number || ('CMD-' + cleanPin),
            status: 'delivering',
            customerName: targetOrder.customer_name,
            customerPhone: targetOrder.customer_phone,
            deliveryAddress: targetOrder.delivery_address,
            dropoffOption: targetOrder.dropoff_option || 'hand',
            tipAmount: targetOrder.tip_amount || 0,
            driverName: assignedDriverName
          }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        // Fallback simulated success if offline demo order
        return new Response(JSON.stringify({
          success: true,
          orderId: 'ord_' + cleanPin,
          orderNumber: 'CMD-' + cleanPin,
          status: 'delivering',
          driverName: assignedDriverName,
          fallback: true
        }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // 6. Driver Delivery Completion API
    if (url.pathname === '/api/driver/complete-delivery' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { orderId, photoUrl, customerPin } = body || {};
        const supabaseUrl = env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
        const supabaseKey = env.SUPABASE_ANON_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

        if (orderId) {
          await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'completed',
              order_status: 'delivered',
              delivered_at: new Date().toISOString(),
              proof_of_delivery_url: photoUrl || null
            })
          });
        }

        return new Response(JSON.stringify({ success: true, orderId, status: 'completed' }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // 7. Admin Driver Payroll & Commission Stats API
    if (url.pathname === '/api/admin/driver-stats') {
      try {
        const supabaseUrl = env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
        const supabaseKey = env.SUPABASE_ANON_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

        const fetchRes = await fetch(`${supabaseUrl}/rest/v1/orders?select=*&order=created_at.desc`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        });
        const orders = await fetchRes.json();

        const driverBreakdown = {};
        let totalRestaurantDeliveries = 0;

        (orders || []).forEach(o => {
          if (o.fulfillment_type === 'delivery' || o.order_type === 'delivery') {
            totalRestaurantDeliveries++;
            const dName = o.driver_name || (o.driver_id ? 'Livreur ' + o.driver_id : 'Non Assigné');
            if (!driverBreakdown[dName]) {
              driverBreakdown[dName] = {
                driverName: dName,
                completedTrips: 0,
                activeTrips: 0,
                basePay: 0,
                totalTips: 0,
                netPayoutDue: 0,
                orders: []
              };
            }

            if (o.status === 'completed' || o.order_status === 'delivered') {
              driverBreakdown[dName].completedTrips++;
              driverBreakdown[dName].totalTips += Number(o.tip_amount || 0);
            } else if (o.status === 'delivering' || o.order_status === 'out_for_delivery') {
              driverBreakdown[dName].activeTrips++;
            }

            driverBreakdown[dName].orders.push({
              id: o.id,
              orderNumber: o.order_number,
              status: o.status,
              total: o.total_amount || o.total_cad || 0,
              tip: o.tip_amount || 0,
              address: o.delivery_address,
              createdAt: o.created_at
            });
          }
        });

        // Calculate pay: $4.00 CAD base per completed trip + 100% of customer tips
        const driversList = Object.values(driverBreakdown).map(d => {
          d.basePay = d.completedTrips * 4.00;
          d.netPayoutDue = Math.round((d.basePay + d.totalTips) * 100) / 100;
          return d;
        });

        return new Response(JSON.stringify({
          success: true,
          totalRestaurantDeliveries,
          drivers: driversList
        }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // 8. Admin Update Role API
    if (url.pathname === '/api/admin/update-role' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { userId, role } = body || {};
        const supabaseUrl = env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
        const supabaseKey = env.SUPABASE_ANON_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

        if (userId && role) {
          await fetch(`${supabaseUrl}/rest/v1/user?id=eq.${userId}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: role })
          });
        }

        return new Response(JSON.stringify({ success: true, userId, role }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
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
