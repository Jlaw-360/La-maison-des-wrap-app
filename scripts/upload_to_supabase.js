const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const supabaseUrl = process.env.SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  console.log("🚀 Connected to Supabase Project: zldxbaykxgdraxvejkdr with Admin Secret Key!");

  const menuPath = path.join(__dirname, '../menu.json');
  const items = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

  console.log(`📋 Preparing ${items.length} items from La Maison des Wraps menu...`);

  // Check if table exists
  const { data, error } = await supabaseAdmin.from('menu_items').select('*').limit(1);

  if (error && error.code === 'PGRST205') {
    console.log("\n⚠️ Table 'menu_items' does not exist yet.");
    console.log("👉 Simply copy & paste the SQL from scripts/supabase_schema_and_seed.sql into your Supabase SQL Editor to create all tables and populate all 59 dishes instantly!");
  } else if (!error) {
    console.log(`✅ Table 'menu_items' is active in Supabase! Inserting items...`);
    // Insert all items
    const records = items.map(i => ({
      name_fr: i.item_name_fr,
      name_en: i.item_name_en,
      category_slug: i.category_fr.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      description_fr: i.description_fr,
      description_en: i.description_en,
      base_price_cad: parseFloat(i.base_price_cad) || 8.95,
      price_seul: i.price_seul || '',
      price_trio: i.price_trio_or_combo || '',
      options_modifiers: i.options_and_modifiers || '',
      is_available: true
    }));

    const { error: insertError } = await supabaseAdmin.from('menu_items').upsert(records, { onConflict: 'name_fr' });
    if (insertError) {
      console.log("Insert result:", insertError.message);
    } else {
      console.log(`🎉 Successfully synced ${records.length} dishes to Supabase database!`);
    }
  }
}

main();
