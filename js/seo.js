/* ===========================
   SEO | JSON-LD Schema Injection
   =========================== */

function appendJsonLdSchema(schema, markerName) {
    const existingScript = document.querySelector(`script[data-schema="${markerName}"]`);
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-schema", markerName);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

/**
 * Inject static site schemas
 */
function injectStaticSchemaScripts() {
    appendJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        "additionalType": "https://schema.org/AutoRepair",
        "name": "Layan Garage BV",
        "url": "https://layangaragebv.be/",
        "logo": "https://layangaragebv.be/assets/logo/logo.png",
        "image": "https://layangaragebv.be/assets/logo/logo.png",
        "description": "Layan Garage BV in Beveren-Waas helpt klanten met tweedehands wagens, onderhoud, diagnose, herstellingen, banden, remmen en airconditioning in de regio Antwerpen en Waasland.",
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
        "areaServed": [
            "Beveren-Waas",
            "Antwerpen",
            "Waasland",
            "Sint-Niklaas",
            "Mechelen",
            "Gent"
        ],
        "priceRange": "$$",
        "openingHours": "Mo-Sa 09:00-18:00"
    }, "auto-dealer");

    appendJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Kan ik mijn wagen verkopen bij Layan Garage BV?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, wij kopen tweedehands wagens aan. Breng uw wagen langs of bel ons voor een snelle en eerlijke beoordeling."
                }
            },
            {
                "@type": "Question",
                "name": "Bieden jullie onderhoud aan voor alle merken?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, Layan Garage BV verzorgt onderhoud, diagnose en herstellingen voor alle merken personenwagens en lichte bedrijfswagens."
                }
            },
            {
                "@type": "Question",
                "name": "Kan ik een afspraak maken?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, u kunt bellen op 0486 89 00 02 of ons contactformulier invullen voor een afspraak."
                }
            },
            {
                "@type": "Question",
                "name": "Werken jullie op zaterdag?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, wij zijn open op zaterdag van 09:00 tot 18:00."
                }
            }
        ]
    }, "faq-page");
}

/**
 * Inject Service schema for Depannage
 */
function injectDepannageServiceSchema() {
    const depannageSection = document.getElementById("depannage");
    if (!depannageSection) return;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Depannage en pechhulp",
        "serviceType": "Depannage, pechhulp en takeldienst",
        "provider": {
            "@type": "AutoDealer",
            "name": "Layan Garage BV",
            "telephone": "+32486890002"
        },
        "areaServed": [
            "Beveren-Waas",
            "Antwerpen",
            "Waasland",
            "Sint-Niklaas",
            "Temse",
            "Lokeren"
        ],
        "description": "Depannage en praktische pechhulp voor bestuurders met panne, startproblemen of voertuigen die niet veilig verder kunnen rijden."
    };

    appendJsonLdSchema(schema, "depannage-service");
}

/**
 * Inject Product schema for each vehicle
 */
function injectVehicleSchemaScripts(vehicleList) {
    const vehicles = Array.isArray(vehicleList) ? vehicleList : window.availableCars;
    if (!Array.isArray(vehicles) || !vehicles.length) {
        return;
    }

    document
        .querySelectorAll('script[data-schema^="vehicle-"]')
        .forEach((existingScript) => existingScript.remove());

    vehicles.forEach((car) => {
        const numericPrice = car.price.replace(/[^\d]/g, "");
        const hasPrice = numericPrice.length > 0;
        const rawImage = Array.isArray(car.images) && car.images.length ? car.images[0] : "assets/images/hero-garage.jpg";
        const mainImage = /^https?:\/\//i.test(rawImage) || rawImage.startsWith("assets/")
            ? rawImage
            : "assets/images/hero-garage.jpg";
        const absoluteImage = /^https?:\/\//i.test(mainImage)
            ? mainImage
            : `https://layangaragebv.be/${mainImage}`;
        const title = car.title || `${car.brand} ${car.model}`.trim();
        const vehicleDescription = car.description && String(car.description).trim()
            ? String(car.description).trim()
            : `${title} | ${car.year} | ${car.mileage} | ${car.fuel} | ${car.environmentalClass}`;

        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${title} ${car.year}`,
            "description": vehicleDescription,
            "image": absoluteImage,
            "sku": car.slug || car.folder || String(car.id),
            "brand": {
                "@type": "Brand",
                "name": car.brand
            },
            "offers": {
                "@type": "Offer",
                "url": "https://layangaragebv.be/#cars",
                "priceCurrency": "EUR",
                ...(hasPrice ? { "price": numericPrice } : {}),
                "availability": car.status === "beschikbaar"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "AutoDealer",
                    "name": "Layan Garage BV"
                }
            },
            "additionalProperty": [
                { "@type": "PropertyValue", "name": "Bouwjaar", "value": car.year },
                { "@type": "PropertyValue", "name": "Kilometerstand", "value": car.mileage },
                { "@type": "PropertyValue", "name": "Brandstof", "value": car.fuel },
                { "@type": "PropertyValue", "name": "Euronorm", "value": car.environmentalClass || car.euroNorm }
            ]
        };

        appendJsonLdSchema(schema, `vehicle-${car.slug || car.folder || car.id}`);
    });
}

/**
 * Run on DOM ready
 */
document.addEventListener("DOMContentLoaded", () => {
    injectStaticSchemaScripts();
    injectDepannageServiceSchema();
    injectVehicleSchemaScripts();
});

window.addEventListener("vehicles:loaded", (event) => {
    injectVehicleSchemaScripts(event.detail?.vehicles);
});
