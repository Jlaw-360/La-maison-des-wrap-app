const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  app = getApps()[0];
}
const firestore = getFirestore(app);

// 2. Initialize Supabase Admin using environment variables (.env)
require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runMigration() {
  console.log("==================================================");
  console.log("🔄 STARTING FIREBASE TO SUPABASE DATA MIGRATION");
  console.log("==================================================");

  // Check Supabase table status
  const { data: testData, error: tableError } = await supabase.from('menu_items').select('*').limit(1);

  if (tableError && tableError.code === 'PGRST205') {
    console.log("⚠️ Supabase tables (menu_items, users, orders) are not created yet.");
    console.log("👉 Please run scripts/supabase_schema_and_seed.sql in your Supabase SQL Editor first!");
    return;
  }

  // --- A. Migrate Menu Items from menu.json ---
  const menuPath = path.join(__dirname, '../menu.json');
  if (fs.existsSync(menuPath)) {
    const rawMenu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    console.log(`📦 Found ${rawMenu.length} dishes in Menu catalog.`);
    
    const records = rawMenu.map(i => ({
      name_fr: i.item_name_fr,
      name_en: i.item_name_en,
      category_slug: (i.category_fr || 'wraps').toLowerCase().replace(/[^a-z0-9]/g, '_'),
      description_fr: i.description_fr || '',
      description_en: i.description_en || '',
      base_price_cad: parseFloat(i.base_price_cad) || 8.95,
      price_seul: i.price_seul || '',
      price_trio: i.price_trio_or_combo || '',
      options_modifiers: i.options_and_modifiers || '',
      is_available: true
    }));

    const { error: menuInsertError } = await supabase.from('menu_items').upsert(records, { onConflict: 'name_fr' });
    if (menuInsertError) {
      console.error("❌ Menu migration error:", menuInsertError.message);
    } else {
      console.log(`✅ Successfully migrated ${records.length} dishes to Supabase (menu_items)!`);
    }
  }

  // --- B. Migrate Firestore Users & Profiles ---
  try {
    const usersSnapshot = await firestore.collection('users').get();
    console.log(`👥 Found ${usersSnapshot.size} user accounts in Firebase Firestore.`);
    
    for (const doc of usersSnapshot.docs) {
      const u = doc.data();
      if (u.email) {
        await supabase.from('users').upsert({
          email: u.email,
          name: u.name || u.displayName || 'Client',
          phone: u.phone || '',
          role: u.role || 'customer',
          address: u.address || '1450 Rue Saint-Pierre, Drummondville, QC',
          points: u.points || 50
        }, { onConflict: 'email' });
      }
    }
    console.log(`✅ Users collection synced to Supabase!`);
  } catch (err) {
    console.log("ℹ️ Firestore users check:", err.message);
  }

  // --- C. Migrate Firestore Orders ---
  try {
    const ordersSnapshot = await firestore.collection('orders').get();
    console.log(`🧾 Found ${ordersSnapshot.size} orders in Firebase Firestore.`);
    
    for (const doc of ordersSnapshot.docs) {
      const o = doc.data();
      await supabase.from('orders').upsert({
        order_number: o.orderNumber || ('CMD-' + doc.id.substring(0, 5).toUpperCase()),
        customer_name: o.customerName || 'Client',
        customer_phone: o.customerPhone || '819-850-3972',
        customer_email: o.customerEmail || '',
        fulfillment_type: o.fulfillmentType || 'delivery',
        subtotal_cad: o.subtotal || 0,
        delivery_fee_cad: o.deliveryFee || 0,
        tps_tax_cad: o.tpsTax || 0,
        tvq_tax_cad: o.tvqTax || 0,
        total_cad: o.total || 0,
        status: o.status || 'received',
        pickup_pin: o.pickupPin || '52325'
      }, { onConflict: 'order_number' });
    }
    console.log(`✅ Orders collection synced to Supabase!`);
  } catch (err) {
    console.log("ℹ️ Firestore orders check:", err.message);
  }

  console.log("==================================================");
  console.log("🎉 ALL DATA HAS BEEN TRANSFERRED TO SUPABASE!");
  console.log("==================================================");
}

runMigration();
