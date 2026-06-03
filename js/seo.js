/* ===========================
   SEO | JSON-LD Schema Injection
   =========================== */

/**
 * Inject Product schema for each vehicle
 */
function injectVehicleSchemaScripts() {
    if (typeof availableCars === "undefined" || !Array.isArray(availableCars)) {
        return;
    }

    document
        .querySelectorAll('script[data-vehicle-schema="true"]')
        .forEach((existingScript) => existingScript.remove());

    availableCars.forEach((car) => {
        const numericPrice = car.price.replace(/[^\d]/g, "");
        const hasPrice = numericPrice.length > 0;
        const mainImage = `assets/images/cars/${car.folder}/${car.images[0]}`;

        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${car.brand} ${car.model} ${car.year}`,
            "description": `${car.brand} ${car.model} | ${car.year} | ${car.mileage} | ${car.fuel} | ${car.environmentalClass}`,
            "image": `https://layangaragebv.be/${mainImage}`,
            "sku": car.folder,
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
                { "@type": "PropertyValue", "name": "Euronorm", "value": car.environmentalClass }
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
