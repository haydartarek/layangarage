# Layan Garage BV Landing Website

A fast, responsive, and SEO-focused landing website for **Layan Garage BV**, a garage and used-car business based in Beveren-Waas, Belgium.

This project was rebuilt from a WordPress-based website into a static landing page experience. The goal was to keep the business content complete, improve the visual presentation, make the site easier to maintain, and keep the loading experience lightweight.

Built by **Haydar Tarek**  
GitHub: [github.com/haydartarek](https://github.com/haydartarek)  
LinkedIn: [linkedin.com/in/haydartarek-dev](https://www.linkedin.com/in/haydartarek-dev)

---

## Project Overview

The website is a complete static front-end implementation for Layan Garage BV. It presents the garage, available services, vehicle inventory, opening hours, contact channels, FAQ content, privacy information, and general terms.

The site is written with plain HTML, CSS, and JavaScript. There is no build step required, which keeps deployment simple and makes the project suitable for most shared hosting environments.

Main goals:

- Convert the original WordPress content into a modern landing page.
- Keep the current brand identity: black, orange, white, strong typography, and garage-focused visuals.
- Improve page speed and mobile usability.
- Add structured SEO metadata and social sharing metadata.
- Provide a working contact form flow through Web3Forms.
- Keep the codebase simple enough for future content updates.

---

## Pages

The project currently includes three public HTML pages:

- `index.html`  
  Main landing page with hero section, trust cards, about content, services, maintenance, buy/sell sections, car inventory, opening hours, contact form, map, FAQ, footer, and floating WhatsApp action.

- `algemene-voorwaarden.html`  
  General terms page written in Dutch and styled with the same visual identity as the main website.

- `privacy.html`  
  Privacy policy page written in Dutch and styled consistently with the rest of the website.

---

## Folder Structure

```text
layan_garage/
├── assets/
│   ├── images/
│   │   ├── services/
│   │   ├── about-garage.jpg
│   │   ├── hero-garage.jpg
│   │   ├── hero-garage-960.webp
│   │   ├── hero-garage-1600.webp
│   │   ├── hero-garage-2200.webp
│   │   └── Openingsuren.jpg
│   └── logo/
│       ├── favicon.ico
│       └── logo.png
├── css/
│   ├── admin.css
│   ├── main.css
│   └── responsive.css
├── js/
│   ├── admin-auth.js
│   ├── admin-social-generator.js
│   ├── admin-vehicles.js
│   ├── cars.js
│   ├── main.js
│   ├── seo.js
│   ├── supabase-config.js
│   └── vehicle-store.js
├── admin/
│   ├── dashboard.html
│   └── login.html
├── reports/
│   └── lighthouse reports
├── supabase/
│   ├── migrations/
│   └── README.md
├── algemene-voorwaarden.html
├── info.md
├── index.html
├── privacy.html
└── README.md
```

---

## Technology

This project intentionally uses a lightweight stack:

- HTML5
- CSS3
- Vanilla JavaScript
- Supabase Auth, Database, and Storage for the vehicle admin panel
- Web3Forms for contact form submission
- Schema.org JSON-LD for SEO
- Open Graph and Twitter Card metadata for link previews
- Responsive image delivery using WebP hero images

No framework is required. No bundler is required.

---

## Main Features

### Responsive Landing Page

The layout is designed for desktop, tablet, and mobile screens. The responsive rules are separated into `css/responsive.css`, while the base visual system and components live in `css/main.css`.

### Hero Section

The hero section uses optimized image delivery:

- Original fallback: `assets/images/hero-garage.jpg`
- WebP variants:
  - `hero-garage-960.webp`
  - `hero-garage-1600.webp`
  - `hero-garage-2200.webp`

This improves Lighthouse performance significantly, especially the Largest Contentful Paint metric.

### Services Filter Tabs

The services section uses accessible tab-style navigation. Each tab opens a detailed service panel without leaving the page.

Included services:

- Motordiagnose
- Olie & filters
- Riemen & slangen
- Airconditioning
- Remreparatie
- Band- & wielservices

### Vehicle Inventory

Vehicle inventory is loaded from Supabase through `js/vehicle-store.js`. Cards and modal content are generated dynamically in `js/cars.js`.

Each car entry includes:

- Brand and model
- Year
- Mileage
- Fuel type
- Engine information
- Transmission
- Seats
- Price
- Status
- Condition: new or used
- Image gallery
- Extras

The original local JavaScript vehicle array is kept only as a visual fallback if Supabase is temporarily unavailable. The production source of truth is Supabase.

Vehicle photos are not stored in the repository anymore. They are served from Supabase Storage:

```text
Bucket: vehicle-images
Path: vehicles/<vehicle-slug>/<filename>
```

The old local folder was removed:

```text
assets/images/cars
```

When a visitor opens an old vehicle URL after that vehicle has been removed, the website redirects the user to:

```text
index.html#cars
```

This avoids leaving users and future search engine crawlers on stale vehicle anchors.

### Admin Panel

The project includes a lightweight admin area:

```text
admin/login.html
admin/dashboard.html
```

The admin panel supports:

- Creating, editing, hiding, and deleting vehicles.
- Uploading vehicle photos directly to Supabase Storage.
- Setting a featured image.
- Reordering images.
- Deleting images from both Supabase Storage and the `vehicle_images` database table.
- Editing feature lists.
- Selecting common dropdown values for fuel type, engine, transmission, Euro norm, seats, and condition.
- Using `Other` fields when a value is not available in the dropdown.
- Generating Dutch Facebook, Instagram, and WhatsApp post text while the admin fills vehicle data.
- Including the public vehicle link in generated social media text.

### Contact Form

The contact form is handled in `js/main.js` and submits through Web3Forms.

Validation includes:

- Name length and character validation
- European-style phone number validation
- Email validation with blocked disposable domains and accepted common providers
- Message length validation
- Field-level error messages
- Success and error feedback messages

The configured recipient/business email is:

```text
info@layangaragebv.be
```

### Floating WhatsApp Button

A floating WhatsApp button is available on every page. It gives users a fast contact path without searching for the contact section.

### Smooth Scrolling

Internal anchor navigation uses smooth scrolling and accounts for the header offset so sections are not hidden behind the navigation.

### Scroll Reveal Animations

Subtle reveal animations are applied to major content blocks. The implementation respects `prefers-reduced-motion`, so users who prefer less motion are not forced into animated transitions.

### SEO and Sharing

The main page includes:

- SEO title and meta description
- Canonical URL
- Open Graph metadata
- Twitter Card metadata
- Local business schema
- FAQ schema

The legal pages also include page-specific metadata and social sharing images.

Social sharing image:

```text
https://layangaragebv.be/assets/logo/logo.png
```

---

## Performance Work

Several optimizations were applied:

- Removed unused image files.
- Compressed active image assets while preserving visual quality.
- Migrated vehicle gallery photos from the repository to Supabase Storage.
- Removed the local vehicle image folder after verifying all 98 vehicle photos were available in Storage.
- Added WebP hero image variants.
- Improved LCP by replacing the heavy hero image delivery path.
- Fixed accessibility contrast issues.
- Cleaned up broken or unused social preview references.
- Kept JavaScript lightweight and dependency-free.

Latest Lighthouse checks were generated in the `reports/` directory.

Final tested scores:

### Mobile

- Performance: `87`
- Accessibility: `100`
- Best Practices: `100`
- SEO: `100`

### Desktop

- Performance: `99`
- Accessibility: `100`
- Best Practices: `100`
- SEO: `100`

Reports:

- `reports/lighthouse-home-mobile-final3.report.html`
- `reports/lighthouse-home-desktop-final3.report.html`

Some remaining Lighthouse suggestions are deployment-related, such as cache lifetime headers, compression, and render-blocking CSS. These should improve further when the site is served from production hosting with proper gzip or Brotli compression and cache headers.

---

## Running Locally

Because this is a static website, it can be opened directly in a browser. For better testing, use a local server.

Using Python:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

---

## Running Lighthouse

If Lighthouse is not installed globally, it can be run with `npx`:

```bash
npx lighthouse http://127.0.0.1:4173/ --output=json --output=html --output-path=reports/lighthouse-home-mobile --quiet
```

Desktop preset:

```bash
npx lighthouse http://127.0.0.1:4173/ --preset=desktop --output=json --output=html --output-path=reports/lighthouse-home-desktop --quiet
```

On Windows, Chrome may need to be available through `CHROME_PATH`.

---

## Supabase Setup

Supabase is used for the vehicle administration workflow.

Live project details are documented in:

```text
info.md
```

The public browser configuration is stored in:

```text
js/supabase-config.js
```

Supabase migration files are stored in:

```text
supabase/migrations/
```

Current migrations:

1. `001_vehicle_inventory_schema.sql`
2. `002_seed_current_inventory.sql`
3. `003_harden_vehicle_rls_policies.sql`
4. `004_add_owner_admin_user.sql`
5. `005_add_vehicle_condition_field.sql`
6. `006_migrate_vehicle_images_to_storage.sql`

Current production counts:

```text
Vehicles: 10
Vehicle feature records: 58
Vehicle image records: 98
Supabase Storage vehicle images: 98
Admin users: 1
```

Storage policy summary:

- The `vehicle-images` bucket is public so direct image URLs can load on the website.
- Public listing of bucket objects is not allowed.
- Authenticated admins can upload, update, read, and delete vehicle storage objects.
- Public users read images through direct public object URLs.

Security note:

- Passwords and service-role keys must not be committed.
- `info.md` intentionally stores only non-secret project access information.
- Supabase Auth leaked password protection should be enabled manually from the Supabase dashboard.

---

## Updating Vehicle Inventory

Vehicle inventory is managed from the admin dashboard:

```text
/admin/dashboard.html
```

Vehicle data is stored in Supabase tables, and vehicle photos are stored in Supabase Storage:

```text
Bucket: vehicle-images
Path: vehicles/<vehicle-slug>/<filename>
```

The old local `assets/images/cars` folder has been removed. New and existing vehicle images should be uploaded through the admin panel so the website can load them directly from Supabase Storage.

When deleting a vehicle image from the admin panel, the application deletes:

1. The image object from Supabase Storage.
2. The related row from `vehicle_images`.

When deleting or hiding a vehicle, old public vehicle links should resolve back to:

```text
index.html#cars
```

---

## Updating Styles

Use:

```text
css/main.css
```

for base design, components, layout, colors, buttons, cards, sections, and page styles.

Use:

```text
css/responsive.css
```

for media queries and responsive-only rules.

Project convention:

- Keep media queries in `responsive.css`.
- Keep base component styling in `main.css`.
- Update cache query strings in HTML after changing CSS or JS.

Example:

```html
<link rel="stylesheet" href="css/main.css?v=20260603-19">
<script src="js/main.js?v=20260603-6" defer></script>
```

---

## Contact Form Notes

The form uses Web3Forms. The access key is currently configured inside:

```text
js/main.js
```

If the email provider or form service changes later, update the submit logic in `initializeContactForm()`.

For production, verify:

- The Web3Forms access key is active.
- Emails are delivered to the correct inbox.
- Spam filtering does not block messages.
- The domain is verified if the provider requires it.

---

## Deployment Notes

This project can be deployed to:

- Standard shared hosting
- cPanel file manager
- Netlify
- Vercel static hosting
- GitHub Pages
- Any web server that can serve static files

GitHub Pages is currently suitable as a preview/testing deployment. The final production deployment can be moved to the real hosting provider without changing the Supabase inventory setup, as long as the deployed files keep the same Supabase project configuration.

For best production performance, enable:

- HTTPS
- Brotli or gzip compression
- Long cache headers for images, CSS, and JS
- Correct MIME types for `.webp`, `.css`, `.js`, and `.svg`

Recommended cache behavior:

- HTML: short cache
- CSS/JS: long cache with version query strings
- Images: long cache

---

## Accessibility

Accessibility improvements include:

- Proper labels for navigation and buttons
- Keyboard-friendly service tabs
- Improved color contrast
- Reduced-motion support
- Valid form validation messages
- Accessible social and contact links

Latest Lighthouse accessibility score:

```text
100 / 100
```

---

## Browser Support

The website is designed for modern browsers:

- Chrome
- Edge
- Firefox
- Safari
- Mobile Chrome
- Mobile Safari

The layout uses standard CSS and JavaScript APIs. The reveal animation uses `IntersectionObserver`; if unavailable, the content remains visible.

---

## Credits

Designed and developed by:

**Haydar Tarek**

- GitHub: [https://github.com/haydartarek](https://github.com/haydartarek)
- LinkedIn: [https://www.linkedin.com/in/haydartarek-dev](https://www.linkedin.com/in/haydartarek-dev)

Project client:

**Layan Garage BV**  
Albert Panisstraat 130  
9120 Beveren-Waas, Belgium

---

## License

This project was created for Layan Garage BV. All business content, branding, images, and vehicle information belong to their respective owner. Reuse outside the intended project should be approved by the owner.
