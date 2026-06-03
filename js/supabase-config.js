/* ============================================================
   LAYAN GARAGE BV — Supabase Config
   Fill these values after creating the Supabase project.
   Never place a service_role key in this file.
   ============================================================ */

window.LayanSupabaseConfig = {
  url: 'https://woilhkvivdtrjxblutei.supabase.co',
  anonKey: 'sb_publishable_CvgLOsD2gPlXDjmWxXSTIA_Akk1kRml',
  storageBucket: 'vehicle-images',
  publicSiteUrl: 'https://layangaragebv.be',
  previewSiteUrl: 'https://haydartarek.github.io/layangarage/'
};

window.hasLayanSupabaseConfig = function hasLayanSupabaseConfig() {
  const config = window.LayanSupabaseConfig || {};
  return Boolean(
    config.url &&
    config.anonKey &&
    /^https:\/\/.+\.supabase\.co$/i.test(config.url)
  );
};
