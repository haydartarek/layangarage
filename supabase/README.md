# Layan Garage BV Supabase Setup

Supabase is the production backend for the vehicle admin panel.

## 1. Create The Project

Create one Supabase project for Layan Garage BV.

Copy these values into `js/supabase-config.js`:

```js
window.LayanSupabaseConfig = {
  url: 'https://woilhkvivdtrjxblutei.supabase.co',
  anonKey: 'sb_publishable_CvgLOsD2gPlXDjmWxXSTIA_Akk1kRml',
  storageBucket: 'vehicle-images',
  publicSiteUrl: 'https://layangaragebv.be',
  previewSiteUrl: 'https://haydartarek.github.io/layangarage/'
};
```

Use only the anon key in frontend files.

This project uses the modern publishable key in the `anonKey` config field because Supabase JS accepts publishable keys for browser clients.

Never commit the service role key.

Current project:

```text
Name: Layan Garage BV
Project ref: woilhkvivdtrjxblutei
Region: eu-central-2
Status: ACTIVE_HEALTHY
```

## 2. Run Migrations

Run the SQL files in order:

1. `migrations/001_vehicle_inventory_schema.sql`
2. `migrations/002_seed_current_inventory.sql`
3. `migrations/003_harden_vehicle_rls_policies.sql`
4. `migrations/004_add_owner_admin_user.sql`
5. `migrations/005_add_vehicle_condition_field.sql`
6. `migrations/006_migrate_vehicle_images_to_storage.sql`
7. `migrations/007_add_vehicle_vermogen_field.sql`
8. `migrations/008_backfill_vehicle_vermogen.sql`

The seed migration copies the existing website vehicles into Supabase.

Vehicle images are stored in Supabase Storage:

```text
Bucket: vehicle-images
Path: vehicles/<vehicle-slug>/<filename>
```

The old local `assets/images/cars` folder is no longer part of the website. New images uploaded from the admin panel use Supabase Storage.

## 3. Create Admin User

The owner/admin user has been configured in the live Supabase project.

Current owner:

```text
Email: ahmedpower1990@gmail.com
Role: owner
```

For future environments, create the owner/admin user in Supabase Auth first.

Then add that user to `public.admin_users`.

Example:

```sql
insert into public.admin_users (user_id, email, role)
values (
  'AUTH_USER_UUID_HERE',
  'admin@example.com',
  'owner'
);
```

Only users in `admin_users` can manage vehicles.

## 4. Configure Auth URLs

For testing, allow:

```text
https://haydartarek.github.io/layangarage/admin/login.html
https://haydartarek.github.io/layangarage/admin/dashboard.html
```

Before production launch, add:

```text
https://layangaragebv.be/admin/login.html
https://layangaragebv.be/admin/dashboard.html
```

Review Supabase Auth Site URL and Redirect URLs before launch.

## 5. Verify

Verify:

- Public website loads vehicles from Supabase after config is added.
- Login works.
- Unauthorized users cannot open `admin/dashboard.html`.
- Add/edit/delete vehicle works.
- Image upload works.
- Main image selection works.
- Social text copy works.
