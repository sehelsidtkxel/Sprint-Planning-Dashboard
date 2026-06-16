import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasSupabaseEnv = Boolean(url && key);

if (!hasSupabaseEnv) {
  console.warn(
    "Supabase environment variables are missing. Running with empty dashboard data."
  );
}

export const supabase = hasSupabaseEnv ? createClient(url!, key!) : null;