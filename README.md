# PT. RAJA TUA - Static Multi-Page Website

A client-facing redesign prototype for **PT. RAJA TUA** (rajatua.co.id), a 30+ year Indonesian construction, engineering (engineering) and interior firm founded in 1992.

The site is a static, multi-page HTML build with no bundler, no framework and no backend. It runs from any static file server.

Design direction lives in [`DESIGN.md`](./DESIGN.md).

---

## Structure

```
rajatua/
├── index.html            Home
├── about-us.html         About Us
├── portfolio.html        Portfolio (labelled concept gallery + lightbox)
├── contact-us.html       Contact Us (info + map)
├── assets/
│   ├── css/site.css      Design system (tokens + compositions)
│   ├── js/site.js        Behaviour: Turbo, menu, reveal, lightbox, protection
│   └── images/           21 verified photographs + brand logo, downloaded locally
├── tools/                Optional dev/QA scripts (not shipped to the browser)
├── DESIGN.md             Design direction + rationale
└── README.md
```

The header and footer markup is intentionally duplicated in each HTML file so every page is a complete, standalone document. This is what makes direct load, refresh and no-JS fallback all work.

## Running locally

Any static server works. From the project root:

```bash
# Python 3
python -m http.server 8080

# or Node
npx serve -l 8080

# or PHP
php -S localhost:8080
```

Then open <http://localhost:8080/>.

> Open the site over `http://` rather than `file://`. Turbo Drive and the Google Maps iframe both expect a real origin.

## Architecture

- **Static multi-page HTML5.** Four real pages with real destinations (`index.html`, `about-us.html`, `portfolio.html`, `contact-us.html`). No fake routes, no `href="#"`.
- **Tailwind CSS v3 via CDN** for incidental utilities, plus a substantial hand-written `<style>`/`site.css` for tokens and compositions. Tailwind's Preflight is disabled so it never fights the design system.
- **Vanilla JS** in `assets/js/site.js`, loaded as an ES module.
- **Google Fonts:** Newsreader, Manrope, IBM Plex Mono.
- **Icons:** hand-written inline SVG. No icon library is loaded, so there is no recognisable icon-set look.

## Turbo Drive behaviour

Turbo Drive is imported from jsDelivr as an ES module and enabled in `site.js`:

```js
const Turbo = await import("https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.12/+esm");
Turbo.session.drive = true;
```

Notes:

- The jsDelivr `+esm` bundle exposes its members directly (and sets `window.Turbo`); there is **no** named `Turbo` export, so the module namespace is imported directly.
- Internal links are intercepted, the body is fetched and swapped without a full reload, and history is updated. Back/forward, direct load and refresh all work.
- If the import fails (offline, CDN blocked), the `catch` logs an info message and the site falls back to standard HTML navigation. Nothing breaks.

**Lifecycle handling** (all in `site.js`):

| Event | What happens |
|---|---|
| `turbo:load` | Idempotent `init()` runs (guarded by `body.dataset.initialized`). |
| `turbo:render` | Guard is reset and `init()` re-runs so the fresh DOM gets its per-page wiring (scroll reveal, nav state, year). |
| `turbo:before-cache` | Mobile menu and lightbox are closed and transient state reset before the page is cached. |
| `turbo:before-visit` | Menu is closed so it never appears open mid-navigation. |

The `contextmenu`, `dragstart` and menu/lightbox `keydown` handlers are registered **once at module scope** and use event delegation, reading the current DOM (for example `document.activeElement` and `event.target.closest(...)`) at call time. Because they never rebind, their cumulative document listener count stays at exactly one across any number of Turbo navigations. Only the lightweight per-page setup in `init()` (scroll reveal, active nav state, footer year) is re-run on `turbo:render`, and it too is guarded so it cannot stack.

**Active nav state** is computed from `location.pathname` on load/render, and `aria-current="page"` is also written directly into each HTML file so it is correct before any JS runs.

## External dependencies

| Dependency | Where | Why |
|---|---|---|
| `cdn.tailwindcss.com` | All pages | Utility classes; Preflight disabled. |
| `fonts.googleapis.com` / `fonts.gstatic.com` | All pages | Newsreader, Manrope, IBM Plex Mono. |
| `cdn.jsdelivr.net` (`@hotwired/turbo`) | `site.js` | Turbo Drive. |
| `google.com/maps` embed | `contact-us.html` | Lazy-loaded location map. |

No other runtime dependencies. No npm install is required to view the site.

## Known limitations

- **Instagram link is wired.** The verified handle `@rajatuaproject` is linked from the footer of every page (`https://www.instagram.com/rajatuaproject`), opening in a new tab with `rel="noopener noreferrer"`.
- **Portfolio is a labelled concept gallery.** The project history on `portfolio.html` is transcribed from the company's own supplied record (grouped by year, duplicate entries removed). The image gallery is a clearly labelled concept gallery ("representative imagery, not PT. RAJA TUA projects") organised into four categories: Apartment, Mosque & Church, Warehouse, and Office / Building. It is not a photographic record of the named projects.
- **Map pin is approximate.** The exact pin could not be resolved from the published address, so the map is centred on the Serpong Utara area and a visible note says the pin is approximate.
- **Static-site protection is a deterrent only.** Context-menu suppression and image-drag prevention are silent conveniences, not security. Anyone can still view source, fetch assets or disable JavaScript. No encryption is performed or claimed.
- **Content is preserved as supplied.** Two paragraphs from the company's own copy contain the original wording, including minor typos ("carefully and carefully", "product quality our customers"), which were preserved rather than silently rewritten.

## Optional production step: minify / conservative obfuscation

Normal development needs no build. If you want smaller first-party files for deployment:

```bash
node tools/minify.mjs
```

This writes `assets/css/site.min.css` and `assets/js/site.min.js` (roughly 24% and 23% smaller). It is conservative by design:

- It only touches the project's **own** CSS/JS. Third-party libraries (Turbo, Tailwind, fonts) are never modified.
- The JS step strips comments and indentation only. It does **not** rename identifiers, so it cannot break closures, ES module exports or Turbo wiring.
- To use the output, point the HTML `<link>` and `<script>` at the `.min.*` files. This is a manual, opt-in step.

There is no claim of encryption or real code protection. Obfuscation, where used, is a light deterrent.

## QA tooling

```bash
node tools/qa-check.mjs        # verifies every local href/src resolves, imgs have alt, no em dashes
node tools/contrast-check.mjs  # WCAG AA contrast audit of the design tokens
```

## Accessibility

- Semantic landmarks, logical heading order, one `h1` per page.
- Visible focus rings on all interactive elements.
- Keyboard-operable mobile menu and lightbox (Escape, arrow keys, focus trap, focus return).
- `prefers-reduced-motion` support.
- Tap targets ≥ 44px; no horizontal overflow down to 320px.

## Content sources

All company facts, quotes, addresses, phone numbers and email come from the brief / the company's published material. No statistics, awards, project counts or testimonials were invented.
