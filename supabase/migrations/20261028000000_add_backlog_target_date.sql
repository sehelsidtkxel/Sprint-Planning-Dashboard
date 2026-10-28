-- Adds an optional release date to backlog items (shown as "Release Date" in the UI).
-- Non-destructive: existing rows get NULL and no data is changed.
alter table public.backlog_items
  add column if not exists target_date date;
