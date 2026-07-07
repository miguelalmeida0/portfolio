#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const viewports = [
  { key: "390", width: 390, height: 844 },
  { key: "768", width: 768, height: 1024 },
  { key: "1440", width: 1440, height: 1100 }
];
const browserModes = new Set(["chromium", "chrome", "webkit", "auto"]);
const requiredManualFiles = ["390.png", "768.png", "1440.png"];

function hasFlag(flag) {
  return args.includes(flag);
}

function getFlagValue(flag, fallback = "") {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1] || fallback;
}

function slugify(value) {
  return String(value || "visual-qa")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "visual-qa";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function relative(filePath) {
  return path.relative(process.cwd(), filePath);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function manualCheck(notes) {
  return { status: "manual", notes };
}

function allManualChecksPassing(report) {
  return Object.values(report.manualChecklist).every((item) => item.status === "pass");
}

function writeMarkdown(filePath, report) {
  const lines = [
    `# Visual QA Report - ${report.runName}`,
    "",
    `URL: ${report.url || "not launched"}`,
    `Status: ${report.status}`,
    `Final status: ${report.finalStatus}`,
    `Capture mode: ${report.captureMode}`,
    `Browser requested: ${report.browserRequested}`,
    `Browser used: ${report.browserUsed || "none"}`,
    `TMPDIR override: ${report.tmpdirOverrideUsed ? report.tmpdirOverride : "none"}`,
    `Created: ${report.createdAt}`,
    "",
    "## Screenshots",
    "",
    `- 390: ${report.screenshots["390"] || "missing"}`,
    `- 768: ${report.screenshots["768"] || "missing"}`,
    `- 1440: ${report.screenshots["1440"] || "missing"}`,
    "",
    "## Automated Checks",
    "",
    `- Horizontal overflow clear: ${report.checks.noHorizontalOverflow}`,
    `- Console checked: ${report.checks.pageConsoleChecked}`,
    `- Button inventory captured: ${report.checks.buttonInventoryCaptured}`,
    `- Dead-button inventory captured: ${report.checks.deadButtonInventoryCaptured}`,
    "",
    "## Manual Checklist",
    "",
    ...Object.entries(report.manualChecklist).map(([key, value]) => `- ${key}: ${value.status} - ${value.notes}`),
    "",
    "## Browser Attempts",
    "",
    ...(report.browserAttempts.length > 0
      ? report.browserAttempts.map((attempt) => `- ${attempt.browser}: ${attempt.ok ? "ok" : "failed"}${attempt.error ? ` - ${attempt.error}` : ""}`)
      : ["- none"]),
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

function baseReport({ runName, url, runDir, browserRequested, tmpdirOverride }) {
  return {
    projectName: runName,
    runName,
    url,
    createdAt: new Date().toISOString(),
    status: "blocked",
    finalStatus: "blocked",
    captureMode: "blocked",
    browserRequested,
    browserUsed: "",
    browserAttempts: [],
    tempDirectory: os.tmpdir(),
    tmpdirOverrideUsed: Boolean(tmpdirOverride),
    tmpdirOverride: tmpdirOverride || "",
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
      noOverlap: manualCheck("Inspect captured screenshots for collisions."),
      noTextOnButtons: manualCheck("Confirm button labels/icons fit within controls."),
      noWatermark: manualCheck("Confirm no source-site watermark is visible."),
      noHorizontalOverflow: manualCheck("Confirm 390 / 768 / 1440 have no accidental horizontal overflow."),
      noCutHeroObject: manualCheck("Confirm the hero/focal object is not accidentally cropped."),
      noDeadButtons: manualCheck("Confirm visible controls either work locally, navigate, or are clearly disabled."),
      objectSwapInvariance: manualCheck("Run object-swap-check when the product swaps primary objects.")
    },
    buttonInventory: [],
    deadButtons: [],
    consoleErrors: [],
    blockers: [],
    notes: `Run folder: ${relative(runDir)}`
  };
}

function resolveTmpDir(value) {
  if (!value) {
    return "";
  }
  return path.resolve(process.cwd(), value);
}

function applyTmpDir(tmpdir) {
  if (!tmpdir) {
    return;
  }
  fs.mkdirSync(tmpdir, { recursive: true });
  process.env.TMPDIR = tmpdir;
  process.env.TMP = tmpdir;
  process.env.TEMP = tmpdir;
}

async function getPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    return { error };
  }
}

function getBrowserOrder(requested) {
  return requested === "auto" ? ["chromium", "chrome", "webkit"] : [requested];
}

function getBrowserType(playwright, browser) {
  if (browser === "webkit") {
    return playwright.webkit;
  }
  return playwright.chromium;
}

function launchOptions(browser, tmpdir) {
  const options = {
    headless: true,
    env: { ...process.env }
  };
  if (browser === "chrome") {
    options.channel = "chrome";
  }
  if (tmpdir) {
    options.env.TMPDIR = tmpdir;
    options.env.TMP = tmpdir;
    options.env.TEMP = tmpdir;
  }
  return options;
}

async function launchBrowser(playwright, browser, tmpdir) {
  const startedAt = Date.now();
  try {
    const browserType = getBrowserType(playwright, browser);
    const instance = await browserType.launch(launchOptions(browser, tmpdir));
    return {
      ok: true,
      browser,
      durationMs: Date.now() - startedAt,
      instance,
      error: ""
    };
  } catch (error) {
    return {
      ok: false,
      browser,
      durationMs: Date.now() - startedAt,
      instance: null,
      error: error.stack || error.message
    };
  }
}

function markCaptured(report, viewport, screenshotPath) {
  report.screenshots[viewport] = relative(screenshotPath);
  report.checks[`captured${viewport}`] = true;
}

async function captureWithBrowser({ playwright, browser, tmpdir, url, report, screenshotDir }) {
  const launch = await launchBrowser(playwright, browser, tmpdir);
  report.browserAttempts.push({
    browser,
    ok: launch.ok,
    durationMs: launch.durationMs,
    error: launch.error
  });
  if (!launch.ok) {
    return false;
  }

  const instance = launch.instance;
  const consoleErrors = [];
  let noHorizontalOverflow = true;
  let buttonInventory = [];
  let deadButtons = [];

  try {
    for (const viewport of viewports) {
      const page = await instance.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(`[${viewport.key}] ${message.text()}`);
        }
      });
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      const screenshotPath = path.join(screenshotDir, `${viewport.key}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      markCaptured(report, viewport.key, screenshotPath);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      noHorizontalOverflow = noHorizontalOverflow && !overflow;

      if (viewport.key === "1440") {
        buttonInventory = await page.evaluate(() => Array.from(document.querySelectorAll("button, a, [role='button'], input[type='button'], input[type='submit']")).map((element) => {
          const htmlElement = element;
          const role = htmlElement.getAttribute("role") || htmlElement.tagName.toLowerCase();
          const text = (htmlElement.innerText || htmlElement.value || htmlElement.getAttribute("aria-label") || "").trim();
          const disabled = Boolean(htmlElement.disabled || htmlElement.getAttribute("aria-disabled") === "true");
          const hasHref = Boolean(htmlElement.getAttribute("href"));
          const hasClickHandler = Boolean(htmlElement.getAttribute("onclick"));
          return {
            text,
            role,
            disabled,
            hasHref,
            hasClickHandler,
            notes: hasClickHandler || hasHref || disabled ? "" : "No inline handler/href detected; React handlers may not be visible to v1."
          };
        }));
        deadButtons = buttonInventory.filter((item) => !item.disabled && !item.hasHref && !item.hasClickHandler && item.role !== "a");
      }

      await page.close();
    }
  } finally {
    await instance.close();
  }

  report.status = "needs-manual-review";
  report.finalStatus = "needs-human-review";
  report.captureMode = "automated";
  report.browserUsed = browser;
  report.checks.noHorizontalOverflow = noHorizontalOverflow;
  report.checks.pageConsoleChecked = true;
  report.checks.buttonInventoryCaptured = true;
  report.checks.deadButtonInventoryCaptured = true;
  report.buttonInventory = buttonInventory;
  report.deadButtons = deadButtons;
  report.consoleErrors = consoleErrors;
  report.blockers = [
    ...(!noHorizontalOverflow ? ["Horizontal overflow detected."] : []),
    ...(consoleErrors.length > 0 ? ["Page console errors detected."] : []),
    ...(deadButtons.length > 0 ? ["Potential dead buttons found; verify handlers manually."] : []),
    "Manual visual checklist still required before done report can pass."
  ];
  report.notes = "Screenshots captured locally. Build/lint is not visual QA; inspect manual checklist before claiming done.";
  return true;
}

function validateManualInput(inputDir) {
  const absoluteInputDir = path.resolve(process.cwd(), inputDir);
  const missing = requiredManualFiles.filter((fileName) => !fs.existsSync(path.join(absoluteInputDir, fileName)));
  return { absoluteInputDir, missing };
}

function importManualScreenshots({ inputDir, report, screenshotDir }) {
  const { absoluteInputDir, missing } = validateManualInput(inputDir);
  report.captureMode = "manual-import";
  report.status = "needs-manual-review";
  report.finalStatus = allManualChecksPassing(report) ? "passing" : "needs-human-review";
  report.inputDir = relative(absoluteInputDir);

  if (missing.length > 0) {
    report.captureMode = "blocked";
    report.status = "blocked";
    report.finalStatus = "blocked";
    report.blockers.push(`Manual input dir is missing required screenshots: ${missing.join(", ")}`);
    report.notes = "Manual import failed. Provide app-only 390.png, 768.png, and 1440.png screenshots.";
    return false;
  }

  fs.mkdirSync(screenshotDir, { recursive: true });
  for (const viewport of ["390", "768", "1440"]) {
    const source = path.join(absoluteInputDir, `${viewport}.png`);
    const destination = path.join(screenshotDir, `${viewport}.png`);
    fs.copyFileSync(source, destination);
    report.originalScreenshotPaths[viewport] = relative(source);
    markCaptured(report, viewport, destination);
  }

  report.checks.noHorizontalOverflow = false;
  report.blockers.push("Manual app-only screenshots imported; human visual checklist still required.");
  report.notes = "Manual import is acceptable fallback evidence only when screenshots are app-only and inspected. Desktop screenshots with browser chrome, dock, or editor UI are not valid QA proof.";
  return true;
}

function writeReport(runDir, report) {
  writeJson(path.join(runDir, "visual-qa-report.json"), report);
  writeMarkdown(path.join(runDir, "visual-qa-report.md"), report);
}

async function main() {
  const manual = hasFlag("--manual");
  const url = getFlagValue("--url", "");
  const inputDir = getFlagValue("--input-dir", "");
  const browserRequested = getFlagValue("--browser", "chromium");
  const name = slugify(getFlagValue("--name", "visual-qa"));
  const tmpdir = resolveTmpDir(getFlagValue("--tmpdir", ""));

  if (!browserModes.has(browserRequested)) {
    console.error(`--browser must be one of: ${Array.from(browserModes).join(", ")}`);
    process.exit(1);
  }

  if (!manual && !url) {
    console.error("Usage: node tools/visual-qa.mjs --url <url> --name <run-name> [--browser auto|chromium|chrome|webkit] [--tmpdir <path>]");
    process.exit(1);
  }

  if (manual && !inputDir) {
    console.error("Usage: node tools/visual-qa.mjs --manual --input-dir <path> --name <run-name>");
    process.exit(1);
  }

  applyTmpDir(tmpdir);

  const runDir = path.resolve(process.cwd(), "docs/qa-runs", `${timestamp()}-${name}`);
  const screenshotDir = path.join(runDir, "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });

  const report = baseReport({ runName: name, url, runDir, browserRequested, tmpdirOverride: tmpdir });

  if (manual) {
    importManualScreenshots({ inputDir, report, screenshotDir });
    writeReport(runDir, report);
    if (report.status === "blocked") {
      console.error(`Manual visual QA import blocked. Report written to ${relative(runDir)}`);
      process.exit(2);
    }
    console.log(`Manual visual QA report written to ${relative(runDir)}`);
    return;
  }

  const playwright = await getPlaywright();
  if (playwright?.error) {
    report.browserAttempts.push({
      browser: "playwright",
      ok: false,
      durationMs: 0,
      error: playwright.error.stack || playwright.error.message
    });
    report.blockers.push("Playwright is not installed or cannot be imported in this workspace.");
    report.notes = "No external services were called. Capture did not run because local Playwright is unavailable.";
    writeReport(runDir, report);
    console.error(`Visual QA blocked: Playwright is unavailable. Report written to ${relative(runDir)}`);
    process.exit(2);
  }

  for (const browser of getBrowserOrder(browserRequested)) {
    const captured = await captureWithBrowser({ playwright, browser, tmpdir, url, report, screenshotDir });
    if (captured) {
      writeReport(runDir, report);
      console.log(`Visual QA report written to ${relative(runDir)}`);
      return;
    }
  }

  report.blockers.push("All browser launch attempts failed.");
  report.notes = "Automated capture failed. Use Chrome channel, TMPDIR fallback, or manual app-only screenshot import. Do not use desktop screenshots with browser chrome or dock as QA proof.";
  writeReport(runDir, report);
  console.error(`Visual QA blocked: all browser modes failed. Report written to ${relative(runDir)}`);
  process.exit(2);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
