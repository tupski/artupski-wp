# Classic Editor Support Specification: Artupski WordPress Theme

## 1. Overview & Backward Compatibility Philosophy

While modern WordPress sites leverage Gutenberg, many enterprise teams, heritage organizations, and long-standing agencies prefer the speed, simplicity, and rock-solid stability of the **Classic Editor (TinyMCE)**.

Artupski guarantees 100% feature parity for Classic Editor users without breaking layouts or introducing bloated shortcode dependency traps:
- Every core section pattern (Section Headers, Fact Bars, Editorial Splits, Carousels, and Dossier Cards) is accessible via lightweight **Native Shortcodes**.
- The TinyMCE WYSIWYG editor is loaded with custom typography formats, color buttons, and an inline live stylesheet matching the front-end Dossier design system.
- Standard WordPress formatting filters (`wpautop`, `wp_kses_post`) are handled cleanly with zero unwanted paragraph tag injections around structural div wrappers.

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

## 3. Shortcode Architecture & Implementation

Shortcodes are designed to wrap or output standard component partials (`template-parts/components/*.php`), ensuring zero code duplication between Block Patterns and Classic content.

### 3.1 `[rt_section_header]`
Outputs the numbered section badge and title row:
- **Attributes**:
  - `number`: (e.g. `01 / Overview`)
  - `title`: (e.g. `Project experience at a glance.`)
  - `meta`: (e.g. `2003 to 2024`)
- **Usage Example**:
  ```text
  [rt_section_header number="01 / Overview" title="Project experience at a glance." meta="2003 to 2024"]
  ```

### 3.2 `[rt_facts]` & `[rt_fact]`
Outputs responsive technical metric cards:
- **Usage Example**:
  ```text
  [rt_facts]
    [rt_fact number="45" label="Listed projects" note="Unique projects recorded in the history below."]
    [rt_fact number="21" label="Years on record" note="Continuous contracting history spanning two decades."]
    [rt_fact number="30+" label="Years in business" note="Established in Jakarta in 1992."]
  [/rt_facts]
  ```

### 3.3 `[rt_editorial_split]`
Creates the asymmetric two-column dossier monograph layout:
- **Usage Example**:
  ```text
  [rt_editorial_split number="01 / Company" meta="Who we are"]
    <p class="lede">PT RAJATUA does various jobs in the field of general procurement construction...</p>
    <p>Our company is supported by human resources who are reliable and professional...</p>
  [/rt_editorial_split]
  ```

### 3.4 `[rt_carousel]`
Renders a category-scoped image gallery carousel:
- **Attributes**:
  - `group`: Unique group slug (e.g. `commercial`, `interior`, `industrial`)
  - `ids`: Comma-separated WordPress media attachment IDs
- **Usage Example**:
  ```text
  [rt_carousel group="interior" ids="101,102,103,104"]
  ```

---

## 4. Shortcode Anti-`wpautop` Filter Hygiene

WordPress classic content filters frequently wrap empty linebreaks with `<p></p>` tags, which can invalidate structural divs. Artupski sanitizes shortcode rendering via a dedicated cleaning filter:

```php
/**
 * Remove rogue paragraph wrappers around block shortcodes
 */
public function clean_shortcode_unautop( $content ) {
    $block_shortcodes = array( 'rt_facts', 'rt_editorial_split', 'rt_carousel', 'rt_section_header' );
    $pattern = get_shortcode_regex( $block_shortcodes );
    return preg_replace_callback( "/$pattern/s", function( $matches ) {
        return shortcode_unautop( $matches[0] );
    }, $content );
}
add_filter( 'the_content', array( $this, 'clean_shortcode_unautop' ), 1 );
```

---

## 5. Metabox Wiring for Non-Gutenberg Workflows

For post types such as `rt_project`, `rt_team`, and `rt_service`, editors working in Classic Editor mode are presented with clean, native WordPress meta boxes located in `edit-form-advanced.php`:
- Project Year (`select` dropdown from registered year taxonomy)
- Scope / Discipline (`checkbox` group: Construction, Engineering, Interior)
- Project Location (Single line text input)
- Client Name (Single line text input)
- Blueprint / Image Callout Notes (Textarea)
- Gallery Attachments (Standard WP Media uploader frame integration)

All meta box inputs are protected via `wp_nonce_field()`, validated on save via `save_post` hooks, and escaped upon database retrieval.
