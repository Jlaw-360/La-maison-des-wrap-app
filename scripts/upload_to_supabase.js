const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://zldxbaykxgdraxvejkdr.supabase.co';
const supabaseKey = 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncMenuToSupabase() {
  console.log("🚀 Connecting to Supabase Project: zldxbaykxgdraxvejkdr...");

  const menuPath = path.join(__dirname, '../menu.json');
  if (!fs.existsSync(menuPath)) {
    console.error("❌ menu.json not found!");
    return;
  }

  const rawData = fs.readFileSync(menuPath, 'utf8');
  const items = JSON.parse(rawData);

  console.log(`📋 Found ${items.length} dishes in menu.json to sync.`);

  // Verify connection by attempting to read from menu_items
  const { data, error } = await supabase.from('menu_items').select('*').limit(1);

  if (error) {
    console.log("ℹ️ Note: If tables are not yet created in Supabase, run the SQL script in your Supabase SQL Editor:");
    console.log("👉 File: scripts/supabase_schema_and_seed.sql");
    console.log("Error details:", error.message);
  } else {
    console.log("✅ Supabase connection successful! Current items in database:", data.length);
  }
}

syncMenuToSupabase();
