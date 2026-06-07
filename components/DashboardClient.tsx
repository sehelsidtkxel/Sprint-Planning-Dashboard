"use client";
import DashboardStats from "./DashboardStats";
import { useState } from "react";
import StreamTabs from "./StreamTabs";
import TaskTable from "./TaskTable";

export default function DashboardClient({
  streams,
  tasks,
}: {
  streams: any[];
  tasks: any[];
}) {
  const [selectedStream, setSelectedStream] = useState("all");

  const filteredTasks =
    selectedStream === "all"
      ? tasks
      : tasks.filter((task) => task.stream_id === selectedStream);

  return (
    
    
    <>
    <DashboardStats tasks={filteredTasks} />
      <StreamTabs
        streams={streams}
        selectedStream={selectedStream}
        onSelectStream={setSelectedStream}
      />

      <TaskTable tasks={filteredTasks} />
    </>
  );
}