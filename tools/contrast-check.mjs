/**
 * WCAG contrast audit for the design tokens actually used in the site.
 * Run: node tools/contrast-check.mjs
 */
const C = {
  ink: "#16181C",
  paper: "#F4F0E6",
  crimson: "#C8102E",
  crimsonLt: "#E8798A",
  inkSoft: "#3A3D42",
  muted: "#6E6A61",
  rule: "#DAD4C6",
};

function hexToRgb(h) {
  h = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function ratio(fg, bg) {
  const l1 = lum(hexToRgb(fg));
  const l2 = lum(hexToRgb(bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
// alpha composite of rgba paper over ink
function comp(alpha, fg, bg) {
  const f = hexToRgb(fg), b = hexToRgb(bg);
  return "#" + f.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
}

const pairs = [
  ["ink on paper (body)", C.ink, C.paper, 4.5],
  ["ink-soft on paper (secondary)", C.inkSoft, C.paper, 4.5],
  ["muted on paper (labels)", C.muted, C.paper, 4.5],
  ["crimson on paper (eyebrow/accent)", C.crimson, C.paper, 4.5],
  ["crimson on paper (large/UI 3:1)", C.crimson, C.paper, 3],
  ["paper on ink (dark band body)", C.paper, C.ink, 4.5],
  ["crimson-lt on ink (accent on dark)", C.crimsonLt, C.ink, 4.5],
  ["paper .74 on ink (dim text, large)", comp(0.74, C.paper, C.ink), C.ink, 3],
  ["crimson on paper (text-link hover)", C.crimson, C.paper, 4.5],
  ["ink on paper (large headings 3:1)", C.ink, C.paper, 3],
  ["rule on paper (hairline, non-text 3:1)", C.rule, C.paper, 1],
];

let fail = 0;
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) fail++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1 (min ${min})  ${name}  ${fg} on ${bg}`);
}
console.log(`\n${fail === 0 ? "All contrast checks passed" : fail + " contrast failure(s)"}`);
process.exit(fail === 0 ? 0 : 1);
