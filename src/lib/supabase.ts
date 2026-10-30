import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Valid URL check
const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

// Graceful client fallback
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SupabaseHealth {
  configured: boolean;
  connected: boolean;
  url: string;
  message: string;
}

export async function checkSupabaseConnection(): Promise<SupabaseHealth> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      url: supabaseUrl || 'Not configured in .env',
      message: 'Supabase credentials missing or using placeholders. Running in synthetic demonstration mode.'
    };
  }

  try {
    const { error } = await supabase.from('departments').select('count', { count: 'exact', head: true });
    if (error) {
      return {
        configured: true,
        connected: false,
        url: supabaseUrl,
        message: `Connected to endpoint, but table query returned: ${error.message}. Please apply database migrations.`
      };
    }
    return {
      configured: true,
      connected: true,
      url: supabaseUrl,
      message: 'Supabase connection established & verified.'
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return {
      configured: true,
      connected: false,
      url: supabaseUrl,
      message: `Failed to reach Supabase: ${msg}`
    };
  }
}

