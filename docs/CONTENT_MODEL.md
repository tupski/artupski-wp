# Content Model & Custom Post Types Specification: Artupski WordPress Theme

## 1. Core Principles & Plugin Encapsulation

To adhere to strict WordPress Architectural Guidelines, all Custom Post Types (CPTs), Custom Taxonomies, and Custom Field Registrations are implemented inside the companion plugin [`artupski-core`](docs/ARCHITECTURE.md:28). This ensures data persistence: switching themes does not delete or lock out historical contracting project data.

- The plugin owns **structured content and functionality**; the theme owns **presentation**.
- The plugin is developed in the same **monorepo** as the theme and is **not extracted now**. Extraction into a separate repository happens ONLY when a second independent Artupski product/theme genuinely requires the same core functionality; the current architecture must not depend on repository separation.
- **Taxonomy discipline:** `artupski_project_category` is the single **primary** project taxonomy and describes **project categories**, not implementation disciplines. `artupski_discipline` is NOT used as the primary taxonomy.
- The model stays extensible: an additional taxonomy may be introduced later if a genuine business requirement arises. No unnecessary taxonomies are created now.

---

## 2. Entity Relationship Diagram (ERD)

```
+------------------------------+          +----------------------------------+
|   artupski_project (CPT)     |          |  artupski_project_category (Tax) |
+------------------------------+          +----------------------------------+
| ID                           |          | term_id                          |
| post_title                   |◄─────────┤ name (e.g. Construction)         |
| post_content                 | (M:M)    | slug                             |
| post_excerpt                 |          +----------------------------------+
+------------------------------+
| META FIELDS:                 |          +----------------------------------+
| _artupski_project_year       |          |  artupski_project_year (Tax)     |
| _artupski_project_location   |          +----------------------------------+
| _artupski_project_client     |◄─────────┤ term_id                          |
| _artupski_project_scope      | (M:1)    | name (e.g. 2024, 2023)           |
| _artupski_project_gallery    |          | slug                             |
| _artupski_project_blueprint  |          +----------------------------------+
+------------------------------+
```

---

## 3. Custom Post Types Detailed Specification

### 3.1 Project Dossier (`artupski_project`)
Stores individual contract records and historical engineering deliverables.

- **Post Type Slug**: `artupski_project`
- **Labels**: Singular: *Project Dossier*, Plural: *Projects & Portfolio*
- **Supports**: `title`, `editor`, `excerpt`, `thumbnail`, `revisions`, `custom-fields`
- **Hierarchical**: `false`
- **Has Archive**: `projects` (rewrite slug `/projects/`)
- **Rewrite Rules**: `/projects/%artupski_project_year%/%postname%/`
- **Rewrite slug decision**: The archive rewrite slug is `/projects/`, NOT `/portfolio/`. The theme must remain generic; `/portfolio/` is intentionally not used.

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose / Render Location |
|---|---|---|---|
| `_artupski_project_year` | `integer` | Taxonomy Term / Select | Chronological grouping header on archive |
| `_artupski_project_location` | `string` | Text Input | Project geographic location (e.g. *Jakarta*, *Tangerang*) |
| `_artupski_project_client` | `string` | Text Input | Client organization (e.g. *PLN*, *Department of Agriculture*) |
| `_artupski_project_scope` | `string` | Text Input | Descriptive contract scope text (e.g. *Civil & Structural*, *Interior Fitout*). Not a taxonomy; categories live in `artupski_project_category`. |
| `_artupski_project_gallery` | `array` | WP Media Gallery Frame| Array of attachment IDs for category carousels |
| `_artupski_project_blueprint` | `string` | Textarea | Technical annotation notes displayed in IBM Plex Mono |

---

### 3.2 Leadership Team Member (`artupski_team`)
Stores executive profiles, founding engineers, and key personnel.

- **Post Type Slug**: `artupski_team`
- **Labels**: Singular: *Team Member*, Plural: *Leadership & Team*
- **Supports**: `title`, `editor`, `thumbnail`, `page-attributes`
- **Has Archive**: `false`

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose |
|---|---|---|---|
| `_artupski_team_credentials` | `string` | Text Input | Professional titles (e.g. `Ir.`, `S.T.`, `M.T.`) |
| `_artupski_team_role` | `string` | Text Input | Official role (e.g. *President Director & Founder*) |
| `_artupski_team_year_joined` | `string` | Text Input | Tenure annotation (e.g. *Founded firm in 1992*) |

---

### 3.3 Firm Specialization / Service (`artupski_service`)
Stores core commercial disciplines offered by the enterprise.

- **Post Type Slug**: `artupski_service`
- **Labels**: Singular: *Specialization*, Plural: *Services & Specializations*
- **Supports**: `title`, `editor`, `thumbnail`, `page-attributes`
- **Has Archive**: `false`

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose |
|---|---|---|---|
| `_artupski_service_index` | `string` | Text Input | Monograph index number (e.g. `01`, `02`, `03`) |
| `_artupski_service_icon` | `string` | SVG / Icon Select | Section icon reference |

---

## 4. Custom Taxonomies Specification

### 4.1 Project Category (`artupski_project_category`) — Primary Taxonomy
- **Taxonomy Slug**: `artupski_project_category`
- **Role**: Primary classification taxonomy for projects.
- **Describes**: Project **categories** (what kind of project it is), NOT implementation disciplines.
- **Associated Post Type**: `artupski_project`
- **Hierarchical**: `true`
- **Default Terms**: `Construction`, `Engineering`, `Interior`, `Infrastructure`, `Commercial`
- **Note**: `artupski_discipline` is explicitly NOT the primary taxonomy. A separate discipline/scope taxonomy is not created now; the free-form `_artupski_project_scope` meta field covers descriptive scope text. If a genuine business requirement for structured disciplines emerges, an additional taxonomy may be added later.

### 4.2 Record Year (`artupski_project_year`)
- **Taxonomy Slug**: `artupski_project_year`
- **Associated Post Type**: `artupski_project`
- **Hierarchical**: `false`
- **Default Terms**: `2024`, `2023`, `2022`, `2021`, `2020`, `2019`, `2018`, `2017`, `2016`, `2015`, `2014`, `2013`, `2012`, `2011`, `2010`, `2009`, `2008`, `2007`, `2006`, `2005`, `2004`, `2003`

---

## 5. Sample 45-Project Historical Schema Matrix

Audited project data structure imported into the Contractor baseline:

```json
[
  {
    "title": "Renovasi Gedung & Interior Kantor PT PLN (Persero)",
    "year": "2024",
    "category": "Interior",
    "location": "Jakarta Selatan",
    "client": "PT PLN (Persero)",
    "scope": "Interior Architecture & Civil Works",
    "gallery_ids": [101, 102, 103]
  },
  {
    "title": "Pembangunan Pabrik & Gudang Pallet Storage",
    "year": "2023",
    "category": "Construction",
    "location": "Serpong, Tangerang Selatan",
    "client": "Private Logistics Enterprise",
    "scope": "General Contracting & Steel Structure",
    "gallery_ids": [104, 105]
  }
]
```
