-- Adds an optional target date to backlog items.
-- Non-destructive: existing rows get NULL and no data is changed.
alter table public.backlog_items
  add column if not exists target_date date;
