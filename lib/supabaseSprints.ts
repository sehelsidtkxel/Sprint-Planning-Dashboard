import { supabase } from "./supabase";

export async function getSprintsFromSupabase() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("sprints")
    .select(`
      *,
      streams!sprints_stream_id_fkey (
        id,
        name,
        color
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}