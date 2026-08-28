import { createClient } from '@supabase/supabase-js';

// Supabase Configuration from provided project credentials
export const SUPABASE_URL: string =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  'https://kbggcjvqiepvbtlewwgf.supabase.co';

export const SUPABASE_ANON_KEY: string =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable__e5JtISHiqhu59b8eepmjQ_zCFJ6_lR';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

