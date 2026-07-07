#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const designOsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function getFlag(name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function slugify(value) {
  return String(value || "motion-sequence")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "motion-sequence";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function parsePositions(value) {
  return String(value || "0,0.2,0.4,0.6,0.8,1")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
    .map((item) => Math.max(0, Math.min(1, item)));
}

function parseViewport(value) {
  const match = String(value || "1440x1000").match(/^(\d+)x(\d+)$/);
  if (!match) {
    return { width: 1440, height: 1000 };
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}

function writeReport(runDir, report) {
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, "motion-sequence-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  const screenshots = report.screenshots.length
    ? report.screenshots.map((shot) => `- ${shot.position}: \`${shot.path}\``).join("\n")
    : "- none";
  const blockers = report.blockers.length
    ? report.blockers.map((blocker) => `- ${blocker}`).join("\n")
    : "- none";
  fs.writeFileSync(
    path.join(runDir, "motion-sequence-report.md"),
    `# Motion Sequence Report

## Run
- name: ${report.runName}
- url: ${report.url}
- status: ${report.status}
- capture mode: ${report.captureMode}
- browser: ${report.browser || "none"}
- viewport: ${report.viewport.width}x${report.viewport.height}
- created: ${report.createdAt}

## Positions
${report.positions.map((position) => `- ${position}`).join("\n")}

## Screenshots
${screenshots}

## Blockers
${blockers}

## Notes
${report.notes || ""}
`
  );
}

async function main() {
  const url = getFlag("--url");
  const name = slugify(getFlag("--name", "motion-sequence"));
  const positions = parsePositions(getFlag("--positions"));
  const viewport = parseViewport(getFlag("--viewport"));
  const output = getFlag("--output", "docs/qa/motion-runs/");
  const runDir = path.resolve(designOsRoot, output, `${timestamp()}-${name}`);
  const screenshotsDir = path.join(runDir, "screenshots");

  if (!url) {
    console.error("Usage: node tools/capture-motion-sequence.mjs --url <url> --name <name> [--positions \"0,0.2,1\"] [--viewport 1440x1000]");
    process.exit(1);
  }

  const baseReport = {
    runName: name,
    url,
    createdAt: new Date().toISOString(),
    status: "blocked",
    captureMode: "blocked",
    browser: "",
    viewport,
    positions,
    screenshots: [],
    blockers: [],
    notes: ""
  };

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (error) {
    baseReport.blockers.push(`Playwright package unavailable: ${error.message}`);
    baseReport.notes = "Install or make Playwright available locally, or capture motion evidence manually. This tool did not fake screenshots.";
    writeReport(runDir, baseReport);
    console.error(`Motion capture blocked. Report written to ${path.relative(designOsRoot, runDir)}`);
    process.exit(2);
  }

  let browser;
  try {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    for (const position of positions) {
      await page.evaluate((ratio) => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: maxScroll * ratio, left: 0, behavior: "instant" });
      }, position);
      await page.waitForTimeout(700);
      const fileName = `position-${String(position).replace(".", "-")}.png`;
      const absolutePath = path.join(screenshotsDir, fileName);
      await page.screenshot({ path: absolutePath, fullPage: false });
      baseReport.screenshots.push({
        position,
        path: path.relative(designOsRoot, absolutePath)
      });
    }

    baseReport.status = "captured";
    baseReport.captureMode = "playwright-scroll-sequence";
    baseReport.browser = "chromium";
    baseReport.notes = "Scroll-state screenshots captured. Review still requires human motion judgment and reduced-motion verification.";
    writeReport(runDir, baseReport);
    console.log(`Motion sequence captured: ${path.relative(designOsRoot, runDir)}`);
  } catch (error) {
    baseReport.blockers.push(error.stack || error.message);
    baseReport.notes = "Automated capture failed. The report records the exact blocker and does not fake screenshots.";
    writeReport(runDir, baseReport);
    console.error(`Motion capture blocked. Report written to ${path.relative(designOsRoot, runDir)}`);
    process.exit(2);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();

