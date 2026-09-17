#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const designOsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = process.cwd();
const args = process.argv.slice(2);
const command = args[0];

const paths = {
  registry: "skills/skill-registry.json",
  briefTemplate: "templates/design-brief.template.json",
  doneReportTemplate: "templates/done-report.template.json",
  targetCopyReportTemplate: "templates/target-copy-report.template.json",
  assetManifestTemplate: "templates/asset-manifest.template.json",
  unsplashAssetManifestTemplate: "templates/unsplash-asset-manifest.template.json",
  inspirationManifestTemplate: "inspiration-library/manifests/inspiration-manifest.template.json",
  visualQaReportTemplate: "templates/visual-qa-report.template.json",
  screenshotComparisonReportTemplate: "templates/screenshot-comparison-report.template.json",
  objectSwapReportTemplate: "templates/object-swap-report.template.json",
  motionSequenceReportTemplate: "templates/motion-sequence-report.template.json",
  skillVerdictTemplate: "templates/skill-verdict.template.json"
};

const visualAgents = [
  {
    id: "01-inspiration-scout",
    name: "Inspiration Scout Agent",
    path: "agents/01-inspiration-scout-agent.md",
    description: "Collects, classifies, and documents visual inspiration before implementation.",
    routeKeywords: ["inspiration", "pinterest", "moodboard", "awwwards", "fwa", "reference", "visual research", "source"]
  },
  {
    id: "02-art-direction-concept",
    name: "Art Direction Concept Agent",
    path: "agents/02-art-direction-concept-agent.md",
    description: "Turns a brief and inspiration into 3 rendered visual concepts.",
    routeKeywords: ["concept", "art direction", "visual-heavy", "new app", "rendered", "three concepts", "selection", "roster", "gallery"]
  },
  {
    id: "03-literal-target-copy",
    name: "Literal Target Copy Agent",
    path: "agents/03-literal-target-copy-agent.md",
    description: "Reconstructs exact visual targets without product reinterpretation.",
    routeKeywords: ["copy this exact ui", "100% this design", "literally what you see", "exact visual target", "lovable target", "target copy", "target screenshot", "target screenshots", "reconstruct"]
  },
  {
    id: "04-visual-qa-anti-slop",
    name: "Visual QA Anti-Slop Agent",
    path: "agents/04-visual-qa-anti-slop-agent.md",
    description: "Blocks fake done reports with screenshot QA and scorecard caps.",
    routeKeywords: ["qa", "screenshot", "scorecard", "anti-slop", "verify", "done report", "overlap", "watermark", "dead button"]
  },
  {
    id: "05-productionizer",
    name: "Productionizer Agent",
    path: "agents/05-productionizer-agent.md",
    description: "Adds clean app code and interactions after the visual shell passes.",
    routeKeywords: ["productionize", "implementation", "interactions", "components", "build", "lint", "local data", "product logic"]
  }
];

const requiredBriefFields = [
  "projectName",
  "projectType",
  "primaryUser",
  "primaryObject",
  "primaryAction",
  "visualWeight",
  "taskType",
  "isVisualHeavy",
  "inspirationSources",
  "visualReferences",
  "targetScreens",
  "constraints",
  "forbiddenDirections",
  "requiredSkills",
  "approvalState"
];

const requiredConceptFields = [
  "id",
  "name",
  "visualMetaphor",
  "composition",
  "focalObject",
  "emotionalHook",
  "hiddenInformation",
  "absentElements",
  "clicheAvoidance",
  "desireMechanism",
  "responsiveStrategy",
  "failureMode",
  "previewRoute",
  "screenshots"
];

const requiredConceptStringFields = [
  "id",
  "name",
  "visualMetaphor",
  "composition",
  "focalObject",
  "emotionalHook",
  "hiddenInformation",
  "absentElements",
  "clicheAvoidance",
  "desireMechanism",
  "failureMode",
  "previewRoute"
];

const viewportKeys = ["1440", "768", "390"];

const requiredScreenshotFields = [
  "projectName",
  "taskType",
  "mode",
  "isVisualWork",
  "targetScreenshots",
  "currentScreenshots",
  "viewportChecks",
  "visualQa",
  "overlapDetected",
  "horizontalScrollDetected",
  "unreadableTextDetected",
  "deadButtonsFound",
  "visualTargetComparison",
  "remainingWeaknesses"
];

const requiredDoneReportFields = [
  "projectName",
  "taskType",
  "mode",
  "isVisualWork",
  "filesChanged",
  "commandsRun",
  "screenshots",
  "screenshotReportPath",
  "visualQa",
  "finalUiIntegrityGateRun",
  "finalUiIntegrityGateVersion",
  "finalUiIntegrityVerdict",
  "finalUiIntegrityBlockers",
  "widthSweepTested",
  "heightMatrixTested",
  "viewportMatrixTested",
  "scrollSamplesTested",
  "interactionStatesTested",
  "finalUiIntegrityBlockerCount",
  "finalUiIntegrityScreenshotDir",
  "failedViewportStates",
  "passedViewportStates",
  "clippedTextRemaining",
  "textClipRemaining",
  "overlapRemaining",
  "floatingOverlapRemaining",
  "viewportEdgeClippingRemaining",
  "floatingObjectDriftRemaining",
  "horizontalScrollPartialContentRemaining",
  "blankScrollStateRemaining",
  "mediaTextCollisionRemaining",
  "navOverflowRemaining",
  "fixedOverlayCollisionRemaining",
  "accidentalWhitespaceRemaining",
  "finalHandoffAllowed",
  "screenshotEvidence",
  "finalVerdict",
  "interactionQa",
  "assetQa",
  "targetCopyQa",
  "productQa",
  "score",
  "remainingWeaknesses",
  "blockers",
  "finalStatus"
];

const finalUiIntegrityV2ViewportMatrix = [390, 430, 640, 768, 900, 1024, 1180, 1280, 1366, 1440, 1536, 1728, 1920];
const finalUiIntegrityV2ScrollSamples = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1];
const finalUiIntegrityV3WidthSweep = Array.from({ length: ((1920 - 360) / 40) + 1 }, (_, index) => 360 + (index * 40));
const finalUiIntegrityV3HeightMatrix = [720, 844, 900, 1080];

const requiredTargetCopyFields = [
  "targetScreens",
  "targetImagePaths",
  "currentScreenshotPaths",
  "comparisonReportPath",
  "excludedArtifacts",
  "visualShellStatus",
  "compositionMatchNotes",
  "focalObjectMatchNotes",
  "layoutMatchNotes",
  "typographyMatchNotes",
  "interactionMinimums",
  "exactDifferences",
  "intentionalDifferences",
  "remainingMismatches",
  "approvalStatus"
];

const requiredAssetFields = [
  "assetPath",
  "role",
  "mappedObject",
  "source",
  "sourceType",
  "licenseNote",
  "watermarkFree",
  "browserChromeFree",
  "editorUiFree",
  "placeholder",
  "repeatedAsset",
  "cropFocalPoint",
  "usageNotes",
  "approvedForProduction"
];

const requiredInspirationManifestFields = [
  "projectName",
  "purpose",
  "localScreenshotsPath",
  "sources",
  "references",
  "topThirtyStrongestReferences",
  "topTenCompositionPatterns",
  "topTenAntiPatternsToAvoid"
];

const requiredInspirationReferenceFields = [
  "id",
  "title",
  "sourceName",
  "sourceUrl",
  "referenceType",
  "trustLevel",
  "screenshotPath",
  "screenshotLocalOnly",
  "attributionNotes",
  "composition",
  "focalObject",
  "mood",
  "material",
  "motion",
  "interactionModel",
  "intentionallyAbsent",
  "literalTarget",
  "notes"
];

const validDoneModes = new Set(["visual-concept", "literal-target-copy", "visual-repair", "implementation", "review"]);
const validFinalStatuses = new Set(["done", "blocked", "needs-work"]);
const validFinalUiIntegrityVerdicts = new Set(["passed", "partial", "failed", "blocked"]);
const validApprovalStatuses = new Set(["pending", "approved", "rejected"]);
const validSkillVerdictStatuses = new Set(["pass", "needs-repair", "blocked", "not-applicable"]);
const validSkillRepairPriorities = new Set(["P0", "P1", "P2"]);
const validAssetRoles = new Set(["production", "reference", "temporary", "source"]);
const validAssetSourceTypes = new Set(["official", "press", "Wikimedia", "provided", "generated", "unknown"]);
const validReferenceTypes = new Set(["inspiration", "literal-target", "anti-pattern"]);
const validTrustLevels = new Set(["high", "medium", "moodboard-only"]);
const visualDoneModes = new Set(["visual-concept", "literal-target-copy", "visual-repair"]);
const visualTaskMarkers = ["visual", "frontend", "ui", "redesign", "new-app", "selection", "gallery", "roster", "product-discovery"];
const requiredVisualQaFields = [
  "status",
  "captureMode",
  "noOverlap",
  "noTextOnButtons",
  "noWatermark",
  "noHorizontalOverflow",
  "noCutHeroObject"
];

const validVisualQaStatuses = new Set(["passing", "needs-work", "blocked", "manual-review"]);
const validVisualQaCaptureModes = new Set(["automated", "manual-import", "blocked"]);

const agentAliases = new Map([
  ["inspiration-scout", "01-inspiration-scout"],
  ["01-inspiration-scout", "01-inspiration-scout"],
  ["art-direction-concept", "02-art-direction-concept"],
  ["02-art-direction-concept", "02-art-direction-concept"],
  ["literal-target-copy", "03-literal-target-copy"],
  ["03-literal-target-copy", "03-literal-target-copy"],
  ["visual-qa-anti-slop", "04-visual-qa-anti-slop"],
  ["04-visual-qa-anti-slop", "04-visual-qa-anti-slop"],
  ["productionizer", "05-productionizer"],
  ["05-productionizer", "05-productionizer"]
]);

const agentPromptConfig = {
  "01-inspiration-scout": {
    template: "templates/prompts/codex-inspiration-scout.md",
    agentPath: "agents/01-inspiration-scout-agent.md",
    skillPaths: ["skills/visual-concept-gate/SKILL.md"],
    validationCommands: [
      "node tools/new-inspiration-queue.mjs",
      "node tools/validate-inspiration-queue.mjs inspiration-library/queues/weekend-visual-corpus.queue.json",
      "node tools/design-os.mjs validate-inspiration-manifest inspiration-manifest.local.json"
    ]
  },
  "02-art-direction-concept": {
    template: "templates/prompts/codex-art-direction-concept.md",
    agentPath: "agents/02-art-direction-concept-agent.md",
    skillPaths: ["skills/visual-concept-gate/SKILL.md"],
    validationCommands: [
      "node tools/capture-concepts.mjs --url http://localhost:5174",
      "node tools/design-os.mjs validate-concepts docs/concept-runs/<run>/visual-concepts.local.json"
    ]
  },
  "03-literal-target-copy": {
    template: "templates/prompts/codex-literal-target-copy.md",
    agentPath: "agents/03-literal-target-copy-agent.md",
    skillPaths: ["skills/visual-target-reconstruction/SKILL.md"],
    validationCommands: [
      "node tools/compare-screenshots.mjs --target <target.png> --current <current.png> --name <name>",
      "node tools/design-os.mjs validate-target-copy target-copy-report.local.json"
    ]
  },
  "04-visual-qa-anti-slop": {
    template: "templates/prompts/codex-visual-qa-fix.md",
    agentPath: "agents/04-visual-qa-anti-slop-agent.md",
    skillPaths: ["skills/screenshot-scorecard-review/SKILL.md", "skills/anti-ai-slop-review/SKILL.md"],
    validationCommands: [
      "node tools/visual-qa.mjs --url http://localhost:5173 --name <name>",
      "node tools/design-os.mjs validate-visual-qa-report docs/qa-runs/<run>/visual-qa-report.json",
      "node tools/design-os.mjs validate-done-report done-report.local.json"
    ]
  },
  "05-productionizer": {
    template: "templates/prompts/codex-productionizer.md",
    agentPath: "agents/05-productionizer-agent.md",
    skillPaths: ["skills/screenshot-scorecard-review/SKILL.md"],
    validationCommands: [
      "npm run build",
      "node tools/visual-qa.mjs --url http://localhost:5173 --name <name>",
      "node tools/design-os.mjs validate-done-report done-report.local.json"
    ]
  }
};

const promptTemplates = new Map([
  ["fast-direction-gate", "templates/prompts/fast-direction-gate.md"],
  ["no-image-fast-direction-gate", "templates/prompts/no-image-fast-direction-gate.md"],
  ["master-next-app", "templates/prompts/master-next-app-prompt.md"],
  ["spec-only-direction-gate", "templates/prompts/spec-only-direction-gate.md"],
  ["implementation-after-selected-direction", "templates/prompts/implementation-after-selected-direction.md"],
  ["postmortem-ingestion", "templates/prompts/postmortem-ingestion.md"],
  ["creative-orchestration-director", "templates/prompts/creative-orchestration-director.md"],
  ["evidence-backed-critique", "templates/prompts/evidence-backed-critique.md"],
  ["text-clarity-review", "templates/prompts/text-clarity-review.md"],
  ["production-hardening-review", "templates/prompts/production-hardening-review.md"],
  ["domain-realism-mock-data-director", "templates/prompts/domain-realism-mock-data-director.md"],
  ["creative-session-state-manager", "templates/prompts/creative-session-state-manager.md"],
  ["skill-orchestration-planner", "templates/prompts/skill-orchestration-planner.md"],
  ["failure-memory-retrieval-router", "templates/prompts/failure-memory-retrieval-router.md"],
  ["evidence-to-repair-planner", "templates/prompts/evidence-to-repair-planner.md"],
  ["responsive-constraint-solver", "templates/prompts/responsive-constraint-solver.md"],
  ["reference-grammar-compiler", "templates/prompts/reference-grammar-compiler.md"],
  ["preference-model-migi-taste-learner", "templates/prompts/preference-model-migi-taste-learner.md"],
  ["interaction-state-matrix-director", "templates/prompts/interaction-state-matrix-director.md"],
  ["artifact-contract-validator", "templates/prompts/artifact-contract-validator.md"],
  ["creative-prototype-spike-director", "templates/prompts/creative-prototype-spike-director.md"],
  ["signature-interaction-director", "templates/prompts/signature-interaction-director.md"],
  ["elite-scroll-choreography-director", "templates/prompts/elite-scroll-choreography-director.md"],
  ["scroll-choreography-review", "templates/prompts/scroll-choreography-review.md"],
  ["scroll-physics-smoothing-director", "templates/prompts/scroll-physics-smoothing-director.md"],
  ["physical-interface-props-director", "templates/prompts/physical-interface-props-director.md"],
  ["media-object-stage-director", "templates/prompts/media-object-stage-director.md"],
  ["designed-detail-reveal-director", "templates/prompts/designed-detail-reveal-director.md"],
  ["brand-voice-as-interface-director", "templates/prompts/brand-voice-as-interface-director.md"],
  ["webgl-shader-primitives-gate", "templates/prompts/webgl-shader-primitives-gate.md"],
  ["animejs-motion-gate", "prompts/dogfood/animejs-motion-gate.md"],
  ["illustration-first-gate", "templates/prompts/illustration-first-gate.md"],
  ["asset-first-illustration-test", "templates/prompts/asset-first-illustration-test.md"],
  ["layout-integrity-review", "templates/prompts/layout-integrity-review.md"],
  ["final-ui-integrity-gate", "templates/prompts/final-ui-integrity-gate.md"],
  ["chart-system-director", "templates/prompts/chart-system-director.md"],
  ["diagram-canvas-system", "templates/prompts/diagram-canvas-system.md"],
  ["data-viz-hardening-review", "templates/prompts/data-viz-hardening-review.md"],
  ["benchmark-scoring-review", "templates/prompts/benchmark-scoring-review.md"],
  ["codex-new-frontend", "templates/prompts/codex-new-frontend-prompt.md"],
  ["codex-dashboard-reference-locked", "templates/prompts/codex-dashboard-reference-locked.md"],
  ["codex-landing-image-first", "templates/prompts/codex-landing-image-first.md"],
  ["codex-mobile-product-flow", "templates/prompts/codex-mobile-product-flow.md"],
  ["codex-visual-review", "templates/prompts/codex-visual-review.md"],
  ["codex-advanced-motion-choreography", "templates/prompts/codex-advanced-motion-choreography.md"],
  ["codex-motion-benchmark-review", "templates/prompts/codex-motion-benchmark-review.md"],
  ["codex-motion-only-patch", "templates/prompts/codex-motion-only-patch.md"],
  ["codex-generate-3-direction-images", "templates/prompts/codex-generate-3-direction-images.md"],
  ["codex-select-direction-from-images", "templates/prompts/codex-select-direction-from-images.md"]
]);

function resolveDesignOsPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(designOsRoot, filePath);
}

function resolveProjectPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(projectRoot, filePath);
}

function readJson(filePath, options = {}) {
  const absolute = options.base === "design-os" ? resolveDesignOsPath(filePath) : resolveProjectPath(filePath);
  try {
    return JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch (error) {
    fail(`Could not read JSON: ${filePath}\n${error.message}`);
  }
}

function writeJsonIfMissing(filePath, data) {
  const absolute = resolveProjectPath(filePath);
  if (fs.existsSync(absolute)) {
    return { created: false, filePath };
  }
  fs.writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`);
  return { created: true, filePath };
}

function writeJson(filePath, data) {
  const absolute = resolveProjectPath(filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(data, null, 2)}\n`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function pass(message, details = null) {
  console.log(message);
  if (details) {
    console.log(JSON.stringify(details, null, 2));
  }
}

function getFlagValue(flag) {
  const index = args.indexOf(flag);
  if (index === -1 || !args[index + 1]) {
    return "";
  }
  return args[index + 1];
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function missingFields(object, fields) {
  return fields.filter((field) => !(field in object));
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatchesText(text, keyword) {
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) {
    return false;
  }

  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}([^a-z0-9]|$)`, "i");
  return pattern.test(normalizedText);
}

function validateViewportObject(value, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object with 1440, 768, and 390 keys.`);
    return;
  }

  for (const viewport of viewportKeys) {
    if (!isNonEmptyString(value[viewport])) {
      errors.push(`${label}.${viewport} must be a non-empty string.`);
    }
  }
}

function validateRequiredViewportStrings(value, label, errors) {
  validateViewportObject(value, label, errors);
  if (!isPlainObject(value)) {
    return;
  }

  for (const viewport of viewportKeys) {
    if (!isNonEmptyString(value[viewport])) {
      errors.push(`${label}.${viewport} is required for visual work.`);
    }
  }
}

function validateVisualQa(value, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }

  if (!validVisualQaStatuses.has(value.status)) {
    errors.push(`${label}.status must be one of: ${Array.from(validVisualQaStatuses).join(", ")}.`);
  }

  if (!validVisualQaCaptureModes.has(value.captureMode)) {
    errors.push(`${label}.captureMode must be one of: ${Array.from(validVisualQaCaptureModes).join(", ")}.`);
  }

  for (const field of requiredVisualQaFields) {
    if (field === "status" || field === "captureMode") {
      continue;
    }
    if (!isBoolean(value[field])) {
      errors.push(`${label}.${field} must be a boolean.`);
    }
  }

  if (value.status === "passing" && value.noCutHeroObject === false && !isNonEmptyString(value.noCutHeroObjectJustification)) {
    errors.push(`${label}.noCutHeroObjectJustification must explain any accepted hero-object crop.`);
  }
}

function inferVisualWork(artifact) {
  if (artifact?.isVisualWork === true) {
    return true;
  }
  if (artifact?.isVisualWork === false) {
    return false;
  }
  if (visualDoneModes.has(artifact?.mode)) {
    return true;
  }
  const taskType = normalizeText(artifact?.taskType);
  return visualTaskMarkers.some((marker) => taskType.includes(marker));
}

function includesAllArtifactExclusions(values) {
  const text = normalizeText(Array.isArray(values) ? values.join(" ") : values);
  return text.includes("watermark") &&
    text.includes("editor") &&
    text.includes("browser") &&
    text.includes("chrome");
}

function isPrimaryObjectAsset(asset) {
  const text = normalizeText(`${asset?.mappedObject || ""} ${asset?.role || ""} ${asset?.usageNotes || ""}`);
  return text.includes("primary") || text.includes("hero");
}

function validateAssetQa(value, label, errors) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  if (!isBoolean(value.required)) {
    errors.push(`${label}.required must be a boolean.`);
  }
  if (!isNonEmptyString(value.manifestPath) && value.required === true) {
    errors.push(`${label}.manifestPath is required when asset QA is required.`);
  }
  if (!isBoolean(value.validated)) {
    errors.push(`${label}.validated must be a boolean.`);
  }
  if (value.required === true && value.validated !== true) {
    errors.push(`${label}.validated must be true when asset QA is required.`);
  }
}

function validateProductQa(value, label, errors, report) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }

  for (const field of ["appPurpose", "designOsTestPurpose", "rulesUnderTest", "coreLoopQa", "persistenceQa", "dogfoodQa"]) {
    if (!(field in value)) {
      errors.push(`${label}.${field} is required.`);
    }
  }

  if (!Array.isArray(value.rulesUnderTest)) {
    errors.push(`${label}.rulesUnderTest must be an array.`);
  }

  if (!isPlainObject(value.coreLoopQa)) {
    errors.push(`${label}.coreLoopQa must be an object.`);
  } else {
    for (const field of ["required", "loop", "manuallyVerified", "verificationNotes"]) {
      if (!(field in value.coreLoopQa)) {
        errors.push(`${label}.coreLoopQa.${field} is required.`);
      }
    }
    if (!isBoolean(value.coreLoopQa.required)) {
      errors.push(`${label}.coreLoopQa.required must be a boolean.`);
    }
    if (!isBoolean(value.coreLoopQa.manuallyVerified)) {
      errors.push(`${label}.coreLoopQa.manuallyVerified must be a boolean.`);
    }
    if (report.finalStatus === "done" && value.coreLoopQa.required === true) {
      if (value.coreLoopQa.manuallyVerified !== true) {
        errors.push("finalStatus done requires productQa.coreLoopQa.manuallyVerified true when the core loop is required.");
      }
      if (!isNonEmptyString(value.coreLoopQa.verificationNotes)) {
        errors.push("finalStatus done requires productQa.coreLoopQa.verificationNotes when the core loop is required.");
      }
    }
  }

  if (!isPlainObject(value.persistenceQa)) {
    errors.push(`${label}.persistenceQa must be an object.`);
  } else {
    for (const field of ["userGeneratedData", "routeChanges", "refresh", "browserReopen", "uiDisclosure"]) {
      if (!(field in value.persistenceQa)) {
        errors.push(`${label}.persistenceQa.${field} is required.`);
      }
    }
    if (!isBoolean(value.persistenceQa.userGeneratedData)) {
      errors.push(`${label}.persistenceQa.userGeneratedData must be a boolean.`);
    }
    if (report.finalStatus === "done" && value.persistenceQa.userGeneratedData === true) {
      for (const field of ["routeChanges", "refresh", "browserReopen", "uiDisclosure"]) {
        if (!isNonEmptyString(value.persistenceQa[field])) {
          errors.push(`finalStatus done requires productQa.persistenceQa.${field} when user-generated data is part of the product promise.`);
        }
      }
    }
  }

  if (!isPlainObject(value.dogfoodQa)) {
    errors.push(`${label}.dogfoodQa must be an object.`);
  } else {
    for (const field of ["isDogfoodTarget", "failuresBackPropagated", "learningNotes"]) {
      if (!(field in value.dogfoodQa)) {
        errors.push(`${label}.dogfoodQa.${field} is required.`);
      }
    }
    if (!isBoolean(value.dogfoodQa.isDogfoodTarget)) {
      errors.push(`${label}.dogfoodQa.isDogfoodTarget must be a boolean.`);
    }
    if (!isBoolean(value.dogfoodQa.failuresBackPropagated)) {
      errors.push(`${label}.dogfoodQa.failuresBackPropagated must be a boolean.`);
    }
    if (report.finalStatus === "done" && value.dogfoodQa.isDogfoodTarget === true) {
      if (value.dogfoodQa.failuresBackPropagated !== true) {
        errors.push("finalStatus done requires productQa.dogfoodQa.failuresBackPropagated true for dogfood targets.");
      }
      if (!isNonEmptyString(value.dogfoodQa.learningNotes)) {
        errors.push("finalStatus done requires productQa.dogfoodQa.learningNotes for dogfood targets.");
      }
    }
  }
}

function validateTargetCopyQa(value, label, errors, mode) {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }
  if (!isBoolean(value.required)) {
    errors.push(`${label}.required must be a boolean.`);
  }
  if (!isNonEmptyString(value.reportPath) && value.required === true) {
    errors.push(`${label}.reportPath is required when target-copy QA is required.`);
  }
  if (!isBoolean(value.validated)) {
    errors.push(`${label}.validated must be a boolean.`);
  }
  if (mode === "literal-target-copy" && value.required !== true) {
    errors.push(`${label}.required must be true for Literal Target Copy Mode.`);
  }
  if (value.required === true && value.validated !== true) {
    errors.push(`${label}.validated must be true when target-copy QA is required.`);
  }
}

function artifactPathExists(filePath) {
  if (!isNonEmptyString(filePath) || /^https?:\/\//i.test(filePath)) {
    return false;
  }
  const absolute = resolveProjectPath(filePath);
  return fs.existsSync(absolute);
}

function validateScreenshotFiles(value, label, errors) {
  if (!isPlainObject(value)) {
    return;
  }

  for (const viewport of viewportKeys) {
    if (isNonEmptyString(value[viewport]) && !artifactPathExists(value[viewport])) {
      errors.push(`${label}.${viewport} must point to an existing local screenshot file.`);
    }
  }
}

function getRegistry() {
  const registry = readJson(paths.registry, { base: "design-os" });
  if (!Array.isArray(registry.skills)) {
    fail("Skill registry is invalid: missing skills array.");
  }
  return registry;
}

function listSkills() {
  const registry = getRegistry();
  for (const skill of registry.skills) {
    console.log(`${skill.id}\t${skill.path}\t${skill.description}`);
  }
}

function listAgents() {
  for (const agent of visualAgents) {
    console.log(`${agent.id}\t${agent.path}\t${agent.description}`);
  }
}

function listBenchmarks() {
  const benchmarksDir = resolveDesignOsPath("evaluation/benchmarks");
  if (!fs.existsSync(benchmarksDir)) {
    fail("No benchmark directory found at evaluation/benchmarks.");
  }

  const files = fs.readdirSync(benchmarksDir)
    .filter((file) => file.endsWith(".benchmark.md"))
    .sort();

  for (const file of files) {
    console.log(`evaluation/benchmarks/${file}`);
  }
}

function newPostmortem() {
  const templatePath = "docs/qa/dogfood-postmortem.template.md";
  const outPath = getFlagValue("--out");
  const template = readText(templatePath, { base: "design-os" });

  if (!outPath) {
    console.log(template);
    return;
  }

  const absolute = resolveProjectPath(outPath);
  if (fs.existsSync(absolute)) {
    fail(`Refusing to overwrite existing postmortem: ${outPath}`);
  }
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${template}\n`);
  pass("Created dogfood postmortem", { out: outPath });
}

function printPrompt() {
  const name = getFlagValue("--name");
  if (!name) {
    fail("Usage: node tools/design-os.mjs prompt --name <template-name>");
  }

  const templatePath = promptTemplates.get(name);
  if (!templatePath) {
    fail(`Unknown prompt template: ${name}\nKnown templates:\n- ${Array.from(promptTemplates.keys()).sort().join("\n- ")}`);
  }

  console.log(readText(templatePath, { base: "design-os" }));
}

function resolveManifestImagePath(manifestPath, imagePath) {
  const fromProjectRoot = resolveProjectPath(imagePath);
  if (fs.existsSync(fromProjectRoot)) {
    return fromProjectRoot;
  }
  return path.resolve(path.dirname(resolveProjectPath(manifestPath)), imagePath);
}

function validateDirectionImages(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-direction-images <manifest.json>");
  }

  const manifest = readJson(filePath);
  const errors = [];
  if (!Array.isArray(manifest.directions)) {
    errors.push("directions must be an array.");
  } else {
    if (manifest.directions.length !== 3) {
      errors.push("directions must contain exactly 3 items.");
    }
    const ids = new Set();
    for (const [index, direction] of manifest.directions.entries()) {
      const label = `directions[${index}]`;
      if (!isNonEmptyString(direction.id)) {
        errors.push(`${label}.id is required.`);
      } else if (ids.has(direction.id)) {
        errors.push(`${label}.id must be unique.`);
      } else {
        ids.add(direction.id);
      }
      for (const field of ["name", "prompt", "imagePath", "designThesis", "paletteIntent", "typographyIntent", "layoutIntent", "imageIntent", "motionIntent", "risks"]) {
        if (!isNonEmptyString(direction[field])) {
          errors.push(`${label}.${field} is required.`);
        }
      }
      if (isNonEmptyString(direction.imagePath) && !fs.existsSync(resolveManifestImagePath(filePath, direction.imagePath))) {
        errors.push(`${label}.imagePath does not exist: ${direction.imagePath}`);
      }
    }
  }
  if (manifest.status === "blocked") {
    errors.push("manifest status is blocked; generated images are not valid direction evidence.");
  }
  if (errors.length > 0) {
    fail(`Direction image manifest failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Direction image manifest valid", { file: filePath, directions: manifest.directions.length });
}

function validateDirectionGate(slug) {
  if (!slug) {
    fail("Usage: node tools/design-os.mjs validate-direction-gate <slug>");
  }

  const errors = [];
  const moodboardDir = resolveProjectPath(path.posix.join("generated/moodboards", slug));
  const manifestPath = path.join(moodboardDir, "manifest.json");
  const blockedPath = path.join(moodboardDir, "blocked-report.md");
  const optionsPath = resolveProjectPath("docs/design/direction-options.md");

  if (!fs.existsSync(optionsPath)) {
    errors.push("docs/design/direction-options.md is missing.");
  } else {
    const content = fs.readFileSync(optionsPath, "utf8");
    for (const label of ["Direction A", "Direction B", "Direction C"]) {
      if (!content.includes(label)) errors.push(`direction-options.md is missing ${label}.`);
    }
  }

  if (!fs.existsSync(manifestPath) && !fs.existsSync(blockedPath)) {
    errors.push(`Expected manifest.json or blocked-report.md in generated/moodboards/${slug}.`);
  }

  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    if (manifest.briefHash && typeof manifest.briefHash !== "string") {
      errors.push("manifest.briefHash must be a string when present.");
    }
    if (!Array.isArray(manifest.directions) || manifest.directions.length !== 3) {
      errors.push("manifest.directions must contain exactly 3 directions.");
    } else {
      for (const [index, direction] of manifest.directions.entries()) {
        const label = `directions[${index}]`;
        for (const field of ["id", "name", "prompt", "imagePath"]) {
          if (!isNonEmptyString(direction[field])) errors.push(`${label}.${field} is required.`);
        }
        if (manifest.status !== "blocked" && isNonEmptyString(direction.imagePath) && !fs.existsSync(resolveManifestImagePath(manifestPath, direction.imagePath))) {
          errors.push(`${label}.imagePath does not exist: ${direction.imagePath}`);
        }
      }
    }
  }

  try {
    const srcStatus = execSync("git status --short -- src", { cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (srcStatus) {
      errors.push(`src files changed during gate-only work:\n${srcStatus}`);
    }
  } catch (error) {
    // Non-git projects can still validate the direction artifacts.
  }

  if (errors.length > 0) {
    fail(`Invalid fast direction gate:\n- ${errors.join("\n- ")}`);
  }
  pass("Fast direction gate valid", { slug });
}

function buildDirectionPrompt(direction, options) {
  return [
    `Frontend design reference image for ${options.product || "the product"}.`,
    `Product type: ${options.type || "visual-heavy interface"}.`,
    `User brief: ${options.brief || "No brief supplied."}`,
    `Selected visual mode: ${options.mode || "unclassified visual-heavy mode"}.`,
    `Active dials: ${options.dials || "not supplied"}.`,
    `References to consider: ${options.references || "none supplied"}.`,
    `Direction: ${direction.name}.`,
    `Palette direction: ${direction.palette}.`,
    `Typography direction: ${direction.typography}.`,
    `Layout/composition: ${direction.layout}.`,
    `Image/media direction: ${direction.image}.`,
    `Navigation concept: ${direction.navigation}.`,
    `Motion feeling: ${direction.motion}.`,
    `Avoid: ${direction.avoid}.`,
    "Create a frontend design reference, not abstract art.",
    "No fake broken UI text, nonsense logos, distorted typography, random artifacts, or unreadable microcopy.",
    "Make the design implementation-friendly with clear hierarchy, plausible components, and responsive logic."
  ].join(" ");
}

function generateDirectionPrompts() {
  const options = {
    product: getFlagValue("--product") || getFlagValue("--project"),
    type: getFlagValue("--type"),
    brief: getFlagValue("--brief"),
    references: getFlagValue("--references"),
    mode: getFlagValue("--mode") || "fast",
    dials: getFlagValue("--dials"),
    out: getFlagValue("--out") || "docs/design/generated-image-prompts.md"
  };
  const directions = [
    {
      id: "A",
      name: "Safe Refined",
      palette: "safe refined palette with strong contrast and restrained accent logic",
      typography: "clean premium typography with calibrated scale",
      layout: "clear hierarchy, strong focal zone, balanced density",
      image: "imagery supports product meaning without becoming filler",
      navigation: "clear, elegant, understandable navigation",
      motion: "subtle, purposeful transitions and feedback",
      avoid: "generic SaaS, card soup, AI scale inflation, muddy default palette"
    },
    {
      id: "B",
      name: "Artistic Expressive",
      palette: "expressive balanced palette tied to mood and references",
      typography: "more distinctive type rhythm with readable UI roles",
      layout: "composition-led, asymmetric or poster-like where appropriate",
      image: "images/media as structural design material",
      navigation: "navigation treated as art direction, not default navbar",
      motion: "cinematic section rhythm and media reveals",
      avoid: "Blogspot structure, repeated feature rows, decorative chaos"
    },
    {
      id: "C",
      name: "Unexpected High-Character",
      palette: "unexpected high-character palette with disciplined contrast",
      typography: "distinctive type attitude with implementation-safe text zones",
      layout: "unusual but coherent composition, not template default",
      image: "focal object/media world creates identity",
      navigation: "unconventional but understandable navigation approach",
      motion: "signature motion moment plus supporting motion layers",
      avoid: "AI-purple glow, dull charcoal/orange, fake text, random visual noise"
    }
  ];
  const result = {
    generatedAt: new Date().toISOString(),
    product: options.product,
    type: options.type,
    brief: options.brief,
    references: options.references,
    mode: options.mode,
    dials: options.dials,
    directions: directions.map((direction) => ({
      id: direction.id,
      name: direction.name,
      prompt: buildDirectionPrompt(direction, options)
    }))
  };
  const markdown = `# Generated Image Prompts

These prompts are for Fast Direction Gate. They do not call the image API and do not authorize implementation before Migi selects a direction.

- mode: ${result.mode}

${result.directions.map((direction) => `## Direction ${direction.id} - ${direction.name}

${direction.prompt}
`).join("\n")}

## JSON

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`;
  const absolute = resolveProjectPath(options.out);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, markdown);
  pass("Generated direction prompts", { out: options.out, directions: result.directions.length });
}

function routeAgent() {
  const taskIndex = args.indexOf("--task");
  if (taskIndex === -1 || !args[taskIndex + 1]) {
    fail('Usage: node tools/design-os.mjs route-agent --task "..."');
  }

  const task = args[taskIndex + 1];
  const selected = [];

  for (const agent of visualAgents) {
    const matchedKeywords = agent.routeKeywords.filter((keyword) => keywordMatchesText(task, keyword));
    if (matchedKeywords.length > 0) {
      selected.push({
        id: agent.id,
        name: agent.name,
        path: agent.path,
        matchedKeywords
      });
    }
  }

  const impliesVisualQa = ["build", "app", "visual", "target", "inspiration", "selection", "roster", "gallery", "redesign"].some((keyword) => keywordMatchesText(task, keyword));
  if (impliesVisualQa && !selected.some((agent) => agent.id === "04-visual-qa-anti-slop")) {
    selected.push({
      id: "04-visual-qa-anti-slop",
      name: "Visual QA Anti-Slop Agent",
      path: "agents/04-visual-qa-anti-slop-agent.md",
      matchedKeywords: ["implied-visual-qa"]
    });
  }

  if (selected.length === 0) {
    selected.push({
      id: "04-visual-qa-anti-slop",
      name: "Visual QA Anti-Slop Agent",
      path: "agents/04-visual-qa-anti-slop-agent.md",
      matchedKeywords: ["fallback-qa"]
    });
  }

  console.log(JSON.stringify({ task, recommendedAgents: selected }, null, 2));
}

function routeTask() {
  const taskIndex = args.indexOf("--task");
  if (taskIndex === -1 || !args[taskIndex + 1]) {
    fail('Usage: node tools/design-os.mjs route --task "..."');
  }

  const task = args[taskIndex + 1];
  const registry = getRegistry();
  const selected = [];

  for (const skill of registry.skills) {
    const matchedKeywords = (skill.routeKeywords || []).filter((keyword) => keywordMatchesText(task, keyword));
    if (matchedKeywords.length > 0) {
      selected.push({
        id: skill.id,
        path: skill.path,
        matchedKeywords
      });
    }
  }

  if (selected.length === 0) {
    selected.push({
      id: "screenshot-scorecard-review",
      path: "skills/screenshot-scorecard-review/SKILL.md",
      matchedKeywords: ["fallback-review"]
    });
  }

  const unique = [];
  const seen = new Set();
  for (const skill of selected) {
    if (!seen.has(skill.id)) {
      unique.push(skill);
      seen.add(skill.id);
    }
  }

  console.log(JSON.stringify({ task, recommendedSkills: unique }, null, 2));
}

function newBrief() {
  const template = readJson(paths.briefTemplate, { base: "design-os" });
  const result = writeJsonIfMissing("design-brief.local.json", template);
  pass(result.created ? "Created design-brief.local.json" : "design-brief.local.json already exists");
}

function newInspirationManifest() {
  const template = readJson(paths.inspirationManifestTemplate, { base: "design-os" });
  const result = writeJsonIfMissing("inspiration-manifest.local.json", template);
  pass(result.created ? "Created inspiration-manifest.local.json" : "inspiration-manifest.local.json already exists");
}

function validateInspirationManifest(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-inspiration-manifest <file>");
  }

  const manifest = readJson(filePath);
  const errors = [];
  const missing = missingFields(manifest, requiredInspirationManifestFields);
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(", ")}`);
  }

  for (const field of ["projectName", "purpose", "localScreenshotsPath"]) {
    if (field in manifest && !isNonEmptyString(manifest[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }

  for (const field of ["sources", "references", "topThirtyStrongestReferences", "topTenCompositionPatterns", "topTenAntiPatternsToAvoid"]) {
    if (field in manifest && !Array.isArray(manifest[field])) {
      errors.push(`${field} must be an array.`);
    }
  }

  if (Array.isArray(manifest.references)) {
    manifest.references.forEach((reference, index) => {
      if (!isPlainObject(reference)) {
        errors.push(`references[${index}] must be an object.`);
        return;
      }
      const referenceMissing = missingFields(reference, requiredInspirationReferenceFields);
      if (referenceMissing.length > 0) {
        errors.push(`references[${index}] missing: ${referenceMissing.join(", ")}`);
      }
      for (const field of ["id", "title", "sourceName", "sourceUrl", "composition", "focalObject", "mood", "material", "motion", "interactionModel", "intentionallyAbsent", "notes"]) {
        if (field in reference && !isNonEmptyString(reference[field])) {
          errors.push(`references[${index}].${field} must be a non-empty string.`);
        }
      }
      if (reference.referenceType && !validReferenceTypes.has(reference.referenceType)) {
        errors.push(`references[${index}].referenceType must be one of: ${Array.from(validReferenceTypes).join(", ")}.`);
      }
      if (reference.trustLevel && !validTrustLevels.has(reference.trustLevel)) {
        errors.push(`references[${index}].trustLevel must be one of: ${Array.from(validTrustLevels).join(", ")}.`);
      }
      if ("screenshotLocalOnly" in reference && !isBoolean(reference.screenshotLocalOnly)) {
        errors.push(`references[${index}].screenshotLocalOnly must be a boolean.`);
      }
      if ("literalTarget" in reference && !isBoolean(reference.literalTarget)) {
        errors.push(`references[${index}].literalTarget must be a boolean.`);
      }
      if (reference.sourceName === "Pinterest" && reference.trustLevel !== "moodboard-only") {
        errors.push(`references[${index}] Pinterest references must use trustLevel moodboard-only.`);
      }
      if (reference.literalTarget === true && reference.referenceType !== "literal-target") {
        errors.push(`references[${index}] literalTarget true requires referenceType literal-target.`);
      }
    });
  }

  if (errors.length > 0) {
    fail(`Inspiration manifest failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Inspiration manifest valid", {
    file: filePath,
    references: manifest.references.length,
    localScreenshotsPath: manifest.localScreenshotsPath
  });
}

function validateBrief(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-brief <file>");
  }
  const brief = readJson(filePath);
  const errors = [];
  const missing = missingFields(brief, requiredBriefFields);
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(", ")}`);
  }

  for (const field of ["projectName", "projectType", "primaryUser", "primaryObject", "primaryAction", "visualWeight", "taskType"]) {
    if (field in brief && !isNonEmptyString(brief[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }

  for (const field of ["inspirationSources", "visualReferences", "targetScreens", "constraints", "forbiddenDirections", "requiredSkills"]) {
    if (field in brief && !Array.isArray(brief[field])) {
      errors.push(`${field} must be an array.`);
    }
  }

  if (typeof brief.isVisualHeavy !== "boolean") {
    errors.push("isVisualHeavy must be a boolean.");
  }

  const visualTaskTypes = new Set(["visual-heavy-ui", "new-app", "redesign", "selection-first", "gallery", "roster", "product-discovery"]);
  const impliesVisualHeavy = brief.visualWeight === "high" || visualTaskTypes.has(brief.taskType);
  if (impliesVisualHeavy && brief.isVisualHeavy !== true) {
    errors.push("Visual-heavy work must set isVisualHeavy to true.");
  }

  if (brief.isVisualHeavy === true) {
    if (!isNonEmptyArray(brief.inspirationSources) && !isNonEmptyArray(brief.visualReferences)) {
      errors.push("Visual-heavy work must include at least one inspirationSource or visualReference.");
    }
    if (!isNonEmptyArray(brief.targetScreens)) {
      errors.push("Visual-heavy work must include targetScreens.");
    }
  }

  if (!brief.approvalState || typeof brief.approvalState !== "object") {
    errors.push("approvalState must be an object.");
  } else {
    for (const field of ["status", "approvedBy", "approvalNotes"]) {
      if (!(field in brief.approvalState)) {
        errors.push(`approvalState.${field} is required.`);
      }
    }
    if (brief.approvalState.status && !["not-required", "pending", "approved", "rejected"].includes(brief.approvalState.status)) {
      errors.push("approvalState.status must be not-required, pending, approved, or rejected.");
    }
  }

  if (errors.length > 0) {
    fail(`Design brief failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Design brief valid", { file: filePath, isVisualHeavy: brief.isVisualHeavy, requiredSkills: brief.requiredSkills });
}

function validateConcepts(filePath, options = {}) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-concepts <file>");
  }
  const artifact = readJson(filePath);
  const errors = getConceptErrors(artifact, options);
  if (errors.length > 0) {
    fail(`Visual concepts failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Visual concepts valid", {
    file: filePath,
    conceptCount: artifact.concepts.length,
    approvalStatus: artifact.approvalStatus,
    selectedConceptId: artifact.selectedConceptId
  });
}

function getConceptErrors(artifact, options = {}) {
  const errors = [];
  for (const field of ["projectName", "selectedConceptId", "approvalStatus", "approvedBy", "approvalNotes", "concepts"]) {
    if (!(field in artifact)) {
      errors.push(`${field} is required.`);
    }
  }

  if (!["pending", "approved", "rejected"].includes(artifact.approvalStatus)) {
    errors.push("approvalStatus must be pending, approved, or rejected.");
  }

  if (!Array.isArray(artifact.concepts)) {
    errors.push("concepts must be an array.");
    return errors;
  }

  if (artifact.concepts.length !== 3) {
    errors.push("concepts must contain exactly 3 concepts.");
  }

  const ids = new Set();
  const compositionFingerprints = new Set();
  const conceptFingerprints = new Set();

  artifact.concepts.forEach((concept, index) => {
    const missing = missingFields(concept, requiredConceptFields);
    if (missing.length > 0) {
      errors.push(`concepts[${index}] missing: ${missing.join(", ")}`);
    }

    for (const field of requiredConceptStringFields) {
      if (field in concept && !isNonEmptyString(concept[field])) {
        errors.push(`concepts[${index}].${field} must be a non-empty string.`);
      }
    }

    if ("responsiveStrategy" in concept) {
      validateViewportObject(concept.responsiveStrategy, `concepts[${index}].responsiveStrategy`, errors);
    }

    if ("screenshots" in concept) {
      validateViewportObject(concept.screenshots, `concepts[${index}].screenshots`, errors);
      if (options.requireScreenshotFiles) {
        validateScreenshotFiles(concept.screenshots, `concepts[${index}].screenshots`, errors);
      }
    }

    if (concept.id) {
      if (ids.has(concept.id)) {
        errors.push(`Duplicate concept id: ${concept.id}`);
      }
      ids.add(concept.id);
    }

    if (isNonEmptyString(concept.composition)) {
      compositionFingerprints.add(normalizeText(concept.composition));
    }

    if (isNonEmptyString(concept.visualMetaphor) || isNonEmptyString(concept.composition)) {
      conceptFingerprints.add(`${normalizeText(concept.visualMetaphor)}|${normalizeText(concept.composition)}`);
    }
  });

  if (artifact.concepts.length === 3 && compositionFingerprints.size === 1) {
    errors.push("concepts must be visually distinct; all three compositions are identical.");
  }

  if (artifact.concepts.length === 3 && conceptFingerprints.size < 3) {
    errors.push("concepts must be distinct; duplicate visual metaphor/composition pairs found.");
  }

  const approvalRequired = options.requireApproved === true || artifact.approvalStatus === "approved";
  if (approvalRequired) {
    if (!isNonEmptyString(artifact.selectedConceptId)) {
      errors.push("approved concepts must include selectedConceptId.");
    } else if (!ids.has(artifact.selectedConceptId)) {
      errors.push("selectedConceptId must match one of the concept ids.");
    }
    if (!isNonEmptyString(artifact.approvedBy)) {
      errors.push("approved concepts must include approvedBy.");
    }
  }

  if (options.requireApproved && artifact.approvalStatus !== "approved") {
    errors.push("visual-heavy gate requires approvalStatus approved after Migi reviews rendered previews.");
  }

  return errors;
}

function validateScreenshotReport(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-screenshot-report <file>");
  }
  const report = readJson(filePath);
  const errors = [];
  const missing = missingFields(report, requiredScreenshotFields);
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(", ")}`);
  }

  const isVisualWork = inferVisualWork(report);

  if ("isVisualWork" in report && !isBoolean(report.isVisualWork)) {
    errors.push("isVisualWork must be a boolean.");
  }

  if (report.mode && !validDoneModes.has(report.mode)) {
    errors.push(`mode must be one of: ${Array.from(validDoneModes).join(", ")}.`);
  }

  if (isVisualWork) {
    validateRequiredViewportStrings(report.currentScreenshots, "currentScreenshots", errors);
  }

  if (!report.viewportChecks || typeof report.viewportChecks !== "object") {
    errors.push("viewportChecks must be an object.");
  } else {
    for (const viewport of ["390", "768", "1440"]) {
      if (!report.viewportChecks[viewport]) {
        errors.push(`viewportChecks.${viewport} is required.`);
      } else {
        const viewportMissing = missingFields(report.viewportChecks[viewport], [
          "screenshot",
          "primaryObjectVisible",
          "primaryActionVisible",
          "noHorizontalScroll",
          "noOverlap",
          "readableText",
          "notes"
        ]);
        if (viewportMissing.length > 0) {
          errors.push(`viewportChecks.${viewport} missing: ${viewportMissing.join(", ")}`);
        }
        if (isVisualWork && !isNonEmptyString(report.viewportChecks[viewport].screenshot)) {
          errors.push(`viewportChecks.${viewport}.screenshot is required for visual work.`);
        }
      }
    }
  }

  validateVisualQa(report.visualQa, "visualQa", errors);

  for (const field of ["overlapDetected", "horizontalScrollDetected", "unreadableTextDetected"]) {
    if (field in report && typeof report[field] !== "boolean") {
      errors.push(`${field} must be a boolean.`);
    }
  }

  if (!Array.isArray(report.deadButtonsFound)) {
    errors.push("deadButtonsFound must be an array.");
  }
  if (!Array.isArray(report.remainingWeaknesses)) {
    errors.push("remainingWeaknesses must be an array.");
  }

  if (errors.length > 0) {
    fail(`Screenshot report failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Screenshot report valid", { file: filePath });
}

function newDoneReport() {
  const template = readJson(paths.doneReportTemplate, { base: "design-os" });
  const result = writeJsonIfMissing("done-report.local.json", template);
  pass(result.created ? "Created done-report.local.json" : "done-report.local.json already exists");
}

function newTargetCopyReport() {
  const template = readJson(paths.targetCopyReportTemplate, { base: "design-os" });
  const result = writeJsonIfMissing("target-copy-report.local.json", template);
  pass(result.created ? "Created target-copy-report.local.json" : "target-copy-report.local.json already exists");
}

function newAssetManifest() {
  const template = readJson(paths.assetManifestTemplate, { base: "design-os" });
  const result = writeJsonIfMissing("asset-manifest.local.json", template);
  pass(result.created ? "Created asset-manifest.local.json" : "asset-manifest.local.json already exists");
}

function validateDoneReport(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-done-report <file>");
  }

  const report = readJson(filePath);
  const errors = [];
  const missing = missingFields(report, requiredDoneReportFields);
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(", ")}`);
  }

  if (report.mode && !validDoneModes.has(report.mode)) {
    errors.push(`mode must be one of: ${Array.from(validDoneModes).join(", ")}.`);
  }

  if (report.finalStatus && !validFinalStatuses.has(report.finalStatus)) {
    errors.push(`finalStatus must be one of: ${Array.from(validFinalStatuses).join(", ")}.`);
  }

  if (report.finalUiIntegrityVerdict && !validFinalUiIntegrityVerdicts.has(report.finalUiIntegrityVerdict)) {
    errors.push(`finalUiIntegrityVerdict must be one of: ${Array.from(validFinalUiIntegrityVerdicts).join(", ")}.`);
  }

  if (report.finalVerdict && !validFinalUiIntegrityVerdicts.has(report.finalVerdict)) {
    errors.push(`finalVerdict must be one of: ${Array.from(validFinalUiIntegrityVerdicts).join(", ")}.`);
  }

  if ("isVisualWork" in report && !isBoolean(report.isVisualWork)) {
    errors.push("isVisualWork must be a boolean.");
  }

  for (const field of [
    "filesChanged",
    "commandsRun",
    "remainingWeaknesses",
    "blockers",
    "finalUiIntegrityBlockers",
    "screenshotEvidence",
    "widthSweepTested",
    "heightMatrixTested",
    "viewportMatrixTested",
    "scrollSamplesTested",
    "interactionStatesTested",
    "failedViewportStates",
    "passedViewportStates"
  ]) {
    if (field in report && !Array.isArray(report[field])) {
      errors.push(`${field} must be an array.`);
    }
  }

  for (const field of [
    "finalUiIntegrityGateRun",
    "clippedTextRemaining",
    "textClipRemaining",
    "overlapRemaining",
    "floatingOverlapRemaining",
    "viewportEdgeClippingRemaining",
    "floatingObjectDriftRemaining",
    "horizontalScrollPartialContentRemaining",
    "blankScrollStateRemaining",
    "mediaTextCollisionRemaining",
    "navOverflowRemaining",
    "fixedOverlayCollisionRemaining",
    "accidentalWhitespaceRemaining",
    "finalHandoffAllowed"
  ]) {
    if (field in report && !isBoolean(report[field])) {
      errors.push(`${field} must be a boolean.`);
    }
  }

  if ("finalUiIntegrityBlockerCount" in report && !isNumber(report.finalUiIntegrityBlockerCount)) {
    errors.push("finalUiIntegrityBlockerCount must be a number.");
  }

  if ("finalUiIntegrityScreenshotDir" in report && !isNonEmptyString(report.finalUiIntegrityScreenshotDir)) {
    errors.push("finalUiIntegrityScreenshotDir must be a non-empty string. Use \"blocked\" when screenshots could not be captured.");
  }

  if (!isPlainObject(report.screenshots)) {
    errors.push("screenshots must be an object with 390, 768, and 1440 keys for visual work.");
  }

  validateVisualQa(report.visualQa, "visualQa", errors);

  if (!isPlainObject(report.interactionQa)) {
    errors.push("interactionQa must be an object.");
  } else if (!Array.isArray(report.interactionQa.deadButtons)) {
    errors.push("interactionQa.deadButtons must be an array.");
  }

  validateAssetQa(report.assetQa, "assetQa", errors);
  validateTargetCopyQa(report.targetCopyQa, "targetCopyQa", errors, report.mode);
  validateProductQa(report.productQa, "productQa", errors, report);

  if (report.mode === "literal-target-copy" && report.assetQa?.required !== true) {
    errors.push("assetQa.required must be true for image-led Literal Target Copy Mode.");
  }

  if (!isPlainObject(report.score)) {
    errors.push("score must be an object with current and target numbers.");
  } else {
    if (!isNumber(report.score.current)) {
      errors.push("score.current must be a number.");
    }
    if (!isNumber(report.score.target)) {
      errors.push("score.target must be a number.");
    }
  }

  const isVisualWork = inferVisualWork(report);
  const claimsDone = report.finalStatus === "done";
  const visualHandoffAllowed = report.finalHandoffAllowed === true || claimsDone || report.finalVerdict === "passed";
  if (isVisualWork) {
    if (report.finalUiIntegrityGateVersion !== "v3") {
      errors.push("visual work requires finalUiIntegrityGateVersion v3.");
    }

    const hasAllViewportSamples = Array.isArray(report.viewportMatrixTested) &&
      finalUiIntegrityV2ViewportMatrix.every((width) => report.viewportMatrixTested.includes(width));
    const hasAllWidthSweepSamples = Array.isArray(report.widthSweepTested) &&
      finalUiIntegrityV3WidthSweep.every((width) => report.widthSweepTested.includes(width));
    const hasAllHeightSamples = Array.isArray(report.heightMatrixTested) &&
      finalUiIntegrityV3HeightMatrix.every((height) => report.heightMatrixTested.includes(height));
    const hasAllScrollSamples = Array.isArray(report.scrollSamplesTested) &&
      finalUiIntegrityV2ScrollSamples.every((sample) => report.scrollSamplesTested.some((actual) => Math.abs(Number(actual) - sample) < 0.0001));

    if (visualHandoffAllowed && !hasAllWidthSweepSamples) {
      errors.push(`finalHandoffAllowed/final passed requires widthSweepTested to include the v3 360:1920:40 sweep.`);
    }
    if (visualHandoffAllowed && !hasAllHeightSamples) {
      errors.push(`finalHandoffAllowed/final passed requires heightMatrixTested to include: ${finalUiIntegrityV3HeightMatrix.join(", ")}.`);
    }
    if (visualHandoffAllowed && !hasAllViewportSamples && !hasAllWidthSweepSamples) {
      errors.push(`finalHandoffAllowed/final passed requires viewportMatrixTested or widthSweepTested evidence.`);
    }
    if (visualHandoffAllowed && !hasAllScrollSamples) {
      errors.push(`finalHandoffAllowed/final passed requires scrollSamplesTested to include: ${finalUiIntegrityV2ScrollSamples.join(", ")}.`);
    }
    if (visualHandoffAllowed && (!Array.isArray(report.interactionStatesTested) || report.interactionStatesTested.length === 0)) {
      errors.push("finalHandoffAllowed/final passed requires interactionStatesTested to list sampled states.");
    }

    if (claimsDone && report.finalUiIntegrityGateRun !== true) {
      errors.push("finalStatus done requires finalUiIntegrityGateRun true.");
    }
    if (claimsDone && report.finalUiIntegrityVerdict !== "passed") {
      errors.push("finalStatus done requires finalUiIntegrityVerdict passed.");
    }
    if (claimsDone && report.finalVerdict !== "passed") {
      errors.push("finalStatus done requires finalVerdict passed.");
    }
    if (claimsDone && Array.isArray(report.finalUiIntegrityBlockers) && report.finalUiIntegrityBlockers.length > 0) {
      errors.push("finalStatus done requires finalUiIntegrityBlockers to be empty.");
    }
    for (const field of [
      "clippedTextRemaining",
      "textClipRemaining",
      "overlapRemaining",
      "floatingOverlapRemaining",
      "viewportEdgeClippingRemaining",
      "floatingObjectDriftRemaining",
      "horizontalScrollPartialContentRemaining",
      "blankScrollStateRemaining",
      "mediaTextCollisionRemaining",
      "navOverflowRemaining",
      "fixedOverlayCollisionRemaining",
      "accidentalWhitespaceRemaining"
    ]) {
      if (claimsDone && report[field] === true) {
        errors.push(`finalStatus done requires ${field} false.`);
      }
    }

    const visualQaBlocked = report.visualQa?.status === "blocked" || report.visualQa?.captureMode === "blocked";
    if (claimsDone || !visualQaBlocked) {
      validateRequiredViewportStrings(report.screenshots, "screenshots", errors);
      if (!isNonEmptyString(report.screenshotReportPath)) {
        errors.push("screenshotReportPath is required for visual work with available visual QA evidence.");
      }
    }

    if (claimsDone && !isNonEmptyString(report.visualQa?.captureMode)) {
      errors.push("visualQa.captureMode is required before finalStatus can be done for visual work.");
    }
    if (claimsDone && report.visualQa?.status === "blocked") {
      errors.push("finalStatus cannot be done while visualQa.status is blocked.");
    }
    if (claimsDone && report.visualQa?.captureMode === "blocked") {
      errors.push("finalStatus cannot be done while visualQa.captureMode is blocked.");
    }
    if (claimsDone && report.visualQa?.captureMode === "manual-import") {
      const manualChecksPassing = report.visualQa?.noOverlap === true &&
        report.visualQa?.noTextOnButtons === true &&
        report.visualQa?.noWatermark === true &&
        report.visualQa?.noHorizontalOverflow === true &&
        report.visualQa?.noCutHeroObject === true &&
        Array.isArray(report.interactionQa?.deadButtons) &&
        report.interactionQa.deadButtons.length === 0;
      if (!manualChecksPassing) {
        errors.push("finalStatus done with manual-import capture requires all manual visual checks to be passing and deadButtons empty.");
      }
    }

    if (claimsDone && report.visualQa?.noOverlap === false) {
      errors.push("visualQa.noOverlap must be true before claiming visual work is done.");
    }
    if (claimsDone && report.visualQa?.noTextOnButtons === false) {
      errors.push("visualQa.noTextOnButtons must be true before claiming visual work is done.");
    }
    if (claimsDone && report.visualQa?.noWatermark === false) {
      errors.push("visualQa.noWatermark must be true before claiming visual work is done.");
    }
    if (claimsDone && report.visualQa?.noHorizontalOverflow === false) {
      errors.push("visualQa.noHorizontalOverflow must be true before claiming visual work is done.");
    }
    if (claimsDone && report.visualQa?.noCutHeroObject === false && !isNonEmptyString(report.visualQa.noCutHeroObjectJustification)) {
      errors.push("visualQa.noCutHeroObject must be true unless noCutHeroObjectJustification explains the accepted crop.");
    }
  }

  if (Array.isArray(report.interactionQa?.deadButtons) && report.interactionQa.deadButtons.length > 0) {
    errors.push("interactionQa.deadButtons must be empty before completion.");
  }

  if (Array.isArray(report.blockers) && report.blockers.length > 0 && report.finalStatus === "done") {
    errors.push("finalStatus cannot be done while blockers exist.");
  }

  if (report.finalUiIntegrityVerdict !== "passed" && report.finalVerdict === "passed") {
    errors.push("finalVerdict cannot be passed unless finalUiIntegrityVerdict is passed.");
  }

  if (report.finalHandoffAllowed === false && report.finalVerdict === "passed") {
    errors.push("finalVerdict cannot be passed when finalHandoffAllowed is false.");
  }

  if (isNumber(report.finalUiIntegrityBlockerCount) && report.finalUiIntegrityBlockerCount > 0 && report.finalVerdict === "passed") {
    errors.push("finalVerdict cannot be passed while finalUiIntegrityBlockerCount is greater than 0.");
  }

  if (Array.isArray(report.failedViewportStates) && report.failedViewportStates.length > 0 && report.finalVerdict === "passed") {
    errors.push("finalVerdict cannot be passed while failedViewportStates is non-empty.");
  }

  for (const field of [
    "clippedTextRemaining",
    "textClipRemaining",
    "overlapRemaining",
    "floatingOverlapRemaining",
    "viewportEdgeClippingRemaining",
    "floatingObjectDriftRemaining",
    "horizontalScrollPartialContentRemaining",
    "blankScrollStateRemaining",
    "mediaTextCollisionRemaining",
    "navOverflowRemaining",
    "fixedOverlayCollisionRemaining"
  ]) {
    if (report[field] === true && !["failed", "blocked"].includes(report.finalVerdict)) {
      errors.push(`${field} true requires finalVerdict failed or blocked.`);
    }
  }

  if (report.finalStatus === "done" && report.visualQa?.status !== "passing") {
    errors.push("finalStatus cannot be done unless visualQa.status is passing.");
  }

  if (report.finalStatus === "done" && isNumber(report.score?.current) && report.score.current < 80) {
    errors.push("score.current below 80 cannot have finalStatus done.");
  }

  if (isVisualWork && isNumber(report.score?.current) && report.score.current === 60 && report.finalStatus !== "needs-work") {
    errors.push("visual work with score.current 60 must remain finalStatus needs-work.");
  }

  if (
    Array.isArray(report.remainingWeaknesses) &&
    report.remainingWeaknesses.length === 0 &&
    isNumber(report.score?.current) &&
    isNumber(report.score?.target) &&
    report.score.current < report.score.target
  ) {
    errors.push("remainingWeaknesses cannot be empty when score.current is below score.target.");
  }

  if (errors.length > 0) {
    fail(`Done report failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Done report valid", {
    file: filePath,
    mode: report.mode,
    finalStatus: report.finalStatus,
    score: report.score
  });
}

function validateTargetCopy(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-target-copy <file>");
  }

  const report = readJson(filePath);
  const errors = [];
  const missing = missingFields(report, requiredTargetCopyFields);
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(", ")}`);
  }

  if (!isNonEmptyArray(report.targetScreens)) {
    errors.push("targetScreens must include at least one target screen.");
  }

  if (!isPlainObject(report.targetImagePaths)) {
    errors.push("targetImagePaths must be an object keyed by target screen.");
  } else if (!Object.values(report.targetImagePaths).some(isNonEmptyString)) {
    errors.push("targetImagePaths must include at least one target image path.");
  }
  if (!isPlainObject(report.currentScreenshotPaths)) {
    errors.push("currentScreenshotPaths must be an object keyed by target screen.");
  } else if (!Object.values(report.currentScreenshotPaths).some(isNonEmptyString)) {
    errors.push("currentScreenshotPaths must include at least one current screenshot path.");
  }

  if (report.approvalStatus === "approved" && !isNonEmptyString(report.comparisonReportPath)) {
    errors.push("comparisonReportPath is required before Literal Target Copy Mode can be approved.");
  }

  if (Array.isArray(report.targetScreens)) {
    for (const screen of report.targetScreens) {
      if (!isNonEmptyString(report.targetImagePaths?.[screen])) {
        errors.push(`targetImagePaths.${screen} is required.`);
      }
      if (!isNonEmptyString(report.currentScreenshotPaths?.[screen])) {
        errors.push(`currentScreenshotPaths.${screen} is required.`);
      }
    }
  }

  if (!Array.isArray(report.excludedArtifacts)) {
    errors.push("excludedArtifacts must be an array.");
  } else if (!includesAllArtifactExclusions(report.excludedArtifacts)) {
    errors.push("excludedArtifacts must mention watermarks, editor UI, and browser chrome.");
  }

  if (!isPlainObject(report.visualShellStatus)) {
    errors.push("visualShellStatus must be an object.");
  } else {
    if (!isBoolean(report.visualShellStatus.staticShellBuilt)) {
      errors.push("visualShellStatus.staticShellBuilt must be a boolean.");
    }
    if (!isBoolean(report.visualShellStatus.productFeaturesAddedBeforeShellParityApproval)) {
      errors.push("visualShellStatus.productFeaturesAddedBeforeShellParityApproval must be a boolean.");
    }
    if (report.visualShellStatus.productFeaturesAddedBeforeShellParityApproval === true) {
      errors.push("product features cannot be added before shell parity approval.");
    }
  }

  if (!isNonEmptyArray(report.exactDifferences)) {
    errors.push("exactDifferences must include the exact remaining target/current differences.");
  }

  if (!Array.isArray(report.intentionalDifferences)) {
    errors.push("intentionalDifferences must be an array.");
  }
  if (!Array.isArray(report.remainingMismatches)) {
    errors.push("remainingMismatches must be an array.");
  }

  if (report.approvalStatus && !validApprovalStatuses.has(report.approvalStatus)) {
    errors.push(`approvalStatus must be one of: ${Array.from(validApprovalStatuses).join(", ")}.`);
  }

  if (report.approvalStatus === "approved" && Array.isArray(report.remainingMismatches)) {
    const blocking = report.remainingMismatches.filter((mismatch) => {
      if (typeof mismatch === "string") {
        return normalizeText(mismatch).includes("blocking");
      }
      return mismatch?.blocking === true;
    });
    if (blocking.length > 0) {
      errors.push("approvalStatus cannot be approved while remainingMismatches contains blocking items.");
    }
  }

  for (const field of [
    "compositionMatchNotes",
    "focalObjectMatchNotes",
    "layoutMatchNotes",
    "typographyMatchNotes"
  ]) {
    if (!isNonEmptyString(report[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }

  if (!Array.isArray(report.interactionMinimums)) {
    errors.push("interactionMinimums must be an array.");
  }

  if (errors.length > 0) {
    fail(`Target copy report failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Target copy report valid", {
    file: filePath,
    targetScreens: report.targetScreens,
    approvalStatus: report.approvalStatus
  });
}

function validateAssets(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-assets <file>");
  }

  const manifest = readJson(filePath);
  const errors = [];
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    errors.push("assets must be a non-empty array.");
  }

  (manifest.assets || []).forEach((asset, index) => {
    if (!isPlainObject(asset)) {
      errors.push(`assets[${index}] must be an object.`);
      return;
    }

    const missing = missingFields(asset, requiredAssetFields);
    if (missing.length > 0) {
      errors.push(`assets[${index}] missing: ${missing.join(", ")}`);
    }

    if (asset.role && !validAssetRoles.has(asset.role)) {
      errors.push(`assets[${index}].role must be one of: ${Array.from(validAssetRoles).join(", ")}.`);
    }
    if (asset.sourceType && !validAssetSourceTypes.has(asset.sourceType)) {
      errors.push(`assets[${index}].sourceType must be one of: ${Array.from(validAssetSourceTypes).join(", ")}.`);
    }

    for (const field of ["watermarkFree", "browserChromeFree", "editorUiFree", "placeholder", "repeatedAsset", "approvedForProduction"]) {
      if (field in asset && !isBoolean(asset[field])) {
        errors.push(`assets[${index}].${field} must be a boolean.`);
      }
    }

    const assetText = normalizeText(`${asset.assetPath || ""} ${asset.mappedObject || ""} ${asset.source || ""} ${asset.usageNotes || ""}`);
    const isProduction = asset.role === "production" || asset.approvedForProduction === true;

    if (asset.role === "production") {
      if (asset.watermarkFree === false) {
        errors.push(`assets[${index}] production asset must be watermarkFree.`);
      }
      if (asset.browserChromeFree === false) {
        errors.push(`assets[${index}] production asset must be browserChromeFree.`);
      }
      if (asset.editorUiFree === false) {
        errors.push(`assets[${index}] production asset must be editorUiFree.`);
      }
      if (asset.sourceType === "generated" && !isNonEmptyString(asset.generatedApprovalNote)) {
        errors.push(`assets[${index}] generated production asset requires generatedApprovalNote.`);
      }
    }

    if (asset.repeatedAsset === true && isPrimaryObjectAsset(asset)) {
      errors.push(`assets[${index}] primary object assets cannot be marked repeatedAsset.`);
    }

    if (asset.approvedForProduction === true && !isNonEmptyString(asset.source)) {
      errors.push(`assets[${index}] approvedForProduction requires a non-empty source.`);
    }

    if (isProduction && assetText.includes("target screenshot")) {
      errors.push(`assets[${index}] target screenshot cannot be marked as a production asset.`);
    }
  });

  if (errors.length > 0) {
    fail(`Asset manifest failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Asset manifest valid", {
    file: filePath,
    assetCount: manifest.assets.length
  });
}

function validateVisualQaReport(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-visual-qa-report <file>");
  }

  const report = readJson(filePath);
  const errors = [];
  for (const field of ["projectName", "runName", "url", "createdAt", "status", "finalStatus", "captureMode", "browserRequested", "browserUsed", "browserAttempts", "tempDirectory", "tmpdirOverrideUsed", "tmpdirOverride", "inputDir", "originalScreenshotPaths", "screenshots", "checks", "manualChecklist", "buttonInventory", "deadButtons", "consoleErrors", "blockers"]) {
    if (!(field in report)) {
      errors.push(`${field} is required.`);
    }
  }
  if (report.status && !["captured", "blocked", "needs-manual-review", "passing", "failing"].includes(report.status)) {
    errors.push("status must be captured, blocked, needs-manual-review, passing, or failing.");
  }
  if (report.finalStatus && !["passing", "blocked", "needs-human-review"].includes(report.finalStatus)) {
    errors.push("finalStatus must be passing, blocked, or needs-human-review.");
  }
  if (report.captureMode && !["automated", "manual-import", "blocked"].includes(report.captureMode)) {
    errors.push("captureMode must be automated, manual-import, or blocked.");
  }
  if ("tmpdirOverrideUsed" in report && !isBoolean(report.tmpdirOverrideUsed)) {
    errors.push("tmpdirOverrideUsed must be a boolean.");
  }
  if ("browserAttempts" in report && !Array.isArray(report.browserAttempts)) {
    errors.push("browserAttempts must be an array.");
  }
  if ("originalScreenshotPaths" in report && !isPlainObject(report.originalScreenshotPaths)) {
    errors.push("originalScreenshotPaths must be an object.");
  }
  if (isPlainObject(report.screenshots)) {
    for (const viewport of viewportKeys) {
      if (!(viewport in report.screenshots)) {
        errors.push(`screenshots.${viewport} is required.`);
      }
    }
  } else {
    errors.push("screenshots must be an object.");
  }
  if (!isPlainObject(report.checks)) {
    errors.push("checks must be an object.");
  } else {
    for (const field of ["captured390", "captured768", "captured1440", "noHorizontalOverflow"]) {
      if (!(field in report.checks) || !isBoolean(report.checks[field])) {
        errors.push(`checks.${field} must be a boolean.`);
      }
    }
  }
  if (!isPlainObject(report.manualChecklist)) {
    errors.push("manualChecklist must be an object.");
  } else {
    for (const field of ["noOverlap", "noTextOnButtons", "noWatermark", "noHorizontalOverflow", "noCutHeroObject", "noDeadButtons", "objectSwapInvariance"]) {
      if (!(field in report.manualChecklist)) {
        errors.push(`manualChecklist.${field} is required.`);
      }
    }
  }
  for (const field of ["buttonInventory", "deadButtons", "consoleErrors", "blockers"]) {
    if (field in report && !Array.isArray(report[field])) {
      errors.push(`${field} must be an array.`);
    }
  }

  if (errors.length > 0) {
    fail(`Visual QA report failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Visual QA report valid", {
    file: filePath,
    status: report.status,
    blockers: Array.isArray(report.blockers) ? report.blockers.length : 0
  });
}

function validateComparisonReport(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-comparison-report <file>");
  }

  const report = readJson(filePath);
  const errors = [];
  for (const field of ["projectName", "targetImagePath", "currentImagePath", "dimensions", "dimensionsMatch", "layoutMatchNotes", "focalObjectMatchNotes", "typographyMatchNotes", "spacingMatchNotes", "extraMissingUiNotes", "exactRemainingDifferences", "blockingDifferences"]) {
    if (!(field in report)) {
      errors.push(`${field} is required.`);
    }
  }
  if (!isPlainObject(report.dimensions)) {
    errors.push("dimensions must be an object.");
  }
  if ("dimensionsMatch" in report && !isBoolean(report.dimensionsMatch)) {
    errors.push("dimensionsMatch must be a boolean.");
  }
  for (const field of ["exactRemainingDifferences", "blockingDifferences"]) {
    if (field in report && !Array.isArray(report[field])) {
      errors.push(`${field} must be an array.`);
    }
  }
  if (errors.length > 0) {
    fail(`Screenshot comparison report failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Screenshot comparison report valid", { file: filePath, dimensionsMatch: report.dimensionsMatch });
}

function validateObjectSwapReport(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-object-swap-report <file>");
  }

  const report = readJson(filePath);
  const errors = [];
  for (const field of ["objectSetName", "objectsTested", "screenshotPaths", "stableFrame", "crop", "scale", "objectPosition", "horizontalOverflow", "overlap", "failures", "finalStatus"]) {
    if (!(field in report)) {
      errors.push(`${field} is required.`);
    }
  }
  if (!Array.isArray(report.objectsTested)) {
    errors.push("objectsTested must be an array.");
  }
  if (!isPlainObject(report.screenshotPaths)) {
    errors.push("screenshotPaths must be an object.");
  }
  for (const field of ["stableFrame", "crop", "scale", "objectPosition", "horizontalOverflow", "overlap"]) {
    if (!isPlainObject(report[field])) {
      errors.push(`${field} must be an object.`);
    } else if (!("confirmed" in report[field])) {
      errors.push(`${field}.confirmed is required.`);
    }
  }
  if (!Array.isArray(report.failures)) {
    errors.push("failures must be an array.");
  }
  if (report.finalStatus && !["pass", "fail", "blocked", "manual-review"].includes(report.finalStatus)) {
    errors.push("finalStatus must be pass, fail, blocked, or manual-review.");
  }
  if (errors.length > 0) {
    fail(`Object swap report failed validation:\n- ${errors.join("\n- ")}`);
  }
  pass("Object swap report valid", { file: filePath, finalStatus: report.finalStatus });
}

function validateSkillVerdict(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs validate-skill-verdict <file>");
  }

  const report = readJson(filePath);
  const errors = [];

  for (const field of ["version", "skillId", "task", "phase", "status", "notes"]) {
    if (!isNonEmptyString(report[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }

  if (!validSkillVerdictStatuses.has(report.status)) {
    errors.push(`status must be one of: ${Array.from(validSkillVerdictStatuses).join(", ")}.`);
  }

  if (!Array.isArray(report.evidence)) {
    errors.push("evidence must be an array.");
  } else {
    report.evidence.forEach((item, index) => {
      if (!isPlainObject(item)) {
        errors.push(`evidence[${index}] must be an object.`);
        return;
      }
      for (const field of ["type", "pathOrCommand", "summary"]) {
        if (!isNonEmptyString(item[field])) {
          errors.push(`evidence[${index}].${field} must be a non-empty string.`);
        }
      }
    });
  }

  if (!isPlainObject(report.machineVerdict)) {
    errors.push("machineVerdict must be an object.");
  } else {
    if (!("score" in report.machineVerdict) || !(report.machineVerdict.score === null || isNumber(report.machineVerdict.score))) {
      errors.push("machineVerdict.score must be a number or null.");
    }
    for (const field of ["scoreCaps", "blockers"]) {
      if (!Array.isArray(report.machineVerdict[field])) {
        errors.push(`machineVerdict.${field} must be an array.`);
      }
    }
  }

  if (!Array.isArray(report.repairTasks)) {
    errors.push("repairTasks must be an array.");
  } else {
    report.repairTasks.forEach((task, index) => {
      if (!isPlainObject(task)) {
        errors.push(`repairTasks[${index}] must be an object.`);
        return;
      }
      if (!validSkillRepairPriorities.has(task.priority)) {
        errors.push(`repairTasks[${index}].priority must be P0, P1, or P2.`);
      }
      for (const field of ["ownerSkill", "target", "action", "acceptanceCheck"]) {
        if (!isNonEmptyString(task[field])) {
          errors.push(`repairTasks[${index}].${field} must be a non-empty string.`);
        }
      }
    });
  }

  if (!Array.isArray(report.nextSkills)) {
    errors.push("nextSkills must be an array.");
  }

  if (report.status === "needs-repair" && Array.isArray(report.repairTasks) && report.repairTasks.length === 0) {
    errors.push("needs-repair verdicts must include at least one repair task.");
  }

  if (errors.length > 0) {
    fail(`Skill verdict failed validation:\n- ${errors.join("\n- ")}`);
  }

  pass("Skill verdict valid", {
    file: filePath,
    skillId: report.skillId,
    status: report.status,
    repairTasks: Array.isArray(report.repairTasks) ? report.repairTasks.length : 0
  });
}

function doctor() {
  const checks = [];
  const errors = [];
  const checkJson = (filePath, options = {}) => {
    const absolute = options.base === "design-os" ? resolveDesignOsPath(filePath) : resolveProjectPath(filePath);
    try {
      JSON.parse(fs.readFileSync(absolute, "utf8"));
      checks.push(filePath);
    } catch (error) {
      errors.push(`${filePath}: ${error.message}`);
    }
  };

  for (const filePath of [
    paths.registry,
    paths.briefTemplate,
    paths.doneReportTemplate,
    paths.targetCopyReportTemplate,
    paths.assetManifestTemplate,
    paths.unsplashAssetManifestTemplate,
    paths.inspirationManifestTemplate,
    paths.visualQaReportTemplate,
    paths.screenshotComparisonReportTemplate,
    paths.objectSwapReportTemplate,
    paths.motionSequenceReportTemplate,
    paths.skillVerdictTemplate,
    "visual-library/approved/inspiration/advanced-motion-sites/references.json",
    "design-intelligence/motion-tool-stack.json",
    "design-intelligence/design-direction-image-prompts.json",
    "templates/visual-agent-run.template.json",
    "templates/prompts/codex-inspiration-scout.md",
    "templates/prompts/codex-art-direction-concept.md",
    "templates/prompts/codex-literal-target-copy.md",
    "templates/prompts/codex-visual-qa-fix.md",
    "templates/prompts/codex-productionizer.md",
    "templates/prompts/domain-realism-mock-data-director.md",
    "templates/prompts/creative-orchestration-director.md",
    "templates/prompts/codex-advanced-motion-choreography.md",
    "templates/prompts/codex-motion-benchmark-review.md",
    "templates/prompts/codex-motion-only-patch.md",
    "templates/prompts/codex-generate-3-direction-images.md",
    "templates/prompts/codex-select-direction-from-images.md",
    "templates/prompts/final-ui-integrity-gate.md",
    "templates/prompts/webgl-shader-primitives-gate.md",
    "prompts/dogfood/animejs-motion-gate.md",
    "design-dna/animejs-motion-primitive-rules.md",
    "implementation-kits/animejs-motion/README.md",
    "skills/animejs-motion-director/SKILL.md",
    "design-dna/webgl-shader-visual-primitives-rules.md",
    "templates/implementation-kits/webgl-shader-primitives/README.md",
    "templates/checklists/webgl-shader-primitives-checklist.md",
    "templates/reports/webgl-shader-primitives-report.md",
    "visual-primitives/liquid-logo/README.md",
    "skills/creative-orchestration-director/SKILL.md",
    "skills/final-ui-integrity-gate/SKILL.md",
    "skills/webgl-shader-primitives/SKILL.md",
    "tools/final-ui-integrity-check.mjs",
    "design-intelligence/skill-orchestration-matrix.md",
    "design-intelligence/self-correction-repair-loop.md",
    "templates/reports/creative-state-ledger.template.md",
    "templates/reports/repair-task-queue.template.md",
    "templates/reports/final-ui-integrity-report.md",
    "evaluation/benchmarks/motion-cinematic.benchmark.md",
    "design-intelligence/motion-tool-stack-guidance.md",
    "design-intelligence/design-direction-image-guidance.md",
    "templates/screenshot-report.template.json",
    "templates/visual-concepts.template.json",
    "inspiration-library/queues/weekend-visual-corpus.queue.json",
    "inspiration-library/sources/award-sites.json",
    "inspiration-library/sources/pinterest-queries.json",
    "inspiration-library/sources/ui-gallery-sources.json",
    "schemas/design-brief.schema.json",
    "schemas/done-report.schema.json",
    "schemas/target-copy-report.schema.json",
    "schemas/asset-manifest.schema.json",
    "schemas/inspiration-manifest.schema.json",
    "schemas/visual-agent-run.schema.json",
    "schemas/visual-qa-report.schema.json",
    "schemas/screenshot-comparison-report.schema.json",
    "schemas/object-swap-report.schema.json",
    "schemas/motion-sequence-report.schema.json",
    "schemas/skill-verdict.schema.json",
    "schemas/screenshot-report.schema.json",
    "schemas/visual-concepts.schema.json"
  ]) {
    if (filePath.endsWith(".md") || filePath.endsWith(".mjs")) {
      const absolute = resolveDesignOsPath(filePath);
      if (fs.existsSync(absolute)) {
        checks.push(filePath);
      } else {
        errors.push(`${filePath}: missing`);
      }
    } else {
      checkJson(filePath, { base: "design-os" });
    }
  }

  if (errors.length > 0) {
    fail(`Design OS doctor failed:\n- ${errors.join("\n- ")}`);
  }

  pass("Design OS doctor passed", {
    designOsRoot,
    projectRoot,
    checkedJsonFiles: checks
  });
}

function checkVisualGate(briefPath, conceptsPath) {
  if (!briefPath || !conceptsPath) {
    fail("Usage: node tools/design-os.mjs check-visual-gate <brief> <concepts>");
  }
  const brief = readJson(briefPath);
  const concepts = readJson(conceptsPath);

  const briefErrors = [];
  const missing = missingFields(brief, requiredBriefFields);
  if (missing.length > 0) {
    briefErrors.push(`Brief missing required fields: ${missing.join(", ")}`);
  }
  if (briefErrors.length > 0) {
    fail(`Visual gate failed:\n- ${briefErrors.join("\n- ")}`);
  }

  if (brief.isVisualHeavy !== true) {
    pass("Visual gate not required", { file: briefPath, isVisualHeavy: brief.isVisualHeavy });
    return;
  }

  const conceptErrors = getConceptErrors(concepts, { requireApproved: true, requireScreenshotFiles: true });
  if (conceptErrors.length > 0) {
    fail(`Visual gate failed:\n- ${conceptErrors.join("\n- ")}`);
  }

  pass("Visual gate satisfied", {
    brief: briefPath,
    concepts: conceptsPath,
    approvalStatus: concepts.approvalStatus,
    selectedConceptId: concepts.selectedConceptId,
    conceptCount: concepts.concepts.length
  });
}

function approveConcept(filePath) {
  if (!filePath) {
    fail("Usage: node tools/design-os.mjs approve-concept <concepts-file> --id <concept-id> [--by <name>] [--notes <text>]");
  }

  const conceptId = getFlagValue("--id");
  if (!conceptId) {
    fail("approve-concept requires --id <concept-id>.");
  }

  const artifact = readJson(filePath);
  const errors = getConceptErrors(artifact);
  if (errors.length > 0) {
    fail(`Cannot approve invalid visual concepts:\n- ${errors.join("\n- ")}`);
  }

  const concept = artifact.concepts.find((candidate) => candidate.id === conceptId);
  if (!concept) {
    fail(`Cannot approve missing concept id: ${conceptId}`);
  }

  artifact.approvalStatus = "approved";
  artifact.selectedConceptId = conceptId;
  artifact.approvedBy = getFlagValue("--by") || "Migi";
  artifact.approvalNotes = getFlagValue("--notes") || `Approved via Miguel Design OS CLI: ${concept.name}`;

  writeJson(filePath, artifact);
  pass("Concept approved", {
    file: filePath,
    selectedConceptId: conceptId,
    approvedBy: artifact.approvedBy
  });
}

function readText(filePath, options = {}) {
  const absolute = options.base === "design-os" ? resolveDesignOsPath(filePath) : resolveProjectPath(filePath);
  try {
    return fs.readFileSync(absolute, "utf8").trim();
  } catch (error) {
    fail(`Could not read file: ${filePath}\n${error.message}`);
  }
}

function assertDesignOsFile(filePath, message) {
  if (!fs.existsSync(resolveDesignOsPath(filePath))) {
    fail(message);
  }
}

function renderPromptTemplate(template, replacements) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : match
  ));
}

function compileLegacyImplementationPrompt() {
  const briefPath = getFlagValue("--brief");
  const conceptsPath = getFlagValue("--concepts");
  const outPath = getFlagValue("--out");

  if (!briefPath || !conceptsPath || !outPath) {
    fail("Usage: node tools/design-os.mjs compile-agent-prompt --brief <brief> --concepts <concepts> --out <file>");
  }

  const brief = readJson(briefPath);
  const concepts = readJson(conceptsPath);
  const missing = missingFields(brief, requiredBriefFields);
  if (missing.length > 0) {
    fail(`Cannot compile prompt from invalid brief:\n- Missing required fields: ${missing.join(", ")}`);
  }

  const conceptErrors = getConceptErrors(concepts, { requireApproved: true, requireScreenshotFiles: true });
  if (conceptErrors.length > 0) {
    fail(`Cannot compile implementation prompt before Visual Concept Gate passes:\n- ${conceptErrors.join("\n- ")}`);
  }

  const selected = concepts.concepts.find((concept) => concept.id === concepts.selectedConceptId);
  if (!selected) {
    fail("Cannot compile prompt: selectedConceptId does not match a concept.");
  }

  const prompt = `# Miguel Design OS Implementation Prompt

Project: ${brief.projectName}
Project type: ${brief.projectType}
Task type: ${brief.taskType}
Primary user: ${brief.primaryUser}
Primary object: ${brief.primaryObject}
Primary action: ${brief.primaryAction}

## Gate Status

Visual Concept Gate v2 passed.
Approved concept: ${selected.name} (${selected.id})
Approved by: ${concepts.approvedBy}
Approval notes: ${concepts.approvalNotes}

Do not implement any other concept unless Migi explicitly changes approval.

## Approved Visual Concept

Visual metaphor: ${selected.visualMetaphor}
Composition: ${selected.composition}
Focal object: ${selected.focalObject}
Emotional hook: ${selected.emotionalHook}
Hidden information: ${selected.hiddenInformation}
Absent elements: ${selected.absentElements}
Cliche avoidance: ${selected.clicheAvoidance}
Desire mechanism: ${selected.desireMechanism}
Failure mode: ${selected.failureMode}

Responsive strategy:
- 1440: ${selected.responsiveStrategy["1440"]}
- 768: ${selected.responsiveStrategy["768"]}
- 390: ${selected.responsiveStrategy["390"]}

Preview route: ${selected.previewRoute}
Concept screenshots:
- 1440: ${selected.screenshots["1440"]}
- 768: ${selected.screenshots["768"]}
- 390: ${selected.screenshots["390"]}

## Constraints

${brief.constraints.map((constraint) => `- ${constraint}`).join("\n")}

## Forbidden Directions

${brief.forbiddenDirections.map((direction) => `- ${direction}`).join("\n")}

## Required Skills

${brief.requiredSkills.map((skill) => `- ${skill}`).join("\n")}

## Implementation Standard

- Build the approved visual shell first.
- Preserve the primary object and primary action from the brief.
- Do not copy old apps literally.
- Do not flatten references into shallow traits.
- Capture implementation screenshots at 390 / 768 / 1440.
- Run the UI scorecard and patch blockers before claiming completion.
`;

  const absolute = resolveProjectPath(outPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, prompt);
  pass("Compiled agent prompt", {
    out: outPath,
    selectedConceptId: selected.id
  });
}

function compileAgentPrompt() {
  const requestedAgent = getFlagValue("--agent");
  if (!requestedAgent) {
    compileLegacyImplementationPrompt();
    return;
  }

  const task = getFlagValue("--task");
  if (!task) {
    fail('Usage: node tools/design-os.mjs compile-agent-prompt --agent <agent> --task "..." [--out <file>]');
  }

  const agentId = agentAliases.get(requestedAgent);
  if (!agentId || !agentPromptConfig[agentId]) {
    fail(`Unknown agent for prompt compiler: ${requestedAgent}`);
  }

  if (agentId === "03-literal-target-copy") {
    assertDesignOsFile(paths.targetCopyReportTemplate, "Cannot compile Literal Target Copy prompt: target-copy report template is missing.");
  }
  if (agentId === "04-visual-qa-anti-slop" || agentId === "05-productionizer") {
    assertDesignOsFile("schemas/done-report.schema.json", "Cannot compile visual-heavy final handoff prompt: done-report schema is missing.");
  }
  if (agentId === "05-productionizer") {
    const normalizedTask = normalizeText(task);
    if (!normalizedTask.includes("approved") || !normalizedTask.includes("visual qa")) {
      fail("Cannot compile Productionizer prompt until the task states the visual shell is approved and visual QA has run.");
    }
  }

  const config = agentPromptConfig[agentId];
  const agent = visualAgents.find((candidate) => candidate.id === agentId);
  const template = readText(config.template, { base: "design-os" });
  const agentInstructions = readText(config.agentPath, { base: "design-os" });
  const skillInstructions = config.skillPaths
    .map((skillPath) => `## ${skillPath}\n\n${readText(skillPath, { base: "design-os" })}`)
    .join("\n\n---\n\n");

  const prompt = renderPromptTemplate(template, {
    AGENT_NAME: agent.name,
    AGENT_ID: agent.id,
    TASK: task,
    AGENT_INSTRUCTIONS: agentInstructions,
    SKILL_INSTRUCTIONS: skillInstructions,
    PROTECTED_FOLDERS: "- source-projects/\n- captures/\n- raw-chat-input/",
    EVIDENCE_GATES: [
      "- No done without evidence.",
      "- Build/lint is not visual QA.",
      "- Visual-heavy work needs 390 / 768 / 1440 screenshot evidence.",
      "- Literal Target Copy Mode needs a target-copy report and comparison report.",
      "- Production image-led work needs an asset manifest.",
      "- Final handoff needs a validated done report."
    ].join("\n"),
    VALIDATION_COMMANDS: config.validationCommands.map((commandLine) => `- \`${commandLine}\``).join("\n")
  });

  const outPath = getFlagValue("--out");
  if (outPath) {
    const absolute = resolveProjectPath(outPath);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, `${prompt}\n`);
    pass("Compiled agent prompt", { agent: agentId, out: outPath });
    return;
  }

  console.log(prompt);
}

function showHelp() {
  console.log(`Miguel Design OS P0 CLI

Commands:
  list-skills
  list-agents
  list-benchmarks
  route --task "..."
  route-agent --task "..."
  prompt --name <template-name>
  generate-direction-prompts --product "..." --brief "..."
  new-brief
  new-postmortem [--out <file>]
  new-inspiration-manifest
  new-done-report
  new-target-copy-report
  new-asset-manifest
  validate-brief <file>
  validate-inspiration-manifest <file>
  validate-concepts <file>
  validate-screenshot-report <file>
  validate-done-report <file>
  validate-target-copy <file>
  validate-assets <file>
  validate-visual-qa-report <file>
  validate-comparison-report <file>
  validate-object-swap-report <file>
  validate-skill-verdict <file>
  validate-direction-images <manifest.json>
  validate-direction-gate <slug>
  check-visual-gate <brief> <concepts>   Requires 3 rendered concepts, screenshots, and approved selectedConceptId for visual-heavy briefs.
  validate-gate <brief> <concepts>        Alias for check-visual-gate.
  approve-concept <concepts> --id <id>    Marks one concept approved by Migi.
  compile-agent-prompt --agent <agent> --task "..." [--out <file>]
  compile-agent-prompt --brief <brief> --concepts <concepts> --out <file>
  doctor
`);
}

switch (command) {
  case "list-skills":
    listSkills();
    break;
  case "list-agents":
    listAgents();
    break;
  case "list-benchmarks":
    listBenchmarks();
    break;
  case "route":
    routeTask();
    break;
  case "route-agent":
    routeAgent();
    break;
  case "prompt":
    printPrompt();
    break;
  case "generate-direction-prompts":
    generateDirectionPrompts();
    break;
  case "new-brief":
    newBrief();
    break;
  case "new-postmortem":
    newPostmortem();
    break;
  case "new-inspiration-manifest":
    newInspirationManifest();
    break;
  case "new-done-report":
    newDoneReport();
    break;
  case "new-target-copy-report":
    newTargetCopyReport();
    break;
  case "new-asset-manifest":
    newAssetManifest();
    break;
  case "validate-brief":
    validateBrief(args[1]);
    break;
  case "validate-inspiration-manifest":
    validateInspirationManifest(args[1]);
    break;
  case "validate-concepts":
    validateConcepts(args[1]);
    break;
  case "validate-screenshot-report":
    validateScreenshotReport(args[1]);
    break;
  case "validate-done-report":
    validateDoneReport(args[1]);
    break;
  case "validate-target-copy":
    validateTargetCopy(args[1]);
    break;
  case "validate-assets":
    validateAssets(args[1]);
    break;
  case "validate-visual-qa-report":
    validateVisualQaReport(args[1]);
    break;
  case "validate-comparison-report":
    validateComparisonReport(args[1]);
    break;
  case "validate-object-swap-report":
    validateObjectSwapReport(args[1]);
    break;
  case "validate-skill-verdict":
    validateSkillVerdict(args[1]);
    break;
  case "validate-direction-images":
    validateDirectionImages(args[1]);
    break;
  case "validate-direction-gate":
    validateDirectionGate(args[1]);
    break;
  case "check-visual-gate":
    checkVisualGate(args[1], args[2]);
    break;
  case "validate-gate":
    checkVisualGate(args[1], args[2]);
    break;
  case "approve-concept":
    approveConcept(args[1]);
    break;
  case "compile-agent-prompt":
    compileAgentPrompt();
    break;
  case "doctor":
    doctor();
    break;
  case undefined:
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    fail(`Unknown command: ${command}\nRun: node tools/design-os.mjs help`);
}
