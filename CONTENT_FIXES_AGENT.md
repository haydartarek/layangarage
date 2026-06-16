# CONTENT FIXES — AI Agent Prompt
# Layan Garage BV · index.html · SEO Content Audit Implementation
# Version: 2026-06 | Language: Dutch (nl_BE)

---

## ROLE

You are a senior SEO content editor implementing verified fixes to `index.html`.
Every change in this file is **surgical**: replace only what is specified, touch nothing else.
You are NOT allowed to rewrite paragraphs, restructure sections, add CSS, or create new files.
The only permitted actions are `str_replace` edits on `index.html` and two schema additions in `js/seo.js`.

---

## RULES — READ BEFORE TOUCHING ANYTHING

1. **Match old strings exactly** — copy from "CURRENT (exact)" fields, character for character including whitespace and HTML entities (`&bull;`, `&#39;`, etc.)
2. **Never** change a line that is not listed in this file
3. **Never** add inline styles, classes, IDs, or attributes not already present
4. **Update `seo.js` schema** where noted — FAQ schema must match HTML text 100%
5. **Run `node --check js/seo.js`** after any seo.js change
6. **Update the script version** in `<script src="js/seo.js?v=YYYYMMDD-N">` — increment N by 1
7. **Update `<lastmod>` in sitemap.xml** to today's date (YYYY-MM-DD)
8. After each fix print: `✅ FIX [number] applied — [element changed]`
9. After all fixes, print a final summary table: Fix # | Element | Status

---

## CONTEXT — WHY THESE CHANGES

The 12-keyword local SEO strategy for Layan Garage BV targets:

| # | Keyword | Status before fix |
|---|---------|-------------------|
| 01 | Gratis motordiagnose Beveren-Waas | ✅ H1 + H3 |
| 02 | Remmen controleren Beveren-Waas | ⚠️ H3 missing "Beveren-Waas" |
| 03 | Airco bijvullen Beveren-Waas | ⚠️ H3 says "Beveren" + no "bijvullen" |
| 04 | Auto verkopen Beveren-Waas eerlijk bod | ⚠️ H3 says "Beveren" only |
| 05 | Olie verversen Beveren-Waas | ❌ H3 has no keyword, no location |
| 06 | Distributieriem vervangen Beveren | ❌ H3 generic, no keyword |
| 07 | Occasiewagen kopen Beveren-Waas proefrit | ⚠️ H2 cars says "Beveren" only |
| 08 | Autogarage open zaterdag Beveren-Waas | ✅ FAQ present |
| 09 | Startproblemen wagen Beveren WhatsApp | ❌ Not in FAQ |
| 10 | Autogarage Beveren-Waas alle merken | ✅ H2 present |
| 11 | Garage Sint-Niklaas omgeving diagnose | ⚠️ Only in schema, not visible text |
| 12 | Pechhulp Waasland bellen WhatsApp | ✅ H2 + depannage section |

**Root cause:** "Beveren" appears without "-Waas" in 6 visible locations — NAP inconsistency.
**Secondary issue:** Keywords #05, #06, #09 completely absent from visible content.

---

## FIXES — EXECUTE IN ORDER, ONE AT A TIME

---

### FIX 01 · Hero Subtitle — NAP fix
**File:** `index.html`
**Element:** `<p class="hero-sub">` · line ~111

**CURRENT (exact):**
```
<p class="hero-sub">Occasiewagen kopen Beveren &bull; Onderhoud alle merken &bull; Depannage Waasland</p>
```

**REPLACE WITH:**
```
<p class="hero-sub">Occasiewagen kopen Beveren-Waas &bull; Onderhoud alle merken &bull; Depannage Waasland</p>
```

---

### FIX 02 · Hero Lead Text — NAP fix
**File:** `index.html`
**Element:** `<p class="hero-lead">` · line ~112

**CURRENT (exact):**
```
<p class="hero-lead">Bij Layan Garage BV helpen wij klanten uit Beveren, Antwerpen, Waasland, Sint-Niklaas,
```

**REPLACE WITH:**
```
<p class="hero-lead">Bij Layan Garage BV helpen wij klanten uit Beveren-Waas, Antwerpen, Waasland, Sint-Niklaas,
```

---

### FIX 03 · Service Tab Olie — H3 keyword fix
**File:** `index.html`
**Element:** `<h3>` inside `#service-oil` tabpanel · line ~303
**Introduces:** keyword #05 `Olie verversen Beveren-Waas`

**CURRENT (exact):**
```
                  <h3>Controleren en vervangen van olie en filters</h3>
```

**REPLACE WITH:**
```
                  <h3>Olie verversen en filters controleren in Beveren-Waas</h3>
```

---

### FIX 04 · Service Tab Riemen — H3 keyword fix
**File:** `index.html`
**Element:** `<h3>` inside `#service-belts` tabpanel · line ~322
**Introduces:** keyword #06 `Distributieriem vervangen Beveren`

**CURRENT (exact):**
```
                  <h3>Onderhoud van riemen en slangen</h3>
```

**REPLACE WITH:**
```
                  <h3>Distributieriem vervangen en riemen onderhoud in Beveren-Waas</h3>
```

---

### FIX 05 · Service Tab Airco — H3 keyword + NAP fix
**File:** `index.html`
**Element:** `<h3>` inside `#service-airco` tabpanel · line ~340
**Fixes:** "Beveren" → "Beveren-Waas" + adds "bijvullen" for keyword #03

**CURRENT (exact):**
```
                  <h3>Airconditioning auto controleren in Beveren</h3>
```

**REPLACE WITH:**
```
                  <h3>Airconditioning auto controleren en bijvullen in Beveren-Waas</h3>
```

---

### FIX 06 · Service Tab Remmen — H3 NAP fix
**File:** `index.html`
**Element:** `<h3>` inside `#service-brakes` tabpanel · line ~360
**Fixes:** Adds "Beveren-Waas" for keyword #02

**CURRENT (exact):**
```
                  <h3>Remmen controleren in de regio Antwerpen en Waasland</h3>
```

**REPLACE WITH:**
```
                  <h3>Remmen controleren en repareren in Beveren-Waas</h3>
```

---

### FIX 07 · Cars Section H2 — NAP fix
**File:** `index.html`
**Element:** `<h2 id="cars-title">` · line ~494

**CURRENT (exact):**
```
          <h2 id="cars-title">Gecontroleerde tweedehands auto&#39;s te koop in Beveren</h2>
```

**REPLACE WITH:**
```
          <h2 id="cars-title">Gecontroleerde tweedehands auto&#39;s te koop in Beveren-Waas</h2>
```

---

### FIX 08 · Aankoop H3 — NAP fix
**File:** `index.html`
**Element:** `<h3>` inside `article#sell-your-car` · line ~457

**CURRENT (exact):**
```
              <h3>Mijn wagen verkopen aan een garage in Beveren voor een eerlijk bod</h3>
```

**REPLACE WITH:**
```
              <h3>Mijn wagen verkopen aan een garage in Beveren-Waas voor een eerlijk bod</h3>
```

---

### FIX 09 · Verkoop H3 — NAP + keyword fix
**File:** `index.html`
**Element:** `<h3>` in second `article.sales-path-card` · line ~473

**CURRENT (exact):**
```
              <h3>Betrouwbare tweedehandswagen kopen zonder verborgen gebreken</h3>
```

**REPLACE WITH:**
```
              <h3>Betrouwbare tweedehandswagen kopen zonder verborgen gebreken in Beveren-Waas</h3>
```

---

### FIX 10 · Depannage List — Add Sint-Niklaas bullet
**File:** `index.html`
**Element:** `<ul class="depannage-points">` · line ~516
**Introduces:** keyword #11 `Garage Sint-Niklaas omgeving` in visible body text

**CURRENT (exact):**
```
            <ul class="depannage-points" aria-label="Depannage voordelen">
              <li>Snelle communicatie bij dringende pech</li>
              <li>Ondersteuning voor diagnose, transport en herstelling</li>
              <li>Service in Beveren-Waas, Antwerpen en de ruime regio</li>
            </ul>
```

**REPLACE WITH:**
```
            <ul class="depannage-points" aria-label="Depannage voordelen">
              <li>Snelle communicatie bij dringende pech</li>
              <li>Ondersteuning voor diagnose, transport en herstelling</li>
              <li>Service in Beveren-Waas, Antwerpen en de ruime regio</li>
              <li>Ook beschikbaar voor bestuurders uit Sint-Niklaas, Lokeren en Temse</li>
            </ul>
```

---

### FIX 11 · FAQ Question 7 — Edit airco question + answer
**File:** `index.html` AND `js/seo.js`
**Element:** 7th `<div class="faq-item">` — the airco/banden question
**Adds:** "bijvullen" to keyword #03 in FAQ

#### 11a — index.html question text

**CURRENT (exact):**
```
              <span>Kan ik mijn airco of banden laten controleren in Beveren-Waas?</span>
```

**REPLACE WITH:**
```
              <span>Kan ik mijn airco laten bijvullen en controleren in Beveren-Waas?</span>
```

#### 11b — index.html answer text

**CURRENT (exact):**
```
              <p>Ja, u kunt bij ons terecht voor airconditioning, banden wisselen, wielcontrole en algemeen onderhoud.
                We combineren dit indien gewenst met een bredere controle van uw voertuig.</p>
```

**REPLACE WITH:**
```
              <p>Ja, u kunt bij ons terecht voor airconditioning bijvullen en controleren, banden wisselen, wielcontrole en algemeen onderhoud.
                We combineren dit indien gewenst met een bredere controle van uw voertuig.</p>
```

#### 11c — js/seo.js FAQPage schema update

In `js/seo.js`, find the FAQPage schema entry:

**CURRENT (exact):**
```
                "name": "Kan ik mijn airco of banden laten controleren in Beveren-Waas?",
```

**REPLACE WITH:**
```
                "name": "Kan ik mijn airco laten bijvullen en controleren in Beveren-Waas?",
```

Also update the matching acceptedAnswer text:

**CURRENT (exact):**
```
                    "text": "Ja, u kunt bij ons terecht voor airconditioning, banden wisselen, wielcontrole en algemeen onderhoud. We combineren dit indien gewenst met een bredere controle van uw voertuig."
```

**REPLACE WITH:**
```
                    "text": "Ja, u kunt bij ons terecht voor airconditioning bijvullen en controleren, banden wisselen, wielcontrole en algemeen onderhoud. We combineren dit indien gewenst met een bredere controle van uw voertuig."
```

---

### FIX 12 · FAQ — Add Question 8 (olie verversen)
**File:** `index.html` AND `js/seo.js`
**Introduces:** keyword #05 `Olie verversen Beveren-Waas` to FAQ

#### 12a — index.html insertion

**LOCATE** this exact string (it's the depannage FAQ item):
```
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span>Helpen jullie bij depannage of pechhulp in het Waasland?</span>
```

**INSERT the following BEFORE that block:**
```
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span>Kan ik de olie laten verversen bij Layan Garage in Beveren-Waas?</span>
              <span class="faq-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg></span>
            </button>
            <div class="faq-answer">
              <p>Ja, u kunt bij ons terecht voor een olieverversing en het vervangen van filters voor alle automerken in Beveren-Waas. Maak een afspraak via telefoon of WhatsApp op 0486 89 00 02.</p>
            </div>
          </div>
```

#### 12b — js/seo.js FAQPage schema addition

In `js/seo.js`, find the FAQPage schema `mainEntity` array.
Add this object **before** the closing `]` of the array (after the last existing question):

```json
{
  "@type": "Question",
  "name": "Kan ik de olie laten verversen bij Layan Garage in Beveren-Waas?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Ja, u kunt bij ons terecht voor een olieverversing en het vervangen van filters voor alle automerken in Beveren-Waas. Maak een afspraak via telefoon of WhatsApp op 0486 89 00 02."
  }
}
```

---

### FIX 13 · FAQ — Add Question 9 (startproblemen)
**File:** `index.html` AND `js/seo.js`
**Introduces:** keyword #09 `Startproblemen wagen Beveren WhatsApp` to FAQ

#### 13a — index.html insertion

**LOCATE** the closing of `<div class="faq-grid">` — find this exact sequence:
```
        </div>
      </div>
    </section>

  </main>
```

The `</div>` that closes `faq-grid` is the one immediately before `</div>` for container and `</section>`.
**INSERT the following BEFORE that closing `</div>`:**

```
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
              <span>Wat moet ik doen bij startproblemen met mijn wagen in Beveren-Waas?</span>
              <span class="faq-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg></span>
            </button>
            <div class="faq-answer">
              <p>Bel ons direct op 0486 89 00 02 of stuur een WhatsApp-bericht. Wij helpen u snel verder met diagnose, pechhulp of transport naar onze werkplaats in Beveren-Waas.</p>
            </div>
          </div>
```

#### 13b — js/seo.js FAQPage schema addition

In `js/seo.js`, add this as the final entry in the FAQPage `mainEntity` array:

```json
{
  "@type": "Question",
  "name": "Wat moet ik doen bij startproblemen met mijn wagen in Beveren-Waas?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Bel ons direct op 0486 89 00 02 of stuur een WhatsApp-bericht. Wij helpen u snel verder met diagnose, pechhulp of transport naar onze werkplaats in Beveren-Waas."
  }
}
```

---

### FIX 14 · Footer Lead Paragraph — NAP fix (CRITICAL)
**File:** `index.html`
**Element:** First `<p>` in first `<div class="footer-col">` · line ~853
**Priority:** CRITICAL — footer NAP is read by Google as primary location signal

**CURRENT (exact):**
```
          <p>Layan Garage BV in Beveren staat voor onderhoud, diagnose, herstellingen en de aan- of verkoop van
            tweedehands wagens met een eerlijke en persoonlijke service.</p>
```

**REPLACE WITH:**
```
          <p>Layan Garage BV in Beveren-Waas staat voor onderhoud, diagnose, herstellingen en de aan- of verkoop van
            tweedehands wagens met een eerlijke en persoonlijke service.</p>
```

---

## POST-FIX VALIDATION — run all after completing all 14 fixes

```bash
# 1. JS syntax
node --check js/seo.js && echo "✅ seo.js OK"

# 2. Sitemap XML
xmllint --noout sitemap.xml && echo "✅ sitemap OK"

# 3. NAP deviation check — should return ZERO results
grep -n 'Beveren[^-]' index.html | grep -v '<!--\|alt=\|href=\|class=\|id=\|src=' | grep -v 'Bev\b'

# 4. FAQ count — expected: 9
grep -c 'class="faq-item"' index.html

# 5. FAQPage schema question count — expected: 9
grep -c '"@type": "Question"' js/seo.js

# 6. Keyword coverage — all should return >= 1
grep -c "computerdiagnose" index.html
grep -c "bijvullen" index.html
grep -c "Olie verversen\|olie laten verversen" index.html
grep -c "Distributieriem\|distributieriem" index.html
grep -c "startproblemen\|Startproblemen" index.html
grep -c "Sint-Niklaas" index.html
grep -c "proefrit" index.html

# 7. Schema ↔ HTML match check for FAQ Q7
grep "Kan ik mijn airco" index.html
grep "Kan ik mijn airco" js/seo.js
# Both lines must read: "bijvullen en controleren"
```

---

## EXPECTED OUTCOME AFTER ALL 14 FIXES

| Metric | Before | After |
|--------|--------|-------|
| "Beveren" NAP deviations in visible text | 6 | 0 |
| Keywords missing from H3 headings | 3 | 0 |
| FAQ questions | 7 | 9 |
| Keywords fully present in FAQ | 7 / 12 | 10 / 12 |
| Keyword #05 (olie verversen) visible | ❌ | ✅ |
| Keyword #06 (distributieriem) in H3 | ❌ | ✅ |
| Keyword #09 (startproblemen) in FAQ | ❌ | ✅ |
| FAQPage schema entries | 7 | 9 |
| Schema ↔ HTML FAQ text match | partial | 100% |
| Sint-Niklaas in visible body text | ❌ | ✅ |

---

## FORBIDDEN ACTIONS

- ❌ Do NOT rewrite paragraph body text beyond what is specified
- ❌ Do NOT add new sections, divs, wrappers, or HTML structure
- ❌ Do NOT modify CSS files or add `style=""` attributes
- ❌ Do NOT change any `id=""`, `class=""`, `aria-*`, or `role=""` attributes
- ❌ Do NOT touch any JavaScript files EXCEPT the targeted schema edits in `js/seo.js` noted in FIX 11, 12, 13
- ❌ Do NOT modify `sitemap.xml` EXCEPT updating `<lastmod>` date
- ❌ Do NOT change image `src`, `alt`, `width`, or `height` attributes
- ❌ Do NOT add keyword stuffing — each keyword appears naturally once per fix
- ❌ Do NOT change the H1 — it is already perfect
