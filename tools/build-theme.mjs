/**
 * Artupski theme build (Phase 1 asset pipeline).
 *
 * Conservative minification of the theme's OWN first-party CSS/JS, producing the
 * build output that `inc/class-assets.php` serves outside of WP_DEBUG:
 *
 *   wp-content/themes/artupski/assets/css/site.css -> site.min.css
 *   wp-content/themes/artupski/assets/js/site.js   -> site.min.js
 *
 * The vendored Turbo bundle (`assets/js/vendor/turbo.js`) is third-party and is
 * NEVER touched. No bundler and no dependency install: Node standard library
 * only, with simple, conservative transforms that cannot break ES module
 * `import`/`export` or Turbo wiring.
 *
 * Usage: node tools/build-theme.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const THEME = "wp-content/themes/artupski";

const targets = [
  { src: `${THEME}/assets/css/site.css`, out: `${THEME}/assets/css/site.min.css`, kind: "css" },
  { src: `${THEME}/assets/js/site.js`, out: `${THEME}/assets/js/site.min.js`, kind: "js" },
];

/* Conservative CSS minifier: strip comments and collapse whitespace, while
   protecting strings, url() and CSS custom-property values. */
function minifyCss(input) {
  let css = input.replace(/\/\*[\s\S]*?\*\//g, "");
  css = css.replace(/\s*([{}:;,>])\s*/g, "$1");
  css = css.replace(/;}/g, "}");
  css = css.replace(/\s+/g, " ");
  return css.trim();
}

/* Conservative JS minifier: strip block comments and whole-line comments,
   collapse blank lines and leading indentation. Does NOT rename identifiers,
   so closures, exports and Turbo wiring are preserved. */
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

let ok = 0;
for (const { src, out, kind } of targets) {
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${src}`);
    continue;
  }
  const raw = await readFile(src, "utf8");
  const before = Buffer.byteLength(raw);
  const result = kind === "css" ? minifyCss(raw) : minifyJs(raw);
  const after = Buffer.byteLength(result);
  await writeFile(out, result, "utf8");
  const pct = ((1 - after / before) * 100).toFixed(1);
  console.log(`${path.basename(out)}  ${before}B -> ${after}B  (-${pct}%)`);
  ok++;
}
console.log(`\n${ok} theme file(s) written.`);
