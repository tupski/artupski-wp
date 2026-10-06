/**
 * Phase 2 foundation & asset-pipeline verification.
 *
 * Enforces the two approved architectural decisions and the Phase 2 deliverables:
 *
 *   1. `theme.json` is the SINGLE source of design tokens. `style.css`,
 *      `assets/css/site.css` and `assets/css/editor-style.css` must not redefine
 *      raw token values (they consume `var(--wp--preset--*)` instead).
 *   2. Fonts are SELF-HOSTED (WOFF2 + local @font-face). No runtime Google Fonts
 *      or external font/CDN URLs may remain anywhere in the theme.
 *   3. Self-hosted WOFF2 files exist and are referenced by `fonts.css`.
 *   4. Minified builds are in sync with their sources (reproducible build).
 *   5. No Phase 3+ symbols (CPTs, taxonomies, patterns, Customizer, importer).
 *   6. Classic-theme validity: theme header intact, no FSE `templates/`/`parts/`.
 *
 * Usage: node tools/phase2-check.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const THEME = "wp-content/themes/artupski";
let problems = 0;

function report(msg, bad = true) {
  console.log((bad ? "FAIL " : "ok   ") + msg);
  if (bad) problems++;
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/* ------------------------------------------------------------------ */
/* 1. theme.json is the canonical token source                          */
/* ------------------------------------------------------------------ */
const themeJsonPath = `${THEME}/theme.json`;
let themeJson = null;
if (!existsSync(themeJsonPath)) {
  report("theme.json is missing");
} else {
  try {
    themeJson = JSON.parse(readFileSync(themeJsonPath, "utf8"));
    report("theme.json parses as valid JSON", false);
  } catch (e) {
    report(`theme.json is not valid JSON: ${e.message}`);
  }
}

const REQUIRED_PALETTE = {
  ink: "#16181C",
  paper: "#F4F0E6",
  "ink-soft": "#3A3D42",
  muted: "#6E6A61",
  crimson: "#C8102E",
  "crimson-lt": "#E8798A",
  rule: "#DAD4C6",
};

if (themeJson) {
  const palette = (themeJson?.settings?.color?.palette || []).reduce(
    (acc, t) => ({ ...acc, [t.slug]: t.color }),
    {}
  );
  for (const [slug, hex] of Object.entries(REQUIRED_PALETTE)) {
    const actual = (palette[slug] || "").toUpperCase();
    if (actual === hex.toUpperCase()) {
      report(`theme.json palette has ${slug} = ${hex}`, false);
    } else {
      report(`theme.json palette missing/incorrect ${slug} (got "${actual}")`);
    }
  }

  const fams = (themeJson?.settings?.typography?.fontFamilies || []).map(
    (f) => f.slug
  );
  for (const slug of ["serif", "sans", "mono"]) {
    if (fams.includes(slug)) report(`theme.json fontFamilies has ${slug}`, false);
    else report(`theme.json fontFamilies missing ${slug}`);
  }
}

/* No raw token definitions in the other stylesheets. */
const TOKEN_NAMES = [
  "--ink",
  "--paper",
  "--ink-soft",
  "--muted",
  "--crimson",
  "--crimson-lt",
  "--rule",
  "--rule-dark",
  "--paper-dim",
  "--ink-dim",
  "--serif",
  "--sans",
  "--mono",
  "--maxw",
  "--gutter",
  "--section",
  "--ease",
  "--shadow-lift",
];
const HEX_TOKENS = Object.values(REQUIRED_PALETTE).map((h) => h.toLowerCase());

const STYLESHEETS = [
  `${THEME}/style.css`,
  `${THEME}/assets/css/site.css`,
  `${THEME}/assets/css/editor-style.css`,
];

for (const file of STYLESHEETS) {
  if (!existsSync(file)) {
    report(`${file} is missing`);
    continue;
  }
  const css = readFileSync(file, "utf8");

  const redefined = TOKEN_NAMES.filter((t) =>
    new RegExp(`(^|[\\s;{])${t}\\s*:`, "m").test(css)
  );
  if (redefined.length) {
    report(
      `${path.basename(file)} redefines raw token(s): ${redefined.join(", ")}`
    );
  } else {
    report(`${path.basename(file)} defines no raw tokens`, false);
  }

  const hexes = HEX_TOKENS.filter((h) => css.toLowerCase().includes(h));
  if (hexes.length) {
    report(`${path.basename(file)} contains raw token hex(es): ${hexes.join(", ")}`);
  } else {
    report(`${path.basename(file)} contains no raw token hex values`, false);
  }
}

/* site.css / style.css must actually consume the theme.json presets. */
for (const file of [`${THEME}/assets/css/site.css`, `${THEME}/style.css`]) {
  const css = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (/var\(\s*--wp--preset--/.test(css)) {
    report(`${path.basename(file)} consumes var(--wp--preset--*)`, false);
  } else {
    report(`${path.basename(file)} does not consume theme.json presets`);
  }
}

/* ------------------------------------------------------------------ */
/* 2. No runtime Google Fonts / external font / CDN URLs                */
/* ------------------------------------------------------------------ */
const SRC_EXT = /\.(php|css|js|json|html)$/i;
const scanFiles = walk(THEME).filter(
  (f) => SRC_EXT.test(f) && !f.includes(`${path.sep}vendor${path.sep}`)
);

const FORBIDDEN = [
  { re: /fonts\.googleapis\.com/i, label: "Google Fonts API" },
  { re: /fonts\.gstatic\.com/i, label: "Google Fonts static host" },
  { re: /https?:\/\/fonts\./i, label: "external fonts host" },
  { re: /@import\s+url\(\s*['"]?https?:/i, label: "remote @import" },
  { re: /cdn\.tailwindcss\.com/i, label: "Tailwind CDN" },
  { re: /cdnjs\.cloudflare\.com/i, label: "cdnjs CDN" },
  { re: /cdn\.jsdelivr\.net|unpkg\.com/i, label: "JS CDN" },
];

let forbiddenHits = 0;
for (const file of scanFiles) {
  const text = readFileSync(file, "utf8");
  for (const { re, label } of FORBIDDEN) {
    if (re.test(text)) {
      report(`${path.relative(THEME, file)} references ${label}`);
      forbiddenHits++;
    }
  }
}
if (forbiddenHits === 0) {
  report("no runtime Google Fonts / external font / CDN URLs in the theme", false);
}

/* No external preconnect remains in the header (self-hosting removed the need). */
const header = existsSync(`${THEME}/header.php`)
  ? readFileSync(`${THEME}/header.php`, "utf8")
  : "";
if (/rel=["']preconnect["']/i.test(header) && /https?:\/\//i.test(header)) {
  report("header.php still contains an external preconnect hint");
} else {
  report("header.php has no external preconnect hint", false);
}

/* ------------------------------------------------------------------ */
/* 3. Self-hosted WOFF2 present + referenced                            */
/* ------------------------------------------------------------------ */
const fontDir = `${THEME}/assets/fonts`;
const woff2 = existsSync(fontDir)
  ? readdirSync(fontDir).filter((f) => f.endsWith(".woff2"))
  : [];
if (woff2.length >= 3) {
  report(`self-hosted WOFF2 present (${woff2.length} files)`, false);
} else {
  report(`expected >=3 self-hosted WOFF2 files, found ${woff2.length}`);
}

const fontsCssPath = `${THEME}/assets/css/fonts.css`;
if (existsSync(fontsCssPath)) {
  const css = readFileSync(fontsCssPath, "utf8");
  const faces = (css.match(/@font-face/g) || []).length;
  const refs = (css.match(/url\(\s*["']?\.\.\/fonts\/[^"')]+\.woff2/g) || [])
    .length;
  if (faces >= 3 && refs >= 3) {
    report(`fonts.css declares ${faces} @font-face and ${refs} local refs`, false);
  } else {
    report(`fonts.css incomplete (${faces} @font-face, ${refs} local refs)`);
  }
  for (const fam of ["Newsreader", "Manrope", "IBM Plex Mono"]) {
    if (css.includes(`font-family: "${fam}"`)) {
      report(`fonts.css declares ${fam}`, false);
    } else {
      report(`fonts.css missing ${fam}`);
    }
  }
} else {
  report("assets/css/fonts.css is missing");
}

/* class-assets.php must enqueue the local fonts stylesheet. */
const assetsPhp = existsSync(`${THEME}/inc/class-assets.php`)
  ? readFileSync(`${THEME}/inc/class-assets.php`, "utf8")
  : "";
if (/artupski-fonts/.test(assetsPhp) && /assets\/css\/fonts\.css/.test(assetsPhp)) {
  report("class-assets.php enqueues the self-hosted fonts stylesheet", false);
} else {
  report("class-assets.php does not enqueue the self-hosted fonts stylesheet");
}

/* ------------------------------------------------------------------ */
/* 4. Minified builds in sync                                           */
/* ------------------------------------------------------------------ */
function minifyCss(input) {
  let css = input.replace(/\/\*[\s\S]*?\*\//g, "");
  css = css.replace(/\s*([{}:;,>])\s*/g, "$1");
  css = css.replace(/;}/g, "}");
  css = css.replace(/\s+/g, " ");
  return css.trim();
}
function minifyJs(input) {
  let js = input.replace(/\/\*[\s\S]*?\*\//g, "");
  js = js
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .map((line) => line.replace(/^\s+/, ""))
    .join("\n");
  js = js.replace(/\n{2,}/g, "\n");
  return js.trim();
}
const BUILD_PAIRS = [
  { src: `${THEME}/assets/css/site.css`, min: `${THEME}/assets/css/site.min.css`, kind: "css" },
  { src: `${THEME}/assets/css/fonts.css`, min: `${THEME}/assets/css/fonts.min.css`, kind: "css" },
  { src: `${THEME}/assets/js/site.js`, min: `${THEME}/assets/js/site.min.js`, kind: "js" },
];
for (const { src, min, kind } of BUILD_PAIRS) {
  if (!existsSync(src) || !existsSync(min)) {
    report(`build pair missing: ${path.basename(src)} -> ${path.basename(min)}`);
    continue;
  }
  const expected = kind === "css"
    ? minifyCss(readFileSync(src, "utf8"))
    : minifyJs(readFileSync(src, "utf8"));
  const actual = readFileSync(min, "utf8").trim();
  if (expected === actual) {
    report(`${path.basename(min)} is in sync with source`, false);
  } else {
    report(`${path.basename(min)} is OUT OF SYNC (run node tools/build-theme.mjs)`);
  }
}

/* ------------------------------------------------------------------ */
/* 5. Content-model boundary (theme must never own CPT/taxonomy/importer) */
/*                                                                    */
/* NOTE: Gutenberg patterns, shortcodes and the Customizer are Phase 5 */
/* theme-owned presentation concerns and are therefore intentionally   */
/* allowed here; they are enforced by tools/phase5-check.mjs.          */
/* ------------------------------------------------------------------ */
const FORBIDDEN_SYMBOLS = [
  /register_post_type\s*\(/,
  /register_taxonomy\s*\(/,
  /register_nav_menus\s*\([^)]*artupski_project/i,
  /artupski-core/,
  /wp_insert_post\s*\(/,
  /register_setting\s*\(/,
];

/* Strip PHP comments so a docblock that merely *mentions* a future symbol
   (e.g. the companion plugin name) is not mistaken for real functionality. */
function stripPhpComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/^\s*#[^\n]*/gm, "");
}

const phpFiles = walk(THEME).filter((f) => f.endsWith(".php"));
let symbolHits = 0;
for (const file of phpFiles) {
  const text = stripPhpComments(readFileSync(file, "utf8"));
  for (const re of FORBIDDEN_SYMBOLS) {
    if (re.test(text)) {
      report(`${path.relative(THEME, file)} contains Phase 3+ symbol ${re}`);
      symbolHits++;
    }
  }
}
if (symbolHits === 0) {
  report("no content-model boundary violations (CPT/taxonomy/importer)", false);
}

/* ------------------------------------------------------------------ */
/* 6. Classic-theme validity                                            */
/* ------------------------------------------------------------------ */
const styleCss = existsSync(`${THEME}/style.css`)
  ? readFileSync(`${THEME}/style.css`, "utf8")
  : "";
if (/Theme Name:\s*Artupski/.test(styleCss)) {
  report("style.css theme header intact", false);
} else {
  report("style.css theme header missing/invalid");
}
if (/License:\s*GNU General Public License/i.test(styleCss)) {
  report("style.css declares GPL license", false);
} else {
  report("style.css license line missing");
}

for (const fseDir of ["templates", "parts"]) {
  if (existsSync(path.join(THEME, fseDir))) {
    report(`FSE directory "${fseDir}/" present (out of scope for v1)`);
  } else {
    report(`no FSE "${fseDir}/" directory`, false);
  }
}

/* Turbo pinned + local. */
const turbo = `${THEME}/assets/js/vendor/turbo.js`;
if (existsSync(turbo) && /Turbo 8\.0\.12/.test(readFileSync(turbo, "utf8"))) {
  report("local Turbo bundle present and pinned to 8.0.12", false);
} else {
  report("local Turbo 8.0.12 bundle missing");
}
const siteJs = existsSync(`${THEME}/assets/js/site.js`)
  ? readFileSync(`${THEME}/assets/js/site.js`, "utf8")
  : "";
if (/import\(\s*["']\.\/vendor\/turbo\.js["']\s*\)/.test(siteJs)) {
  report("site.js imports the local Turbo bundle", false);
} else {
  report("site.js does not import the local Turbo bundle");
}

console.log(
  `\n${problems === 0 ? "ALL PHASE 2 CHECKS PASSED" : problems + " PHASE 2 PROBLEM(S) FOUND"}`
);
process.exit(problems === 0 ? 0 : 1);
