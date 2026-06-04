# Layan Garage BV - Production Deployment Plan

This document defines the production deployment process for the new Layan Garage BV website.

Project path:

```text
D:\layan_garage
```

Production domain:

```text
https://layangaragebv.be
```

Current temporary preview:

```text
https://haydartarek.github.io/layangarage/
```

Hosting provider:

```text
Hostinger
https://hpanel.hostinger.com
```

Important rule:

Do not create extra files, redirects, folders, schemas, or configuration unless there is a verified need. Prefer updating the existing project files and documenting the change.

---

## 1. Current Project State

The website is now a static landing website with a Supabase-backed vehicle admin panel.

Public pages:

```text
index.html
algemene-voorwaarden.html
privacy.html
```

Admin pages:

```text
admin/login.html
admin/dashboard.html
```

Main CSS:

```text
css/main.css
css/responsive.css
css/admin.css
```

Main JavaScript:

```text
js/main.js
js/cars.js
js/seo.js
js/supabase-config.js
js/vehicle-store.js
js/admin-auth.js
js/admin-vehicles.js
js/admin-social-generator.js
```

SEO rule:

All dynamic JSON-LD schema injection belongs in:

```text
js/seo.js
```

Do not add new inline JSON-LD blocks to `index.html` unless there is a clear reason.

---

## 2. Current Functional Scope

The website includes:

- Landing page sections for the garage, services, vehicles, depannage, opening hours, contact, FAQ, and footer.
- Legal pages for privacy and general terms.
- Contact form through Web3Forms.
- Smooth scrolling.
- Responsive layout for desktop, tablet, and mobile.
- Vehicle inventory from Supabase.
- Admin login through Supabase Auth.
- Admin dashboard for vehicle CRUD.
- Vehicle image upload to Supabase Storage.
- Social media text generator for Facebook, Instagram, and WhatsApp.
- Social generator fallback link for hidden vehicles:

```text
https://layangaragebv.be/index.html#cars
```

This prevents social posts from using a vehicle detail link when `Zichtbaar op website` is disabled.

---

## 3. Supabase Production State

Supabase project:

```text
Project name: Layan Garage BV
Project ref: woilhkvivdtrjxblutei
Project URL: https://woilhkvivdtrjxblutei.supabase.co
Region: eu-central-2
Database: postgres
Storage bucket: vehicle-images
```

Current data:

```text
Vehicles: 10
Vehicle feature records: 58
Vehicle image records: 98
Vehicle images in Supabase Storage: 98
Admin users: 1
```

Vehicle image storage:

```text
Bucket: vehicle-images
Path format: vehicles/<vehicle-slug>/<filename>
```

The old local folder was removed:

```text
assets/images/cars
```

Future vehicle images must be uploaded through the admin panel and stored in Supabase Storage.

Security rule:

- Never commit Supabase database passwords.
- Never commit Supabase service role keys.
- Never store plaintext passwords in project files.
- Keep only public browser-safe keys in `js/supabase-config.js`.

Known Supabase manual task before final handover:

```text
Enable Supabase Auth leaked password protection from the Supabase dashboard.
```

---

## 4. Vehicle URL Behavior

Public vehicle URLs use:

```text
https://layangaragebv.be/#wagen/<vehicle-slug>
```

If a vehicle is deleted or not available in the public inventory, the frontend redirects the old vehicle anchor to:

```text
index.html#cars
```

Purpose:

- Avoid dead vehicle anchors.
- Reduce risk for future SEO indexing.
- Keep users on the available inventory section.

---

## 5. Depannage Section

The old external `2dehands` CTA was removed because the business may stop using that service.

It was replaced with a dedicated `Depannage` section.

Image:

```text
assets/images/Depannage.jpg
```

Current optimized image size:

```text
1600 x 1067
Approximately 380 KB
```

Actions:

- Direct phone call.
- WhatsApp message with depannage intent.

WhatsApp intent text:

```text
Hallo Layan Garage, ik heb depannage nodig. Kunt u mij helpen?
```

SEO for the depannage service is injected through:

```text
js/seo.js
```

---

## 6. Pre-Deployment Discovery

Before replacing the WordPress website, verify the following inside Hostinger:

- Hosting plan is active.
- Domain is active.
- Domain points to the correct Hostinger account.
- SSL is active or can be activated.
- Existing WordPress files are accessible.
- Existing email configuration is documented.
- DNS zone is accessible.
- Current public web root is known.

Reference domain documents:

```text
D:\layan_garage\Fwd_Re_Verzoek_om_bevestiging_eigendom_domeinnaam_en_beëindiging.pdf
D:\layan_garage\Fwd- Transfercode voor de domeinnaam layangaragebv.be.pdf
```

Do not migrate if domain ownership or DNS control is unclear.

---

## 7. Backup Requirements

Before replacing WordPress, create backups:

- Full WordPress files backup.
- WordPress database backup.
- Current `.htaccess` backup if it exists.
- Current DNS records screenshot or export.
- Current email/DNS settings screenshot.

Backup folder should be outside the public web root.

Do not delete the WordPress backup after deployment.

---

## 8. Production Build Requirements

This is a static website. There is no build step.

Before upload, verify:

- No unused local car image folder exists.
- No secrets are committed.
- `js/supabase-config.js` points to the production Supabase project.
- `js/seo.js` contains schema logic.
- `index.html` has no duplicate inline JSON-LD schema.
- CSS cache versions are updated after CSS changes.
- JS cache versions are updated after JS changes.
- Contact form key is active.
- Logo and image assets load correctly.

Recommended local checks:

```powershell
node --check js\main.js
node --check js\cars.js
node --check js\seo.js
node --check js\vehicle-store.js
node --check js\admin-auth.js
node --check js\admin-vehicles.js
node --check js\admin-social-generator.js
```

Search checks:

```powershell
rg -n "assets/images/cars|2dehands|eyebrow-dark|hours-kicker|class=\"eyebrow\"" .
rg -n "service_role|password|AhmedRuaa|db_password" .
```

Expected:

- No active references to `assets/images/cars`.
- No `2dehands` CTA.
- No old eyebrow classes.
- No committed passwords.

---

## 9. Upload Strategy on Hostinger

Recommended approach:

1. Put the current WordPress site in backup.
2. Clear the target public web root only after backup is verified.
3. Upload the static website files.
4. Keep folder structure exactly as in the project.
5. Do not upload local temporary files, screenshots, or caches.

Upload these:

```text
admin/
assets/
css/
js/
supabase/README.md is optional for public hosting and can be excluded.
index.html
algemene-voorwaarden.html
privacy.html
```

Do not upload:

```text
.git/
.playwright-mcp/
reports/
*.md files, unless the client specifically wants them public
PDF transfer documents
local screenshots
temporary test files
```

If Hostinger supports file manager only, upload a clean ZIP of the public website contents and extract it in the public web root.

---

## 10. Redirect And URL Handling

Required public URLs:

```text
/
/index.html
/algemene-voorwaarden.html
/privacy.html
/#cars
/#wagen/<vehicle-slug>
/admin/login.html
/admin/dashboard.html
```

Old WordPress URLs should be audited before launch.

If old URLs exist and are indexed, create redirects in Hostinger or `.htaccess`.

Minimum redirect intent:

- Old vehicle/detail pages should go to `/index.html#cars`.
- Old contact page should go to `/index.html#contact`.
- Old services pages should go to `/index.html#services`.
- Old opening hours page should go to `/index.html#hours`.

Do not add redirects blindly. Audit old URLs first.

---

## 11. Production Verification

After upload, test:

Public website:

- Homepage loads on `https://layangaragebv.be`.
- SSL works.
- Logo loads.
- Hero image loads.
- Navigation works.
- Smooth scrolling works.
- Services tabs work.
- Vehicle cards load from Supabase.
- Vehicle modal opens.
- Deleted/missing vehicle anchor redirects to `index.html#cars`.
- Depannage section appears.
- WhatsApp depannage button opens with correct message.
- Contact form validation works.
- Contact form sends email.
- FAQ accordion works.
- Privacy page loads.
- General terms page loads.

Admin:

- `/admin/login.html` loads.
- Admin login works.
- `/admin/dashboard.html` is protected.
- Vehicle list loads.
- Add/edit/delete vehicle works.
- Toggle `Zichtbaar op website` works.
- Upload image works.
- Delete image removes Storage object and `vehicle_images` row.
- Social generator creates vehicle link only when visible.
- Social generator uses `/index.html#cars` for hidden vehicles.

Supabase:

- Public vehicle query works.
- Storage image public URLs return `200`.
- RLS policies still protect admin writes.
- No public bucket object listing warning.

---

## 12. SEO Verification

Verify after production launch:

- Page title is correct.
- Meta description is correct.
- Open Graph image loads.
- Twitter card image loads.
- Canonical URL is correct for production.
- JSON-LD schemas are injected by `js/seo.js`.
- No duplicate schema blocks exist.
- Vehicle product schemas are generated after inventory load.
- Depannage service schema exists.
- FAQ schema exists.
- AutoDealer schema exists.

Important:

When moving from GitHub Pages preview to real production, update preview URLs in metadata if needed:

```text
https://haydartarek.github.io/layangarage/
```

to:

```text
https://layangaragebv.be/
```

---

## 13. Performance Verification

After deployment, run Lighthouse on:

```text
https://layangaragebv.be
```

Verify:

- Images are compressed.
- CSS and JS cache versions are correct.
- Hostinger compression is enabled.
- Browser cache headers are active.
- Supabase images load quickly.
- No render-blocking issue is severe.

Hostinger recommended settings:

- Enable HTTPS.
- Enable gzip or Brotli if available.
- Enable browser cache for images, CSS, JS, fonts.
- Keep HTML cache short.

---

## 14. Security Verification

Check:

- No passwords in repository.
- No service role key in browser files.
- Admin pages require Supabase login.
- Supabase RLS policies active.
- Storage writes restricted to authenticated admins.
- Public users can view images through public URLs only.
- Contact form key is not abused.
- SSL certificate valid.

Manual Supabase action:

```text
Enable leaked password protection.
```

---

## 15. Final Delivery Checklist

Do not mark production complete until all are true:

- [ ] Domain resolves to the new website.
- [ ] SSL is valid.
- [ ] Homepage loads.
- [ ] Legal pages load.
- [ ] Vehicle inventory loads from Supabase.
- [ ] Vehicle images load from Supabase Storage.
- [ ] Admin login works.
- [ ] Admin dashboard works.
- [ ] Vehicle CRUD works.
- [ ] Image upload/delete works.
- [ ] Contact form sends successfully.
- [ ] Phone, WhatsApp, email, and social links work.
- [ ] Depannage section works.
- [ ] Social generator links are correct.
- [ ] Old vehicle links safely redirect to `index.html#cars`.
- [ ] SEO metadata is correct for production.
- [ ] `js/seo.js` injects schemas correctly.
- [ ] No console errors.
- [ ] No broken links.
- [ ] No exposed secrets.
- [ ] WordPress backup is stored safely.

---

## 16. Final Report Template

Final report should include:

1. Domain ownership status.
2. Hosting status.
3. Backup status.
4. Deployment status.
5. DNS status.
6. SSL status.
7. Supabase status.
8. Admin panel status.
9. Contact form status.
10. SEO status.
11. Performance status.
12. Security status.
13. Issues fixed.
14. Remaining issues.
15. Production readiness confirmation.

Production is complete only when the website is fully operational on:

```text
https://layangaragebv.be
```
