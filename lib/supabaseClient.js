import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zldxbaykxgdraxvejkdr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Ljj5EaZpRUDBuIPvd9Z89Q_A6Gr1qRy';

export const supabase = createClient(supabaseUrl, supabaseKey);
