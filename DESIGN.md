# Contractor - Design Direction

**"CONTRACTOR DOSSIER"** - an editorial heritage dossier for a 30+ year Indonesian construction, engineering and interior firm.

Design Read: *premium corporate / architectural redesign in an editorial heritage dossier language (warm paper ground, ink text, restrained crimson accent, serif display + technical grotesque), dial ENERGY 2 / RHYTHM 3 / MOTION 2.*

---

## Creative concept

An engineering monograph / technical dossier, not a dark-industrial template. Warm paper ground, ink text, hairline rules used as structure, numbered sections (01, 02, 03...) as the repeating identity motif, asymmetric editorial splits, and a varied composition per section.

**Why:** the firm's credibility comes from 1992-onwards craft and paperwork (drawings, cost control, specifications), so the visual language is a dossier: ruled, numbered, measured, restrained.

## Colour system (2 core + 1 accent; no gradients, glow or glassmorphism)

| Token | Value | Role | One-line reason |
|---|---|---|---|
| `--ink` | `#16181C` | Primary text, dark bands | Near-black reads as printed ink and anchors the dossier tone. |
| `--paper` | `#F4F0E6` | Warm bone background | The signature: a warm paper ground replaces plain white and reads as heritage stock, not a screen. |
| `--crimson` | `#C8102E` | Accent: eyebrows, rules, hover, key numbers | A refined step from the original brand red; used sparingly so it stays an accent, never a field. |
| `--ink-soft` | `#3A3D42` | Secondary text | Softens long copy without dropping below AA. |
| `--muted` | `#6E6A61` | Muted labels on paper | A warm grey that reads as annotation, still AA (4.73:1). |
| `--rule` | `#DAD4C6` | Hairlines on paper | Structure through rules, not boxes; the dossier's ruled grid. |
| `--rule-dark` | `rgba(255,255,255,.16)` | Hairlines on ink | Keeps the ruled structure readable on dark bands. |
| `--crimson-lt` | `#E8798A` | Accent on ink only | The one crimson that clears AA on dark; reserved for ink backgrounds (it fails AA on paper, so it is never used there). |

**Contrast:** all text pairs verified at ≥ 4.5:1 (≥ 3:1 for large text). See `tools/contrast-check.mjs`. Note `--crimson-lt` is deliberately ink-only.

## Typography (Google Fonts)

- **Newsreader** - display / headings. An editorial serif that conveys heritage and authority, deliberately not Inter/Geist/Poppins.
- **Manrope** - UI / body. A technical grotesque that pairs as the "engineering" voice against the serif.
- **IBM Plex Mono** - small technical metadata only (section numbers, drawing-callout labels, dates). Justified as blueprint annotation; never used for headings or long text.

**Type scale:** hero `clamp(2.8rem, 8vw, 6rem)`; page title `clamp(2.2rem, 6vw, 4.2rem)`; section h2 `clamp(1.8rem, 4vw, 3rem)`; body `1.0625rem / 1.7`; nav `.8rem` uppercase tracked; caption `.75rem`.

**Why:** the serif/grotesque pairing is the core identity device - heritage voice plus engineering voice - and the mono is rationed to annotation so it never becomes a costume.

## Layout

- Max content width **1280px**; fluid gutters `clamp(1.25rem, 5vw, 4rem)`.
- Spacing on a 4px base with generous section padding `clamp(4.5rem, 10vw, 9rem)`.
- Hairline rules as section separators; one focal point per screen; whitespace used structurally.
- **Varied composition per section** (no repeated centred-title + card-grid): editorial splits, numbered category rows, a full-bleed ink band with an oversized year, a pull-quote motto, an asymmetric gallery, a text-forward contact split.

**Why:** the brief is a redesign, so section rhythm had to change page to page or the page reads as a template.

## Motif

Numbered sections (`01 / Company`, `02 / Specialization`, ...) plus hairline rules as the repeating identity device.

**Why:** a dossier is indexed; numbering gives the pages a shared spine without repeating identical layouts.

## Motion (ENERGY 2 / RHYTHM 3 / MOTION 2)

- Subtle scroll-reveal (fade + 20px rise) and a brief page fade.
- `prefers-reduced-motion: reduce` disables reveal transforms, the page fade and the scroll-cue nudge.

**Why:** motion is a whisper, not a performance; and it must be switchable off.

## Imagery

- Warm, architectural, construction/engineering/interior photography only, downloaded locally into `assets/images/`.
- The projects gallery is an **explicitly labelled concept gallery** (representative imagery, not actual client projects).
- Every image has a truthful `alt` describing what is actually depicted, deliberate `object-position`, fixed `width`/`height`, and `loading="lazy"` below the fold (hero is eager + `fetchpriority="high"`).

**Why:** no original project assets were available, so honesty about provenance is a design requirement, not a footnote.

## Accessibility

- Semantic landmarks, logical heading order, one `h1` per page.
- Visible focus rings (2px crimson, 3px offset) on every interactive element.
- `aria-current="page"` on active nav, set in HTML and recomputed by JS.
- Accessible mobile menu (`aria-expanded`/`aria-controls`, Escape to close) and lightbox (focus trap, Escape/arrow keys, focus return).
- Tap targets ≥ 44px.
