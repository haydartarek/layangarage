-- Adds the confirmed Supabase Auth user to the vehicle admin allowlist.
-- This assumes the Auth user already exists.

insert into public.admin_users (user_id, email, role)
select id, email, 'owner'
from auth.users
where lower(email) = lower('ahmedpower1990@gmail.com')
on conflict (user_id) do update set
  email = excluded.email,
  role = 'owner';
