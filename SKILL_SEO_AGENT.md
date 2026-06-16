# SKILL.md — SEO AI Agent — Layan Garage BV
> **Developer Mode Prompt** voor Claude Code / AI Agent
> Versie: 2026-06 | Taal: Nederlands (nl_BE) | Site: https://layangaragebv.be/

---

## 🎯 ROL EN DOEL

Je bent een senior SEO-engineer en full-stack developer gespecialiseerd in Local SEO voor Vlaamse KMO's.
Je taak is het volledig optimaliseren van de website van **Layan Garage BV** voor Google zoekresultaten, Google Maps Local Pack, en AI-zoekmachines (Gemini, ChatGPT via Bing).

**Primaire doelen (in volgorde van prioriteit):**
1. Verschijnen in Google Maps Local Pack voor "autogarage Beveren-Waas" en varianten
2. Organische positie 1–3 voor long-tail lokale keywords
3. Rich results (FAQ, OpeningHours, Car schema) in Google SERP
4. Indexatie door Bing/ChatGPT via NAP-consistentie
5. Core Web Vitals score ≥ 90 op alle drie metrics

---

## 📁 PROJECTSTRUCTUUR

```
layangaragebv.be/
├── index.html              ← Hoofdpagina (single-page site)
├── js/
│   ├── seo.js              ← JSON-LD schema injector (KRITIEK)
│   ├── main.js             ← UI interactions
│   ├── cars.js             ← Voertuigenlijst renderer
│   ├── vehicle-store.js    ← Supabase data fetcher
│   └── supabase-config.js  ← DB connectie
├── css/
│   └── main.css            ← Alle stijlen
├── assets/
│   ├── logo/logo.png       ← Logo 500×129px
│   └── images/hero-garage.jpg  ← Hero afbeelding (LCP element)
├── sitemap.xml             ← MOET aangemaakt worden
├── robots.txt              ← MOET gecontroleerd worden
├── algemene-voorwaarden.html
└── privacy.html
```

---

## 🔑 NAP — SINGLE SOURCE OF TRUTH

**Gebruik deze gegevens EXACT en IDENTIEK in elke aanpassing:**

```
Bedrijfsnaam : Layan Garage BV
Straat       : Albert Panisstraat 130
Postcode     : 9120
Gemeente     : Beveren-Waas
Provincie    : Oost-Vlaanderen
Land         : België (BE)
Telefoon     : +32486890002  ← schema markup
Telefoon     : 0486 89 00 02 ← zichtbare tekst
E-mail       : info@layangaragebv.be
Website      : https://layangaragebv.be/
BTW          : BE0770476641
Lat/Lng      : 51.2074493, 4.2435271
```

**⛔ VERBODEN afwijkingen:**
- "Layan Garage" zonder "BV"
- "Beveren" zonder "-Waas"
- Telefoonnummer met streepjes in schema: gebruik altijd `+32486890002`
- Website zonder trailing slash of zonder `https://`

---

## 📋 TAKENLIJST — voer uit in deze volgorde

### FASE 1 — Technische SEO (index.html)

#### 1.1 — robots.txt controleren / aanmaken
Controleer of `robots.txt` bestaat. Zo niet, maak het aan:
```
User-agent: *
Allow: /
Sitemap: https://layangaragebv.be/sitemap.xml
```

#### 1.2 — sitemap.xml aanmaken
Maak een valide XML sitemap aan. De site is single-page, dus voeg ook de anchor-links toe als `<url>` entries met `<priority>`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://layangaragebv.be/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>YYYY-MM-DD</lastmod>
  </url>
  <url>
    <loc>https://layangaragebv.be/#services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://layangaragebv.be/#cars</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://layangaragebv.be/#depannage</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://layangaragebv.be/#faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://layangaragebv.be/algemene-voorwaarden.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>https://layangaragebv.be/privacy.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
</urlset>
```

#### 1.3 — `<head>` optimalisaties in index.html

Controleer en pas aan (NIET overschrijven wat al correct is):

**a) OG Image → hero afbeelding (niet het logo)**
```html
<meta property="og:image" content="https://layangaragebv.be/assets/images/hero-garage.jpg">
<meta property="og:image:secure_url" content="https://layangaragebv.be/assets/images/hero-garage.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1920">
<meta property="og:image:height" content="1080">
<meta property="og:image:alt" content="Layan Garage BV werkplaats in Beveren-Waas">
```

**b) Twitter card → summary_large_image**
```html
<meta name="twitter:card" content="summary_large_image">
```

**c) Hero image preload (LCP optimalisatie — EERSTE link in head)**
```html
<link rel="preload" as="image" href="assets/images/hero-garage.jpg" fetchpriority="high">
```

**d) Sitemap link**
```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

**e) Hreflang (nl-BE)**
```html
<link rel="alternate" hreflang="nl-BE" href="https://layangaragebv.be/">
<link rel="alternate" hreflang="x-default" href="https://layangaragebv.be/">
```

**f) DNS prefetch voor externe scripts**
```html
<link rel="dns-prefetch" href="//www.googletagmanager.com">
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

#### 1.4 — H-structuur valideren

Controleer dat er PRECIES ÉÉN `<h1>` is op de pagina.
Huidige H1: `Autogarage in Beveren-Waas voor occasiewagens, onderhoud en gratis computerdiagnose`

H2-structuur moet zijn (controleer en herstel indien afwijkend):
- `Uw allround garagebedrijf in Beveren-Waas`
- `Autodiensten in Beveren-Waas voor alle merken`
- `Auto onderhoud voor alle merken in Beveren-Waas`
- `Occasiewagen kopen of auto verkopen in Beveren-Waas`
- `Gecontroleerde tweedehands auto's te koop in Beveren`
- `Depannage en pechhulp in Beveren-Waas, Antwerpen en het Waasland`
- `Veelgestelde vragen over onze garage in Beveren-Waas`

**De FAQ H2 MOET "Beveren-Waas" bevatten** — dit is een keyword-signaal.

#### 1.5 — Image alt-attributen

Controleer alle `<img>` tags. Regels:
- Logo: `alt="Layan Garage BV logo"`
- Hero: `alt="Autogarage Layan Garage BV in Beveren-Waas"`
- Voertuigfoto's: `alt="[Merk] [Model] [Jaar] te koop bij Layan Garage BV Beveren-Waas"`
- Iconen/decoratief: `alt=""` (leeg — bewust)

#### 1.6 — Footer NAP als gestructureerde tekst

Controleer dat de footer het volledige adres bevat als leesbare tekst (niet alleen in schema):
```html
<address>
  <strong>Layan Garage BV</strong><br>
  Albert Panisstraat 130<br>
  9120 Beveren-Waas<br>
  België
</address>
```
Wikkel de bestaande adresgegevens in `<address>` tags als dat nog niet zo is.

---

### FASE 2 — Schema.org (seo.js)

#### 2.1 — Verplichte schemas (controleer aanwezigheid)

| Schema type | Aanwezig? | Actie |
|-------------|-----------|-------|
| `WebSite` + SearchAction | → check | Voeg toe indien ontbreekt |
| `["AutoDealer", "AutoRepair"]` | → check | Gebruik array, niet additionalType |
| `GeoCoordinates` | → check | `lat: 51.2074493, lng: 4.2435271` |
| `openingHoursSpecification` | → check | Vervang string door object |
| `FAQPage` | → check | 7 vragen minimum |
| `Service` (Depannage) | → check | Met areaServed als City-objecten |
| `Car` (per voertuig) | → check | NIET Product — gebruik Car |

#### 2.2 — AutoDealer schema — complete template

```javascript
{
  "@context": "https://schema.org",
  "@type": ["AutoDealer", "AutoRepair"],
  "name": "Layan Garage BV",
  "url": "https://layangaragebv.be/",
  "logo": "https://layangaragebv.be/assets/logo/logo.png",
  "image": "https://layangaragebv.be/assets/images/hero-garage.jpg",
  "description": "Layan Garage BV is een autogarage in Beveren-Waas voor gecontroleerde occasiewagens, auto onderhoud alle merken, gratis computerdiagnose, depannage, remmen, banden en airconditioning in de regio Antwerpen en Waasland.",
  "keywords": [
    "autogarage Beveren-Waas",
    "occasiewagen kopen Beveren",
    "gratis computerdiagnose auto Beveren-Waas",
    "auto onderhoud alle merken Beveren",
    "depannage Beveren-Waas",
    "tweedehands auto Waasland"
  ],
  "telephone": "+32486890002",
  "email": "info@layangaragebv.be",
  "vatID": "BE0770476641",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Albert Panisstraat 130",
    "postalCode": "9120",
    "addressLocality": "Beveren-Waas",
    "addressRegion": "Oost-Vlaanderen",
    "addressCountry": "BE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.2074493,
    "longitude": 4.2435271
  },
  "hasMap": "https://maps.google.com/maps?q=Albert+Panisstraat+130,+9120+Beveren-Waas,+Belgie",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Bank transfer",
  "areaServed": [
    "Beveren-Waas","Antwerpen","Waasland","Sint-Niklaas","Mechelen","Gent","Temse","Lokeren"
  ],
  "sameAs": [
    "https://www.facebook.com/layangaragebv",
    "https://www.instagram.com/elmasry_garage/",
    "https://www.tiktok.com/@layangarage"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Autodiensten en occasiewagens",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gratis computerdiagnose auto Beveren-Waas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Auto onderhoud alle merken Beveren" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Depannage Beveren-Waas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Banden wisselen Beveren-Waas" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airconditioning auto Beveren" } },
      { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Gecontroleerde occasiewagens Beveren-Waas" } }
    ]
  }
}
```

#### 2.3 — Car schema — verplichte velden

Bij het genereren van schema voor elk voertuig:
- `"@type": "Car"` — NOOIT "Product"
- `"itemCondition": "https://schema.org/UsedCondition"` — altijd aanwezig
- `"mileageFromOdometer": { "@type": "QuantitativeValue", "value": NUMBER, "unitCode": "KMT" }`
- `"vehicleModelDate": STRING` — bouwjaar als string
- `"fuelType": car.fuel`
- `"model": car.model`
- Verwijder `undefined` waarden vóór injectie

#### 2.4 — FAQ schema uitbreiden

De FAQPage moet MINIMAAL 7 vragen bevatten die overeenkomen met de visible FAQ in index.html.
Elke vraag moet een long-tail keyword bevatten. Controleer dat de tekst in het schema IDENTIEK is aan de zichtbare HTML-tekst.

**Verplichte vragen (controleer aanwezigheid):**
1. Kan ik mijn wagen verkopen bij Layan Garage BV in Beveren-Waas?
2. Bieden jullie auto onderhoud aan voor alle merken in Beveren?
3. Kan ik een afspraak maken voor een gratis computerdiagnose?
4. Is jullie autogarage open op zaterdag in Beveren-Waas?
5. Kan ik een gecontroleerde occasiewagen kopen zonder verborgen gebreken?
6. Helpen jullie bij depannage of pechhulp in het Waasland?
7. Kan ik mijn airco of banden laten controleren in Beveren-Waas?

---

### FASE 3 — Bijkomende SEO-elementen

#### 3.1 — BreadcrumbList schema toevoegen aan seo.js

```javascript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://layangaragebv.be/" },
    { "@type": "ListItem", "position": 2, "name": "Diensten", "item": "https://layangaragebv.be/#services" },
    { "@type": "ListItem", "position": 3, "name": "Occasiewagens", "item": "https://layangaragebv.be/#cars" },
    { "@type": "ListItem", "position": 4, "name": "Depannage", "item": "https://layangaragebv.be/#depannage" },
    { "@type": "ListItem", "position": 5, "name": "FAQ", "item": "https://layangaragebv.be/#faq" }
  ]
}
```

#### 3.2 — LocalBusiness + areaServed met City-objecten

Voeg toe aan Depannage service schema:
```javascript
"areaServed": [
  { "@type": "City", "name": "Beveren-Waas" },
  { "@type": "City", "name": "Sint-Niklaas" },
  { "@type": "City", "name": "Antwerpen" },
  { "@type": "AdministrativeArea", "name": "Waasland" },
  { "@type": "City", "name": "Temse" },
  { "@type": "City", "name": "Lokeren" }
]
```

#### 3.3 — Verborgen SEO-tekst in footer (indien niet aanwezig)

Voeg toe aan footer, onderaan, in kleine tekst (kleur: var(--color-muted)):
```html
<p class="footer-seo-text" style="font-size:12px;color:var(--color-text-secondary);margin-top:1rem;">
  Layan Garage BV bedient automobilisten uit Beveren-Waas, Sint-Niklaas, Antwerpen, 
  het Waasland, Temse en Lokeren voor alle auto-onderhoud, diagnose en occasiewagens.
</p>
```

#### 3.4 — Meta keywords uitbreiden

Huidige keywords aanvullen met long-tail varianten:
```html
<meta name="keywords" content="
  autogarage Beveren-Waas, occasiewagen kopen Beveren, tweedehands auto Waasland,
  gratis computerdiagnose auto Beveren-Waas, auto onderhoud alle merken Beveren,
  depannage Beveren-Waas, pechhulp Antwerpen Waasland, airconditioning auto Beveren,
  banden wisselen Beveren-Waas, auto verkopen Waasland eerlijke prijs,
  remmen controleren Antwerpen regio, autogarage open zaterdag Beveren,
  erkende garage Sint-Niklaas omgeving, gecontroleerde occasiewagen proefrit Beveren
">
```

---

### FASE 4 — Performance (Core Web Vitals)

#### 4.1 — LCP optimalisatie
- Hero afbeelding heeft `fetchpriority="high"` en `<link rel="preload">` ✓
- Zorg dat `loading="eager"` op de hero `<img>` staat (NIET lazy)
- Logo in header: `loading="eager"` (above the fold)
- Alle overige afbeeldingen: `loading="lazy"`

#### 4.2 — CLS preventie
- Alle `<img>` tags moeten `width` en `height` attributen hebben
- Voeg `aspect-ratio` toe in CSS voor dynamisch geladen voertuigkaarten

#### 4.3 — Script optimalisatie
- GTM script staat bovenaan met `async` ✓
- Alle overige scripts staan onderaan met `defer` ✓
- Supabase CDN heeft `defer` ✓

#### 4.4 — Inline critical CSS
Overweeg de meest kritieke CSS regels (boven-de-vouw: header, hero, nav) inline te plaatsen in `<style>` in `<head>` om Flash of Unstyled Content te vermijden.

---

### FASE 5 — Nieuwe bestanden aanmaken

#### 5.1 — sitemap.xml
Maak aan op root: `/sitemap.xml`
Gebruik de template uit Fase 1.2 met de huidige datum als `<lastmod>`.

#### 5.2 — robots.txt
Controleer `/robots.txt`. Maak aan als ontbreekt:
```
User-agent: *
Allow: /
Disallow: /assets/data/
Sitemap: https://layangaragebv.be/sitemap.xml
```

#### 5.3 — .htaccess (indien Apache server)
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Trailing slash canonical
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.+[^/])$ /$1/ [R=301,L]

# Cache headers
<FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|webp)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
<FilesMatch "\.(css|js)$">
  Header set Cache-Control "max-age=2592000, public"
</FilesMatch>
<FilesMatch "\.html$">
  Header set Cache-Control "max-age=3600, public"
</FilesMatch>

# Gzip compression
AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
```

---

### FASE 6 — Validatie na elke wijziging

Na elke aanpassing aan seo.js of index.html, valideer:

```bash
# 1. Syntax check JS
node --check js/seo.js

# 2. HTML validatie (via W3C API)
curl -s -X POST "https://validator.w3.org/nu/?out=json" \
  -H "Content-Type: text/html; charset=utf-8" \
  --data-binary @index.html | jq '.messages[] | select(.type=="error")'

# 3. Schema validatie
# Kopieer de JSON-LD output en test op: https://validator.schema.org/

# 4. Sitemap validatie
xmllint --noout sitemap.xml && echo "Sitemap OK"
```

---

## 🚫 VERBODEN HANDELINGEN

1. **Nooit** `<meta name="robots" content="noindex">` toevoegen
2. **Nooit** canonical URL wijzigen naar iets anders dan `https://layangaragebv.be/`
3. **Nooit** duplicate `<title>` of duplicate `<h1>` toevoegen
4. **Nooit** NAP-gegevens aanpassen zonder het NAP_LAYAN_GARAGE.md bestand bij te werken
5. **Nooit** schema injecteren vóór `DOMContentLoaded`
6. **Nooit** `@type: "Product"` gebruiken voor voertuigen — altijd `"Car"`
7. **Nooit** externe CDN toevoegen zonder `rel="preconnect"` of `rel="dns-prefetch"`

---

## 🔁 VOLGORDE BIJ ELKE UPDATE

```
1. Lees dit SKILL.md volledig
2. Lees het bestand dat je gaat aanpassen
3. Voer de aanpassing uit
4. Valideer (node --check voor JS, xmllint voor XML)
5. Verhoog versienummer in script src: ?v=YYYYMMDD-N
6. Update lastmod in sitemap.xml
7. Rapporteer: welk bestand gewijzigd, wat toegevoegd, wat verwijderd
```

---

## 📊 KEYWORD TARGETING — REFERENTIE

| Type | Keyword | Gebruik in |
|------|---------|-----------|
| **H1** | `Autogarage in Beveren-Waas voor occasiewagens, onderhoud en gratis computerdiagnose` | H1 tag |
| **Title** | `Autogarage Beveren-Waas \| Occasiewagens & Gratis Diagnose` | `<title>` |
| **Primary** | `autogarage Beveren-Waas` | H2, schema, footer |
| **Primary** | `gratis computerdiagnose auto Beveren-Waas` | Hero, schema, FAQ |
| **Secondary** | `occasiewagen kopen Beveren` | Cars sectie H2 |
| **Secondary** | `depannage Beveren-Waas` | Depannage H2, schema |
| **Long-tail** | `autogarage open op zaterdag Beveren-Waas` | FAQ |
| **Long-tail** | `tweedehands wagen kopen zonder verborgen gebreken Beveren` | FAQ |
| **Long-tail** | `auto onderhoud alle merken Antwerpen Waasland` | Diensten sectie |
| **Geo** | `Beveren-Waas`, `Waasland`, `Sint-Niklaas`, `Antwerpen` | Footer, schema areaServed |

---

## ✅ EINDCHECKLIST — Alle taken voltooid wanneer:

- [ ] `robots.txt` bestaat en correct is
- [ ] `sitemap.xml` bestaat, valide XML, alle URLs aanwezig
- [ ] Hero image `<link rel="preload">` staat als eerste link in `<head>`
- [ ] `og:image` verwijst naar `hero-garage.jpg` (niet logo)
- [ ] `twitter:card` is `summary_large_image`
- [ ] Hreflang tags aanwezig
- [ ] `<address>` tag in footer
- [ ] Exact 1 H1 op pagina
- [ ] FAQ H2 bevat "Beveren-Waas"
- [ ] `seo.js` syntax check slaagt: `node --check js/seo.js`
- [ ] AutoDealer gebruikt `["AutoDealer", "AutoRepair"]` array
- [ ] `GeoCoordinates` aanwezig in schema
- [ ] `openingHoursSpecification` als object (niet string)
- [ ] `BreadcrumbList` schema aanwezig
- [ ] `Car` schema per voertuig (niet Product)
- [ ] `itemCondition: UsedCondition` op elk voertuig
- [ ] FAQPage heeft ≥ 7 vragen
- [ ] Alle `<img>` hebben width + height attributen
- [ ] Sitemap versienummer bijgewerkt na elke release
