import { DashboardData } from "./types";

export function transformData(rows: any[]): DashboardData {
  const streams: any[] = [];

  rows.forEach((row) => {
    const streamName = row.get("Stream");
    const sprintName = row.get("Sprint");

    let stream = streams.find(
      (s) => s.name === streamName
    );

    if (!stream) {
      stream = {
        id: streamName,
        name: streamName,
        color: row.get("Color") || "slate",
        sprints: []
      };

      streams.push(stream);
    }

    let sprint = stream.sprints.find(
      (s: any) => s.title === sprintName
    );

    if (!sprint) {
      sprint = {
        id: sprintName,
        title: sprintName,
        version: row.get("Version"),
        sprintDates: row.get("Sprint Dates"),
        releaseDate: row.get("Release Date"),
        releaseStatus: row.get("Release Status"),
        status: row.get("Status"),
        items: []
      };

      stream.sprints.push(sprint);
    }

    sprint.items.push({
      id: crypto.randomUUID(),
      phase: row.get("Phase"),
      category: row.get("Category"),
      resources: row.get("Resources"),
      tasks: row.get("Tasks"),
      features: row.get("Features"),
      impacted: row.get("Impacted"),
      notes: row.get("Notes"),
      status: row.get("Status")
    });
  });

  return {
    lastUpdated: new Date().toISOString(),
    streams
  };
}
