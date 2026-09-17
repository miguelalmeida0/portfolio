#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const viewports = ["390", "768", "1440"];

function getFlagValue(flag, fallback = "") {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1] || fallback;
}

function slugify(value) {
  return String(value || "manual-screenshot-import")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "manual-screenshot-import";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
}

function manualCheck(notes) {
  return { status: "manual", notes };
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeMarkdown(filePath, report) {
  const lines = [
    `# Manual Visual QA Import - ${report.runName}`,
    "",
    `Status: ${report.status}`,
    `Final status: ${report.finalStatus}`,
    `Capture mode: ${report.captureMode}`,
    `Created: ${report.createdAt}`,
    "",
    "## Imported Screenshots",
    "",
    ...viewports.map((viewport) => `- ${viewport}: ${report.screenshots[viewport]} (from ${report.originalScreenshotPaths[viewport]})`),
    "",
    "## Manual Checklist",
    "",
    ...Object.entries(report.manualChecklist).map(([key, value]) => `- ${key}: ${value.status} - ${value.notes}`),
    "",
    "## Blockers",
    "",
    ...(report.blockers.length > 0 ? report.blockers.map((blocker) => `- ${blocker}`) : ["- none"]),
    "",
    "## Notes",
    "",
    report.notes
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function buildReport({ name, runDir }) {
  return {
    projectName: name,
    runName: name,
    url: "manual-import",
    createdAt: new Date().toISOString(),
    status: "needs-manual-review",
    finalStatus: "needs-human-review",
    captureMode: "manual-import",
    browserRequested: "manual",
    browserUsed: "",
    browserAttempts: [],
    tempDirectory: "",
    tmpdirOverrideUsed: false,
    tmpdirOverride: "",
    inputDir: "",
    originalScreenshotPaths: {},
    screenshots: {
      "390": "",
      "768": "",
      "1440": ""
    },
    checks: {
      captured390: false,
      captured768: false,
      captured1440: false,
      noHorizontalOverflow: false,
      pageConsoleChecked: false,
      buttonInventoryCaptured: false,
      deadButtonInventoryCaptured: false
    },
    manualChecklist: {
      noOverlap: manualCheck("Human must inspect for collisions at 390 / 768 / 1440."),
      noTextOnButtons: manualCheck("Human must confirm labels/icons fit inside visible controls."),
      noWatermark: manualCheck("Human must confirm no watermark, browser chrome, dock, editor UI, or source-site artifact is present."),
      noHorizontalOverflow: manualCheck("Human must confirm no accidental horizontal overflow at imported viewports."),
      noCutHeroObject: manualCheck("Human must confirm the primary hero/focal object is not accidentally cropped."),
      noDeadButtons: manualCheck("Human must confirm visible controls work locally, navigate, or are clearly disabled."),
      objectSwapInvariance: manualCheck("Human must run object-swap-check for roster, gallery, selection, or configurator products.")
    },
    buttonInventory: [],
    deadButtons: [],
    consoleErrors: [],
    blockers: [
      "Manual screenshots imported; human visual checklist still required before done."
    ],
    notes: `Run folder: ${relative(runDir)}. Manual app-only screenshots can be valid evidence after inspection. Desktop screenshots with browser chrome, dock, or editor UI are not valid QA proof.`
  };
}

function main() {
  const name = slugify(getFlagValue("--name", "manual-screenshot-import"));
  const sources = Object.fromEntries(viewports.map((viewport) => [viewport, getFlagValue(`--${viewport}`)]));
  const missingFlags = viewports.filter((viewport) => !sources[viewport]);
  if (missingFlags.length > 0) {
    console.error(`Missing required screenshot flags: ${missingFlags.map((viewport) => `--${viewport}`).join(", ")}`);
    process.exit(1);
  }

  const missingFiles = viewports.filter((viewport) => !fs.existsSync(path.resolve(process.cwd(), sources[viewport])));
  if (missingFiles.length > 0) {
    console.error(`Screenshot files do not exist: ${missingFiles.map((viewport) => sources[viewport]).join(", ")}`);
    process.exit(1);
  }

  const runDir = path.resolve(process.cwd(), "docs/qa-runs", `${timestamp()}-${name}`);
  const screenshotDir = path.join(runDir, "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  const report = buildReport({ name, runDir });

  for (const viewport of viewports) {
    const source = path.resolve(process.cwd(), sources[viewport]);
    const destination = path.join(screenshotDir, `${viewport}.png`);
    fs.copyFileSync(source, destination);
    report.originalScreenshotPaths[viewport] = relative(source);
    report.screenshots[viewport] = relative(destination);
    report.checks[`captured${viewport}`] = true;
  }

  writeJson(path.join(runDir, "visual-qa-report.json"), report);
  writeMarkdown(path.join(runDir, "visual-qa-report.md"), report);
  console.log(`Manual screenshots imported to ${relative(runDir)}`);
}

main();
