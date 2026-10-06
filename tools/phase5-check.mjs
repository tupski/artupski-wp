/**
 * Phase 5 Gutenberg Patterns, Block Styles, Customizer & Classic Compatibility
 * verification.
 *
 * Semantic acceptance checks:
 *   1. Block Pattern files exist in wp-content/themes/artupski/patterns/ and are
 *      categorized under `artupski-dossier`.
 *   2. Gutenberg service (inc/class-gutenberg.php) registers the pattern category
 *      AND EXACTLY the 6 canonical Core block styles (no more, no less):
 *        core/group      -> ink-band
 *        core/group      -> paper-boxed
 *        core/heading    -> sec-num
 *        core/paragraph  -> lede
 *        core/paragraph  -> mono-meta
 *        core/button     -> tlink
 *   3. Editor styling (assets/css/editor-style.css) is scoped to
 *      `.editor-styles-wrapper`, consumes design tokens, redefines none.
 *   4. Customizer (inc/class-customizer.php) is present, hooked, declares the
 *      `artupski_theme_options` panel and `artupski_header` section, registers
 *      EXACTLY 5 whitelisted controls, and registers ZERO forbidden settings.
 *   5. Classic Editor (inc/class-classic-editor.php) declares the 6 canonical
 *      TinyMCE style formats and EXACTLY the 2 canonical shortcodes, and contains
 *      NO global anti-`wpautop` / `shortcode_unautop` hack.
 *   6. Content-model integrity: project year comes from the
 *      `artupski_project_year` taxonomy, never from post meta.
 *   7. No Phase 6+ runtime interaction (Turbo/carousel/lightbox handlers) leaked
 *      into the Phase 5 front-end JS.
 *   8. ABSPATH guards on every theme PHP file.
 *
 * Usage: node tools/phase5-check.mjs
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

function stripPhpComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/^\s*#[^\n]*/gm, "");
}

/* ------------------------------------------------------------------ */
/* 1. Block Patterns Existence & Headers                              */
/* ------------------------------------------------------------------ */
const REQUIRED_PATTERNS = [
  "hero-drafting.php",
  "section-header.php",
  "facts-bar.php",
  "editorial-split.php",
  "project-carousel.php",
];

const patternsDir = `${THEME_DIR}/patterns`;
if (!existsSync(patternsDir)) {
  report(`missing patterns directory: ${patternsDir}`);
} else {
  report(`patterns directory exists: ${patternsDir}`, false);
}

for (const patternFile of REQUIRED_PATTERNS) {
  const fullPath = path.join(patternsDir, patternFile);
  if (existsSync(fullPath)) {
    report(`pattern file exists: ${patternFile}`, false);
    const content = readFileSync(fullPath, "utf8");
    if (content.includes("artupski-dossier")) {
      report(`pattern ${patternFile} categorized under artupski-dossier`, false);
    } else {
      report(`pattern ${patternFile} missing artupski-dossier category`);
    }
  } else {
    report(`missing required pattern file: ${patternFile}`);
  }
}

/* ------------------------------------------------------------------ */
/* 2. Gutenberg Class, Pattern Category & EXACT Block Styles          */
/* ------------------------------------------------------------------ */
const CANONICAL_BLOCK_STYLES = [
  { block: "core/group", style: "ink-band" },
  { block: "core/group", style: "paper-boxed" },
  { block: "core/heading", style: "sec-num" },
  { block: "core/paragraph", style: "lede" },
  { block: "core/paragraph", style: "mono-meta" },
  { block: "core/button", style: "tlink" },
];

const gutenbergClassFile = `${THEME_DIR}/inc/class-gutenberg.php`;
if (!existsSync(gutenbergClassFile)) {
  report(`missing ${gutenbergClassFile}`);
} else {
  report(`class-gutenberg.php exists`, false);
  const content = readFileSync(gutenbergClassFile, "utf8");

  if (content.includes("register_block_pattern_category") && content.includes("artupski-dossier")) {
    report("class-gutenberg.php registers 'artupski-dossier' pattern category", false);
  } else {
    report("class-gutenberg.php missing pattern category registration");
  }

  /* Parse every register_block_style() call to enforce the exact set. */
  const styleCalls = [
    ...content.matchAll(
      /register_block_style\s*\(\s*['"]([^'"]+)['"]\s*,\s*array\s*\(([\s\S]*?)\)\s*\)/g
    ),
  ];

  const registeredStyles = styleCalls.map((m) => {
    const block = m[1];
    const body = m[2];
    const nameMatch = body.match(/['"]name['"]\s*=>\s*['"]([^'"]+)['"]/);
    return { block, style: nameMatch ? nameMatch[1] : null };
  });

  for (const { block, style } of CANONICAL_BLOCK_STYLES) {
    const found = registeredStyles.some((r) => r.block === block && r.style === style);
    if (found) {
      report(`block style registered: ${block} -> ${style}`, false);
    } else {
      report(`missing canonical block style: ${block} -> ${style}`);
    }
  }

  const unexpected = registeredStyles.filter(
    (r) =>
      !CANONICAL_BLOCK_STYLES.some(
        (c) => c.block === r.block && c.style === r.style
      )
  );
  if (registeredStyles.length === CANONICAL_BLOCK_STYLES.length && unexpected.length === 0) {
    report("exactly the 6 canonical block styles are registered (none unexpected)", false);
  } else {
    report(
      `unexpected block style registration(s): ${unexpected
        .map((u) => `${u.block} -> ${u.style}`)
        .join(", ") || "(count mismatch: " + registeredStyles.length + ")"}`
    );
  }
}

/* ------------------------------------------------------------------ */
/* 3. Editor Styling Verification                                     */
/* ------------------------------------------------------------------ */
const editorCssFile = `${THEME_DIR}/assets/css/editor-style.css`;
if (!existsSync(editorCssFile)) {
  report(`missing ${editorCssFile}`);
} else {
  const css = readFileSync(editorCssFile, "utf8");
  if (css.includes(".editor-styles-wrapper")) {
    report("editor-style.css scopes rules inside .editor-styles-wrapper", false);
  } else {
    report("editor-style.css does not scope inside .editor-styles-wrapper");
  }

  const REQUIRED_TOKENS_CONSUMED = [
    "var(--wp--preset--color--paper)",
    "var(--wp--preset--color--ink)",
    "var(--wp--preset--color--crimson)",
    "var(--wp--preset--font-family--sans)",
    "var(--wp--preset--font-family--serif)",
    "var(--wp--preset--font-family--mono)",
  ];

  for (const token of REQUIRED_TOKENS_CONSUMED) {
    if (css.includes(token)) {
      report(`editor-style.css consumes token ${token}`, false);
    } else {
      report(`editor-style.css missing consumed token ${token}`);
    }
  }

  if (!css.includes("--paper:") && !css.includes("--ink:")) {
    report("editor-style.css defines no raw tokens", false);
  } else {
    report("editor-style.css redefines raw tokens");
  }

  if (css.includes(".paper-boxed") || css.includes(".is-style-paper-boxed")) {
    report("editor-style.css styles the canonical paper-boxed container", false);
  } else {
    report("editor-style.css missing canonical paper-boxed container styling");
  }
}

/* ------------------------------------------------------------------ */
/* 4. Customizer: Presence, Wiring, Panel/Section, 5 Controls        */
/* ------------------------------------------------------------------ */
const customizerFile = `${THEME_DIR}/inc/class-customizer.php`;
const REQUIRED_CUSTOMIZER_SETTINGS = [
  "artupski_header_layout",
  "artupski_header_sticky",
  "artupski_wordmark_text",
  "artupski_wordmark_accent",
  "artupski_menu_cta_show",
];
const FORBIDDEN_CUSTOMIZER_SETTING_PATTERNS = [
  /artupski_color/i,
  /palette/i,
  /max_width/i,
  /gutter/i,
  /section_pad/i,
  /font_source/i,
  /custom_css/i,
  /artupski_turbo/i,
  /reduced_motion/i,
  /sanitize_hex_color/i,
  /WP_Customize_Color_Control/i,
];

if (!existsSync(customizerFile)) {
  report(`missing ${customizerFile}`);
} else {
  report("class-customizer.php exists", false);
  const content = readFileSync(customizerFile, "utf8");

  /* Panel & section presence. */
  if (content.includes("'artupski_theme_options'") || content.includes('"artupski_theme_options"')) {
    report("customizer registers panel 'artupski_theme_options'", false);
  } else {
    report("customizer missing required panel 'artupski_theme_options'");
  }

  if (content.includes("'artupski_header'") || content.includes('"artupski_header"')) {
    report("customizer registers section 'artupski_header'", false);
  } else {
    report("customizer missing required section 'artupski_header'");
  }

  /* Exactly 5 controls. */
  const settingCalls = [...content.matchAll(/\$wp_customize->add_setting\s*\(\s*['"]([^'"]+)['"]/g)].map(
    (m) => m[1]
  );
  const uniqueSettings = [...new Set(settingCalls)];

  if (uniqueSettings.length === 5) {
    report("customizer registers exactly 5 settings/controls", false);
  } else {
    report(
      `customizer control count is ${uniqueSettings.length}, expected exactly 5 (${uniqueSettings.join(", ")})`
    );
  }

  for (const setting of REQUIRED_CUSTOMIZER_SETTINGS) {
    if (uniqueSettings.includes(setting)) {
      report(`customizer registers required setting ${setting}`, false);
    } else {
      report(`customizer missing required setting ${setting}`);
    }
  }

  /* Forbidden settings. */
  let forbiddenHits = 0;
  for (const pattern of FORBIDDEN_CUSTOMIZER_SETTING_PATTERNS) {
    if (pattern.test(content)) {
      report(`customizer registers forbidden setting matching ${pattern}`);
      forbiddenHits++;
    }
  }
  if (forbiddenHits === 0) {
    report("customizer registers zero forbidden settings", false);
  }

  /* Sanitization + transport discipline. */
  if (/sanitize_text_field/.test(content) && /rest_sanitize_boolean/.test(content)) {
    report("customizer uses sanitize_text_field + rest_sanitize_boolean", false);
  } else {
    report("customizer missing expected sanitize callbacks");
  }

  if (/in_array\s*\(\s*\$input\s*,/.test(content) && /ALLOWED_HEADER_LAYOUTS/.test(content)) {
    report("customizer whitelist-validates artupski_header_layout", false);
  } else {
    report("customizer missing whitelist validation for header layout");
  }

  if ((content.match(/['"]transport['"]\s*=>\s*['"]refresh['"]/g) || []).length >= 5) {
    report("customizer uses 'refresh' transport for all 5 controls", false);
  } else {
    report("customizer transport settings are not all 'refresh'");
  }
}

/* Hook-up: functions.php requires it AND class-theme.php instantiates it. */
const functionsFile = `${THEME_DIR}/functions.php`;
if (existsSync(functionsFile)) {
  const content = readFileSync(functionsFile, "utf8");
  if (content.includes("class-customizer.php")) {
    report("functions.php requires class-customizer.php", false);
  } else {
    report("functions.php missing require for class-customizer.php");
  }
  if (content.includes("class-gutenberg.php") && content.includes("class-classic-editor.php")) {
    report("functions.php requires Gutenberg and Classic Editor service classes", false);
  } else {
    report("functions.php missing require for class-gutenberg.php or class-classic-editor.php");
  }
}

const themeClassFile = `${THEME_DIR}/inc/class-theme.php`;
if (existsSync(themeClassFile)) {
  const content = readFileSync(themeClassFile, "utf8");
  if (content.includes("Artupski_Customizer")) {
    report("class-theme.php instantiates Artupski_Customizer", false);
  } else {
    report("class-theme.php does not instantiate Artupski_Customizer (customizer not hooked)");
  }
  if (content.includes("Artupski_Gutenberg") && content.includes("Artupski_Classic_Editor")) {
    report("class-theme.php instantiates Artupski_Gutenberg and Artupski_Classic_Editor", false);
  } else {
    report("class-theme.php does not instantiate Gutenberg or Classic Editor classes");
  }
}

/* ------------------------------------------------------------------ */
/* 5. Classic Editor: Formats, Shortcodes, No wpautop Hack            */
/* ------------------------------------------------------------------ */
const CANONICAL_FORMAT_CLASSES = ["eyebrow", "lede", "meta", "tlink", "ink-band", "paper-boxed"];
const CANONICAL_SHORTCODES = ["artupski_carousel", "artupski_project_list"];

const classicClassFile = `${THEME_DIR}/inc/class-classic-editor.php`;
if (!existsSync(classicClassFile)) {
  report(`missing ${classicClassFile}`);
} else {
  report(`class-classic-editor.php exists`, false);
  const content = readFileSync(classicClassFile, "utf8");
  const code = stripPhpComments(content);

  if (content.includes("'tiny_mce_before_init'") || content.includes('"tiny_mce_before_init"')) {
    report("class-classic-editor.php hooks tiny_mce_before_init", false);
  } else {
    report("class-classic-editor.php missing tiny_mce_before_init hook");
  }

  /* Canonical TinyMCE style formats. */
  for (const cls of CANONICAL_FORMAT_CLASSES) {
    if (new RegExp(`['"]classes['"]\\s*=>\\s*['"][^'"]*\\b${cls}\\b`).test(content)) {
      report(`classic editor format present: ${cls}`, false);
    } else {
      report(`classic editor format missing: ${cls}`);
    }
  }

  /* Exactly the canonical shortcodes. */
  const shortcodeCalls = [
    ...code.matchAll(/add_shortcode\s*\(\s*['"]([^'"]+)['"]/g),
  ].map((m) => m[1]);
  const uniqueShortcodes = [...new Set(shortcodeCalls)];

  for (const sc of CANONICAL_SHORTCODES) {
    if (uniqueShortcodes.includes(sc)) {
      report(`classic editor registers [${sc}]`, false);
    } else {
      report(`missing canonical shortcode [${sc}]`);
    }
  }

  const unexpectedShortcodes = uniqueShortcodes.filter((s) => !CANONICAL_SHORTCODES.includes(s));
  if (uniqueShortcodes.length === CANONICAL_SHORTCODES.length && unexpectedShortcodes.length === 0) {
    report("exactly the 2 canonical shortcodes are registered (none unexpected)", false);
  } else {
    report(
      `unexpected shortcode registration(s): ${
        unexpectedShortcodes.join(", ") || "(count mismatch: " + uniqueShortcodes.length + ")"
      }`
    );
  }

  /* No global anti-wpautop / shortcode_unautop hack. */
  if (/shortcode_unautop\s*\(/.test(code)) {
    report("class-classic-editor.php contains a shortcode_unautop() hack");
  } else {
    report("no shortcode_unautop() hack present", false);
  }

  if (/add_filter\s*\(\s*['"]the_content['"]/.test(code) || /add_filter\s*\(\s*['"]the_excerpt['"]/.test(code)) {
    report("class-classic-editor.php registers a global the_content/the_excerpt filter (anti-wpautop hack)");
  } else {
    report("no global the_content/the_excerpt content filter hack present", false);
  }

  /* Shortcodes backed by template components. */
  if (content.includes("template-parts/components/carousel") && content.includes("template-parts/components/project-row")) {
    report("shortcodes are backed by presentation template components", false);
  } else {
    report("shortcodes not backed by template-parts/components");
  }
}

/* ------------------------------------------------------------------ */
/* 6. Content-Model Integrity: year via taxonomy, never post meta     */
/* ------------------------------------------------------------------ */
const themePhpFiles = walk(THEME_DIR).filter((f) => f.endsWith(".php"));

let yearMetaHits = 0;
for (const file of themePhpFiles) {
  const text = stripPhpComments(readFileSync(file, "utf8"));
  if (/_artupski_year\b/.test(text) || /_artupski_project_year\b/.test(text)) {
    report(`post meta year key used instead of taxonomy in ${path.relative(THEME_DIR, file)}`);
    yearMetaHits++;
  }
}
if (yearMetaHits === 0) {
  report("no post meta year key used (year resolved via taxonomy)", false);
}

const templateTagsFile = `${THEME_DIR}/inc/template-tags.php`;
if (existsSync(templateTagsFile)) {
  const tags = readFileSync(templateTagsFile, "utf8");
  if (tags.includes("artupski_project_year")) {
    report("template-tags resolves year via artupski_project_year taxonomy", false);
  } else {
    report("template-tags does not reference artupski_project_year taxonomy");
  }
}

/* ------------------------------------------------------------------ */
/* 7. No Phase 6+ Runtime Interaction Leaked into Front-end JS        */
/* ------------------------------------------------------------------ */
const siteJsFile = `${THEME_DIR}/assets/js/site.js`;
if (!existsSync(siteJsFile)) {
  report(`missing ${siteJsFile}`);
} else {
  const js = readFileSync(siteJsFile, "utf8");
  const FORBIDDEN_RUNTIME = [
    { re: /addEventListener\s*\(\s*['"]click['"]/, label: "delegated click handler (Phase 6 interaction)" },
    { re: /\bnew\s+IntersectionObserver\b/, label: "IntersectionObserver reveal logic" },
    { re: /\bshowModal\s*\(/, label: "lightbox modal runtime" },
    { re: /\bshowModal\b|\bclose\s*\(\s*\)\s*;/, label: "modal dialog runtime" },
    { re: /turbo:before-visit/, label: "Phase 6 Turbo lifecycle (before-visit)" },
    { re: /data-carousel/, label: "carousel runtime wiring" },
    { re: /data-lightbox/, label: "lightbox runtime wiring" },
  ];

  let runtimeHits = 0;
  for (const { re, label } of FORBIDDEN_RUNTIME) {
    if (re.test(js)) {
      report(`premature Phase 6 runtime behaviour in site.js: ${label}`);
      runtimeHits++;
    }
  }
  if (runtimeHits === 0) {
    report("site.js contains no premature Phase 6 carousel/lightbox/menu runtime behaviour", false);
  }
}

/* ------------------------------------------------------------------ */
/* 8. ABSPATH Guards in all Theme PHP Files                           */
/* ------------------------------------------------------------------ */
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
/* Final Summary                                                      */
/* ------------------------------------------------------------------ */
console.log("--------------------------------------------------");
if (problems > 0) {
  console.log(`FAILED: ${problems} Phase 5 verification problem(s) found.`);
  process.exit(1);
} else {
  console.log("SUCCESS: All Phase 5 requirements verified!");
  process.exit(0);
}
