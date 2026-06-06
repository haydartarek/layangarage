/* ============================================================
   LAYAN GARAGE BV — Admin Social Generator
   ============================================================ */

(function adminSocialGeneratorModule() {
  const CONTACT = {
    phone: '0486 89 00 02',
    website: 'https://layangaragebv.be',
    address: 'Albert Panisstraat 130\n9120 Beveren-Waas'
  };

  function title(vehicle) {
    return vehicle.title || `${vehicle.brand || ''} ${vehicle.model || ''}`.trim();
  }

  function slug(vehicle) {
    if (vehicle.slug) return vehicle.slug;
    return String(title(vehicle) || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90);
  }

  function vehicleUrl(vehicle) {
    if (vehicle.isVisible === false) return `${CONTACT.website}/#cars`;
    return `${CONTACT.website}/#wagen/${encodeURIComponent(slug(vehicle))}`;
  }

  function description(vehicle) {
    if (vehicle.description?.trim()) return vehicle.description.trim();
    const features = (vehicle.extras || []).slice(0, 4).join(', ');
    const condition = conditionLabel(vehicle).toLowerCase();
    const power = vehicle.vermogen ? ` met ${vehicle.vermogen}` : '';
    return `${title(vehicle)} is een ${condition} voertuig met ${vehicle.fuel || 'betrouwbare motorisatie'}${power} en ${vehicle.transmission || 'praktische transmissie'}. Deze wagen wordt aangeboden door Layan Garage BV in Beveren-Waas.${features ? ` Uitgerust met onder andere ${features}.` : ''}`;
  }

  function conditionLabel(vehicle) {
    return vehicle.condition === 'new' ? 'Nieuw' : 'Gebruikt';
  }

  function statusLabel(status) {
    return {
      beschikbaar: 'Beschikbaar',
      gereserveerd: 'Gereserveerd',
      verkocht: 'Verkocht',
      available: 'Beschikbaar',
      reserved: 'Gereserveerd',
      sold: 'Verkocht'
    }[status] || status || 'Beschikbaar';
  }

  function specs(vehicle) {
    return [
      ['Conditie', conditionLabel(vehicle)],
      ['Bouwjaar', vehicle.year],
      ['Kilometerstand', vehicle.mileage],
      ['Brandstof', vehicle.fuel],
      ['Motor', vehicle.engine],
      ['Vermogen', vehicle.vermogen],
      ['Transmissie', vehicle.transmission],
      ['Euronorm', vehicle.environmentalClass || vehicle.euroNorm],
      ['Zitplaatsen', vehicle.seats],
      ['Status', statusLabel(vehicle.status)]
    ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  }

  function featureLines(vehicle, limit = 99) {
    const items = (vehicle.extras || []).slice(0, limit);
    return items.length ? items.map(item => `• ${item}`).join('\n') : '• Contacteer ons voor de volledige uitrusting';
  }

  function generateFacebook(vehicle) {
    return `🚗 ${title(vehicle)}

💰 ${vehicle.price || 'Prijs op aanvraag'}

🔗 ${vehicleUrl(vehicle)}

${description(vehicle)}

📌 Specificaties

${specs(vehicle).map(([label, value]) => `• ${label}: ${value}`).join('\n')}

✅ Opties

${featureLines(vehicle)}

Voor meer details, bekijk deze wagen via:
${vehicleUrl(vehicle)}

📍 Layan Garage BV
${CONTACT.address}

📞 ${CONTACT.phone}

🌐 ${CONTACT.website}`;
  }
  function generateInstagram(vehicle) {
    const tags = [
      '#LayanGarageBV',
      '#TweedehandsAuto',
      '#AutoTeKoop',
      '#Occasiewagen',
      vehicle.brand ? `#${vehicle.brand.replace(/\s+/g, '')}` : '',
      '#BeverenWaas',
      '#Antwerpen',
      '#Waasland'
    ].filter(Boolean).join(' ');

    return `🚗 ${title(vehicle)}

💰 ${vehicle.price || 'Prijs op aanvraag'}

🔗 ${vehicleUrl(vehicle)}

${description(vehicle)}

📌 ${conditionLabel(vehicle)} | ${vehicle.year || '-'} | ${vehicle.mileage || '-'} | ${vehicle.fuel || '-'} | ${vehicle.transmission || '-'}
${vehicle.vermogen ? `⚡ Vermogen: ${vehicle.vermogen}\n` : ''}

✅ ${(vehicle.extras || []).slice(0, 5).join(' · ') || 'Mooie uitrusting'}

📍 Beveren-Waas
📞 ${CONTACT.phone}

🌐 layangaragebv.be

${tags}`;
  }

  function generateWhatsApp(vehicle) {
    return `🚗 ${title(vehicle)}

💰 ${vehicle.price || 'Prijs op aanvraag'}

${description(vehicle)}

📌 Specificaties
${specs(vehicle).map(([label, value]) => `• ${label}: ${value}`).join('\n')}

✅ Belangrijkste opties
${featureLines(vehicle, 8)}

Voor meer details, bekijk deze wagen via:
${vehicleUrl(vehicle)}

📍 Layan Garage BV
${CONTACT.address}

📞 ${CONTACT.phone}

🌐 ${CONTACT.website}

Interesse? Neem gerust contact met ons op voor meer informatie.`;
  }

  function generateAll(vehicle) {
    return {
      facebook: generateFacebook(vehicle),
      instagram: generateInstagram(vehicle),
      whatsapp: generateWhatsApp(vehicle)
    };
  }

  window.LayanSocialGenerator = {
    generateFacebook,
    generateInstagram,
    generateWhatsApp,
    generateAll
  };
})();
