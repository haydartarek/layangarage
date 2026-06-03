/* ===========================
   SEO | JSON-LD Schema Injection
   =========================== */

/**
 * Inject Product schema for each vehicle
 */
function injectVehicleSchemaScripts() {
    const vehicles = window.availableCars;
    if (!Array.isArray(vehicles) || !vehicles.length) {
        return;
    }

    document
        .querySelectorAll('script[data-vehicle-schema="true"]')
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

        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${title} ${car.year}`,
            "description": `${title} | ${car.year} | ${car.mileage} | ${car.fuel} | ${car.environmentalClass}`,
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

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-vehicle-schema", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    });
}

/**
 * Run on DOM ready
 */
document.addEventListener("DOMContentLoaded", () => {
    injectVehicleSchemaScripts();
});

window.addEventListener("vehicles:loaded", () => {
    injectVehicleSchemaScripts();
});
