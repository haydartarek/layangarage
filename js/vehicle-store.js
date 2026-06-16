/* ============================================================
   LAYAN GARAGE BV — Vehicle Store
   Supabase-backed inventory with local fallback support.
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
    return window.LayanSupabaseConfig || {};
  }

  function isConfigured() {
    return typeof window.hasLayanSupabaseConfig === 'function' && window.hasLayanSupabaseConfig();
  }

  function getClient() {
    if (!isConfigured() || !window.supabase?.createClient) return null;
    if (!window.LayanSupabaseClient) {
      const config = getConfig();
      window.LayanSupabaseClient = window.supabase.createClient(config.url, config.anonKey);
    }
    return window.LayanSupabaseClient;
  }

  function normalizePrice(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number') return value.toLocaleString('nl-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    });
    return String(value);
  }

  function normalizeMileage(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number') return `${value.toLocaleString('nl-BE')} km`;
    return String(value);
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
    if (/^https?:\/\//i.test(path) || path.startsWith('assets/')) return path;
    const client = getClient();
    if (!client) return path;
    const bucket = getConfig().storageBucket || 'vehicle-images';
    return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
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
      isVisible: row.is_visible !== false,
      displayOrder: row.display_order ?? row.displayOrder ?? 0,
      createdAt: row.created_at || row.createdAt || '',
      updatedAt: row.updated_at || row.updatedAt || '',
      folder: row.folder || row.slug || slugify(buildTitle(row)),
      images,
      imageRecords: imageRows,
      extras: features,
      source: imageRows.length ? 'supabase' : (row.source || 'local')
    };
    normalized.coverImage = getVehicleCoverImage(normalized) || images[0] || '';
    return normalized;
  }

  async function loadVehicles({ fallbackVehicles = [] } = {}) {
    const fallback = sortVehiclesForListing(fallbackVehicles.map(normalizeVehicle));
    const client = getClient();
    if (!client) return fallback;

    const { data, error } = await client
      .from('vehicles')
      .select(`
        *,
        vehicle_features(id,label,display_order),
        vehicle_images(id,storage_path,alt_text,is_featured,display_order,created_at)
      `)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .order('display_order', { ascending: true })
      .order('title', { ascending: true });

    if (error) {
      console.warn('Supabase vehicle load failed. Local fallback is used.', error);
      return fallback;
    }

    return sortVehiclesForListing(data || []).map(normalizeVehicle);
  }

  async function loadAdminVehicles() {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const { data, error } = await client
      .from('vehicles')
      .select(`
        *,
        vehicle_features(id,label,display_order),
        vehicle_images(id,storage_path,alt_text,is_featured,display_order,created_at)
      `)
      .order('created_at', { ascending: false })
      .order('display_order', { ascending: true })
      .order('title', { ascending: true });

    if (error) throw error;
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
      price: vehicle.price ? Number(String(vehicle.price).replace(/[^\d]/g, '')) : null,
      mileage: vehicle.mileage ? Number(String(vehicle.mileage).replace(/[^\d]/g, '')) : null,
      fuel_type: vehicle.fuelType || vehicle.fuel || '',
      engine: vehicle.engine || '',
      vermogen: vehicle.vermogen || '',
      transmission: vehicle.transmission || '',
      euro_norm: vehicle.euroNorm || vehicle.environmentalClass || '',
      seats: vehicle.seats ? Number(vehicle.seats) : null,
      condition: vehicle.condition === 'new' ? 'new' : 'used',
      description: vehicle.description || '',
      status: STATUS_TO_DB[vehicle.status] || 'available',
      is_visible: vehicle.isVisible !== false,
      display_order: vehicle.displayOrder ? Number(vehicle.displayOrder) : 0,
      updated_at: new Date().toISOString()
    };
  }

  async function findVehicleBySlug(client, slug) {
    const { data, error } = await client
      .from('vehicles')
      .select('id,slug,vehicle_images(id)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  async function buildAvailableSlug(client, baseSlug) {
    const safeBase = baseSlug || 'vehicle';
    const { data, error } = await client
      .from('vehicles')
      .select('slug')
      .like('slug', `${safeBase}%`);

    if (error) throw error;

    const used = new Set((data || [])
      .map(row => row.slug)
      .filter(slug => slug === safeBase || new RegExp(`^${safeBase}-\\d+$`).test(slug)));
    if (!used.has(safeBase)) return safeBase;

    let counter = 2;
    while (used.has(`${safeBase}-${counter}`)) counter += 1;
    return `${safeBase}-${counter}`;
  }

  async function saveVehicle(vehicle) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const payload = toDatabasePayload(vehicle);
    let query;

    if (vehicle.id) {
      const slugOwner = await findVehicleBySlug(client, payload.slug);
      if (slugOwner && String(slugOwner.id) !== String(vehicle.id)) {
        payload.slug = await buildAvailableSlug(client, payload.slug);
      }
      query = client.from('vehicles').update(payload).eq('id', vehicle.id).select().single();
    } else {
      const existing = await findVehicleBySlug(client, payload.slug);
      const existingImageCount = Array.isArray(existing?.vehicle_images) ? existing.vehicle_images.length : 0;

      if (existing && existingImageCount === 0) {
        query = client.from('vehicles').update(payload).eq('id', existing.id).select().single();
      } else {
        if (existing) payload.slug = await buildAvailableSlug(client, payload.slug);
        query = client.from('vehicles').insert(payload).select().single();
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return normalizeVehicle(data);
  }

  async function deleteVehicle(vehicleId) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const { data: imageRows, error: imageReadError } = await client
      .from('vehicle_images')
      .select('storage_path')
      .eq('vehicle_id', vehicleId);
    if (imageReadError) throw imageReadError;

    const bucket = getConfig().storageBucket || 'vehicle-images';
    const storagePaths = (imageRows || [])
      .map(image => image.storage_path)
      .filter(path => path && !path.startsWith('assets/') && !/^https?:\/\//i.test(path));

    const { error: hideError } = await client
      .from('vehicles')
      .update({ is_visible: false, updated_at: new Date().toISOString() })
      .eq('id', vehicleId);
    if (hideError) throw hideError;

    if (storagePaths.length) {
      const { error: storageError } = await client.storage.from(bucket).remove(storagePaths);
      if (storageError) throw storageError;
    }

    const { error } = await client.from('vehicles').delete().eq('id', vehicleId);
    if (error) throw error;
  }

  async function replaceFeatures(vehicleId, labels) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const cleanLabels = labels.map(label => label.trim()).filter(Boolean);
    const { error: deleteError } = await client.from('vehicle_features').delete().eq('vehicle_id', vehicleId);
    if (deleteError) throw deleteError;
    if (!cleanLabels.length) return;

    const rows = cleanLabels.map((label, index) => ({
      vehicle_id: vehicleId,
      label,
      display_order: index
    }));

    const { error } = await client.from('vehicle_features').insert(rows);
    if (error) throw error;
  }

  async function uploadVehicleImages(vehicle, files) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');
    const bucket = getConfig().storageBucket || 'vehicle-images';
    const accepted = ['image/jpeg', 'image/png', 'image/webp'];
    const uploadItems = (files || []).map(item => item?.file ? item : ({ file: item, isFeatured: false }));
    const uploaded = [];
    const { data: existingImages, error: existingImagesError } = await client
      .from('vehicle_images')
      .select('display_order,is_featured')
      .eq('vehicle_id', vehicle.id)
      .order('display_order', { ascending: false });
    if (existingImagesError) throw existingImagesError;

    const startingOrder = Array.isArray(existingImages) && existingImages.length
      ? Number(existingImages[0].display_order || 0) + 1
      : 0;
    const hasFeaturedImage = Array.isArray(existingImages) && existingImages.some(image => image.is_featured);
    const hasSelectedIncomingFeatured = uploadItems.some(item => item.isFeatured);

    if (hasFeaturedImage && hasSelectedIncomingFeatured) {
      const { error: resetFeaturedError } = await client
        .from('vehicle_images')
        .update({ is_featured: false })
        .eq('vehicle_id', vehicle.id);
      if (resetFeaturedError) throw resetFeaturedError;
    }

    for (const [index, item] of uploadItems.entries()) {
      const file = item.file;
      if (!accepted.includes(file.type)) throw new Error(`${file.name} is not an accepted image type.`);
      if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB.`);

      const extension = file.name.split('.').pop().toLowerCase();
      const safeName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'vehicle-image';
      const order = startingOrder + index;
      const paddedOrder = String(order + 1).padStart(2, '0');
      const uniqueSuffix = window.crypto?.randomUUID ? window.crypto.randomUUID().slice(0, 8) : String(Date.now()).slice(-8);
      const path = `vehicles/${vehicle.slug || vehicle.id}/${vehicle.slug || vehicle.id}-${paddedOrder}-${safeName}-${uniqueSuffix}.${extension}`;
      const { error: uploadError } = await client.storage.from(bucket).upload(path, file, {
        cacheControl: '31536000',
        upsert: false
      });
      if (uploadError) throw uploadError;

      const row = {
        vehicle_id: vehicle.id,
        storage_path: path,
        alt_text: `${vehicle.title || vehicle.brand || 'Voertuig'} foto`,
        is_featured: hasSelectedIncomingFeatured ? Boolean(item.isFeatured) : (!hasFeaturedImage && index === 0),
        display_order: order
      };
      const { data: insertedImage, error: insertError } = await client
        .from('vehicle_images')
        .insert(row)
        .select('id,storage_path,alt_text,is_featured,display_order,created_at')
        .single();
      if (insertError) {
        await client.storage.from(bucket).remove([path]);
        throw insertError;
      }
      uploaded.push({
        ...insertedImage,
        pendingId: item.pendingId || '',
        vehicle_id: vehicle.id
      });
    }

    return uploaded;
  }

  async function setFeaturedImage(vehicleId, imageId) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');
    const { error: resetError } = await client
      .from('vehicle_images')
      .update({ is_featured: false })
      .eq('vehicle_id', vehicleId);
    if (resetError) throw resetError;
    const { error } = await client
      .from('vehicle_images')
      .update({ is_featured: true })
      .eq('id', imageId);
    if (error) throw error;
  }

  async function deleteVehicleImage(image) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');
    const bucket = getConfig().storageBucket || 'vehicle-images';
    if (image.storage_path && !image.storage_path.startsWith('assets/') && !/^https?:\/\//i.test(image.storage_path)) {
      await client.storage.from(bucket).remove([image.storage_path]);
    }
    const { error } = await client.from('vehicle_images').delete().eq('id', image.id);
    if (error) throw error;
  }

  async function reorderVehicleImages(imageRows) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');
    for (const [index, image] of imageRows.entries()) {
      const { error } = await client
        .from('vehicle_images')
        .update({ display_order: index })
        .eq('id', image.id);
      if (error) throw error;
    }
  }

  async function getCurrentSession() {
    const client = getClient();
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session || null;
  }

  window.LayanVehicleStore = {
    getClient,
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
