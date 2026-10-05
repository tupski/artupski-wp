/**
 * PHP syntax lint for the theme and plugin trees.
 *
 * Runs `php -l` on every .php file under wp-content/ when a PHP binary is
 * available. Exits 0 when PHP is unavailable (lint is skipped, not failed) so
 * the script is safe in environments without PHP.
 *
 * Usage: node tools/php-lint.mjs
 */
import { readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = "wp-content";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".php")) out.push(full);
  }
  return out;
}

const probe = spawnSync("php", ["--version"], { encoding: "utf8" });
if (probe.error) {
  console.log("PHP not available; skipping php -l (not a failure).");
  process.exit(0);
}

if (!statSync(ROOT).isDirectory()) {
  console.log(`No ${ROOT}/ directory found; nothing to lint.`);
  process.exit(0);
}

const files = walk(ROOT);
let failures = 0;
for (const file of files) {
  const res = spawnSync("php", ["-l", file], { encoding: "utf8" });
  const output = (res.stdout || "") + (res.stderr || "");
  if (res.status !== 0) {
    failures++;
    console.log(`FAIL  ${file}`);
    console.log(output.trim());
  } else {
    console.log(`ok    ${file}`);
  }
}

console.log(`\n${files.length} PHP file(s) checked, ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
