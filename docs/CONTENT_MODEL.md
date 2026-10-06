# Content Model & Custom Post Types Specification: Artupski WordPress Theme

## 1. Core Principles & Plugin Encapsulation

To adhere to strict WordPress Architectural Guidelines, all Custom Post Types (CPTs), Custom Taxonomies, and Custom Field Registrations are implemented inside the companion plugin [`artupski-core`](docs/ARCHITECTURE.md:28). This ensures data persistence: switching themes does not delete or lock out historical contracting project data.

- The plugin owns **structured content and functionality**; the theme owns **presentation**.
- The plugin is developed in the same **monorepo** as the theme and is **not extracted now**. Extraction into a separate repository happens ONLY when a second independent Artupski product/theme genuinely requires the same core functionality; the current architecture must not depend on repository separation.
- **Taxonomy discipline:** `artupski_project_category` is the single **primary** project taxonomy and describes **project categories**, not implementation disciplines. `artupski_discipline` is NOT used as the primary taxonomy.
- **Single Source of Truth:** Every semantic field maps to exactly one canonical key. Redundant aliases and duplicate storage keys are strictly prohibited.
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
| _artupski_project_location   |          |  artupski_project_year (Tax)     |
| _artupski_project_client     |          +----------------------------------+
| _artupski_project_scope      |◄─────────┤ term_id                          |
| _artupski_subtitle           | (M:1)    | name (e.g. 2024, 2023)           |
| _artupski_architecture_style |          | slug                             |
| _artupski_area               |          +----------------------------------+
| _artupski_status             |
| _artupski_client_testimonial |
| _artupski_image_gallery      |
| _artupski_structural_specs   |
+------------------------------+
```

---

## 3. Custom Post Types Detailed Specification

### 3.1 Project Dossier (`artupski_project`)
Stores individual contract records and historical engineering deliverables.

- **Post Type Slug**: `artupski_project`
- **Labels**: Singular: *Project Dossier*, Plural: *Projects & Portfolio*
- **Supports**: `title`, `editor`, `excerpt`, `thumbnail`, `revisions`, `author`, `custom-fields`
- **Hierarchical**: `false`
- **Has Archive**: `projects` (rewrite slug `/projects/`)
- **Rewrite Rules**: `/projects/%artupski_project_year%/%postname%/`
- **Rewrite slug decision**: The archive rewrite slug is `/projects/`, NOT `/portfolio/`. The theme must remain generic; `/portfolio/` is intentionally not used.
- **Chronological / Year Source of Truth**: The taxonomy `artupski_project_year` is the **single source of truth** for project year, archive grouping, filtering, and permalink tokens (`/projects/{year}/{slug}/`). There is NO duplicate `_artupski_year` meta key.

#### Canonical Custom Meta Fields Table
| Meta Key | Data Type | REST Schema | Input Control | Purpose / Render Location |
|---|---|---|---|---|
| `_artupski_project_location` | `string` | `string` | Text Input | Project geographic location (e.g. *Jakarta Selatan*, *Tangerang*) |
| `_artupski_project_client` | `string` | `string` | Text Input | Client / commissioning organization (e.g. *PT PLN (Persero)*) |
| `_artupski_project_scope` | `string` | `string` | Text Input | Descriptive contract scope text (e.g. *Civil & Structural*, *Interior Fitout*) |
| `_artupski_subtitle` | `string` | `string` | Text Input | Secondary monograph descriptor |
| `_artupski_architecture_style`| `string` | `string` | Text Input | Engineering style / discipline descriptor |
| `_artupski_area` | `string` | `string` | Text Input | Gross Floor / Site Area (e.g. *14,500 m²*) |
| `_artupski_status` | `string` | `string` | Text Input | Project execution status (e.g. *Completed & Commissioned*) |
| `_artupski_client_testimonial`| `string` | `string` | Textarea | Verification statement / client quote |
| `_artupski_image_gallery` | `array` | `array<integer>` | Text / Media Frame | Ordered list of media attachment IDs used for category carousels & project media |
| `_artupski_structural_specs` | `object` | `object` | Textarea / JSON | Technical structural specifications rendered in IBM Plex Mono annotation style |

#### Gallery Schema (`_artupski_image_gallery`)
- **Storage Type**: Serialized PHP array of unique integer attachment IDs (`array<integer>`).
- **REST API Exposure**:
  ```json
  {
    "type": "array",
    "items": { "type": "integer" }
  }
  ```
- **Sanitization & Normalization**: Strips invalid tokens, runs `absint()`, drops non-positive values, eliminates duplicate IDs via `array_unique()`, and returns standard indexed array (`array_values()`). Accepts comma-delimited input strings in admin edit screens and parses them deterministically into integer arrays.
- **Consumption Contract**: Theme templates call `get_post_meta( $post_id, '_artupski_image_gallery', true )` and receive an array of attachment IDs directly, safe for looping with `wp_get_attachment_image()`.

#### Structural Specs Schema (`_artupski_structural_specs`)
- **Storage Type**: Associative array / JSON object.
- **Standard Supported Keys**:
  - `grid`: Structural column grid (e.g. `8.4m x 8.4m Orthogonal`)
  - `height`: Floor-to-ceiling or total height (e.g. `4.20m Clear Height`)
  - `materials`: Core structural materials (e.g. `Post-tensioned Concrete, Grade 400 Steel`)
  - `engineer`: Principal structural engineer / consultancy
  - `contractor`: Lead general contracting entity
  - `certification`: Building code, seismic, or green certification rating
  - `raw_notes`: Freeform technical annotations
- **REST API Exposure**:
  ```json
  {
    "type": "object",
    "properties": {
      "grid": { "type": "string" },
      "height": { "type": "string" },
      "materials": { "type": "string" },
      "engineer": { "type": "string" },
      "contractor": { "type": "string" },
      "certification": { "type": "string" },
      "raw_notes": { "type": "string" }
    },
    "additionalProperties": false
  }
  ```
- **Sanitization**: Validates JSON string if submitted as raw text; sanitizes each key using `sanitize_key()` and string values using `wp_kses_post()`.

---

## 4. Leadership Team Member (`artupski_team`)
Stores executive profiles, founding engineers, and key personnel.

- **Post Type Slug**: `artupski_team`
- **Labels**: Singular: *Team Member*, Plural: *Leadership & Team*
- **Supports**: `title`, `editor`, `thumbnail`, `excerpt`, `revisions`, `page-attributes`, `custom-fields`
- **Has Archive**: `false`

#### Canonical Custom Meta Fields Table
| Meta Key | Data Type | REST Schema | Input Control | Purpose |
|---|---|---|---|---|
| `_artupski_team_role` | `string` | `string` | Text Input | Official role (e.g. *President Director & Founder*) |
| `_artupski_team_credentials` | `string` | `string` | Text Input | Professional titles (e.g. `Ir.`, `S.T.`, `M.T.`) |
| `_artupski_team_year_joined` | `string` | `string` | Text Input | Tenure annotation (e.g. *Founded firm in 1992*) |
| `_artupski_bio` | `string` | `string` | Textarea | Brief monograph biography |
| `_artupski_social_links` | `string` | `string` | Text Input | Professional / contact profile URL |

---

## 5. Firm Specialization / Service (`artupski_service`)
Stores core commercial disciplines offered by the enterprise.

- **Post Type Slug**: `artupski_service`
- **Labels**: Singular: *Specialization*, Plural: *Services & Specializations*
- **Supports**: `title`, `editor`, `thumbnail`, `excerpt`, `revisions`, `page-attributes`, `custom-fields`
- **Has Archive**: `false`

#### Canonical Custom Meta Fields Table
| Meta Key | Data Type | REST Schema | Input Control | Purpose |
|---|---|---|---|---|
| `_artupski_service_index` | `string` | `string` | Text Input | Monograph index number (e.g. `01`, `02`, `03`) |
| `_artupski_service_icon` | `string` | `string` | SVG / Icon Select | Section icon reference identifier |
| `_artupski_lead` | `string` | `string` | Text Input | Discipline lead / overview statement |
| `_artupski_deliverables` | `string` | `string` | Textarea | Key deliverables & specifications |

---

## 6. Custom Taxonomies Specification

### 6.1 Project Category (`artupski_project_category`) — Primary Taxonomy
- **Taxonomy Slug**: `artupski_project_category`
- **Role**: Primary classification taxonomy for projects.
- **Describes**: Project **categories** (what kind of project it is), NOT implementation disciplines.
- **Associated Post Type**: `artupski_project`
- **Hierarchical**: `true`
- **Default Terms**: `Construction`, `Engineering`, `Interior`, `Infrastructure`, `Commercial`
- **Rewrite Slug**: `project-category`

### 6.2 Record Year (`artupski_project_year`)
- **Taxonomy Slug**: `artupski_project_year`
- **Role**: Chronological classification and permalink token provider (`/projects/%artupski_project_year%/%postname%/`).
- **Associated Post Type**: `artupski_project`
- **Hierarchical**: `false`
- **Rewrite Slug**: `project-year`
- **Default Terms**: `2024`, `2023`, `2022`, `2021`, `2020`, `2019`, `2018`, `2017`, `2016`, `2015`, `2014`, `2013`, `2012`, `2011`, `2010`, `2009`, `2008`, `2007`, `2006`, `2005`, `2004`, `2003`

---

## 7. Rewrite Behavior & Live Verification Note

The permalink structure for projects is:
```text
/projects/{artupski_project_year}/{post_name}/
```

- Rewrite tag `%artupski_project_year%` is matched via `add_rewrite_tag()` and rewritten via `add_rewrite_rule( '^projects/([^/]+)/([^/]+)/?$', 'index.php?artupski_project=$matches[2]', 'top' )`.
- Permalinks filter `post_type_link` substitutes the associated term slug from `artupski_project_year` (or defaults to `unassigned` if no term is bound).
- **Runtime Verification Note**: Static analysis verifies correct regular expressions, tag declarations, and non-destructive filter hooks. End-to-end HTTP request resolution for `/projects/{year}/{slug}/` requires live WordPress runtime verification once an active WP test server environment is spun up in Phase 4.

---

## 8. Sample 45-Project Historical Schema Matrix

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
