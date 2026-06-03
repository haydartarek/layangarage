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
│   │   ├── cars/
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
│   ├── main.css
│   └── responsive.css
├── js/
│   ├── cars.js
│   ├── main.js
│   └── seo.js
├── reports/
│   └── lighthouse reports
├── algemene-voorwaarden.html
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

Vehicle data is stored in `js/cars.js`. Cards and modal content are generated dynamically from the JavaScript data array.

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
- Image gallery
- Extras

This keeps the HTML cleaner and makes future inventory updates easier.

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

## Updating Vehicle Inventory

Vehicle data is managed in:

```text
js/cars.js
```

Each car object contains a `folder` and an `images` array. The folder should match a directory inside:

```text
assets/images/cars/
```

Example:

```js
{
  brand: 'Volkswagen',
  model: 'Golf 8 1.5 eHybrid OPF DSG Goal',
  folder: 'volkswagen-golf-8-ehybrid-dsg-goal',
  images: [
    'volkswagen-golf-8-ehybrid-dsg-goal-exterieur-voor.jpg'
  ]
}
```

After changing car images, make sure every filename exists in the correct folder.

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
