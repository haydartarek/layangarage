/* ============================================================
   LAYAN GARAGE BV — Vehicle Store
   Hostinger API-backed inventory with local fallback support.
   ============================================================ */

(function vehicleStoreModule() {
  const PRODUCTION_SITE_URL = 'https://layangaragebv.be';

  const STATUS_TO_SITE = {
    available: 'beschikbaar',
    reserved: 'gereserveerd',
    sold: 'verkocht',
    beschikbaar: 'beschikbaar',
    gereserveerd: 'gereserveerd',
    verkocht: 'verkocht',
    bieden: 'bieden'
  };

  const STATUS_TO_DB = {
    beschikbaar: 'available',
    gereserveerd: 'reserved',
    verkocht: 'sold',
    available: 'available',
    reserved: 'reserved',
    sold: 'sold'
  };

  function getConfig() {
    return window.LayanApiConfig || {};
  }

  function isConfigured() {
    return Boolean(getConfig().apiBaseUrl);
  }

  function getClient() {
    return isConfigured() ? { apiBaseUrl: getConfig().apiBaseUrl } : null;
  }

  async function request(path, options = {}) {
    if (!isConfigured()) throw new Error('Hostinger API is not configured.');
    const config = getConfig();
    const headers = new Headers(options.headers || {});
    const body = options.body;
    if (!(body instanceof FormData) && body !== undefined) {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(body);
    }
    if (config.csrfToken) headers.set('X-CSRF-Token', config.csrfToken);
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      credentials: 'same-origin',
      ...options,
      headers
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
    if (payload.csrf) config.csrfToken = payload.csrf;
    return payload;
  }

  // The database can return DECIMAL columns as strings (e.g. "29900.00").
  // Accept whole-euro values only; never silently multiply a price by 100.
  function parseWholeNumber(value, label = 'Waarde') {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    if (typeof value === 'number') {
      if (Number.isSafeInteger(value) && value >= 0) return value;
      throw new Error(`${label} moet een geldig geheel getal zijn.`);
    }
    const raw = String(value).replace(/[\s\u00a0€]/g, '').replace(/km$/i, '');
    const withOptionalZeroCents = /^\d+(?:[.,]\d{3})*[.,]00$/.test(raw);
    const wholeNumber = /^\d+(?:[.,]\d{3})*$/.test(raw);
    if (!withOptionalZeroCents && !wholeNumber) {
      throw new Error(`${label} moet een geldig geheel getal zijn.`);
    }
    const withoutCents = withOptionalZeroCents ? raw.slice(0, -3) : raw;
    const number = Number(withoutCents.replace(/[.,]/g, ''));
    if (!Number.isSafeInteger(number) || number < 0) {
      throw new Error(`${label} is buiten het toegestane bereik.`);
    }
    return number;
  }

  function normalizePrice(value) {
    if (value === null || value === undefined || value === '') return '';
    const number = parseWholeNumber(value, 'Prijs');
    return number.toLocaleString('nl-BE', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    });
  }

  function normalizeMileage(value) {
    if (value === null || value === undefined || value === '') return '';
    const number = parseWholeNumber(value, 'Kilometerstand');
    return `${number.toLocaleString('nl-BE')} km`;
  }

  function isVisibleValue(value) {
    if (value === null || value === undefined) return true;
    return value === true || value === 1 || value === '1' ||
      (typeof value === 'string' && value.toLowerCase() === 'true');
  }

  function slugify(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90);
  }

  function getVehicleSlug(vehicle) {
    return vehicle?.slug || vehicle?.folder || slugify(buildTitle(vehicle));
  }

  function getPublicSiteUrl() {
    return PRODUCTION_SITE_URL;
  }

  function getPublicUrl(path = '/') {
    const value = String(path || '/').trim();
    if (/^https?:\/\//i.test(value) && !/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(value)) {
      return value;
    }

    let publicPath = value;
    try {
      const parsed = new URL(value);
      publicPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
      if (parsed.protocol === 'file:') {
        const publicAssetPath = publicPath.match(/\/((?:assets|admin|css|js)\/.*)$/i);
        publicPath = publicAssetPath ? `/${publicAssetPath[1]}` : '/';
      }
    } catch {
      // Relative paths are resolved against the production site below.
    }

    publicPath = publicPath.replace(/^\/?index\.html(?=\/|[?#]|$)/i, '/');
    return new URL(publicPath, `${getPublicSiteUrl()}/`).toString();
  }

  function getVehicleUrl(vehicle) {
    const slug = getVehicleSlug(vehicle);
    const url = new URL(getPublicUrl('/'));
    if (slug) url.searchParams.set('car', slug);
    return url.toString();
  }

  function buildTitle(vehicle) {
    return vehicle.title || [vehicle.brand, vehicle.model].filter(Boolean).join(' ').trim();
  }

  function splitLegacyEnginePower(engine, vermogen) {
    const cleanEngine = String(engine || '').trim();
    const cleanPower = String(vermogen || '').trim();
    if (cleanPower) return { engine: cleanEngine, vermogen: cleanPower };

    const match = cleanEngine.match(/^(.*?)\s+(\d+)\s*PK\s*$/i);
    if (!match) return { engine: cleanEngine, vermogen: '' };

    const pk = Number(match[2]);
    return {
      engine: match[1].trim(),
      vermogen: `${Math.round(pk * 0.73549875)} kW / ${pk} PK`
    };
  }

  function publicImageUrl(path) {
    if (!path) return '';
    const src = String(path).trim();
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('assets/')) return src;
    const relative = src.replace(/^\/+/, '').replace(/^vehicle-images\//i, '');
    if (!/^vehicles\/[a-z0-9-]+\/[a-z0-9._-]+$/i.test(relative)) return '';
    const origin = String(getConfig().publicSiteUrl || PRODUCTION_SITE_URL).replace(/\/$/, '');
    return `${origin}/vehicle-images/${relative}`;
  }

  function imageSortValue(image) {
    if (image?.display_order === null || image?.display_order === undefined || image?.display_order === '') {
      return Number.MAX_SAFE_INTEGER;
    }
    const order = Number(image?.display_order);
    return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
  }

  function imageCreatedAtValue(image) {
    const time = Date.parse(image?.created_at || '');
    return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
  }

  function hasSavedImageOrder(image) {
    return imageSortValue(image) !== Number.MAX_SAFE_INTEGER;
  }

  function compareVehicleImagesByCreatedAt(a, b) {
    return imageCreatedAtValue(a) - imageCreatedAtValue(b);
  }

  function compareVehicleImages(a, b) {
    const orderDiff = imageSortValue(a) - imageSortValue(b);
    if (orderDiff !== 0) return orderDiff;
    return compareVehicleImagesByCreatedAt(a, b);
  }

  function normalizeImageRows(imageRows) {
    return Array.isArray(imageRows)
      ? imageRows.slice().sort(compareVehicleImages)
      : [];
  }

  function vehicleStatusValue(vehicle) {
    const rawStatus = String(vehicle?.status || '').toLowerCase();
    return STATUS_TO_SITE[rawStatus] || rawStatus || 'beschikbaar';
  }

  function vehicleAvailabilityRank(vehicle) {
    const status = vehicleStatusValue(vehicle);
    if (status === 'beschikbaar') return 0;
    if (status === 'verkocht') return 2;
    return 1;
  }

  function vehicleDateSortValue(value) {
    const time = Date.parse(value || '');
    return Number.isFinite(time) ? time : 0;
  }

  function vehicleDisplayOrderValue(vehicle) {
    const order = Number(vehicle?.display_order ?? vehicle?.displayOrder ?? 0);
    return Number.isFinite(order) ? order : 0;
  }

  function compareVehiclesForListing(a, b) {
    const availabilityDiff = vehicleAvailabilityRank(a) - vehicleAvailabilityRank(b);
    if (availabilityDiff !== 0) return availabilityDiff;

    const createdDiff = vehicleDateSortValue(b?.created_at || b?.createdAt) - vehicleDateSortValue(a?.created_at || a?.createdAt);
    if (createdDiff !== 0) return createdDiff;

    const orderDiff = vehicleDisplayOrderValue(a) - vehicleDisplayOrderValue(b);
    if (orderDiff !== 0) return orderDiff;

    return String(a?.title || '').localeCompare(String(b?.title || ''), 'nl-BE');
  }

  function sortVehiclesForListing(vehicles) {
    return Array.isArray(vehicles)
      ? vehicles.slice().sort(compareVehiclesForListing)
      : [];
  }

  function getVehicleCoverImage(vehicle) {
    const sourceRows = vehicle?.imageRecords || vehicle?.vehicle_images || [];
    const imageRows = normalizeImageRows(sourceRows);
    const firstOrderedImage = imageRows.some(hasSavedImageOrder) ? imageRows[0] : null;
    const featuredImage = imageRows.filter(image => image.is_featured).sort(compareVehicleImagesByCreatedAt)[0] || null;
    const earliestImage = imageRows.slice().sort(compareVehicleImagesByCreatedAt)[0] || null;
    const selectedRecord = firstOrderedImage || featuredImage || earliestImage;

    if (selectedRecord?.storage_path) return publicImageUrl(selectedRecord.storage_path);
    if (Array.isArray(vehicle?.images) && vehicle.images.length) return vehicle.images[0];
    if (vehicle?.coverImage) return vehicle.coverImage;
    return '';
  }

  function normalizeVehicle(row) {
    const powertrain = splitLegacyEnginePower(row.engine, row.vermogen);
    const features = Array.isArray(row.vehicle_features)
      ? row.vehicle_features
          .slice()
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(feature => feature.label)
          .filter(Boolean)
      : Array.isArray(row.extras)
        ? row.extras
        : [];

    const imageRows = Array.isArray(row.vehicle_images)
      ? normalizeImageRows(row.vehicle_images)
      : [];

    const images = imageRows.length
      ? imageRows.map(image => publicImageUrl(image.storage_path)).filter(Boolean)
      : Array.isArray(row.images)
        ? row.images
        : [];

    const normalized = {
      id: row.id,
      slug: row.slug || row.folder || slugify(buildTitle(row)),
      title: buildTitle(row),
      brand: row.brand || '',
      model: row.model || '',
      year: String(row.year || ''),
      price: normalizePrice(row.price),
      mileage: normalizeMileage(row.mileage),
      fuel: row.fuel_type || row.fuel || '',
      fuelType: row.fuel_type || row.fuel || '',
      engine: powertrain.engine,
      vermogen: powertrain.vermogen,
      transmission: row.transmission || '',
      environmentalClass: row.euro_norm || row.environmentalClass || '',
      euroNorm: row.euro_norm || row.environmentalClass || '',
      seats: row.seats || '',
      condition: row.condition || 'used',
      conditionLabel: row.condition === 'new' ? 'Nieuw' : 'Gebruikt',
      description: row.description || '',
      status: STATUS_TO_SITE[row.status] || row.status || 'beschikbaar',
      isVisible: isVisibleValue(row.is_visible ?? row.isVisible),
      displayOrder: row.display_order ?? row.displayOrder ?? 0,
      createdAt: row.created_at || row.createdAt || '',
      updatedAt: row.updated_at || row.updatedAt || '',
      folder: row.folder || row.slug || slugify(buildTitle(row)),
      images,
      imageRecords: imageRows,
      extras: features,
      source: imageRows.length ? 'hostinger' : (row.source || 'local')
    };
    normalized.coverImage = getVehicleCoverImage(normalized) || images[0] || '';
    return normalized;
  }

  async function loadVehicles({ fallbackVehicles = [] } = {}) {
    // Static examples may be used in offline/local previews, never as live stock.
    const localPreview = window.location?.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1)$/.test(window.location?.hostname || '');
    if (!isConfigured()) {
      return localPreview ? sortVehiclesForListing(fallbackVehicles.map(normalizeVehicle)) : [];
    }
    const data = await request('/vehicles');
    if (!Array.isArray(data)) throw new Error('Ongeldige voertuiggegevens van de server.');
    return sortVehiclesForListing(data).map(normalizeVehicle);
  }

  async function loadAdminVehicles() {
    if (!isConfigured()) throw new Error('Hostinger API is not configured.');
    const data = await request('/vehicles?admin=1');
    return sortVehiclesForListing(data || []).map(normalizeVehicle);
  }

  function toDatabasePayload(vehicle) {
    const title = buildTitle(vehicle);
    return {
      slug: vehicle.slug || slugify(title),
      title,
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year ? Number(vehicle.year) : null,
      price: parseWholeNumber(vehicle.price, 'Prijs'),
      mileage: parseWholeNumber(vehicle.mileage, 'Kilometerstand'),
      fuel_type: vehicle.fuelType || vehicle.fuel || '',
      engine: vehicle.engine || '',
      vermogen: vehicle.vermogen || '',
      transmission: vehicle.transmission || '',
      euro_norm: vehicle.euroNorm || vehicle.environmentalClass || '',
      seats: vehicle.seats ? Number(vehicle.seats) : null,
      condition: vehicle.condition === 'new' ? 'new' : 'used',
      description: vehicle.description || '',
      status: STATUS_TO_DB[vehicle.status] || 'available',
      is_visible: isVisibleValue(vehicle.isVisible),
      display_order: vehicle.displayOrder ? Number(vehicle.displayOrder) : 0
    };
  }

  async function saveVehicle(vehicle) {
    if (!isConfigured()) throw new Error('Hostinger API is not configured.');
    const data = await request(
      vehicle.id ? '/vehicles/' + encodeURIComponent(vehicle.id) : '/vehicles',
      {
        method: vehicle.id ? 'PUT' : 'POST',
        body: toDatabasePayload(vehicle)
      }
    );
    return normalizeVehicle(data);
  }

  async function deleteVehicle(vehicleId) {
    await request('/vehicles/' + encodeURIComponent(vehicleId), { method: 'DELETE' });
  }

  async function replaceFeatures(vehicleId, labels) {
    const cleanLabels = (labels || []).map(label => String(label).trim()).filter(Boolean);
    await request('/vehicles/' + encodeURIComponent(vehicleId) + '/features', {
      method: 'PUT',
      body: { labels: cleanLabels }
    });
  }

  async function uploadVehicleImages(vehicle, files) {
    const accepted = ['image/jpeg', 'image/png', 'image/webp'];
    const uploadItems = (files || []).map(item => item?.file ? item : ({ file: item, isFeatured: false }));
    const uploaded = [];
    const hasSelectedIncomingFeatured = uploadItems.some(item => item.isFeatured);

    for (const item of uploadItems) {
      const file = item.file;
      if (!accepted.includes(file.type)) throw new Error(file.name + ' is not an accepted image type.');
      if (file.size > 5 * 1024 * 1024) throw new Error(file.name + ' is larger than 5 MB.');

      const form = new FormData();
      form.append('file', file);
      form.append('alt_text', (vehicle.title || vehicle.brand || 'Voertuig') + ' foto');
      form.append('is_featured', hasSelectedIncomingFeatured ? String(Boolean(item.isFeatured)) : 'false');

      const insertedImage = await request('/vehicles/' + encodeURIComponent(vehicle.id) + '/images', {
        method: 'POST',
        body: form
      });
      uploaded.push({
        ...insertedImage,
        pendingId: item.pendingId || '',
        vehicle_id: vehicle.id
      });
    }

    return uploaded;
  }

  async function setFeaturedImage(vehicleId, imageId) {
    await request('/images/' + encodeURIComponent(imageId) + '/featured', {
      method: 'PUT',
      body: { vehicle_id: vehicleId }
    });
  }

  async function deleteVehicleImage(image) {
    await request('/images/' + encodeURIComponent(image.id), { method: 'DELETE' });
  }

  async function reorderVehicleImages(imageRows) {
    const vehicleId = imageRows[0]?.vehicle_id || imageRows[0]?.vehicleId;
    if (!vehicleId) return;
    await request('/vehicles/' + encodeURIComponent(vehicleId) + '/images/reorder', {
      method: 'PUT',
      body: { ids: imageRows.map(image => image.id) }
    });
  }

  async function getCurrentSession() {
    if (!isConfigured()) return null;
    const payload = await request('/auth/session');
    return payload.user ? { user: payload.user, csrf: payload.csrf } : null;
  }

  async function login(email, password) {
    const payload = await request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    return payload.user ? { user: payload.user, csrf: payload.csrf } : null;
  }

  async function logout() {
    await request('/auth/logout', { method: 'POST' });
    getConfig().csrfToken = '';
  }

  window.LayanVehicleStore = {
    getClient,
    request,
    isConfigured,
    loadVehicles,
    loadAdminVehicles,
    saveVehicle,
    deleteVehicle,
    replaceFeatures,
    uploadVehicleImages,
    setFeaturedImage,
    deleteVehicleImage,
    reorderVehicleImages,
    getCurrentSession,
    login,
    logout,
    normalizeVehicle,
    sortVehiclesForListing,
    getVehicleCoverImage,
    getVehicleSlug,
    getPublicSiteUrl,
    getPublicUrl,
    getVehicleUrl,
    slugify,
    publicImageUrl,
    STATUS_TO_DB,
    STATUS_TO_SITE
  };
})();
