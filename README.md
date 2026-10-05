# Artupski WordPress Theme & Dossier Framework

An editorial engineering monograph and technical dossier WordPress theme engineered from the static **Contractor** reference audit. Designed for architectural studios, engineering consultancies, construction enterprises, and technical organizations.

---

## Key Highlights

- **Editorial Dossier Language**: Warm bone/paper ground (`#F4F0E6`), letterpress ink (`#16181C`), restrained heritage crimson (`#C8102E`), and structural hairlines (`#DAD4C6`).
- **Typography Pairing**: Newsreader (Display Serif) + Manrope (Technical Grotesque) + IBM Plex Mono (Blueprint Annotation only).
- **Client-Side Navigation**: Locally bundled Hotwire Turbo Drive (`assets/js/site.js`) — pinned version, no runtime CDN dependency, **enabled by default** (`artupski_turbo_enabled` = `true`), progressive enhancement with normal WordPress multi-page fallback.
- **Architectural Separation**: Presentation inside the theme (`wp-content/themes/artupski/`); domain models (`artupski_project`, `artupski_team`, `artupski_service`, taxonomy `artupski_project_category`) and demo import services inside the companion plugin (`wp-content/plugins/artupski-core/`). Single monorepo; the plugin is extractable to its own repository later.
- **Gutenberg-First Authoring (Not FSE)**: Native blocks, block patterns, template parts, and `theme.json` are the primary authoring experience. Classic Editor renders standard content correctly; shortcodes are provided only where they add genuine value. **Full Site Editing (FSE) is OUT OF SCOPE for v1** — classic PHP templates remain the rendering backbone.
- **Onboarding Flexibility**: 1-Click Contractor demo import (Demo #1 reference implementation) or Create From Scratch white-label wizard — both driven by a single shared import engine (admin wizard + WP-CLI).
- **Strict Accessibility**: WCAG 2.1 AA compliant, verified contrast matrix, visible focus rings, keyboard trap modals.

---

## Repository Structure (Monorepo)

The theme and its companion plugin are developed together in one repository for now:

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

- The **plugin owns functionality and structured content** that must survive a theme switch.
- The **theme owns presentation**.
- `artupski-core` is **not extracted now**. Extraction into a separate repository is triggered ONLY when a **second independent Artupski product/theme genuinely requires the same core functionality**; the current architecture must not depend on repository separation.

---

## Final Approved Decisions (v1)

These decisions are recorded consistently across the documentation suite and are binding for v1:

1. **Project rewrite slug**: `artupski_project` uses the archive slug **`/projects/`** (rewrite `/projects/%artupski_project_year%/%postname%/`). `/portfolio/` is **not** used — the theme must remain generic.
2. **Turbo default**: Turbo Drive is **ENABLED by default** (`artupski_turbo_enabled` = `true`). The documented progressive-enhancement fallback (normal WordPress navigation when Turbo is disabled/unavailable) remains a first-class requirement.
3. **`artupski-core` extraction**: Do **NOT** extract now. Extract to a separate repository **only** when a second independent Artupski product/theme genuinely requires the same core functionality.
4. **Full Site Editing**: **OUT OF SCOPE for v1.** Gutenberg remains the primary authoring experience, but v1 is **not** a full block/FSE theme. Block templates/template parts are kept only where they support the planned architecture.
5. **Branding**: The repository is generic (**Contractor** reference). No prior client-specific branding remains in active documentation or `proposal/README.md`.
6. **`server.log`**: Gitignored via `*.log`; left untouched.

---

## Technical Documentation Suite

Complete technical and architectural specifications are located in [`docs/`](docs/):

- [`docs/PRD.md`](docs/PRD.md:1) - Product requirements, personas, non-functional requirements, release milestones.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md:1) - High-level system architecture, module boundaries, Turbo lifecycles, and component contracts.
- [`docs/THEME_SYSTEM.md`](docs/THEME_SYSTEM.md:1) - Theme setup, asset enqueue pipeline, template hierarchy, and dynamic state recomputation.
- [`docs/GUTENBERG.md`](docs/GUTENBERG.md:1) - Block pattern catalog, core block styles, and `theme.json` configuration.
- [`docs/CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1) - Shortcode architecture, TinyMCE custom formats, anti-`wpautop` filters, and meta boxes.
- [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md:1) - Customizer panels, palette preset switcher, live preview (`postMessage`) scripting.
- [`docs/DEMO_IMPORT.md`](docs/DEMO_IMPORT.md:1) - 1-Click Contractor baseline import manifest, idempotency rules, and scratch onboarding.
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md:1) - Custom post types (`artupski_project`, `artupski_team`, `artupski_service`), taxonomies, and entity relationship diagrams.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md:1) - Color tokens, contrast verification matrix, typography scales, and motion specifications.
- [`docs/SECURITY.md`](docs/SECURITY.md:1) - Output escaping, input sanitization, nonces, capabilities, and CSP hardening.
- [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md:1) - Core Web Vitals optimization, hero preloading, lazy loading, and Turbo cache hygiene.
- [`docs/QA.md`](docs/QA.md:1) - Automated CLI test tooling and comprehensive manual testing checklists.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md:1) - 8-phase roadmap from foundational setup to v1.0.0 production release.
- [`AGENTS.md`](AGENTS.md:1) - Engineering directives, architectural guardrails, and coding guidelines for AI agents and human developers.

---

## Verification & Tooling Commands

Run automated audits using Node.js:
```bash
# Contrast audit verification
node tools/contrast-check.mjs

# Portfolio records integrity audit
node tools/_audit-portfolio.mjs

# Production minification
node tools/minify.mjs

# Full QA test runner
node tools/qa-check.mjs
```
