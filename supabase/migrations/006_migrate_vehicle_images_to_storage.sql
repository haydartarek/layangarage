-- Final vehicle image storage state.
-- Existing car photos were uploaded to Supabase Storage bucket `vehicle-images`
-- under `vehicles/<vehicle-slug>/<filename>`.
-- The bucket is public for direct image URLs, but object listing is restricted to admins.

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'buckets'
      and policyname = 'Public can read vehicle image bucket'
  ) then
    create policy "Public can read vehicle image bucket"
    on storage.buckets
    for select
    to public
    using (id = 'vehicle-images');
  end if;
end $$;

drop policy if exists "Public can read vehicle storage objects" on storage.objects;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Vehicle admins can read storage objects'
  ) then
    create policy "Vehicle admins can read storage objects"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'vehicle-images'
      and exists (
        select 1
        from public.admin_users
        where user_id = (select auth.uid())
          and role in ('owner', 'admin')
      )
    );
  end if;
end $$;

update public.vehicle_images
set storage_path = regexp_replace(storage_path, '^assets/images/cars/([^/]+)/(.+)$', 'vehicles/\1/\2')
where storage_path like 'assets/images/cars/%';
