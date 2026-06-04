/* ============================================================
   LAYAN GARAGE BV — Vehicle Store
   Supabase-backed inventory with local fallback support.
   ============================================================ */

(function vehicleStoreModule() {
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

  function buildTitle(vehicle) {
    return vehicle.title || [vehicle.brand, vehicle.model].filter(Boolean).join(' ').trim();
  }

  function publicImageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.startsWith('assets/')) return path;
    const client = getClient();
    if (!client) return path;
    const bucket = getConfig().storageBucket || 'vehicle-images';
    return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  function normalizeVehicle(row) {
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
      ? row.vehicle_images
          .slice()
          .sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return (a.display_order || 0) - (b.display_order || 0);
          })
      : [];

    const images = imageRows.length
      ? imageRows.map(image => publicImageUrl(image.storage_path)).filter(Boolean)
      : Array.isArray(row.images)
        ? row.images
        : [];

    return {
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
      engine: row.engine || '',
      transmission: row.transmission || '',
      environmentalClass: row.euro_norm || row.environmentalClass || '',
      euroNorm: row.euro_norm || row.environmentalClass || '',
      seats: row.seats || '',
      condition: row.condition || 'used',
      conditionLabel: row.condition === 'new' ? 'Nieuw' : 'Gebruikt',
      description: row.description || '',
      status: STATUS_TO_SITE[row.status] || row.status || 'beschikbaar',
      isVisible: row.is_visible !== false,
      displayOrder: row.display_order || 0,
      folder: row.folder || row.slug || slugify(buildTitle(row)),
      images,
      imageRecords: imageRows,
      extras: features,
      source: imageRows.length ? 'supabase' : (row.source || 'local')
    };
  }

  async function loadVehicles({ fallbackVehicles = [] } = {}) {
    const fallback = fallbackVehicles.map(normalizeVehicle);
    const client = getClient();
    if (!client) return fallback;

    const { data, error } = await client
      .from('vehicles')
      .select(`
        *,
        vehicle_features(id,label,display_order),
        vehicle_images(id,storage_path,alt_text,is_featured,display_order)
      `)
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase vehicle load failed. Local fallback is used.', error);
      return fallback;
    }

    return (data || []).map(normalizeVehicle);
  }

  async function loadAdminVehicles() {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const { data, error } = await client
      .from('vehicles')
      .select(`
        *,
        vehicle_features(id,label,display_order),
        vehicle_images(id,storage_path,alt_text,is_featured,display_order)
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(normalizeVehicle);
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

  async function saveVehicle(vehicle) {
    const client = getClient();
    if (!client) throw new Error('Supabase is not configured.');

    const payload = toDatabasePayload(vehicle);
    const query = vehicle.id
      ? client.from('vehicles').update(payload).eq('id', vehicle.id).select().single()
      : client.from('vehicles').insert(payload).select().single();

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
    const uploaded = [];

    for (const file of files) {
      if (!accepted.includes(file.type)) throw new Error(`${file.name} is not an accepted image type.`);
      if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB.`);

      const extension = file.name.split('.').pop().toLowerCase();
      const safeName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'vehicle-image';
      const path = `vehicles/${vehicle.slug || vehicle.id}/${Date.now()}-${safeName}.${extension}`;
      const { error: uploadError } = await client.storage.from(bucket).upload(path, file, {
        cacheControl: '31536000',
        upsert: false
      });
      if (uploadError) throw uploadError;

      const row = {
        vehicle_id: vehicle.id,
        storage_path: path,
        alt_text: `${vehicle.title || vehicle.brand || 'Voertuig'} foto`,
        is_featured: false,
        display_order: Date.now()
      };
      const { error: insertError } = await client.from('vehicle_images').insert(row);
      if (insertError) throw insertError;
      uploaded.push(path);
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
    slugify,
    publicImageUrl,
    STATUS_TO_DB,
    STATUS_TO_SITE
  };
})();
