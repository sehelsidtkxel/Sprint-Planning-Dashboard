import { parseLocalDate } from "./dates";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type SprintProgress = {
  percent: number;
  /** Current sprint day (1-based), clamped to the sprint duration. Null when dates are missing. */
  day: number | null;
  totalDays: number | null;
  state: "done" | "not-started" | "active" | "ended" | "no-dates";
};

function daysBetween(from: Date, to: Date) {
  // Math.round absorbs the 1-hour shift on daylight-saving changes.
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

/**
 * Time-based sprint progress. Start and end dates are both inclusive, so a
 * sprint from 28 Oct to 13 Nov has 17 days and is on day 1 (6%) on 28 Oct and
 * day 17 (100%) on 13 Nov. A sprint with status "Done" is always 100%.
 */
export function getSprintProgress(
  sprint: { start_date?: string | null; end_date?: string | null; status?: string | null },
  today: Date = new Date()
): SprintProgress {
  const start = parseLocalDate(sprint.start_date);
  const end = parseLocalDate(sprint.end_date);

  const isDone = sprint.status === "Done";

  if (!start || !end) {
    return {
      percent: isDone ? 100 : 0,
      day: null,
      totalDays: null,
      state: isDone ? "done" : "no-dates",
    };
  }

  const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const totalDays = Math.max(daysBetween(start, end) + 1, 1);
  const rawDay = daysBetween(start, currentDay) + 1;
  const elapsedDays = Math.min(Math.max(rawDay, 0), totalDays);

  const percent = isDone ? 100 : Math.round((elapsedDays / totalDays) * 100);

  const state = isDone
    ? "done"
    : rawDay < 1
      ? "not-started"
      : rawDay > totalDays
        ? "ended"
        : "active";

  return { percent, day: elapsedDays, totalDays, state };
}

export function getProgressLabel({ state, day, totalDays }: SprintProgress) {
  switch (state) {
    case "done":
      return "Completed";
    case "no-dates":
      return "Dates not set";
    case "not-started":
      return `Not started · ${totalDays} days`;
    case "ended":
      return `Ended · ${totalDays} days`;
    default:
      return `Day ${day} of ${totalDays}`;
  }
}
