# Performance & Core Web Vitals Engineering: Artupski WordPress Theme

## 1. Performance Target Matrix

Artupski is engineered to score **98–100 / 100** on Google Lighthouse and exceed all Core Web Vitals thresholds on standard shared hosting environments.

| Metric | Google CWV Threshold | Artupski Target | Architectural Strategy |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | ≤ 2.5s | **< 1.0s** | Preload hero image, `fetchpriority="high"`, zero render-blocking JS |
| **Cumulative Layout Shift (CLS)** | ≤ 0.1 | **0.000** | Strict explicit `width` & `height`, fixed aspect-ratio containers |
| **First Input Delay / INP** | ≤ 200ms | **< 50ms** | Micro lightweight vanilla JS runtime (<15KB), event delegation |
| **First Contentful Paint (FCP)** | ≤ 1.8s | **< 0.7s** | Minimal CSS payload (no heavy framework overhead), font preconnect |
| **Total Blocking Time (TBT)** | ≤ 200ms | **0ms** | Zero main-thread CPU blocking; asynchronous Turbo import |

---

## 2. Media Optimization & Responsive Delivery

### 2.1 Hero Media Loading Protocol
The hero section image on the front page and portfolio page is the critical LCP candidate. It is rendered with priority attributes:
```html
<img
  src="assets/images/hero-drafting.jpg"
  alt="Technical drafting by hand"
  width="1920"
  height="1280"
  fetchpriority="high"
  decoding="async"
  loading="eager"
/>
```

### 2.2 Below-the-Fold Lazy Loading & Intrinsic Ratios
All imagery outside the initial viewport automatically receives native lazy loading:
- `loading="lazy"`
- `decoding="async"`
- Container aspect ratios defined in CSS (`aspect-ratio: 4 / 3;` or `aspect-ratio: 16 / 9;`) to ensure the browser reserves exact bounding space before the image byte stream completes, preventing CLS shifts.

### 2.3 WebP & AVIF Generation
During media upload, WordPress hooks into `image_make_intermediate_size` to generate modern next-gen image formats (`.webp` and `.avif`) alongside standard JPEG assets.

---

## 3. Font Optimization Strategy

Typography from Google Fonts (Newsreader, Manrope, IBM Plex Mono) is optimized to eliminate FOIT (Flash of Invisible Text) and minimize FOUT (Flash of Unstyled Text):

```html
<!-- High-priority DNS preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Font stylesheet with display=swap -->
<link
  href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### Self-Hosted WOFF2 Alternative (GDPR / Enterprise Intranet)
When configured via Customizer, Google Fonts are disabled and replaced with locally bundled `.woff2` files loaded via `@font-face` rules with `font-display: swap;`.

---

## 4. Turbo Drive Caching & Memory Hygiene

Turbo Drive is a **locally bundled** asset (pinned version, no runtime CDN) and is a **progressive enhancement** — normal WordPress navigation works when it is absent. It caches visited pages in memory to deliver instantaneous back/forward and sub-50ms repeat page transitions. To prevent memory leaks and broken component states across long sessions:

### 4.1 State Reset Before Cache Snapshot
```javascript
document.addEventListener("turbo:before-cache", () => {
  // 1. Reset mobile menu drawer
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("primary-navigation");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  if (nav) nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  // 2. Close modal lightbox and restore focus
  const lb = document.querySelector("[data-lightbox]");
  if (lb) {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
  }

  // 3. Reset carousel tracks to index 0
  resetCarousels();
});
```

### 4.2 Idempotent Guarding
Per-page execution in `site.js` verifies `document.body.dataset.initialized` before wiring observers, preventing duplicate event listeners or memory inflation during repeated transitions.

---

## 5. CSS & JavaScript Asset Optimization

| Asset | Source Path | Minified Production Path | Gzipped Size | Delivery Strategy |
|---|---|---|---|---|
| Main Stylesheet | `assets/css/site.css` | `assets/css/site.min.css` | **~11 KB** | Non-render-blocking, inline critical variables |
| Core Runtime JS | `assets/js/site.js` | `assets/js/site.min.js` | **~4.8 KB** | Deferred module execution (`type="module"`) |
| Hotwire Turbo | Local bundle (`assets/js/vendor/turbo.js`) | Local cached ESM bundle | **~24 KB** | Static local `import()`; no runtime CDN |
