"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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

  const selectedStreamId = String(selectedStream);
  const selectedStreamMeta = streams.find(
    (stream) => String(stream.id) === selectedStreamId
  );

  const filteredTasks =
    selectedStreamId === "all" || selectedStreamId === "backlog"
      ? tasks
      : tasks.filter(
          (task) =>
            String(task.stream_id) === selectedStreamId ||
            String(task.streams?.id) === selectedStreamId ||
            (selectedStreamMeta &&
              task.streams?.name === selectedStreamMeta.name)
        );

  const searchedTasks = filteredTasks.filter((task) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

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
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      item.title?.toLowerCase().includes(query) ||
      item.details?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query) ||
      item.streams?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header search={search} onSearchChange={setSearch} />

      <UpcomingReleaseHero tasks={tasks} />

      {selectedStream !== "backlog" && (
        <Box sx={{ width: "100%" }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 0 }}>
            <DashboardStats tasks={searchedTasks} />
          </Container>
          <Box sx={{ width: "100%", height: "1px", bgcolor: "#cbd5e1" }} />
        </Box>
      )}

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, pt: 3, pb: 3 }}>
        <StreamTabs
          streams={streams}
          tasks={tasks}
          backlogCount={backlogItems.length}
          selectedStream={selectedStream}
          onSelectStream={setSelectedStream}
        />

        {selectedStream === "backlog" ? (
          <PublicBacklog backlogItems={searchedBacklog} />
        ) : (
          <TaskTable tasks={searchedTasks} />
        )}
      </Container>
    </Box>
  );
}
