import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example → .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.',
  );
}

export const supabase = createClient(supabaseUrl as string, supabaseAnon as string);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DryingLog {
  id?: string;
  created_at?: string;
  city: string;
  score: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  advice: string;
  user_id?: string;
}

export interface HomeLocation {
  id?: string;
  user_id: string;
  city: string;
  lat: number;
  lon: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function saveDryingLog(log: Omit<DryingLog, 'id' | 'created_at'>) {
  const { error } = await supabase.from('drying_logs').insert([log]);
  if (error) throw error;
}

export async function fetchRecentLogs(limit = 10) {
  const { data, error } = await supabase
    .from('drying_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as DryingLog[];
}

export async function upsertHomeLocation(loc: Omit<HomeLocation, 'id'>) {
  const { data, error } = await supabase
    .from('home_locations')
    .upsert([loc], { onConflict: 'user_id' })
    .select();
  if (error) throw error;
  return data;
}
