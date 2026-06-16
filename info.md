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

## Local Citations / Backlinks

### Cylex België

- Public Listing: https://www.cylex-belgie.be/bedrijf/layan+garage-13388430.html
- Account Email: `info@layangaragebv.be`
- Claim Status: claimed and verified on `2026-06-08`
- Listing Status: business name, NAP, opening hours, descriptions, keywords, Facebook, Instagram, WhatsApp, and production website verified
- Website Link: active; Cylex reports dofollow links enabled
- Password: intentionally not stored; keep it in the project password manager

### Existing Listings

- AutoScout24: https://www.autoscout24.be/nl/verkopers/layan-garage-bv
- 2dehands: https://www.2dehands.be/u/layan-garage/38105563/
- Companyweb: https://www.companyweb.be/nl/0770476641/layan-garage
- Goudengids / FCR Media dashboard: https://my.fcrmedia.be/dash
- Goudengids status: account and business listing completed and linked on `2026-06-08`
- idGarages partner registration: https://www.idgarages.pro/nl-be
- idGarages status: free partner-garage contact/registration request submitted on `2026-06-08`; awaiting Belux team validation by email at `info@layangaragebv.be`
- Business Vlaanderen: https://businessvlaanderen.be/bedrijven/
- Business Vlaanderen status: complete listing request submitted and confirmed received on `2026-06-08`; expected response within two business days
- Infobel: https://www.infobelpro.com/contact
- Infobel status: complete listing request sent directly from the business mailbox to `info@infobelpro.com` on `2026-06-08`; awaiting review and publication
- Bizique: https://www.bizique.be/nl/layan-garage-%E1%B4%AE%E2%B1%BD-depannage-0486-89-00-02
- Bizique status: correction accepted on `2026-06-08`; Bizique confirmed the company edit succeeded and is being processed. The public page still temporarily shows the old name, phone, location, and hours until propagation completes.
- Waze Map Editor: https://www.waze.com/en-US/editor?env=row&lon=4.2435271&lat=51.2074493&zoomLevel=20&tab=issue_tracker
- Waze review request: https://www.waze.com/discuss/t/belgium-level-2-approval-requested-for-layan-garage-bv-place-update/405855
- Waze status: the conversion from the former `Bellekens` listing to `Layan Garage BV` was approved by Belgian Waze Global Champ and map editor Paulvdwyn on `2026-06-08`. The updated listing should become available in the Waze app within several days.
- Waze approved details: `Layan Garage BV`, Albert Panisstraat 130, 9120 Beveren, `0486 89 00 02`, `https://layangaragebv.be/`, Monday-Saturday `09:00-18:00`, Sunday closed.

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
