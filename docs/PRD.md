# Product Requirements Document (PRD): Artupski WordPress Theme

## 1. Executive Summary & Purpose

Artupski is a premium commercial-grade corporate WordPress theme engineered for engineering consultancies, architectural studios, heritage contracting firms, and technical enterprises. The theme translates the bespoke design aesthetic of the **Contractor Dossier** static reference site into a flexible, extensible WordPress product.

The design philosophy rejects generic software agency templates (flat sans-serifs, glowing purple gradients, glassmorphism, floating cards) in favor of an **editorial engineering monograph / technical dossier**: warm paper grounds (`#F4F0E6`), rich ink text (`#16181C`), restrained crimson accents (`#C8102E`), hairline rules, numbered index headings (`01 / Overview`), and authoritative typography pairing Newsreader serif with Manrope grotesque and IBM Plex Mono annotation.

Artupski must support two primary deployment modes:
1. **Turnkey Contractor Demo (Demo #1)**: 1-click import that reproduces the Contractor static reference website with 45 chronological project portfolio records, structured leadership dossiers, and contact modules. Contractor is the first real demo/reference implementation and must prove the generic architecture can represent the static site **without special-case hacks**. Demo content is configuration, never hardcoded into the theme.
2. **Create From Scratch (White-Label / Generic Business)**: Clean baseline enabling site builders, agencies, and webmasters to build architectural, legal, engineering, and corporate websites utilizing block patterns, theme settings, and standardized Custom Post Types.

Both deployment modes are driven by a **single shared import engine** exposed through an admin wizard and a WP-CLI command (`wp artupski demo import <id>`).

---

## 2. Target Audience & Personas

| Persona | Role & Technical Profile | Primary Needs & Jobs to be Done |
|---|---|---|
| **Architect / Firm Principal** | Non-technical corporate buyer; demands dignified, high-authority brand presentation | Wants website that reads like a monograph or bound annual report. Needs fast page load, mobile elegance, and prominent firm history (1992+). |
| **Corporate Content Editor** | Day-to-day administrative staff; uses WordPress Block Editor (Gutenberg) or Classic Editor | Needs effortless addition of new projects, team members, services, and press releases without breaking typography rules or grid layouts. |
| **WordPress Agency Developer** | Experienced WP engineer customizing client themes | Demands clean code separation (Theme vs Content), strict hooks/filters, child theme friendliness, zero locked vendor lock-in, and headless/API readiness. |
| **Site Performance Specialist** | Technical auditor optimizing for Core Web Vitals | Demands perfect Lighthouse 100/100, sub-second LCP, zero layout shifts (CLS 0), native responsive images, and optional Hotwire Turbo navigation. |

---

## 3. Product Principles & Architecture Guardrails

1. **Theme vs. Content Separation**:
   - The theme provides layout rendering, CSS design system tokens, typography scales, template hierarchy, and dynamic presentation.
   - The theme owns **presentation only**.
   - Core domain models (Project CPT, Team CPT, Service CPT) and the `artupski_project_category` taxonomy are encapsulated in the companion plugin (`artupski-core`), alongside import services and other functionality. The plugin owns anything that must survive a theme switch.
   - Theme and plugin are developed in a **single monorepo**; `artupski-core` is **not extracted now**. Extraction into its own repository is triggered ONLY when a **second independent Artupski product/theme genuinely requires the same core functionality**; the current architecture must not depend on repository separation.
2. **Gutenberg-First Authoring (Classic as Fallback)**:
   - Gutenberg is the **primary authoring experience**: native core blocks, Block Patterns, template parts, and `theme.json`.
   - **Full Site Editing (FSE) is OUT OF SCOPE for v1.** v1 is NOT a full block/FSE theme. Block templates/template parts are kept only where they support the planned architecture without turning the project into FSE; classic PHP templates remain the rendering backbone.
   - The Classic Editor is a **compatibility/fallback experience**: standard WordPress content must render correctly. TinyMCE formats and selective shortcodes may be provided where they add genuine value or satisfy a legacy/compatibility requirement.
   - Do NOT maintain a shortcode equivalent for every block pattern; avoid two content systems that must be synchronized forever.
3. **No-Full-Reload Navigation with Instant Fallback**:
   - Native integration of a **locally bundled, pinned** Hotwire Turbo Drive (`assets/js/site.js`) providing fast transitions without hydration overhead or runtime CDN dependency.
   - **Turbo is ENABLED by default** (`artupski_turbo_enabled` defaults to `true`).
   - Progressive enhancement only: if JavaScript is unavailable, Turbo is disabled, or the bundle fails, standard multi-page WordPress navigation operates without error. This fallback is a documented, first-class requirement.
4. **Single Shared Import Engine**:
   - Admin wizard and WP-CLI both call the same import services; there is no second import engine.
   - Imports are idempotent, duplicate-safe, re-runnable, capability-checked, and nonce-protected.
5. **Demo Content as Configuration**:
   - Generic theme and components contain no demo-specific logic. Contractor is Demo #1, delivered as a configuration layer.
   - Any required special-case logic must be documented and justified.
6. **Visual Fidelity to the Static Baseline**:
   - The existing static site is the visual source of truth; migration must not redesign it unless explicitly requested.
   - Visual regression comparison between the `static` baseline and the WordPress implementation is a release requirement.
7. **Strict Accessibility & Contrast Compliance**:
   - WCAG 2.1 AA compliance across all components.
   - Contrast checked: Dark ink on paper ground (`#16181C` on `#F4F0E6` = 14.8:1), muted labels (`#6E6A61` on `#F4F0E6` = 4.73:1), and light crimson (`#E8798A` on `#16181C` = 5.2:1). Focus rings mandatory (`2px solid var(--crimson)` with `3px` offset).

---

## 4. Key Functional Features

### 4.1 Theme Settings & Customizer System
- **Ground Modes**: Default Dossier Paper (`#F4F0E6`), Clean Crisp White (`#FFFFFF`), or Editorial Warm Grey (`#EFECE6`).
- **Brand Accents**: Primary Accent Crimson (`#C8102E` default), Secondary Ink Dark (`#16181C`), Dark Accent (`#E8798A`).
- **Header Configurations**: Standard horizontal bar, sticky header, split brand/nav bar, mobile sliding drawer with keyboard trap.
- **Footer Configurations**: 4-column dossier index, 3-column corporate, or minimal split copyright/legal bar.
- **Typography Engine**: Google Fonts toggle or local self-hosted WOFF2 bundle (GDPR compliant).

### 4.2 Content Models & Custom Post Types

Content models are owned by the companion plugin (`artupski-core`) so they survive a theme switch.

- **Project** (`artupski_project`):
   - Chronological indexing (2003–2024 grouped archives).
   - Classified by the primary taxonomy **`artupski_project_category`** (project categories, not implementation disciplines): Construction, Engineering, Interior, Commercial, Infrastructure.
   - Meta attributes: Completion Year, Location, Client Name, Contract Scope, Floor Area, Structural Value.
   - Project Gallery with scoped carousel and modal lightbox.
- **Team** (`artupski_team`):
   - Member name, credential suffix (e.g., `Ir. A. Example`), leadership role, bio, and formal portrait.
- **Service** (`artupski_service`):
   - Numbered service rows (`01`, `02`, `03`), detailed scope checklist, associated project gallery links.

> The model stays extensible so an additional taxonomy can be introduced later if a genuine business requirement arises. No extra taxonomies are created now, and `artupski_discipline` is explicitly NOT the primary taxonomy.

### 4.3 Presentation Components & Page Layouts

Presentation components are reusable UI blocks owned by the theme (see ARCHITECTURE.md §3 for how these differ from content models and implementation mechanisms).
- **Hero Varieties**: Drafting media hero with scrim, minimalist text-forward page hero, split editorial hero.
- **Section Headers**: Numbered index badge (`.sec-num`), balanced serif heading, metadata annotation.
- **Metrics / Facts Counter**: Large numeric callout (`.fact__num`) with baseline label and explanatory footnote.
- **Dossier Editorial Split**: Left metadata column (`01 / Company`), right typography flow column.
- **Categorized Carousel & Lightbox**: Touch-swipe enabled track, numbered slide counter (`1 / 8`), group-scoped modal view.
- **Contact Matrix**: Office address, direct telephone dispatch, inquiry routing, and interactive embedded map.

### 4.4 Demo Importer & Onboarding
- **1-Click Demo Import (Demo #1 — Contractor)**: Seeds pages (`Home`, `About Us`, `Portfolio`, `Contact Us`), 45 projects, media library images, menus, and customizer defaults — via shared import services.
- **WP-CLI Parity**: `wp artupski demo import contractor` runs the same import services as the admin wizard.
- **Scratch Setup Wizard**: Step-by-step assistant configuring site logo, primary colors, navigation menus, and blank starter pages.
- **Idempotency**: Re-running an import updates existing items rather than duplicating them.

---

## 5. Non-Functional Requirements

| Metric | Target | Rationale / Test Method |
|---|---|---|
| **Lighthouse Performance** | ≥ 98 / 100 | Zero heavy JS frameworks, optimized WebP/AVIF imagery, minimal CSS |
| **Lighthouse Accessibility** | 100 / 100 | Screen-reader tested, semantic landmarks, valid ARIA states |
| **Lighthouse Best Practices** | 100 / 100 | Modern security headers, HTTPS-ready, no deprecated APIs |
| **Lighthouse SEO** | 100 / 100 | Structured Schema.org (`Organization`, `Project`), canonical tags, OpenGraph |
| **First Contentful Paint (FCP)**| < 0.8s | Critical inline tokens and fonts preloaded |
| **Largest Contentful Paint (LCP)**| < 1.2s | High fetch priority on hero media; optimized responsive `srcset` |
| **Cumulative Layout Shift (CLS)**| 0.000 | Explicit `width` and `height` dimensions on all media and icon containers |
| **WordPress Compatibility** | WP 6.0 to 6.7+ | Support standard PHP 8.0, 8.1, 8.2, 8.3 |
| **Visual Fidelity** | No unintended visual diff vs. static baseline | Side-by-side comparison of `static` branch vs. WordPress implementation across layout, typography, color, spacing, imagery, responsive behavior, interactions, navigation, gallery, lightbox, animation, and accessibility states |

---

## 6. Success Criteria & Release Milestones

1. **Phase 1: Architecture & Design System Freeze** (Documentation complete, tokens locked). *(current phase)*
2. **Phase 2: Foundation & Asset Pipeline** (theme skeleton, `theme.json`, enqueue engine, locally bundled Turbo).
3. **Phase 3: Companion Plugin & Content Engine** (`artupski_project`/`artupski_team`/`artupski_service`, `artupski_project_category` taxonomy, meta boxes).
4. **Phase 4: Theme Templates & Generic Presentation Components** (template hierarchy, reusable template parts).
5. **Phase 5: Gutenberg Patterns, Customizer & Classic Compatibility** (block patterns, editor styles, selective shortcodes/TinyMCE).
6. **Phase 6: Client-Side Turbo Drive & Interactive Components** (lifecycles, carousels, lightbox, no-JS fallback).
7. **Phase 7: Shared Demo Import Engine** (admin wizard + WP-CLI over one service; Contractor Demo #1).
8. **Phase 8: Visual Fidelity, QA, Accessibility & Performance Audit** (static-vs-WP visual regression, PHPCS, Lighthouse 100).

> The canonical, detailed phase breakdown lives in [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md:1).
