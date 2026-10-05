# AGENTS.md: Developer & Agent Engineering Directives

## 1. Role & Project Identity

You are an expert full-stack WordPress systems architect working on **Artupski**, a high-performance commercial WordPress theme engineered from the static **Contractor Dossier** reference audit.

The project embodies an **editorial engineering monograph / technical dossier**:
- Color system: Warm bone/paper ground (`#F4F0E6`), rich letterpress ink (`#16181C`), restrained heritage crimson (`#C8102E`), and dark hairline rules (`#DAD4C6`).
- Typography system: Newsreader (Display Serif) + Manrope (Technical Grotesque) + IBM Plex Mono (Annotation only).
- Client-side navigation: **locally bundled** Hotwire Turbo Drive (`assets/js/site.js`) with progressive enhancement and normal WordPress multi-page fallback. No runtime CDN dependency.

---

## 2. Immutable Architectural Guardrails

When modifying, extending, or maintaining this codebase, you MUST adhere to these non-negotiable rules:

1. **Theme vs. Content Separation**:
   - The theme (`wp-content/themes/artupski/`) owns **presentation only**: templates, CSS tokens, template parts, block patterns, and front-end lifecycles.
   - The plugin (`wp-content/plugins/artupski-core/`) owns **functionality and structured content that must survive a theme switch**: post types (`artupski_project`, `artupski_team`, `artupski_service`), the `artupski_project_category` taxonomy, meta boxes, and demo import services.
   - Both live in a **single monorepo** (see §2.1). Do NOT split `artupski-core` into its own Git repository yet.
2. **Gutenberg-First Editor Architecture (Classic as Fallback)**:
   - Gutenberg is the **primary authoring experience**: native core blocks, Block Patterns, template parts, and `theme.json`.
   - **Full Site Editing (FSE) is OUT OF SCOPE for v1.** Do NOT build a full block/FSE theme. Do NOT add `templates/` or `parts/` block-theme directories that would make the project FSE. Block templates/template parts are kept only where they support the planned architecture; classic PHP templates remain the rendering backbone.
   - The Classic Editor is a **compatibility/fallback experience**: standard WordPress content must render correctly, and TinyMCE formats/classes may be provided for it.
   - Do NOT create a shortcode equivalent for every Gutenberg pattern merely for architectural symmetry. Provide shortcodes only where they add genuine value or satisfy a legacy/compatibility requirement.
   - Never maintain two parallel content systems that must be kept synchronized forever.
   - Never introduce third-party page-builder dependencies (Elementor, ACF Blocks, etc.). Use native core blocks.
3. **Locally Bundled Turbo, Enabled by Default, Progressive Enhancement Only**:
   - Turbo Drive is bundled locally with the theme at a pinned version. Never load Turbo from a CDN at runtime.
   - Turbo is **ENABLED by default** (`artupski_turbo_enabled` defaults to `true`).
   - Turbo MUST be progressive enhancement only. If JavaScript is unavailable, Turbo is disabled, or the local bundle fails, **normal WordPress multi-page navigation MUST work correctly**. The documented fallback is a first-class requirement, not an afterthought.
   - Never register event listeners on transient DOM nodes inside `site.js` without guarding.
   - All interactive controls (hamburger menu, carousels, modal lightbox) MUST use **module-scope delegated event listeners** attached once to `document`.
   - Never create global memory leaks or allow listeners to stack during `turbo:load` or `turbo:render`.
   - Always reset drawer and modal states inside `turbo:before-cache`.
4. **Single Shared Demo Import Engine**:
   - The admin wizard and WP-CLI (`wp artupski demo import <id>`) MUST call the **same underlying import services**. Never implement two independent import engines.
   - Imports MUST be idempotent, nonce-protected, capability-checked, and safely re-runnable.
5. **Demo Content Is Configuration, Not Core**:
   - Never hardcode demo assumptions into the generic theme or components. Demos live in a **demo configuration layer** consumed by generic components.
   - **Contractor** is **Demo #1 / the reference implementation**, not the theme architecture.
6. **Taxonomy Discipline**:
   - `artupski_project_category` is the **primary** project taxonomy and describes project categories, not implementation disciplines. Do NOT use `artupski_discipline` as the primary taxonomy.
   - Do NOT add extra taxonomies without a genuine business requirement. Keep the model extensible so a new taxonomy can be added later.
7. **Visual Fidelity to the Static Baseline**:
   - The existing static site is the **visual source of truth**. Do not redesign during migration unless explicitly requested.
   - Compare layout, typography, colors, spacing, imagery, responsive behavior, interactions, navigation, gallery, lightbox, animations, and accessibility states between the `static` baseline and the WordPress implementation.
8. **Strict Contrast & Accessibility (WCAG 2.1 AA)**:
   - Never use `--crimson-lt` on `--paper` (it fails AA). It is strictly reserved for `--ink` backgrounds.
   - Every interactive element MUST retain a visible focus ring (`outline: 2px solid var(--crimson); outline-offset: 3px;`).
   - Every image MUST carry explicit `width`, `height`, and descriptive `alt` attributes.
9. **Defensive PHP & WordPress Standards**:
   - Check `if ( ! defined( 'ABSPATH' ) ) exit;` in every PHP file.
   - Escape EVERY output variable (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`).
   - Protect all form and AJAX submissions with nonces (`wp_verify_nonce`).
   - Follow standard WordPress PHP Coding Standards (WPCS).

### 2.1 Monorepo Structure

The theme and its companion plugin are developed together in a single repository for now:

```text
artupski-wp/
├── wp-content/
│   ├── themes/
│   │   └── artupski/
│   └── plugins/
│       └── artupski-core/
├── docs/
├── AGENTS.md
└── README.md
```

- Do NOT design the current implementation around repository separation.
- Do NOT extract `artupski-core` now. Extraction into a separate repository is triggered ONLY when a **second independent Artupski product/theme genuinely requires the same core functionality**. Until that trigger is met, keep the plugin in the monorepo.

### 2.2 Repository Hygiene

- `server.log` is gitignored (matched by `*.log`). Leave it untouched; never commit runtime logs.

---

## 3. Key Reference Files & Technical Specs

Before implementing or proposing changes, consult the documentation suite:
- [`docs/PRD.md`](docs/PRD.md:1) - Product requirements, user personas, release milestones.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md:1) - High-level system architecture, module boundaries, Turbo lifecycles.
- [`docs/THEME_SYSTEM.md`](docs/THEME_SYSTEM.md:1) - Theme bootstrapping, asset enqueueing, template partial contracts.
- [`docs/GUTENBERG.md`](docs/GUTENBERG.md:1) - Block patterns, core block styles, `theme.json` spec.
- [`docs/CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1) - TinyMCE styles, native shortcodes, anti-`wpautop` filters.
- [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md:1) - Customizer settings, palette presets, live preview scripting.
- [`docs/DEMO_IMPORT.md`](docs/DEMO_IMPORT.md:1) - 1-Click Contractor baseline import vs. Create From Scratch wizard.
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md:1) - Post types (`artupski_project`), taxonomies, meta fields, ERD.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md:1) - CSS tokens, typography scales, contrast matrix.
- [`docs/SECURITY.md`](docs/SECURITY.md:1) - Sanitization, output escaping, CSP, nonces, capabilities.
- [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md:1) - Core Web Vitals optimization, lazy loading, LCP strategies.
- [`docs/QA.md`](docs/QA.md:1) - Automated tooling, manual checklists, cross-browser test matrix.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md:1) - Phased roadmap from foundation to v1.0.0 release.

---

## 4. Verification & Testing Commands

To run project audits and verification routines:
- Run PHP syntax lint: `node tools/php-lint.mjs`
- Run contrast audit: `node tools/contrast-check.mjs`
- Run portfolio record audit: `node tools/_audit-portfolio.mjs`
- Run the theme build/minification (canonical): `node tools/build-theme.mjs`
- Run Phase 2 foundation verification: `node tools/phase2-check.mjs`
- Run general QA check: `node tools/qa-check.mjs`
