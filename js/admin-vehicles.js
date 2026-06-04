/* ============================================================
   LAYAN GARAGE BV — Admin Vehicle Management
   ============================================================ */

(function adminVehiclesModule() {
  const state = {
    vehicles: [],
    selectedId: null,
    pendingFiles: []
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function message(text, type = '') {
    if (!els.formMessage) return;
    els.formMessage.textContent = text;
    els.formMessage.className = `admin-message ${type}`.trim();
  }

  function title(vehicle) {
    return vehicle?.title || `${vehicle?.brand || ''} ${vehicle?.model || ''}`.trim();
  }

  function imageSrc(vehicle) {
    const image = vehicle?.images?.[0];
    return image || '../assets/images/hero-garage.jpg';
  }

  function normalizeImageForAdmin(src) {
    if (!src) return '../assets/images/hero-garage.jpg';
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('assets/')) return `../${src}`;
    return src;
  }

  function selectedVehicle() {
    return state.vehicles.find(vehicle => String(vehicle.id) === String(state.selectedId)) || null;
  }

  function getFeatureValues() {
    return Array.from(els.featureList.querySelectorAll('input'))
      .map(input => input.value.trim())
      .filter(Boolean);
  }

  function syncOtherInput(select) {
    const otherName = select.dataset.otherSelect;
    if (!otherName) return;
    const other = els.form.elements[otherName];
    if (!other) return;
    const isOther = select.value === 'Other';
    other.hidden = !isOther;
    other.required = isOther && select.required;
    if (!isOther) other.value = '';
  }

  function syncAllOtherInputs() {
    els.form.querySelectorAll('[data-other-select]').forEach(syncOtherInput);
  }

  function setSelectOrOther(selectName, otherName, value) {
    const select = els.form.elements[selectName];
    const other = els.form.elements[otherName];
    if (!select || !other) return;
    const normalized = String(value || '');
    const hasOption = Array.from(select.options).some(option => option.value === normalized);
    select.value = hasOption ? normalized : (normalized ? 'Other' : '');
    other.value = hasOption ? '' : normalized;
    syncOtherInput(select);
  }

  function readSelectOrOther(selectName, otherName) {
    const select = els.form.elements[selectName];
    const other = els.form.elements[otherName];
    if (!select) return '';
    return select.value === 'Other' ? (other?.value.trim() || '') : select.value.trim();
  }

  function addFeatureRow(value = '') {
    const row = document.createElement('div');
    row.className = 'feature-row';
    row.innerHTML = `
      <input type="text" value="${escapeHtml(value)}" aria-label="Feature">
      <button class="admin-btn admin-btn-small admin-btn-ghost" type="button" data-feature-up aria-label="Omhoog">↑</button>
      <button class="admin-btn admin-btn-small admin-btn-ghost" type="button" data-feature-down aria-label="Omlaag">↓</button>
      <button class="admin-btn admin-btn-small admin-btn-danger" type="button" data-feature-remove aria-label="Verwijderen">×</button>
    `;
    els.featureList.appendChild(row);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderVehicleList() {
    els.vehicleCount.textContent = String(state.vehicles.length);
    if (!state.vehicles.length) {
      els.vehicleList.innerHTML = '<p class="admin-muted">Nog geen voertuigen gevonden.</p>';
      return;
    }

    els.vehicleList.innerHTML = state.vehicles.map(vehicle => `
      <button class="vehicle-admin-item${String(vehicle.id) === String(state.selectedId) ? ' active' : ''}" type="button" data-select-vehicle="${vehicle.id}">
        <img src="${normalizeImageForAdmin(imageSrc(vehicle))}" alt="${escapeHtml(title(vehicle))}" loading="lazy" onerror="this.src='../assets/images/hero-garage.jpg'">
        <span>
          <span class="vehicle-admin-title">${escapeHtml(title(vehicle))}</span>
          <span class="vehicle-admin-meta">${escapeHtml(vehicle.price || 'Prijs op aanvraag')} · ${escapeHtml(vehicle.status || '')} · ${vehicle.isVisible ? 'zichtbaar' : 'verborgen'}</span>
        </span>
      </button>
    `).join('');
  }

  function resetForm() {
    els.form.reset();
    els.form.elements.id.value = '';
    els.form.elements.isVisible.checked = true;
    els.form.elements.condition.value = 'used';
    els.form.elements.displayOrder.value = '0';
    syncAllOtherInputs();
    els.editorState.textContent = 'Nieuw';
    els.deleteBtn.disabled = true;
    els.featureList.innerHTML = '';
    els.imageList.innerHTML = '<p class="admin-muted">Sla de wagen eerst op voordat u afbeeldingen beheert.</p>';
    state.selectedId = null;
    state.pendingFiles = [];
    renderVehicleList();
    renderSocial(null);
    message('');
  }

  function fillForm(vehicle) {
    state.selectedId = vehicle.id;
    els.form.elements.id.value = vehicle.id || '';
    els.form.elements.title.value = title(vehicle);
    els.form.elements.brand.value = vehicle.brand || '';
    els.form.elements.model.value = vehicle.model || '';
    els.form.elements.year.value = vehicle.year || '';
    els.form.elements.price.value = String(vehicle.price || '').replace(/[^\d]/g, '');
    els.form.elements.mileage.value = String(vehicle.mileage || '').replace(/[^\d]/g, '');
    setSelectOrOther('fuelType', 'fuelTypeOther', vehicle.fuel || vehicle.fuelType || '');
    setSelectOrOther('engine', 'engineOther', vehicle.engine || '');
    setSelectOrOther('transmission', 'transmissionOther', vehicle.transmission || '');
    setSelectOrOther('euroNorm', 'euroNormOther', vehicle.environmentalClass || vehicle.euroNorm || '');
    setSelectOrOther('seats', 'seatsOther', vehicle.seats || '');
    els.form.elements.condition.value = vehicle.condition || 'used';
    els.form.elements.status.value = vehicle.status || 'beschikbaar';
    els.form.elements.displayOrder.value = vehicle.displayOrder || 0;
    els.form.elements.isVisible.checked = vehicle.isVisible !== false;
    els.form.elements.description.value = vehicle.description || '';
    els.editorState.textContent = 'Bewerken';
    els.deleteBtn.disabled = false;

    els.featureList.innerHTML = '';
    (vehicle.extras || []).forEach(addFeatureRow);
    if (!vehicle.extras?.length) addFeatureRow();

    renderImageList(vehicle);
    renderVehicleList();
    renderSocial(vehicle);
    message('');
  }

  function readFormVehicle() {
    const form = els.form.elements;
    const titleValue = form.title.value.trim();
    return {
      id: form.id.value || undefined,
      title: titleValue,
      slug: window.LayanVehicleStore.slugify(titleValue),
      brand: form.brand.value.trim(),
      model: form.model.value.trim(),
      year: form.year.value.trim(),
      price: form.price.value.trim(),
      mileage: form.mileage.value.trim(),
      fuelType: readSelectOrOther('fuelType', 'fuelTypeOther'),
      engine: readSelectOrOther('engine', 'engineOther'),
      transmission: readSelectOrOther('transmission', 'transmissionOther'),
      euroNorm: readSelectOrOther('euroNorm', 'euroNormOther'),
      seats: readSelectOrOther('seats', 'seatsOther'),
      condition: form.condition.value,
      status: form.status.value,
      displayOrder: form.displayOrder.value,
      isVisible: form.isVisible.checked,
      description: form.description.value.trim()
    };
  }

  function validateVehicle(vehicle) {
    if (!vehicle.title || vehicle.title.length < 3) return 'Vehicle title is verplicht.';
    if (!vehicle.brand) return 'Brand is verplicht.';
    if (!vehicle.model) return 'Model is verplicht.';
    if (!vehicle.year) return 'Year is verplicht.';
    if (!vehicle.price) return 'Price is verplicht.';
    if (!vehicle.mileage) return 'Mileage is verplicht.';
    if (!vehicle.fuelType) return 'Fuel type is verplicht.';
    if (vehicle.seats && !/^\d+$/.test(String(vehicle.seats))) return 'Seats moet een geldig nummer zijn.';
    return '';
  }

  function renderImageList(vehicle) {
    const records = vehicle.imageRecords || [];
    if (!vehicle.id) {
      els.imageList.innerHTML = '<p class="admin-muted">Sla de wagen eerst op voordat u afbeeldingen beheert.</p>';
      return;
    }

    if (!records.length) {
      els.imageList.innerHTML = '<p class="admin-muted">Nog geen Supabase afbeeldingen voor deze wagen.</p>';
      return;
    }

    els.imageList.innerHTML = records.map((image, index) => {
      const src = window.LayanVehicleStore.publicImageUrl(image.storage_path);
      return `
        <article class="image-admin-card${image.is_featured ? ' image-featured' : ''}" data-image-id="${image.id}">
          <img src="${src}" alt="${escapeHtml(image.alt_text || title(vehicle))}" loading="lazy">
          <div class="image-admin-actions">
            <button class="admin-btn admin-btn-small admin-btn-ghost" type="button" data-image-up="${image.id}" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="admin-btn admin-btn-small admin-btn-ghost" type="button" data-image-down="${image.id}" ${index === records.length - 1 ? 'disabled' : ''}>↓</button>
            <button class="admin-btn admin-btn-small admin-btn-primary" type="button" data-image-featured="${image.id}">Main</button>
            <button class="admin-btn admin-btn-small admin-btn-danger" type="button" data-image-delete="${image.id}">Delete</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderSocial(vehicle) {
    const empty = !vehicle;
    const selected = selectedVehicle();
    const pendingImages = state.pendingFiles.map(file => file.name);
    const enrichedVehicle = empty ? null : {
      ...vehicle,
      fuel: vehicle.fuel || vehicle.fuelType || '',
      environmentalClass: vehicle.environmentalClass || vehicle.euroNorm || '',
      extras: vehicle.extras || getFeatureValues(),
      images: vehicle.images || selected?.images || pendingImages,
      imageRecords: vehicle.imageRecords || selected?.imageRecords || []
    };
    const generated = empty ? { facebook: '', instagram: '', whatsapp: '' } : window.LayanSocialGenerator.generateAll(enrichedVehicle);
    $('facebook-output').value = generated.facebook;
    $('instagram-output').value = generated.instagram;
    $('whatsapp-output').value = generated.whatsapp;

    const facebookLink = $('open-facebook-link');
    const instagramLink = $('open-instagram-link');
    const whatsappLink = $('open-whatsapp-link');

    if (facebookLink) {
      facebookLink.href = 'https://business.facebook.com/latest/composer';
      facebookLink.toggleAttribute('aria-disabled', empty);
    }

    if (instagramLink) {
      instagramLink.href = 'https://www.instagram.com/create/select/';
      instagramLink.toggleAttribute('aria-disabled', empty);
    }

    whatsappLink.href = empty ? '#' : `https://wa.me/32486890002?text=${encodeURIComponent(generated.whatsapp)}`;
    whatsappLink.toggleAttribute('aria-disabled', empty);
  }

  async function refreshVehicles({ keepSelection = true } = {}) {
    state.vehicles = await window.LayanVehicleStore.loadAdminVehicles();
    if (keepSelection && state.selectedId) {
      const selected = selectedVehicle();
      if (selected) fillForm(selected);
      else resetForm();
    } else {
      renderVehicleList();
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    const vehicle = readFormVehicle();
    const error = validateVehicle(vehicle);
    if (error) {
      message(error, 'error');
      return;
    }

    const submit = els.form.querySelector('button[type="submit"]');
    submit.disabled = true;
    message('Opslaan...', '');

    try {
      const saved = await window.LayanVehicleStore.saveVehicle(vehicle);
      await window.LayanVehicleStore.replaceFeatures(saved.id, getFeatureValues());
      if (state.pendingFiles.length) {
        await window.LayanVehicleStore.uploadVehicleImages(saved, state.pendingFiles);
        state.pendingFiles = [];
        els.imageInput.value = '';
      }
      state.selectedId = saved.id;
      await refreshVehicles({ keepSelection: true });
      message('Wagen succesvol opgeslagen.', 'success');
    } catch (error) {
      message(error.message || 'Opslaan is mislukt.', 'error');
    } finally {
      submit.disabled = false;
    }
  }

  async function handleDeleteVehicle() {
    const vehicle = selectedVehicle();
    if (!vehicle) return;
    if (!confirm(`Verwijder ${title(vehicle)}? Deze actie kan niet ongedaan worden gemaakt.`)) return;

    try {
      await window.LayanVehicleStore.deleteVehicle(vehicle.id);
      state.selectedId = null;
      await refreshVehicles({ keepSelection: false });
      resetForm();
      message('Wagen verwijderd.', 'success');
    } catch (error) {
      message(error.message || 'Verwijderen is mislukt.', 'error');
    }
  }

  async function handleImageAction(target) {
    const vehicle = selectedVehicle();
    if (!vehicle) return;
    const records = (vehicle.imageRecords || []).slice();

    const featuredId = target.dataset.imageFeatured;
    const deleteId = target.dataset.imageDelete;
    const upId = target.dataset.imageUp;
    const downId = target.dataset.imageDown;

    try {
      if (featuredId) {
        await window.LayanVehicleStore.setFeaturedImage(vehicle.id, featuredId);
      }

      if (deleteId) {
        if (records.length <= 1 && !confirm('Dit is de laatste afbeelding. Toch verwijderen?')) return;
        const image = records.find(item => String(item.id) === String(deleteId));
        if (image) await window.LayanVehicleStore.deleteVehicleImage(image);
      }

      if (upId || downId) {
        const id = upId || downId;
        const index = records.findIndex(item => String(item.id) === String(id));
        const next = upId ? index - 1 : index + 1;
        if (index >= 0 && next >= 0 && next < records.length) {
          [records[index], records[next]] = [records[next], records[index]];
          await window.LayanVehicleStore.reorderVehicleImages(records);
        }
      }

      await refreshVehicles({ keepSelection: true });
      message('Afbeeldingen bijgewerkt.', 'success');
    } catch (error) {
      message(error.message || 'Afbeelding actie is mislukt.', 'error');
    }
  }

  function handleFeatureAction(target) {
    const row = target.closest('.feature-row');
    if (!row) return;
    if (target.matches('[data-feature-remove]')) row.remove();
    if (target.matches('[data-feature-up]') && row.previousElementSibling) {
      row.parentElement.insertBefore(row, row.previousElementSibling);
    }
    if (target.matches('[data-feature-down]') && row.nextElementSibling) {
      row.parentElement.insertBefore(row.nextElementSibling, row);
    }
    renderSocial({ ...readFormVehicle(), extras: getFeatureValues() });
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    download('layan-garage-vehicles.json', JSON.stringify(state.vehicles, null, 2), 'application/json');
  }

  function exportCsv() {
    const rows = [
      ['title', 'brand', 'model', 'year', 'price', 'mileage', 'fuel', 'transmission', 'condition', 'status', 'visible'],
      ...state.vehicles.map(vehicle => [
        title(vehicle),
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.price,
        vehicle.mileage,
        vehicle.fuel,
        vehicle.transmission,
        vehicle.condition === 'new' ? 'Nieuw' : 'Gebruikt',
        vehicle.status,
        vehicle.isVisible
      ])
    ];
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    download('layan-garage-vehicles.csv', csv, 'text/csv;charset=utf-8');
  }

  async function writeClipboard(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }

  function copyMessage(text, type = 'success') {
    const messageEl = $('copy-message');
    messageEl.textContent = text;
    messageEl.className = `admin-message ${type}`.trim();
    window.clearTimeout(copyMessage.timer);
    copyMessage.timer = window.setTimeout(() => {
      messageEl.textContent = '';
      messageEl.className = 'admin-message';
    }, 3600);
  }

  async function copyGenerated(targetId) {
    const target = $(targetId);
    if (!target?.value) return;
    try {
      await writeClipboard(target.value);
      copyMessage('Tekst gekopieerd.');
    } catch (error) {
      copyMessage('Kopiëren is mislukt. Selecteer de tekst en kopieer handmatig.', 'error');
    }
  }

  async function openSocialLink(event, link) {
    const targetId = link.dataset.copyTarget;
    const target = targetId ? $(targetId) : null;
    if (link.getAttribute('aria-disabled') === 'true' || !target?.value) {
      event.preventDefault();
      copyMessage('Selecteer of vul eerst een wagen in.', 'error');
      return;
    }

    event.preventDefault();
    const copyPromise = writeClipboard(target.value);
    const openedWindow = window.open(link.href, '_blank', 'noopener,noreferrer');

    try {
      await copyPromise;
      const platform = link.dataset.openSocial || 'socialmedia';
      const label = {
        facebook: 'Facebook Business Suite',
        instagram: 'Instagram',
        whatsapp: 'WhatsApp Business'
      }[platform] || 'socialmedia';

      const popupNote = openedWindow ? '' : ' Sta pop-ups toe als het venster niet opent.';
      copyMessage(`Tekst gekopieerd. ${label} wordt geopend. Upload de foto’s handmatig in het bericht.${popupNote}`);
    } catch (error) {
      copyMessage('Kopiëren is mislukt. Kopieer de tekst handmatig en probeer opnieuw.', 'error');
    }
  }

  function bindEvents() {
    els.vehicleList.addEventListener('click', event => {
      const item = event.target.closest('[data-select-vehicle]');
      if (!item) return;
      const vehicle = state.vehicles.find(entry => String(entry.id) === String(item.dataset.selectVehicle));
      if (vehicle) fillForm(vehicle);
    });

    els.form.addEventListener('submit', handleSave);
    els.resetBtn.addEventListener('click', resetForm);
    els.newBtn.addEventListener('click', resetForm);
    els.deleteBtn.addEventListener('click', handleDeleteVehicle);
    els.addFeatureBtn.addEventListener('click', () => addFeatureRow());
    els.featureList.addEventListener('click', event => handleFeatureAction(event.target));
    els.featureList.addEventListener('input', () => renderSocial({ ...readFormVehicle(), extras: getFeatureValues() }));
    els.imageList.addEventListener('click', event => handleImageAction(event.target));
    els.exportJsonBtn.addEventListener('click', exportJson);
    els.exportCsvBtn.addEventListener('click', exportCsv);

    els.imageInput.addEventListener('change', () => {
      state.pendingFiles = Array.from(els.imageInput.files || []);
      message(state.pendingFiles.length ? `${state.pendingFiles.length} foto(s) klaar om te uploaden. Klik Opslaan.` : '', '');
      renderSocial({ ...readFormVehicle(), extras: getFeatureValues() });
    });

    els.form.addEventListener('input', () => {
      syncAllOtherInputs();
      renderSocial({ ...readFormVehicle(), extras: getFeatureValues() });
    });

    els.form.addEventListener('change', () => {
      syncAllOtherInputs();
      renderSocial({ ...readFormVehicle(), extras: getFeatureValues() });
    });

    document.addEventListener('click', event => {
      const socialLink = event.target.closest('[data-open-social]');
      if (socialLink) {
        openSocialLink(event, socialLink);
        return;
      }

      const copyButton = event.target.closest('[data-copy-target]');
      if (copyButton) copyGenerated(copyButton.dataset.copyTarget);
    });
  }

  async function initializeAdminVehicles() {
    els.form = $('vehicle-form');
    if (!els.form) return;

    els.vehicleList = $('vehicle-list');
    els.vehicleCount = $('vehicle-count');
    els.editorState = $('editor-state');
    els.formMessage = $('vehicle-form-message');
    els.featureList = $('feature-list');
    els.imageList = $('image-list');
    els.imageInput = $('vehicle-images');
    els.resetBtn = $('reset-form-btn');
    els.newBtn = $('new-vehicle-btn');
    els.deleteBtn = $('delete-vehicle-btn');
    els.addFeatureBtn = $('add-feature-btn');
    els.exportJsonBtn = $('export-json-btn');
    els.exportCsvBtn = $('export-csv-btn');

    bindEvents();
    resetForm();
    syncAllOtherInputs();

    try {
      await refreshVehicles({ keepSelection: false });
      message('Voorraad geladen.', 'success');
    } catch (error) {
      message(error.message || 'Voorraad laden is mislukt.', 'error');
    }
  }

  window.addEventListener('admin:ready', initializeAdminVehicles);
})();
