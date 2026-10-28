/**
 * Parses a "YYYY-MM-DD" (or ISO timestamp) string as a local calendar date.
 * `new Date("2026-11-13")` is parsed as UTC midnight, which shifts the day
 * in timezones behind UTC, so date-only values are built from their parts.
 */
export function parseLocalDate(value?: string | null): Date | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Formats a date-only value as e.g. "13 Nov 2026", or "-" when missing. */
export function formatLocalDate(value?: string | null) {
  const date = parseLocalDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
