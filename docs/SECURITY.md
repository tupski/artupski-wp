# Security Architecture & Hardening: Artupski WordPress Theme

## 1. Overview & Security Posture

Artupski adheres to strict **WordPress Core Security Standards**, OWASP Top 10 guidelines, and zero-trust data validation principles. As a corporate theme handling public client portfolios and contact communications, it incorporates defensive programming across template rendering, database queries, and dynamic JavaScript execution.

---

## 2. Core Security Pillars

### 2.1 Context-Aware Output Escaping
No database value, option string, or query parameter is echoed raw to the DOM. Output escaping is strictly mandatory and matched to the HTML context:

| Context | Escaping Function | Usage in Artupski |
|---|---|---|
| Plain HTML text / tags | `esc_html()` | Project titles, client names, year numbers, phone labels |
| HTML attributes | `esc_attr()` | `data-nav-link`, `data-carousel-group`, `data-index`, `id`, `class` |
| Image & hyperlink URLs | `esc_url()` | Logo source, hero image URL, anchor `href` attributes |
| Safe rich HTML | `wp_kses_post()` | Rich editorial descriptions, biographies, lede formatting |
| Embedded JavaScript | `wp_json_encode()` | Localized settings passed to Turbo or Customizer preview |

```php
<!-- Example: Secure Escaped Component Output -->
<div class="fact" data-group="<?php echo esc_attr( $args['group'] ); ?>">
    <span class="fact__num"><?php echo esc_html( $args['number'] ); ?></span>
    <span class="fact__label"><?php echo esc_html( $args['label'] ); ?></span>
    <div class="fact__note"><?php echo wp_kses_post( $args['note'] ); ?></div>
</div>
```

---

### 2.2 Input Sanitization & Data Validation
All inputs originating from `$_POST`, `$_GET`, or REST endpoints pass through type-specific sanitization:
- Text inputs sanitized via `sanitize_text_field()`.
- Textarea descriptions sanitized via `sanitize_textarea_field()` or `wp_kses_post()`.
- Numeric identifiers cast strictly via `absint()` or `intval()`.
- File uploads restricted strictly to authorized MIME types (`image/jpeg`, `image/png`, `image/webp`).

---

### 2.3 Nonce Verification & Capability Checks
All state-modifying actions (customizer updates, meta box saving, demo importing) require valid WordPress nonces and capability assertions:

```php
public function save_project_meta( $post_id ) {
    // 1. Verify Nonce
    if ( ! isset( $_POST['rt_project_nonce'] ) || ! wp_verify_nonce( $_POST['rt_project_nonce'], 'rt_save_project_data' ) ) {
        return;
    }

    // 2. Prevent Autosave overwrite
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    // 3. Check User Authorization Capability
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    // 4. Sanitize and save fields
    if ( isset( $_POST['rt_project_location'] ) ) {
        update_post_meta( $post_id, '_rt_project_location', sanitize_text_field( wp_unslash( $_POST['rt_project_location'] ) ) );
    }
}
```

---

## 3. Client-Side Security & Turbo Drive Hardening

### 3.1 DOM-Based Cross-Site Scripting (XSS) Prevention
In `assets/js/site.js`, dynamic DOM updates avoid unsafe `innerHTML` assignments when handling untrusted user input:
- Image lightbox captions and metadata use `textContent` where applicable, or sanitize HTML attributes before attaching to the modal.
- Document-level delegated click handlers check `e.target.closest()` defensively and do not execute raw `eval()` or unvalidated function invocations.

### 3.2 Content Security Policy (CSP) Compatibility
The theme operates cleanly under strict CSP rules:
- Zero inline JavaScript execution in templates (all logic compiled into versioned `assets/js/site.js`).
- Scripts loaded via `<script type="module">` or standard deferred tags.
- Dynamic Customizer styles utilize native `wp_add_inline_style()` attached to registered style handles.

### 3.3 Silent Deterrent Listeners
`site.js` includes silent event deterrence:
```javascript
/* Deterrent only, never considered absolute security */
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
document.addEventListener("dragstart", (e) => {
  if (e.target && e.target.tagName === "IMG") e.preventDefault();
});
```
*Architecture Note*: The documentation explicitly records that client-side deterrence is for brand asset protection against accidental dragging, not a substitute for copyright watermarking or server-side media access controls.

---

## 4. File System & Direct Execution Hardening

Every PHP file in the theme and companion plugin begins with the mandatory direct-access guard:

```php
<?php
// Prevent direct script execution
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

Directory listing is blocked by including empty `index.php` files in all subdirectories (`inc/`, `template-parts/`, `assets/`).
