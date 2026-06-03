-- Final RLS hardening after initial schema creation.
-- Removes public storage listing, removes SECURITY DEFINER helper exposure,
-- and optimizes auth.uid() calls with initplan-friendly select wrappers.

drop policy if exists "Public can read vehicle images" on storage.objects;
drop policy if exists "Admins can upload vehicle images" on storage.objects;
drop policy if exists "Admins can update vehicle images" on storage.objects;
drop policy if exists "Admins can delete vehicle images" on storage.objects;
drop policy if exists "Vehicle admins can upload storage objects" on storage.objects;
drop policy if exists "Vehicle admins can update storage objects" on storage.objects;
drop policy if exists "Vehicle admins can delete storage objects" on storage.objects;

drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Admin users can read own role" on public.admin_users;
drop policy if exists "Public can read visible vehicles" on public.vehicles;
drop policy if exists "Vehicles readable when visible or admin" on public.vehicles;
drop policy if exists "Admins can insert vehicles" on public.vehicles;
drop policy if exists "Vehicle admins can insert vehicles" on public.vehicles;
drop policy if exists "Admins can update vehicles" on public.vehicles;
drop policy if exists "Vehicle admins can update vehicles" on public.vehicles;
drop policy if exists "Admins can delete vehicles" on public.vehicles;
drop policy if exists "Vehicle admins can delete vehicles" on public.vehicles;
drop policy if exists "Public can read features for visible vehicles" on public.vehicle_features;
drop policy if exists "Vehicle features readable when vehicle visible or admin" on public.vehicle_features;
drop policy if exists "Admins can manage features" on public.vehicle_features;
drop policy if exists "Vehicle admins can insert features" on public.vehicle_features;
drop policy if exists "Vehicle admins can update features" on public.vehicle_features;
drop policy if exists "Vehicle admins can delete features" on public.vehicle_features;
drop policy if exists "Public can read images for visible vehicles" on public.vehicle_images;
drop policy if exists "Vehicle images readable when vehicle visible or admin" on public.vehicle_images;
drop policy if exists "Admins can manage images" on public.vehicle_images;
drop policy if exists "Vehicle admins can insert images" on public.vehicle_images;
drop policy if exists "Vehicle admins can update images" on public.vehicle_images;
drop policy if exists "Vehicle admins can delete images" on public.vehicle_images;

create policy "Admin users can read own role"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Vehicles readable when visible or admin"
on public.vehicles for select
to anon, authenticated
using (
  is_visible = true
  or exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
      and role in ('owner', 'admin')
  )
);

create policy "Vehicle admins can insert vehicles"
on public.vehicles for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can update vehicles"
on public.vehicles for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can delete vehicles"
on public.vehicles for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle features readable when vehicle visible or admin"
on public.vehicle_features for select
to anon, authenticated
using (
  exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_features.vehicle_id
      and (
        vehicles.is_visible = true
        or exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin'))
      )
  )
);

create policy "Vehicle admins can insert features"
on public.vehicle_features for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can update features"
on public.vehicle_features for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can delete features"
on public.vehicle_features for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle images readable when vehicle visible or admin"
on public.vehicle_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and (
        vehicles.is_visible = true
        or exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin'))
      )
  )
);

create policy "Vehicle admins can insert images"
on public.vehicle_images for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can update images"
on public.vehicle_images for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can delete images"
on public.vehicle_images for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can upload storage objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'vehicle-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can update storage objects"
on storage.objects for update
to authenticated
using (bucket_id = 'vehicle-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')))
with check (bucket_id = 'vehicle-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

create policy "Vehicle admins can delete storage objects"
on storage.objects for delete
to authenticated
using (bucket_id = 'vehicle-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('owner', 'admin')));

drop function if exists public.is_vehicle_admin();
