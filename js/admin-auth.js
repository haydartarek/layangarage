/* ============================================================
   LAYAN GARAGE BV — Admin Auth
   ============================================================ */

(function adminAuthModule() {
  function getClient() {
    return window.LayanVehicleStore?.getClient?.() || null;
  }

  function setMessage(el, text, type = '') {
    if (!el) return;
    el.textContent = text;
    el.className = `admin-message ${type}`.trim();
  }

  function setFieldError(form, name, text) {
    const target = form?.querySelector(`[data-error-for="${name}"]`);
    if (target) target.textContent = text || '';
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
    if (!form) return;

    if (!window.LayanVehicleStore?.isConfigured?.()) {
      setMessage(message, 'Supabase is nog niet geconfigureerd. Vul js/supabase-config.js in.', 'error');
      form.querySelector('button')?.setAttribute('disabled', 'disabled');
      return;
    }

    const client = getClient();
    if (!client) {
      setMessage(message, 'Supabase client kon niet worden geladen.', 'error');
      return;
    }

    const existing = await window.LayanVehicleStore.getCurrentSession();
    if (existing) window.location.href = 'dashboard.html';

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!validateLogin(form)) return;

      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      setMessage(message, 'Inloggen...', '');

      try {
        const { error } = await client.auth.signInWithPassword({
          email: form.email.value.trim(),
          password: form.password.value
        });
        if (error) throw error;
        window.location.href = 'dashboard.html';
      } catch (error) {
        setMessage(message, error.message || 'Inloggen is mislukt.', 'error');
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
    if (!app || !blocked) return;

    if (!window.LayanVehicleStore?.isConfigured?.()) {
      setMessage(message, 'Supabase is nog niet geconfigureerd. Vul js/supabase-config.js in voordat de admin werkt.', 'error');
      return;
    }

    const client = getClient();
    const session = await window.LayanVehicleStore.getCurrentSession();
    if (!client || !session) {
      window.location.href = 'login.html';
      return;
    }

    blocked.hidden = true;
    app.hidden = false;
    window.dispatchEvent(new CustomEvent('admin:ready', { detail: { session } }));

    logout?.addEventListener('click', async () => {
      await client.auth.signOut();
      window.location.href = 'login.html';
    });

    client.auth.onAuthStateChange((event, activeSession) => {
      if (!activeSession && event !== 'INITIAL_SESSION') window.location.href = 'login.html';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    initializeDashboardGuard();
  });
})();
