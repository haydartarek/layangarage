/* ============================================================
   LAYAN GARAGE BV — main.js
   Navigation | Scroll | Active Nav | Form | Counter | FAQ
============================================================ */

/* ── HEADER SCROLL EFFECT ── */
function initializeHeaderScroll() {
  const h = document.getElementById('site-header');
  if (!h) return;
  window.addEventListener('scroll', () => {
    h.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── MOBILE NAVIGATION ── */
function initializeMobileNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  const links  = document.querySelectorAll('.mobile-menu-link');
  if (!toggle || !menu) return;

  const iconOpen  = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`;
  const iconClose = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

  function closeMenu({ restoreFocus = false } = {}) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
    toggle.innerHTML = iconOpen;
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
    toggle.innerHTML = isOpen ? iconClose : iconOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach(link => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ── SMOOTH SCROLL ── */
function initializeSmoothScrolling() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getHeaderOffset() {
    const header = document.getElementById('site-header');
    const styles = getComputedStyle(document.documentElement);
    const cssHeader = parseFloat(styles.getPropertyValue('--header-h')) || 0;
    if (!header) return cssHeader + 24;

    const rect = header.getBoundingClientRect();
    return Math.max(cssHeader, rect.height + Math.max(rect.top, 0)) + 24;
  }

  function getSamePageHash(href) {
    if (!href || href === '#') return '';

    try {
      const url = new URL(href, window.location.href);
      const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
      const targetPath = url.pathname.replace(/\/index\.html$/, '/');
      if (url.origin !== window.location.origin || targetPath !== currentPath || !url.hash) return '';
      return url.hash;
    } catch {
      return href.startsWith('#') ? href : '';
    }
  }

  function findHashTarget(hash) {
    const id = decodeURIComponent(hash.slice(1));
    return document.getElementById(id);
  }

  function scrollToTarget(target) {
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', e => {
      if (e.defaultPrevented) return;

      const hash = getSamePageHash(link.getAttribute('href'));
      if (!hash) return;

      const target = findHashTarget(hash);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, '', hash);
      scrollToTarget(target);
    });
  });
}

/* ── SERVICE DETAILS ── */
function initializeServiceDetails() {
  const tabsRoot = document.querySelector('[data-service-tabs]');
  if (!tabsRoot) return;

  const tabs = Array.from(tabsRoot.querySelectorAll('.service-tab'));
  const panels = Array.from(tabsRoot.querySelectorAll('.service-tab-panel'));
  if (!tabs.length || !panels.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getHeaderOffset() {
    const header = document.getElementById('site-header');
    const cssHeader = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
    if (!header) return cssHeader + 24;

    const rect = header.getBoundingClientRect();
    return Math.max(cssHeader, rect.height + Math.max(rect.top, 0)) + 24;
  }

  function scrollTabsIntoView() {
    const top = tabsRoot.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  function activatePanel(panelId, { updateHash = false, scroll = false, focusTab = false } = {}) {
    const panel = panels.find(item => item.id === panelId) || panels[0];
    const activeTab = tabs.find(tab => tab.dataset.serviceTarget === panel.id);

    panels.forEach(item => {
      const isActive = item === panel;
      item.classList.toggle('active', isActive);
      item.hidden = !isActive;
    });

    tabs.forEach(tab => {
      const isActive = tab === activeTab;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    const panelHash = `#${panel.id}`;
    if (updateHash && window.location.hash !== panelHash) history.pushState(null, '', panelHash);
    if (scroll) scrollTabsIntoView();
    if (focusTab && activeTab) activeTab.focus();
  }

  function openFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id.startsWith('service-')) activatePanel(id);
  }

  function handleTabClick(e) {
    const tab = e.target.closest('.service-tab');
    if (!tab || !tabsRoot.contains(tab)) return;

    e.preventDefault();
    activatePanel(tab.dataset.serviceTarget, { updateHash: true });
  }

  tabsRoot.addEventListener('click', handleTabClick);
  tabsRoot.addEventListener('mouseup', e => {
    if (e.button === 0) handleTabClick(e);
  });

  tabs.forEach((tab, index) => {
    tab.tabIndex = tab.classList.contains('active') ? 0 : -1;

    tab.addEventListener('keydown', e => {
      const isNext = e.key === 'ArrowRight' || e.key === 'ArrowDown';
      const isPrev = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
      if (!isNext && !isPrev) return;

      e.preventDefault();
      const nextIndex = isNext
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
      activatePanel(tabs[nextIndex].dataset.serviceTarget, { updateHash: true, focusTab: true });
    });
  });

  document.querySelectorAll('a[href^="#service-"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      e.preventDefault();
      activatePanel(id, { updateHash: true, scroll: true });
    }, true);
  });

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  if (!window.location.hash.startsWith('#service-')) activatePanel(panels[0].id);
}

/* ── ACTIVE NAV ── */
function initializeActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link, .mobile-menu-link');

  function update() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = '#' + s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── SCROLL TO TOP ── */
function initializeScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;
  function updateScrollButton() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    btn.classList.toggle('visible', progress >= 0.6);
  }

  window.addEventListener('scroll', updateScrollButton, { passive: true });
  window.addEventListener('resize', updateScrollButton);
  updateScrollButton();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── CONTACT FORM ── */
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('form-message');
  if (!form || !msg) return;

  const WEB3FORMS_ACCESS_KEY = '8361b3bb-46eb-4a17-9437-9e06d980a2ff';
  const submitButton = form.querySelector('[type="submit"]');

  const fields = {
    naam: form.querySelector('[name="naam"]'),
    telefoon: form.querySelector('[name="telefoon"]'),
    email: form.querySelector('[name="email"]'),
    bericht: form.querySelector('[name="bericht"]')
  };

  const knownEmailDomains = new Set([
    'layangaragebv.be',
    'gmail.com', 'googlemail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'yahoo.com', 'yahoo.be', 'yahoo.fr', 'yahoo.nl', 'ymail.com',
    'proton.me', 'protonmail.com',
    'telenet.be', 'pandora.be',
    'proximus.be', 'skynet.be',
    'scarlet.be', 'orange.be', 'base.be',
    'edpnet.be', 'mail.be',
    'ziggo.nl', 'kpnmail.nl', 'planet.nl', 'xs4all.nl', 'hetnet.nl',
    'orange.fr', 'wanadoo.fr', 'free.fr', 'laposte.net', 'sfr.fr',
    'web.de', 'gmx.de', 'gmx.net', 't-online.de'
  ]);

  const blockedEmailDomains = new Set([
    'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com',
    'guerrillamail.com', 'yopmail.com', 'trashmail.com', 'fakeinbox.com',
    'dispostable.com', 'maildrop.cc', 'sharklasers.com'
  ]);

  const fieldMessages = {
    naam: {
      empty: 'Vul uw naam in.',
      invalid: 'Naam moet 3 tot 20 letters bevatten.'
    },
    telefoon: {
      empty: 'Vul uw telefoonnummer in.',
      invalid: 'Gebruik een geldig Europees telefoonnummer, bijvoorbeeld +32 486 89 00 02 of 0486 89 00 02.'
    },
    email: {
      empty: 'Vul uw e-mailadres in.',
      invalid: 'Gebruik een geldig e-mailadres van een bekende provider zoals Gmail, Telenet, Proximus, Outlook of iCloud.',
      blocked: 'Tijdelijke of spam e-maildomeinen worden niet aanvaard.'
    },
    bericht: {
      empty: 'Schrijf kort waarmee wij u kunnen helpen.',
      invalid: 'Bericht moet tussen 20 en 300 tekens bevatten.'
    }
  };

  function ensureErrorElement(input) {
    const field = input.closest('.field');
    if (!field) return null;
    let error = field.querySelector('.field-error-message');
    if (!error) {
      error = document.createElement('p');
      error.className = 'field-error-message';
      error.id = `${input.id}-error`;
      field.appendChild(error);
      input.setAttribute('aria-describedby', error.id);
    }
    return error;
  }

  function setFieldError(input, message) {
    const field = input.closest('.field');
    const error = ensureErrorElement(input);
    if (!field || !error) return;
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
  }

  function clearFieldError(input) {
    const field = input.closest('.field');
    const error = field?.querySelector('.field-error-message');
    if (field) field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
  }

  function normalizedPhone(value) {
    return value.replace(/[\s().-]/g, '');
  }

  function isEuropeanPhone(value) {
    const phone = normalizedPhone(value);
    if (/^\+[1-9]\d{7,14}$/.test(phone)) return true;
    if (/^00[1-9]\d{7,14}$/.test(phone)) return true;
    if (/^0\d{8,10}$/.test(phone)) return true;
    return false;
  }

  function validateName(value) {
    if (!value) return fieldMessages.naam.empty;
    if (value.length < 3 || value.length > 20) return fieldMessages.naam.invalid;
    if (!/^[\p{L}\p{M}' -]+$/u.test(value)) return fieldMessages.naam.invalid;
    return '';
  }

  function validateEmail(value) {
    if (!value) return fieldMessages.email.empty;
    const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!basicEmail.test(value)) return fieldMessages.email.invalid;

    const domain = value.split('@').pop().toLowerCase();
    if (blockedEmailDomains.has(domain)) return fieldMessages.email.blocked;
    if (!knownEmailDomains.has(domain)) return fieldMessages.email.invalid;
    return '';
  }

  function validateMessage(value) {
    if (!value) return fieldMessages.bericht.empty;
    if (value.length < 20 || value.length > 300) return fieldMessages.bericht.invalid;
    return '';
  }

  function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    let error = '';

    if (name === 'naam') error = validateName(value);
    if (name === 'telefoon') error = !value ? fieldMessages.telefoon.empty : (!isEuropeanPhone(value) ? fieldMessages.telefoon.invalid : '');
    if (name === 'email') error = validateEmail(value.toLowerCase());
    if (name === 'bericht') error = validateMessage(value);

    if (error) {
      setFieldError(input, error);
      return false;
    }

    clearFieldError(input);
    return true;
  }

  function validateForm() {
    return Object.values(fields).map(input => validateField(input)).every(Boolean);
  }

  Object.values(fields).forEach(input => {
    if (!input) return;
    ensureErrorElement(input);
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      msg.className = '';
      msg.textContent = '';
    });
  });

  fields.telefoon?.addEventListener('input', () => {
    const cleaned = fields.telefoon.value.replace(/[^\d+\s().-]/g, '');
    if (fields.telefoon.value !== cleaned) fields.telefoon.value = cleaned;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const v = n => (form.querySelector(`[name="${n}"]`) || {}).value?.trim() || '';

    if (!validateForm()) {
      msg.className = 'error';
      msg.textContent = 'Controleer de gemarkeerde velden voordat u het bericht verstuurt.';
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const originalButtonText = submitButton?.textContent || '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Bericht wordt verzonden...';
    }

    msg.className = 'info';
    msg.textContent = 'Uw bericht wordt verzonden. Even geduld alstublieft.';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Websitebericht van ${v('naam')} - Layan Garage BV`,
          from_name: v('naam'),
          name: v('naam'),
          telefoon: v('telefoon'),
          email: v('email'),
          message: v('bericht'),
          page: window.location.href
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Het bericht kon niet worden verzonden.');
      }

      msg.className = 'success';
      msg.textContent = 'Uw bericht is succesvol verzonden. Wij nemen zo snel mogelijk contact met u op.';
      form.reset();
      Object.values(fields).forEach(input => input && clearFieldError(input));
    } catch (error) {
      msg.className = 'error';
      msg.textContent = 'Verzenden is mislukt. Probeer opnieuw of neem direct contact op via WhatsApp of telefoon.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

/* ── FAQ ACCORDION ── */
function initializeFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq-answer.open').forEach(a => {
        a.classList.remove('open');
        a.previousElementSibling.classList.remove('open');
        a.previousElementSibling.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        answer.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── STATS COUNTER — parallel, triggered once on scroll ── */
function initializeStatsCounter() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = target >= 1000 ? 2000 : 1400;
    let start      = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.round(easeOutQuart(progress) * target);
      el.textContent = (current >= 1000 ? current.toLocaleString('nl-BE') : current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (target >= 1000 ? target.toLocaleString('nl-BE') : target) + suffix;
    }
    requestAnimationFrame(step);
  }

  const statsBlock = document.querySelector('.hero-stats');
  if (!statsBlock) return;

  let observed = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observed) {
        observed = true;
        observer.disconnect();
        counters.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsBlock);
}

/* ── FOOTER YEAR ── */
function initializeFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ── HOURS TODAY HIGHLIGHT ── */
function initializeHoursHighlight() {
  const days = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
  const todayName = days[new Date().getDay()];
  document.querySelectorAll('.hours-row strong').forEach(el => {
    if (el.textContent.trim() === todayName) {
      el.closest('.hours-row').classList.add('today');
    }
  });
}

/* ── SUBTLE REVEAL ANIMATIONS ── */
function initializeRevealAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll([
    '.section-head',
    '.trust-card',
    '.about-media',
    '.about-content',
    '.service-tabs',
    '.maintenance-media',
    '.maintenance-content',
    '.selling-panel',
    '.sales-path-card',
    '.inventory-cta',
    '.cta-band',
    '.contact-info',
    '.contact-form-wrap',
    '.faq-item',
    '.legal-card'
  ].join(','));

  if (!items.length) return;

  items.forEach((item, index) => {
    item.classList.add('reveal-item');
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 45}ms`;
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(item => observer.observe(item));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initializeFooterYear();
  initializeHeaderScroll();
  initializeMobileNavigation();
  initializeSmoothScrolling();
  initializeServiceDetails();
  initializeActiveNavigation();
  initializeScrollToTop();
  initializeContactForm();
  initializeFaqAccordion();
  initializeStatsCounter();
  initializeHoursHighlight();
  initializeRevealAnimations();
});
