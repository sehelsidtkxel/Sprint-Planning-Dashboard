import { supabase } from "./supabase";

export async function getSprintsFromSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

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
    console.error("Failed to load sprints:", error.message);
    throw new Error(`Failed to load sprints: ${error.message}`);
  }

  return data || [];
}