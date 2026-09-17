#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

const mode = readArg("mode", "general");
const out = readArg("out", "docs/qa/artifact-contract-report.json");

const contracts = {
  general: [
    "docs/design/creative-session-state.md",
    "docs/design/skill-orchestration-plan.md"
  ],
  "visual-heavy": [
    "docs/design/direction-options.md",
    "docs/design/direction-layout-maps.md",
    "docs/design/direction-risk-check.md",
    "docs/design/selected-direction.md",
    "docs/design/visual-spec.md",
    "docs/design/design-system-tokens.md",
    "docs/qa/layout-integrity-report.md"
  ],
  landing: [
    "docs/design/visual-spec.md",
    "docs/design/navigation-strategy.md",
    "docs/design/reference-grammar.md",
    "docs/qa/layout-integrity-report.md"
  ],
  illustration: [
    "docs/design/illustration-art-direction.md",
    "docs/design/illustration-style-guide.md",
    "docs/design/illustration-asset-options.md",
    "docs/qa/illustration-gate-review.md"
  ],
  "signature-interaction": [
    "docs/design/visual-spec.md",
    "docs/design/creative-prototype-spike-plan.md",
    "docs/qa/creative-prototype-spike-review.md",
    "docs/qa/layout-integrity-report.md"
  ]
};

const required = contracts[mode] ?? contracts.general;
const artifacts = required.map((file) => {
  const exists = fs.existsSync(file);
  const size = exists ? fs.statSync(file).size : 0;
  return {
    file,
    required: true,
    present: exists,
    semanticallyValid: exists && size > 40,
    notes: exists ? `${size} bytes` : "missing"
  };
});

const missing = artifacts.filter((artifact) => !artifact.present);
const invalid = artifacts.filter((artifact) => artifact.present && !artifact.semanticallyValid);
const verdict = missing.length ? "Block" : invalid.length ? "Partial" : "Pass";

const report = {
  mode,
  verdict,
  artifacts,
  missing: missing.map((artifact) => artifact.file),
  invalid: invalid.map((artifact) => artifact.file)
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const markdownOut = out.endsWith(".json") ? out.replace(/\.json$/, ".md") : `${out}.md`;
const lines = [
  "# Artifact Contract Report",
  "",
  `Mode: ${mode}`,
  `Verdict: ${verdict}`,
  "",
  "| Artifact | Required | Present | Semantically Valid | Notes |",
  "|---|---:|---:|---:|---|"
];

for (const artifact of artifacts) {
  lines.push(`| ${artifact.file} | ${artifact.required} | ${artifact.present} | ${artifact.semanticallyValid} | ${artifact.notes} |`);
}

fs.writeFileSync(markdownOut, `${lines.join("\n")}\n`);

console.log(`Artifact contract ${verdict}. Wrote ${out}.`);
if (verdict === "Block") process.exitCode = 2;
