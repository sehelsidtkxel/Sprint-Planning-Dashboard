import Header from "../components/Header";
import DashboardClient from "../components/DashboardClient";

import { getSprintsFromSupabase } from "../lib/supabaseSprints";
import { getStreams } from "../lib/getStreams";
import { getBacklogItems } from "../lib/getBacklogItems";

export default async function HomePage() {
  const tasks = await getSprintsFromSupabase();
  const streams = await getStreams();
  const backlogItems = await getBacklogItems();

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <DashboardClient
          streams={streams}
          tasks={tasks}
          backlogItems={backlogItems}
        />
      </div>
    </main>
  );
}