#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

const query = readArg("query");
const out = readArg("out", "");

if (!query.trim()) {
  console.error("Usage: node tools/failure-memory-search.mjs --query \"text clipping nav overflow\"");
  process.exit(1);
}

const roots = [
  "visual-library/rejected",
  "design-dna/anti-patterns.md",
  "evaluation/ui-scorecard.md"
];

const synonyms = new Map([
  ["clip", ["clipped", "cut", "overflow", "hidden", "truncated"]],
  ["text", ["word", "label", "headline", "copy", "cta"]],
  ["nav", ["navigation", "pill", "tab", "chip", "bottom nav"]],
  ["blob", ["glow", "ellipse", "atmosphere", "dot field"]],
  ["illustration", ["svg", "botanical", "drawing", "plate", "doodle"]],
  ["motion", ["scroll", "animation", "choreography", "transition"]]
]);

function expandTerms(input) {
  const base = input.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 2);
  const expanded = new Set(base);
  for (const term of base) {
    for (const [key, values] of synonyms) {
      if (term.includes(key) || values.some((value) => term.includes(value))) {
        expanded.add(key);
        for (const value of values) expanded.add(value);
      }
    }
  }
  return [...expanded];
}

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const files = [];
  for (const entry of fs.readdirSync(target)) {
    const full = path.join(target, entry);
    const childStat = fs.statSync(full);
    if (childStat.isDirectory()) files.push(...walk(full));
    if (childStat.isFile() && /\.(md|json)$/i.test(entry)) files.push(full);
  }
  return files;
}

const terms = expandTerms(query);
const matches = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, "utf8");
    const lower = text.toLowerCase();
    const score = terms.reduce((total, term) => total + (lower.includes(term) ? 1 : 0), 0);
    if (score > 0) {
      const firstTerm = terms.find((term) => lower.includes(term));
      const index = firstTerm ? lower.indexOf(firstTerm) : 0;
      const excerpt = text.slice(Math.max(0, index - 140), index + 260).replace(/\s+/g, " ").trim();
      matches.push({ file, score, excerpt });
    }
  }
}

matches.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

const result = {
  query,
  terms,
  matches: matches.slice(0, 25)
};

if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
}

for (const match of result.matches) {
  console.log(`${match.score}\t${match.file}\t${match.excerpt}`);
}

if (result.matches.length === 0) {
  console.log("No failure memory matches found.");
}
