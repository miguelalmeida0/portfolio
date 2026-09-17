#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function getArg(name, fallback = "") {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}

function parseViewport(value) {
  const match = String(value || "1440x900").match(/^(\d+)x(\d+)$/i);
  if (!match) return { width: 1440, height: 900, label: "1440x900" };
  return {
    width: Number(match[1]),
    height: Number(match[2]),
    label: `${match[1]}x${match[2]}`
  };
}

const url = getArg("--url");
const viewport = parseViewport(getArg("--viewport", "1440x900"));
const selector = getArg("--selector", "[data-diagram-root]");
const outDir = path.resolve(process.cwd(), getArg("--out", "docs/qa"));
const jsonPath = path.join(outDir, "diagram-integrity-report.json");
const mdPath = path.join(outDir, "diagram-integrity-report.md");
const screenshotPath = path.join(outDir, "diagram-integrity-screenshot.png");

function ensureOutDir() {
  fs.mkdirSync(outDir, { recursive: true });
}

function writeReports(result) {
  ensureOutDir();
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(mdPath, renderMarkdown(result));
}

function renderMarkdown(result) {
  const rows = result.issues?.length
    ? result.issues.map((issue) => `| ${issue.severity} | ${issue.type} | ${issue.message} | ${issue.target || ""} |`).join("\n")
    : "| - | - | No issues found. | - |";

  return `# Diagram Integrity Report

## Summary
- status: ${result.status}
- url: ${result.url || ""}
- viewport: ${result.viewport?.label || ""}
- selector: ${result.selector || ""}
- checkedAt: ${result.checkedAt}
- screenshot: ${result.screenshotPath || ""}

## Counts
- roots: ${result.counts?.roots ?? 0}
- objects: ${result.counts?.objects ?? 0}
- labels: ${result.counts?.labels ?? 0}
- protected labels: ${result.counts?.protectedLabels ?? 0}
- selected: ${result.counts?.selected ?? 0}
- tooltips: ${result.counts?.tooltips ?? 0}
- DOM nodes in root: ${result.counts?.nodesInRoot ?? 0}
- repeated expensive effects: ${result.counts?.expensiveEffects ?? 0}

## Issues
| Severity | Type | Message | Target |
|---|---|---|---|
${rows}
`;
}

function blocked(reason, extra = {}) {
  const result = {
    status: "blocked",
    reason,
    url,
    viewport,
    selector,
    checkedAt: new Date().toISOString(),
    counts: {},
    issues: [],
    ...extra
  };
  writeReports(result);
  console.error(reason);
  process.exit(2);
}

if (!url) {
  blocked("Missing required --url. Example: node tools/diagram-integrity-check.mjs --url http://localhost:3000 --viewport 390x844");
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  blocked("Playwright is not installed or available, so diagram integrity checks could not run.", {
    error: error?.message || String(error)
  });
}

function issue(type, severity, message, target = "") {
  return { type, severity, message, target };
}

let browser;
try {
  ensureOutDir();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  const result = await page.evaluate((rootSelector) => {
    const viewportBox = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight
    };

    const toRect = (element) => {
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

    const describe = (element, fallback) =>
      element.getAttribute("data-diagram-id") ||
      element.getAttribute("aria-label") ||
      element.textContent?.trim().slice(0, 64) ||
      fallback;

    const overlaps = (a, b) =>
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top;

    const contains = (outer, inner) =>
      inner.left >= outer.left &&
      inner.right <= outer.right &&
      inner.top >= outer.top &&
      inner.bottom <= outer.bottom;

    const hasOverflow = (element) =>
      element.scrollWidth > element.clientWidth + 1 ||
      element.scrollHeight > element.clientHeight + 1;

    const roots = Array.from(document.querySelectorAll(rootSelector));
    const root = roots[0] || document.querySelector("[data-diagram-root]");
    const issues = [];

    if (!root) {
      return {
        status: "failed",
        counts: { roots: 0, objects: 0, labels: 0, protectedLabels: 0, selected: 0, tooltips: 0 },
        issues: [
          {
            type: "missing_root",
            severity: "P0",
            message: `No diagram root found for selector "${rootSelector}" or [data-diagram-root].`,
            target: rootSelector
          }
        ]
      };
    }

    const rootRect = toRect(root);
    const objects = Array.from(root.querySelectorAll("[data-diagram-object]"));
    const labels = Array.from(root.querySelectorAll("[data-diagram-label], [data-diagram-protected-label], [data-diagram-callout]"));
    const protectedLabels = Array.from(root.querySelectorAll("[data-diagram-protected-label]"));
    const selected = Array.from(root.querySelectorAll("[data-diagram-selected]"));
    const tooltips = Array.from(document.querySelectorAll("[role='tooltip'], [data-tooltip], [data-diagram-tooltip]"));
    const rootNodes = Array.from(root.querySelectorAll("*"));
    const expensiveEffects = rootNodes.filter((element) => {
      const style = window.getComputedStyle(element);
      return style.filter !== "none" ||
        style.backdropFilter !== "none" ||
        style.boxShadow !== "none" ||
        style.textShadow !== "none";
    });

    if (rootNodes.length > 600) {
      issues.push({
        type: "large_diagram_dom",
        severity: "P2",
        message: "Diagram root contains a large DOM/SVG node count; verify pan/zoom/selection performance or move dense rendering to Canvas/Konva.",
        target: `${rootNodes.length} nodes`
      });
    }

    if (expensiveEffects.length > 80) {
      issues.push({
        type: "repeated_expensive_effects",
        severity: "P2",
        message: "Diagram repeats shadows, filters, glows, or backdrop effects across many elements; this can cause janky canvas interaction.",
        target: `${expensiveEffects.length} effect-heavy elements`
      });
    }

    for (const label of labels) {
      const labelRect = toRect(label);
      const labelName = describe(label, "label");
      if (!contains(rootRect, labelRect)) {
        issues.push({
          type: "label_clipped_by_root",
          severity: "P1",
          message: "Label extends outside the diagram root bounds.",
          target: labelName
        });
      }
      if (hasOverflow(label)) {
        issues.push({
          type: "text_overflow",
          severity: "P1",
          message: "Label text overflows or clips inside its own element.",
          target: labelName
        });
      }
    }

    for (const object of objects) {
      const objectRect = toRect(object);
      const objectName = describe(object, "object");
      if (!contains(rootRect, objectRect)) {
        issues.push({
          type: "object_outside_canvas",
          severity: "P1",
          message: "Diagram object extends outside the root bounds.",
          target: objectName
        });
      }
      if (hasOverflow(object)) {
        issues.push({
          type: "object_text_overflow",
          severity: "P2",
          message: "Object content overflows or clips.",
          target: objectName
        });
      }
    }

    for (const label of labels) {
      const labelRect = toRect(label);
      const labelName = describe(label, "label");
      for (const object of objects) {
        if (label === object || object.contains(label) || label.contains(object)) continue;
        if (overlaps(labelRect, toRect(object))) {
          issues.push({
            type: "label_overlaps_object",
            severity: "P1",
            message: "Diagram label overlaps an object.",
            target: `${labelName} -> ${describe(object, "object")}`
          });
        }
      }
    }

    const protectedOrAllLabels = protectedLabels.length ? protectedLabels : labels;
    for (const selectedObject of selected) {
      const selectedRect = toRect(selectedObject);
      const selectedName = describe(selectedObject, "selected object");
      for (const label of protectedOrAllLabels) {
        if (selectedObject.contains(label)) continue;
        if (overlaps(selectedRect, toRect(label))) {
          issues.push({
            type: "selected_obscures_label",
            severity: "P1",
            message: "Selected object overlaps or obscures a protected label.",
            target: `${selectedName} -> ${describe(label, "label")}`
          });
        }
      }
    }

    for (const tooltip of tooltips) {
      const tooltipRect = toRect(tooltip);
      if (!contains(viewportBox, tooltipRect)) {
        issues.push({
          type: "tooltip_outside_viewport",
          severity: "P1",
          message: "Tooltip extends outside the viewport.",
          target: describe(tooltip, "tooltip")
        });
      }
    }

    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) {
      issues.push({
        type: "horizontal_overflow",
        severity: "P1",
        message: "Document has horizontal overflow.",
        target: "document"
      });
    }

    return {
      status: issues.length ? "failed" : "passed",
      counts: {
        roots: roots.length,
        objects: objects.length,
        labels: labels.length,
        protectedLabels: protectedLabels.length,
        selected: selected.length,
        tooltips: tooltips.length,
        nodesInRoot: rootNodes.length,
        expensiveEffects: expensiveEffects.length
      },
      issues
    };
  }, selector);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  const finalResult = {
    ...result,
    url,
    viewport,
    selector,
    checkedAt: new Date().toISOString(),
    screenshotPath
  };
  writeReports(finalResult);

  if (finalResult.status === "failed") {
    process.exit(1);
  }
} catch (error) {
  if (browser) await browser.close().catch(() => {});
  blocked("Diagram integrity check failed before completion.", {
    error: error?.message || String(error)
  });
}
