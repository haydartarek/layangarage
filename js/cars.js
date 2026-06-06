/* ============================================================
   LAYAN GARAGE BV — cars.js  v2
   Vehicle Data | Cards | Modal | Gallery
   ============================================================ */

let availableCars = [
  {
    id: 1,
    brand: 'Volkswagen', model: 'Golf 8 1.5 eHybrid OPF DSG Goal',
    year: '2025', mileage: '18.446 km',
    fuel: 'Hybride', engine: '1.5 eTSI 150PK', environmentalClass: 'Euro 6d',
    transmission: 'Automaat DSG', seats: 5,
    price: '€ 29.900', status: 'beschikbaar',
    folder: 'volkswagen-golf-8-ehybrid-dsg-goal',
    images: [
      'volkswagen-golf-8-ehybrid-dsg-goal-exterieur-voor.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-exterieur-zij.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-exterieur-achter.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-interieur-dashboard.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-interieur-stoelen.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-motor.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-kofferruimte.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-navigatie.jpg',
      'volkswagen-golf-8-ehybrid-dsg-goal-velgen.jpg'
    ],
    extras: ['Hybride', 'Navigatie', 'Camera', 'Massage zetel', 'Radar', 'Trekhaak', 'VW Garantie', 'Cruise control', 'Zetelverwarming']
  },
  {
    id: 2,
    brand: 'Ford', model: 'S-Max 1.5 EcoBoost Business',
    year: '2017', mileage: '147.650 km',
    fuel: 'Benzine', engine: '1498cc 160PK', environmentalClass: 'Euro 6b',
    transmission: 'Handgeschakeld', seats: 7,
    price: '€ 12.000', status: 'beschikbaar',
    folder: 'ford-s-max-1-5-ecoboost-business',
    images: [
      'ford-s-max-1-5-ecoboost-business-exterieur-voor.jpg',
      'ford-s-max-1-5-ecoboost-business-exterieur-zij.jpg',
      'ford-s-max-1-5-ecoboost-business-exterieur-achter.jpg',
      'ford-s-max-1-5-ecoboost-business-interieur-dashboard.jpg',
      'ford-s-max-1-5-ecoboost-business-interieur-stoelen.jpg',
      'ford-s-max-1-5-ecoboost-business-motor.jpg',
      'ford-s-max-1-5-ecoboost-business-7-zitplaatsen.jpg',
      'ford-s-max-1-5-ecoboost-business-kofferruimte.jpg',
      'ford-s-max-1-5-ecoboost-business-navigatie.jpg',
      'ford-s-max-1-5-ecoboost-business-camera.jpg',
      'ford-s-max-1-5-ecoboost-business-velgen.jpg'
    ],
    extras: ['7 Zitplaatsen', 'Navigatie', 'Camera', 'Stuurverwarming', 'Zetelverwarming', 'Nieuwe distributieriem', 'Garantie 1 jaar']
  },
  {
    id: 3,
    brand: 'Volkswagen', model: 'Golf Cabriolet Cup 1.4 TSI Automaat',
    year: '2015', mileage: '141.470 km',
    fuel: 'Benzine', engine: '1390cc 122PK', environmentalClass: 'Euro 6',
    transmission: 'Automaat', seats: 4,
    price: '€ 10.400', status: 'beschikbaar',
    folder: 'volkswagen-golf-cabriolet-cup-automaat',
    images: [
      'volkswagen-golf-cabriolet-cup-automaat-exterieur-voor.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-exterieur-zij.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-exterieur-achter.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-interieur-dashboard.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-interieur-stoelen.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-motor.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-kofferruimte.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-dak-open.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-velgen.jpg',
      'volkswagen-golf-cabriolet-cup-automaat-detail.jpg'
    ],
    extras: ['Cabriolet', 'Xenon', 'Navigatie', 'Cruise control', 'Airco', 'Parkeersensor', 'Zetelverwarming']
  },
  {
    id: 4,
    brand: 'Volkswagen', model: 'Scirocco 1.4 TSI DSG',
    year: '2011', mileage: '132.970 km',
    fuel: 'Benzine', engine: '1390cc 160PK', environmentalClass: 'Euro 5',
    transmission: 'Automaat DSG', seats: 4,
    price: '€ 9.400', status: 'beschikbaar',
    folder: 'volkswagen-scirocco-1-4-tsi-dsg',
    images: [
      'volkswagen-scirocco-1-4-tsi-dsg-exterieur-voor.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-exterieur-zij.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-exterieur-achter.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-interieur-dashboard.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-interieur-stoelen.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-motor.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-kofferruimte.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-velgen.jpg',
      'volkswagen-scirocco-1-4-tsi-dsg-detail.jpg'
    ],
    extras: ['Sportstoelen', 'Navigatie', 'Airco', 'Parkeersensor', 'Alarm', 'Zetelverwarming']
  },
  {
    id: 5,
    brand: 'Volkswagen', model: 'Golf 6 1.4 TSI 122PK',
    year: '2011', mileage: '123.750 km',
    fuel: 'Benzine', engine: '1390cc 122PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 6.700', status: 'beschikbaar',
    folder: 'volkswagen-golf-6-1-4-tsi-122pk',
    images: [
      'volkswagen-golf-6-1-4-tsi-122pk-exterieur-voor.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-exterieur-zij.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-exterieur-achter.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-interieur-dashboard.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-interieur-stoelen.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-motor.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-kofferruimte.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-velgen.jpg',
      'volkswagen-golf-6-1-4-tsi-122pk-detail.jpg'
    ],
    extras: ['Bi-Xenon', 'Navigatie', 'Leder', 'Cruise control', 'Airco', 'Zetelverwarming']
  },
  {
    id: 6,
    brand: 'Volkswagen', model: 'Golf 1.2 TSI 105PK',
    year: '2012', mileage: '111.670 km',
    fuel: 'Benzine', engine: '1.197cc 105PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 6.700', status: 'beschikbaar',
    folder: 'volkswagen-golf-1-2-tsi-105pk',
    images: [
      'volkswagen-golf-1-2-tsi-105pk-exterieur-voor.jpg',
      'volkswagen-golf-1-2-tsi-105pk-exterieur-zij.jpg',
      'volkswagen-golf-1-2-tsi-105pk-exterieur-achter.jpg',
      'volkswagen-golf-1-2-tsi-105pk-interieur-dashboard.jpg',
      'volkswagen-golf-1-2-tsi-105pk-interieur-stoelen.jpg',
      'volkswagen-golf-1-2-tsi-105pk-motor.jpg',
      'volkswagen-golf-1-2-tsi-105pk-kofferruimte.jpg',
      'volkswagen-golf-1-2-tsi-105pk-trekhaak.jpg',
      'volkswagen-golf-1-2-tsi-105pk-velgen.jpg'
    ],
    extras: ['Trekhaak', 'Cruise control', 'Airco', 'Parkeersensor']
  },
  {
    id: 7,
    brand: 'Volkswagen', model: 'Golf 1.2 TSI',
    year: '2012', mileage: '141.970 km',
    fuel: 'Benzine', engine: '1.197cc 105PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 6.700', status: 'beschikbaar',
    folder: 'volkswagen-golf-1-2-tsi-2012',
    images: [
      'volkswagen-golf-1-2-tsi-2012-exterieur-voor.jpg',
      'volkswagen-golf-1-2-tsi-2012-exterieur-zij.jpg',
      'volkswagen-golf-1-2-tsi-2012-exterieur-achter.jpg',
      'volkswagen-golf-1-2-tsi-2012-interieur-dashboard.jpg',
      'volkswagen-golf-1-2-tsi-2012-interieur-stoelen.jpg',
      'volkswagen-golf-1-2-tsi-2012-motor.jpg',
      'volkswagen-golf-1-2-tsi-2012-kofferruimte.jpg',
      'volkswagen-golf-1-2-tsi-2012-velgen.jpg',
      'volkswagen-golf-1-2-tsi-2012-detail.jpg',
      'volkswagen-golf-1-2-tsi-2012-interieur-detail.jpg'
    ],
    extras: ['Android Auto', 'Apple Carplay', 'Cruise control', 'Airco', 'Parkeersensor']
  },
  {
    id: 8,
    brand: 'Volkswagen', model: 'Golf 6 1.2 TSI Turbo',
    year: '2011', mileage: '149.250 km',
    fuel: 'Benzine', engine: '1.197 TSI 105PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 6.400', status: 'beschikbaar',
    folder: 'volkswagen-golf-6-1-2-tsi-turbo',
    images: [
      'volkswagen-golf-6-1-2-tsi-turbo-exterieur-voor.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-exterieur-zij.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-exterieur-achter.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-interieur-dashboard.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-interieur-stoelen.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-motor.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-kofferruimte.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-open-dak.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-velgen.jpg',
      'volkswagen-golf-6-1-2-tsi-turbo-interieur-detail.jpg'
    ],
    extras: ['Open dak', 'Cruise control', 'Airco', 'Parkeersensor', 'Zetelverwarming']
  },
  {
    id: 9,
    brand: 'Volkswagen', model: 'Golf 1.4 TSI 122PK',
    year: '2011', mileage: '150.105 km',
    fuel: 'Benzine', engine: '1390 TSI 122PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 6.400', status: 'beschikbaar',
    folder: 'volkswagen-golf-1-4-tsi-2011',
    images: [
      'volkswagen-golf-1-4-tsi-2011-exterieur-voor.jpg',
      'volkswagen-golf-1-4-tsi-2011-exterieur-zij.jpg',
      'volkswagen-golf-1-4-tsi-2011-exterieur-achter.jpg',
      'volkswagen-golf-1-4-tsi-2011-interieur-dashboard.jpg',
      'volkswagen-golf-1-4-tsi-2011-interieur-stoelen.jpg',
      'volkswagen-golf-1-4-tsi-2011-motor.jpg',
      'volkswagen-golf-1-4-tsi-2011-kofferruimte.jpg',
      'volkswagen-golf-1-4-tsi-2011-open-dak.jpg',
      'volkswagen-golf-1-4-tsi-2011-velgen.jpg',
      'volkswagen-golf-1-4-tsi-2011-interieur-detail.jpg',
      'volkswagen-golf-1-4-tsi-2011-exterieur-detail.jpg',
      'volkswagen-golf-1-4-tsi-2011-cockpit.jpg'
    ],
    extras: ['Open dak', 'Cruise control', 'Airco', 'Parkeersensor', 'Zetelverwarming']
  },
  {
    id: 10,
    brand: 'Volkswagen', model: 'Golf 6 TSI 1.2',
    year: '2012', mileage: '167.450 km',
    fuel: 'Benzine', engine: '1.197 TSI 85PK', environmentalClass: 'Euro 5',
    transmission: 'Handgeschakeld', seats: 5,
    price: '€ 5.400', status: 'beschikbaar',
    folder: 'volkswagen-golf-6-tsi-1-2-zwart',
    images: [
      'volkswagen-golf-6-tsi-1-2-zwart-exterieur-voor.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-exterieur-zij.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-exterieur-achter.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-interieur-dashboard.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-interieur-stoelen.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-motor.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-kofferruimte.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-trekhaak.jpg',
      'volkswagen-golf-6-tsi-1-2-zwart-velgen.jpg'
    ],
    extras: ['Trekhaak', 'Airco', 'Parkeersensor', 'Boordcomputer']
  }
];

/* ── HELPERS ── */
const STATUS_LABEL = {
  beschikbaar: 'Beschikbaar',
  gereserveerd: 'Gereserveerd',
  verkocht: 'Verkocht',
  bieden: 'Bod uitbrengen'
};
const CONDITION_LABEL = { new: 'Nieuw', used: 'Gebruikt' };
const FALLBACK_VEHICLE_IMAGE = 'assets/images/hero-garage.jpg';

const iconCalendar = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const iconSpeed   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l4-4"/></svg>`;
const iconFuel    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M14 10h2a2 2 0 0 1 2 2v3a1 1 0 0 0 2 0v-5l-3-3"/><line x1="3" y1="22" x2="14" y2="22"/></svg>`;
const iconEngine  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7V5m12 2V5M6 17v2m12-2v2"/></svg>`;

function getVehicleTitle(car) {
  return car.title || `${car.brand} ${car.model}`.trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function trackVehicleEvent(eventName, car, params = {}) {
  if (typeof window.gtag !== 'function' || !car) return;
  window.gtag('event', eventName, {
    event_category: 'vehicle',
    car_id: String(car.id),
    car_title: getVehicleTitle(car),
    car_price: car.price,
    car_status: car.status,
    ...params
  });
}

function isRemoteImage(src) {
  return /^https?:\/\//i.test(src) || src.startsWith('assets/');
}

function getVehicleImageSrc(car, image) {
  if (!image) return FALLBACK_VEHICLE_IMAGE;
  return isRemoteImage(image) ? image : FALLBACK_VEHICLE_IMAGE;
}

function getVehicleImages(car) {
  return Array.isArray(car.images) && car.images.length
    ? car.images.map(image => getVehicleImageSrc(car, image))
    : [FALLBACK_VEHICLE_IMAGE];
}

function getVehicleCoverImage(car) {
  if (window.LayanVehicleStore?.getVehicleCoverImage) {
    const cover = window.LayanVehicleStore.getVehicleCoverImage(car);
    if (cover) return getVehicleImageSrc(car, cover);
  }
  const firstOrderedImage = Array.isArray(car.images) && car.images.length ? car.images[0] : '';
  return getVehicleImageSrc(car, firstOrderedImage || car.coverImage);
}

function getRequestedVehicleSlug() {
  try {
    const params = new URLSearchParams(window.location.search);
    const querySlug = params.get('wagen') || params.get('car') || '';
    if (querySlug) return querySlug;

    const hashMatch = window.location.hash.match(/^#wagen\/(.+)$/);
    return hashMatch ? decodeURIComponent(hashMatch[1]) : '';
  } catch {
    return '';
  }
}

function redirectMissingVehicleToCars() {
  const rootPath = window.location.pathname.replace(/[^/]*$/, '');
  window.location.replace(`${rootPath || '/'}#cars`);
}

function openRequestedVehicleFromUrl() {
  const requestedSlug = getRequestedVehicleSlug();
  if (!requestedSlug) return;
  const car = availableCars.find(item => item.slug === requestedSlug || item.folder === requestedSlug);
  if (!car) {
    redirectMissingVehicleToCars();
    return;
  }
  const carsSection = document.getElementById('cars');
  if (carsSection) carsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => openModal(car.id), 450);
}

/* ── CREATE CARD ── */
function createVehicleCard(car) {
  const label       = STATUS_LABEL[car.status] || car.status;
  const isAvailable = car.status === 'beschikbaar';
  const isBieden    = car.status === 'bieden';
  const imgs        = getVehicleImages(car);
  const mainImg     = getVehicleCoverImage(car);
  const title       = getVehicleTitle(car);

  const primaryBtn = isAvailable
    ? `<a href="tel:+32486890002" class="btn btn-primary" data-car-call-id="${car.id}" data-car-contact-source="card">Bel voor info</a>`
    : isBieden
      ? `<a href="tel:+32486890002" class="btn btn-primary" data-car-call-id="${car.id}" data-car-contact-source="card">Breng een bod uit</a>`
      : `<button class="btn btn-dark btn-disabled" disabled>${label}</button>`;

  const article = document.createElement('article');
  article.className = 'vehicle-card';
  article.setAttribute('aria-label', `${title} ${car.year}`);

  article.innerHTML = `
    <button type="button" class="car-image-wrapper" data-car-id="${car.id}"
      aria-label="Bekijk ${imgs.length} foto's van ${title}">
      <img src="${mainImg}"
        alt="${title} ${car.year} te koop bij Layan Garage BV Beveren"
        loading="lazy" width="600" height="338"
        onerror="this.onerror=null;this.src='assets/images/hero-garage.jpg'"/>
      ${imgs.length > 1 ? `<div class="car-photo-count"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> ${imgs.length}</div>` : ''}
    </button>
    <div class="car-body">
      <h3 class="car-title">${title}</h3>
      <div class="car-specs" role="list">
        <div class="spec-item" role="listitem">${iconCalendar} <span>${car.year}</span></div>
        <div class="spec-item" role="listitem">${iconSpeed}   <span>${car.mileage}</span></div>
        <div class="spec-item" role="listitem">${iconFuel}    <span>${car.fuel}</span></div>
        <div class="spec-item" role="listitem">${iconEngine}  <span>${car.engine}</span></div>
      </div>
      <div class="car-status-row">
        <span class="status-badge status-${car.status}">${label}</span>
      </div>
      <div class="car-price" aria-label="Prijs: ${car.price}">${car.price}</div>
      <div class="car-actions">
        ${primaryBtn}
        <button class="btn btn-outline" data-car-id="${car.id}">Meer info</button>
      </div>
    </div>`;

  return article;
}

/* ── MODAL ── */
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'car-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Voertuig details');
  modal.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal-inner">
      <button class="modal-close" id="modal-close" aria-label="Sluiten">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="modal-gallery">
        <div class="gallery-main">
          <img id="modal-main-img" src="assets/images/hero-garage.jpg"
            alt="Voertuigfoto bij Layan Garage BV" loading="eager"
            onerror="this.onerror=null;this.src='assets/images/hero-garage.jpg'"/>
          <button class="gallery-nav gallery-prev" id="gallery-prev" aria-label="Vorige foto">&#8592;</button>
          <button class="gallery-nav gallery-next" id="gallery-next" aria-label="Volgende foto">&#8594;</button>
          <div class="gallery-counter" id="gallery-counter">1 / 1</div>
        </div>
        <div class="gallery-thumbs" id="gallery-thumbs"></div>
      </div>
      <div class="modal-info">
        <div class="modal-header">
          <h2 id="modal-title"></h2>
          <div class="modal-price" id="modal-price"></div>
        </div>
        <div class="modal-description" id="modal-description" hidden></div>
        <div class="modal-specs-grid" id="modal-specs"></div>
        <div class="modal-extras" id="modal-extras"></div>
        <div class="modal-actions">
          <a href="tel:+32486890002" class="btn btn-primary btn-block" id="modal-call-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
            Bel 0486 89 00 02
          </a>
          <a href="#contact" class="btn btn-outline btn-block" id="modal-contact-btn">Stuur een bericht</a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  return modal;
}

let currentCarId = null;
let currentImgIndex = 0;
let lastFocusedElement = null;

function openModal(carId) {
  const car = availableCars.find(c => String(c.id) === String(carId));
  if (!car) return;

  currentCarId    = carId;
  currentImgIndex = 0;
  lastFocusedElement = document.activeElement;

  const modal   = document.getElementById('car-modal');
  const imgs    = getVehicleImages(car);
  const title   = getVehicleTitle(car);
  const openSource = lastFocusedElement?.dataset?.carId ? 'card' : 'direct_url';
  const hasMultipleImages = imgs.length > 1;
  const coverImage = getVehicleCoverImage(car);
  const initialImageIndex = Math.max(0, imgs.findIndex(image => image === coverImage));

  modal.classList.toggle('single-image-modal', !hasMultipleImages);

  // title & price
  document.getElementById('modal-title').textContent  = title;
  document.getElementById('modal-price').textContent  = car.price;

  const description = String(car.description || '').trim();
  const descriptionElement = document.getElementById('modal-description');
  descriptionElement.hidden = !description;
  descriptionElement.innerHTML = description
    ? `<strong>Beschrijving</strong><p>${escapeHtml(description)}</p>`
    : '';

  // main image
  currentImgIndex = initialImageIndex;
  updateModalImage(imgs, currentImgIndex);

  // thumbnails
  const thumbs = document.getElementById('gallery-thumbs');
  thumbs.innerHTML = hasMultipleImages
    ? imgs.map((src, i) => `
      <img src="${src}" class="gallery-thumb${i === currentImgIndex ? ' active' : ''}"
        alt="${title} - foto ${i + 1}" loading="lazy" data-index="${i}"
        onerror="this.style.display='none'"/>
    `).join('')
    : '';

  thumbs.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentImgIndex = parseInt(thumb.dataset.index);
      updateModalImage(imgs, currentImgIndex);
    });
  });

  // specs
  document.getElementById('modal-specs').innerHTML = `
    <div class="modal-spec-item"><strong>Conditie</strong>${CONDITION_LABEL[car.condition] || 'Gebruikt'}</div>
    <div class="modal-spec-item"><strong>Bouwjaar</strong>${car.year}</div>
    <div class="modal-spec-item"><strong>Kilometerstand</strong>${car.mileage}</div>
    <div class="modal-spec-item"><strong>Brandstof</strong>${car.fuel}</div>
    <div class="modal-spec-item"><strong>Motor</strong>${car.engine}</div>
    ${car.vermogen ? `<div class="modal-spec-item"><strong>Vermogen</strong>${car.vermogen}</div>` : ''}
    <div class="modal-spec-item"><strong>Transmissie</strong>${car.transmission}</div>
    <div class="modal-spec-item"><strong>Euronorm</strong>${car.environmentalClass}</div>
    <div class="modal-spec-item"><strong>Zitplaatsen</strong>${car.seats}</div>
    <div class="modal-spec-item"><strong>Status</strong>${STATUS_LABEL[car.status] || car.status}</div>
  `;

  // extras
  document.getElementById('modal-extras').innerHTML = (car.extras || [])
    .map(e => `<span class="modal-extra-tag">${e}</span>`).join('');

  // nav buttons
  const prevButton = document.getElementById('gallery-prev');
  const nextButton = document.getElementById('gallery-next');
  prevButton.disabled = !hasMultipleImages;
  nextButton.disabled = !hasMultipleImages;
  prevButton.onclick = hasMultipleImages
    ? () => {
      currentImgIndex = (currentImgIndex - 1 + imgs.length) % imgs.length;
      updateModalImage(imgs, currentImgIndex);
    }
    : null;
  nextButton.onclick = hasMultipleImages
    ? () => {
      currentImgIndex = (currentImgIndex + 1) % imgs.length;
      updateModalImage(imgs, currentImgIndex);
    }
    : null;

  // contact btn
  const modalCallBtn = document.getElementById('modal-call-btn');
  modalCallBtn.dataset.carCallId = String(car.id);
  modalCallBtn.dataset.carContactSource = 'modal';

  document.getElementById('modal-contact-btn').onclick = () => {
    trackVehicleEvent('car_message_button', car, { button_location: 'modal' });
    closeModal();
  };

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();

  trackVehicleEvent('car_details_open', car, {
    open_source: openSource,
    image_count: imgs.length
  });
}

function updateModalImage(imgs, index) {
  const mainImg = document.getElementById('modal-main-img');
  const modalTitle = document.getElementById('modal-title')?.textContent || 'Voertuig bij Layan Garage BV';
  mainImg.src = imgs[index];
  mainImg.alt = `${modalTitle} - foto ${index + 1}`;
  document.getElementById('gallery-counter').textContent = `${index + 1} / ${imgs.length}`;
  document.querySelectorAll('.gallery-thumb').forEach((t, i) =>
    t.classList.toggle('active', i === index));
}

function closeModal() {
  const modal = document.getElementById('car-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentCarId = null;
  if (lastFocusedElement) lastFocusedElement.focus();
  lastFocusedElement = null;
}

/* ── RENDER ── */
let vehicleEventsBound = false;

async function hydrateVehicleInventory() {
  if (!window.LayanVehicleStore?.loadVehicles) return;
  const loadedCars = await window.LayanVehicleStore.loadVehicles({ fallbackVehicles: availableCars });
  if (Array.isArray(loadedCars) && loadedCars.length) {
    availableCars = loadedCars;
  }
}

async function renderCars() {
  const container = document.getElementById('cars-container');
  if (!container) return;

  if (!document.getElementById('car-modal')) createModal();

  container.innerHTML = '<p class="cars-loading">Voertuigen worden geladen...</p>';

  try {
    await hydrateVehicleInventory();
  } catch (error) {
    console.warn('Vehicle inventory hydration failed. Local fallback is used.', error);
  }

  container.innerHTML = '';
  if (!availableCars.length) {
    container.innerHTML = '<p class="cars-empty">Er zijn momenteel geen voertuigen zichtbaar. Neem contact op voor het actuele aanbod.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  availableCars.forEach(car => fragment.appendChild(createVehicleCard(car)));
  container.appendChild(fragment);

  window.availableCars = availableCars;
  window.dispatchEvent(new CustomEvent('vehicles:loaded', { detail: { vehicles: availableCars } }));
  openRequestedVehicleFromUrl();

  if (vehicleEventsBound) return;
  vehicleEventsBound = true;

  document.addEventListener('click', e => {
    const callLink = e.target.closest('[data-car-call-id]');
    if (callLink) {
      const car = availableCars.find(c => String(c.id) === String(callLink.dataset.carCallId));
      trackVehicleEvent('car_call_button', car, {
        button_location: callLink.dataset.carContactSource || 'unknown'
      });
      return;
    }

    const btn = e.target.closest('[data-car-id]');
    if (btn) {
      e.preventDefault();
      openModal(btn.dataset.carId);
    }
    if (e.target.id === 'modal-backdrop' || e.target.id === 'modal-close' || e.target.closest('#modal-close')) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (!currentCarId) return;
    const car  = availableCars.find(c => String(c.id) === String(currentCarId));
    if (!car) return;
    const imgs = getVehicleImages(car);
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  { currentImgIndex = (currentImgIndex - 1 + imgs.length) % imgs.length; updateModalImage(imgs, currentImgIndex); }
    if (e.key === 'ArrowRight') { currentImgIndex = (currentImgIndex + 1) % imgs.length; updateModalImage(imgs, currentImgIndex); }
  });
}

document.addEventListener('DOMContentLoaded', renderCars);












