# Classic Editor Support Specification: Artupski WordPress Theme

## 1. Overview & Backward Compatibility Philosophy

**Gutenberg is the primary authoring experience.** The Classic Editor is a **compatibility / fallback experience**, not a parallel content system.

```text
Gutenberg    →  Primary authoring experience
Classic Editor  →  Compatibility / fallback experience
```

Artupski's Classic Editor support is deliberately scoped:
- **Standard WordPress content must render correctly.** Core formatting (`the_content()`), headings, lists, images, blockquotes, and tables all render properly under the Dossier design system.
- The TinyMCE WYSIWYG editor is loaded with a small set of custom typography formats and an inline live stylesheet matching the front-end Dossier design system, so classic content visually matches.
- **Shortcodes are provided only where they provide genuine value or satisfy a legacy/compatibility requirement.** Artupski does NOT create a shortcode equivalent for every Gutenberg pattern merely for architectural symmetry, and does NOT maintain two content systems that must be synchronized forever.
- Standard WordPress formatting filters (`wpautop`, `wp_kses_post`) are handled cleanly with zero unwanted paragraph tag injections around structural wrappers.

> **Rationale:** duplicating every block pattern as a shortcode creates permanent maintenance debt and a second content system. The primary path is Gutenberg; classic users get correct rendering plus a small, high-value set of helpers.

---

## 2. TinyMCE Custom Formats & Toolbar Controls

In `inc/class-classic-editor.php`, the theme hooks into `tiny_mce_before_init` to supply custom styles dropdown items matching the design tokens:

```php
/**
 * Register custom style formats for TinyMCE
 */
public function add_tinymce_styles( $settings ) {
    $style_formats = array(
        array(
            'title'    => __( 'Dossier Eyebrow', 'artupski' ),
            'selector' => 'p',
            'classes'  => 'eyebrow',
        ),
        array(
            'title'    => __( 'Editorial Lede', 'artupski' ),
            'selector' => 'p',
            'classes'  => 'lede',
        ),
        array(
            'title'    => __( 'Monospace Metadata', 'artupski' ),
            'inline'   => 'span',
            'classes'  => 'meta',
        ),
        array(
            'title'    => __( 'Technical Arrow Link', 'artupski' ),
            'selector' => 'a',
            'classes'  => 'tlink',
        ),
        array(
            'title'    => __( 'Ink Background Band', 'artupski' ),
            'block'    => 'div',
            'classes'  => 'ink-band',
            'wrapper'  => true,
        ),
        array(
            'title'    => __( 'Boxed Rule Container', 'artupski' ),
            'block'    => 'div',
            'classes'  => 'editorial-box',
            'wrapper'  => true,
        ),
    );

    $settings['style_formats'] = wp_json_encode( $style_formats );
    return $settings;
}
add_filter( 'tiny_mce_before_init', array( $this, 'add_tinymce_styles' ) );
```

---

## 3. Shortcode Architecture & Scope

### 3.1 Scope Rule

A shortcode is only added when it meets at least one of these criteria:
1. It renders **dynamic data** that plain HTML cannot express (e.g. a query-driven carousel of media attachments).
2. It satisfies a **legacy/compatibility requirement** (existing content, client constraints).
3. It provides **genuine value** that outweighs its maintenance cost.

There is intentionally **no 1:1 shortcode for each block pattern**. Static patterns (hero, section header, editorial split, facts bar) are authored in Gutenberg; classic users can recreate equivalent structure with standard HTML + the CSS utility classes already provided (`.section-title-row`, `.facts`, `.fact`, `.ink-band`, `.editorial`, …), or use the small number of shortcodes below.

Shortcodes that ARE justified are thin wrappers over presentation template parts (`template-parts/components/*.php`), so no markup is duplicated.

### 3.2 Justified Shortcodes

| Shortcode | Justification | Backed by |
|---|---|---|
| `[artupski_carousel]` | Renders **dynamic** media-attachment data (query + interaction) that plain HTML cannot express | `template-parts/components/carousel.php` |
| `[artupski_project_list]` | Renders a **dynamic** query of `artupski_project` records with taxonomy filtering | `template-parts/components/project-row.php` |

#### `[artupski_carousel]`
Renders a category-scoped image gallery carousel:
- **Attributes**:
  - `group`: Unique group slug (e.g. `commercial`, `interior`, `industrial`)
  - `ids`: Comma-separated WordPress media attachment IDs
- **Usage Example**:
  ```text
  [artupski_carousel group="interior" ids="101,102,103,104"]
  ```

#### `[artupski_project_list]`
Renders a filtered list of project records (dynamic query):
- **Attributes**:
  - `category`: `artupski_project_category` term slug
  - `year`: `artupski_project_year` term slug
  - `limit`: Maximum number of records
- **Usage Example**:
  ```text
  [artupski_project_list category="interior" limit="10"]
  ```

> Static visual patterns (Section Header, Facts Bar, Editorial Split, Hero, Dossier Cards) do **not** receive shortcodes. They are authored natively in Gutenberg, and the Classic Editor styles the equivalent standard HTML through shared CSS classes.

---

## 4. Shortcode Anti-`wpautop` Filter Hygiene

WordPress classic content filters frequently wrap empty linebreaks with `<p></p>` tags, which can invalidate structural divs. Artupski sanitizes the (small) set of block-level shortcodes via a dedicated cleaning filter:

```php
/**
 * Remove rogue paragraph wrappers around block-level shortcodes
 */
public function clean_shortcode_unautop( $content ) {
    $block_shortcodes = array( 'artupski_carousel', 'artupski_project_list' );
    $pattern = get_shortcode_regex( $block_shortcodes );
    return preg_replace_callback( "/$pattern/s", function( $matches ) {
        return shortcode_unautop( $matches[0] );
    }, $content );
}
add_filter( 'the_content', array( $this, 'clean_shortcode_unautop' ), 1 );
```

---

## 5. Metabox Wiring for Non-Gutenberg Workflows

For post types such as `artupski_project`, `artupski_team`, and `artupski_service`, editors are presented with clean, native WordPress meta boxes. These meta boxes live in the companion plugin (`artupski-core`) and are shown regardless of editor, since they describe **content model** data (not presentation):
- Project Category (`select` from the primary `artupski_project_category` taxonomy)
- Project Year (`select` from the `artupski_project_year` taxonomy)
- Project Scope (single-line descriptive text input — not a taxonomy)
- Project Location (Single line text input)
- Client Name (Single line text input)
- Blueprint / Image Callout Notes (Textarea)
- Gallery Attachments (Standard WP Media uploader frame integration)

All meta box inputs are protected via `wp_nonce_field()`, validated on save via `save_post` hooks, and escaped upon database retrieval.
