# Demo Import & Starter Wizard Specification: Artupski WordPress Theme

## 1. Overview & Operational Modes

Artupski caters to two distinct onboarding paths for administrators:

1. **Turnkey Contractor Demo Baseline (Demo #1)**: 1-click import that loads the complete historical construction monograph, seeding 4 static page equivalents (`Home`, `About Us`, `Portfolio`, `Contact Us`), 45 historical projects (2003–2024), leadership dossiers, and authentic responsive media assets. Contractor is the reference implementation that proves the generic architecture can represent the static site **without special-case hacks**.
2. **Create From Scratch (Blank White-Label Baseline)**: A streamlined onboarding path that skips demo content, configures core customizer defaults, creates foundational empty pages, assigns primary menus, and leaves the site clean for custom content development.

Both paths are driven by the **same underlying import services**.

---

## 2. Shared Importer Architecture

The importer is housed in the companion plugin (`plugins/artupski-core/inc/import/`). The Admin Wizard and WP-CLI are **thin adapters** over one shared service layer. There is exactly **one** import engine — never two.

```text
                 ┌──────────────────┐
                 │   Admin Wizard   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Import Services  │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Admin UI flow            WP-CLI command
```

### 2.1 Layer Responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **Import Service** | `inc/import/class-import-service.php` | All import logic: idempotency, duplicate detection, media, pages, menus, settings, projects, metadata, progress, rollback. UI-agnostic. |
| **Admin Wizard** | `inc/import/class-import-wizard.php` | Renders screens, handles nonce/capability checks, calls the service, displays progress. Contains **no** import logic of its own. |
| **WP-CLI** | `inc/import/class-import-cli.php` | Registers `wp artupski demo import <id>`, calls the service, renders progress to the terminal. Contains **no** import logic of its own. |

### 2.2 Supported Invocations

```text
wp artupski demo import contractor
```

and the equivalent admin UI ("Import Contractor Demo"), both calling the same service.

### 2.3 Demo Configuration Layer

Demos are **configuration, not core architecture**. The service reads a demo package:

```text
plugins/artupski-core/demos/
└── contractor/                # Demo #1
    ├── manifest.json          # Pages, menus, settings, front page, project references
    ├── projects.json          # 45 project records
    └── media/                 # Bundled demo media assets
```

No demo identifier is hardcoded into generic theme or component code.

---

## 3. Import Pipeline

```text
Import requested (Admin wizard OR WP-CLI)
                 │
                 ├──► Step 0: Capability check + nonce verification (admin path)
                 │
                 ├──► Step 1: Pre-flight verification (PHP limits, write permissions, existing import state)
                 │
                 ├──► Step 2: Media handling (bundle -> wp-content/uploads, dedupe by demo id)
                 │
                 ├──► Step 3: Page creation (Home, About Us, Portfolio, Contact Us)
                 │
                 ├──► Step 4: Project content (45 records) + taxonomy terms & meta mapping
                 │
                 ├──► Step 5: Menu creation & location assignment (Primary Nav, Footer Nav)
                 │
                 ├──► Step 6: Theme settings (customizer mods) & front page assignment
                 │
                 ├──► Step 7: Demo metadata write (_artupski_demo_id markers)
                 │
                 └──► Step 8: Progress report, cache flush & completion
```

---

## 4. Import Guarantees & Behaviors

### 4.1 Idempotency & Duplicate Detection
- Every imported entity is tagged with a stable **demo id** (`_artupski_demo_id`) plus slug/guid checks.
- Re-running an import **updates existing items instead of duplicating them**.
- Duplicate detection covers pages, projects, media attachments, menu items, and taxonomy terms.

### 4.2 Rollback & Error Handling
- Each step reports success/failure; failures do not silently corrupt partial state.
- A cleanup routine can remove all entities flagged with `_artupski_demo_id`.
- Errors surface actionable messages in both the admin UI and the WP-CLI output.

### 4.3 Media Handling
- All demo images are **bundled locally** inside the plugin (zero remote HTTP dependency; works on intranet/offline installs).
- Attachments import with correct `alt` text, `width`/`height`, and deduplication by demo id.
- Media is imported before content so post/page references resolve.

### 4.4 Page Creation
- Creates `Home`, `About Us`, `Portfolio`, `Contact Us` with the appropriate page templates and Gutenberg block content (patterns).
- Sets the front page and posts page correctly.

### 4.5 Menu Creation
- Builds the Primary and Footer menus and assigns them to registered theme locations.
- Menu items point at imported pages.

### 4.6 Theme Settings
- Applies customizer defaults / theme mods (palette, wordmark, header options) from the demo package.
- Settings are applied idempotently (re-running overwrites with the demo defaults, not stacking).

### 4.7 Project Content
- Imports 45 `artupski_project` records with category (`artupski_project_category`), year (`artupski_project_year`), and meta fields (Location, Client, Scope, Gallery).
- Gallery attachments are linked by demo media ids.

### 4.8 Demo Metadata
- Records provenance (`_artupski_demo_id`, import batch, timestamps) to enable duplicate detection and rollback.

### 4.9 Progress Reporting
- Long-running steps report progress to the active surface: a progress UI in the admin wizard, a progress line in WP-CLI.

### 4.10 Capability Checks & Nonce Protection
- Admin wizard requires an appropriate capability (e.g. `manage_options` / `import`).
- All admin import actions are protected by `wp_verify_nonce()`.
- WP-CLI relies on CLI context (already privileged) and validates the demo id argument.

### 4.11 Re-running an Import Safely
- Idempotent by design: a second run updates rather than duplicates.
- Safe to run repeatedly during development and after content edits (demo-owned entities are updated; user-created content is untouched).

---

## 5. Contractor Baseline Dataset Manifest

The demo package bundles all assets audited from the static reference site.

### 5.1 Seed Pages
- **Home (`front-page.php`)**:
  - Drafting Media Hero with scrim and typography lockup.
  - Section `01 / Company`: Firm overview lede.
  - Section `02 / Specialization`: Construction, Engineering, and Interior category rows.
  - Section `03 / Heritage`: Full-bleed ink band with oversized `1992` year typography and 30+ year milestone.
  - Section `04 / Motto`: Editorial pull-quote.
  - Section `05 / Selected Work`: Highlighted projects and CTA to archive.
- **About Us**:
  - Page Hero with pale stone facade panels portrait (`assets/images/facade-panels.jpg`).
  - Founder dossier biography and credentials.
  - Vision & Mission structured monograph split.
  - Organization structure and quality assurance commitments.
- **Portfolio**:
  - Portfolio Hero with tower cranes photography (`assets/images/tower-cranes.jpg`).
  - Section `01 / Overview`: Fact metrics bar (45 projects, 21 years on record, 30+ years in business).
  - Section `02 / Project History`: Complete chronological project records grouped into annual tables (2003 to 2024).
  - Section `03 / Representative Imagery`: Categorized carousels (Interior, Construction, Infrastructure, Industrial) with group-scoped lightboxes.
- **Contact Us**:
  - Page Hero (text-forward, no large hero banner).
  - Section `01 / Details`: Office address, dual phone lines, direct email.
  - Section `02 / Directions`: Interactive map embed with location callout.

### 5.2 Seed Media Assets (Local High-Resolution Imagery)
- `assets/images/hero-drafting.jpg` (1920x1280)
- `assets/images/facade-panels.jpg` (1400x1750)
- `assets/images/tower-cranes.jpg` (1400x1050)
- `assets/images/church-stained-glass.jpg`, `church-steeple.jpg`, `church-vaulted-interior.jpg`
- `assets/images/concrete-recessed.jpg`, `construction-rebar-slab.jpg`, `steel-rebar-cage.jpg`
- `assets/images/interior-cabin.jpg`, `interior-corridor.jpg`, `interior-meeting-room.jpg`
- `assets/images/mosque-dome-minarets.jpg`, `planning-desk.jpg`, `residential-dusk.jpg`
- `assets/images/tower-constitution.jpg`, `villa-white.jpg`
- `assets/images/warehouse-distribution.jpg`, `warehouse-pallet-racking.jpg`, `warehouse-racking.jpg`
- `assets/images/contractor-logo.png` (Site icon & brand wordmark)

---

## 6. "Create From Scratch" Wizard Flow

For agency builders creating a bespoke corporate site (also driven by the shared import service):

1. **Welcome Screen**: Select between "Full Contractor Heritage Demo" or "Empty Corporate Foundation".
2. **Branding Setup**: Upload Custom Logo, enter Wordmark text and custom accent suffix.
3. **Palette Preset**: Choose between Heritage Dossier, Monochrome, Blueprint, or Crisp White.
4. **Base Page Creation**: Checkbox selection to automatically generate empty pages with assigned page templates:
   - `[x]` Home (Front Page Dossier Template)
   - `[x]` About (Editorial Split Template)
   - `[x]` Projects (Chronological Portfolio Archive)
   - `[x]` Contact (Split Contact Matrix)
5. **Menu Configuration**: Automatically generates `Primary Menu` and attaches newly created pages.
6. **Completion**: Directly redirects to the WordPress Block Editor to begin content creation.
