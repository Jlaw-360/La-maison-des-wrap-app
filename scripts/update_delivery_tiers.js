const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const seedFile = path.join(__dirname, '../data/firestore_seed_data.json');
const serviceKeyFile = path.join(__dirname, '../serviceAccountKey.json');

const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));

// Update restaurant delivery tiers
seedData.restaurant_info.drummondville_main.delivery_tiers = [
  {
    tier_name: "Zone 1: Coeur de Drummondville (0 - 5 km)",
    min_km: 0.0,
    max_km: 5.0,
    delivery_fee_cad: 0.00,
    label_fr: "LIVRAISON GRATUITE",
    label_en: "FREE DELIVERY",
    min_order_cad: 15.00
  },
  {
    tier_name: "Zone 2: Grand Drummondville & Banlieue (5 - 10 km)",
    min_km: 5.01,
    max_km: 10.0,
    delivery_fee_cad: 4.99,
    label_fr: "Frais de livraison: 4.99$",
    label_en: "Delivery Fee: $4.99",
    min_order_cad: 20.00
  },
  {
    tier_name: "Zone 3: Régions périphériques (10 - 15 km)",
    min_km: 10.01,
    max_km: 15.0,
    delivery_fee_cad: 9.99,
    label_fr: "Frais de livraison: 9.99$",
    label_en: "Delivery Fee: $9.99",
    min_order_cad: 30.00
  },
  {
    tier_name: "Zone 4: Limite Extérieure (15 - 18 km)",
    min_km: 15.01,
    max_km: 18.0,
    delivery_fee_cad: 12.99,
    label_fr: "Frais de livraison longue distance: 12.99$",
    label_en: "Long Distance Delivery Fee: $12.99",
    min_order_cad: 35.00
  }
];

seedData.restaurant_info.drummondville_main.max_delivery_radius_km = 18.0;

// Save to JSON
fs.writeFileSync(seedFile, JSON.stringify(seedData, null, 2), 'utf8');

// Update live Firestore
const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyFile, 'utf8'));
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function updateTiers() {
  console.log("Updating live Firestore delivery tiers for Drummondville...");
  await db.collection('restaurant_info').doc('drummondville_main').update({
    delivery_tiers: seedData.restaurant_info.drummondville_main.delivery_tiers,
    max_delivery_radius_km: 18.0
  });
  console.log("✅ Live Firestore updated with 0-5km Free / 5-10km $4.99 / 10-15km $9.99 pricing tiers!");
  process.exit(0);
}

updateTiers().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
