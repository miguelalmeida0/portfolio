#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const viewports = [
  { key: "390", width: 390, height: 844 },
  { key: "768", width: 768, height: 1024 },
  { key: "1440", width: 1440, height: 1100 }
];

const conceptMetadata = [
  {
    id: "concept-1",
    name: "Cinematic Robot Stage",
    visualMetaphor: "A hero robot revealed like a launch-stage artifact.",
    composition: "One dominant robot occupies the center with sparse edge telemetry and a low selection rail.",
    focalObject: "Single selected robot with body-scale drama.",
    emotionalHook: "Desire comes from owning the stage before reading stats.",
    hiddenInformation: "Detailed loadout and training history stay tucked behind selection.",
    absentElements: "No dense dashboard, no badge soup, no brochure copy.",
    clicheAvoidance: "Avoid generic sci-fi panel clutter by using stage composition first.",
    desireMechanism: "The selected robot feels collectible and consequential.",
    responsiveStrategy: {
      "1440": "Full-width stage with edge telemetry.",
      "768": "Robot stage remains dominant; metadata compresses below.",
      "390": "Robot stage stacks above a compact selection rail."
    },
    failureMode: "Fails if robot is cropped or metadata becomes the main object.",
    previewRoute: "/concept/1"
  },
  {
    id: "concept-2",
    name: "Selection Roster Forge",
    visualMetaphor: "A roster bench where each robot feels ready to be drafted.",
    composition: "Horizontal roster cards lead to a selected detail slab and skill chips.",
    focalObject: "The selected robot card and its immediate comparison neighbors.",
    emotionalHook: "Desire comes from choosing between distinctive robot personalities.",
    hiddenInformation: "Deep diagnostics reveal only after selection.",
    absentElements: "No landing-page hero, no generic card grid.",
    clicheAvoidance: "Uses roster rhythm instead of dashboard chrome.",
    desireMechanism: "Hover/selected states reward comparison.",
    responsiveStrategy: {
      "1440": "Roster and detail slab sit side by side.",
      "768": "Roster becomes a scrollable band over details.",
      "390": "Selected robot leads; roster becomes a compact carousel."
    },
    failureMode: "Fails if every card looks interchangeable.",
    previewRoute: "/concept/2"
  },
  {
    id: "concept-3",
    name: "Skill Configurator Bay",
    visualMetaphor: "A robotics lab bay where skills are installed like physical modules.",
    composition: "Configurator controls wrap a product-like robot preview with module sockets.",
    focalObject: "Robot preview plus one active skill module.",
    emotionalHook: "Desire comes from customizing a physical-feeling machine.",
    hiddenInformation: "Advanced tuning stays behind module focus.",
    absentElements: "No character roster wall, no fake terminal overload.",
    clicheAvoidance: "Feels like a product configurator rather than a sci-fi dashboard.",
    desireMechanism: "Changing a module visibly changes the robot promise.",
    responsiveStrategy: {
      "1440": "Preview dominates with side module stack.",
      "768": "Module stack moves under the preview.",
      "390": "One module at a time with sticky preview."
    },
    failureMode: "Fails if controls overpower the object.",
    previewRoute: "/concept/3"
  }
];

function getFlagValue(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? "" : args[index + 1] || "";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
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
  if (!url) {
    console.error("Usage: node tools/capture-concepts.mjs --url http://localhost:5174");
    process.exit(1);
  }

  const runDir = path.resolve(process.cwd(), "docs/concept-runs", timestamp());
  fs.mkdirSync(runDir, { recursive: true });

  const concepts = conceptMetadata.map((concept) => ({
    ...concept,
    screenshots: {
      "390": "",
      "768": "",
      "1440": ""
    }
  }));

  const playwright = await getPlaywright();
  if (!playwright) {
    writeJson(path.join(runDir, "visual-concepts.local.json"), {
      projectName: "Weekend Visual Engine Concept Capture",
      selectedConceptId: "",
      approvalStatus: "pending",
      approvedBy: "",
      approvalNotes: "Capture blocked because local Playwright is unavailable.",
      concepts
    });
    console.error(`Concept capture blocked: Playwright is unavailable. Stub artifact written to ${path.relative(process.cwd(), runDir)}`);
    process.exit(2);
  }

  const browser = await playwright.chromium.launch();
  try {
    for (let conceptIndex = 0; conceptIndex < concepts.length; conceptIndex += 1) {
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        const conceptUrl = new URL(`/concept/${conceptIndex + 1}`, url).toString();
        await page.goto(conceptUrl, { waitUntil: "networkidle", timeout: 30000 });
        const screenshotPath = path.join(runDir, `concept-${conceptIndex + 1}-${viewport.key}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        concepts[conceptIndex].screenshots[viewport.key] = path.relative(process.cwd(), screenshotPath);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  writeJson(path.join(runDir, "visual-concepts.local.json"), {
    projectName: "Weekend Visual Engine Concept Capture",
    selectedConceptId: "",
    approvalStatus: "pending",
    approvedBy: "",
    approvalNotes: "Migi must approve one rendered concept before implementation.",
    concepts
  });

  console.log(`Concept screenshots written to ${path.relative(process.cwd(), runDir)}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
