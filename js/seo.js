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
        "@type": "WebSite",
        "name": "Layan Garage BV",
        "alternateName": "Layan Garage",
        "url": "https://layangaragebv.be/",
        "inLanguage": "nl-BE",
        "publisher": {
            "@type": "Organization",
            "name": "Layan Garage BV",
            "logo": {
                "@type": "ImageObject",
                "url": "https://layangaragebv.be/assets/logo/logo.png",
                "width": 500,
                "height": 129
            }
        }
    }, "website");

    appendJsonLdSchema({
        "@context": "https://schema.org",
        "@type": ["AutoDealer", "AutoRepair"],
        "name": "Layan Garage BV",
        "url": "https://layangaragebv.be/",
        "logo": "https://layangaragebv.be/assets/logo/logo.png",
        "image": "https://layangaragebv.be/assets/images/share-layan-garage.jpg",
        "description": "Layan Garage BV is een autogarage in Beveren-Waas voor gecontroleerde occasiewagens, auto onderhoud alle merken, gratis computerdiagnose, depannage, remmen, banden en airconditioning in de regio Antwerpen en Waasland.",
        "keywords": [
            "autogarage Beveren-Waas",
            "occasiewagen kopen Beveren",
            "tweedehands auto Waasland",
            "gratis computerdiagnose auto Beveren-Waas",
            "auto onderhoud alle merken Beveren",
            "depannage Beveren-Waas",
            "pechhulp Antwerpen Waasland",
            "airconditioning auto Beveren",
            "banden wisselen Beveren-Waas",
            "auto verkopen Waasland eerlijke prijs"
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
            "latitude": 51.20639,
            "longitude": 4.24278
        },
        "hasMap": "https://www.google.com/maps/search/?api=1&query=Albert%20Panisstraat%20130%2C%209120%20Beveren-Waas%2C%20Belgium",
        "areaServed": [
            "Beveren-Waas",
            "Antwerpen",
            "Waasland",
            "Sint-Niklaas",
            "Mechelen",
            "Gent"
        ],
        "priceRange": "$$",
        "openingHours": "Mo-Sa 09:00-18:00",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "https://schema.org/Monday",
                    "https://schema.org/Tuesday",
                    "https://schema.org/Wednesday",
                    "https://schema.org/Thursday",
                    "https://schema.org/Friday",
                    "https://schema.org/Saturday"
                ],
                "opens": "09:00:00",
                "closes": "18:00:00"
            }
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
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Gratis computerdiagnose auto Beveren-Waas",
                        "serviceType": "Computerdiagnose en motordiagnose"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Auto onderhoud alle merken Beveren",
                        "serviceType": "Onderhoud en herstellingen"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Depannage Beveren-Waas",
                        "serviceType": "Depannage, pechhulp en takeldienst"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Product",
                        "name": "Gecontroleerde occasiewagens in Beveren"
                    }
                }
            ]
        }
    }, "auto-dealer");

    appendJsonLdSchema({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Kan ik mijn wagen verkopen bij Layan Garage BV in Beveren-Waas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, wij kopen tweedehands wagens aan. Breng uw wagen langs of bel ons voor een snelle en eerlijke beoordeling. Zo kunt u uw auto verkopen aan een garage in het Waasland zonder onduidelijke afspraken."
                }
            },
            {
                "@type": "Question",
                "name": "Bieden jullie auto onderhoud aan voor alle merken in Beveren?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, Layan Garage BV verzorgt onderhoud, diagnose en herstellingen voor alle merken personenwagens en lichte bedrijfswagens in Beveren-Waas, Antwerpen en de ruime regio."
                }
            },
            {
                "@type": "Question",
                "name": "Kan ik een afspraak maken voor een gratis computerdiagnose?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, u kunt bellen op 0486 89 00 02 of ons contactformulier invullen voor een computerdiagnose van uw auto. Wij reageren zo snel mogelijk voor een afspraak op maat."
                }
            },
            {
                "@type": "Question",
                "name": "Is jullie autogarage open op zaterdag in Beveren-Waas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, wij zijn open op zaterdag van 09:00 tot 18:00."
                }
            },
            {
                "@type": "Question",
                "name": "Kan ik een gecontroleerde occasiewagen kopen zonder verborgen gebreken?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wij controleren onze tweedehandswagens zorgvuldig en communiceren duidelijk over de staat, prijs en voorwaarden. U kunt de wagen bekijken, vragen stellen en in overleg een proefrit maken."
                }
            },
            {
                "@type": "Question",
                "name": "Helpen jullie bij depannage of pechhulp in het Waasland?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, bij panne, startproblemen of een wagen die niet veilig verder kan rijden, kunt u ons rechtstreeks bellen of via WhatsApp contacteren voor depannage, advies en verdere hulp."
                }
            },
            {
                "@type": "Question",
                "name": "Kan ik mijn airco of banden laten controleren in Beveren-Waas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, u kunt bij ons terecht voor airconditioning, banden wisselen, wielcontrole en algemeen onderhoud. We combineren dit indien gewenst met een bredere controle van uw voertuig."
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
        "name": "Depannage en pechhulp in Beveren-Waas",
        "serviceType": "Depannage, pechhulp en takeldienst in Beveren-Waas, Antwerpen en Waasland",
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
        "description": "Depannage en praktische pechhulp voor bestuurders in Beveren-Waas, Antwerpen en het Waasland met panne, startproblemen of voertuigen die niet veilig verder kunnen rijden."
    };

    appendJsonLdSchema(schema, "depannage-service");
}

function getVehicleEnginePowerSchema(vermogen) {
    const match = String(vermogen || "").match(/(\d+(?:[.,]\d+)?)\s*kW/i);
    if (!match) return null;

    return {
        "@type": "QuantitativeValue",
        "value": Number(match[1].replace(",", ".")),
        "unitCode": "KWT",
        "unitText": "kW"
    };
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
        const numericPrice = String(car.price || "").replace(/[^\d]/g, "");
        const hasPrice = numericPrice.length > 0;
        const rawImage = window.LayanVehicleStore?.getVehicleCoverImage?.(car)
            || (Array.isArray(car.images) && car.images.length ? car.images[0] : "")
            || car.coverImage
            || "assets/images/hero-garage.jpg";
        const mainImage = /^https?:\/\//i.test(rawImage) || rawImage.startsWith("assets/")
            ? rawImage
            : "assets/images/hero-garage.jpg";
        const absoluteImage = /^https?:\/\//i.test(mainImage)
            ? mainImage
            : `https://layangaragebv.be/${mainImage}`;
        const title = car.title || `${car.brand} ${car.model}`.trim();
        const baseVehicleDescription = car.description && String(car.description).trim()
            ? String(car.description).trim()
            : `${title} | ${car.year} | ${car.mileage} | ${car.fuel} | ${car.environmentalClass}`;
        const vehicleDescription = car.vermogen
            ? `${baseVehicleDescription} Vermogen: ${car.vermogen}.`
            : baseVehicleDescription;

        const mileageValue = String(car.mileage || "")
            .replace(/[^\d.,]/g, "")
            .replace(/[.,](?=\d{3}\b)/g, "")
            .replace(",", ".");
        const numericMileage = Number.parseFloat(mileageValue);
        const isUsedVehicle = car.condition !== "nieuw" && car.condition !== "new";
        const statusKey = String(car.status || "").toLowerCase();
        const enginePower = getVehicleEnginePowerSchema(car.vermogen);

        const schema = {
            "@context": "https://schema.org",
            "@type": ["Product", "Car"],
            "name": `${title} ${car.year}`,
            "description": vehicleDescription,
            "image": absoluteImage,
            "sku": car.slug || car.folder || String(car.id),
            "brand": {
                "@type": "Brand",
                "name": car.brand
            },
            "model": car.model || title,
            "vehicleModelDate": car.year,
            "itemCondition": isUsedVehicle
                ? "https://schema.org/UsedCondition"
                : "https://schema.org/NewCondition",
            ...(Number.isFinite(numericMileage) ? {
                "mileageFromOdometer": {
                    "@type": "QuantitativeValue",
                    "value": numericMileage,
                    "unitCode": "KMT"
                }
            } : {}),
            ...(car.fuel ? { "fuelType": car.fuel } : {}),
            ...(car.transmission ? { "vehicleTransmission": car.transmission } : {}),
            ...((car.transmission || car.engine) ? {
                "vehicleEngine": {
                    "@type": "EngineSpecification",
                    ...(car.engine ? { "name": car.engine } : {}),
                    ...(enginePower ? { "enginePower": enginePower } : {}),
                    ...(car.fuel ? { "fuelType": car.fuel } : {})
                }
            } : {}),
            "offers": {
                "@type": "Offer",
                "url": car.slug
                    ? `https://layangaragebv.be/#wagen/${car.slug}`
                    : "https://layangaragebv.be/#cars",
                "priceCurrency": "EUR",
                ...(hasPrice ? { "price": numericPrice } : {}),
                "availability": statusKey === "beschikbaar"
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
                ...(car.vermogen ? [{ "@type": "PropertyValue", "name": "Vermogen", "value": car.vermogen }] : []),
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
