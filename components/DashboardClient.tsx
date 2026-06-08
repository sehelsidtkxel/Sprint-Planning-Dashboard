"use client";

import { useState } from "react";
import Header from "./Header";
import DashboardStats from "./DashboardStats";
import StreamTabs from "./StreamTabs";
import TaskTable from "./TaskTable";
import PublicBacklog from "./PublicBacklog";
import UpcomingReleaseHero from "./UpcomingReleaseHero";

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
  const [search, setSearch] = useState("");

  const filteredTasks =
    selectedStream === "all" || selectedStream === "backlog"
      ? tasks
      : tasks.filter((task) => task.stream_id === selectedStream);

  const searchedTasks = filteredTasks.filter((task) => {
    const query = search.toLowerCase();

    return (
      task.title?.toLowerCase().includes(query) ||
      task.phase?.toLowerCase().includes(query) ||
      task.category?.toLowerCase().includes(query) ||
      task.resources?.toLowerCase().includes(query) ||
      task.task?.toLowerCase().includes(query) ||
      task.feature?.toLowerCase().includes(query) ||
      task.comments?.toLowerCase().includes(query) ||
      task.status?.toLowerCase().includes(query) ||
      task.streams?.name?.toLowerCase().includes(query)
    );
  });

  const searchedBacklog = backlogItems.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(query) ||
      item.details?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query) ||
      item.streams?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Header search={search} onSearchChange={setSearch} />

      <UpcomingReleaseHero tasks={tasks} />

      {selectedStream !== "backlog" && (
        <DashboardStats tasks={searchedTasks} />
      )}

      <StreamTabs
        streams={streams}
        selectedStream={selectedStream}
        onSelectStream={setSelectedStream}
      />

      {selectedStream === "backlog" ? (
        <PublicBacklog backlogItems={searchedBacklog} />
      ) : (
        <TaskTable tasks={searchedTasks} />
      )}
    </>
  );
}