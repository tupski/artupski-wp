# Website Redesign Proposal (Generic)

An interactive, bilingual, theme-aware single-page proposal prepared by
**Artupski** for a **Contractor** reference client.

It is a static, additive deliverable: HTML, CSS and vanilla JavaScript only. It
lives in `proposal/` and does not touch, copy or modify any existing site file.

## What it is

- One page, thirteen sections: Cover, Executive Summary, Current to Proposed
  Direction, Design Concept, Website Preview, Proposed Structure, Scope of Work,
  Key Features, Project Timeline, Investment, Terms and Conditions, Next Steps,
  Closing.
- **Two languages**: Indonesian (default) and English, switched instantly in the
  browser with no reload.
- **Two themes**: Light and Dark, plus a sensible default that follows the
  visitor's system preference.
- Reuses the site's brand tokens, fonts and local imagery via relative paths
  (`../assets/images/...`). No images were copied or downloaded.
- Interactive: sticky section navigation with active-section highlighting, a top
  scroll-progress bar, restrained scroll reveals, and an Export to PDF button.
- Includes a dedicated `@media print` stylesheet so the page exports as a
  designed A4 document, not a screenshot of a web page.

## How to preview

The project is served statically. With a static server running at the project
root, open:

```
http://localhost:8080/proposal/
```

Any static server works (for example `python -m http.server 8080` run from the
project root). No build step and no dependencies.

## Language system (ID default, EN)

- One HTML structure; a JavaScript translation layer swaps the visible copy.
- Every translatable text node carries a `data-i18n="key"` attribute. Attributes
  such as `aria-label`, `alt` and the meta `content` use
  `data-i18n-attr="attr:key"` (semicolon-separated for multiple attributes).
- The dictionary lives in `proposal.js` as `const translations = { id: {...}, en: {...} }`.
  Both dictionaries share exactly the same keys, so nothing is ever left
  untranslated in either language.
- Default language is **Indonesian**. Switching is instant (no reload) and also
  updates `<html lang>`, `<html data-lang>` and `<title>`.
- The nav holds a real `<button>` pair, **ID** / **EN** (text only, no flags),
  inside a group labelled "Language / Bahasa". The active language is marked with
  `aria-pressed="true"` and a filled state plus a crimson underline, so it is
  identifiable without relying on colour alone.
- With JavaScript disabled the page shows the Indonesian defaults and remains
  fully readable.

## Theme system (Light / Dark)

- CSS-variable driven. The screen palette is defined on `:root`; a
  `[data-theme="dark"]` block deliberately redesigns background, text, muted
  text, borders, buttons, cards, browser preview frames, nav, investment, CTA,
  closing and footer. It is not a naive colour inversion.
- Dark sections ("bands") keep a dedicated light-on-dark palette
  (`--band-*` tokens) so the alternation between plain and banded sections holds
  in both themes.
- The nav holds a compact toggle (sun / moon icon + a text label). It is a real
  `<button>` with `aria-pressed`, a visible focus ring, and a label that reads
  "Terang"/"Light" or "Gelap"/"Dark" so the state is never colour-only.

## Persistence keys

Both keys store non-sensitive values only, under `localStorage`:

| Key                  | Values        | Default                          |
| -------------------- | ------------- | -------------------------------- |
| `proposal-language`  | `id` / `en`   | `id`                             |
| `proposal-theme`     | `light` / `dark` | follows system, else `light`  |

- A tiny **inline script in `<head>`**, placed before the stylesheet and body,
  reads `proposal-theme` (falling back to the system preference) and sets
  `data-theme` on `<html>` immediately, so there is no flash of the wrong theme.
  It also sets an early `lang`/`data-lang` to avoid a visible wrong-language
  flash. `proposal.js` then applies the persisted language on load and syncs the
  switcher states.
- Both preferences are restored on return visits.

## Print / PDF behaviour

- **Print is always light.** The `@media print` block re-declares the light
  palette on `:root` and `html[data-theme="dark"]`, so a visitor using dark mode
  still gets a clean, professional light PDF.
- **Print is language-aware.** The DOM already reflects the selected language, so
  printing outputs whichever language is on screen. The Export button label also
  follows the language (ID "Simpan sebagai PDF" / EN "Export PDF").
- The language and theme switchers, the sticky nav, the progress bar, the skip
  link and all buttons are hidden in print.
- The print stylesheet keeps the A4 layout: page margins, intentional page
  breaks, `break-inside: avoid` on cards/tables, and the band colours.

## What to replace before sending

Every bracketed, crimson-highlighted placeholder is editable, in **both**
languages (search the dictionary in `proposal.js`). In the Indonesian version
the money placeholders use the `Rp XX.XXX.XXX` style; in English the same
`XX.XXX.XXX` placeholders are used. Fill in each one:

- `s10_amount_ph` / `s10_price_ph` / `s10_total_ph` — investment figures
  (`XX.XXX.XXX`)
- `s09_dur` — each of the six timeline phases (`[ X hari kerja ]` /
  `[ X business days ]`)
- `s11_t1_dd`, `s11_t3_dd`, `s11_t11_dd` — payment terms, revision allowance,
  validity
- `s11_t5_ph1`, `s11_t5_ph2`, `s11_t6_ph` — Hosting, Domain and Maintenance
  (`[ Termasuk / Tidak Termasuk ]` / `[ Included / Not Included ]`)

Also confirm, before sending: the date on the cover (currently "Oktober 2026" /
"October 2026"), the "Prepared by" name, and that no figures were invented.

## Notes

- The page is marked `noindex, nofollow`: it is a client-facing proposal, not a
  public page.
- Accessibility: one `h1`, semantic landmarks, visible focus rings, 44px minimum
  tap targets, accessible names and states on every control, and
  `prefers-reduced-motion` support (motion, the reveal animation and the theme
  transition are all disabled when reduced motion is requested). Content is fully
  readable with JavaScript disabled.
