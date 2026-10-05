# AGENTS.md: Developer & Agent Engineering Directives

## 1. Role & Project Identity

You are an expert full-stack WordPress systems architect working on **Artupski**, a high-performance commercial WordPress theme engineered from the static **PT. RAJA TUA Dossier** audit.

The project embodies an **editorial engineering monograph / technical dossier**:
- Color system: Warm bone/paper ground (`#F4F0E6`), rich letterpress ink (`#16181C`), restrained heritage crimson (`#C8102E`), and dark hairline rules (`#DAD4C6`).
- Typography system: Newsreader (Display Serif) + Manrope (Technical Grotesque) + IBM Plex Mono (Annotation only).
- Client-side navigation: Hotwire Turbo Drive (`assets/js/site.js`) with zero full-page reloads and multi-page fallback.

---

## 2. Immutable Architectural Guardrails

When modifying, extending, or maintaining this codebase, you MUST adhere to these non-negotiable rules:

1. **Theme vs. Content Separation**:
   - The theme (`wp-content/themes/artupski/`) contains strictly presentation, templates, CSS tokens, and front-end lifecycles.
   - All domain post types (`rt_project`, `rt_team`, `rt_service`), taxonomies, and meta boxes MUST live in the companion plugin (`wp-content/plugins/artupski-core/`).
2. **Editor Parity (Gutenberg + Classic)**:
   - Every block pattern registered in Gutenberg MUST have a corresponding functional shortcode for the Classic Editor.
   - Core block patterns use native core blocks (`core/group`, `core/columns`, `core/heading`). Never introduce third-party page-builder dependencies.
3. **Hotwire Turbo Idempotency**:
   - Never register event listeners on transient DOM nodes inside `site.js` without guarding.
   - All interactive controls (hamburger menu, carousels, modal lightbox) MUST use **module-scope delegated event listeners** attached once to `document`.
   - Never create global memory leaks or allow listeners to stack during `turbo:load` or `turbo:render`.
   - Always reset drawer and modal states inside `turbo:before-cache`.
4. **Strict Contrast & Accessibility (WCAG 2.1 AA)**:
   - Never use `--crimson-lt` on `--paper` (it fails AA). It is strictly reserved for `--ink` backgrounds.
   - Every interactive element MUST retain a visible focus ring (`outline: 2px solid var(--crimson); outline-offset: 3px;`).
   - Every image MUST carry explicit `width`, `height`, and descriptive `alt` attributes.
5. **Defensive PHP & WordPress Standards**:
   - Check `if ( ! defined( 'ABSPATH' ) ) exit;` in every PHP file.
   - Escape EVERY output variable (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`).
   - Protect all form and AJAX submissions with nonces (`wp_verify_nonce`).
   - Follow standard WordPress PHP Coding Standards (WPCS).

---

## 3. Key Reference Files & Technical Specs

Before implementing or proposing changes, consult the documentation suite:
- [`docs/PRD.md`](docs/PRD.md:1) - Product requirements, user personas, release milestones.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md:1) - High-level system architecture, module boundaries, Turbo lifecycles.
- [`docs/THEME_SYSTEM.md`](docs/THEME_SYSTEM.md:1) - Theme bootstrapping, asset enqueueing, template partial contracts.
- [`docs/GUTENBERG.md`](docs/GUTENBERG.md:1) - Block patterns, core block styles, `theme.json` spec.
- [`docs/CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1) - TinyMCE styles, native shortcodes, anti-`wpautop` filters.
- [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md:1) - Customizer settings, palette presets, live preview scripting.
- [`docs/DEMO_IMPORT.md`](docs/DEMO_IMPORT.md:1) - 1-Click Raja Tua baseline import vs. Create From Scratch wizard.
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md:1) - Post types (`rt_project`), taxonomies, meta fields, ERD.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md:1) - CSS tokens, typography scales, contrast matrix.
- [`docs/SECURITY.md`](docs/SECURITY.md:1) - Sanitization, output escaping, CSP, nonces, capabilities.
- [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md:1) - Core Web Vitals optimization, lazy loading, LCP strategies.
- [`docs/QA.md`](docs/QA.md:1) - Automated tooling, manual checklists, cross-browser test matrix.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md:1) - Phased roadmap from foundation to v1.0.0 release.

---

## 4. Verification & Testing Commands

To run project audits and verification routines:
- Run contrast audit: `node tools/contrast-check.mjs`
- Run portfolio record audit: `node tools/_audit-portfolio.mjs`
- Run asset minification: `node tools/minify.mjs`
- Run general QA check: `node tools/qa-check.mjs`
