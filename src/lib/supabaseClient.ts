import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

export const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const SUPABASE_CONFIG_ERROR =
  'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them in your environment variables.';

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackAnonKey = 'public-anon-key-placeholder';

export const supabase = createClient(
  config.supabaseUrl || fallbackUrl,
  config.supabaseAnonKey || fallbackAnonKey,
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);
