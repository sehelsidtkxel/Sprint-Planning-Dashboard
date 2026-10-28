import { supabase } from "./supabase";

export async function getBacklogItems() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

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
    console.error("Failed to load backlog items:", error.message);
    throw new Error(`Failed to load backlog items: ${error.message}`);
  }

  return data || [];
}