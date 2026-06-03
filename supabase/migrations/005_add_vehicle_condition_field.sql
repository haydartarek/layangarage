alter table public.vehicles
add column if not exists condition text not null default 'used' check (condition in ('new', 'used'));

update public.vehicles
set condition = 'used'
where condition is null;
