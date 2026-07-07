#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const designOsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(designOsRoot, "inspiration-library/queues/weekend-visual-corpus.queue.json");
const destination = path.resolve(process.cwd(), "inspiration-queue.local.json");

if (!fs.existsSync(source)) {
  console.error("Missing inspiration queue template: inspiration-library/queues/weekend-visual-corpus.queue.json");
  process.exit(1);
}

if (fs.existsSync(destination)) {
  console.log("inspiration-queue.local.json already exists");
  process.exit(0);
}

fs.copyFileSync(source, destination);
console.log("Created inspiration-queue.local.json");
