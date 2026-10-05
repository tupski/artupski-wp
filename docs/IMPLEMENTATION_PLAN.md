# Implementation Plan & Roadmap: Artupski WordPress Theme

## 1. Overview & Phased Execution

The implementation of Artupski is organized into eight sequential milestones designed to maintain architectural integrity, test coverage, and code cleanliness throughout the development lifecycle.

> **Status:** Phase 1 (Architecture & Design System Freeze) is the current phase. **No WordPress implementation has started** — this document is a plan, not a record of completed code.

```
+-------------------------------------------------------------------------------------+
|                            IMPLEMENTATION PHASES                                    |
|   Phase 1: Architecture & Design System Freeze (Docs, tokens locked)                |
|   Phase 2: Foundation & Asset Pipeline (theme skeleton, theme.json, enqueue, Turbo) |
|   Phase 3: Companion Plugin & Content Engine (CPTs, taxonomy, meta boxes)           |
|   Phase 4: Theme Templates & Generic Presentation Components                        |
|   Phase 5: Gutenberg Patterns, Customizer & Classic Compatibility                  |
|   Phase 6: Turbo Drive Navigation & Interaction (lifecycles, carousel, lightbox)    |
|   Phase 7: Shared Demo Import Engine (admin wizard + WP-CLI; Contractor Demo #1)    |
|   Phase 8: Visual Fidelity, QA, Accessibility & Performance Audit & Release         |
+-------------------------------------------------------------------------------------+
```

---

## 2. Detailed Phase Breakdown

### Phase 1: Architecture & Design System Freeze *(current)*
- [x] Author the documentation suite (`docs/`).
- [x] Lock the design tokens (color, type, spacing, motion).
- [x] Decide monorepo structure (theme + `artupski-core` plugin in one repository).
- [x] Decide Turbo strategy (locally bundled, progressive enhancement).
- [x] Decide taxonomy strategy (`artupski_project_category` primary).
- [x] Decide editor strategy (Gutenberg-first, Classic fallback).
- [x] Decide shared importer architecture (one service, two entry points).
- [x] Define visual fidelity requirement (static baseline = source of truth).
- [ ] **Exit criteria:** all docs internally consistent; zero implementation code written.

### Phase 2: Foundation & Asset Pipeline Setup
- [ ] Initialize theme directory structure (`wp-content/themes/artupski/`).
- [ ] Create `style.css` with WordPress header metadata, GNU GPL licensing, and token imports.
- [ ] Configure `theme.json` (v2 schema) matching audited colors, font families, and container bounds. `theme.json` is for design tokens and the block editor only — **it does NOT make the theme a Full Site Editing (FSE) theme**. FSE is OUT OF SCOPE for v1; classic PHP templates remain the rendering backbone.
- [ ] Copy and organize static assets (`assets/css/site.css`, `assets/js/site.js`, images, fonts).
- [ ] Vendor the **pinned Turbo bundle locally** (`assets/js/vendor/turbo.js`); no CDN.
- [ ] Build asset enqueue engine (`inc/class-assets.php`) with Google Fonts / local WOFF2 loader. Turbo is **enabled by default** (`artupski_turbo_enabled` = `true`) with the documented progressive-enhancement fallback.
- [ ] Confirm no-JS baseline: templates render fully without JavaScript.
- [ ] Confirm scope: do NOT add a full block-theme structure (`templates/`, `parts/`) — v1 is not FSE.

### Phase 3: Companion Plugin & Content Engine (`artupski-core`)
- [ ] Initialize companion plugin (`wp-content/plugins/artupski-core/artupski-core.php`).
- [ ] Register `artupski_project` CPT with `/projects/%artupski_project_year%/%postname%/` rewrite rules (slug `/projects/`, NOT `/portfolio/` — the theme stays generic).
- [ ] Register the primary `artupski_project_category` taxonomy and the `artupski_project_year` taxonomy.
- [ ] Register `artupski_team` and `artupski_service` CPTs.
- [ ] Build secure native meta boxes for project specifications (Category, Scope, Location, Client, Gallery IDs).
- [ ] **Boundary check:** the plugin must contain no presentation/template code.

### Phase 4: Theme Core & Template Hierarchy
- [ ] Implement `inc/class-theme.php` singleton and theme supports (`title-tag`, `post-thumbnails`).
- [ ] Create semantic `header.php` and `footer.php` with skip-links, modal lightbox container, and colophon.
- [ ] Build generic presentation component partials (`template-parts/components/`):
  - `hero.php`
  - `section-header.php`
  - `editorial-split.php`
  - `fact-counter.php`
  - `project-row.php`
  - `carousel.php`
  - `lightbox.php`
  - `contact-grid.php`
- [ ] Implement specialized page templates: `front-page.php`, `archive-artupski_project.php`, `single-artupski_project.php`, `404.php`.
- [ ] **Boundary check:** components accept data via `$args` and contain no demo-specific logic.

### Phase 5: Gutenberg Patterns, Customizer & Classic Compatibility
- [ ] Build `inc/class-customizer.php` with palette switcher, typography controls, and live preview JS.
- [ ] Register Gutenberg Block Patterns under `artupski-dossier` (`inc/class-gutenberg.php`) as the **primary** authoring path.
- [ ] Create scoped `assets/css/editor-style.css` for block and classic editor canvas parity.
- [ ] Implement Classic Editor **compatibility** only:
  - TinyMCE style formats + utility classes.
  - A small set of genuinely useful shortcodes (`[artupski_carousel]`, `[artupski_project_list]`) — **not** a 1:1 mirror of patterns.
  - Anti-`wpautop` hygiene for the block-level shortcodes.
- [ ] Verify standard Classic content (`the_content()`) renders correctly.

### Phase 6: Client-Side Turbo Drive & Interactive Components
- [ ] Enqueue `assets/js/site.js` as an ES module (`<script type="module">`) that imports the **local** Turbo bundle.
- [ ] Validate Turbo lifecycle hooks (`turbo:before-visit`, `turbo:before-cache`, `turbo:render`, `turbo:load`).
- [ ] Test idempotent delegated event handlers (mobile menu toggle, keyboard trap, carousels, lightbox).
- [ ] Verify direct URL access, browser history, and normal navigation when Turbo is disabled.
- [ ] Verify `<noscript>` fallback and `prefers-reduced-motion` compliance.

### Phase 7: Shared Demo Import Engine
- [ ] Build the shared `class-import-service.php` (idempotent, transactional, capability-checked).
- [ ] Build the **admin wizard** (`class-import-wizard.php`) as a thin adapter over the service.
- [ ] Build the **WP-CLI command** (`class-import-cli.php`) as a thin adapter over the same service.
- [ ] Bundle the Contractor dataset (Demo #1): 45 project records, media attachments, menus, options.
- [ ] Support `wp artupski demo import contractor` and the equivalent admin UI.
- [ ] Implement idempotency, duplicate detection, rollback/error handling, and progress reporting.
- [ ] Build the "Create From Scratch" onboarding path (also via the shared service).
- [ ] **Boundary check:** exactly one import engine exists; no duplicate logic between UI and CLI.

### Phase 8: Visual Fidelity, Quality Assurance & Release
- [ ] Perform **visual regression comparison** between the `static` baseline and the WordPress implementation (see §3).
- [ ] Run automated QA scripts (`tools/qa-check.mjs`, `tools/contrast-check.mjs`).
- [ ] Perform cross-browser testing (Chrome, Safari, Firefox, Edge, Mobile iOS/Android).
- [ ] Validate against WordPress Coding Standards via PHPCS.
- [ ] Tag Production Release v1.0.0.

---

## 3. Visual Fidelity Requirement

The existing static site is the **visual source of truth**. Migration must not redesign it unless explicitly requested.

Before release, compare the `static` branch against the `main` WordPress implementation across:

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

Any intentional deviation must be documented with a rationale. Unintended visual differences are defects.
