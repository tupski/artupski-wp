/* ==========================================================================
   PT. RAJA TUA - site behaviour
   Turbo Drive + mobile menu + scroll reveal + category carousels + lightbox.
   Idempotent: safe across turbo:load / turbo:render / direct load.

   Document-level listeners (contextmenu, dragstart, click, keydown, touch) are
   registered ONCE at module scope using event delegation. They read the current
   DOM at call time, so they keep working across Turbo navigations without
   rebinding and can never stack. Per-page element wiring lives in init(), which
   is itself guarded so it also cannot stack.

   Degrades gracefully if Turbo CDN is unavailable (plain multi-page nav).
   ========================================================================== */

/* ---------- Module-scope delegated document listeners (registered once) ----
   These never rebind, so the cumulative document listener count stays at 1
   for each event type no matter how many Turbo navigations happen. Each
   handler resolves the live DOM through document.activeElement / event.target
   instead of closing over page nodes. */

/* Silent context-menu suppression (deterrent only, never security). */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

/* Image-drag prevention. */
document.addEventListener("dragstart", (e) => {
  if (e.target && e.target.tagName === "IMG") e.preventDefault();
});

/* ---------- Carousel engine (independent per [data-carousel]) ------------
   State lives on the element as data-index, so it survives re-renders and
   never leaks between categories. Only the active slide stays focusable. */
const carouselSlides = (carousel) =>
  Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
const carouselDots = (carousel) =>
  Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
const carouselThumbs = (carousel) =>
  Array.from(carousel.querySelectorAll("[data-carousel-thumb]"));

const renderCarousel = (carousel, index) => {
  const slides = carouselSlides(carousel);
  if (!slides.length) return;
  const i = ((index % slides.length) + slides.length) % slides.length;
  carousel.dataset.index = String(i);
  const track = carousel.querySelector("[data-carousel-track]");
  if (track) track.style.transform = `translateX(-${i * 100}%)`;
  carouselDots(carousel).forEach((dot, di) => {
    const active = di === i;
    dot.classList.toggle("is-active", active);
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  carouselThumbs(carousel).forEach((thumb, ti) => {
    const active = ti === i;
    thumb.classList.toggle("is-active", active);
    if (active) {
      thumb.setAttribute("aria-current", "true");
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    } else {
      thumb.removeAttribute("aria-current");
    }
  });
  slides.forEach((slide, si) => {
    const active = si === i;
    slide.setAttribute("aria-hidden", active ? "false" : "true");
    slide.querySelectorAll("[data-lightbox-item]").forEach((btn) => {
      if (active) btn.removeAttribute("tabindex");
      else btn.setAttribute("tabindex", "-1");
    });
  });
};

const moveCarousel = (carousel, dir) => {
  const slides = carouselSlides(carousel);
  if (!slides.length) return;
  const current = Number(carousel.dataset.index || 0);
  renderCarousel(carousel, current + dir);
};

const resetCarousels = () => {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    renderCarousel(carousel, 0);
  });
};

/* ---------- Keyboard handling for the mobile menu, carousels, lightbox ---- */
document.addEventListener("keydown", (e) => {
  /* Mobile menu: Escape closes it and returns focus to the toggle. */
  const toggle = document.querySelector("[data-menu-toggle]");
  if (toggle && toggle.getAttribute("aria-expanded") === "true" && e.key === "Escape") {
    const nav = document.getElementById("primary-navigation");
    toggle.setAttribute("aria-expanded", "false");
    if (nav) nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.focus();
    return;
  }

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxOpen = lightbox && lightbox.classList.contains("is-open");

  /* Carousels: left/right arrows move the carousel that owns focus, but only
     while the lightbox is closed (the lightbox takes over arrow keys). */
  if (!lightboxOpen) {
    const carousel = e.target.closest && e.target.closest("[data-carousel]");
    if (carousel && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      moveCarousel(carousel, e.key === "ArrowRight" ? 1 : -1);
      return;
    }
  }

  /* Gallery lightbox: Escape closes, arrows navigate, Tab traps focus. */
  if (!lightboxOpen) return;

  const imgEl = lightbox.querySelector("[data-lb-img]");
  const capEl = lightbox.querySelector("[data-lb-cap]");
  const countEl = lightbox.querySelector("[data-lb-count]");
  const buttons = lightboxItems(lightbox.dataset.group || "");
  if (!imgEl || !countEl) return;

  const renderAt = (i) => {
    if (!buttons.length) return;
    const btn = buttons[i % buttons.length];
    const full = btn.getAttribute("data-full") || btn.querySelector("img")?.src;
    const caption = btn.getAttribute("data-caption") || "";
    const meta = btn.getAttribute("data-meta") || "";
    imgEl.src = full;
    imgEl.alt = btn.querySelector("img")?.alt || caption;
    if (capEl) capEl.innerHTML = meta ? `<strong>${caption}</strong> &middot; ${meta}` : caption;
    countEl.textContent = `${(i % buttons.length) + 1} / ${buttons.length}`;
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    const returnTo = lightbox.__lastFocused;
    if (returnTo && returnTo.focus) returnTo.focus();
  };

  const step = (dir) => {
    if (!buttons.length) return;
    const current = Number(lightbox.dataset.index || 0);
    const next = (current + dir + buttons.length) % buttons.length;
    lightbox.dataset.index = String(next);
    renderAt(next);
  };

  if (e.key === "Escape") {
    close();
    return;
  }
  if (e.key === "ArrowRight") {
    step(1);
    return;
  }
  if (e.key === "ArrowLeft") {
    step(-1);
    return;
  }
  if (e.key === "Tab") {
    const focusables = lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ---------- Lightbox helpers (group-scoped) -------------------------------
   Items carry data-lightbox-group so each category carousel opens only its own
   images; navigation inside the lightbox never crosses categories. */
function lightboxItems(group) {
  return Array.from(document.querySelectorAll("[data-lightbox-item]")).filter(
    (b) => (b.getAttribute("data-lightbox-group") || "") === (group || "")
  );
}

const openLightbox = (btn) => {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;
  const imgEl = lightbox.querySelector("[data-lb-img]");
  const capEl = lightbox.querySelector("[data-lb-cap]");
  const countEl = lightbox.querySelector("[data-lb-count]");
  const closeBtn = lightbox.querySelector("[data-lb-close]");
  if (!imgEl || !countEl || !closeBtn) return;

  const group = btn.getAttribute("data-lightbox-group") || "";
  const list = lightboxItems(group);
  const idx = Math.max(0, list.indexOf(btn));
  const full = btn.getAttribute("data-full") || btn.querySelector("img")?.src;
  const caption = btn.getAttribute("data-caption") || "";
  const meta = btn.getAttribute("data-meta") || "";

  lightbox.__lastFocused = document.activeElement;
  lightbox.dataset.group = group;
  lightbox.dataset.index = String(idx);
  imgEl.src = full;
  imgEl.alt = btn.querySelector("img")?.alt || caption;
  if (capEl) capEl.innerHTML = meta ? `<strong>${caption}</strong> &middot; ${meta}` : caption;
  countEl.textContent = `${idx + 1} / ${list.length}`;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  closeBtn.focus();
};

const closeLightbox = () => {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  const returnTo = lightbox.__lastFocused;
  if (returnTo && returnTo.focus) returnTo.focus();
};

const stepLightbox = (dir) => {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox || !lightbox.classList.contains("is-open")) return;
  const imgEl = lightbox.querySelector("[data-lb-img]");
  const capEl = lightbox.querySelector("[data-lb-cap]");
  const countEl = lightbox.querySelector("[data-lb-count]");
  if (!imgEl || !countEl) return;
  const list = lightboxItems(lightbox.dataset.group || "");
  if (!list.length) return;
  const current = Number(lightbox.dataset.index || 0);
  const next = (current + dir + list.length) % list.length;
  lightbox.dataset.index = String(next);
  const btn = list[next];
  imgEl.src = btn.getAttribute("data-full") || btn.querySelector("img")?.src;
  imgEl.alt = btn.querySelector("img")?.alt || btn.getAttribute("data-caption") || "";
  const caption = btn.getAttribute("data-caption") || "";
  const meta = btn.getAttribute("data-meta") || "";
  if (capEl) capEl.innerHTML = meta ? `<strong>${caption}</strong> &middot; ${meta}` : caption;
  countEl.textContent = `${next + 1} / ${list.length}`;
};

/* ---------- Delegated click handling (menu, carousels, lightbox) ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;

  /* Mobile menu toggle open/close. */
  const toggle = t.closest && t.closest("[data-menu-toggle]");
  if (toggle) {
    const nav = document.getElementById("primary-navigation");
    const body = document.body;
    if (nav) {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
      body.classList.toggle("menu-open", !open);
    }
    return;
  }

  /* Closing the mobile menu when a link inside it is activated. */
  const navLink = t.closest && t.closest("#primary-navigation a");
  if (navLink) {
    const nav = document.getElementById("primary-navigation");
    const tgl = document.querySelector("[data-menu-toggle]");
    if (nav) nav.classList.remove("is-open");
    if (tgl) tgl.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    return;
  }

  /* Carousel prev / next. */
  const prev = t.closest && t.closest("[data-carousel-prev]");
  if (prev) {
    const carousel = prev.closest("[data-carousel]");
    if (carousel) moveCarousel(carousel, -1);
    return;
  }
  const next = t.closest && t.closest("[data-carousel-next]");
  if (next) {
    const carousel = next.closest("[data-carousel]");
    if (carousel) moveCarousel(carousel, 1);
    return;
  }

  /* Carousel dot navigation. */
  const dot = t.closest && t.closest("[data-carousel-dot]");
  if (dot) {
    const carousel = dot.closest("[data-carousel]");
    if (carousel) {
      const dots = carouselDots(carousel);
      renderCarousel(carousel, dots.indexOf(dot));
    }
    return;
  }

  /* Carousel thumbnail navigation. */
  const thumb = t.closest && t.closest("[data-carousel-thumb]");
  if (thumb) {
    const carousel = thumb.closest("[data-carousel]");
    if (carousel) {
      const thumbs = carouselThumbs(carousel);
      renderCarousel(carousel, thumbs.indexOf(thumb));
    }
    return;
  }

  /* Gallery lightbox open (group-scoped). */
  const item = t.closest && t.closest("[data-lightbox-item]");
  if (item) {
    openLightbox(item);
    return;
  }

  /* Lightbox close / backdrop click / prev / next. */
  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox && lightbox.classList.contains("is-open")) {
    if (t.closest && t.closest("[data-lb-close]")) {
      closeLightbox();
      return;
    }
    if (t.closest && t.closest("[data-lb-prev]")) {
      stepLightbox(-1);
      return;
    }
    if (t.closest && t.closest("[data-lb-next]")) {
      stepLightbox(1);
      return;
    }
    if (t === lightbox || (t.classList && t.classList.contains("lightbox__stage"))) {
      closeLightbox();
      return;
    }
  }

  /* Legacy portfolio filters (kept for any page still using them). */
  const filterBtn = t.closest && t.closest("[data-filter]");
  if (filterBtn) {
    const filter = filterBtn.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach((b) =>
      b.setAttribute("aria-pressed", b === filterBtn ? "true" : "false")
    );
    document.querySelectorAll("[data-category]").forEach((el) => {
      const cat = el.getAttribute("data-category");
      const show = filter === "all" || cat === filter;
      el.classList.toggle("is-hidden", !show);
    });
  }
});

/* ---------- Delegated swipe support for carousels (registered once) -------- */
let touchStartX = null;
let touchCarousel = null;
document.addEventListener(
  "touchstart",
  (e) => {
    const carousel = e.target.closest && e.target.closest("[data-carousel]");
    if (!carousel || !e.touches || !e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchCarousel = carousel;
  },
  { passive: true }
);
document.addEventListener(
  "touchend",
  (e) => {
    if (touchStartX === null || !touchCarousel || !e.changedTouches.length) {
      touchStartX = null;
      touchCarousel = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) moveCarousel(touchCarousel, dx < 0 ? 1 : -1);
    touchStartX = null;
    touchCarousel = null;
  },
  { passive: true }
);

/* ---------- Per-page initialisation (scroll reveal, nav state, year,
   carousels). Guarded so it never stacks across turbo:load / turbo:render. --- */
const init = () => {
  const body = document.body;
  if (!body || body.dataset.initialized === "true") return;
  body.dataset.initialized = "true";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Active navigation state. */
  let path = window.location.pathname.split("/").pop() || "index.html";
  if (path === "") path = "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const target = link.getAttribute("data-nav-link");
    if (target === path) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  /* 2. Scroll reveal (one observer per freshly rendered DOM). */
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => {
      if (el.classList.contains("is-visible")) return;
      io.observe(el);
    });
  }

  /* 3. Initialise carousels from a clean index (fresh DOM). */
  resetCarousels();

  /* 4. Footer year (only if an element opts in). */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
};

/* ---------- Turbo lifecycle wiring ---------- */
const boot = () => {
  init();
};

document.addEventListener("turbo:load", boot);
document.addEventListener("turbo:render", () => {
  document.body.dataset.initialized = "false";
  boot();
});
document.addEventListener("turbo:before-cache", () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("primary-navigation");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  if (nav) nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  const lb = document.querySelector("[data-lightbox]");
  if (lb) {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
  }
  resetCarousels();
});
document.addEventListener("turbo:before-visit", () => {
  const nav = document.getElementById("primary-navigation");
  if (nav) nav.classList.remove("is-open");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
});

/* Direct load / no-Turbo fallback */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

/* ---------- Turbo Drive ----------
   The jsDelivr "+esm" bundle exposes members directly (and sets window.Turbo);
   there is no named "Turbo" export, so import the namespace. */
try {
  const Turbo = await import("https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.12/+esm");
  Turbo.session.drive = true;
} catch (err) {
  /* Graceful fallback: standard multi-page navigation still works. */
  console.info("Turbo Drive unavailable; using standard navigation.");
}
