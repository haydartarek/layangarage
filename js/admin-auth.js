/* ============================================================
   LAYAN GARAGE BV — Admin Auth
   ============================================================ */

(function adminAuthModule() {
  function setMessage(el, text, type = '') {
    if (!el) return;
    el.textContent = text;
    el.className = `admin-message ${type}`.trim();
  }

  function setFieldError(form, name, text) {
    const target = form?.querySelector(`[data-error-for="${name}"]`);
    if (target) target.textContent = text || '';
  }

  function loginErrorMessage(error) {
    const message = String(error?.message || '').toLowerCase();
    if (message.includes('incorrect') || message.includes('invalid login')) {
      return 'E-mail of wachtwoord is niet correct.';
    }
    return error?.message || 'Inloggen is mislukt.';
  }

  function validateLogin(form) {
    const email = form.email.value.trim();
    const password = form.password.value;
    let valid = true;
    setFieldError(form, 'email', '');
    setFieldError(form, 'password', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setFieldError(form, 'email', 'Vul een geldig e-mailadres in.');
      valid = false;
    }
    if (password.length < 8) {
      setFieldError(form, 'password', 'Wachtwoord moet minstens 8 tekens bevatten.');
      valid = false;
    }
    return valid;
  }

  async function initializeLogin() {
    const form = document.getElementById('admin-login-form');
    const message = document.getElementById('admin-login-message');
    const store = window.LayanVehicleStore;
    if (!form || !store) return;

    if (!store.isConfigured()) {
      setMessage(message, 'Hostinger API is nog niet geconfigureerd.', 'error');
      form.querySelector('button')?.setAttribute('disabled', 'disabled');
      return;
    }

    try {
      if (await store.getCurrentSession()) {
        window.location.href = 'dashboard.html';
        return;
      }
    } catch (error) {
      setMessage(message, loginErrorMessage(error), 'error');
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!validateLogin(form)) return;
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      setMessage(message, 'Inloggen...', '');
      try {
        await store.login(form.email.value.trim(), form.password.value);
        window.location.href = 'dashboard.html';
      } catch (error) {
        setMessage(message, loginErrorMessage(error), 'error');
      } finally {
        submit.disabled = false;
      }
    });
  }

  async function initializeDashboardGuard() {
    const app = document.getElementById('admin-app');
    const blocked = document.getElementById('admin-blocked');
    const message = document.getElementById('admin-guard-message');
    const logout = document.getElementById('admin-logout');
    const store = window.LayanVehicleStore;
    if (!app || !blocked || !store) return;

    if (!store.isConfigured()) {
      setMessage(message, 'Hostinger API is nog niet geconfigureerd.', 'error');
      return;
    }

    let session;
    try {
      session = await store.getCurrentSession();
    } catch (error) {
      setMessage(message, loginErrorMessage(error), 'error');
      return;
    }
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    blocked.hidden = true;
    app.hidden = false;
    window.dispatchEvent(new CustomEvent('admin:ready', { detail: { session } }));
    logout?.addEventListener('click', async () => {
      try {
        await store.logout();
      } finally {
        window.location.href = 'login.html';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    initializeDashboardGuard();
  });
})();
