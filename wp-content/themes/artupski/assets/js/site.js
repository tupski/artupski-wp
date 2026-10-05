/* ==========================================================================
   Artupski — site behaviour (foundation layer)

   Boots the theme runtime and loads the LOCALLY BUNDLED Turbo Drive from
   `./vendor/turbo.js`. There is no runtime CDN request.

   Turbo is strictly progressive enhancement and is ENABLED by default
   (`window.artupskiSettings.turboEnabled`, default true). If it is disabled,
   unavailable, or the local bundle fails to load, standard WordPress
   multi-page navigation keeps working.

   Idempotent: safe across turbo:load / turbo:render / direct load.
   Interactive components (menu, carousels, lightbox) are implemented in a
   later phase; this file provides the lifecycle scaffolding only.
   ========================================================================== */

/* Runtime settings injected by PHP (wp_add_inline_script). */
const settings = window.artupskiSettings || {};
const turboEnabled = settings.turboEnabled !== false;

/* Per-page initialisation. Guarded so it never stacks across Turbo visits. */
const init = () => {
  const body = document.body;
  if (!body || body.dataset.initialized === "true") return;
  body.dataset.initialized = "true";

  /* Footer year (only if an element opts in). */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
};

const boot = () => {
  init();
};

/* Turbo lifecycle wiring. Registered once at module scope. */
document.addEventListener("turbo:load", boot);
document.addEventListener("turbo:render", () => {
  if (document.body) document.body.dataset.initialized = "false";
  boot();
});
document.addEventListener("turbo:before-cache", () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("primary-navigation");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  if (nav) nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
});

/* Direct load / no-Turbo fallback. */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

/* ---------- Turbo Drive (local bundle, progressive enhancement) ----------
   The vendored ESM build exposes members directly and sets window.Turbo. */
if (turboEnabled) {
  try {
    const Turbo = await import("./vendor/turbo.js");
    Turbo.session.drive = true;
  } catch (err) {
    /* Graceful fallback: standard multi-page navigation still works. */
    console.info("Turbo Drive unavailable; using standard navigation.");
  }
}
