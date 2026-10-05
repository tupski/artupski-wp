# Demo Import & Starter Wizard Specification: Artupski WordPress Theme

## 1. Overview & Operational Modes

Artupski caters to two distinct onboarding paths for administrators upon theme activation:
1. **Turnkey PT. RAJA TUA Demo Baseline**: 1-click import that loads the complete historical construction monograph, seeding 4 static page equivalents (`Home`, `About Us`, `Portfolio`, `Contact Us`), 45 historical projects (2003–2024), leadership dossiers, and authentic responsive media assets.
2. **Create From Scratch (Blank White-Label Baseline)**: A streamlined onboarding wizard that skips demo content, configures core customizer defaults, creates foundational empty pages, assigns primary menus, and leaves the site clean for custom content development.

---

## 2. PT. RAJA TUA Baseline Dataset Manifest

The demo package bundles all assets audited from the static website repository:

### 2.1 Seed Pages
- **Home (`front-page.php`)**:
  - Drafting Media Hero with scrim and typography lockup.
  - Section `01 / Company`: Firm overview lede.
  - Section `02 / Specialization`: Construction, Engineering, and Interior discipline rows.
  - Section `03 / Heritage`: Full-bleed ink band with oversized `1992` year typography and 30+ year milestone.
  - Section `04 / Motto`: Editorial pull-quote (*"Terdepan, Unik, dan Andalan."*).
  - Section `05 / Selected Work`: Highlighted projects and CTA to archive.
- **About Us (`about-us.html`)**:
  - Page Hero with pale stone facade panels portrait (`assets/images/facade-panels.jpg`).
  - Founder dossier: Ir. Urat Sitohang biography and credentials.
  - Vision & Mission structured monograph split.
  - Organization structure and quality assurance commitments.
- **Portfolio (`portfolio.html`)**:
  - Portfolio Hero with tower cranes photography (`assets/images/tower-cranes.jpg`).
  - Section `01 / Overview`: Fact metrics bar (45 projects, 21 years on record, 30+ years in business).
  - Section `02 / Project History`: Complete chronological project records grouped into annual tables (2003 to 2024).
  - Section `03 / Representative Imagery`: Categorized carousels (Interior, Construction, Infrastructure, Industrial) with group-scoped lightboxes.
- **Contact Us (`contact-us.html`)**:
  - Page Hero (text-forward, no large hero banner).
  - Section `01 / Details`: Office address in Serpong Utara, dual phone lines, direct email.
  - Section `02 / Directions`: Interactive Google Maps embed with location callout.

### 2.2 Seed Media Assets (Local High-Resolution Imagery)
- `assets/images/hero-drafting.jpg` (1920x1280)
- `assets/images/facade-panels.jpg` (1400x1750)
- `assets/images/tower-cranes.jpg` (1400x1050)
- `assets/images/church-stained-glass.jpg`, `church-steeple.jpg`, `church-vaulted-interior.jpg`
- `assets/images/concrete-recessed.jpg`, `construction-rebar-slab.jpg`, `steel-rebar-cage.jpg`
- `assets/images/interior-cabin.jpg`, `interior-corridor.jpg`, `interior-meeting-room.jpg`
- `assets/images/mosque-dome-minarets.jpg`, `planning-desk.jpg`, `residential-dusk.jpg`
- `assets/images/tower-constitution.jpg`, `villa-white.jpg`
- `assets/images/warehouse-distribution.jpg`, `warehouse-pallet-racking.jpg`, `warehouse-racking.jpg`
- `assets/images/rajatua-logo.png` (Site icon & brand wordmark)

---

## 3. Demo Importer Engine Architecture

The importer is housed in the companion plugin (`plugins/artupski-core/inc/demo/class-demo-importer.php`) to keep the theme lightweight.

```
Admin clicks "Import Raja Tua Demo"
                 │
                 ├──► Step 1: Pre-flight Verification (PHP timeout, write permissions)
                 │
                 ├──► Step 2: Media Asset Attachment Import (Local bundle -> wp-content/uploads)
                 │
                 ├──► Step 3: WXR Content Import (Pages, Posts, `rt_project` records)
                 │
                 ├──► Step 4: Taxonomy Terms & Meta Field Mapping
                 │
                 ├──► Step 5: Menus & Location Assignment (Primary Nav, Footer Nav)
                 │
                 ├──► Step 6: Customizer Theme Mods & Front Page Assignment
                 │
                 └──► Step 7: Turbo Cache Flush & Success Confirmation
```

### 3.1 Idempotency & Safety Guarantees
- **Duplicate Prevention**: Every imported post and media item is checked by slug and unique demo GUID (`_artupski_demo_id`). Re-running import updates existing items instead of duplicating them.
- **Transactional Rollback Support**: If an import fails midway, a cleanup routine can delete all posts flagged with `_artupski_demo_id`.
- **Zero Remote HTTP Dependency**: All demo images and JSON/XML files are bundled locally inside the plugin package, allowing offline or intranet installations.

---

## 4. "Create From Scratch" Wizard Flow

For agency builders creating a bespoke corporate site:
1. **Welcome Screen**: Select between "Full Raja Tua Heritage Demo" or "Empty Corporate Foundation".
2. **Branding Setup**: Upload Custom Logo, enter Wordmark text and custom accent suffix.
3. **Palette Preset**: Choose between Heritage Dossier, Monochrome, Blueprint, or Crisp White.
4. **Base Page Creation**: Checkbox selection to automatically generate empty pages with assigned page templates:
   - `[x]` Home (Front Page Dossier Template)
   - `[x]` About (Editorial Split Template)
   - `[x]` Projects (Chronological Portfolio Archive)
   - `[x]` Contact (Split Contact Matrix)
5. **Menu Configuration**: Automatically generates `Primary Menu` and attaches newly created pages.
6. **Completion**: Directly redirects to the WordPress Block Editor to begin content creation.
