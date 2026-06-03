# LAYAN GARAGE BV — VEHICLE ADMIN PANEL + WEBSITE SYNC + SOCIAL MEDIA GENERATOR

## Developer Mode | One Scope | Production Ready

## Project Path: D:\layan_garage

### OBJECTIVE

Build a professional vehicle management system that allows Layan Garage BV to manage inventory without modifying code.

The admin panel must become the single source of truth for all vehicles displayed on the website.

When a vehicle is created, edited, marked as sold, or deleted, the website inventory must update automatically.

The system must also generate professional Facebook, Instagram, and WhatsApp posts from vehicle data with one click.

---

# APPROVED TECHNICAL DIRECTION

Use **Supabase** as the production backend.

The public website can remain a static website hosted temporarily on GitHub Pages for testing, preview, and client review.

GitHub Pages is not the final production hosting target.

The final website may be moved later to the real hosting provider.

The implementation must therefore avoid GitHub-Pages-specific assumptions and must remain portable to normal static hosting.

Vehicle data, admin authentication, image storage, and inventory synchronization must be powered by Supabase.

Do not create a traditional local backend folder for this phase.

GitHub Pages cannot run Node.js, PHP, Python, or server-side API routes. Any local `backend/` folder would not execute during the current GitHub Pages testing phase unless the project is moved to a backend-capable host.

For this project phase, Supabase is the real backend.

The current repository remains the frontend/admin client only.

Hosting portability requirement:

* Do not hardcode GitHub Pages as the permanent domain.
* Keep environment/domain values easy to update before final hosting.
* Supabase configuration must work from the temporary GitHub Pages URL and from the final production domain.
* Allowed URLs in Supabase Auth and any domain restrictions must be updated when the final host is connected.

Supabase will provide:

* Admin authentication
* Vehicle database
* Vehicle image storage
* Row Level Security
* Public read access for visible vehicles
* Protected create, update, delete, upload, and reorder operations for authenticated admins

Do not build fake authentication with localStorage only.

Do not store admin passwords in the project.

Do not expose any Supabase `service_role` key in frontend files.

Only the Supabase `anon` key may be used in browser JavaScript.

All privileged access must be controlled by Supabase Auth, Row Level Security policies, and Storage policies.

---

# SUPABASE ARCHITECTURE

## Database Tables

Create the following tables:

### vehicles

Stores the main vehicle records.

Required columns:

* id
* slug
* title
* brand
* model
* year
* price
* mileage
* fuel_type
* engine
* transmission
* euro_norm
* seats
* description
* status
* is_visible
* display_order
* created_at
* updated_at

Status values:

* available
* reserved
* sold

### vehicle_features

Stores unlimited features/options for each vehicle.

Required columns:

* id
* vehicle_id
* label
* display_order
* created_at

### vehicle_images

Stores image metadata for each vehicle.

Required columns:

* id
* vehicle_id
* storage_path
* alt_text
* is_featured
* display_order
* created_at

## Storage

Create one Supabase Storage bucket:

* vehicle-images

Storage rules:

* Public users can read images.
* Only authenticated admins can upload, update, delete, and reorder vehicle images.
* Image paths should be organized by vehicle slug or vehicle id.

Example:

vehicles/volkswagen-golf-8-ehybrid-dsg-goal/front.jpg

## Security

Enable Row Level Security on all vehicle-related tables.

Policy direction:

* Public users can read only vehicles where `is_visible = true`.
* Public users can read related features and images only for visible vehicles.
* Authenticated admins can insert, update, and delete vehicles, features, and images.
* Admin actions must require a valid Supabase session.

No admin-only operation may rely only on hidden buttons or frontend checks.

---

# ABSOLUTE RULES

* Do not redesign the public website.
* Do not modify the visual identity.
* Do not break existing functionality.
* Do not remove existing SEO.
* Do not create unnecessary files.
* Do not duplicate code.
* Keep file structure clean.
* Keep the project maintainable.
* All features must be production-ready.
* Verify everything before completion.

---

# ADMIN PANEL

Create a secure admin dashboard.

Purpose:

The owner must be able to:

* Add vehicles
* Edit vehicles
* Delete vehicles
* Mark vehicles as sold
* Upload vehicle images
* Reorder images
* Select featured image
* Manage visibility
* Generate social media content

No coding knowledge should be required.

---

# AUTHENTICATION

Implement a protected login system using Supabase Auth.

Requirements:

* Login page
* Protected admin area
* Logout functionality
* Session validation
* Unauthorized users cannot access admin pages
* Auth state listener to redirect logged-out users away from admin pages
* Admin-only database and storage writes controlled by Supabase policies

The login page must authenticate against Supabase.

The admin dashboard must verify the active Supabase session before rendering protected functionality.

Do not expose admin functionality publicly.

Do not hardcode usernames or passwords inside JavaScript, HTML, or CSS.

Do not use localStorage as the security layer. Supabase session storage is acceptable only as part of Supabase Auth.

---

# VEHICLE MANAGEMENT

Each vehicle must contain:

### General Information

* Vehicle Title
* Brand
* Model
* Year
* Price
* Mileage
* Fuel Type
* Engine
* Transmission
* Euro Norm
* Seats
* Description
* Status

### Status Values

* Available
* Reserved
* Sold

---

# VEHICLE FEATURES

Allow unlimited features/options.

Examples:

* Navigatie
* Camera
* Radar
* Trekhaak
* Cruise Control
* Zetelverwarming
* Massage Zetel
* Garantie

Admin must be able to:

* Add feature
* Remove feature
* Reorder features

---

# IMAGE MANAGEMENT

Requirements:

* Multiple images per vehicle
* Drag & drop upload
* Image preview
* Delete image
* Reorder images
* Select main image

The website must automatically use the selected main image.

---

# WEBSITE SYNCHRONIZATION

When a vehicle is:

* Added
* Edited
* Deleted
* Sold

The website inventory must update automatically.

Supabase must become the single source of truth for vehicle inventory.

No manual editing of:

cars.js

should be required after implementation.

Vehicle cards, modal data, SEO data, and social media generation must all use the same source data.

The public website must load visible vehicle data from Supabase.

The existing `cars.js` file must be refactored so it no longer acts as the permanent inventory database.

Acceptable final approach:

* Keep rendering and modal logic in JavaScript.
* Move reusable data loading into a dedicated vehicle data module.
* Fetch vehicles, features, and images from Supabase.
* Use the selected featured image from `vehicle_images`.
* Hide vehicles where `is_visible = false`.
* Display sold vehicles with the correct status if they are still visible.

Optional fallback:

* A small local fallback may exist only for temporary offline development.
* The production website must prioritize Supabase data.

---

# VEHICLE DETAIL STRUCTURE

The social media generator must use the same data shown in the vehicle modal.

Vehicle modal includes:

* Title
* Price
* Year
* Mileage
* Fuel
* Engine
* Transmission
* Euro Norm
* Seats
* Status
* Features
* Description

All generated posts must be based on these values.

---

# SOCIAL MEDIA GENERATOR

For every vehicle provide:

### Actions

* Generate Facebook Post

* Copy Facebook Post

* Generate Instagram Caption

* Copy Instagram Caption

* Generate WhatsApp Message

* Copy WhatsApp Message

* Open WhatsApp with Message

All copy actions must copy the generated text directly to clipboard.

Show:

"Tekst gekopieerd"

after successful copy.

---

# FACEBOOK POST GENERATOR

Generate a professional Facebook sales post.

Must include:

* Vehicle title
* Price
* Vehicle description
* Specifications
* Features
* Contact information
* Website URL
* Location

Format:

🚗 Vehicle Title

💰 Price

Professional Dutch description.

📌 Specificaties

• Bouwjaar
• Kilometerstand
• Brandstof
• Motor
• Transmissie
• Euronorm
• Zitplaatsen
• Status

✅ Opties

Feature list

📍 Layan Garage BV
Albert Panisstraat 130
9120 Beveren-Waas

📞 0486 89 00 02

🌐 https://layangaragebv.be

The Facebook version should be detailed and informative.

---

# INSTAGRAM CAPTION GENERATOR

Generate a shorter Instagram-friendly caption.

Must include:

* Vehicle title
* Price
* Short description
* Key specifications
* Contact information
* Relevant hashtags

Example format:

🚗 Vehicle Title

💰 Price

Short attractive description.

📌 Year | Mileage | Fuel | Transmission

✅ Top features

📍 Beveren-Waas
📞 0486 89 00 02

🌐 layangaragebv.be

Relevant hashtags:

#LayanGarageBV
#TweedehandsAuto
#AutoTeKoop
#Occasiewagen
#Volkswagen
#Beveren
#Antwerpen
#Waasland

Do not generate excessive hashtags.

Instagram text must feel natural.

---

# WHATSAPP MESSAGE GENERATOR

Generate a short customer-friendly WhatsApp message.

Must include:

🚗 Vehicle Title

💰 Price

📅 Year

🛣️ Mileage

⛽ Fuel

⚙️ Transmission

✅ Features

📍 Layan Garage BV
Albert Panisstraat 130
9120 Beveren-Waas

📞 0486 89 00 02

🌐 https://layangaragebv.be

Ending:

Interesse? Neem gerust contact met ons op voor meer informatie.

The WhatsApp version must be concise and easy to send.

---

# WHATSAPP SHORTCUT

Provide:

Open WhatsApp

button.

Behavior:

Open WhatsApp with the generated message pre-filled.

Use official WhatsApp URL format.

Do not use WhatsApp API.

Do not require WhatsApp Business API.

---

# DESCRIPTION GENERATOR

If the admin enters a custom description:

Use the custom description.

If no description exists:

Automatically generate a natural Dutch description using:

* Vehicle title
* Fuel type
* Transmission
* Mileage
* Status
* Features

Text must sound human.

Avoid robotic wording.

Avoid exaggerated marketing claims.

Use realistic dealership language.

---

# SEO AUTOMATION

When a vehicle is added:

Automatically generate:

* Vehicle title
* Meta description
* Open Graph values
* Product Schema
* Vehicle Schema

Maintain existing SEO implementation.

Do not remove current SEO functionality.

Because the current website is static, SEO automation must be implemented in the best possible static-site-compatible way:

* Keep the existing page-level SEO.
* Generate vehicle-specific structured data from Supabase data at runtime.
* Keep Open Graph values for the main website stable and production-ready.
* Use vehicle data consistently for modal content, schema generation, and social media text generation.

Important limitation:

GitHub Pages cannot securely generate server-rendered per-vehicle pages by itself. If fully crawlable individual vehicle URLs are required later, add a build step or migrate the public site to hosting that supports server-side rendering or static generation.

---

# RESPONSIVE REQUIREMENTS

Admin panel must work perfectly on:

320px
375px
430px
768px
1024px
1440px

Verify:

* No horizontal scrolling
* No broken forms
* No broken uploads
* No overlapping elements
* No broken modals

---

# FILE STRUCTURE RULES

Keep proper separation:

HTML
CSS
JavaScript

Recommended structure:

* admin/login.html
* admin/dashboard.html
* css/admin.css
* js/supabase-config.js
* js/vehicle-store.js
* js/admin-auth.js
* js/admin-vehicles.js
* js/admin-social-generator.js

Frontend/admin structure decision:

```text
layan_garage/
  index.html
  algemene-voorwaarden.html
  privacy.html
  admin/
    login.html
    dashboard.html
  css/
    main.css
    responsive.css
    admin.css
  js/
    main.js
    cars.js
    seo.js
    supabase-config.js
    vehicle-store.js
    admin-auth.js
    admin-vehicles.js
    admin-social-generator.js
  assets/
```

Do not create:

```text
backend/
```

for this phase.

If future server-side logic becomes necessary, use Supabase-managed structure only:

```text
supabase/
  migrations/
  functions/
```

Only add `supabase/` when migrations or Edge Functions are actually implemented.

Do not place CSS inside JavaScript.

Do not place HTML templates randomly.

Do not create duplicate implementations.

Keep project structure clean.

---

# PERFORMANCE REQUIREMENTS

Verify:

* No duplicated rendering
* No unnecessary event listeners
* No memory leaks
* No duplicated schema generation
* No unnecessary API calls

Maintain fast page loading.

---

# SUPABASE SETUP CHECKLIST

Before implementation is marked complete, Supabase must be configured with:

* One Supabase project for Layan Garage BV
* Supabase Auth enabled
* At least one admin user created
* `vehicles` table created
* `vehicle_features` table created
* `vehicle_images` table created
* `vehicle-images` storage bucket created
* Row Level Security enabled on all vehicle tables
* Storage policies configured
* Public read policies tested
* Authenticated admin write policies tested
* Supabase project URL added to frontend config
* Supabase anon key added to frontend config
* Temporary GitHub Pages URL added where needed for testing
* Final production domain added before real launch
* Supabase Auth redirect/site URLs reviewed before final launch
* No service role key committed to the repository

---

# PRE-IMPLEMENTATION REQUIREMENTS

The following information must be confirmed before the admin panel is implemented.

These items prevent security, deployment, and data migration problems later.

## Supabase Project Details

Required:

* Supabase project URL
* Supabase anon key
* Confirmed storage bucket name: `vehicle-images`

Rules:

* The Supabase anon key may be used in browser JavaScript.
* The Supabase service role key must never be committed to the repository.
* Supabase credentials must be easy to update when moving from testing to final hosting.

## Admin Account Decision

Required:

* Primary admin email address
* Decision whether the system supports one admin only or multiple admins

Recommended:

Use a dedicated admin allowlist table instead of allowing every authenticated Supabase user to manage vehicles.

Recommended table:

### admin_users

Required columns:

* id
* user_id
* email
* role
* created_at

Allowed roles:

* owner
* admin

Security rule:

Only users listed in `admin_users` may create, edit, delete, upload images, or generate admin-only actions.

## Hosting Domains

Required:

* Temporary GitHub Pages preview URL
* Final production domain

Current preview URL:

* https://haydartarek.github.io/layangarage/

Expected production domain:

* https://layangaragebv.be

Before final launch update:

* Canonical URLs
* Open Graph URLs
* Twitter Card URLs
* Structured data website URLs
* Supabase Auth site URL
* Supabase Auth redirect URLs
* Any Web3Forms domain restrictions if the contact form remains active

## Image Upload Rules

Required:

* Allowed image formats: jpg, jpeg, png, webp
* Recommended maximum upload size per image: 5 MB
* Recommended maximum images per vehicle: 20
* Recommended output format for optimized images: webp

Image handling requirements:

* Validate file type before upload.
* Validate file size before upload.
* Show upload progress.
* Keep image previews clear.
* Allow deleting images safely.
* Prevent deleting the final image without warning.
* Allow selecting one featured image per vehicle.

Optimization decision:

If browser-side compression is implemented, keep quality high enough for vehicle sales photos.

Recommended browser-side image quality:

* 0.82 to 0.88 for webp/jpeg

## Existing Cars Migration

The existing vehicle inventory currently stored in `cars.js` must be migrated to Supabase before the admin panel becomes the source of truth.

Migration requirements:

* Preserve vehicle titles
* Preserve prices
* Preserve mileage
* Preserve specifications
* Preserve descriptions
* Preserve features
* Preserve image order
* Preserve featured images
* Preserve status values
* Preserve modal behavior after migration

After migration:

* Public vehicle cards must load from Supabase.
* Vehicle modal data must load from Supabase.
* Social media generator must use Supabase data.
* `cars.js` must no longer be manually edited for inventory updates.

## Backup And Export

Add a simple backup/export option for admin use.

Recommended export formats:

* JSON
* CSV

Export should include:

* Vehicle records
* Features
* Image metadata
* Status
* Visibility

Purpose:

* Backup before major changes
* Manual review
* Emergency recovery
* Easier migration to another system later

## Deployment Notes

The implementation must support two deployment stages:

### Testing Stage

Used for:

* GitHub Pages preview
* Admin workflow testing
* Supabase integration testing
* Client review

### Production Stage

Used for:

* Final hosting provider
* Final domain
* Final SEO URLs
* Final Supabase allowed URLs
* Final contact form domain permissions

Do not assume the testing URL is permanent.

---

# IMPLEMENTATION PHASES

## Phase 1 — Supabase Foundation

* Create database schema
* Create storage bucket
* Add RLS policies
* Add frontend Supabase config
* Verify public reads and admin writes

## Phase 2 — Public Website Sync

* Refactor vehicle loading away from hardcoded inventory data
* Load visible vehicles from Supabase
* Preserve existing vehicle cards, modals, filters, and styling
* Preserve existing SEO behavior
* Verify inventory updates automatically after Supabase changes

## Phase 3 — Admin Authentication

* Create login page
* Create logout flow
* Protect admin dashboard
* Validate Supabase session on page load
* Redirect unauthorized users

## Phase 4 — Vehicle Admin Dashboard

* Add vehicle creation
* Add vehicle editing
* Add vehicle deletion
* Add sold/reserved/available status management
* Add visibility management
* Add feature management
* Add image upload, preview, delete, reorder, and featured image selection

## Phase 5 — Social Media Generator

* Generate Facebook post
* Generate Instagram caption
* Generate WhatsApp message
* Copy generated text to clipboard
* Open WhatsApp with pre-filled message

## Phase 6 — Final Verification

* Test public website sync
* Test admin protection
* Test all CRUD operations
* Test image handling
* Test social media generator
* Test responsive admin layouts
* Test console errors
* Test production deployment behavior

---

# FINAL QA

Before completion verify:

✓ Login works

✓ Logout works

✓ Admin protection works

✓ Add vehicle works

✓ Edit vehicle works

✓ Delete vehicle works

✓ Sold status works

✓ Image upload works

✓ Image reorder works

✓ Main image selection works

✓ Website synchronization works

✓ Vehicle modal works

✓ Facebook post generation works

✓ Instagram caption generation works

✓ WhatsApp message generation works

✓ Copy buttons work

✓ WhatsApp shortcut works

✓ SEO generation works

✓ Responsive layouts work

✓ No console errors

✓ No visual regressions

---

# FINAL REPORT

Provide:

1. Files created
2. Files modified
3. Authentication implementation
4. Vehicle management implementation
5. Website synchronization status
6. Social media generator status
7. WhatsApp integration status
8. SEO automation status
9. Responsive status
10. Security status
11. Supabase project setup status
12. Database and storage policy status
13. Known limitations
14. Production readiness confirmation

Do not mark complete until every item has been implemented, tested, and verified.
