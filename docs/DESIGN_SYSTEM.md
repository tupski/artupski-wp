# Design System & Token Specification: Artupski WordPress Theme

## 1. Concept & Visual Identity: "Contractor Dossier"

Artupski embodies an **editorial engineering monograph / technical dossier**. Its visual voice conveys credibility forged through blueprints, engineering specifications, site paperwork, and three decades of physical construction craft since 1992.

Key visual attributes:
- **Ground**: Warm paper ground (`#F4F0E6`) evokes heavy architectural stock rather than a generic digital display.
- **Ink**: Near-black (`#16181C`) anchors text with the presence of letterpress ink.
- **Restrained Accent**: Heritage crimson (`#C8102E`) used strictly for hairlines, eyebrows, and active indicators; never as broad background fills.
- **Rhythm & Structure**: Structural definition is created through hairline rules (`--rule`) and numbered section indices (`01 / Overview`), rejecting floating card drop-shadows and glassmorphism.

---

## 2. Design Tokens (`:root` CSS Custom Properties)

Audited directly from `assets/css/site.css`:

### 2.1 Color Tokens & Contrast Ratios
```css
:root {
  /* Core Ground & Text */
  --ink: #16181c;          /* Primary text, ink bands, deep contrast */
  --paper: #f4f0e6;        /* Signature warm bone/paper background */
  --ink-soft: #3a3d42;     /* Secondary long copy text */
  --muted: #6e6a61;        /* Metadata labels & technical annotations */
  
  /* Brand Accent Tokens */
  --crimson: #c8102e;      /* Accent: eyebrows, rules, focus rings, hover */
  --crimson-lt: #e8798a;   /* Light accent for ink bands only (AA on #16181C) */
  
  /* Structural Hairlines */
  --rule: #dad4c6;         /* Hairline dividers on paper */
  --rule-dark: rgba(255, 255, 255, 0.16); /* Hairlines on dark ink bands */
  
  /* Transparent Tints */
  --paper-dim: rgba(244, 240, 230, 0.74);
  --ink-dim: rgba(22, 24, 28, 0.62);
}
```

#### Contrast Verification Matrix (WCAG 2.1 AA)
| Foreground Token | Background Token | Calculated Ratio | WCAG AA Status | Role / Usage |
|---|---|---|---|---|
| `--ink` (`#16181C`) | `--paper` (`#F4F0E6`) | **14.81:1** | Pass (AAA) | Standard body text & headings on paper |
| `--ink-soft` (`#3A3D42`)| `--paper` (`#F4F0E6`) | **9.12:1** | Pass (AAA) | Secondary descriptions & lede paragraphs |
| `--muted` (`#6E6A61`) | `--paper` (`#F4F0E6`) | **4.73:1** | Pass (AA) | Small uppercase metadata annotations |
| `--crimson` (`#C8102E`)| `--paper` (`#F4F0E6`) | **4.98:1** | Pass (AA) | Interactive links, eyebrows, active numbers |
| `--paper` (`#F4F0E6`) | `--ink` (`#16181C`) | **14.81:1** | Pass (AAA) | Light text on dark ink bands |
| `--crimson-lt` (`#E8798A`)| `--ink` (`#16181C`)| **5.20:1** | Pass (AA) | Small accent links on dark ink bands |

*Note: `--crimson-lt` fails AA against `--paper` and is strictly forbidden on light grounds.*

---

### 2.2 Typography System

Artupski pairs an authoritative editorial serif with a crisp technical grotesque and a blueprint monospace:

```css
:root {
  --serif: "Newsreader", Georgia, "Times New Roman", serif;
  --sans: "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

#### Typography Scale & Application
- **Hero Title**: `clamp(2.8rem, 8vw, 6rem)` / `1.02` line-height / serif / letter-spacing `-0.02em`
- **Page Title (`h1`)**: `clamp(2.2rem, 6vw, 4.2rem)` / `1.04` line-height / serif
- **Section Heading (`h2`)**: `clamp(1.8rem, 4vw, 3rem)` / `1.08` line-height / serif
- **Subheading (`h3`)**: `clamp(1.25rem, 2.5vw, 1.75rem)` / `1.15` line-height / serif
- **Editorial Lede**: `clamp(1.15rem, 2.2vw, 1.4rem)` / `1.55` line-height / serif / text-wrap balance
- **Body Copy**: `1.0625rem` (`17px`) / `1.7` line-height / sans-serif (`Manrope`)
- **Nav Links**: `0.8125rem` / uppercase / tracking `0.08em` / sans-serif
- **Section Numbers (`.sec-num`)**: `0.75rem` / uppercase / tracking `0.1em` / monospace (`IBM Plex Mono`)
- **Metadata Annotation (`.meta`)**: `0.8125rem` / monospace / color `--muted`

---

### 2.3 Layout & Spatial Units
```css
:root {
  --maxw: 1280px;                                 /* Maximum shell content container width */
  --gutter: clamp(1.25rem, 5vw, 4rem);           /* Responsive horizontal padding */
  --section: clamp(4.5rem, 10vw, 9rem);          /* Fluid vertical section separation */
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);     /* Natural deceleration curve */
  --shadow-lift: 0 18px 40px -24px rgba(22, 24, 28, 0.45); /* Subtle elevation */
}
```

---

## 3. UI Component Patterns

### 3.1 Dossier Eyebrow & Numbered Section Header
A numbered badge (`01 / Overview`) rendered in monospace font paired with a red underline or crimson accent dot:
```html
<div class="section-title-row" data-reveal>
  <div class="section-head">
    <span class="sec-num">01 / Specialization</span>
    <h2>Core engineering disciplines.</h2>
  </div>
  <p class="meta">Architectural · Structural · MEP</p>
</div>
```

### 3.2 Technical Fact Cards (`.facts` & `.fact`)
Large numeric callout positioned above an uppercase label and descriptive note:
```html
<div class="fact">
  <span class="fact__num" data-reveal>30+</span>
  <span class="fact__label">Years in business</span>
  <p class="fact__note">Established in Jakarta in 1992 and still family-led today.</p>
</div>
```

### 3.3 Full-Bleed Ink Band (`.ink-band`)
A contrast section flipping the background to `--ink` with white typography, `--rule-dark` dividers, and `--crimson-lt` accent text:
```html
<section class="section section--dark ink-band">
  <div class="shell">
    <span class="giant-year" aria-hidden="true">1992</span>
    <div class="content">
      <p class="eyebrow on-ink">Our Heritage</p>
      <h2>Over three decades of precision contracting.</h2>
    </div>
  </div>
</section>
```

---

## 4. Motion Guidelines & Accessibility

- **Motion Philosophy**: Subtle, editorial, non-distracting (ENERGY 2 / RHYTHM 3 / MOTION 2).
- **Scroll Reveal**: Subtle `opacity` fade and `20px` vertical rise using native `IntersectionObserver` via `[data-reveal]`.
- **`prefers-reduced-motion` Enforcement**: When active, all reveal transforms and transitions are completely zeroed out:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```
- **Focus Rings**: Never removed. Strict `outline: 2px solid var(--crimson); outline-offset: 3px;` across all buttons and inputs.
