import { supabase } from "./supabase";

export async function getStreams() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("streams")
    .select("*")
    .order("name");

  if (error) {
    console.error("Failed to load streams:", error.message);
    throw new Error(`Failed to load streams: ${error.message}`);
  }

  return data || [];
}