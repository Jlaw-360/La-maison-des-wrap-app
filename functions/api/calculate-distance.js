export async function onRequestPost(context) {
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
