import { createBrowserClient } from '@supabase/ssr';
import { config } from '@/lib/config';

/**
 * Browser-side Supabase client.
 * Use this in Client Components ("use client").
 */
export function createClient() {
  return createBrowserClient(
    config.supabaseUrl,
    config.supabaseAnonKey
  );
}
