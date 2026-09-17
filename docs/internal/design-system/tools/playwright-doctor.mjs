#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const view = { width: 390, height: 844 };

function getFlagValue(flag, fallback = "") {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1] || fallback;
}

function timestamp() {
  return new Date().toISOString();
}

function resolveTmpDir(value) {
  if (!value) {
    return "";
  }
  return path.resolve(process.cwd(), value);
}

function ensureTmpDir(tmpdir) {
  if (!tmpdir) {
    return;
  }
  fs.mkdirSync(tmpdir, { recursive: true });
  process.env.TMPDIR = tmpdir;
  process.env.TMP = tmpdir;
  process.env.TEMP = tmpdir;
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeMarkdown(filePath, report) {
  const lines = [
    "# Playwright Doctor",
    "",
    `Created: ${report.createdAt}`,
    `Status: ${report.status}`,
    `Node: ${report.nodeVersion}`,
    `Platform: ${report.platform} ${report.arch}`,
    `CWD: ${report.cwd}`,
    `Temp directory: ${report.tempDirectory}`,
    `TMPDIR override: ${report.tmpdirOverrideUsed ? report.tmpdirOverride : "none"}`,
    "",
    "## Package Checks",
    "",
    `- playwright: ${report.packages.playwright.available ? "available" : "missing"}`,
    `- @playwright/test: ${report.packages.playwrightTest.available ? "available" : "missing"}`,
    "",
    "## Browser Binary Checks",
    "",
    ...Object.entries(report.browserBinaries).map(([name, result]) => `- ${name}: ${result.exists ? "found" : "missing"}${result.path ? ` (${result.path})` : ""}${result.error ? ` - ${result.error}` : ""}`),
    "",
    "## Launch Checks",
    "",
    ...report.launchChecks.map((check) => `- ${check.browser}: ${check.ok ? "ok" : "failed"}${check.error ? ` - ${check.error}` : ""}`),
    "",
    "## Screenshot Write",
    "",
    `- success: ${report.screenshotWrite.ok}`,
    `- path: ${report.screenshotWrite.path || "not written"}`,
    report.screenshotWrite.error ? `- error: ${report.screenshotWrite.error}` : "",
    "",
    "## Suggested Next Command",
    "",
    "```sh",
    report.suggestedNextCommand,
    "```"
  ].filter(Boolean);
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

async function optionalImport(packageName) {
  try {
    return { available: true, module: await import(packageName), error: "" };
  } catch (error) {
    return { available: false, module: null, error: error.message };
  }
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

async function checkLaunch(playwright, browser, tmpdir) {
  const startedAt = Date.now();
  let instance = null;
  try {
    const browserType = getBrowserType(playwright, browser);
    instance = await browserType.launch(launchOptions(browser, tmpdir));
    await instance.close();
    return { browser, ok: true, durationMs: Date.now() - startedAt, error: "" };
  } catch (error) {
    if (instance) {
      await instance.close().catch(() => {});
    }
    return {
      browser,
      ok: false,
      durationMs: Date.now() - startedAt,
      error: error.stack || error.message
    };
  }
}

async function tryScreenshot(playwright, browser, url, tmpdir, outPath) {
  let instance = null;
  try {
    const browserType = getBrowserType(playwright, browser);
    instance = await browserType.launch(launchOptions(browser, tmpdir));
    const page = await instance.newPage({ viewport: view });
    await page.goto(url || "data:text/html,<main style='font:16px sans-serif'>Playwright doctor</main>", {
      waitUntil: "load",
      timeout: 30000
    });
    await page.screenshot({ path: outPath, fullPage: true });
    await instance.close();
    return { ok: true, browser, path: outPath, error: "" };
  } catch (error) {
    if (instance) {
      await instance.close().catch(() => {});
    }
    return { ok: false, browser, path: "", error: error.stack || error.message };
  }
}

async function main() {
  const url = getFlagValue("--url", "");
  const requestedBrowser = getFlagValue("--browser", "auto");
  const tmpdirOverride = resolveTmpDir(getFlagValue("--tmpdir", ""));
  ensureTmpDir(tmpdirOverride);

  const reportPath = path.resolve(process.cwd(), "docs/qa-runs/playwright-doctor-latest.json");
  const markdownPath = path.resolve(process.cwd(), "docs/qa-runs/playwright-doctor-latest.md");
  const screenshotPath = path.resolve(process.cwd(), "docs/qa-runs/playwright-doctor-latest.png");

  const playwrightImport = await optionalImport("playwright");
  const playwrightTestImport = await optionalImport("@playwright/test");
  const playwright = playwrightImport.module;

  const report = {
    createdAt: timestamp(),
    status: "blocked",
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    osRelease: os.release(),
    cwd: process.cwd(),
    url: url || "",
    requestedBrowser,
    tempDirectory: os.tmpdir(),
    tmpdirOverrideUsed: Boolean(tmpdirOverride),
    tmpdirOverride,
    packages: {
      playwright: {
        available: playwrightImport.available,
        error: playwrightImport.error
      },
      playwrightTest: {
        available: playwrightTestImport.available,
        error: playwrightTestImport.error
      }
    },
    browserBinaries: {
      chromium: { path: "", exists: false, error: "" },
      webkit: { path: "", exists: false, error: "" },
      chrome: { path: "", exists: false, error: "Chrome channel is checked by launch attempt." }
    },
    launchChecks: [],
    screenshotWrite: {
      ok: false,
      browser: "",
      path: "",
      error: ""
    },
    suggestedNextCommand: `node tools/visual-qa.mjs --url ${url || "http://localhost:5173"} --name <project-name> --browser auto${tmpdirOverride ? ` --tmpdir ${path.relative(process.cwd(), tmpdirOverride)}` : ""}`
  };

  if (!playwrightImport.available) {
    report.launchChecks.push({
      browser: "playwright",
      ok: false,
      durationMs: 0,
      error: playwrightImport.error
    });
    writeJson(reportPath, report);
    writeMarkdown(markdownPath, report);
    console.error(`Playwright doctor blocked: playwright package is unavailable. Report written to ${path.relative(process.cwd(), reportPath)}`);
    process.exit(2);
  }

  for (const browser of ["chromium", "webkit"]) {
    try {
      const browserPath = playwright[browser].executablePath();
      report.browserBinaries[browser] = {
        path: browserPath,
        exists: fs.existsSync(browserPath),
        error: ""
      };
    } catch (error) {
      report.browserBinaries[browser] = {
        path: "",
        exists: false,
        error: error.message
      };
    }
  }

  for (const browser of ["chromium", "chrome", "webkit"]) {
    report.launchChecks.push(await checkLaunch(playwright, browser, tmpdirOverride));
  }

  const screenshotCandidates = requestedBrowser === "auto" ? ["chromium", "chrome", "webkit"] : [requestedBrowser];
  for (const browser of screenshotCandidates) {
    const launchResult = report.launchChecks.find((check) => check.browser === browser);
    if (!launchResult?.ok) {
      continue;
    }
    report.screenshotWrite = await tryScreenshot(playwright, browser, url, tmpdirOverride, screenshotPath);
    if (report.screenshotWrite.ok) {
      break;
    }
  }

  const anyLaunchOk = report.launchChecks.some((check) => check.ok);
  report.status = anyLaunchOk && report.screenshotWrite.ok ? "passing" : "blocked";
  if (!report.screenshotWrite.ok && anyLaunchOk) {
    const firstOk = report.launchChecks.find((check) => check.ok);
    report.screenshotWrite.error = report.screenshotWrite.error || `Browser launch succeeded for ${firstOk.browser}, but screenshot write did not run.`;
  }

  writeJson(reportPath, report);
  writeMarkdown(markdownPath, report);

  if (report.status === "passing") {
    console.log(`Playwright doctor passed. Report written to ${path.relative(process.cwd(), reportPath)}`);
    return;
  }

  console.error(`Playwright doctor blocked. Report written to ${path.relative(process.cwd(), reportPath)}`);
  process.exit(2);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
