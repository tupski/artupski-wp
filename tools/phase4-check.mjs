/**
 * Phase 4 Theme Templates & Generic Presentation Components verification.
 *
 * Checks:
 *   1. Theme templates existence:
 *      header.php, footer.php, index.php, front-page.php, home.php,
 *      archive-artupski_project.php, taxonomy-artupski_project_category.php,
 *      taxonomy-artupski_project_year.php, single-artupski_project.php,
 *      page.php, single.php, archive.php, 404.php, search.php.
 *   2. Reusable template parts existence:
 *      header/nav.php, header/branding.php,
 *      footer/widgets.php, footer/copyright.php,
 *      project/card.php, project/meta.php, project/gallery.php,
 *      content/content.php, content/content-none.php, content/hero.php, content/pagination.php,
 *      components/hero.php, components/section-header.php, components/editorial-split.php,
 *      components/fact-counter.php, components/project-row.php, components/carousel.php,
 *      components/lightbox.php, components/contact-grid.php.
 *   3. ABSPATH guards on every PHP file in theme.
 *   4. Output escaping verification (no unescaped dynamic echo / print in templates).
 *   5. Integration with artupski-core content model (meta keys & taxonomies referenced).
 *   6. Zero Phase 5+ symbol leaks (no block patterns, customizer class, shortcodes, demo importer).
 *
 * Usage: node tools/phase4-check.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const THEME_DIR = "wp-content/themes/artupski";
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
/* 1. Required Theme Templates                                        */
/* ------------------------------------------------------------------ */
const REQUIRED_TEMPLATES = [
  `${THEME_DIR}/header.php`,
  `${THEME_DIR}/footer.php`,
  `${THEME_DIR}/index.php`,
  `${THEME_DIR}/front-page.php`,
  `${THEME_DIR}/home.php`,
  `${THEME_DIR}/archive-artupski_project.php`,
  `${THEME_DIR}/taxonomy-artupski_project_category.php`,
  `${THEME_DIR}/taxonomy-artupski_project_year.php`,
  `${THEME_DIR}/single-artupski_project.php`,
  `${THEME_DIR}/page.php`,
  `${THEME_DIR}/single.php`,
  `${THEME_DIR}/archive.php`,
  `${THEME_DIR}/404.php`,
  `${THEME_DIR}/search.php`,
];

for (const file of REQUIRED_TEMPLATES) {
  if (existsSync(file)) {
    report(`required template exists: ${path.relative(THEME_DIR, file)}`, false);
  } else {
    report(`missing required template: ${path.relative(THEME_DIR, file)}`);
  }
}

/* ------------------------------------------------------------------ */
/* 2. Reusable Template Parts & Components                            */
/* ------------------------------------------------------------------ */
const REQUIRED_PARTS = [
  `${THEME_DIR}/template-parts/header/branding.php`,
  `${THEME_DIR}/template-parts/header/nav.php`,
  `${THEME_DIR}/template-parts/footer/widgets.php`,
  `${THEME_DIR}/template-parts/footer/copyright.php`,
  `${THEME_DIR}/template-parts/project/card.php`,
  `${THEME_DIR}/template-parts/project/meta.php`,
  `${THEME_DIR}/template-parts/project/gallery.php`,
  `${THEME_DIR}/template-parts/content/content.php`,
  `${THEME_DIR}/template-parts/content/content-none.php`,
  `${THEME_DIR}/template-parts/content/hero.php`,
  `${THEME_DIR}/template-parts/content/pagination.php`,
  `${THEME_DIR}/template-parts/components/hero.php`,
  `${THEME_DIR}/template-parts/components/section-header.php`,
  `${THEME_DIR}/template-parts/components/editorial-split.php`,
  `${THEME_DIR}/template-parts/components/fact-counter.php`,
  `${THEME_DIR}/template-parts/components/project-row.php`,
  `${THEME_DIR}/template-parts/components/carousel.php`,
  `${THEME_DIR}/template-parts/components/lightbox.php`,
  `${THEME_DIR}/template-parts/components/contact-grid.php`,
];

for (const file of REQUIRED_PARTS) {
  if (existsSync(file)) {
    report(`required template part exists: ${path.relative(THEME_DIR, file)}`, false);
  } else {
    report(`missing required template part: ${path.relative(THEME_DIR, file)}`);
  }
}

/* ------------------------------------------------------------------ */
/* 3. ABSPATH Guards in Theme PHP Files                               */
/* ------------------------------------------------------------------ */
const themePhpFiles = walk(THEME_DIR).filter((f) => f.endsWith(".php"));
for (const file of themePhpFiles) {
  const content = readFileSync(file, "utf8");
  if (path.basename(file) === "index.php" && content.includes("Silence is golden")) {
    continue;
  }
  if (/defined\(\s*['"]ABSPATH['"]\s*\)/.test(content)) {
    report(`ABSPATH guard present in ${path.relative(THEME_DIR, file)}`, false);
  } else {
    report(`missing ABSPATH guard in ${path.relative(THEME_DIR, file)}`);
  }
}

/* ------------------------------------------------------------------ */
/* 4. Output Escaping Verification                                    */
/* ------------------------------------------------------------------ */
for (const file of themePhpFiles) {
  const content = readFileSync(file, "utf8");
  const rel = path.relative(THEME_DIR, file);

  // Check for raw unescaped echo of variables or functions (excluding phpcs ignored ones)
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    // If line has echo or print with raw $var without esc_ or wp_kses or phpcs:ignore
    if (/<\?php\s+echo\s+\$[a-zA-Z0-9_]+;/.test(line) && !line.includes("phpcs:ignore")) {
      report(`potential unescaped output in ${rel}:${idx + 1}: ${line.trim()}`);
    }
  });
}

/* ------------------------------------------------------------------ */
/* 5. Integration with Content Model                                  */
/* ------------------------------------------------------------------ */
const templateTagsFile = `${THEME_DIR}/inc/template-tags.php`;
if (existsSync(templateTagsFile)) {
  const tagsContent = readFileSync(templateTagsFile, "utf8");
  const canonicalKeys = [
    "_artupski_project_client",
    "_artupski_project_location",
    "_artupski_subtitle",
    "_artupski_architecture_style",
    "_artupski_area",
    "_artupski_status",
    "_artupski_client_testimonial",
    "_artupski_image_gallery",
    "_artupski_structural_specs",
  ];
  let missingKeys = 0;
  for (const key of canonicalKeys) {
    if (!tagsContent.includes(key)) {
      report(`template-tags missing canonical meta key: ${key}`);
      missingKeys++;
    }
  }
  if (tagsContent.includes("artupski_project_category") && tagsContent.includes("artupski_project_year")) {
    if (missingKeys === 0) {
      report("template-tags correctly references canonical core meta keys and taxonomies", false);
    }
  } else {
    report("template-tags missing expected core taxonomy references (artupski_project_category / artupski_project_year)");
  }
}

/* ------------------------------------------------------------------ */
/* 6. Zero Phase 5+ Leaks                                             */
/* ------------------------------------------------------------------ */
const FORBIDDEN_PHASE5_PATTERNS = [
  /class-customizer\.php/i,
  /class-gutenberg\.php/i,
  /class-shortcodes\.php/i,
  /class-import-service\.php/i,
  /artupski_carousel_shortcode/i,
];

for (const file of themePhpFiles) {
  const content = readFileSync(file, "utf8");
  for (const pattern of FORBIDDEN_PHASE5_PATTERNS) {
    if (pattern.test(content)) {
      report(`leaked Phase 5+ feature pattern ${pattern} found in ${path.relative(THEME_DIR, file)}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Final Summary                                                      */
/* ------------------------------------------------------------------ */
console.log("--------------------------------------------------");
if (problems > 0) {
  console.log(`FAILED: ${problems} Phase 4 verification problem(s) found.`);
  process.exit(1);
} else {
  console.log("SUCCESS: All Phase 4 requirements verified!");
  process.exit(0);
}
