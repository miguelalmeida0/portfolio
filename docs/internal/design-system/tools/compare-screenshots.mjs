#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function getFlagValue(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? "" : args[index + 1] || "";
}

function slugify(value) {
  return String(value || "comparison")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "comparison";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function resolveProjectPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

function pngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
        known: true
      };
    }
  } catch {
    // handled below
  }
  return { width: 0, height: 0, known: false };
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function main() {
  const target = getFlagValue("--target");
  const current = getFlagValue("--current");
  const name = slugify(getFlagValue("--name") || "comparison");
  if (!target || !current) {
    console.error("Usage: node tools/compare-screenshots.mjs --target <target.png> --current <current.png> --name <run-name>");
    process.exit(1);
  }

  const targetPath = resolveProjectPath(target);
  const currentPath = resolveProjectPath(current);
  if (!fs.existsSync(targetPath)) {
    console.error(`Target screenshot does not exist: ${target}`);
    process.exit(1);
  }
  if (!fs.existsSync(currentPath)) {
    console.error(`Current screenshot does not exist: ${current}`);
    process.exit(1);
  }

  const runDir = path.resolve(process.cwd(), "docs/comparisons", `${timestamp()}-${name}`);
  fs.mkdirSync(runDir, { recursive: true });

  const targetDimensions = pngDimensions(targetPath);
  const currentDimensions = pngDimensions(currentPath);
  const dimensionsMatch = targetDimensions.known &&
    currentDimensions.known &&
    targetDimensions.width === currentDimensions.width &&
    targetDimensions.height === currentDimensions.height;

  const report = {
    projectName: name,
    runName: name,
    createdAt: new Date().toISOString(),
    targetImagePath: target,
    currentImagePath: current,
    dimensions: {
      target: targetDimensions,
      current: currentDimensions
    },
    dimensionsMatch,
    layoutMatchNotes: "Manual comparison required.",
    focalObjectMatchNotes: "Manual comparison required.",
    typographyMatchNotes: "Manual comparison required.",
    spacingMatchNotes: "Manual comparison required.",
    extraMissingUiNotes: "Manual comparison required.",
    exactRemainingDifferences: [
      "Manual target/current differences must be filled before approval."
    ],
    blockingDifferences: dimensionsMatch ? [] : ["Screenshot dimensions do not match or could not be read."]
  };

  writeJson(path.join(runDir, "comparison-report.json"), report);

  const targetSrc = path.relative(runDir, targetPath);
  const currentSrc = path.relative(runDir, currentPath);
  const contactSheet = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${htmlEscape(name)} comparison</title>
    <style>
      body { margin: 0; font: 14px/1.5 system-ui, sans-serif; background: #111; color: #f6f2e8; }
      main { padding: 24px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
      figure { margin: 0; border: 1px solid #3a3a3a; background: #181818; }
      figcaption { padding: 10px 12px; border-bottom: 1px solid #3a3a3a; font-weight: 700; }
      img { display: block; max-width: 100%; height: auto; }
      @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <h1>${htmlEscape(name)} comparison</h1>
      <p>Dimensions match: ${dimensionsMatch}</p>
      <div class="grid">
        <figure><figcaption>Target</figcaption><img src="${htmlEscape(targetSrc)}" alt="Target screenshot"></figure>
        <figure><figcaption>Current</figcaption><img src="${htmlEscape(currentSrc)}" alt="Current screenshot"></figure>
      </div>
    </main>
  </body>
</html>
`;
  fs.writeFileSync(path.join(runDir, "contact-sheet.html"), contactSheet);

  const markdown = [
    `# Screenshot Comparison - ${name}`,
    "",
    `Target: ${target}`,
    `Current: ${current}`,
    `Dimensions match: ${dimensionsMatch}`,
    "",
    "Manual notes must be filled in `comparison-report.json` before Literal Target Copy Mode approval."
  ].join("\n");
  fs.writeFileSync(path.join(runDir, "comparison-report.md"), `${markdown}\n`);

  console.log(`Comparison report written to ${path.relative(process.cwd(), runDir)}`);
}

main();
