const fs = require('fs');

// Update scripts/supabase_schema_and_seed.sql
if (fs.existsSync('scripts/supabase_schema_and_seed.sql')) {
  let sql = fs.readFileSync('scripts/supabase_schema_and_seed.sql', 'utf8');
  
  // Replace policies section
  const oldPolicies = `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public reads for active menu items
CREATE POLICY "Public can view active menu items" ON public.menu_items
  FOR SELECT USING (is_available = true);

-- Allow authenticated users to view & manage their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR ALL USING (true);

-- Allow public reads and inserts for users table
CREATE POLICY "Public user management" ON public.users
  FOR ALL USING (true);`;

  const newPolicies = `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Consolidated Single Permissive Policies (Zero Linter Warnings)
CREATE POLICY "Public can view active menu items" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (is_available = true);

CREATE POLICY "Users can manage orders" ON public.orders
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public user access" ON public.users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_order_chats_order_id ON public.order_chats(order_id);
CREATE INDEX IF NOT EXISTS idx_order_chats_sender_id ON public.order_chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON public.order_items(menu_item_id);`;

  sql = sql.replace(oldPolicies, newPolicies);
  fs.writeFileSync('scripts/supabase_schema_and_seed.sql', sql);
  console.log('Updated scripts/supabase_schema_and_seed.sql');
}

