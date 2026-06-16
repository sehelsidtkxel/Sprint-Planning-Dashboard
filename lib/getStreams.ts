import { supabase } from "./supabase";

export async function getStreams() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("streams")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}