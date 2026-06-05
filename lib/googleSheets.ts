import { SprintTask } from "./types";
import { transformRows } from "./transformData";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1coJDwSGHV6pRaE-oFL1IGYYdU4LsgWozPpIUDdlpGZU/export?format=csv&gid=0";

export async function getSprintTasks(): Promise<SprintTask[]> {
  const response = await fetch(SHEET_URL, {
    cache: "no-store",
  });

  const csv = await response.text();

  const rows = csv
    .trim()
    .split("\n")
    .map((row) =>
      row.split(",").map((cell) =>
        cell.replace(/^"|"$/g, "").trim()
      )
    );

  rows.shift();

  return transformRows(rows);
}