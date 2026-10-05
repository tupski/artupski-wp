import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const h = await readFile("portfolio.html", "utf8");
const items = (h.match(/history__item"/g) || []).length;
const years = [...h.matchAll(/history__year-num">(\d{4})</g)].map((m) => Number(m[1]));
const counts = [...h.matchAll(/history__count">(\d+) project/g)].map((m) => Number(m[1]));
const imgRefs = [...h.matchAll(/src="(assets\/images\/[^"]+)"/g)].map((m) => m[1]);
const fullRefs = [...h.matchAll(/data-full="(assets\/images\/[^"]+)"/g)].map((m) => m[1]);

console.log("history items:", items);
console.log("years:", years.join(", "));
console.log("per-year counts:", counts.join(", "), "sum =", counts.reduce((a, b) => a + b, 0));
console.log("distinct years:", new Set(years).size);
console.log("span:", Math.min(...years), "-", Math.max(...years), "=", Math.max(...years) - Math.min(...years) + 1, "years");

const all = [...new Set([...imgRefs, ...fullRefs])].sort();
console.log("images referenced:", all.length);
let missing = 0;
for (const p of all) {
  const ok = existsSync(p);
  if (!ok) missing++;
  console.log("  ", ok ? "OK  " : "MISS", p);
}
console.log(missing === 0 ? "ALL IMAGE PATHS RESOLVE" : missing + " MISSING IMAGES");

// duplicate name check
const names = [...h.matchAll(/history__name">([\s\S]*?)<\/p>/g)].map((m) =>
  m[1].replace(/&/g, "&").replace(/&ndash;/g, "-").trim()
);
const seen = new Map();
for (const n of names) seen.set(n, (seen.get(n) || 0) + 1);
const dupes = [...seen.entries()].filter(([, c]) => c > 1);
console.log("exact duplicate names:", dupes.length ? JSON.stringify(dupes) : "none");
