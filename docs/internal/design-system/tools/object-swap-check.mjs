#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const viewports = [
  { key: "390", width: 390, height: 844 },
  { key: "768", width: 768, height: 1024 },
  { key: "1440", width: 1440, height: 1100 }
];

function getFlagValue(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? "" : args[index + 1] || "";
}

function slugify(value) {
  return String(value || "object-swap")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "object-swap";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function baseReport({ name, url, objects }) {
  return {
    objectSetName: name,
    url,
    createdAt: new Date().toISOString(),
    objectsTested: objects,
    screenshotPaths: {},
    stableFrame: { confirmed: "manual", notes: "Review screenshots to confirm frame stability." },
    crop: { confirmed: "manual", notes: "Review screenshots to confirm no object is accidentally cut." },
    scale: { confirmed: "manual", notes: "Review screenshots to confirm scale remains intentional." },
    objectPosition: { confirmed: "manual", notes: "Review screenshots to confirm position remains stable." },
    horizontalOverflow: { confirmed: "manual", notes: "Automated overflow is checked when Playwright is available." },
    overlap: { confirmed: "manual", notes: "Review screenshots to confirm no UI overlap." },
    failures: [],
    finalStatus: "manual-review"
  };
}

async function getPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

async function main() {
  const url = getFlagValue("--url");
  const objects = getFlagValue("--objects").split(",").map((item) => item.trim()).filter(Boolean);
  const name = slugify(getFlagValue("--name") || "object-swap");
  const objectParam = getFlagValue("--object-param") || "object";
  if (!url || objects.length === 0) {
    console.error('Usage: node tools/object-swap-check.mjs --url <url> --objects "Atlas,Neo,Phoenix" --name <run-name>');
    process.exit(1);
  }

  const runDir = path.resolve(process.cwd(), "docs/object-swap", `${timestamp()}-${name}`);
  const screenshotDir = path.join(runDir, "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  const report = baseReport({ name, url, objects });
  const playwright = await getPlaywright();
  if (!playwright) {
    report.failures.push("Playwright is not installed in this workspace, so screenshots were not captured.");
    report.finalStatus = "blocked";
    writeJson(path.join(runDir, "object-swap-report.json"), report);
    console.error(`Object swap check blocked: Playwright is unavailable. Report written to ${path.relative(process.cwd(), runDir)}`);
    process.exit(2);
  }

  const browser = await playwright.chromium.launch();
  let overflowClean = true;
  try {
    for (const objectName of objects) {
      report.screenshotPaths[objectName] = {};
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        const objectUrl = new URL(url);
        objectUrl.searchParams.set(objectParam, objectName);
        await page.goto(objectUrl.toString(), { waitUntil: "networkidle", timeout: 30000 });
        const screenshotPath = path.join(screenshotDir, `${slugify(objectName)}-${viewport.key}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        report.screenshotPaths[objectName][viewport.key] = path.relative(process.cwd(), screenshotPath);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        overflowClean = overflowClean && !overflow;
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  report.horizontalOverflow = {
    confirmed: overflowClean ? "yes" : "no",
    notes: overflowClean ? "No horizontal overflow detected by v1 browser check." : "Horizontal overflow detected for at least one object/viewport."
  };
  if (!overflowClean) {
    report.failures.push("Horizontal overflow detected during object swap.");
    report.finalStatus = "fail";
  }

  writeJson(path.join(runDir, "object-swap-report.json"), report);
  console.log(`Object swap report written to ${path.relative(process.cwd(), runDir)}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
