# Product Requirements Document (PRD): Artupski WordPress Theme

## 1. Executive Summary & Purpose

Artupski is a premium commercial-grade corporate WordPress theme engineered for engineering consultancies, architectural studios, heritage contracting firms, and technical enterprises. The theme translates the bespoke design aesthetic of the **PT. RAJA TUA Dossier** static site into a flexible, extensible WordPress product.

The design philosophy rejects generic software agency templates (flat sans-serifs, glowing purple gradients, glassmorphism, floating cards) in favor of an **editorial engineering monograph / technical dossier**: warm paper grounds (`#F4F0E6`), rich ink text (`#16181C`), restrained crimson accents (`#C8102E`), hairline rules, numbered index headings (`01 / Overview`), and authoritative typography pairing Newsreader serif with Manrope grotesque and IBM Plex Mono annotation.

Artupski must support two primary deployment modes:
1. **Turnkey Raja Tua Demo**: 1-click import that produces an exact, bit-level reproduction of the PT. RAJA TUA static website with 45 chronological project portfolio records, structured leadership dossiers, and contact modules.
2. **Create From Scratch (White-Label / Generic Business)**: Clean baseline enabling site builders, agencies, and webmasters to build architectural, legal, engineering, and corporate websites utilizing block patterns, theme settings, and standardized Custom Post Types.

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
   - Core domain models (Portfolio Projects CPT, Team CPT, Testimonials) are encapsulated in an accompanying companion plugin (`artupski-core`) or core-registered standard custom taxonomies, preventing lock-in upon theme switching.
2. **Editor Agnosticism**:
   - First-class support for the modern WordPress Gutenberg Block Editor via custom Block Patterns and Core Block Styles.
   - Zero-breakage support for Classic Editor (`the_content()` fallback, meta boxes, standard shortcodes, and utility classes).
3. **No-Full-Reload Navigation with Instant Fallback**:
   - Native integration of Hotwire Turbo Drive (`assets/js/site.js`) providing SPA-speed transitions without hydration overhead.
   - Resilient fallback: If CDN/script fails or user disables JavaScript, standard multi-page MPA navigation operates without error.
4. **Strict Accessibility & Contrast Compliance**:
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
- **Portfolio / Project Experience**:
   - Chronological indexing (2003–2024 grouped archives).
   - Multi-category classification: Construction, Engineering, Interior, Commercial, Infrastructure.
   - Meta attributes: Completion Year, Location, Client Name, Contract Scope, Floor Area, Structural Value.
   - Project Gallery with scoped carousel and modal lightbox.
- **Team / Leadership Dossier**:
   - Member name, credential suffix (e.g., `Ir. Urat Sitohang`), leadership role, bio, and formal portrait.
- **Services / Specializations**:
   - Numbered service rows (`01`, `02`, `03`), detailed scope checklist, associated project gallery links.

### 4.3 Component System & Page Layouts
- **Hero Varieties**: Drafting media hero with scrim, minimalist text-forward page hero, split editorial hero.
- **Section Headers**: Numbered index badge (`.sec-num`), balanced serif heading, metadata annotation.
- **Metrics / Facts Counter**: Large numeric callout (`.fact__num`) with baseline label and explanatory footnote.
- **Dossier Editorial Split**: Left metadata column (`01 / Company`), right typography flow column.
- **Categorized Carousel & Lightbox**: Touch-swipe enabled track, numbered slide counter (`1 / 8`), group-scoped modal view.
- **Contact Matrix**: Office address, direct telephone dispatch, inquiry routing, and interactive embedded map.

### 4.4 Demo Importer & Onboarding
- **1-Click Demo Import**: Seeds pages (`Home`, `About Us`, `Portfolio`, `Contact Us`), 45 projects, media library images, menus, and customizer defaults.
- **Scratch Setup Wizard**: Step-by-step assistant configuring site logo, primary colors, navigation menus, and blank starter pages.

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

---

## 6. Success Criteria & Release Milestones

1. **Phase 1: Architecture & Design System Freeze** (Documentation complete, tokens locked).
2. **Phase 2: Core Engine & Theme Framework** (`artupski` theme base + `artupski-core` post types).
3. **Phase 3: Gutenberg Patterns & Classic Templates** (Block library + classic PHP template parity).
4. **Phase 4: Client-side Navigation & Interactive Components** (Turbo Drive lifecycles + carousels/lightbox).
5. **Phase 5: Demo Importer & Seed Data** (1-click Raja Tua dossier package).
6. **Phase 6: QA, Accessibility & Performance Audit** (Zero PHP errors, WP Coding Standards validation, Lighthouse 100).
