/**
 * Static QA: verifies every local href/src in the HTML resolves to a real file,
 * checks for dead controls (href="#"), and reports asset sizes.
 * Run: node tools/qa-check.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";

const pages = ["index.html", "about-us.html", "portfolio.html", "contact-us.html"];
let problems = 0;

function report(msg, bad = true) {
  console.log((bad ? "FAIL " : "ok   ") + msg);
  if (bad) problems++;
}

for (const page of pages) {
  const html = await readFile(page, "utf8");
  const refs = [
    ...html.matchAll(/(?:href|src)="([^"]+)"/g),
  ].map((m) => m[1]);

  const locals = refs.filter(
    (u) =>
      !u.startsWith("#") &&
      !u.startsWith("http") &&
      !u.startsWith("mailto:") &&
      !u.startsWith("tel:") &&
      !u.startsWith("data:")
  );

  for (const ref of locals) {
    if (!existsSync(ref)) report(`${page}: missing local reference -> ${ref}`);
  }

  // dead controls
  const dead = refs.filter((u) => u === "#" || u.startsWith("javascript:"));
  if (dead.length) report(`${page}: ${dead.length} dead href(s)`);

  // every img has alt
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const img of imgs) {
    if (!/\balt="/.test(img)) report(`${page}: img without alt -> ${img.slice(0, 60)}`);
  }

  // em dashes in UI text
  if (html.includes("—") || html.includes("&mdash;")) report(`${page}: em dash present`);

  report(`${page}: ${locals.length} local refs, ${imgs.length} imgs checked`, false);
}

// asset inventory
const imgs = await readdir("assets/images");
let total = 0;
for (const f of imgs) {
  const s = await stat(`assets/images/${f}`);
  total += s.size;
}
console.log(`\nassets/images: ${imgs.length} files, ${(total / 1024 / 1024).toFixed(2)} MB total`);
console.log(`\n${problems === 0 ? "ALL CHECKS PASSED" : problems + " PROBLEM(S) FOUND"}`);
process.exit(problems === 0 ? 0 : 1);
