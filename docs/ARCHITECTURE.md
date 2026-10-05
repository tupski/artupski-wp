# System Architecture: Artupski WordPress Theme

## 1. Architectural Philosophy & Overview

Artupski bridges the gap between modern Jamstack performance and traditional WordPress extensibility. It is structured around three foundational pillars:
1. **Decoupled Responsibilities**: Strict separation of Theme (visual presentation, templates, CSS tokens, Turbo hooks) from Content/Data (Custom Post Types, taxonomies, fields, encapsulated in [`artupski-core`](docs/ARCHITECTURE.md:28)).
2. **Editor Agnostic Rendering**: Components are authored once as PHP template partials and surfaced cleanly to both Gutenberg Block Patterns and Classic Editor shortcodes.
3. **Progressive Client-Side Navigation**: Turbo Drive enables seamless, app-like page transitions without headless infrastructure, REST API overhead, or client-side framework bloat.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                    |
|   +---------------------------------------------------------------------------+   |
|   |                  Hotwire Turbo Drive (8.0.12 ESM / Fallback)              |   |
|   |  - turbo:visit -> turbo:before-cache -> turbo:render -> turbo:load        |   |
|   +---------------------------------------------------------------------------+   |
|   |   Design System Tokens (CSS Variables)  |  Idempotent Event Delegation    |   |
|   |   Newsreader / Manrope / IBM Plex Mono   |  Lightboxes, Carousels, Menu   |   |
|   +---------------------------------------------------------------------------+   |
+------------------------------------------|----------------------------------------+
                                           | HTTP / HTML Partial Stream
+------------------------------------------v----------------------------------------+
|                             WORDPRESS THEME (artupski)                            |
|   +---------------------------------------------------------------------------+   |
|   | Template Hierarchy: index.php, single-project.php, archive-project.php   |   |
|   +---------------------------------------------------------------------------+   |
|   | Component Partial Engine: template-parts/components/*.php                |   |
|   +---------------------------------------------------------------------------+   |
|   | Customizer & Options API: Customizer, theme.json, Palette Switcher       |   |
|   +---------------------------------------------------------------------------+   |
|   | Gutenberg Engine: Block Patterns, Editor Styles, Block Styles             |   |
|   +---------------------------------------------------------------------------+   |
+------------------------------------------|----------------------------------------+
                                           | Hooks & Taxonomies
+------------------------------------------v----------------------------------------+
|                       CORE COMPANION PLUGIN (artupski-core)                       |
|   - Custom Post Types: `rt_project`, `rt_team`, `rt_service`                      |
|   - Taxonomies: `rt_project_category`, `rt_project_year`                          |
|   - Meta Fields: Location, Client, Scope, Metric Stats, Blueprint Callouts       |
|   - 1-Click Demo Importer & Seed Content Engine                                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory & Module Structure

The project maintains a standardized, modular structure separating presentation from persistence:

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
├── single-rt_project.php          # Detailed project dossier single template
├── archive-rt_project.php         # Chronological project archive (2003-2024)
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
    │   ├── site.css               # Audited production CSS
    │   ├── site.min.css           # Minified stylesheet
    │   └── editor-style.css       # Gutenberg & TinyMCE mirrored styles
    ├── js/
    │   ├── site.js                # Turbo lifecycles, carousels, lightbox, navigation
    │   ├── site.min.js            # Minified JS runtime
    │   └── customizer-preview.js  # Live reload customizer handlers
    └── images/                    # Local fallbacks, brand logos, vector assets
```

Companion plugin structure (`wp-content/plugins/artupski-core/`):
```text
wp-content/plugins/artupski-core/
├── artupski-core.php              # Plugin entry point
├── inc/
│   ├── class-cpt-project.php      # `rt_project` post type & taxonomies
│   ├── class-cpt-team.php         # `rt_team` post type
│   ├── class-cpt-service.php      # `rt_service` post type
│   ├── class-meta-boxes.php       # Native meta box definitions (non-ACF fallback)
│   └── demo/
│       ├── class-demo-importer.php# One-click XML/JSON data seeder
│       ├── content/               # Raja Tua WXR export & media manifest
│       └── customizer.dat         # Default customizer options snapshot
```

---

## 3. Component Architecture & Data Flow

To ensure complete code reusability across Classic Editor, Block Patterns, and direct PHP templates, Artupski uses an **Explicit Component Contract Pattern**.

### Component Rendering Pipeline
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

## 4. Hotwire Turbo Drive Integration & Lifecycle Architecture

Artupski utilizes **Hotwire Turbo Drive** (bundled via ESM from `@hotwired/turbo@8.0.12` with direct degradation). Turbo converts standard link clicks into asynchronous `fetch` requests and seamlessly swaps the `<body>` while merging `<head>` elements.

### 4.1 Lifecycle Synchronization Flow
Because scripts in the `<body>` do not re-execute on Turbo visits, all JavaScript is architected to be **strictly idempotent and event-delegated**:

1. **Document-Level Delegated Listeners (Registered Once)**:
   - Click handlers for `.menu-toggle`, `[data-carousel-prev]`, `[data-carousel-next]`, `[data-carousel-dot]`, `[data-lightbox-item]`.
   - Keyboard listeners for `Escape` (closes modal/drawer), `ArrowLeft`/`ArrowRight` (steps carousel or lightbox), `Tab` (traps focus inside lightbox).
   - Silent suppression: `contextmenu` and `dragstart` (deterrence against casual image dragging).
   - Swipe listeners (`touchstart`, `touchend`) with passive flags.
2. **Lifecycle Transitions**:
   - `turbo:before-visit`: Closes active mobile menu and resets open modals to avoid DOM freeze.
   - `turbo:before-cache`: Closes drawers, strips `.is-open` from lightbox, resets carousels to index `0`, clears active input states.
   - `turbo:render`: Resets `document.body.dataset.initialized = "false"`, boots fresh page DOM.
   - `turbo:load`: Triggers `init()` to recalculate active nav items (`aria-current="page"`), re-wires `IntersectionObserver` on `[data-reveal]` elements, updates footer dynamic year.

### 4.2 Graceful Degradation Strategy
If the Turbo bundle fails to load or JavaScript is completely disabled:
- Standard multi-page navigation functions transparently with zero broken links.
- CSS fallback in `<noscript>` ensures all `[data-reveal]` elements render with `opacity: 1` and `transform: none`.
- Lightbox anchors gracefully fallback to linking directly to full-resolution media files.

---

## 5. WordPress Hooks & Extensibility Matrix

Artupski provides targeted actions and filters allowing developers to extend theme functionality:

| Hook Name | Type | Location | Purpose |
|---|---|---|---|
| `artupski_after_setup_theme` | Action | `functions.php` | Fires after theme features (title-tag, post-thumbnails, editor-styles) are declared. |
| `artupski_enqueue_scripts` | Action | `inc/class-assets.php` | Fires when enqueuing front-end assets; allows child themes to dequeue Turbo. |
| `artupski_theme_colors` | Filter | `inc/class-customizer.php` | Filters the dynamic CSS palette tokens injected into `<head>`. |
| `artupski_project_query_args` | Filter | `archive-rt_project.php` | Modifies WP_Query arguments for the chronological project archive. |
| `artupski_block_pattern_categories` | Filter | `inc/class-gutenberg.php` | Adds or modifies registered block pattern categories. |
| `artupski_before_header` | Action | `header.php` | Top of page anchor (ideal for notification banners or emergency alerts). |
| `artupski_after_footer` | Action | `footer.php` | Bottom of page hook before lightbox markup. |

---

## 6. Child Theme Architecture

Child themes inherit all styling and templates effortlessly:
- `get_stylesheet_directory_uri()` is used for assets that can be overridden by a child theme.
- `get_template_directory_uri()` is used for core unchanging assets.
- All class instantiations and template partial functions are wrapped in `if ( ! function_exists( ... ) )` guards or registered via standard filter hooks.
