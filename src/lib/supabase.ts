import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabase_url || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.supabase_key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createSafeSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = createSafeSupabaseClient();

export function getSupabaseClient() {
  return supabase;
}
