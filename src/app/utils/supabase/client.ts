import { createClient } from '@supabase/supabase-js';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const configuredAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(configuredUrl && configuredAnonKey);

// Keep public/local development renderable without cloud credentials. Features that
// write cloud data must check supabaseConfigured and expose a clear local state.
export const supabaseUrl = configuredUrl || 'http://127.0.0.1:54321';
const supabaseAnonKey = configuredAnonKey || 'local-preview-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: supabaseConfigured,
    autoRefreshToken: supabaseConfigured,
    detectSessionInUrl: supabaseConfigured,
  },
});
