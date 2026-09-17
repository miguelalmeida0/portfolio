#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function arg(name, fallback = undefined) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

const url = arg("--url");
const outDir = arg("--out", "docs/qa/final-ui-integrity/");
const gateVersion = "v3";

function parseWidthSweep(value) {
  const [startRaw, endRaw, stepRaw] = String(value).split(":");
  const start = Number.parseInt(startRaw, 10);
  const end = Number.parseInt(endRaw, 10);
  const step = Number.parseInt(stepRaw, 10);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step) || step <= 0 || end < start) {
    return [];
  }
  const widths = [];
  for (let width = start; width <= end; width += step) {
    widths.push(width);
  }
  if (widths[widths.length - 1] !== end) widths.push(end);
  return widths;
}

const widthSweepArg = arg("--width-sweep", "360:1920:40");
const legacyViewports = arg("--viewports");
const widthSweep = legacyViewports
  ? String(legacyViewports)
    .split(",")
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter(Boolean)
  : parseWidthSweep(widthSweepArg);
const heightMatrix = String(arg("--heights", "720,844,900,1080"))
  .split(",")
  .map((value) => Number.parseInt(value.trim(), 10))
  .filter(Boolean);
const scrollSamples = String(arg("--scroll-samples", "0,0.1,0.2,0.35,0.5,0.65,0.8,0.9,1"))
  .split(",")
  .map((value) => Number.parseFloat(value.trim()))
  .filter((value) => Number.isFinite(value) && value >= 0 && value <= 1);
const stateSamples = String(arg("--state-samples", "default"))
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const failOnBlocker = String(arg("--fail-on-blocker", "true")) !== "false";
const captureFailuresOnlyArg = arg("--capture-failures-only", "auto");
const totalSamples = widthSweep.length * heightMatrix.length * scrollSamples.length;
const captureFailuresOnly = captureFailuresOnlyArg === "auto"
  ? totalSamples > 120
  : String(captureFailuresOnlyArg) !== "false";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, body) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, body);
}

function writeReports(report) {
  ensureDir(outDir);
  write(path.join(outDir, "final-ui-integrity-report.json"), `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Final UI Integrity Report",
    "",
    `- Gate version: ${report.finalUiIntegrityGateVersion}`,
    `- URL: ${report.url ?? "not provided"}`,
    `- Created: ${report.createdAt}`,
    `- Verdict: ${report.verdict}`,
    `- Final handoff allowed: ${report.finalHandoffAllowed ? "yes" : "no"}`,
    `- Blocker count: ${report.blockerCount}`,
    `- Width sweep: ${report.widthSweepTested.join(", ")}`,
    `- Height matrix: ${report.heightMatrixTested.join(", ")}`,
    `- Scroll samples: ${report.scrollSamples.join(", ")}`,
    `- State samples: ${report.stateSamples.join(", ")}`,
    `- Capture failures only: ${report.captureFailuresOnly ? "yes" : "no"}`,
    `- Screenshot directory: ${report.screenshotDir}`,
    "",
    "## Findings",
    "",
    "| Viewport | Scroll | Selector / Tag | Text Preview | Bounding Rect | Blocker Type | Screenshot | Severity | Recommended Fix |",
    "|---|---|---|---|---|---|---|---|---|"
  ];

  for (const finding of report.findings) {
    const rect = finding.rect ? `${Math.round(finding.rect.left)},${Math.round(finding.rect.top)},${Math.round(finding.rect.width)}x${Math.round(finding.rect.height)}` : "";
    lines.push(`| ${finding.viewport} | ${finding.sample} | ${finding.selector || finding.tag || ""} | ${finding.textPreview || ""} | ${rect} | ${finding.check} | ${finding.screenshotPath || ""} | ${finding.severity} | ${finding.requiredFix} |`);
  }

  if (report.findings.length === 0) {
    lines.push("| all | all | final UI integrity |  |  | no automated blockers detected by DOM geometry v2 |  | info | Keep screenshot evidence with handoff |");
  }

  if (report.blockedReason) {
    lines.push("", "## Blocked", "", report.blockedReason);
  }

  lines.push("", "## Passed Viewport States");
  for (const state of report.passedViewportStates) {
    lines.push(`- ${state}`);
  }

  lines.push("", "## Failed Viewport States");
  for (const state of report.failedViewportStates) {
    lines.push(`- ${state}`);
  }

  lines.push("", "## Evidence");
  for (const shot of report.screenshots) {
    lines.push(`- ${shot}`);
  }

  write(path.join(outDir, "final-ui-integrity-report.md"), `${lines.join("\n")}\n`);
}

function blockedReport(reason) {
  const report = {
    url: url ?? null,
    finalUiIntegrityGateVersion: gateVersion,
    createdAt: new Date().toISOString(),
    verdict: "blocked",
    finalHandoffAllowed: false,
    widthSweepTested: widthSweep,
    heightMatrixTested: heightMatrix,
    scrollSamples,
    stateSamples,
    captureFailuresOnly,
    screenshotDir: outDir,
    blockerCount: 1,
    passedViewportStates: [],
    failedViewportStates: ["blocked:tooling"],
    screenshots: [],
    findings: [
      {
        check: "final UI integrity gate",
        evidence: reason,
        result: "blocked",
        severity: "blocker",
        requiredFix: "Run the gate with a local URL and screenshot evidence before final handoff."
      }
    ],
    blockedReason: reason
  };
  writeReports(report);
  console.error(reason);
  process.exit(failOnBlocker ? 2 : 0);
}

if (!url) {
  blockedReport("Missing --url <target>. Final UI integrity cannot pass without a runnable UI.");
}

if (widthSweep.length === 0 || heightMatrix.length === 0) {
  blockedReport("Missing or invalid width/height matrix. Final UI integrity v3 requires --width-sweep and --heights.");
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  blockedReport(`Playwright is unavailable, so no browser geometry checks were run. ${error.message}`);
}

const findings = [];
const screenshots = [];
const browser = await chromium.launch({ headless: true });

function normalizeFinding(finding, viewport, sample, screenshotPath) {
  return {
    viewport,
    sample,
    screenshotPath,
    check: finding.check,
    evidence: finding.evidence,
    selector: finding.selector || finding.check,
    tag: finding.tag || "",
    textPreview: finding.textPreview || "",
    rect: finding.rect || null,
    result: finding.result || "failed",
    severity: finding.severity || "blocker",
    requiredFix: finding.requiredFix || "Fix the visual integrity issue and rerun final-ui-integrity-check."
  };
}

try {
  for (const width of widthSweep) {
    for (const height of heightMatrix) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(250);
      const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));

      for (const sample of scrollSamples) {
        const scrollY = Math.round(maxScroll * sample);
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(120);

      const result = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const issues = [];
        const rectFor = (element) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height
          };
        };
        const area = (rect) => Math.max(0, rect.width) * Math.max(0, rect.height);
        const overlapRect = (a, b) => {
          const left = Math.max(a.left, b.left);
          const top = Math.max(a.top, b.top);
          const right = Math.min(a.right, b.right);
          const bottom = Math.min(a.bottom, b.bottom);
          return { left, top, right, bottom, width: Math.max(0, right - left), height: Math.max(0, bottom - top) };
        };
        const overlaps = (a, b) => overlapRect(a, b).width > 1 && overlapRect(a, b).height > 1;
        const isVisible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
        };
        const textOf = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100);
        const textPreviewOf = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
        const nameOf = (element) => element.getAttribute("data-layout-critical")
          || element.getAttribute("data-protected-text")
          || element.getAttribute("data-card")
          || element.getAttribute("data-panel")
          || element.getAttribute("data-active-panel")
          || element.getAttribute("data-detail-trigger")
          || element.getAttribute("data-detail-panel")
          || element.getAttribute("data-sticker")
          || element.getAttribute("data-floating-object")
          || element.getAttribute("data-floating-anchor")
          || element.getAttribute("data-overlay-object")
          || element.getAttribute("data-media-object")
          || element.getAttribute("data-nav-item")
          || element.getAttribute("data-nav-id")
          || element.getAttribute("data-nav-primary")
          || element.getAttribute("data-nav-mobile")
          || element.getAttribute("data-layered-container")
          || element.getAttribute("data-backplate")
          || element.getAttribute("data-frontplate")
          || element.getAttribute("data-horizontal-stage")
          || element.getAttribute("data-scroll-stage")
          || element.getAttribute("aria-label")
          || element.id
          || element.tagName.toLowerCase();
        const issueBase = (element) => ({
          selector: nameOf(element),
          tag: element.tagName.toLowerCase(),
          textPreview: textPreviewOf(element),
          rect: rectFor(element)
        });
        const isInViewport = (element) => {
          const rect = rectFor(element);
          return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
        };
        const centerDistance = (a, b) => {
          const ax = a.left + a.width / 2;
          const ay = a.top + a.height / 2;
          const bx = b.left + b.width / 2;
          const by = b.top + b.height / 2;
          return Math.hypot(ax - bx, ay - by);
        };
        const isApprovedClamp = (element, style) => {
          if (element.hasAttribute("data-truncation-approved")) return true;
          const lineClamp = style.webkitLineClamp || style.lineClamp;
          return lineClamp && lineClamp !== "none" && lineClamp !== "0";
        };
        const isCriticalText = (element) => element.matches(
          "[data-layout-critical], [data-protected-text], [data-nav-label], [data-nav-item], button, [role='button'], a, h1, h2, h3, h4, [data-card], [data-panel], [data-active-panel], [data-text-fit], [data-cta]"
        );
        const viewportCropAllowed = (element) => element.getAttribute("data-viewport-crop-allowed") === "true" || element.getAttribute("data-editorial-crop") === "intentional";
        const hasLiveJustification = (element) => Boolean(
          element.closest("[data-live-justified='true'], [data-live-source], [data-update-cadence], [data-realtime-source]")
          || document.body.matches("[data-live-justified='true'], [data-live-source], [data-update-cadence], [data-realtime-source]")
          || document.documentElement.matches("[data-live-justified='true'], [data-live-source], [data-update-cadence], [data-realtime-source]")
        );
        const hasTheaterJustification = (element) => Boolean(
          element.closest("[data-ai-theater-justified='true'], [data-theater-justified='true'], [data-domain-object], [data-product-behavior], [data-replay-source], [data-real-severity], [data-case-id-source]")
          || document.body.matches("[data-ai-theater-justified='true'], [data-theater-justified='true'], [data-domain-object], [data-product-behavior], [data-replay-source], [data-real-severity], [data-case-id-source]")
          || document.documentElement.matches("[data-ai-theater-justified='true'], [data-theater-justified='true'], [data-domain-object], [data-product-behavior], [data-replay-source], [data-real-severity], [data-case-id-source]")
        );
        const hasDomainJustification = (element) => Boolean(
          element.closest("[data-domain-content-contract], [data-domain-term-justified='true'], [data-business-domain], [data-domain-entity], [data-route-job], [data-real-mock-data], [data-data-contract], [data-observability-domain='true']")
          || document.body.matches("[data-domain-content-contract], [data-domain-term-justified='true'], [data-business-domain], [data-domain-entity], [data-route-job], [data-real-mock-data], [data-data-contract], [data-observability-domain='true']")
          || document.documentElement.matches("[data-domain-content-contract], [data-domain-term-justified='true'], [data-business-domain], [data-domain-entity], [data-route-job], [data-real-mock-data], [data-data-contract], [data-observability-domain='true']")
        );
        const liveTextPattern = /\b(LIVE|live feed|live lobby feed|live activity|real[-\s]?time|online now|currently live|streaming|presence|activity feed)\b/i;
        const theaterTextPattern = /\b(Narrative|Fictional incident|Replay|Mission Room|Mission|Case File|dossier|SEV-\d+|CL-\d{2,})\b/i;
        const domainTheaterTextPattern = /\b(Mission Control|Control Room|Command Center|Topology|Traces|System Map)\b/i;

        const textElements = [...document.querySelectorAll("body *")]
          .filter(isVisible)
          .filter((element) => textOf(element).length > 0);

        for (const element of textElements) {
          const style = getComputedStyle(element);
          const text = textOf(element);
          const name = nameOf(element);

          if (liveTextPattern.test(text) && !hasLiveJustification(element)) {
            issues.push({
              check: "fake live/realtime copy",
              evidence: `${name}: "${text}" uses live/realtime/status language without data-live justification`,
              ...issueBase(element),
              severity: "blocker",
              requiredFix: "Remove fake live/realtime language or document real live behavior with data-live-justified, data-live-source, data-update-cadence, or data-realtime-source."
            });
          }

          if (theaterTextPattern.test(text) && !hasTheaterJustification(element)) {
            issues.push({
              check: "AI-theater chrome",
              evidence: `${name}: "${text}" uses narrative/replay/mission/case-file theater without product-behavior justification`,
              ...issueBase(element),
              severity: "blocker",
              requiredFix: "Remove fake narrative/replay/mission/case-file chrome or document real product behavior with data-ai-theater-justified, data-domain-object, data-product-behavior, data-replay-source, data-real-severity, or data-case-id-source."
            });
          }

          if (domainTheaterTextPattern.test(text) && !hasDomainJustification(element)) {
            issues.push({
              check: "generic domain theater",
              evidence: `${name}: "${text}" uses abstract app/dashboard terminology without a Domain Content Contract`,
              ...issueBase(element),
              severity: "blocker",
              requiredFix: "Replace generic domain theater with real business sections and mock data, or document a real domain/data contract with data-domain-content-contract, data-business-domain, data-domain-entity, data-route-job, data-real-mock-data, data-data-contract, or data-observability-domain."
            });
          }

          if (element.scrollWidth > element.clientWidth + 1) {
            issues.push({
              check: "text clipping",
              evidence: `${name}: "${text}" scrollWidth ${element.scrollWidth} > clientWidth ${element.clientWidth}`,
              ...issueBase(element),
              severity: isCriticalText(element) ? "blocker" : "major",
              requiredFix: "Resize/reflow the container or text; do not hide critical text."
            });
          }

          if (element.scrollHeight > element.clientHeight + 1) {
            issues.push({
              check: "text overflow",
              evidence: `${name}: "${text}" scrollHeight ${element.scrollHeight} > clientHeight ${element.clientHeight}`,
              ...issueBase(element),
              severity: isCriticalText(element) ? "blocker" : "major",
              requiredFix: "Remove fixed height, adjust wrapping, or resize the text container."
            });
          }

          const overflowTextRisk = ["hidden", "clip"].some((value) => [style.overflow, style.overflowX, style.overflowY].includes(value));
          if (overflowTextRisk && !isApprovedClamp(element, style) && isCriticalText(element)) {
            issues.push({
              check: "hidden text risk",
              evidence: `${name}: critical text "${text}" uses overflow ${style.overflow}/${style.overflowX}/${style.overflowY}`,
              ...issueBase(element),
              severity: "blocker",
              requiredFix: "Do not use overflow hidden/clip to hide critical text-fit failures."
            });
          }

          let parent = element.parentElement;
          while (parent && parent !== document.body) {
            const parentStyle = getComputedStyle(parent);
            const clips = ["hidden", "clip"].some((value) => [parentStyle.overflow, parentStyle.overflowX, parentStyle.overflowY].includes(value));
            if (clips) {
              const rect = rectFor(element);
              const parentRect = rectFor(parent);
              const clippedByParent = rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1 || rect.top < parentRect.top - 1 || rect.bottom > parentRect.bottom + 1;
              if (clippedByParent && isCriticalText(element)) {
                issues.push({
                  check: "parent clipping critical text",
                  evidence: `${name}: "${text}" is clipped by ${nameOf(parent)} overflow ${parentStyle.overflow}/${parentStyle.overflowX}/${parentStyle.overflowY}`,
                  ...issueBase(element),
                  severity: "blocker",
                  requiredFix: "Resize/reflow the parent or remove overflow clipping around critical text."
                });
              }
            }
            parent = parent.parentElement;
          }

          if (element.matches("[data-text-fit]")) {
            const rect = rectFor(element);
            const minWidth = Number.parseInt(element.getAttribute("data-text-fit"), 10) || 220;
            const ratio = rect.width > 0 ? rect.height / rect.width : 0;
            if (rect.width < minWidth || (text.length > 35 && rect.width < 190 && ratio > 1.85)) {
              issues.push({
                check: "unreadable container",
                evidence: `${name}: "${text}" width ${Math.round(rect.width)}, minimum ${minWidth}, height/width ${ratio.toFixed(2)}`,
                ...issueBase(element),
                severity: "blocker",
                requiredFix: "Give text a readable minimum width or stack/reflow the layout."
              });
            }
          }
        }

        const liveIndicators = [...document.querySelectorAll("[data-live-indicator], [data-live-dot], [data-presence-indicator], [data-activity-indicator]")]
          .filter(isVisible);
        for (const indicator of liveIndicators) {
          if (hasLiveJustification(indicator)) continue;
          issues.push({
            check: "fake live/realtime indicator",
            evidence: `${nameOf(indicator)} has live/presence/activity indicator hook without live behavior proof`,
            ...issueBase(indicator),
            severity: "blocker",
            requiredFix: "Remove fake live/status indicator or provide real live behavior proof with data-live-source and data-update-cadence."
          });
        }

        const parseColor = (value) => {
          const match = String(value).match(/rgba?\(([^)]+)\)/i);
          if (!match) return null;
          const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
          if (parts.length < 3 || parts.some((part, index) => index < 3 && !Number.isFinite(part))) return null;
          return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1 };
        };
        const srgb = (channel) => {
          const value = channel / 255;
          return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        };
        const luminance = (color) => 0.2126 * srgb(color.r) + 0.7152 * srgb(color.g) + 0.0722 * srgb(color.b);
        const contrastRatio = (a, b) => {
          const l1 = luminance(a);
          const l2 = luminance(b);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        };
        const nearestBackground = (element) => {
          let current = element.parentElement;
          while (current && current !== document.documentElement) {
            const color = parseColor(getComputedStyle(current).backgroundColor);
            if (color && color.a > 0.2) return { element: current, color };
            current = current.parentElement;
          }
          const bodyColor = parseColor(getComputedStyle(document.body).backgroundColor);
          return bodyColor ? { element: document.body, color: bodyColor } : null;
        };
        const hueOf = (color) => {
          const r = color.r / 255;
          const g = color.g / 255;
          const b = color.b / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          if (delta === 0) return { h: 0, s: 0, l: (max + min) / 2 };
          const l = (max + min) / 2;
          const s = delta / (1 - Math.abs(2 * l - 1));
          let h = 0;
          if (max === r) h = 60 * (((g - b) / delta) % 6);
          else if (max === g) h = 60 * ((b - r) / delta + 2);
          else h = 60 * ((r - g) / delta + 4);
          return { h: h < 0 ? h + 360 : h, s, l };
        };
        const isBannedSepiaSurfaceColor = (color) => {
          if (!color || color.a <= 0.45) return false;
          const { h, s, l } = hueOf(color);
          return l < 0.32 && s > 0.12 && h >= 20 && h <= 58 && color.r > color.b + 8 && color.g > color.b + 4;
        };
        const surfaceSelector = [
          "body",
          "main",
          "section",
          "article",
          "aside",
          "header",
          "nav",
          "dialog",
          "[role='dialog']",
          "[data-card]",
          "[data-panel]",
          "[data-container]",
          "[data-surface]",
          "[data-stage]",
          "[data-sidebar]",
          "[data-nav-primary]",
          "[data-modal]",
          "[data-drawer]",
          "[data-detail-panel]",
          "[data-command-container]",
          "[data-note]",
          "[class*='card']",
          "[class*='panel']",
          "[class*='container']",
          "[class*='sidebar']",
          "[class*='nav']"
        ].join(",");
        const surfaceElements = [...document.querySelectorAll(surfaceSelector)].filter(isVisible);
        for (const surface of surfaceElements) {
          const rect = surface.getBoundingClientRect();
          const largeEnough = rect.width * rect.height > viewportWidth * viewportHeight * 0.015;
          const explicitlySurface = surface.matches("[data-card], [data-panel], [data-container], [data-surface], [data-stage], [data-sidebar], [data-nav-primary], [data-modal], [data-drawer], [data-detail-panel], [data-command-container], [data-note], body, main, section, article, aside, header, nav, dialog, [role='dialog']");
          if (!largeEnough && !explicitlySurface) continue;
          const background = parseColor(getComputedStyle(surface).backgroundColor);
          if (isBannedSepiaSurfaceColor(background)) {
            issues.push({
              check: "sepia/espresso container surface",
              evidence: `${nameOf(surface)} uses banned sepia/espresso/umber surface rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
              ...issueBase(surface),
              severity: "blocker",
              requiredFix: "Replace the muddy sepia/espresso/umber surface with an authored palette before final handoff."
            });
          }
        }
        const brandElements = [...document.querySelectorAll("[data-brand-chrome], [data-app-name], [data-wordmark]")]
          .filter(isVisible)
          .filter((element) => textOf(element).length > 0);
        for (const brand of brandElements) {
          if (brand.getAttribute("data-brand-contrast-safe") === "true") continue;
          const textColor = parseColor(getComputedStyle(brand).color);
          const background = nearestBackground(brand);
          const variableBackground = Boolean(brand.closest("[data-variable-background], [data-image-background], [data-dark-background], [data-media-stage]"));
          const contrast = textColor && background ? contrastRatio(textColor, background.color) : null;
          if (variableBackground || (contrast !== null && contrast < 4.5)) {
            issues.push({
              check: "brand chrome readability",
              evidence: `${nameOf(brand)} "${textOf(brand)}" lacks data-brand-contrast-safe proof${contrast !== null ? `; estimated contrast ${contrast.toFixed(2)}:1` : ""}`,
              ...issueBase(brand),
              severity: "blocker",
              requiredFix: "Move brand chrome to a stable surface, add a plate/scrim/adaptive token, or mark data-brand-contrast-safe after contrast proof."
            });
          }
        }

        const navItems = [...document.querySelectorAll("[data-nav-item]")].filter(isVisible);
        for (const item of navItems) {
          const label = item.querySelector("[data-nav-label]") || item;
          const labelRect = rectFor(label);
          const itemRect = rectFor(item);
          const visualLabel = textOf(label);
          const isCompact = item.hasAttribute("data-nav-compact") || viewportWidth <= 768;
          const hasIcon = item.hasAttribute("data-nav-icon") || Boolean(item.querySelector("[data-nav-icon]"));
          const hasFullLabel = Boolean(item.getAttribute("aria-label") || item.getAttribute("data-nav-full-label") || item.querySelector("[data-nav-full-label], .sr-only"));
          const looksLikeCode = /^[A-Z0-9]{1,2}$/.test(visualLabel);

          if (labelRect.left < itemRect.left - 1 || labelRect.right > itemRect.right + 1 || labelRect.top < itemRect.top - 1 || labelRect.bottom > itemRect.bottom + 1) {
              issues.push({
                check: "nav overflow",
                evidence: `${nameOf(item)} label "${visualLabel}" exceeds nav item bounds`,
                ...issueBase(item),
                severity: "blocker",
              requiredFix: "Fix nav label sizing or compact variant."
            });
          }

          if (isCompact && looksLikeCode && !hasIcon) {
              issues.push({
                check: "mobile/compact nav clarity",
                evidence: `${nameOf(item)} uses compact code "${visualLabel}" without icon fallback`,
                ...issueBase(item),
                severity: "blocker",
              requiredFix: "Use an icon system or real menu pattern with full accessible labels."
            });
          }

          if (isCompact && !hasFullLabel) {
              issues.push({
                check: "mobile/compact nav clarity",
                evidence: `${nameOf(item)} has no aria-label or data-nav-full-label`,
                ...issueBase(item),
                severity: "blocker",
              requiredFix: "Add full accessible label source for compact nav."
            });
          }
        }

        const navContainers = [...document.querySelectorAll("[data-nav-compact], [data-scroll-nav], nav")]
          .filter(isVisible);
        for (const nav of navContainers) {
          const navRect = rectFor(nav);
          const items = [...nav.querySelectorAll("[data-nav-item], a, button")].filter(isVisible);
          if (items.length < 2 || navRect.width < 360) continue;
          const union = items.map(rectFor).reduce((acc, rect) => ({
            left: Math.min(acc.left, rect.left),
            top: Math.min(acc.top, rect.top),
            right: Math.max(acc.right, rect.right),
            bottom: Math.max(acc.bottom, rect.bottom),
            width: Math.max(acc.right, rect.right) - Math.min(acc.left, rect.left),
            height: Math.max(acc.bottom, rect.bottom) - Math.min(acc.top, rect.top)
          }), rectFor(items[0]));
          if (union.width < navRect.width * 0.35 && navRect.width > 500) {
              issues.push({
                check: "nav overflow",
                evidence: `${nameOf(nav)} item content occupies ${Math.round(union.width)}px of ${Math.round(navRect.width)}px nav width`,
                ...issueBase(nav),
                severity: "major",
              requiredFix: "Use a content-aware nav container or compact pattern without huge empty space."
            });
          }
        }

        const routeNavExpected = Boolean(
          document.body.matches("[data-route-experience], [data-app-like], [data-scroll-heavy], [data-route-nav-required]")
          || document.documentElement.matches("[data-route-experience], [data-app-like], [data-scroll-heavy], [data-route-nav-required]")
          || document.querySelector("[data-route-nav-required], [data-nav-persistent='expected'], [data-nav-primary][data-nav-persistent], [data-scroll-stage], [data-horizontal-stage]")
        );
        if (viewportWidth <= 768 && routeNavExpected) {
          const primaryNav = document.querySelector("[data-nav-primary]");
          const mobileNav = document.querySelector("[data-nav-mobile]");
          const candidateNav = mobileNav || primaryNav;
          if (!mobileNav) {
            issues.push({
              check: "mobile bottom nav",
              evidence: "route/app mobile experience has no data-nav-mobile bottom route controller",
              selector: "data-nav-mobile",
              tag: "nav",
              rect: { left: 0, top: 0, right: viewportWidth, bottom: viewportHeight, width: viewportWidth, height: viewportHeight },
              severity: "blocker",
              requiredFix: "Provide persistent bottom mobile navigation or an approved bottom-accessible route controller."
            });
          }
          if (candidateNav && isVisible(candidateNav)) {
            const navRect = rectFor(candidateNav);
            const style = getComputedStyle(candidateNav);
            const fixedOrSticky = style.position === "fixed" || style.position === "sticky";
            const declaredBottom = candidateNav.getAttribute("data-nav-position") === "bottom";
            const bottomAccessible = declaredBottom || (fixedOrSticky && navRect.top > viewportHeight * 0.45);
            if (!bottomAccessible) {
              issues.push({
                check: "mobile bottom nav",
                evidence: `${nameOf(candidateNav)} is not bottom-positioned/persistent for mobile route access`,
                ...issueBase(candidateNav),
                severity: "blocker",
                requiredFix: "Move mobile route navigation to a persistent bottom nav/controller or document an approved bottom-accessible alternative."
              });
            }
            if (window.scrollY > 20 && (navRect.bottom <= 0 || navRect.top >= viewportHeight || !fixedOrSticky) && candidateNav.getAttribute("data-nav-persistent") !== "false") {
              issues.push({
                check: "mobile nav disappears on scroll",
                evidence: `${nameOf(candidateNav)} is not persistent/visible after scrollY ${Math.round(window.scrollY)}`,
                ...issueBase(candidateNav),
                severity: "blocker",
                requiredFix: "Use fixed/sticky bottom navigation or a persistent bottom-accessible route controller for mobile."
              });
            }
            if ((declaredBottom || fixedOrSticky) && navRect.top > viewportHeight * 0.45 && !candidateNav.hasAttribute("data-nav-safe-area")) {
              issues.push({
                check: "mobile bottom nav safe area",
                evidence: `${nameOf(candidateNav)} is bottom positioned but lacks data-nav-safe-area proof`,
                ...issueBase(candidateNav),
                severity: "major",
                requiredFix: "Add safe-area inset handling and mark it with data-nav-safe-area."
              });
            }
          }
        }

        const detailTriggers = [...document.querySelectorAll("[data-detail-trigger]")]
          .filter(isVisible);
        const detailPanels = [...document.querySelectorAll("[data-detail-panel]")]
          .filter(isVisible);
        const triggerById = new Map();
        for (const trigger of detailTriggers) {
          const triggerId = trigger.id || trigger.getAttribute("data-detail-trigger");
          if (triggerId) triggerById.set(triggerId, trigger);
        }
        for (const panel of detailPanels) {
          const detailFor = panel.getAttribute("data-detail-for");
          const detachedAllowed = panel.getAttribute("data-detail-detached-allowed") === "true";
          if (!detailFor) {
            issues.push({
              check: "detail reveal anchor",
              evidence: `${nameOf(panel)} is visible but has no data-detail-for trigger relationship`,
              ...issueBase(panel),
              severity: "blocker",
              requiredFix: "Set data-detail-for to the selected trigger id or use an explicit detached/focus-linked reveal pattern."
            });
            continue;
          }
          const trigger = triggerById.get(detailFor) || document.getElementById(detailFor);
          if (!trigger) {
            issues.push({
              check: "detail reveal anchor",
              evidence: `${nameOf(panel)} references missing trigger "${detailFor}"`,
              ...issueBase(panel),
              severity: "blocker",
              requiredFix: "Ensure data-detail-for matches a real data-detail-trigger or trigger id."
            });
            continue;
          }
          if (!detachedAllowed && isVisible(trigger) && isInViewport(panel) && isInViewport(trigger)) {
            const triggerRect = rectFor(trigger);
            const panelRect = rectFor(panel);
            const connected = overlaps(triggerRect, panelRect) || centerDistance(triggerRect, panelRect) <= Math.max(360, viewportWidth * 0.42);
            if (!connected) {
              issues.push({
                check: "detail reveal disconnected from trigger",
                evidence: `${nameOf(panel)} is far from ${nameOf(trigger)} with no data-detail-detached-allowed proof`,
                selector: `${nameOf(trigger)} / ${nameOf(panel)}`,
                tag: `${trigger.tagName.toLowerCase()} / ${panel.tagName.toLowerCase()}`,
                textPreview: `${textOf(trigger)} ${textOf(panel)}`.trim().slice(0, 80),
                rect: panelRect,
                severity: "blocker",
                requiredFix: "Use inline expansion, adjacent panel, anchored popover, connected drawer, split view, or mobile sheet tied to the selected trigger."
              });
            }
          }
        }
        const selectedTriggers = detailTriggers.filter((trigger) => trigger.matches("[data-selected-item], [aria-selected='true'], [aria-expanded='true'], [data-active='true'], [data-state='selected']"));
        for (const trigger of selectedTriggers) {
          const triggerId = trigger.id || trigger.getAttribute("data-detail-trigger");
          const matchingPanel = triggerId ? detailPanels.find((panel) => panel.getAttribute("data-detail-for") === triggerId) : null;
          if (!matchingPanel && trigger.getAttribute("data-detail-detached-allowed") !== "true") {
            issues.push({
              check: "selected detail missing panel",
              evidence: `${nameOf(trigger)} is selected/open but no matching visible data-detail-panel was found`,
              ...issueBase(trigger),
              severity: "blocker",
              requiredFix: "Render a visible connected detail panel, focus/scroll to it intentionally, or mark an approved detached route pattern."
            });
          }
        }

        const radiusValue = (element) => {
          const style = getComputedStyle(element);
          const values = [
            style.borderTopLeftRadius,
            style.borderTopRightRadius,
            style.borderBottomRightRadius,
            style.borderBottomLeftRadius
          ].map((value) => Number.parseFloat(value) || 0);
          return Math.max(...values);
        };
        const layeredContainers = [...document.querySelectorAll("[data-layered-container], [data-media-stage]")]
          .filter(isVisible);
        for (const container of layeredContainers) {
          const front = container.querySelector("[data-frontplate], [data-media-object]") || container.querySelector("[data-card], video, img, picture, canvas");
          const back = container.querySelector("[data-backplate]");
          if (!front || !back || !isVisible(front) || !isVisible(back)) continue;
          const frontRect = rectFor(front);
          const backRect = rectFor(back);
          const frontRadius = radiusValue(front);
          const backRadius = radiusValue(back);
          const exposedSides = [
            backRect.left < frontRect.left - 1,
            backRect.top < frontRect.top - 1,
            backRect.right > frontRect.right + 1,
            backRect.bottom > frontRect.bottom + 1
          ].filter(Boolean).length;
          const maxOffset = Math.max(
            Math.abs(backRect.left - frontRect.left),
            Math.abs(backRect.top - frontRect.top),
            Math.abs(backRect.right - frontRect.right),
            Math.abs(backRect.bottom - frontRect.bottom)
          );
          if (!overlaps(frontRect, backRect)) {
            issues.push({
              check: "layered container alignment",
              evidence: `${nameOf(back)} does not geometrically overlap ${nameOf(front)}`,
              selector: `${nameOf(container)} / ${nameOf(front)} / ${nameOf(back)}`,
              tag: `${container.tagName.toLowerCase()} / ${front.tagName.toLowerCase()} / ${back.tagName.toLowerCase()}`,
              textPreview: textPreviewOf(container),
              rect: rectFor(container),
              severity: "blocker",
              requiredFix: "Align frontplate and backplate so the layered frame reads as one intentional construction."
            });
          }
          if (Math.abs(frontRadius - backRadius) > 3 && container.getAttribute("data-radius-mismatch-allowed") !== "true") {
            issues.push({
              check: "layered container radius mismatch",
              evidence: `${nameOf(front)} radius ${frontRadius}px differs from ${nameOf(back)} radius ${backRadius}px`,
              ...issueBase(container),
              severity: "blocker",
              requiredFix: "Use shared radius tokens/CSS variables for frontplate and backplate or document an intentional mismatch."
            });
          }
          if (exposedSides === 1 && container.getAttribute("data-single-side-offset-allowed") !== "true") {
            issues.push({
              check: "messy offset/backplate corner",
              evidence: `${nameOf(back)} is exposed on only one side of ${nameOf(front)}, which often reads as an accidental corner leak`,
              ...issueBase(container),
              severity: "blocker",
              requiredFix: "Use a deliberate two-side offset, align the backplate, clip overflow, or remove the backing layer."
            });
          }
          if (maxOffset > Math.max(48, Math.min(frontRect.width, frontRect.height) * 0.18) && container.getAttribute("data-large-offset-allowed") !== "true") {
            issues.push({
              check: "layered container alignment",
              evidence: `${nameOf(back)} offset differs from ${nameOf(front)} by up to ${Math.round(maxOffset)}px`,
              ...issueBase(container),
              severity: "major",
              requiredFix: "Define a smaller intentional offset amount or document large offset behavior."
            });
          }
        }

        const containers = [...document.querySelectorAll("[data-card], [data-panel], [data-active-panel], [data-sticker], [data-floating-object], [data-overlay-object], [data-layout-critical], [data-protected-text], [data-fixed-overlay]")]
          .filter(isVisible);
        for (let i = 0; i < containers.length; i += 1) {
          for (let j = i + 1; j < containers.length; j += 1) {
            const a = containers[i];
            const b = containers[j];
            if (a.contains(b) || b.contains(a)) continue;
            if (a.getAttribute("data-overlap-allowed") === "true" || b.getAttribute("data-overlap-allowed") === "true") continue;
            const aRect = rectFor(a);
            const bRect = rectFor(b);
            const overlap = overlapRect(aRect, bRect);
            if (area(overlap) < 64) continue;
            const aText = textOf(a);
            const bText = textOf(b);
            const coversText = aText.length > 0 || bText.length > 0;
            issues.push({
              check: "card/container overlap",
              evidence: `${nameOf(a)} overlaps ${nameOf(b)} by ${Math.round(overlap.width)}x${Math.round(overlap.height)}${coversText ? " with text in the overlap pair" : ""}`,
              selector: `${nameOf(a)} / ${nameOf(b)}`,
              tag: `${a.tagName.toLowerCase()} / ${b.tagName.toLowerCase()}`,
              textPreview: `${textOf(a)} ${textOf(b)}`.trim().slice(0, 80),
              rect: overlap,
              severity: coversText ? "blocker" : "major",
              requiredFix: "Separate containers or document intentional overlap with protected readable zones."
            });
          }
        }

        const floatingObjects = [...document.querySelectorAll("[data-floating-object]")]
          .filter(isVisible);
        for (const floating of floatingObjects) {
          const floatingRect = rectFor(floating);
          const anchorId = floating.getAttribute("data-floating-anchor");
          const parent = anchorId
            ? document.querySelector(`[data-floating-anchor="${CSS.escape(anchorId)}"], #${CSS.escape(anchorId)}`) || floating.parentElement
            : floating.parentElement;
          if (parent && parent !== document.body) {
            const parentRect = rectFor(parent);
            if (floatingRect.left < parentRect.left - 1 || floatingRect.right > parentRect.right + 1 || floatingRect.top < parentRect.top - 1 || floatingRect.bottom > parentRect.bottom + 1) {
              issues.push({
                check: "floating object outside intended parent",
                evidence: `${nameOf(floating)} escapes ${nameOf(parent)} bounds`,
                ...issueBase(floating),
                severity: "blocker",
                requiredFix: "Anchor the floating object inside a local parent zone with responsive placement rules."
              });
            }
          }
          if (!anchorId && (!parent || parent === document.body)) {
            issues.push({
              check: "floating object resize drift",
              evidence: `${nameOf(floating)} has no local parent anchor or data-floating-anchor`,
              ...issueBase(floating),
              severity: "major",
              requiredFix: "Assign a local anchor zone and prove the floating object stays safe across the width sweep."
            });
          }
          if (floatingRect.left < -1 || floatingRect.right > viewportWidth + 1) {
            issues.push({
              check: "floating object produces viewport overflow",
              evidence: `${nameOf(floating)} crosses viewport width`,
              ...issueBase(floating),
              severity: "blocker",
              requiredFix: "Constrain floating object movement range across the viewport matrix."
            });
          }
        }

        const protectedText = [...document.querySelectorAll("[data-protected-text], [data-layout-critical], [data-active-panel], [data-panel], [data-nav-label], [data-card] h1, [data-card] h2, [data-card] h3, [data-card] p, [data-panel] h1, [data-panel] h2, [data-panel] h3, [data-panel] p, button, [role='button'], [data-cta]")]
          .filter(isVisible)
          .filter((element) => textOf(element).length > 0);
        const mediaObjects = [...document.querySelectorAll("[data-media-object], video, img, picture, canvas, svg[data-media-object], [data-overlay-object]")]
          .filter(isVisible);

        for (const media of mediaObjects) {
          const mediaRect = rectFor(media);
          for (const textElement of protectedText) {
            if (media.contains(textElement) || textElement.contains(media)) continue;
            if (!overlaps(mediaRect, rectFor(textElement))) continue;
            issues.push({
              check: "media/image/video over text",
              evidence: `${nameOf(media)} overlaps ${nameOf(textElement)}: "${textOf(textElement)}"`,
              selector: `${nameOf(media)} / ${nameOf(textElement)}`,
              tag: `${media.tagName.toLowerCase()} / ${textElement.tagName.toLowerCase()}`,
              textPreview: textPreviewOf(textElement),
              rect: overlapRect(mediaRect, rectFor(textElement)),
              severity: "blocker",
              requiredFix: "Move, dock, resize, or remove the media/overlay so readable text is protected."
            });
          }
        }

        const fixedSticky = [...document.querySelectorAll("body *, [data-fixed-overlay]")]
          .filter(isVisible)
          .filter((element) => {
            const position = getComputedStyle(element).position;
            return position === "fixed" || position === "sticky";
          });
        const criticalTargets = [...document.querySelectorAll("[data-layout-critical], [data-protected-text], [data-card], [data-panel], [data-active-panel], [data-text-fit], [data-nav-label], [data-nav-item], [data-cta], button, [role='button'], a")]
          .filter(isVisible)
          .filter((element) => textOf(element).length > 0);

        for (const overlay of fixedSticky) {
          const overlayRect = rectFor(overlay);
          for (const target of criticalTargets) {
            if (overlay.contains(target) || target.contains(overlay)) continue;
            const overlap = overlapRect(overlayRect, rectFor(target));
            if (area(overlap) < 120) continue;
            issues.push({
              check: "fixed/sticky overlay covering content",
              evidence: `${nameOf(overlay)} covers ${nameOf(target)}: "${textOf(target)}"`,
              selector: `${nameOf(overlay)} / ${nameOf(target)}`,
              tag: `${overlay.tagName.toLowerCase()} / ${target.tagName.toLowerCase()}`,
              textPreview: textPreviewOf(target),
              rect: overlap,
              severity: "blocker",
              requiredFix: "Reserve space for fixed/sticky elements or move them away from content."
            });
          }
        }

        const horizontalStages = [...document.querySelectorAll("[data-horizontal-stage], [data-scroll-stage][data-scroll-axis='x'], [data-scroll-route='horizontal']")]
          .filter(isVisible);
        const hasControlledHorizontalStage = horizontalStages.length > 0;

        for (const stage of horizontalStages) {
          const stageRect = rectFor(stage);
          const activePanels = [...stage.querySelectorAll("[data-active-panel], [data-card][data-active='true'], [data-panel][data-active='true'], [aria-current='true']")]
            .filter(isVisible);
          const candidatePanels = activePanels.length > 0
            ? activePanels
            : [...stage.querySelectorAll("[data-card], [data-panel], [data-layout-critical]")]
              .filter(isVisible)
              .filter((element) => textOf(element).length > 0);

          for (const panel of candidatePanels) {
            const rect = rectFor(panel);
            const visible = overlapRect(rect, { left: 0, top: 0, right: viewportWidth, bottom: viewportHeight, width: viewportWidth, height: viewportHeight });
            const visibleRatio = area(rect) > 0 ? area(visible) / area(rect) : 1;
            const clipped = rect.left < -1 || rect.right > viewportWidth + 1 || rect.top < -1 || rect.bottom > viewportHeight + 1;
            if (clipped || visibleRatio < 0.92) {
              issues.push({
                check: activePanels.length > 0 ? "horizontal active panel clipped" : "horizontal scroll partial content",
                evidence: `${nameOf(panel)} in ${nameOf(stage)} is only ${Math.round(visibleRatio * 100)}% visible at rest: "${textOf(panel)}"`,
                selector: `${nameOf(stage)} / ${nameOf(panel)}`,
                tag: `${stage.tagName.toLowerCase()} / ${panel.tagName.toLowerCase()}`,
                textPreview: textPreviewOf(panel),
                rect,
                severity: "blocker",
                requiredFix: "Add snap/settle states, fit the active panel, or simplify the horizontal route to a readable flow."
              });
            }
          }

          if (stageRect.width > viewportWidth * 1.15 && candidatePanels.length === 0) {
            issues.push({
              check: "horizontal route has no readable active content",
              evidence: `${nameOf(stage)} is wider than viewport but has no readable active card/panel marker`,
              ...issueBase(stage),
              severity: "blocker",
              requiredFix: "Declare readable active panels with data-active-panel or downgrade the route."
            });
          }
        }

        if (document.documentElement.scrollWidth > viewportWidth + 2 && !hasControlledHorizontalStage) {
          issues.push({
            check: "body horizontal overflow",
            evidence: `document width ${document.documentElement.scrollWidth} > viewport ${viewportWidth}`,
            selector: "documentElement",
            tag: "html",
            rect: { left: 0, top: 0, right: document.documentElement.scrollWidth, bottom: viewportHeight, width: document.documentElement.scrollWidth, height: viewportHeight },
            severity: "blocker",
            requiredFix: "Remove uncontrolled horizontal overflow or declare a safe data-horizontal-stage with readable active states."
          });
        }

        const meaningfulSelector = "h1,h2,h3,h4,p,button,a,nav,[role='button'],[data-card],[data-panel],[data-active-panel],[data-layout-critical],[data-protected-text],[data-media-object],img,video,canvas";
        const meaningfulArea = [...document.querySelectorAll(meaningfulSelector)]
          .filter(isVisible)
          .map(rectFor)
          .filter((rect) => rect.bottom > 0 && rect.top < viewportHeight)
          .reduce((sum, rect) => {
            const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
            const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            return sum + visibleWidth * visibleHeight;
          }, 0);

        if (!document.querySelector("[data-intentional-blank-stage]") && meaningfulArea < viewportWidth * viewportHeight * 0.06) {
          issues.push({
            check: "blank scroll state",
            evidence: `meaningful visible content area is below 6% of viewport`,
            selector: "body",
            tag: "body",
            rect: { left: 0, top: 0, right: viewportWidth, bottom: viewportHeight, width: viewportWidth, height: viewportHeight },
            severity: "major",
            requiredFix: "Move meaningful content into this state or mark an intentional blank stage with data-intentional-blank-stage."
          });
        }

        for (const target of criticalTargets) {
          if (viewportCropAllowed(target)) continue;
          const rect = rectFor(target);
          if (rect.bottom < -1 || rect.top > viewportHeight + 1) continue;
          if (rect.left < -1 || rect.right > viewportWidth + 1 || rect.top < -1 || rect.bottom > viewportHeight + 1) {
            issues.push({
              check: "viewport-edge clipping",
              evidence: `${nameOf(target)} is partially outside viewport: "${textOf(target)}"`,
              ...issueBase(target),
              severity: "blocker",
              requiredFix: "Keep critical content fully inside the sampled viewport or document an intentional controlled scroll route."
            });
          }
        }

        return issues;
      });

        if (sample === scrollSamples[0]) {
          const navStateResult = await page.evaluate(async () => {
            const issues = [];
            const rectFor = (element) => {
              const rect = element.getBoundingClientRect();
              return {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
              };
            };
            const isVisible = (element) => {
              const style = getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
            };
            const textOf = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
            const navIdOf = (element, index = 0) => element.getAttribute("data-nav-id")
              || element.getAttribute("data-nav-item")
              || element.getAttribute("data-nav-target")
              || element.getAttribute("aria-label")
              || textOf(element)
              || `nav-${index}`;
            const selectorOf = (element, index = 0) => element.getAttribute("data-nav-id")
              || element.getAttribute("data-nav-item")
              || element.getAttribute("aria-label")
              || textOf(element)
              || `nav-${index}`;
            const hasActiveMarker = (element) => {
              const className = String(element.className || "");
              return element.getAttribute("data-nav-active") === "true"
                || element.getAttribute("data-nav-selected") === "true"
                || element.getAttribute("aria-current") === "page"
                || element.getAttribute("aria-current") === "true"
                || element.getAttribute("aria-selected") === "true"
                || /\b(active|selected|current|is-active|is-selected)\b/i.test(className);
            };
            const hasAccessibleActiveMarker = (element) => element.getAttribute("data-nav-active") === "true"
              || element.getAttribute("data-nav-selected") === "true"
              || element.getAttribute("aria-current") === "page"
              || element.getAttribute("aria-current") === "true"
              || element.getAttribute("aria-selected") === "true";
            const currentNavItems = () => [...document.querySelectorAll("[data-nav-item]")]
              .filter(isVisible)
              .filter((element) => !element.closest("[data-nav-test-skip='true']"));
            const initialItems = currentNavItems();
            if (initialItems.length < 2) return issues;

            const clickTargets = initialItems.map((element, index) => ({
              id: navIdOf(element, index),
              label: selectorOf(element, index)
            }));

            for (const target of clickTargets) {
              const itemsBeforeClick = currentNavItems();
              const clicked = itemsBeforeClick.find((element, index) => navIdOf(element, index) === target.id);
              if (!clicked) continue;
              clicked.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
              await new Promise((resolve) => setTimeout(resolve, 90));

              const itemsAfterClick = currentNavItems();
              const clickedAfter = itemsAfterClick.find((element, index) => navIdOf(element, index) === target.id);
              const activeItems = itemsAfterClick.filter(hasActiveMarker);
              const activeIds = activeItems.map((element, index) => navIdOf(element, index));

              if (!clickedAfter || !hasActiveMarker(clickedAfter)) {
                issues.push({
                  check: "navigation active state correctness",
                  evidence: `clicked nav item "${target.label}" did not become active; active items: ${activeIds.join(", ") || "none"}`,
                  selector: target.label,
                  tag: clicked?.tagName?.toLowerCase?.() || "nav-item",
                  textPreview: textOf(clickedAfter || clicked),
                  rect: clickedAfter ? rectFor(clickedAfter) : rectFor(clicked),
                  severity: "blocker",
                  requiredFix: "Key active state by stable nav id and ensure clicked item receives the visual/aria selected state."
                });
              }

              const wrongActive = activeItems.filter((element, index) => navIdOf(element, index) !== target.id);
              if (wrongActive.length > 0) {
                issues.push({
                  check: "navigation active state mismatch",
                  evidence: `clicked "${target.label}" but active item(s) became ${wrongActive.map((element, index) => navIdOf(element, index)).join(", ")}`,
                  selector: target.label,
                  tag: clicked?.tagName?.toLowerCase?.() || "nav-item",
                  textPreview: textOf(clickedAfter || clicked),
                  rect: clickedAfter ? rectFor(clickedAfter) : rectFor(clicked),
                  severity: "blocker",
                  requiredFix: "Fix off-by-one/adjacent nav selection. Use activeNavId and a single navigation config source-of-truth."
                });
              }

              if (activeItems.length > 1 && !document.querySelector("[data-nav-multiselect='true']")) {
                issues.push({
                  check: "navigation active state correctness",
                  evidence: `multiple nav items are active after clicking "${target.label}": ${activeIds.join(", ")}`,
                  selector: target.label,
                  tag: clicked?.tagName?.toLowerCase?.() || "nav-item",
                  textPreview: textOf(clickedAfter || clicked),
                  rect: clickedAfter ? rectFor(clickedAfter) : rectFor(clicked),
                  severity: "blocker",
                  requiredFix: "Ensure exactly one route nav item is active unless multi-select navigation is explicitly marked."
                });
              }

              if (clickedAfter && hasActiveMarker(clickedAfter) && !hasAccessibleActiveMarker(clickedAfter)) {
                issues.push({
                  check: "navigation active aria mismatch",
                  evidence: `clicked nav item "${target.label}" has visual/class active state but no data-nav-active/data-nav-selected/aria-current/aria-selected marker`,
                  selector: target.label,
                  tag: clickedAfter.tagName.toLowerCase(),
                  textPreview: textOf(clickedAfter),
                  rect: rectFor(clickedAfter),
                  severity: "major",
                  requiredFix: "Keep visual active state and accessible active state in sync."
                });
              }
            }

            return issues;
          });
          result.push(...navStateResult);
        }

        const screenshotName = `final-ui-${width}x${height}-${Math.round(sample * 100).toString().padStart(3, "0")}.png`;
        const screenshotPath = path.join(outDir, screenshotName);
        const shouldCapture = !captureFailuresOnly || result.length > 0;
        if (shouldCapture) {
          ensureDir(outDir);
          await page.screenshot({ path: screenshotPath, fullPage: false });
          screenshots.push(screenshotPath);
        }

        for (const issue of result) {
          findings.push(normalizeFinding(issue, `${width}x${height}`, sample, shouldCapture ? screenshotPath : ""));
        }
      }

      await page.close();
    }
  }
} catch (error) {
  findings.push({
    viewport: "all",
    sample: "all",
    check: "final UI integrity gate",
    evidence: error.message,
    result: "blocked",
    severity: "blocker",
    requiredFix: "Fix the runtime/checker blocker and rerun final UI integrity validation."
  });
} finally {
  await browser.close();
}

const hasBlocker = findings.some((finding) => finding.severity === "blocker");
const hasMajor = findings.some((finding) => finding.severity === "major");
const hasBlocked = findings.some((finding) => finding.result === "blocked");
const verdict = hasBlocked ? "blocked" : hasBlocker ? "failed" : hasMajor ? "partial" : "passed";
const failedViewportStates = [...new Set(findings.map((finding) => `${finding.viewport}@${finding.sample}`))];
const allViewportStates = widthSweep.flatMap((width) => heightMatrix.flatMap((height) => scrollSamples.map((sample) => `${width}x${height}@${sample}`)));
const passedViewportStates = allViewportStates.filter((state) => !failedViewportStates.includes(state));

const report = {
  url,
  finalUiIntegrityGateVersion: gateVersion,
  createdAt: new Date().toISOString(),
  verdict,
  finalHandoffAllowed: verdict === "passed",
  widthSweepTested: widthSweep,
  heightMatrixTested: heightMatrix,
  scrollSamples,
  stateSamples,
  captureFailuresOnly,
  screenshotDir: outDir,
  blockerCount: findings.filter((finding) => finding.severity === "blocker").length,
  passedViewportStates,
  failedViewportStates,
  screenshots,
  findings
};

writeReports(report);

console.log(`Final UI integrity report written to ${outDir}. Verdict: ${verdict}.`);

if (failOnBlocker && (verdict === "failed" || verdict === "blocked")) {
  process.exit(1);
}
