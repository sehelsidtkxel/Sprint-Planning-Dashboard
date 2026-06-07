"use client";

import { useState } from "react";
import DashboardStats from "./DashboardStats";
import StreamTabs from "./StreamTabs";
import TaskTable from "./TaskTable";
import PublicBacklog from "./PublicBacklog";

export default function DashboardClient({
  streams,
  tasks,
  backlogItems,
}: {
  streams: any[];
  tasks: any[];
  backlogItems: any[];
}) {
  const [selectedStream, setSelectedStream] = useState("all");

  const filteredTasks =
    selectedStream === "all" || selectedStream === "backlog"
      ? tasks
      : tasks.filter((task) => task.stream_id === selectedStream);

  return (
    <>
      {selectedStream !== "backlog" && (
        <DashboardStats tasks={filteredTasks} />
      )}

      <StreamTabs
        streams={streams}
        selectedStream={selectedStream}
        onSelectStream={setSelectedStream}
      />

      {selectedStream === "backlog" ? (
        <PublicBacklog backlogItems={backlogItems} />
      ) : (
        <TaskTable tasks={filteredTasks} />
      )}
    </>
  );
}