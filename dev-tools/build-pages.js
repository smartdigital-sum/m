#!/usr/bin/env node
/*
 * Builds the company-site pages: replaces <!-- include:header --> and
 * <!-- include:footer --> in src/pages/*.html with src/partials/*.html,
 * and writes the result to the repo root. (PLAN.md §8.1)
 *
 * Output path is derived from the source filename — no manifest to keep
 * in sync as pages get added in later phases:
 *   index.html                  -> index.html
 *   about.html                   -> about/index.html
 *   work.html                     -> work/index.html
 *   solutions--schools.html       -> solutions/schools/index.html
 *   work--jatiya-vidyalaya.html   -> work/jatiya-vidyalaya/index.html
 * (a double hyphen "--" becomes a folder separator; a single "-" stays
 * inside one segment, so a slug like "jatiya-vidyalaya" survives intact)
 *
 * apps/, games/, generator/, chatbot/ are untouched — nothing here reads
 * or writes those folders.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "src", "pages");
const PARTIALS_DIR = path.join(ROOT, "src", "partials");

function outputPathFor(filename) {
  const base = filename.replace(/\.html$/, "");
  if (base === "index") return path.join(ROOT, "index.html");
  return path.join(ROOT, ...base.split("--"), "index.html");
}

function build() {
  const header = fs.readFileSync(path.join(PARTIALS_DIR, "header.html"), "utf8");
  const footer = fs.readFileSync(path.join(PARTIALS_DIR, "footer.html"), "utf8");

  if (!fs.existsSync(PAGES_DIR)) {
    console.error("No src/pages directory found — nothing to build.");
    process.exit(1);
  }

  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  if (!files.length) {
    console.warn("src/pages has no .html files — nothing to build.");
    return;
  }

  files.forEach((file) => {
    const src = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    const out = src
      .replace("<!-- include:header -->", header)
      .replace("<!-- include:footer -->", footer);

    const dest = outputPathFor(file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out);
    console.log(`built ${file} -> ${path.relative(ROOT, dest)}`);
  });
}

build();
