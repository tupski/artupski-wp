# Quality Assurance & Testing Suite: Artupski WordPress Theme

## 1. Overview & Testing Philosophy

Quality assurance for Artupski is structured across automated CLI pipelines, browser accessibility audits, cross-browser rendering tests, and functional WordPress lifecycle verification. Every component from the static Contractor baseline must pass stringent validation before production tagging.

---

## 2. Automated Test Matrix & Tooling

```
+-----------------------------------------------------------------------------------+
|                            AUTOMATED QA PIPELINE                                  |
|   ├──► PHP Syntax Lint: tools/php-lint.mjs (php -l across wp-content/)            |
|   ├──► Contrast Verification: tools/contrast-check.mjs (WCAG AA >= 4.5:1)         |
|   ├──► Portfolio Audit: tools/_audit-portfolio.mjs (45 deduplicated entries)     |
|   ├──► Theme Build: tools/build-theme.mjs (site.css/fonts.css/site.js -> *.min)  |
|   ├──► Phase 2 Verification: tools/phase2-check.mjs (tokens/fonts/build sync)     |
|   └──► Comprehensive QA Runner: tools/qa-check.mjs                                |
+-----------------------------------------------------------------------------------+
```

### 2.1 Automated Tooling Verification
- **PHP Syntax Lint (`tools/php-lint.mjs`)**: Runs `php -l` across every `.php` file under `wp-content/` (skips gracefully when PHP is unavailable). Also exposed as `npm run lint:php`.
- **Contrast Check (`tools/contrast-check.mjs`)**:
  - Tests foreground/background color tokens across paper and ink grounds.
  - Verifies `--ink` (`#16181C`) on `--paper` (`#F4F0E6`) >= 4.5:1.
  - Verifies `--muted` (`#6E6A61`) on `--paper` (`#F4F0E6`) >= 4.5:1.
  - Verifies `--crimson-lt` (`#E8798A`) on `--ink` (`#16181C`) >= 4.5:1.
  - Also exposed as `npm run test:contrast`.
- **Portfolio Integrity Check (`tools/_audit-portfolio.mjs`)**:
  - Validates that 45 projects exist across 2003–2024.
  - Ensures zero duplicate entries and valid taxonomy terms.
  - Also exposed as `npm run audit:portfolio`.
- **Theme Build (`tools/build-theme.mjs`)** — the **canonical** theme build/minification command:
  - Minifies first-party sources in place: `assets/css/site.css → site.min.css`, `assets/css/fonts.css → fonts.min.css`, `assets/js/site.js → site.min.js`.
  - Node standard library only; conservative transforms that preserve ES module `import`/`export` and Turbo wiring. The vendored `assets/js/vendor/turbo.js` is never touched.
  - Also exposed as `npm run build`.
- **Phase 2 Verification (`tools/phase2-check.mjs`)**:
  - Enforces `theme.json` as the single token source (no raw token redefinitions/hexes in `style.css`, `site.css`, `editor-style.css`).
  - Confirms self-hosted WOFF2 fonts exist and are referenced by `fonts.css`, with no runtime Google Fonts / external font / CDN URLs.
  - Confirms the minified builds are in sync with their sources (run `node tools/build-theme.mjs` to repair).
  - Also exposed as `npm run test:phase2`.
- **Font Fetch (`tools/fetch-fonts.mjs`)** (maintainers only): re-downloads and regenerates the self-hosted WOFF2 bundle and `fonts.css`. Also exposed as `npm run fonts`.
- **Comprehensive QA Runner (`tools/qa-check.mjs`)**: Validates that every local `href`/`src` in the static pages resolves, flags dead `href="#"` controls and images without `alt`, and reports asset sizes. Also exposed as `npm run test:qa` (and `npm test` runs QA + contrast).

---

## 3. Comprehensive Manual QA Checklists

### 3.1 Visual & Responsive Testing
- [ ] **Viewport Breakpoints**:
  - Mobile (360px, 390px, 412px)
  - Tablet (768px, 820px, 1024px)
  - Desktop (1280px, 1440px, 1920px)
- [ ] **Header Behavior**:
  - Wordmark rendering legible across all screens.
  - Hamburger menu opens smoothly on mobile; focuses first link.
  - Desktop navigation displays tracked uppercase typography with active `aria-current="page"` indicators.
- [ ] **Hero Section**:
  - Scrim preserves contrast over drafting photograph.
  - Subtitle and eyebrow align with balanced text wrap.
- [ ] **Dossier Editorial Grid**:
  - Numbered section badges (`01 / Company`) align with sticky left sidebar.
  - Hairline rules span content shells cleanly without overflow.
- [ ] **Full-Bleed Ink Bands**:
  - Background transitions cleanly from `--paper` to `--ink`.
  - Oversized background year (`1992`) is non-interactive (`aria-hidden="true"`).

### 3.2 Accessibility & Keyboard Navigation (WCAG 2.1 AA)
- [ ] **Skip Link**: Pressing `Tab` on initial page load surfaces `.skip-link` and jumps to `#main`.
- [ ] **Focus Rings**: Every interactive element (`a`, `button`, `input`) displays `2px solid var(--crimson)` with `3px` offset.
- [ ] **Mobile Menu Trapping**:
  - Opening drawer traps focus within navigation links.
  - Pressing `Escape` closes drawer and restores focus to menu toggle button.
  - Activating a menu item navigates and closes the drawer.
- [ ] **Carousel Accessibility**:
  - Arrow keys (`ArrowLeft`, `ArrowRight`) slide items when carousel is focused.
  - Active slide receives `aria-hidden="false"`; inactive slides receive `aria-hidden="true"`.
  - Buttons inside inactive slides receive `tabindex="-1"`.
- [ ] **Modal Lightbox Accessibility**:
  - Opening lightbox traps focus inside modal controls.
  - Focus returns to initiating thumbnail upon `Escape` or close button activation.
  - Background body scrolling disabled (`.menu-open`).
- [ ] **Screen Reader Semantics**:
  - Exactly one `<h1>` per page.
  - Logical heading hierarchy (`h1` -> `h2` -> `h3`).
  - Decorative icons carry `aria-hidden="true"`.

### 3.3 Turbo Drive & Lifecycle Fallback
- [ ] Clicking internal links updates URL without full page reload.
- [ ] Browser back/forward buttons restore cached DOM instantly.
- [ ] Form submission or external links navigate via full HTTP request.
- [ ] Disabling JavaScript loads all pages cleanly with visible reveal content (via `<noscript>` fallback).

### 3.4 Gutenberg & Classic Editor
- [ ] Inserting Block Pattern `artupski/hero-drafting` matches front-end output.
- [ ] Core block styles (`ink-band`, `paper-boxed`, `lede`) apply expected CSS classes.
- [ ] **Standard Classic Editor content** (headings, lists, images, quotes, tables) renders correctly under the Dossier design system.
- [ ] The justified shortcodes (`[artupski_carousel]`, `[artupski_project_list]`) render correctly and match their pattern equivalents.
- [ ] No shortcode exists purely to mirror a static pattern (scope rule upheld).
- [ ] Saving post meta via custom meta boxes updates post data without sanitization loss.

### 3.5 Demo Importer Verification
- [ ] 1-click import completes in under 60 seconds on standard execution limits.
- [ ] **`wp artupski demo import contractor`** and the admin wizard produce identical results (same shared service).
- [ ] Re-running import does not duplicate pages, projects, media, or menus (idempotency).
- [ ] Duplicate detection flags existing demo-owned entities correctly.
- [ ] Rollback removes all entities flagged with `_artupski_demo_id`.
- [ ] Media attachments import with correct `alt` attributes and dimensions.
- [ ] Admin import is blocked without a valid nonce or sufficient capability.
- [ ] Progress is reported in both the admin UI and WP-CLI output.

### 3.6 Visual Fidelity (Static Baseline vs. WordPress)
The static site is the visual source of truth. Compare the `static` branch against the WordPress implementation:
- [ ] Layout
- [ ] Typography
- [ ] Colors
- [ ] Spacing
- [ ] Imagery
- [ ] Responsive behavior
- [ ] Interactions
- [ ] Navigation
- [ ] Gallery
- [ ] Lightbox
- [ ] Animations
- [ ] Accessibility states
- [ ] Any deviation is intentional and documented.
