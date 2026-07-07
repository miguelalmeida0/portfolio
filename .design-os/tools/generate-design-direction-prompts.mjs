#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function getFlag(name, fallback = "") {
  const index = args.indexOf(name);
  return index === -1 || !args[index + 1] ? fallback : args[index + 1];
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function hashBrief({ product, brief, mode, references }) {
  return crypto
    .createHash("sha256")
    .update([product, brief, mode, references].join("\n---\n"))
    .digest("hex")
    .slice(0, 16);
}

function makePrompt(direction, product, type, brief, references, mode, dials) {
  return [
    `Frontend design reference image for ${product || "the product"}.`,
    `Product type: ${type || "visual-heavy interface"}.`,
    `User brief: ${brief || "No brief supplied."}`,
    `Selected visual mode: ${mode || "fast direction gate"}.`,
    `Active dials: ${dials || "not supplied"}.`,
    `References to consider: ${references || "none supplied"}.`,
    `Direction: ${direction.name}.`,
    `Product concept: ${direction.productConcept}.`,
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

const directions = [
  {
    id: "A",
    name: "Safe Refined",
    productConcept: "polished, usable, lower-risk version of the brief",
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
    productConcept: "more authored, memorable, image-aware direction",
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
    productConcept: "boldest memorable direction that remains usable",
    palette: "unexpected high-character palette with disciplined contrast",
    typography: "distinctive type attitude with implementation-safe text zones",
    layout: "unusual but coherent composition, not template default",
    image: "focal object/media world creates identity",
    navigation: "unconventional but understandable navigation approach",
    motion: "signature motion moment plus supporting motion layers",
    avoid: "AI-purple glow, dull charcoal/orange, fake text, random visual noise"
  }
];

const product = getFlag("--product", getFlag("--project", ""));
const type = getFlag("--type", "");
const brief = getFlag("--brief", "");
const references = getFlag("--references", "");
const mode = getFlag("--mode", "fast");
const dials = getFlag("--dials", "");
const quality = getFlag("--quality", process.env.DESIGN_OS_IMAGE_QUALITY || (mode === "fast" ? "low" : "medium"));
const size = getFlag("--size", process.env.DESIGN_OS_IMAGE_SIZE || (mode === "fast" ? "1024x1024" : "1536x1024"));
const model = getFlag("--model", process.env.DESIGN_OS_IMAGE_MODEL || "gpt-image-2");
const out = getFlag("--out", "docs/design/generated-image-prompts.md");
const briefHash = hashBrief({ product, brief, mode, references });

const result = {
  generatedAt: new Date().toISOString(),
  product,
  type,
  brief,
  references,
  mode,
  dials,
  briefHash,
  model,
  quality,
  size,
  directionCount: directions.length,
  directions: directions.map((direction) => ({
    id: direction.id,
    name: direction.name,
    prompt: makePrompt(direction, product, type, brief, references, mode, dials)
  }))
};

const markdown = `# Generated Image Prompts

These prompts are for Fast Direction Gate. They do not call the image API.

- mode: ${mode}
- model: ${model}
- quality: ${quality}
- size: ${size}
- briefHash: ${briefHash}

${result.directions.map((direction) => `## Direction ${direction.id} - ${direction.name}

${direction.prompt}
`).join("\n")}

## JSON

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`
`;

writeFile(path.resolve(repoRoot, out), markdown);
console.log(JSON.stringify(result, null, 2));
