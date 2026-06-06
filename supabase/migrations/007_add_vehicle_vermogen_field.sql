-- Add a separate engine power field without changing existing vehicle data.
alter table public.vehicles
  add column if not exists vermogen text not null default '';
