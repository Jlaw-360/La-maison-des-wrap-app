import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface MenuItem {
  id: string;
  name_fr: string;
  name_en: string;
  category_slug: string;
  description_fr: string;
  description_en: string;
  base_price_cad: number;
  price_seul: string;
  price_trio: string;
  options_modifiers: string;
  is_available: boolean;
}

export function useMenuItems(category?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDishes() {
      setLoading(true);
      let query = supabase.from('menu_items').select('*').eq('is_available', true);
      
      if (category && category !== 'all') {
        query = query.eq('category_slug', category);
      }

      const { data, error: fetchErr } = await query;
      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }

    fetchDishes();
  }, [category]);

  return { items, loading, error };
}
