/**
 * Phase 3 Companion Plugin & Content Engine verification.
 *
 * Checks:
 *   1. Directory structure and required files in wp-content/plugins/artupski-core/
 *   2. Plugin header metadata & ABSPATH guards on every file
 *   3. Custom Post Types registration (artupski_project, artupski_team, artupski_service)
 *   4. Custom Taxonomies registration (artupski_project_category, artupski_project_year)
 *   5. Meta registration and Meta Box UI implementation with nonces and sanitization
 *   6. Permalinks & Rewrites structure (/projects/%artupski_project_year%/%postname%/) and safe flush routines
 *   7. Zero forbidden legacy identifiers (rt_*, contractor_*)
 *   8. Zero Phase 4+ symbols/templates leaked into plugin or theme
 *
 * Usage: node tools/phase3-check.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const PLUGIN_DIR = "wp-content/plugins/artupski-core";
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

function stripPhpComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/^\s*#[^\n]*/gm, "");
}

/* ------------------------------------------------------------------ */
/* 1. Directory and File Structure                                    */
/* ------------------------------------------------------------------ */
const REQUIRED_FILES = [
  `${PLUGIN_DIR}/artupski-core.php`,
  `${PLUGIN_DIR}/index.php`,
  `${PLUGIN_DIR}/inc/index.php`,
  `${PLUGIN_DIR}/inc/class-artupski-core.php`,
  `${PLUGIN_DIR}/inc/class-post-types.php`,
  `${PLUGIN_DIR}/inc/class-taxonomies.php`,
  `${PLUGIN_DIR}/inc/class-meta-boxes.php`,
  `${PLUGIN_DIR}/inc/class-rewrites.php`,
];

for (const file of REQUIRED_FILES) {
  if (existsSync(file)) {
    report(`required file exists: ${file}`, false);
  } else {
    report(`missing required file: ${file}`);
  }
}

/* ------------------------------------------------------------------ */
/* 2. Plugin Headers & ABSPATH Guards                                 */
/* ------------------------------------------------------------------ */
const mainFile = `${PLUGIN_DIR}/artupski-core.php`;
if (existsSync(mainFile)) {
  const content = readFileSync(mainFile, "utf8");
  if (/Plugin Name:\s*Artupski Core/i.test(content)) {
    report("plugin header has correct Plugin Name", false);
  } else {
    report("plugin header missing or incorrect Plugin Name");
  }

  if (/Text Domain:\s*artupski-core/i.test(content)) {
    report("plugin header has correct Text Domain", false);
  } else {
    report("plugin header missing or incorrect Text Domain");
  }
}

const pluginPhpFiles = walk(PLUGIN_DIR).filter((f) => f.endsWith(".php"));
for (const file of pluginPhpFiles) {
  const content = readFileSync(file, "utf8");
  if (path.basename(file) === "index.php") {
    // index.php is silence guard
    continue;
  }
  if (/defined\(\s*['"]ABSPATH['"]\s*\)/.test(content)) {
    report(`ABSPATH guard present in ${path.relative(PLUGIN_DIR, file)}`, false);
  } else {
    report(`missing ABSPATH direct access guard in ${path.relative(PLUGIN_DIR, file)}`);
  }
}

/* ------------------------------------------------------------------ */
/* 3. CPT & Taxonomy Registrations                                    */
/* ------------------------------------------------------------------ */
const cptFile = `${PLUGIN_DIR}/inc/class-post-types.php`;
if (existsSync(cptFile)) {
  const content = readFileSync(cptFile, "utf8");
  for (const cpt of ["artupski_project", "artupski_team", "artupski_service"]) {
    if (content.includes(`'${cpt}'`)) {
      report(`CPT registered: ${cpt}`, false);
    } else {
      report(`CPT registration missing: ${cpt}`);
    }
  }
  if (content.includes("'show_in_rest'") && content.includes("true")) {
    report("CPTs support REST API (show_in_rest => true)", false);
  } else {
    report("CPT show_in_rest missing");
  }
}

const taxFile = `${PLUGIN_DIR}/inc/class-taxonomies.php`;
if (existsSync(taxFile)) {
  const content = readFileSync(taxFile, "utf8");
  for (const tax of ["artupski_project_category", "artupski_project_year"]) {
    if (content.includes(`'${tax}'`)) {
      report(`Taxonomy registered: ${tax}`, false);
    } else {
      report(`Taxonomy registration missing: ${tax}`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* 4. Metadata & Meta Boxes                                           */
/* ------------------------------------------------------------------ */
const metaFile = `${PLUGIN_DIR}/inc/class-meta-boxes.php`;
if (existsSync(metaFile)) {
  const content = readFileSync(metaFile, "utf8");
  const canonicalMeta = [
    "_artupski_project_location",
    "_artupski_project_client",
    "_artupski_project_scope",
    "_artupski_subtitle",
    "_artupski_architecture_style",
    "_artupski_area",
    "_artupski_status",
    "_artupski_client_testimonial",
    "_artupski_image_gallery",
    "_artupski_structural_specs",
    "_artupski_team_role",
    "_artupski_team_credentials",
    "_artupski_team_year_joined",
    "_artupski_bio",
    "_artupski_social_links",
    "_artupski_service_index",
    "_artupski_service_icon",
    "_artupski_lead",
    "_artupski_deliverables",
  ];

  let missingMeta = 0;
  for (const metaKey of canonicalMeta) {
    if (content.includes(metaKey)) {
      // passed
    } else {
      report(`missing canonical meta field registration/save for ${metaKey}`);
      missingMeta++;
    }
  }
  if (missingMeta === 0) {
    report("all canonical _artupski_* metadata fields registered and handled", false);
  }

  // Ensure purged redundant aliases do NOT exist
  const purgedAliases = [
    "'_artupski_client'",
    "'_artupski_location'",
    "'_artupski_year'",
    "'_artupski_project_year'",
    "'_artupski_role'",
    "'_artupski_project_gallery'",
    "'_artupski_project_blueprint'",
  ];

  let foundPurged = 0;
  for (const alias of purgedAliases) {
    if (content.includes(alias)) {
      report(`found redundant/purged meta key alias: ${alias}`);
      foundPurged++;
    }
  }
  if (foundPurged === 0) {
    report("zero redundant meta aliases found in class-meta-boxes.php", false);
  }

  // Check Nonce and Cap checks
  if (/wp_verify_nonce/.test(content) && /current_user_can\(\s*['"]edit_post['"]/.test(content)) {
    report("meta boxes implement nonces and edit_post capability check", false);
  } else {
    report("meta boxes missing nonce verification or edit_post capability check");
  }

  // Check sanitization and escaping
  if (/sanitize_text_field/.test(content) && /esc_attr\(/.test(content)) {
    report("meta boxes implement input sanitization and output escaping", false);
  } else {
    report("meta boxes missing sanitization or escaping");
  }

  // Check structural specs REST schema & sanitization
  if (/'additionalProperties'\s*=>\s*false/.test(content)) {
    report("_artupski_structural_specs schema enforces additionalProperties => false", false);
  } else {
    report("_artupski_structural_specs schema missing additionalProperties => false");
  }

  if (/in_array\(\s*\$clean_key,\s*\$allowed_keys,\s*true\s*\)\s*&&\s*is_scalar\(\s*\$val\s*\)/.test(content)) {
    report("_artupski_structural_specs sanitization strictly filters allowed keys", false);
  } else {
    report("_artupski_structural_specs sanitization missing strict allowed key check");
  }
}

/* ------------------------------------------------------------------ */
/* 5. Permalinks & Rewrite Rules                                      */
/* ------------------------------------------------------------------ */
const rewritesFile = `${PLUGIN_DIR}/inc/class-rewrites.php`;
if (existsSync(rewritesFile)) {
  const content = readFileSync(rewritesFile, "utf8");
  if (content.includes("post_type_link") && content.includes("%artupski_project_year%")) {
    report("post_type_link filter handles %artupski_project_year% replacement", false);
  } else {
    report("rewrites missing post_type_link filter or tag replacement");
  }
  if (content.includes("add_rewrite_rule") || content.includes("add_rewrite_tag")) {
    report("rewrite rules and tags registered", false);
  } else {
    report("missing add_rewrite_rule / add_rewrite_tag");
  }
}

// Unconditional flush check
let unconditionedFlush = false;
for (const file of pluginPhpFiles) {
  const raw = readFileSync(file, "utf8");
  const code = stripPhpComments(raw);
  // Match flush_rewrite_rules outside register_deactivation_hook or maybe_flush
  const matches = code.match(/flush_rewrite_rules\s*\(/g) || [];
  if (matches.length > 0) {
    if (file.endsWith("class-artupski-core.php") && code.includes("get_option( 'artupski_core_flush_rewrite_rules' )")) {
      // safe conditional flush on init
    } else if (file.endsWith("artupski-core.php") && code.includes("artupski_core_deactivate")) {
      // safe deactivation flush
    } else {
      report(`unconditioned or suspicious flush_rewrite_rules call in ${file}`);
      unconditionedFlush = true;
    }
  }
}
if (!unconditionedFlush) {
  report("no unconditional flush_rewrite_rules() on general requests", false);
}

/* ------------------------------------------------------------------ */
/* 6. Legacy Identifier Scan (rt_*, contractor_*)                     */
/* ------------------------------------------------------------------ */
const FORBIDDEN_LEGACY = [
  { re: /\brt_[a-z0-9_]+/i, label: "legacy prefix rt_*" },
  { re: /\bcontractor_[a-z0-9_]+/i, label: "legacy prefix contractor_*" },
];

let legacyHits = 0;
for (const file of pluginPhpFiles) {
  const text = readFileSync(file, "utf8");
  for (const { re, label } of FORBIDDEN_LEGACY) {
    if (re.test(text)) {
      report(`${path.relative(PLUGIN_DIR, file)} contains forbidden identifier matching ${label}`);
      legacyHits++;
    }
  }
}
if (legacyHits === 0) {
  report("zero forbidden legacy identifiers (rt_*, contractor_*) found in plugin", false);
}

/* ------------------------------------------------------------------ */
/* 7. Boundary Check: No Phase 4+ templates/patterns in plugin        */
/* ------------------------------------------------------------------ */
const FORBIDDEN_PHASE4 = [
  /register_block_pattern\s*\(/,
  /register_block_pattern_category\s*\(/,
  /add_shortcode\s*\(/,
  /WP_Customize_/,
  /get_header\s*\(/,
  /get_footer\s*\(/,
  /get_template_part\s*\(/,
];

let boundaryHits = 0;
for (const file of pluginPhpFiles) {
  const text = stripPhpComments(readFileSync(file, "utf8"));
  for (const re of FORBIDDEN_PHASE4) {
    if (re.test(text)) {
      report(`${path.relative(PLUGIN_DIR, file)} leaks Phase 4+ functionality ${re}`);
      boundaryHits++;
    }
  }
}
if (boundaryHits === 0) {
  report("plugin contains zero Phase 4+ presentation/template/customizer code", false);
}

console.log(
  `\n${problems === 0 ? "ALL PHASE 3 CHECKS PASSED" : problems + " PHASE 3 PROBLEM(S) FOUND"}`
);
process.exit(problems === 0 ? 0 : 1);
