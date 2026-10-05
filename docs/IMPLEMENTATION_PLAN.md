# Implementation Plan & Roadmap: Artupski WordPress Theme

## 1. Overview & Phased Execution

The implementation of Artupski is organized into six sequential milestones designed to maintain architectural integrity, test coverage, and code cleanliness throughout the development lifecycle.

```
+-----------------------------------------------------------------------------------+
|                            IMPLEMENTATION PHASES                                  |
|   Phase 1: Foundation & Design System Freeze (Tokens, theme.json, Assets)        |
|   Phase 2: Companion Plugin & Content Engine (CPTs, Taxonomies, Meta Boxes)       |
|   Phase 3: Theme Skeleton & Template Hierarchy (Headers, Footers, Partials)       |
|   Phase 4: Gutenberg Block Patterns & Classic Parity (Patterns, TinyMCE, Shortcodes)|
|   Phase 5: Turbo Drive Navigation & Interaction (site.js wiring, Lightbox)        |
|   Phase 6: Demo Importer, QA Hardening & Release Packaging (1-Click Raja Tua Seed)|
+-----------------------------------------------------------------------------------+
```

---

## 2. Detailed Phase Breakdown

### Phase 1: Foundation & Asset Pipeline Setup
- [ ] Initialize theme directory structure (`wp-content/themes/artupski/`).
- [ ] Create `style.css` with WordPress header metadata, GNU GPL licensing, and token imports.
- [ ] Configure `theme.json` (v2 schema) matching audited colors, font families, and container bounds.
- [ ] Copy and organize static assets (`assets/css/site.css`, `assets/js/site.js`, images, fonts).
- [ ] Build asset enqueue engine (`inc/class-assets.php`) with Google Fonts / local WOFF2 loader.

### Phase 2: Companion Plugin & Domain Models (`artupski-core`)
- [ ] Initialize companion plugin (`wp-content/plugins/artupski-core/artupski-core.php`).
- [ ] Register `rt_project` CPT with `/portfolio/%rt_project_year%/%postname%/` rewrite rules.
- [ ] Register `rt_project_category` and `rt_project_year` taxonomies.
- [ ] Register `rt_team` and `rt_service` CPTs.
- [ ] Build secure native meta boxes for project specifications (Client, Scope, Location, Gallery IDs).

### Phase 3: Theme Core & Template Hierarchy
- [ ] Implement `inc/class-theme.php` singleton and theme supports (`title-tag`, `post-thumbnails`).
- [ ] Create semantic `header.php` and `footer.php` with skip-links, modal lightbox container, and colophon.
- [ ] Build reusable component partials (`template-parts/components/`):
  - `hero.php`
  - `section-header.php`
  - `editorial-split.php`
  - `fact-counter.php`
  - `project-row.php`
  - `carousel.php`
  - `lightbox.php`
  - `contact-grid.php`
- [ ] Implement specialized page templates: `front-page.php`, `archive-rt_project.php`, `single-rt_project.php`, `404.php`.

### Phase 4: Block Patterns, Customizer & Classic Editor Parity
- [ ] Build `inc/class-customizer.php` with palette switcher, typography controls, and live preview JS.
- [ ] Register Gutenberg Block Patterns under `artupski-dossier` (`inc/class-gutenberg.php`).
- [ ] Implement Classic Editor shortcodes and TinyMCE format hooks (`inc/class-classic-editor.php`).
- [ ] Create scoped `assets/css/editor-style.css` for block and classic editor canvas parity.

### Phase 5: Client-Side Turbo Drive & Interactive Components
- [ ] Enqueue `assets/js/site.js` as an ES module (`<script type="module">`).
- [ ] Validate Turbo Drive lifecycle hooks (`turbo:before-visit`, `turbo:before-cache`, `turbo:render`, `turbo:load`).
- [ ] Test idempotent delegated event handlers (mobile menu toggle, keyboard trap, carousels, lightbox).
- [ ] Verify `<noscript>` fallback and `prefers-reduced-motion` compliance.

### Phase 6: Demo Importer, Quality Assurance & Release
- [ ] Build 1-Click Demo Importer engine (`inc/demo/class-demo-importer.php`).
- [ ] Export and bundle PT. RAJA TUA dataset (45 project records, media attachments, menus, options).
- [ ] Build "Create From Scratch" onboarding wizard.
- [ ] Run automated QA scripts (`tools/qa-check.mjs`, `tools/contrast-check.mjs`).
- [ ] Perform cross-browser testing (Chrome, Safari, Firefox, Edge, Mobile iOS/Android).
- [ ] Validate against WordPress Coding Standards via PHPCS.
- [ ] Tag Production Release v1.0.0.
