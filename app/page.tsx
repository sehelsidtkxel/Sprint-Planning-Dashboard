export const dynamic = "force-dynamic";
import DashboardClient from "../components/DashboardClient";

import { getSprintsFromSupabase } from "../lib/supabaseSprints";
import { getStreams } from "../lib/getStreams";
import { getBacklogItems } from "../lib/getBacklogItems";

export default async function HomePage() {
  let tasks: any[] = [];
  let streams: any[] = [];
  let backlogItems: any[] = [];
  let loadError = false;

  try {
    [tasks, streams, backlogItems] = await Promise.all([
      getSprintsFromSupabase(),
      getStreams(),
      getBacklogItems(),
    ]);
  } catch {
    // Details are logged by the loaders; the page shows a friendly message.
    loadError = true;
  }

  return (
    <DashboardClient
      streams={streams}
      tasks={tasks}
      backlogItems={backlogItems}
      loadError={loadError}
    />
  );
}
