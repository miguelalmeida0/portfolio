#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const filePath = process.argv[2] || "inspiration-queue.local.json";
const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

function fail(errors) {
  console.error(`Inspiration queue failed validation:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail([`Could not read JSON ${filePath}: ${error.message}`]);
  }
}

const queue = readJson(absolute);
const errors = [];
const targets = Array.isArray(queue.targets) ? queue.targets : [];

for (const field of ["name", "createdFor", "policy", "targets"]) {
  if (!(field in queue)) {
    errors.push(`${field} is required.`);
  }
}

if (!Array.isArray(queue.targets)) {
  errors.push("targets must be an array.");
}

const requiredTargetFields = [
  "id",
  "sourceName",
  "sourceType",
  "url",
  "category",
  "targetCount",
  "whyItMatters",
  "compositionNotes",
  "focalObjectNotes",
  "interactionNotes",
  "screenshotStatus",
  "attributionNote",
  "localScreenshotPath"
];

let totalTargetCount = 0;
let pinterestQueryCount = 0;
const categoryCounts = new Map();

targets.forEach((target, index) => {
  for (const field of requiredTargetFields) {
    if (!(field in target)) {
      errors.push(`targets[${index}].${field} is required.`);
    }
  }
  if (!Number.isInteger(target.targetCount) || target.targetCount < 1) {
    errors.push(`targets[${index}].targetCount must be a positive integer.`);
  } else {
    totalTargetCount += target.targetCount;
    categoryCounts.set(target.category, (categoryCounts.get(target.category) || 0) + target.targetCount);
  }
  for (const field of ["id", "sourceName", "sourceType", "url", "category", "whyItMatters", "compositionNotes", "focalObjectNotes", "interactionNotes", "screenshotStatus", "attributionNote"]) {
    if (field in target && !isNonEmptyString(target[field])) {
      errors.push(`targets[${index}].${field} must be a non-empty string.`);
    }
  }
  if (target.screenshotStatus === "captured" && !isNonEmptyString(target.localScreenshotPath)) {
    errors.push(`targets[${index}] captured screenshots require localScreenshotPath.`);
  }
  if (target.sourceName === "Pinterest" && target.sourceType !== "moodboard") {
    errors.push(`targets[${index}] Pinterest must use sourceType moodboard.`);
  }
  if (target.sourceName === "Pinterest" && Array.isArray(target.queries)) {
    pinterestQueryCount += target.queries.filter(isNonEmptyString).length;
  }
});

if (totalTargetCount < 150) {
  errors.push(`total target count must be at least 150; found ${totalTargetCount}.`);
}
if (pinterestQueryCount < 50) {
  errors.push(`Pinterest moodboard queries must be at least 50; found ${pinterestQueryCount}.`);
}

const categoryMinimums = [
  ["award-gallery", 50],
  ["mobile-product-ui", 30],
  ["selection-roster-game-ui", 30],
  ["cinematic-immersive-ui", 30]
];
for (const [category, minimum] of categoryMinimums) {
  const count = categoryCounts.get(category) || 0;
  if (count < minimum) {
    errors.push(`${category} target count must be at least ${minimum}; found ${count}.`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

console.log("Inspiration queue valid");
console.log(JSON.stringify({
  file: filePath,
  totalTargetCount,
  pinterestQueryCount,
  categories: Object.fromEntries(categoryCounts)
}, null, 2));
