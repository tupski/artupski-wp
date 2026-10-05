# Content Model & Custom Post Types Specification: Artupski WordPress Theme

## 1. Core Principles & Plugin Encapsulation

To adhere to strict WordPress Architectural Guidelines, all Custom Post Types (CPTs), Custom Taxonomies, and Custom Field Registrations are implemented inside the companion plugin [`artupski-core`](docs/ARCHITECTURE.md:28). This ensures data persistence: switching themes does not delete or lock out historical contracting project data.

---

## 2. Entity Relationship Diagram (ERD)

```
+--------------------------+          +---------------------------+
|   rt_project (CPT)       |          |  rt_project_category (Tax)|
+--------------------------+          +---------------------------+
| ID                       |          | term_id                   |
| post_title               |◄─────────┤ name (e.g. Construction)  |
| post_content             | (M:M)    | slug                      |
| post_excerpt             |          +---------------------------+
+--------------------------+
| META FIELDS:             |          +---------------------------+
| _rt_project_year         |          |  rt_project_year (Tax)    |
| _rt_project_location     |          +---------------------------+
| _rt_project_client       |◄─────────┤ term_id                   |
| _rt_project_scope        | (M:1)    | name (e.g. 2024, 2023)    |
| _rt_project_gallery      |          | slug                      |
| _rt_project_blueprint    |          +---------------------------+
+--------------------------+
```

---

## 3. Custom Post Types Detailed Specification

### 3.1 Project Dossier (`rt_project`)
Stores individual contract records and historical engineering deliverables.

- **Post Type Slug**: `rt_project`
- **Labels**: Singular: *Project Dossier*, Plural: *Projects & Portfolio*
- **Supports**: `title`, `editor`, `excerpt`, `thumbnail`, `revisions`, `custom-fields`
- **Hierarchical**: `false`
- **Has Archive**: `projects` (custom rewrite URL `/portfolio/` or `/projects/`)
- **Rewrite Rules**: `/portfolio/%rt_project_year%/%postname%/`

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose / Render Location |
|---|---|---|---|
| `_rt_project_year` | `integer` | Taxonomy Term / Select | Chronological grouping header on archive |
| `_rt_project_location` | `string` | Text Input | Project geographic location (e.g. *Jakarta*, *Tangerang*) |
| `_rt_project_client` | `string` | Text Input | Client organization (e.g. *PLN*, *Department of Agriculture*) |
| `_rt_project_scope` | `string` | Text Input / Select | Contract discipline (e.g. *Civil & Structural*, *Interior Fitout*) |
| `_rt_project_gallery` | `array` | WP Media Gallery Frame| Array of attachment IDs for category carousels |
| `_rt_project_blueprint` | `string` | Textarea | Technical annotation notes displayed in IBM Plex Mono |

---

### 3.2 Leadership Team Member (`rt_team`)
Stores executive profiles, founding engineers, and key personnel.

- **Post Type Slug**: `rt_team`
- **Labels**: Singular: *Team Member*, Plural: *Leadership & Team*
- **Supports**: `title`, `editor`, `thumbnail`, `page-attributes`
- **Has Archive**: `false`

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose |
|---|---|---|---|
| `_rt_team_credentials` | `string` | Text Input | Professional titles (e.g. `Ir.`, `S.T.`, `M.T.`) |
| `_rt_team_role` | `string` | Text Input | Official role (e.g. *President Director & Founder*) |
| `_rt_team_year_joined` | `string` | Text Input | Tenure annotation (e.g. *Founded firm in 1992*) |

---

### 3.3 Firm Specialization / Service (`rt_service`)
Stores core commercial disciplines offered by the enterprise.

- **Post Type Slug**: `rt_service`
- **Labels**: Singular: *Specialization*, Plural: *Services & Specializations*
- **Supports**: `title`, `editor`, `thumbnail`, `page-attributes`
- **Has Archive**: `false`

#### Custom Meta Fields Table
| Meta Key | Data Type | Input Control | Purpose |
|---|---|---|---|
| `_rt_service_index` | `string` | Text Input | Monograph index number (e.g. `01`, `02`, `03`) |
| `_rt_service_icon` | `string` | SVG / Icon Select | Section icon reference |

---

## 4. Custom Taxonomies Specification

### 4.1 Discipline Category (`rt_project_category`)
- **Taxonomy Slug**: `rt_project_category`
- **Associated Post Type**: `rt_project`
- **Hierarchical**: `true`
- **Default Terms**: `Construction`, `Engineering`, `Interior`, `Infrastructure`, `Commercial`

### 4.2 Record Year (`rt_project_year`)
- **Taxonomy Slug**: `rt_project_year`
- **Associated Post Type**: `rt_project`
- **Hierarchical**: `false`
- **Default Terms**: `2024`, `2023`, `2022`, `2021`, `2020`, `2019`, `2018`, `2017`, `2016`, `2015`, `2014`, `2013`, `2012`, `2011`, `2010`, `2009`, `2008`, `2007`, `2006`, `2005`, `2004`, `2003`

---

## 5. Sample 45-Project Historical Schema Matrix

Audited project data structure imported into the Raja Tua baseline:

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
