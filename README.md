# Artupski WordPress Theme & Dossier Framework

An editorial engineering monograph and technical dossier WordPress theme engineered from the static **PT. RAJA TUA** audit. Designed for architectural studios, engineering consultancies, construction enterprises, and technical organizations.

---

## Key Highlights

- **Editorial Dossier Language**: Warm bone/paper ground (`#F4F0E6`), letterpress ink (`#16181C`), restrained heritage crimson (`#C8102E`), and structural hairlines (`#DAD4C6`).
- **Typography Pairing**: Newsreader (Display Serif) + Manrope (Technical Grotesque) + IBM Plex Mono (Blueprint Annotation only).
- **Client-Side SPA Transitions**: Hotwire Turbo Drive (`assets/js/site.js`) with zero full-page reloads, sub-50ms transitions, and graceful multi-page fallback.
- **Architectural Separation**: Presentation inside theme (`wp-content/themes/artupski/`); domain models (`rt_project`, `rt_team`, `rt_service`) encapsulated inside companion plugin (`wp-content/plugins/artupski-core/`).
- **Full Editor Parity**: Native Gutenberg Block Patterns + Classic Editor shortcodes and TinyMCE styles.
- **Onboarding Flexibility**: 1-Click PT. RAJA TUA 45-project baseline import or Create From Scratch white-label wizard.
- **Strict Accessibility**: WCAG 2.1 AA compliant, verified contrast matrix, visible focus rings, keyboard trap modals.

---

## Technical Documentation Suite

Complete technical and architectural specifications are located in [`docs/`](docs/):

- [`docs/PRD.md`](docs/PRD.md:1) - Product requirements, personas, non-functional requirements, release milestones.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md:1) - High-level system architecture, module boundaries, Turbo lifecycles, and component contracts.
- [`docs/THEME_SYSTEM.md`](docs/THEME_SYSTEM.md:1) - Theme setup, asset enqueue pipeline, template hierarchy, and dynamic state recomputation.
- [`docs/GUTENBERG.md`](docs/GUTENBERG.md:1) - Block pattern catalog, core block styles, and `theme.json` configuration.
- [`docs/CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1) - Shortcode architecture, TinyMCE custom formats, anti-`wpautop` filters, and meta boxes.
- [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md:1) - Customizer panels, palette preset switcher, live preview (`postMessage`) scripting.
- [`docs/DEMO_IMPORT.md`](docs/DEMO_IMPORT.md:1) - 1-Click Raja Tua baseline import manifest, idempotency rules, and scratch onboarding.
- [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md:1) - Custom post types (`rt_project`, `rt_team`, `rt_service`), taxonomies, and entity relationship diagrams.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md:1) - Color tokens, contrast verification matrix, typography scales, and motion specifications.
- [`docs/SECURITY.md`](docs/SECURITY.md:1) - Output escaping, input sanitization, nonces, capabilities, and CSP hardening.
- [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md:1) - Core Web Vitals optimization, hero preloading, lazy loading, and Turbo cache hygiene.
- [`docs/QA.md`](docs/QA.md:1) - Automated CLI test tooling and comprehensive manual testing checklists.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md:1) - 6-phase roadmap from foundational setup to v1.0.0 production release.
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
