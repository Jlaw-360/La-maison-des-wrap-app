// Vercel Serverless Function for Google Maps Distance Matrix API
// Origin: 998 110e Avenue, Drummondville, QC

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const RESTAURANT_ORIGIN = "998 110e Avenue, Drummondville, QC J2B 6X2";
  const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || "AIzaSyBZ2IVRkU5tGuZFnKqDdIpQmom18AT3AC4";
  const destination = req.query.destination || "1450 Rue Saint-Pierre, Drummondville, QC";

  if (GOOGLE_MAPS_KEY) {
    try {
      const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(RESTAURANT_ORIGIN)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${GOOGLE_MAPS_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.rows && data.rows[0]?.elements[0]?.status === "OK") {
        const distanceMeters = data.rows[0].elements[0].distance.value;
        const distanceKm = parseFloat((distanceMeters / 1000).toFixed(1));
        const durationText = data.rows[0].elements[0].duration.text;
        
        let fee = 0.00;
        if (distanceKm > 5.0 && distanceKm <= 10.0) fee = 4.99;
        else if (distanceKm > 10.0 && distanceKm <= 15.0) fee = 9.99;
        else if (distanceKm > 15.0 && distanceKm <= 18.0) fee = 12.99;

        return res.status(200).json({
          distanceKm,
          durationText,
          deliveryFeeCad: fee,
          origin: RESTAURANT_ORIGIN,
          destination
        });
      }
    } catch (e) {
      console.warn("Google Maps API fallback:", e.message);
    }
  }

  // Fallback calculation
  let distanceKm = 3.5;
  const destLower = (destination || "").toLowerCase();
  if (destLower.includes("majorique") || destLower.includes("saint-cyrille")) distanceKm = 11.5;
  else if (destLower.includes("saint-joseph") || destLower.includes("mercure")) distanceKm = 6.8;
  else if (destLower.includes("saint-pierre") || destLower.includes("110e")) distanceKm = 2.4;

  const fee = distanceKm <= 5.0 ? 0.00 : (distanceKm <= 10.0 ? 4.99 : 9.99);

  return res.status(200).json({
    distanceKm,
    durationText: `${Math.round(distanceKm * 2.5)} min`,
    deliveryFeeCad: fee,
    origin: RESTAURANT_ORIGIN,
    destination
  });
};
