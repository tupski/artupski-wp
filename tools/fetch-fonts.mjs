/**
 * Self-host the theme's webfonts (Phase 2 asset pipeline).
 *
 * Downloads the Latin-subset WOFF2 files for Newsreader (variable),
 * Manrope (variable) and IBM Plex Mono (400/500) and generates a single local
 * `assets/css/fonts.css` stylesheet containing the `@font-face` declarations.
 *
 * After this runs there are NO runtime Google Fonts requests: the theme serves
 * the fonts from its own asset directory and enqueues `fonts.css` locally.
 *
 * Output:
 *   wp-content/themes/artupski/assets/fonts/*.woff2
 *   wp-content/themes/artupski/assets/css/fonts.css
 *
 * Usage: node tools/fetch-fonts.mjs
 */
import { writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const THEME = "wp-content/themes/artupski";
const FONT_DIR = `${THEME}/assets/fonts`;
const CSS_OUT = `${THEME}/assets/css/fonts.css`;

/* A modern desktop UA is required for Google Fonts to return WOFF2 (rather than
   legacy TTF/EOT). This is a build-time request only; the runtime makes none. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/* Families to self-host. `css2` mirrors the families previously requested from
   Google Fonts at runtime, minus the Cyrillic/Greek subsets we do not need. */
const FAMILIES = [
  {
    family: "Newsreader",
    css2: "family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600",
    base: "newsreader",
  },
  {
    family: "Manrope",
    css2: "family=Manrope:wght@200..800",
    base: "manrope",
  },
  {
    family: "IBM Plex Mono",
    css2: "family=IBM+Plex+Mono:wght@400;500",
    base: "ibm-plex-mono",
  },
];

/* The `latin` subset carries a trailing note; match it explicitly so we never
   accidentally grab `latin-ext`. */
const LATIN_RANGE =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, " +
  "U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, " +
  "U+2212, U+2215, U+FEFF, U+FFFD";

function parseBlocks(css) {
  const blocks = [];
  const re = /\/\*\s*([^*]+?)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[2];
    const get = (key) => {
      const mm = body.match(new RegExp(`${key}:\\s*([^;]+);`));
      return mm ? mm[1].trim() : "";
    };
    blocks.push({
      subset: m[1].trim(),
      style: get("font-style") || "normal",
      weight: get("font-weight") || "400",
      url: (body.match(/url\(([^)]+)\)/) || [])[1] || "",
      range: get("unicode-range") || LATIN_RANGE,
    });
  }
  return blocks;
}

async function fetchCss(family) {
  const url = `https://fonts.googleapis.com/css2?${family.css2}&display=swap`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    throw new Error(`Google Fonts returned ${res.status} for ${family.family}`);
  }
  return res.text();
}

function latinBlocks(blocks, family) {
  const latin = blocks.filter((b) => b.subset === "latin");
  const chosen = latin.length ? latin : blocks;
  if (!chosen.length) {
    throw new Error(`No @font-face blocks found for ${family.family}`);
  }
  return chosen;
}

/* Collapse the per-subset blocks into one descriptor per style. The families
   are downloaded as variable fonts, so one file covers the full weight range. */
function describe(family, chosen) {
  const byStyle = new Map();
  for (const b of chosen) {
    const current = byStyle.get(b.style) || [];
    current.push(b);
    byStyle.set(b.style, current);
  }
  return [...byStyle.entries()].map(([style, group]) => {
    const weights = [...new Set(group.map((b) => b.weight))];
    return {
      fontFamily: family.family,
      style,
      file: `${family.base}-${style}.woff2`,
      /* Multiple distinct weights in one file => variable range. */
      weight:
        weights.length === 1
          ? weights[0]
          : `${weights[0]} ${weights[weights.length - 1]}`,
      range: group[0].range || LATIN_RANGE,
      url: group[0].url,
    };
  });
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Font download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

if (!existsSync(FONT_DIR)) {
  await mkdir(FONT_DIR, { recursive: true });
}

/* Remove any stale font files so re-running leaves no orphans. */
if (existsSync(FONT_DIR)) {
  for (const entry of await readdir(FONT_DIR)) {
    if (/\.woff2?$/i.test(entry)) await rm(path.join(FONT_DIR, entry));
  }
}

const faces = [];
for (const family of FAMILIES) {
  const css = await fetchCss(family);
  const descs = describe(family, latinBlocks(parseBlocks(css), family));
  for (const desc of descs) {
    const bytes = await download(desc.url, path.join(FONT_DIR, desc.file));
    console.log(
      `downloaded ${desc.file}  ${(bytes / 1024).toFixed(1)} KB  ` +
        `(${desc.style} ${desc.weight})`
    );
    faces.push(desc);
  }
}

const header = `/* ==========================================================================
   Artupski — self-hosted webfonts (Phase 2 asset pipeline)
   GENERATED by tools/fetch-fonts.mjs. Do not edit by hand.
   Newsreader (display serif) + Manrope (technical grotesque) +
   IBM Plex Mono (annotation only). Latin subset, WOFF2, font-display: swap.
   No runtime Google Fonts requests are made anywhere in the theme.
   ========================================================================== */

`;

const body = faces
  .map(
    (f) => `@font-face {
  font-family: "${f.fontFamily}";
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url("../fonts/${f.file}") format("woff2");
  unicode-range: ${f.range};
}`
  )
  .join("\n\n");

await writeFile(CSS_OUT, header + body + "\n", "utf8");
console.log(`\nwrote ${CSS_OUT} (${faces.length} @font-face rules)`);
