-- Layan Garage BV vehicle inventory schema.
-- Run this in Supabase SQL editor or through Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  brand text not null default '',
  model text not null default '',
  year integer,
  price integer,
  mileage integer,
  fuel_type text not null default '',
  engine text not null default '',
  transmission text not null default '',
  euro_norm text not null default '',
  seats integer,
  condition text not null default 'used' check (condition in ('new', 'used')),
  description text not null default '',
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_features (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  label text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists vehicles_visible_order_idx on public.vehicles (is_visible, display_order, created_at);
create index if not exists vehicle_features_vehicle_order_idx on public.vehicle_features (vehicle_id, display_order);
create index if not exists vehicle_images_vehicle_order_idx on public.vehicle_images (vehicle_id, is_featured desc, display_order);

create or replace function public.is_vehicle_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

alter table public.admin_users enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_features enable row level security;
alter table public.vehicle_images enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
to authenticated
using (public.is_vehicle_admin());

drop policy if exists "Public can read visible vehicles" on public.vehicles;
create policy "Public can read visible vehicles"
on public.vehicles for select
to anon, authenticated
using (is_visible = true or public.is_vehicle_admin());

drop policy if exists "Admins can insert vehicles" on public.vehicles;
create policy "Admins can insert vehicles"
on public.vehicles for insert
to authenticated
with check (public.is_vehicle_admin());

drop policy if exists "Admins can update vehicles" on public.vehicles;
create policy "Admins can update vehicles"
on public.vehicles for update
to authenticated
using (public.is_vehicle_admin())
with check (public.is_vehicle_admin());

drop policy if exists "Admins can delete vehicles" on public.vehicles;
create policy "Admins can delete vehicles"
on public.vehicles for delete
to authenticated
using (public.is_vehicle_admin());

drop policy if exists "Public can read features for visible vehicles" on public.vehicle_features;
create policy "Public can read features for visible vehicles"
on public.vehicle_features for select
to anon, authenticated
using (
  exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_features.vehicle_id
      and (vehicles.is_visible = true or public.is_vehicle_admin())
  )
);

drop policy if exists "Admins can manage features" on public.vehicle_features;
create policy "Admins can manage features"
on public.vehicle_features for all
to authenticated
using (public.is_vehicle_admin())
with check (public.is_vehicle_admin());

drop policy if exists "Public can read images for visible vehicles" on public.vehicle_images;
create policy "Public can read images for visible vehicles"
on public.vehicle_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and (vehicles.is_visible = true or public.is_vehicle_admin())
  )
);

drop policy if exists "Admins can manage images" on public.vehicle_images;
create policy "Admins can manage images"
on public.vehicle_images for all
to authenticated
using (public.is_vehicle_admin())
with check (public.is_vehicle_admin());

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read vehicle images" on storage.objects;
create policy "Public can read vehicle images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'vehicle-images');

drop policy if exists "Admins can upload vehicle images" on storage.objects;
create policy "Admins can upload vehicle images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'vehicle-images' and public.is_vehicle_admin());

drop policy if exists "Admins can update vehicle images" on storage.objects;
create policy "Admins can update vehicle images"
on storage.objects for update
to authenticated
using (bucket_id = 'vehicle-images' and public.is_vehicle_admin())
with check (bucket_id = 'vehicle-images' and public.is_vehicle_admin());

drop policy if exists "Admins can delete vehicle images" on storage.objects;
create policy "Admins can delete vehicle images"
on storage.objects for delete
to authenticated
using (bucket_id = 'vehicle-images' and public.is_vehicle_admin());
