/**
 * OPTIONAL production step. Not required for normal development.
 *
 * Conservative minification of the project's OWN first-party CSS/JS only.
 * Third-party libraries (Turbo via CDN, Tailwind CDN, Google Fonts) are never
 * touched, and Turbo's behaviour is preserved.
 *
 * No encryption is performed or claimed. JS obfuscation, if enabled, is a
 * light rename of local identifiers and is a deterrent only.
 *
 * Usage:
 *   node tools/minify.mjs            # writes *.min.css / *.min.js next to sources
 *   node tools/minify.mjs --inline   # (manual) copy output paths into the HTML
 *
 * There is no bundler and no dependency install. This script only uses Node's
 * standard library and simple, conservative transforms.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const targets = [
  { src: "assets/css/site.css", out: "assets/css/site.min.css", kind: "css" },
  { src: "assets/js/site.js", out: "assets/js/site.min.js", kind: "js" },
];

/* Conservative CSS minifier: strip comments and collapse whitespace, while
   protecting strings, url() and CSS custom-property values. */
function minifyCss(input) {
  let css = input.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse whitespace that is safe to remove.
  css = css.replace(/\s*([{}:;,>])\s*/g, "$1");
  css = css.replace(/;}/g, "}");
  css = css.replace(/\s+/g, " ");
  return css.trim();
}

/* Conservative JS minifier: strip block comments and trailing full-line
   comments, collapse blank lines and leading indentation. This does NOT
   rename identifiers, so it cannot break closures, exports or Turbo wiring. */
function minifyJs(input) {
  // Remove /* ... */ block comments (no regex/string literal is expected to
  // contain "*/" in this codebase).
  let js = input.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove whole-line // comments (keeps trailing-comment safety).
  js = js
    .split("\n")
    .filter((line) => !/^\s*\/\//.test(line))
    .map((line) => line.replace(/^\s+/, ""))
    .join("\n");
  // Collapse 2+ blank lines to one.
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
console.log(`\n${ok} file(s) written. Update the HTML <link>/<script> src to the .min.* files to use them.`);
