export const dynamic = "force-dynamic";
import DashboardClient from "../components/DashboardClient";

import { getSprintsFromSupabase } from "../lib/supabaseSprints";
import { getStreams } from "../lib/getStreams";
import { getBacklogItems } from "../lib/getBacklogItems";

export default async function HomePage() {
  const tasks = await getSprintsFromSupabase();
  const streams = await getStreams();
  const backlogItems = await getBacklogItems();

  return (
    <DashboardClient
      streams={streams}
      tasks={tasks}
      backlogItems={backlogItems}
    />
  );
}