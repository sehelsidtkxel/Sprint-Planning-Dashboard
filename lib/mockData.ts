import { Stream } from "./types";

export const mockData: Stream[] = [
  {
    id: "1",
    name: "TKXL Portal",
    color: "blue",
    sprints: [
      {
        id: "SP1",
        title: "Sprint 1",
        version: "v1.0",
        sprintDates: "June 1 - June 14",
        releaseDate: "June 20",
        status: "In Progress",
        items: [
          {
            id: "1",
            phase: "Development",
            category: "Frontend",
            task: "Create Dashboard",
            feature: "Sprint Planning UI",
            status: "Done"
          },
          {
            id: "2",
            phase: "Integration",
            category: "Backend",
            task: "Google Sheet Sync",
            feature: "Live Updates",
            status: "In Progress"
          }
        ]
      }
    ]
  }
];