# Customization System Specification: Artupski WordPress Theme

## 1. Customizer Architecture & Principles

Artupski provides deep visual and structural customization without requiring external page builders. The customization system is presentation-only (owned by the theme) and is built upon three core tenets:
1. **CSS Custom Properties as Source of Truth**: All Customizer controls map directly to native CSS variables defined in `:root` (e.g. `--ink`, `--paper`, `--crimson`, `--rule`).
2. **Instant Live Preview (`postMessage`)**: Changes to color tokens, typography scales, layout widths, and header toggles update in real time in the Customizer preview pane via `assets/js/customizer-preview.js`.
3. **Child Theme & Code Overridability**: Every setting can be pre-filtered using the `artupski_customizer_defaults` filter hook.

---

## 2. Customizer Panels, Sections & Controls

The settings are organized under a top-level Customizer Panel: **Artupski Dossier Theme Settings**.

### 2.1 Section: Color Palette & Dossier Grounds (`artupski_colors`)
| Setting ID | Control Type | Default Value | Description / CSS Variable Target |
|---|---|---|---|
| `artupski_color_paper` | Color Picker | `#F4F0E6` | Base ground background (`--paper`) |
| `artupski_color_ink` | Color Picker | `#16181C` | Primary text & dark ink bands (`--ink`) |
| `artupski_color_crimson` | Color Picker | `#C8102E` | Heritage accent, rules, active hover (`--crimson`) |
| `artupski_color_crimson_lt`| Color Picker | `#E8798A` | Light accent for dark bands only (`--crimson-lt`) |
| `artupski_color_ink_soft` | Color Picker | `#3A3D42` | Secondary copy color (`--ink-soft`) |
| `artupski_color_muted` | Color Picker | `#6E6A61` | Technical annotation labels (`--muted`) |
| `artupski_color_rule` | Color Picker | `#DAD4C6` | Hairline grid structure rules (`--rule`) |

#### Preset Palette Switcher
A dropdown option (`artupski_palette_preset`) allows 1-click theme mood switching:
- **Heritage Dossier (Default)**: `#F4F0E6` (Paper), `#16181C` (Ink), `#C8102E` (Crimson)
- **Monochrome Archive**: `#F5F5F3` (Bone), `#111111` (Charcoal), `#333333` (Slate)
- **Architectural Blueprint**: `#0D1B2A` (Midnight Navy), `#E0E1DD` (Parchment), `#E63946` (Signal Red)
- **Crisp Executive**: `#FFFFFF` (White), `#1B1B1B` (Black), `#A8201A` (Deep Burgundy)

### 2.2 Section: Typography & Sizing (`artupski_typography`)
| Setting ID | Control Type | Default Value | Description |
|---|---|---|---|
| `artupski_font_source` | Radio | `local` | Local Self-Hosted WOFF2 (default, Phase 2) or Google Fonts CDN (opt-in only) |
| `artupski_font_serif` | Text / Select| `Newsreader` | Primary Display Serif font family (`--serif`) |
| `artupski_font_sans` | Text / Select| `Manrope` | Primary Body Grotesque font family (`--sans`) |
| `artupski_font_mono` | Text / Select| `IBM Plex Mono`| Blueprint Annotation Mono family (`--mono`)|
| `artupski_base_font_size`| Range (14-20)| `17` | Body base font size in px (Default `1.0625rem`) |

### 2.3 Section: Header & Navigation (`artupski_header`)
| Setting ID | Control Type | Default Value | Description |
|---|---|---|---|
| `artupski_header_layout` | Select | `standard` | `standard` (Horizontal), `centered` (Editorial Stack), `minimal` |
| `artupski_header_sticky` | Checkbox | `false` | Enable persistent sticky header on scroll |
| `artupski_wordmark_text` | Text | `PT. CONTRACTOR`| Custom text wordmark (used if no logo image uploaded) |
| `artupski_wordmark_accent`| Text | `CONTRACTOR` | Segment of wordmark wrapped in accent color `<span>` |
| `artupski_menu_cta_show` | Checkbox | `false` | Optional quick contact button in navigation |

### 2.4 Section: Layout & Spacing (`artupski_layout`)
| Setting ID | Control Type | Default Value | Description |
|---|---|---|---|
| `artupski_max_width` | Number (px) | `1280` | Container maximum width (`--maxw`) |
| `artupski_gutter_clamp` | Text | `clamp(1.25rem, 5vw, 4rem)` | Fluid horizontal gutters (`--gutter`) |
| `artupski_section_pad` | Text | `clamp(4.5rem, 10vw, 9rem)`| Fluid section vertical padding (`--section`)|

### 2.5 Section: Client-Side Turbo Navigation (`artupski_turbo`)
| Setting ID | Control Type | Default Value | Description |
|---|---|---|---|
| `artupski_turbo_enabled`| Checkbox | `true` | Enable the locally bundled Turbo Drive enhancement. When disabled, normal WordPress navigation is used. |
| `artupski_turbo_cache` | Checkbox | `true` | Enable Turbo client-side cache restoration |
| `artupski_reduced_motion`| Checkbox | `false` | Force reduce-motion across the entire site |

> Turbo is loaded from the **local bundle** (`assets/js/vendor/turbo.js`), never a CDN. It is progressive enhancement only: disabling it, or having JavaScript unavailable, MUST leave normal WordPress multi-page navigation fully functional.

---

## 3. Dynamic CSS Generation & Injection

The theme compiles registered customizer values into an inline CSS block injected into the document `<head>` via `wp_add_inline_style()`:

```php
/**
 * Generate CSS variable overrides based on Customizer settings
 */
public function generate_customizer_css() {
    $paper      = get_theme_mod( 'artupski_color_paper', '#f4f0e6' );
    $ink        = get_theme_mod( 'artupski_color_ink', '#16181c' );
    $crimson    = get_theme_mod( 'artupski_color_crimson', '#c8102e' );
    $crimson_lt = get_theme_mod( 'artupski_color_crimson_lt', '#e8798a' );
    $max_width  = get_theme_mod( 'artupski_max_width', 1280 );

    $css = ":root {
        --paper: {$paper};
        --ink: {$ink};
        --crimson: {$crimson};
        --crimson-lt: {$crimson_lt};
        --maxw: {$max_width}px;
    }";

    return wp_strip_all_tags( $css );
}
```

---

## 4. Live Preview Scripting (`customizer-preview.js`)

Real-time instant rendering is handled without full iframe reload by listening to WordPress Customizer events:

```javascript
(function ($) {
  // Live color token updates
  wp.customize('artupski_color_paper', function (value) {
    value.bind(function (newVal) {
      document.documentElement.style.setProperty('--paper', newVal);
    });
  });

  wp.customize('artupski_color_crimson', function (value) {
    value.bind(function (newVal) {
      document.documentElement.style.setProperty('--crimson', newVal);
    });
  });

  // Live wordmark update
  wp.customize('artupski_wordmark_text', function (value) {
    value.bind(function (newVal) {
      $('.brand .wordmark').text(newVal);
    });
  });
})(jQuery);
```
