// Renames downloaded images to truthful, meaningful filenames and removes two
// that are not relevant to construction/engineering/interior.
import { rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";

const DIR = "assets/images";
const RENAMES = [
  ["hero-structure.jpg", "hero-drafting.jpg"],
  ["construction-site.jpg", "construction-rebar-slab.jpg"],
  ["engineer-review.jpg", "development-code.jpg"],
  ["interior-lounge.jpg", "residential-dusk.jpg"],
  ["facade-lines.jpg", "facade-panels.jpg"],
  ["site-crane.jpg", "tower-cranes.jpg"],
  ["building-concrete.jpg", "towers-upward.jpg"],
  ["interior-workspace.jpg", "interior-corridor.jpg"],
  ["engineering-detail.jpg", "interior-cabin.jpg"],
  ["interior-dining.jpg", "house-gable.jpg"],
  ["interior-living.jpg", "villa-white.jpg"],
  ["steel-frame.jpg", "steel-rebar-cage.jpg"],
  ["office-meeting.jpg", "planning-desk.jpg"],
  ["tower-glass.jpg", "tower-constitution.jpg"],
  ["architectural-arches.jpg", "concrete-recessed.jpg"],
  ["atrium.jpg", "interior-meeting-room.jpg"],
];
const DELETE = ["site-sunset.jpg", "blueprint-desk.jpg"];

for (const [from, to] of RENAMES) {
  const src = `${DIR}/${from}`;
  if (existsSync(src)) {
    await rename(src, `${DIR}/${to}`);
    console.log(`${from} -> ${to}`);
  }
}
for (const f of DELETE) {
  const src = `${DIR}/${f}`;
  if (existsSync(src)) {
    await unlink(src);
    console.log(`deleted ${f}`);
  }
}
