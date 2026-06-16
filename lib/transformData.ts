import { SprintTask } from "./types";

export function transformRows(rows: string[][]): SprintTask[] {
  return rows.map((row) => ({
    phase: row[0] || "",
    dates: row[1] || "",
    category: row[2] || "",
    resources: row[3] || "",
    task: row[4] || "",
    comments: row[5] || "",
    feature: row[6] || "",
    status: row[7] || "",
  }));
}