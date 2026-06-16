import { supabase } from "./supabase";

export async function getBacklogItems() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("backlog_items")
    .select(`
      *,
      streams (
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