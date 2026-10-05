# System Architecture: Artupski WordPress Theme

## 1. Architectural Philosophy & Overview

Artupski bridges the gap between modern Jamstack performance and traditional WordPress extensibility. It is structured around four foundational pillars:
1. **Decoupled Responsibilities**: Strict separation of Theme (visual presentation, templates, CSS tokens, Turbo hooks) from Content/Data (Custom Post Types, taxonomies, fields) and functionality, both encapsulated in the companion plugin [`artupski-core`](docs/ARCHITECTURE.md:28). The plugin owns anything that must survive a theme switch.
2. **Gutenberg-First, Classic-Compatible Rendering**: Gutenberg (native blocks, block patterns, template parts, `theme.json`) is the primary authoring experience. The Classic Editor is a compatibility/fallback experience that renders standard WordPress content correctly. Components are authored once as PHP template partials and surfaced to the block editor primarily through block patterns — not duplicated as a parallel shortcode system.
3. **Progressive Client-Side Navigation**: A **locally bundled** Turbo Drive enables seamless, app-like page transitions without headless infrastructure, REST API overhead, client-side framework bloat, or any runtime CDN dependency. Turbo is strictly progressive enhancement; normal WordPress navigation always works.
4. **Demo Content as Configuration**: The generic theme contains no demo-specific logic. Demo content (Contractor is Demo #1) is a configuration layer consumed by generic components. If any special-case logic is required, it is documented and justified.
5. **Not a Full Site Editing Theme (v1 Scope)**: **Full Site Editing (FSE) is OUT OF SCOPE for v1.** Gutenberg remains the primary authoring experience, but v1 is **not** a full block/FSE theme. Block templates/template parts are kept **only** where they support the planned architecture without turning the project into FSE; classic PHP templates remain the rendering backbone.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                    |
|   +---------------------------------------------------------------------------+   |
|   |        Hotwire Turbo Drive (locally bundled, pinned ESM version)          |   |
|   |  - turbo:visit -> turbo:before-cache -> turbo:render -> turbo:load        |   |
|   |  - Progressive enhancement only; normal MPA navigation when absent        |   |
|   +---------------------------------------------------------------------------+   |
|   |   Design System Tokens (CSS Variables)  |  Idempotent Event Delegation    |   |
|   |   Newsreader / Manrope / IBM Plex Mono   |  Lightboxes, Carousels, Menu   |   |
|   +---------------------------------------------------------------------------+   |
+------------------------------------------|----------------------------------------+
                                           | HTTP / HTML Partial Stream
+------------------------------------------v----------------------------------------+
|                             WORDPRESS THEME (artupski)                            |
|   - PRESENTATION ONLY (safe to swap without losing content)                       |
|   +---------------------------------------------------------------------------+   |
|   | Template Hierarchy: index.php, single-*.php, archive-*.php                |   |
|   +---------------------------------------------------------------------------+   |
|   | Presentation Component Engine: template-parts/components/*.php           |   |
|   +---------------------------------------------------------------------------+   |
|   | Customizer & Options API: Customizer, theme.json, Palette Switcher       |   |
|   +---------------------------------------------------------------------------+   |
|   | Gutenberg Engine: Block Patterns, Editor Styles, Block Styles (primary)  |   |
|   | Classic Editor: compatibility rendering + selective TinyMCE formats      |   |
|   +---------------------------------------------------------------------------+   |
+------------------------------------------|----------------------------------------+
                                           | Hooks & Taxonomies
+------------------------------------------v----------------------------------------+
|                       CORE COMPANION PLUGIN (artupski-core)                       |
|   - FUNCTIONALITY & STRUCTURED CONTENT (survives a theme switch)                  |
|   - Custom Post Types: `artupski_project`, `artupski_team`, `artupski_service`    |
|   - Primary Taxonomy: `artupski_project_category` (+ `artupski_project_year`)     |
|   - Meta Fields: Location, Client, Scope, Metric Stats, Blueprint Callouts       |
|   - Shared Import Services: Admin Wizard + WP-CLI entry points                    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory & Module Structure

The project is a **single monorepo**. Theme and companion plugin are developed together, but strictly separated by responsibility. `artupski-core` is **NOT extracted now**; extraction into a separate repository happens ONLY when a **second independent Artupski product/theme genuinely requires the same core functionality**. The current architecture must not depend on repository separation.

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

### 2.1 Theme Structure (`wp-content/themes/artupski/`)

The theme owns presentation only:

```text
wp-content/themes/artupski/
├── style.css                      # Theme declaration & global reset
├── theme.json                     # Block editor palette, typography, spacing tokens
├── functions.php                  # Theme bootstrap & service provider registration
├── index.php                      # Fallback index template
├── header.php                     # Global semantic <header>, skip links, navigation
├── footer.php                     # Global semantic <footer>, colophon, lightbox DOM
├── front-page.php                 # Home page dossier template
├── page.php                       # Generic page template
├── single.php                     # Standard post template
├── single-artupski_project.php    # Detailed project dossier single template
├── archive-artupski_project.php   # Chronological project archive (2003-2024)
├── 404.php                        # Dossier-styled 404 error page
├── inc/
│   ├── class-theme.php            # Core theme singleton & lifecycle hooks
│   ├── class-assets.php           # Enqueue scripts, styles, Turbo Drive & fonts
│   ├── class-customizer.php       # WP Customizer settings, controls, preview JS
│   ├── class-gutenberg.php        # Block pattern registration & core block filters
│   ├── class-classic-editor.php   # Shortcodes, TinyMCE styles, meta box wiring
│   ├── class-turbo.php            # Turbo header injection & cache control
│   └── template-tags.php          # Reusable template helper functions
├── template-parts/
│   ├── components/
│   │   ├── hero.php               # Hero variant partials (drafting, page-hero)
│   │   ├── section-header.php     # Numbered index badge + section title
│   │   ├── carousel.php           # Accessible swipe carousel partial
│   │   ├── lightbox.php           # Group-scoped accessible lightbox modal
│   │   ├── project-row.php        # Chronological project table row
│   │   ├── fact-counter.php       # Technical metric counter display
│   │   └── contact-grid.php       # Address, telephone & map matrix
│   ├── layout/
│   │   ├── header-navigation.php  # Primary navigation & mobile drawer
│   │   └── footer-colophon.php    # Monograph colophon & copyright
│   └── content/
│       ├── content-page.php       # Standard page loop content
│       └── content-none.php       # Zero results template
└── assets/
    ├── css/
    │   ├── site.css               # Runtime/component/layout CSS (theme.json tokens)
    │   ├── site.min.css           # Minified stylesheet
    │   ├── fonts.css              # Self-hosted @font-face (generated by fetch-fonts.mjs)
    │   ├── fonts.min.css          # Minified font declarations
    │   └── editor-style.css       # Gutenberg & TinyMCE mirrored styles
    ├── fonts/                     # Self-hosted WOFF2 (Newsreader, Manrope, IBM Plex Mono)
    ├── js/
    │   ├── site.js                # Turbo lifecycles, carousels, lightbox, navigation
    │   ├── site.min.js            # Minified JS runtime
    │   ├── vendor/turbo.js        # Pinned local Turbo 8.0.12 bundle (no CDN)
    │   └── customizer-preview.js  # Live reload customizer handlers
    └── images/                    # Local fallbacks, brand logos, vector assets
```

> **Design tokens:** `theme.json` is the canonical token source. `style.css`
> carries the WordPress theme header + global reset/foundation only and is
> **not** a second token source. All stylesheets consume `var(--wp--preset--*)`
> / `var(--wp--custom--*)`.

### 2.2 Companion Plugin Structure (`wp-content/plugins/artupski-core/`)

The plugin owns functionality and structured content that must survive a theme switch:

```text
wp-content/plugins/artupski-core/
├── artupski-core.php              # Plugin entry point
├── inc/
│   ├── class-cpt-project.php      # `artupski_project` post type & taxonomies
│   ├── class-cpt-team.php         # `artupski_team` post type
│   ├── class-cpt-service.php      # `artupski_service` post type
│   ├── class-meta-boxes.php       # Native meta box definitions (non-ACF fallback)
│   ├── import/
│   │   ├── class-import-service.php    # Shared import services (idempotent, transactional)
│   │   ├── class-import-wizard.php     # Admin UI flow (calls Import Service)
│   │   └── class-import-cli.php        # WP-CLI command (calls Import Service)
│   └── demo/
│       ├── content/               # Demo manifests, WXR/JSON export & media manifest
│       └── customizer.dat         # Default customizer options snapshot
└── demos/
    └── contractor/                # Demo #1 configuration (NOT hardcoded in the theme)
        ├── manifest.json          # Pages, menus, settings, project references
        ├── projects.json          # 45 project records
        └── media/                 # Bundled demo media assets
```

> **Single import engine:** `class-import-wizard.php` (admin UI) and `class-import-cli.php` (`wp artupski demo import <id>`) are thin adapters over the same `class-import-service.php`. There is exactly one import engine.

### 2.3 Demo Configuration Layer

Demos are **configuration, not core architecture**. The generic theme and generic components know nothing about any specific demo:

```text
Artupski Theme
     │
     ├── Generic theme system
     │
     ├── Generic reusable components
     │
     └── Demo configuration/content
              │
              └── Contractor   (Demo #1 / reference implementation)
```

- Contractor is Demo #1 and proves the architecture can represent the existing static website without special-case hacks.
- If any special-case logic is required, it MUST be documented with a justification rather than silently hardcoded.

---

## 3. Component Architecture & Data Flow

"Component" is an overloaded word. Artupski explicitly distinguishes **three different kinds of thing** so they are never conflated.

### 3.1 Presentation Components

Reusable UI building blocks that render markup. They own *how something looks*, not what data exists.

| Example presentation components |
|---|
| Header, Navigation, Footer, CTA, Hero, Timeline, Gallery, Project Card, Section Heading, Lightbox |

### 3.2 Content Models

Structured data entities owned by the companion plugin. They own *what data exists* and must survive a theme switch.

| Example content models |
|---|
| Project, Team, Service |

### 3.3 WordPress Implementation Mechanisms

The concrete WordPress tools used to *build* presentation components and render content models. Choosing the wrong mechanism is an architectural error.

| Mechanism | Use it when | Example in Artupski |
|---|---|---|
| **PHP template** | Page-level layout governed by the template hierarchy | `single-artupski_project.php`, `archive-artupski_project.php` |
| **Template Part** | A presentation component reused across templates and/or themes | `template-parts/components/hero.php`, `section-header.php` |
| **Block Pattern** | Editors need to insert a composed layout in Gutenberg without custom block code | `artupski/hero-drafting`, `artupski/facts-bar` |
| **Block** | A truly interactive/dynamic element not expressible as a static pattern | Only if a genuine requirement emerges (avoid by default) |
| **CSS component** | Visual styling scoped to a component's class namespace | `.fact`, `.ink-band`, `.section-title-row` |
| **JavaScript module** | Client-side behavior (interaction, lifecycle) | `site.js` carousel, lightbox, menu delegation |
| **Plugin functionality** | Persistence, domain logic, imports — anything theme-independent | `artupski-core` CPTs, import services |

**Decision guidance:**
- Need markup reused in multiple templates → **Template Part**.
- Need editors to drop a layout into a page → **Block Pattern** (built from core blocks).
- Need styling only → **CSS component**.
- Need behavior only → **JavaScript module**.
- Need data to persist across themes → **Plugin functionality / Content Model**.
- Do NOT reach for a **shortcode** merely to mirror a pattern; use it only for genuine value or legacy/compatibility.

### 3.4 Component Rendering Pipeline

To keep presentation components reusable across Block Patterns and PHP templates, Artupski uses an **Explicit Component Contract Pattern**.

1. **Invocation**: A template or pattern invokes a component passing an arguments array:
   ```php
   get_template_part( 'template-parts/components/section-header', null, array(
       'number' => '01 / Overview',
       'title'  => 'Project experience at a glance.',
       'meta'   => '2003 to 2024',
   ) );
   ```
2. **Sanitization & Default Resolution**:
   Inside [`template-parts/components/section-header.php`](template-parts/components/section-header.php:1), passed parameters are filtered via helper functions:
   ```php
   $args = wp_parse_args( $args, array(
       'number' => '',
       'title'  => '',
       'meta'   => '',
       'tag'    => 'h2',
   ) );
   ```
3. **Escaped HTML Output**: Output is escaped using strict WordPress escaping functions (`esc_html()`, `esc_attr()`, `wp_kses_post()`).

---

## 4. Turbo Drive Integration & Lifecycle Architecture

Artupski uses **Hotwire Turbo Drive** as a **locally bundled asset** at a **pinned version** (e.g. `@hotwired/turbo@8.0.12`), shipped inside the theme rather than fetched from a CDN at runtime.

### 4.1 Turbo Principles

- **Enabled by default** — Turbo is ON by default (`artupski_turbo_enabled` defaults to `true`). It remains fully disableable.
- **Local bundled asset** — committed to the repo and enqueued by the theme; no runtime CDN dependency, works on intranets/offline installs.
- **Predictable versioning** — the pinned version is part of the theme's asset manifest and updated deliberately.
- **Progressive enhancement** — Turbo is an enhancement layer, never a hard dependency.
- **Normal navigation fallback** — if JavaScript is unavailable, Turbo is disabled, or the bundle fails to load, **normal WordPress navigation must work correctly**. This documented fallback is a first-class requirement, not an afterthought.
- **No SPA complexity for visual effect** — Turbo exists for navigation speed, not to justify a client-side application.

### 4.2 Asset Loading & Initialization

- The theme enqueues `assets/js/site.js` as a deferred ES module.
- `site.js` boots normally, then conditionally loads/initializes Turbo from the **local bundle** (never a CDN).
- Initialization is guarded so it runs once per document and re-runs cleanly per Turbo visit.
- If the local bundle is missing, blocked, or fails, `site.js` catches the failure and the site continues with standard navigation.

### 4.3 Lifecycle Synchronization Flow

Because scripts in the `<body>` do not re-execute on Turbo visits, all JavaScript is **strictly idempotent and event-delegated**:

1. **Document-Level Delegated Listeners (Registered Once)**:
   - Click handlers for `.menu-toggle`, `[data-carousel-prev]`, `[data-carousel-next]`, `[data-carousel-dot]`, `[data-lightbox-item]`.
   - Keyboard listeners for `Escape` (closes modal/drawer), `ArrowLeft`/`ArrowRight` (steps carousel or lightbox), `Tab` (traps focus inside lightbox).
   - Silent suppression: `contextmenu` and `dragstart` (deterrence against casual image dragging).
   - Swipe listeners (`touchstart`, `touchend`) with passive flags.
2. **Lifecycle Events**:
   - `turbo:before-visit`: Closes active mobile menu and resets open modals to avoid DOM freeze.
   - `turbo:before-cache`: Closes drawers, strips `.is-open` from lightbox, resets carousels to index `0`, clears active input states — so the cached snapshot is always clean.
   - `turbo:render`: Resets `document.body.dataset.initialized = "false"`, boots fresh page DOM.
   - `turbo:load`: Triggers `init()` to recalculate active nav items (`aria-current="page"`), re-wires `IntersectionObserver` on `[data-reveal]` elements, updates footer dynamic year.
3. **Browser History & Direct URL Access**:
   - Turbo integrates with the browser History API; back/forward restore cached snapshots.
   - Direct URL access (deep links, hard refresh, sharing) always performs a full server request and renders correctly, because every URL is a fully server-rendered WordPress page.
   - No client-side router exists; URLs are the source of truth.

### 4.4 Graceful Degradation Strategy
If the Turbo bundle fails to load, is disabled, or JavaScript is completely unavailable:
- Standard multi-page navigation functions transparently with zero broken links.
- CSS fallback in `<noscript>` ensures all `[data-reveal]` elements render with `opacity: 1` and `transform: none`.
- Lightbox anchors gracefully fallback to linking directly to full-resolution media files.
- All interactive behavior (menus, carousels, lightbox) has a sane no-JS baseline (anchor links / visible content).

---

## 5. WordPress Hooks & Extensibility Matrix

Artupski provides targeted actions and filters allowing developers to extend theme functionality:

| Hook Name | Type | Location | Purpose |
|---|---|---|---|
| `artupski_after_setup_theme` | Action | `functions.php` | Fires after theme features (title-tag, post-thumbnails, editor-styles) are declared. |
| `artupski_enqueue_scripts` | Action | `inc/class-assets.php` | Fires when enqueuing front-end assets; allows child themes to dequeue Turbo. |
| `artupski_theme_colors` | Filter | `inc/class-customizer.php` | Filters the dynamic CSS palette tokens injected into `<head>`. |
| `artupski_project_query_args` | Filter | `archive-artupski_project.php` | Modifies WP_Query arguments for the chronological project archive. |
| `artupski_block_pattern_categories` | Filter | `inc/class-gutenberg.php` | Adds or modifies registered block pattern categories. |
| `artupski_before_header` | Action | `header.php` | Top of page anchor (ideal for notification banners or emergency alerts). |
| `artupski_after_footer` | Action | `footer.php` | Bottom of page hook before lightbox markup. |

---

## 6. Child Theme Architecture

Child themes inherit all styling and templates effortlessly:
- `get_stylesheet_directory_uri()` is used for assets that can be overridden by a child theme.
- `get_template_directory_uri()` is used for core unchanging assets.
- All class instantiations and template partial functions are wrapped in `if ( ! function_exists( ... ) )` guards or registered via standard filter hooks.
