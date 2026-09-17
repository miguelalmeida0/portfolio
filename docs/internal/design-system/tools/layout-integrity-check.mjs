#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = undefined) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

const url = readArg("url");
const outDir = readArg("out", "docs/qa/layout-integrity");

function parseWidthSweep(value) {
  const [startRaw, endRaw, stepRaw] = String(value).split(":");
  const start = Number.parseInt(startRaw, 10);
  const end = Number.parseInt(endRaw, 10);
  const step = Number.parseInt(stepRaw, 10);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step) || step <= 0 || end < start) return [];
  const widths = [];
  for (let width = start; width <= end; width += step) widths.push(width);
  if (widths[widths.length - 1] !== end) widths.push(end);
  return widths;
}

const legacyViewports = readArg("viewports");
const viewports = legacyViewports
  ? legacyViewports.split(",").map((value) => Number.parseInt(value.trim(), 10)).filter(Boolean)
  : parseWidthSweep(readArg("width-sweep", "360:1920:40"));
const heights = readArg("heights", "720,844,900,1080")
  .split(",")
  .map((value) => Number.parseInt(value.trim(), 10))
  .filter(Boolean);
const failOnBlocker = String(readArg("fail-on-blocker", "true")) !== "false";

function ensureOutDir() {
  fs.mkdirSync(outDir, { recursive: true });
}

function writeReports(report) {
  ensureOutDir();
  fs.writeFileSync(path.join(outDir, "layout-integrity-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    "# Layout Integrity Report",
    "",
    `Verdict: ${report.verdict}`,
    "",
    `URL: ${report.url ?? "not provided"}`,
    "",
    "## Findings",
    "",
    "| Viewport | Issue | Evidence | Severity |",
    "|---|---|---|---|"
  ];

  for (const finding of report.findings) {
    lines.push(`| ${finding.viewport ?? ""} | ${finding.issue} | ${finding.evidence} | ${finding.severity} |`);
  }

  if (report.findings.length === 0) {
    lines.push("| all | No geometry failures detected by v1 checker | DOM geometry only | info |");
  }

  if (report.blockedReason) {
    lines.push("", "## Blocked", "", report.blockedReason);
  }

  fs.writeFileSync(path.join(outDir, "layout-integrity-report.md"), `${lines.join("\n")}\n`);
}

if (!url) {
  writeReports({
    verdict: "Blocked",
    url: null,
    findings: [
      {
        viewport: "all",
        issue: "missing URL",
        evidence: "Run with --url <target>",
        severity: "blocker"
      }
    ],
    blockedReason: "No URL was provided."
  });
  console.error("Missing --url <target>");
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  writeReports({
    verdict: "Blocked",
    url,
    findings: [],
    blockedReason: `Playwright is unavailable, so no browser geometry checks were run. ${error.message}`
  });
  console.log(`Playwright unavailable. Wrote blocked report to ${outDir}.`);
  process.exit(failOnBlocker ? 2 : 0);
}

const findings = [];
const screenshots = [];
const browser = await chromium.launch();

try {
  for (const width of viewports) {
    for (const height of heights) {
      const viewport = { width, height };
      const page = await browser.newPage({ viewport });
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(250);

      const screenshotPath = path.join(outDir, `layout-integrity-${width}x${height}.png`);
      ensureOutDir();
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);

    const result = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const selector = [
        "body *",
        "[data-layout-critical]",
        "[data-text-fit]",
        "[data-nav-item]",
        "[data-nav-label]",
        "[data-protected-text]",
        "[data-overlay-object]",
        "[data-floating-object]",
        "[data-fixed-overlay]",
        "[data-media-object]",
        "[data-sticker]",
        "[data-card]",
        "[data-live-indicator]",
        "[data-live-dot]",
        "[data-presence-indicator]",
        "[data-activity-indicator]",
        "[data-layered-container]",
        "[data-frontplate]",
        "[data-backplate]"
      ].join(",");

      const isVisible = (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      };

      const textElements = Array.from(document.querySelectorAll(selector))
        .filter(isVisible)
        .filter((element) => (element.textContent || "").trim().length > 0);
      const overlayElements = Array.from(document.querySelectorAll("[data-overlay-object], [data-scroll-object], [data-media-object], [data-floating-object], [data-fixed-overlay]"))
        .filter(isVisible);
      const importantContainers = Array.from(document.querySelectorAll("[data-card], [data-sticker], [data-panel], [data-floating-object], [data-layout-critical]"))
        .filter(isVisible);
      const protectedTextElements = Array.from(document.querySelectorAll("[data-protected-text], [data-layout-critical]"))
        .filter(isVisible)
        .filter((element) => (element.textContent || "").trim().length > 0);
      const navItemElements = Array.from(document.querySelectorAll("[data-nav-item]"))
        .filter(isVisible);

      const issues = [];
      const checkedNavItems = new Set();
      const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
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
          const color = parseColor(window.getComputedStyle(current).backgroundColor);
          if (color && color.a > 0.2) return color;
          current = current.parentElement;
        }
        return parseColor(window.getComputedStyle(document.body).backgroundColor);
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
            issue: "sepia/espresso container surface",
            evidence: `${surface.getAttribute("data-card") || surface.getAttribute("data-panel") || surface.getAttribute("data-container") || surface.tagName.toLowerCase()} uses banned sepia/espresso/umber surface rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
            severity: "blocker"
          });
        }
      }

      for (const element of textElements) {
        const rect = element.getBoundingClientRect();
        const text = (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90);
        const role = element.getAttribute("data-layout-critical")
          || element.getAttribute("data-text-fit")
          || element.getAttribute("data-nav-item")
          || element.getAttribute("data-nav-label")
          || element.tagName.toLowerCase();

        if (liveTextPattern.test(text) && !hasLiveJustification(element)) {
          issues.push({
            issue: "fake live/realtime copy",
            evidence: `${role}: "${text}" has no data-live justification`,
            severity: "blocker"
          });
        }

        if (theaterTextPattern.test(text) && !hasTheaterJustification(element)) {
          issues.push({
            issue: "AI-theater chrome",
            evidence: `${role}: "${text}" has no product-behavior justification`,
            severity: "blocker"
          });
        }

        if (domainTheaterTextPattern.test(text) && !hasDomainJustification(element)) {
          issues.push({
            issue: "generic domain theater",
            evidence: `${role}: "${text}" has no Domain Content Contract or domain/data justification`,
            severity: "blocker"
          });
        }

        if (element.matches("[data-live-indicator], [data-live-dot], [data-presence-indicator], [data-activity-indicator]") && !hasLiveJustification(element)) {
          issues.push({
            issue: "fake live/realtime indicator",
            evidence: `${role}: live/presence/activity indicator has no data-live justification`,
            severity: "blocker"
          });
        }

        if (element.scrollWidth > element.clientWidth + 1) {
          issues.push({
            issue: "horizontal text/container overflow",
            evidence: `${role}: "${text}" scrollWidth ${element.scrollWidth} > clientWidth ${element.clientWidth}`,
            severity: element.matches("button,a,[data-nav-item],[data-nav-label],[data-layout-critical]") ? "blocker" : "major"
          });
        }

        if (element.scrollHeight > element.clientHeight + 1) {
          issues.push({
            issue: "vertical text/container overflow",
            evidence: `${role}: "${text}" scrollHeight ${element.scrollHeight} > clientHeight ${element.clientHeight}`,
            severity: element.matches("button,a,[data-nav-item],[data-nav-label],[data-layout-critical]") ? "blocker" : "major"
          });
        }

        let clippingParent = element.parentElement;
        while (clippingParent && clippingParent !== document.body) {
          const parentStyle = window.getComputedStyle(clippingParent);
          const clips = ["hidden", "clip"].some((value) => [parentStyle.overflow, parentStyle.overflowX, parentStyle.overflowY].includes(value));
          if (clips && element.matches("button,a,[data-nav-item],[data-nav-label],[data-layout-critical],[data-protected-text],[data-text-fit]")) {
            const parentRect = clippingParent.getBoundingClientRect();
            const childRect = element.getBoundingClientRect();
            if (childRect.left < parentRect.left - 1 || childRect.right > parentRect.right + 1 || childRect.top < parentRect.top - 1 || childRect.bottom > parentRect.bottom + 1) {
              issues.push({
                issue: "parent clips critical text",
                evidence: `${role}: "${text}" clipped by parent overflow ${parentStyle.overflow}/${parentStyle.overflowX}/${parentStyle.overflowY}`,
                severity: "blocker"
              });
            }
          }
          clippingParent = clippingParent.parentElement;
        }

        const parent = element.parentElement;
        if (parent && (element.matches("[data-nav-label]") || parent.matches("[data-nav-item]"))) {
          const parentRect = parent.getBoundingClientRect();
          if (rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1 || rect.top < parentRect.top - 1 || rect.bottom > parentRect.bottom + 1) {
            issues.push({
              issue: "nav label exceeds parent item",
              evidence: `"${text}" exceeds ${parent.tagName.toLowerCase()} bounds`,
              severity: "blocker"
            });
          }
        }

        if (element.matches("[data-nav-item]")) {
          checkedNavItems.add(element);
          const visualLabelElement = element.querySelector("[data-nav-label]") || element;
          const visualLabel = (visualLabelElement.textContent || "").trim().replace(/\s+/g, " ");
          const isCompact = element.hasAttribute("data-nav-compact") || viewportWidth <= 768;
          const hasIcon = element.hasAttribute("data-nav-icon") || Boolean(element.querySelector("[data-nav-icon]"));
          const hasFullLabel = Boolean(
            element.getAttribute("aria-label")
              || element.getAttribute("data-nav-full-label")
              || element.querySelector("[data-nav-full-label], .sr-only")
          );
          const looksLikeArbitraryCode = /^[A-Z0-9]{1,2}$/.test(visualLabel);

          if (isCompact && looksLikeArbitraryCode && !hasIcon) {
            issues.push({
              issue: "compact nav uses abbreviation without icon fallback",
              evidence: `${role}: "${visualLabel}" has no data-nav-icon`,
              severity: "blocker"
            });
          }

          if (isCompact && !hasFullLabel) {
            issues.push({
              issue: "compact nav item missing full accessible label source",
              evidence: `${role}: "${visualLabel}" has no aria-label or data-nav-full-label`,
              severity: "blocker"
            });
          }
        }

        if (element.matches("[data-text-fit]")) {
          const rawMinimum = Number.parseInt(element.getAttribute("data-text-fit"), 10);
          const minimum = Number.isFinite(rawMinimum) ? rawMinimum : 220;
          if (rect.width > 0 && rect.width < minimum) {
            issues.push({
              issue: "text-fit container below readable minimum width",
              evidence: `${role}: "${text}" width ${Math.round(rect.width)} < minimum ${minimum}`,
              severity: element.matches("[data-layout-critical]") ? "blocker" : "major"
            });
          }
        }

        if (element.matches("[data-card], [data-text-fit]")) {
          const textLength = (element.textContent || "").trim().replace(/\s+/g, " ").length;
          const heightWidthRatio = rect.width > 0 ? rect.height / rect.width : 0;
          if (textLength > 35 && rect.width < 190 && heightWidthRatio > 1.85) {
            issues.push({
              issue: "possible container thinning to fit media",
              evidence: `${role}: "${text}" width ${Math.round(rect.width)}, height/width ${heightWidthRatio.toFixed(2)}`,
              severity: "blocker"
            });
          }
        }
      }

      const radiusValue = (element) => {
        const style = window.getComputedStyle(element);
        return Math.max(
          Number.parseFloat(style.borderTopLeftRadius) || 0,
          Number.parseFloat(style.borderTopRightRadius) || 0,
          Number.parseFloat(style.borderBottomRightRadius) || 0,
          Number.parseFloat(style.borderBottomLeftRadius) || 0
        );
      };
      const layeredContainers = Array.from(document.querySelectorAll("[data-layered-container], [data-media-stage]"))
        .filter(isVisible);
      for (const container of layeredContainers) {
        const front = container.querySelector("[data-frontplate], [data-media-object]") || container.querySelector("[data-card], video, img, picture, canvas");
        const back = container.querySelector("[data-backplate]");
        if (!front || !back || !isVisible(front) || !isVisible(back)) continue;
        const frontRect = front.getBoundingClientRect();
        const backRect = back.getBoundingClientRect();
        const exposedSides = [
          backRect.left < frontRect.left - 1,
          backRect.top < frontRect.top - 1,
          backRect.right > frontRect.right + 1,
          backRect.bottom > frontRect.bottom + 1
        ].filter(Boolean).length;
        if (!overlaps(frontRect, backRect)) {
          issues.push({
            issue: "layered container alignment",
            evidence: `${container.getAttribute("data-layered-container") || container.tagName.toLowerCase()} backplate does not overlap frontplate`,
            severity: "blocker"
          });
        }
        if (Math.abs(radiusValue(front) - radiusValue(back)) > 3 && container.getAttribute("data-radius-mismatch-allowed") !== "true") {
          issues.push({
            issue: "layered container radius mismatch",
            evidence: `${container.getAttribute("data-layered-container") || container.tagName.toLowerCase()} front/back radii differ`,
            severity: "blocker"
          });
        }
        if (exposedSides === 1 && container.getAttribute("data-single-side-offset-allowed") !== "true") {
          issues.push({
            issue: "messy offset/backplate corner",
            evidence: `${container.getAttribute("data-layered-container") || container.tagName.toLowerCase()} exposes backplate on only one side`,
            severity: "blocker"
          });
        }
      }

      for (const navItem of navItemElements) {
        if (checkedNavItems.has(navItem)) continue;
        const visualLabelElement = navItem.querySelector("[data-nav-label]") || navItem;
        const visualLabel = (visualLabelElement.textContent || "").trim().replace(/\s+/g, " ");
        const role = navItem.getAttribute("data-nav-item") || navItem.tagName.toLowerCase();
        const isCompact = navItem.hasAttribute("data-nav-compact") || viewportWidth <= 768;
        const hasIcon = navItem.hasAttribute("data-nav-icon") || Boolean(navItem.querySelector("[data-nav-icon]"));
        const hasFullLabel = Boolean(
          navItem.getAttribute("aria-label")
            || navItem.getAttribute("data-nav-full-label")
            || navItem.querySelector("[data-nav-full-label], .sr-only")
        );
        const looksLikeArbitraryCode = /^[A-Z0-9]{1,2}$/.test(visualLabel);

        if (isCompact && looksLikeArbitraryCode && !hasIcon) {
          issues.push({
            issue: "compact nav uses abbreviation without icon fallback",
            evidence: `${role}: "${visualLabel}" has no data-nav-icon`,
            severity: "blocker"
          });
        }

        if (isCompact && !hasFullLabel) {
          issues.push({
            issue: "compact nav item missing full accessible label source",
            evidence: `${role}: "${visualLabel || "icon-only"}" has no aria-label or data-nav-full-label`,
            severity: "blocker"
          });
        }
      }

      const brandElements = Array.from(document.querySelectorAll("[data-brand-chrome], [data-app-name], [data-wordmark]"))
        .filter(isVisible)
        .filter((element) => (element.textContent || "").trim().length > 0);
      for (const brand of brandElements) {
        if (brand.getAttribute("data-brand-contrast-safe") === "true") continue;
        const textColor = parseColor(window.getComputedStyle(brand).color);
        const backgroundColor = nearestBackground(brand);
        const variableBackground = Boolean(brand.closest("[data-variable-background], [data-image-background], [data-dark-background], [data-media-stage]"));
        const contrast = textColor && backgroundColor ? contrastRatio(textColor, backgroundColor) : null;
        if (variableBackground || (contrast !== null && contrast < 4.5)) {
          issues.push({
            issue: "brand chrome readability",
            evidence: `${brand.getAttribute("data-app-name") || brand.getAttribute("data-brand-chrome") || brand.tagName.toLowerCase()}: "${(brand.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80)}" lacks contrast proof${contrast !== null ? `; estimated contrast ${contrast.toFixed(2)}:1` : ""}`,
            severity: "blocker"
          });
        }
      }

      for (const overlay of overlayElements) {
        const overlayRect = overlay.getBoundingClientRect();
        const overlayName = overlay.getAttribute("data-overlay-object")
          || overlay.getAttribute("data-scroll-object")
          || overlay.getAttribute("data-media-object")
          || overlay.getAttribute("aria-label")
          || overlay.tagName.toLowerCase();

        for (const protectedElement of protectedTextElements) {
          if (overlay.contains(protectedElement) || protectedElement.contains(overlay)) {
            continue;
          }
          const protectedRect = protectedElement.getBoundingClientRect();
          if (!overlaps(overlayRect, protectedRect)) {
            continue;
          }

          const protectedName = protectedElement.getAttribute("data-protected-text")
            || protectedElement.getAttribute("data-layout-critical")
            || protectedElement.tagName.toLowerCase();
          const text = (protectedElement.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90);
          issues.push({
            issue: "media/overlay object overlaps protected text",
            evidence: `${overlayName} overlaps ${protectedName}: "${text}"`,
            severity: "blocker"
          });
        }
      }

      for (let i = 0; i < importantContainers.length; i += 1) {
        for (let j = i + 1; j < importantContainers.length; j += 1) {
          const a = importantContainers[i];
          const b = importantContainers[j];
          if (a.contains(b) || b.contains(a)) continue;
          if (a.getAttribute("data-overlap-allowed") === "true" || b.getAttribute("data-overlap-allowed") === "true") continue;
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          if (!overlaps(aRect, bRect)) continue;
          const overlapWidth = Math.min(aRect.right, bRect.right) - Math.max(aRect.left, bRect.left);
          const overlapHeight = Math.min(aRect.bottom, bRect.bottom) - Math.max(aRect.top, bRect.top);
          if (overlapWidth * overlapHeight < 64) continue;
          issues.push({
            issue: "important container overlap",
            evidence: `${a.getAttribute("data-floating-object") || a.getAttribute("data-card") || a.tagName.toLowerCase()} overlaps ${b.getAttribute("data-card") || b.getAttribute("data-panel") || b.tagName.toLowerCase()} by ${Math.round(overlapWidth)}x${Math.round(overlapHeight)}`,
            severity: a.matches("[data-floating-object]") || b.matches("[data-floating-object]") ? "blocker" : "major"
          });
        }
      }

      const fixedStickyElements = Array.from(document.querySelectorAll("[data-fixed-overlay], body *"))
        .filter(isVisible)
        .filter((element) => {
          const position = window.getComputedStyle(element).position;
          return position === "fixed" || position === "sticky" || element.matches("[data-fixed-overlay]");
        });
      for (const overlay of fixedStickyElements) {
        const overlayRect = overlay.getBoundingClientRect();
        for (const protectedElement of protectedTextElements) {
          if (overlay.contains(protectedElement) || protectedElement.contains(overlay)) continue;
          const protectedRect = protectedElement.getBoundingClientRect();
          if (!overlaps(overlayRect, protectedRect)) continue;
          issues.push({
            issue: "fixed/sticky overlay collision",
            evidence: `${overlay.getAttribute("data-fixed-overlay") || overlay.tagName.toLowerCase()} covers protected text "${(protectedElement.textContent || "").trim().slice(0, 90)}"`,
            severity: "blocker"
          });
        }
      }

      const edgeCriticalElements = Array.from(document.querySelectorAll("[data-layout-critical], [data-protected-text], [data-card], [data-panel], [data-active-panel], [data-text-fit], [data-nav-item], [data-nav-label], button, [role='button'], a"))
        .filter(isVisible)
        .filter((element) => (element.textContent || "").trim().length > 0)
        .filter((element) => element.getAttribute("data-viewport-crop-allowed") !== "true" && element.getAttribute("data-editorial-crop") !== "intentional");
      for (const element of edgeCriticalElements) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -1 || rect.top > viewportHeight + 1) continue;
        if (rect.left < -1 || rect.right > viewportWidth + 1 || rect.top < -1 || rect.bottom > viewportHeight + 1) {
          issues.push({
            issue: "viewport-edge clipping",
            evidence: `${element.getAttribute("data-layout-critical") || element.getAttribute("data-card") || element.tagName.toLowerCase()} is partially outside viewport: "${(element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90)}"`,
            severity: "blocker"
          });
        }
      }

      const horizontalStages = Array.from(document.querySelectorAll("[data-horizontal-stage], [data-scroll-stage][data-scroll-axis='x'], [data-scroll-route='horizontal']"))
        .filter(isVisible);
      for (const stage of horizontalStages) {
        const activePanels = Array.from(stage.querySelectorAll("[data-active-panel], [data-card][data-active='true'], [data-panel][data-active='true'], [aria-current='true']"))
          .filter(isVisible);
        const panels = activePanels.length > 0
          ? activePanels
          : Array.from(stage.querySelectorAll("[data-card], [data-panel], [data-layout-critical]"))
            .filter(isVisible)
            .filter((element) => (element.textContent || "").trim().length > 0);
        for (const panel of panels) {
          const rect = panel.getBoundingClientRect();
          const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
          const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
          const visibleRatio = rect.width * rect.height > 0 ? (visibleWidth * visibleHeight) / (rect.width * rect.height) : 1;
          if (visibleRatio < 0.92 || rect.left < -1 || rect.right > viewportWidth + 1) {
            issues.push({
              issue: activePanels.length > 0 ? "horizontal active panel clipped" : "horizontal scroll partial content",
              evidence: `"${(panel.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90)}" is ${Math.round(visibleRatio * 100)}% visible in horizontal stage`,
              severity: "blocker"
            });
          }
        }
      }

      if (document.documentElement.scrollWidth > viewportWidth + 1 && horizontalStages.length === 0) {
        issues.push({
          issue: "body horizontal overflow",
          evidence: `document width ${document.documentElement.scrollWidth} > viewport ${viewportWidth}`,
          severity: "blocker"
        });
      }

      const visibleArea = Array.from(document.querySelectorAll("h1,h2,h3,h4,p,button,a,nav,[role='button'],[data-card],[data-panel],[data-active-panel],[data-layout-critical],[data-protected-text],[data-media-object],img,video,canvas"))
        .filter(isVisible)
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.bottom > 0 && rect.top < viewportHeight)
        .reduce((area, rect) => area + Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)) * Math.min(rect.width, viewportWidth), 0);

      if (!document.querySelector("[data-intentional-blank-stage]") && visibleArea < viewportWidth * viewportHeight * 0.06) {
        issues.push({
          issue: "blank scroll state",
          evidence: `meaningful content area under 6% of viewport`,
          severity: "major"
        });
      }

      return issues;
    });

      const navStateResult = await page.evaluate(async () => {
        const issues = [];
        const isVisible = (element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
        };
        const textOf = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80);
        const navIdOf = (element, index = 0) => element.getAttribute("data-nav-id")
          || element.getAttribute("data-nav-item")
          || element.getAttribute("data-nav-target")
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
        const currentItems = () => Array.from(document.querySelectorAll("[data-nav-item]"))
          .filter(isVisible)
          .filter((element) => !element.closest("[data-nav-test-skip='true']"));
        const initialItems = currentItems();
        if (initialItems.length < 2) return issues;

        const targets = initialItems.map((element, index) => ({
          id: navIdOf(element, index),
          label: navIdOf(element, index)
        }));

        for (const target of targets) {
          const before = currentItems();
          const clicked = before.find((element, index) => navIdOf(element, index) === target.id);
          if (!clicked) continue;
          clicked.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
          await new Promise((resolve) => setTimeout(resolve, 80));
          const after = currentItems();
          const clickedAfter = after.find((element, index) => navIdOf(element, index) === target.id);
          const activeItems = after.filter(hasActiveMarker);
          const activeIds = activeItems.map((element, index) => navIdOf(element, index));

          if (!clickedAfter || !hasActiveMarker(clickedAfter)) {
            issues.push({
              issue: "clicked nav item does not become selected",
              evidence: `clicked "${target.label}" but active items are ${activeIds.join(", ") || "none"}`,
              severity: "blocker"
            });
          }

          const wrongActive = activeItems.filter((element, index) => navIdOf(element, index) !== target.id);
          if (wrongActive.length > 0) {
            issues.push({
              issue: "nav active state mismatch",
              evidence: `clicked "${target.label}" but active item(s) became ${wrongActive.map((element, index) => navIdOf(element, index)).join(", ")}`,
              severity: "blocker"
            });
          }

          if (clickedAfter && hasActiveMarker(clickedAfter) && !hasAccessibleActiveMarker(clickedAfter)) {
            issues.push({
              issue: "nav active state inaccessible",
              evidence: `clicked "${target.label}" has visual active state but no data/aria active marker`,
              severity: "major"
            });
          }
        }
        return issues;
      });
      result.push(...navStateResult);

      for (const issue of result) {
        findings.push({ viewport: `${width}x${height}`, ...issue });
      }

      await page.close();
    }
  }
} finally {
  await browser.close();
}

const hasBlocker = findings.some((finding) => finding.severity === "blocker");
const verdict = hasBlocker ? "Block" : findings.length ? "Partial" : "Pass";

writeReports({
  verdict,
  url,
  viewports,
  screenshots,
  findings
});

console.log(`Wrote layout integrity report to ${outDir}.`);

if (failOnBlocker && hasBlocker) {
  process.exit(1);
}
