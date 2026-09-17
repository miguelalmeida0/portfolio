#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...args] = process.argv.slice(2);
const historyRoot = path.join(repoRoot, "docs/qa/critique-history");

function slugify(value) {
  return String(value || "critique-target")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "critique-target";
}

function usage() {
  console.error("Usage: node tools/critique-storage.mjs slug <target> | write <slug> <body-file> | trend <slug> [limit]");
  process.exit(1);
}

function parseMeta(body, slug) {
  const total = body.match(/Total\s*\|\s*\|\s*(\d+)\s*\/\s*40/i) || body.match(/totalScore:\s*(\d+)/i);
  const p0 = (body.match(/\bP0\b/g) || []).length;
  const p1 = (body.match(/\bP1\b/g) || []).length;
  const mode = body.match(/^Mode:\s*(.+)$/im)?.[1]?.trim() || "unknown";
  return {
    target: slug,
    createdAt: new Date().toISOString(),
    totalScore: total ? Number(total[1]) : null,
    p0Count: p0,
    p1Count: p1,
    mode,
    degraded: body.includes("DEGRADED"),
    tags: []
  };
}

function frontmatter(meta) {
  return [
    "---",
    `target: ${JSON.stringify(meta.target)}`,
    `createdAt: ${JSON.stringify(meta.createdAt)}`,
    `totalScore: ${meta.totalScore === null ? "null" : meta.totalScore}`,
    `p0Count: ${meta.p0Count}`,
    `p1Count: ${meta.p1Count}`,
    `mode: ${JSON.stringify(meta.mode)}`,
    `degraded: ${meta.degraded}`,
    `tags: ${JSON.stringify(meta.tags)}`,
    "---",
    ""
  ].join("\n");
}

function readFrontmatter(filePath) {
  const body = fs.readFileSync(filePath, "utf8");
  if (!body.startsWith("---")) return null;
  const end = body.indexOf("\n---", 3);
  if (end === -1) return null;
  const lines = body.slice(3, end).trim().split("\n");
  const meta = {};
  for (const line of lines) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const raw = line.slice(index + 1).trim();
    try {
      meta[key] = JSON.parse(raw);
    } catch {
      meta[key] = raw;
    }
  }
  return meta;
}

if (!command) usage();

if (command === "slug") {
  console.log(slugify(args.join(" ")));
  process.exit(0);
}

if (command === "write") {
  const [slugArg, bodyFile] = args;
  if (!slugArg || !bodyFile) usage();
  const slug = slugify(slugArg);
  const absoluteBody = path.isAbsolute(bodyFile) ? bodyFile : path.resolve(process.cwd(), bodyFile);
  const body = fs.readFileSync(absoluteBody, "utf8");
  const meta = parseMeta(body, slug);
  const dir = path.join(historyRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  const stamp = meta.createdAt.replace(/[:.]/g, "-");
  const out = path.join(dir, `${stamp}.md`);
  const content = body.startsWith("---") ? body : `${frontmatter(meta)}${body}`;
  fs.writeFileSync(out, content.endsWith("\n") ? content : `${content}\n`);
  console.log(path.relative(repoRoot, out));
  process.exit(0);
}

if (command === "trend") {
  const [slugArg, limitArg = "5"] = args;
  if (!slugArg) usage();
  const slug = slugify(slugArg);
  const dir = path.join(historyRoot, slug);
  if (!fs.existsSync(dir)) {
    console.log(`No critique history for ${slug}`);
    process.exit(0);
  }
  const limit = Math.max(1, Number(limitArg) || 5);
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md")).sort().slice(-limit);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const meta = readFrontmatter(filePath) || {};
    console.log(`${meta.createdAt || file}\t${meta.totalScore ?? "?"}/40\tP0:${meta.p0Count ?? "?"}\tP1:${meta.p1Count ?? "?"}\t${meta.mode || "unknown"}\t${path.relative(repoRoot, filePath)}`);
  }
  process.exit(0);
}

usage();
