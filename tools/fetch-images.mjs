// One-off asset fetcher: downloads verified Unsplash images into assets/images.
// Run: node tools/fetch-images.mjs
import { mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUT = "assets/images";

// filename -> unsplash photo id + params. Curated architecture/construction/engineering/interior set.
const IMAGES = [
  ["hero-structure.jpg", "photo-1503387762-592deb58ef4e", "w=1920&h=1280&fit=crop&crop=entropy"],
  ["construction-site.jpg", "photo-1504307651254-35680f356dfd", "w=1400&h=1050&fit=crop"],
  ["engineer-review.jpg", "photo-1581094794329-c8112a89af12", "w=1400&h=1050&fit=crop"],
  ["interior-lounge.jpg", "photo-1600585154340-be6161a56a0c", "w=1400&h=1050&fit=crop"],
  ["facade-lines.jpg", "photo-1487958449943-2429e8be8625", "w=1400&h=1750&fit=crop"],
  ["site-crane.jpg", "photo-1541888946425-d81bb19240f5", "w=1400&h=1050&fit=crop"],
  ["building-concrete.jpg", "photo-1486406146926-c627a92ad1ab", "w=1400&h=1050&fit=crop"],
  ["interior-workspace.jpg", "photo-1497366216548-37526070297c", "w=1400&h=1050&fit=crop"],
  ["engineering-detail.jpg", "photo-1590725140246-20acdee442be", "w=1400&h=1750&fit=crop"],
  ["interior-dining.jpg", "photo-1503594384566-461fe158e797", "w=1400&h=1050&fit=crop"],
  ["interior-living.jpg", "photo-1523217582562-09d0def993a6", "w=1400&h=1050&fit=crop"],
  ["steel-frame.jpg", "photo-1565008447742-97f6f38c985c", "w=1400&h=1050&fit=crop"],
  ["office-meeting.jpg", "photo-1454165804606-c3d57bc86b40", "w=1400&h=1050&fit=crop"],
  ["tower-glass.jpg", "photo-1511818966892-d7d671e672a2", "w=1400&h=1750&fit=crop"],
  ["architectural-arches.jpg", "photo-1531834685032-c34bf0d84c77", "w=1400&h=1050&fit=crop"],
  ["site-sunset.jpg", "photo-1479839672679-a46483c0e7c8", "w=1600&h=900&fit=crop"],
  ["atrium.jpg", "photo-1497366811353-6870744d04b2", "w=1400&h=1050&fit=crop"],
  ["blueprint-desk.jpg", "photo-1503389152951-9f343605f61e", "w=1400&h=1050&fit=crop"],
];

const base = (id, params) =>
  `https://images.unsplash.com/${id}?${params}&q=80&fm=jpg&auto=format`;

async function main() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  const results = [];
  for (const [name, id, params] of IMAGES) {
    const url = base(id, params);
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        results.push([name, "HTTP " + res.status]);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) {
        results.push([name, "too small " + buf.length]);
        continue;
      }
      await writeFile(`${OUT}/${name}`, buf);
      results.push([name, "OK " + Math.round(buf.length / 1024) + "kb"]);
    } catch (e) {
      results.push([name, "ERR " + e.message]);
    }
  }
  for (const [n, r] of results) console.log(n.padEnd(28), r);
  const ok = results.filter((r) => r[1].startsWith("OK")).length;
  console.log(`\n${ok}/${results.length} downloaded`);
}

main();
