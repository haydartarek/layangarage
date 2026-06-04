# Layan Garage BV — Project Access Info

## Website

- Preview URL: https://haydartarek.github.io/layangarage/
- Production URL: https://layangaragebv.be
- Admin Login Page: `/admin/login.html`
- Admin Dashboard: `/admin/dashboard.html`

## Supabase

- Project Name: Layan Garage BV
- Project Ref: `woilhkvivdtrjxblutei`
- Project URL: https://woilhkvivdtrjxblutei.supabase.co
- Region: `eu-central-2`
- Database Host: `db.woilhkvivdtrjxblutei.supabase.co`
- Database Name: `postgres`
- Database User: `postgres`
- Storage Bucket: `vehicle-images`
- Vehicle Image Path Format: `vehicles/<vehicle-slug>/<filename>`
- Public Publishable Key:

```text
sb_publishable_CvgLOsD2gPlXDjmWxXSTIA_Akk1kRml
```

## Admin User

- Admin Email: `ahmedpower1990@gmail.com`
- Supabase User UUID: `79a9fd53-4bf2-418c-b2f3-280d6a63c73d`
- Role: `owner`

## Technical Admin / Handover

- Technical Admin: `Haydar Tarek`
- GitHub: https://github.com/haydartarek
- LinkedIn: https://www.linkedin.com/in/haydartarek-dev
- Handover Role: production verification, documentation, deployment support, and admin-side acceptance coordination
- Handover Status: production website is live; contact form delivery is confirmed; Supabase vehicle workflow is active; admin workflow is accepted for final handover by the technical admin

## Contact Form

- Provider: `Web3Forms`
- Destination Email: `info@layangaragebv.be`
- Access Key Location: `js/main.js`
- Active Access Key: `0d92510a-c978-41ab-9c03-5a16f0e8a573`
- Production Status: live and verified from `https://layangaragebv.be/#contact`
- Delivery Status: confirmed in the `info@layangaragebv.be` inbox

## Google Search Console

- Property: `layangaragebv.be`
- Verification Method: DNS TXT record
- DNS Host/Name: `@`
- DNS TXT Value: `google-site-verification=kj40Br9Cc10Sw4nZe75b0PVPMQzi-9Z-bxGYqsK5K7I`
- DNS Provider: Hostinger
- Status: added to Hostinger DNS and visible through DNS lookup
- Sitemap URL: `https://layangaragebv.be/sitemap.xml`

## Bing Webmaster Tools

- Property: `https://layangaragebv.be/`
- Verification Method: XML file
- Verification File: `BingSiteAuth.xml`
- Verification URL: `https://layangaragebv.be/BingSiteAuth.xml`
- Verification Token: `522EE47F65FA868BA4A9A2D385884E32`
- Status: uploaded to production web root and verified as publicly accessible

## Passwords

Passwords are intentionally not stored in this file.

Store these only in a password manager:

- Admin password
- Supabase database password
- Any future service role key

Never commit plaintext passwords or Supabase `service_role` keys to GitHub.

## Current Data

- Vehicles: `11`
- Visible vehicles: `11`
- Sold vehicles: `1`
- Features: `85`
- Vehicle image metadata records: `106`
- Vehicle images tracked in Supabase Storage metadata: `106`
- Admin users: `1`

## Current Vehicle Note

- Vehicle: `Audi Q7 3.0 TDI Quattro Tiptronic`
- Slug: `audi-q7-3-0-tdi-quattro-tiptronic-2012`
- Status in database: `sold`
- Website label: `Verkocht`
- Images: `8` optimized WebP images in Supabase Storage
- Feature records: `27`
- Description: full Dutch sales description stored in Supabase

## Latest Upload Set

Upload these files to Hostinger after the latest local updates:

```text
index.html
css/main.css
css/responsive.css
css/admin.css
admin/dashboard.html
js/admin-vehicles.js
js/admin-social-generator.js
```

Notes:

- Audi Q7 photos are already uploaded to Supabase Storage and do not need to be uploaded to Hostinger.
- Do not upload `.playwright-mcp`.
- Do not upload temporary optimized image folders.
- The social media generator copies post text and opens Facebook, Instagram, or WhatsApp. Raw Supabase image URLs are intentionally not included in the generated post text.
