# Gutenberg Block System Specification: Artupski WordPress Theme

## 1. Overview & Strategy

Artupski leverages core WordPress Block Editor capabilities without relying on heavy third-party block plugins (like Elementor or ACF Pro Blocks).

**Gutenberg is the primary authoring experience.** The Classic Editor is a compatibility/fallback experience (see [`CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1)). The architecture is:

```text
Gutenberg
    ↓
Primary authoring experience

Classic Editor
    ↓
Compatibility / fallback experience
```

Gutenberg should use:
- **native blocks** (`core/group`, `core/columns`, `core/heading`, `core/paragraph`, `core/image`, …)
- **block patterns** for composed layouts
- **template parts** for reusable structural regions
- **`theme.json`** for design tokens

> **Full Site Editing (FSE) is OUT OF SCOPE for v1.** v1 is NOT a full block/FSE theme. Block templates/template parts are kept **only** where they support the planned architecture without turning the project into FSE; classic PHP templates remain the rendering backbone. Do not add a full block-theme structure (`templates/`, `parts/`) that would make the project FSE.

Strategy:
- Standard Core Blocks are styled to match the Dossier Design System via custom Block Styles and `theme.json`.
- Complex layouts from the static audit (Drafting Hero, Editorial Split, Facts Bar, Numbered Index Sections, Categorized Gallery Carousels) are delivered as native **Block Patterns**.
- Patterns are **generic templates**: they provide structure and styling. Demo content (e.g. Contractor, Demo #1) fills them via the demo importer. Patterns must not encode demo-specific logic — the sample copy shown below is illustrative of how the demo populates a pattern, not a theme dependency.
- Shortcodes are NOT a mirrored twin of every pattern. See [`CLASSIC_EDITOR.md`](docs/CLASSIC_EDITOR.md:1) for the (deliberately small) set of shortcodes that provide genuine value.

---

## 2. Block Patterns Catalog

Block patterns are registered under the category `artupski-dossier` in `inc/class-gutenberg.php`.

### 2.1 Hero: Monograph Drafting (`artupski/hero-drafting`)
- **Structure**: Core Cover / Group with relative positioning, media background (`assets/images/hero-drafting.jpg`), dark scrim overlay (`rgba(22, 24, 28, 0.65)`), two-column grid.
- **Left Column**: Eyebrow (`EST. 1992 · Jakarta · Indonesia`), Main H1 Serif (`PT. CONTRACTOR`), Tagline (`Forward, Distinct, Reliable.`).
- **Right Column**: Technical firm description, text link with chevron icon, visual scroll cue.
- **Pattern Markup Definition**:
```html
<!-- wp:group {"tagName":"section","className":"hero","layout":{"type":"default"}} -->
<section class="wp-block-group hero">
    <div class="hero__media">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"hero__img"} -->
        <figure class="wp-block-image hero__img"><img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero-drafting.jpg' ); ?>" alt="Technical drafting by hand"/></figure>
        <!-- /wp:image -->
    </div>
    <div class="hero__scrim" aria-hidden="true"></div>
    <div class="shell hero__inner">
        <div class="hero__grid">
            <div data-reveal>
                <p class="eyebrow">EST. 1992 &middot; Jakarta &middot; Indonesia</p>
                <h1>PT. CONTRACTOR</h1>
                <p class="hero__tagline">Forward, Distinct, Reliable.</p>
            </div>
            <div class="hero__aside" data-reveal style="--reveal-delay:120ms">
                <p>An Indonesian construction, engineering and interior firm building for government, state electricity, plantation, industrial and property clients since 1992.</p>
                <a class="tlink" href="/about-us/">Read our story</a>
            </div>
        </div>
    </div>
</section>
<!-- /wp:group -->
```

### 2.2 Section Header (`artupski/section-header`)
- **Structure**: Numbered metadata badge (`01 / Overview`), serif section title, right-aligned date/scope annotation.
```html
<!-- wp:group {"className":"section-title-row","layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group section-title-row" data-reveal>
    <div class="section-head">
        <span class="sec-num">01 / Overview</span>
        <h2>Project experience at a glance.</h2>
    </div>
    <p class="meta">2003 to 2024</p>
</div>
<!-- /wp:group -->
```

### 2.3 Fact Metric Bar (`artupski/facts-bar`)
- **Structure**: 3-column responsive grid container displaying oversized numbers (`45`, `21`, `30+`), tracking labels, and descriptive footnotes.
```html
<!-- wp:group {"className":"facts","layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-group facts" data-reveal>
    <div class="fact">
        <span class="fact__num" data-reveal>45</span>
        <span class="fact__label">Listed projects</span>
        <p class="fact__note">Unique projects recorded in the history below, after removing repeated entries.</p>
    </div>
    <div class="fact">
        <span class="fact__num" data-reveal>21</span>
        <span class="fact__label">Years on record</span>
        <p class="fact__note">Continuous contracting history spanning two decades of Indonesian infrastructure.</p>
    </div>
    <div class="fact">
        <span class="fact__num" data-reveal>30+</span>
        <span class="fact__label">Years in business</span>
        <p class="fact__note">Established in Jakarta in 1992 and still family-led today.</p>
    </div>
</div>
<!-- /wp:group -->
```

### 2.4 Editorial Split (`artupski/editorial-split`)
- **Structure**: Asymmetric two-column split (`320px` left sticky sidebar, flexible right reading column).
```html
<!-- wp:group {"className":"editorial"} -->
<div class="wp-block-group editorial">
    <div class="editorial__label" data-reveal>
        <span class="sec-num">01 / Company</span>
        <h2 class="visually-hidden">Company overview</h2>
        <p class="meta">Who we are</p>
    </div>
    <div class="editorial__body flow" data-reveal>
        <p class="lede">Our firm delivers general procurement construction alongside engineering and interior services.</p>
        <p>Our company is supported by reliable, professional human resources, so we handle every engagement carefully and always prioritize client satisfaction.</p>
    </div>
</div>
<!-- /wp:group -->
```

### 2.5 Categorized Project Carousel (`artupski/project-carousel`)
- **Structure**: Accessible track container with `data-carousel` attribute, slide list, previous/next controls, dot indicators, and thumbnail strip.

---

## 3. Core Block Styles & Extensions

Artupski registers custom block style variations via `register_block_style()`:

| Target Core Block | Style Slug | Label | Visual Effect |
|---|---|---|---|
| `core/group` | `ink-band` | Ink Band | Renders background as `--ink` (`#16181C`), white text, `--rule-dark` hairline rules, crimson-lt accents |
| `core/group` | `paper-boxed`| Dossier Box | Adds `1px solid var(--rule)` border, background `--paper`, padding `2rem` |
| `core/heading`| `sec-num` | Numbered Label | Transforms text into uppercase IBM Plex Mono `0.75rem` tracked badge with crimson rule |
| `core/paragraph`| `lede` | Editorial Lede | Enlarges font to `clamp(1.15rem, 2.2vw, 1.4rem)` with serif styling and balanced wrap |
| `core/paragraph`| `mono-meta` | Monospace Meta| Formats text in IBM Plex Mono `0.8125rem` muted grey |
| `core/button` | `tlink` | Dossier Link | Strips button box, styles as underlined technical link with trailing arrow icon |

---

## 4. `theme.json` Configuration Spec

Artupski integrates WordPress Block Editor theming through [`theme.json`](theme.json:1) schema v2:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        { "slug": "ink", "color": "#16181C", "name": "Ink Primary" },
        { "slug": "paper", "color": "#F4F0E6", "name": "Paper Ground" },
        { "slug": "crimson", "color": "#C8102E", "name": "Crimson Accent" },
        { "slug": "crimson-lt", "color": "#E8798A", "name": "Crimson Light (Ink Bands)" },
        { "slug": "ink-soft", "color": "#3A3D42", "name": "Ink Soft Body" },
        { "slug": "muted", "color": "#6E6A61", "name": "Muted Annotation" },
        { "slug": "rule", "color": "#DAD4C6", "name": "Hairline Rule" }
      ],
      "custom": false
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "\"Newsreader\", Georgia, serif",
          "slug": "serif",
          "name": "Newsreader (Display Serif)"
        },
        {
          "fontFamily": "\"Manrope\", -apple-system, BlinkMacSystemFont, sans-serif",
          "slug": "sans",
          "name": "Manrope (Grotesque Body)"
        },
        {
          "fontFamily": "\"IBM Plex Mono\", monospace",
          "slug": "mono",
          "name": "IBM Plex Mono (Annotation)"
        }
      ]
    },
    "layout": {
      "contentSize": "1280px",
      "wideSize": "1440px"
    }
  }
}
```

---

## 5. Template Parts & Block Templates

**Full Site Editing (FSE) is OUT OF SCOPE for v1.** Artupski is Gutenberg-primary for authoring but renders through classic PHP templates; it is not a full block/FSE theme. Where a region is reused across multiple templates, Artupski prefers:
- **Template Parts** (classic PHP `template-parts/`) for regions the theme renders on every request.
- Block template parts / block templates are **not** added in v1. They may be revisited in a future version, but only if they support the planned architecture without turning the project into FSE.

This keeps the theme usable on classic-theme installs while remaining block-first for authoring.

---

## 6. Editor Styling & Sandboxed Parity

To prevent Gutenberg admin UI conflicts while preserving 100% typography fidelity inside the canvas:
- `assets/css/editor-style.css` scopes all typography and layout rules inside `.editor-styles-wrapper`.
- Editor canvas background is forced to `#F4F0E6`.
- Headings display in Newsreader serif; body renders in Manrope; metadata and code blocks render in IBM Plex Mono.
