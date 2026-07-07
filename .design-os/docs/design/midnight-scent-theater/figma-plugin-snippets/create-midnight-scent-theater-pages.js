// Figma Plugin API snippet for Midnight Scent Theater.
// Paste into a Figma plugin command in a writable design file.
// Creates:
// 00 Shape Tokens, 01 Vector Grammar, 02 Motif Library, 03 Morph Boards,
// 04 Motion Storyboards, 05 Export Specs, 99 QA Review.
// Does not use paid Figma AI, Figma Make, Figma Weave, or image generation.

const NS = "midnight.scent.theater";
const FONT = { family: "Inter", style: "Regular" };
const BOLD = { family: "Inter", style: "Bold" };

const shapeTokens = [
  ["shape.radius.xs", "4", "radius", "Small label and brass-mark radius."],
  ["shape.radius.sm", "8", "radius", "Small controls and note chips."],
  ["shape.radius.md", "18", "radius", "Editorial cards and bottle captions."],
  ["shape.radius.lg", "32", "radius", "Curtain masks and product frames."],
  ["shape.radius.xl", "56", "radius", "Moon lens and soft image masks."],
  ["shape.smoothing.none", "0", "smoothing", "Sharp editorial cuts and bottle shoulders."],
  ["shape.smoothing.ios", "0.62", "smoothing", "Superellipse feel for lens surfaces."],
  ["shape.family.round", "round", "family", "Moon disc and scent-note dots."],
  ["shape.family.squircle", "superellipse", "family", "Lens frames and morph bridges."],
  ["shape.family.notch", "notch", "family", "Bottle shoulders and couture labels."],
  ["shape.family.bevel", "bevel", "family", "Brass marks and stage hardware."],
  ["shape.keyline.thin", "1", "keyline", "Bottle outline and moon rim."],
  ["shape.keyline.medium", "1.5", "keyline", "Active lens rim and selected note frame."],
  ["shape.offset.sm", "8", "offset", "Small label inset."],
  ["shape.offset.md", "16", "offset", "Text-safe margin around masks."]
];

const semanticTokens = [
  ["shape.surface.card", "radius.md + keyline.thin", "surface-shape", "Small editorial support surface."],
  ["shape.surface.sheet", "radius.lg + smoothing.ios", "surface-shape", "Large chapter plate."],
  ["shape.surface.media", "radius.xl + lens safe zone", "surface-shape", "Image mask or moon-lens media frame."],
  ["shape.interactive.button", "radius.sm + keyline.medium", "interactive-shape", "CTA or chapter control."],
  ["shape.interactive.chip", "radius.xl", "interactive-shape", "Scent-note selection chip."],
  ["shape.icon.container", "radius.sm", "icon-shape", "Small motif icon backing."],
  ["shape.editorial.mask", "moon-lens or curtain-fold", "mask-shape", "Primary editorial reveal mask."],
  ["shape.motion.morphable", "compatible parametric family", "motion-shape", "Only documented morph pairs."]
];

const projectTokens = [
  ["project.hero.shapeFamily", "moon-lens", "family", "Hero portal behind the bottle."],
  ["project.motion.morphFamily", "lens-to-bottle-mask", "motion-shape", "Main chapter morph family."],
  ["project.surface.smoothing", "0.62", "smoothing", "Default smoothing for lens and sheets."],
  ["project.icon.strokeWidth", "1.75", "keyline", "Default stroke for motif icons."]
];

const roles = [
  "hero-object", "mask", "frame", "callout", "ornament", "control",
  "connector", "atmosphere", "foreground-object", "background-object",
  "selection-target", "decorative"
];

const motifs = [
  {
    name: "moon-lens",
    role: "mask",
    use: "Hero portal, image reveal, chapter transition, bottle halo.",
    avoid: "Fake glass oval or random background circle.",
    layer: "masks-and-clips",
    material: "pearl paper, soft ink rim, restrained highlight",
    motion: "circle to lens, lens transition",
    export: "SVG ellipse/superellipse or CSS clip-path; preserve safe zone."
  },
  {
    name: "scent-bottle-silhouette",
    role: "hero-object",
    use: "Primary product object, morph target, chapter anchor.",
    avoid: "Fake product proof or generic stock bottle.",
    layer: "primary-object",
    material: "ink silhouette, velvet fill, brass keyline",
    motion: "squircle to bottle, object reveal, selection snap",
    export: "Meaningful SVG with title and desc."
  },
  {
    name: "curtain-reveal",
    role: "mask",
    use: "Chapter entry, scroll reveal, stage edge, image wipe.",
    avoid: "Random wavy side panels.",
    layer: "masks-and-clips",
    material: "velvet plane, paper shadow, subtle fold keyline",
    motion: "curtain fold to mask, mask reveal",
    export: "CSS mask or SVG clipPath; fallback is static open curtain."
  },
  {
    name: "smoke-mark",
    role: "decorative",
    use: "Scent trail, note atmosphere, petal-to-smoke endpoint.",
    avoid: "Filling empty space or covering text.",
    layer: "atmosphere",
    material: "translucent ink, soft grain, low-contrast paper stain",
    motion: "petal to smoke mark only when normalized",
    export: "Decorative SVG or CSS mask; aria-hidden by default."
  },
  {
    name: "couture-label",
    role: "callout",
    use: "Scent notes, chapter metadata, selected state.",
    avoid: "Meaningless premium badges.",
    layer: "labels-and-callouts",
    material: "paper label, brass pin, ink text",
    motion: "selection snap, draw-on keyline",
    export: "HTML text preferred; SVG frame decorative."
  },
  {
    name: "brass-hardware-mark",
    role: "connector",
    use: "Hinges, mask seams, physical dividers.",
    avoid: "Generic gold lines.",
    layer: "foreground-object",
    material: "brass stroke, matte highlight",
    motion: "draw-on stroke",
    export: "Use currentColor or CSS variable stroke."
  }
];

const morphs = [
  ["circle-to-lens", "moon circle", "horizontal lens", "Ellipse/superellipse compatible.", "Keep center anchor and radius variables stable.", "CSS/SVG"],
  ["lens-to-bottle-mask", "lens mask", "bottle silhouette", "Requires bridge: lens -> squircle -> normalized bottle path.", "Consistent winding and normalized points.", "SVG/GSAP"],
  ["curtain-fold-to-mask", "fold planes", "open chapter mask", "Compatible as clip-path polygons.", "Top rail and seam anchors remain fixed.", "CSS clip-path/SVG"],
  ["petal-to-smoke-mark", "scent petal", "smoke mark", "Decorative only unless normalized.", "Same point count and winding.", "SVG/Motion"],
  ["card-frame-to-shadow-portal", "product frame", "shadow portal", "Variable transition, not arbitrary path morph.", "Center anchor remains on bottle.", "CSS"]
];

const motions = [
  ["curtain-reveal", "hero enters viewport", "1400ms", "GSAP", "Render final open-curtain composition immediately."],
  ["lens-to-bottle", "scroll progress 0.18 to 0.42", "900ms", "SVG", "Render static bottle silhouette with moon halo."],
  ["smoke-note", "scent note selected", "650ms", "Motion", "Show selected scent label and static smoke mark."],
  ["draw-on-brass-keyline", "chapter title enters", "700ms", "SVG", "Show complete stroke immediately."],
  ["selection-snap", "chapter control selected", "260ms", "CSS", "Change state instantly with focus outline."]
];

const qaChecks = [
  "Every visible shape has role, layer, bounds, anchors, material, responsive behavior, and accessibility/decorative status.",
  "Moon/lens is a mask, portal, or halo, not a fake glass oval.",
  "Scent bottle silhouette is the focal object and never becomes generic clip art.",
  "Curtain reveal has seam anchors and does not cover CTA or headings.",
  "Smoke mark is decorative by default and does not cover text.",
  "No arbitrary orbit, HUD, radar, or sonar lines.",
  "No random blobs or cheap gradients.",
  "Morph compatibility notes exist where morphing is requested.",
  "Reduced-motion fallback exists for every storyboard.",
  "Code handoff manifest names components and parity risks."
];

function paint(hex) {
  const value = hex.replace("#", "");
  return {
    type: "SOLID",
    color: {
      r: parseInt(value.slice(0, 2), 16) / 255,
      g: parseInt(value.slice(2, 4), 16) / 255,
      b: parseInt(value.slice(4, 6), 16) / 255
    }
  };
}

function meta(node, data) {
  node.setSharedPluginData(NS, "meta", JSON.stringify(data));
  if ("description" in node) {
    try {
      node.description = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join("\n");
    } catch (_error) {
      // Some node types do not expose description in every Figma surface.
    }
  }
}

async function makePage(name, purpose) {
  let page = figma.root.children.find((child) => child.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  if (typeof figma.setCurrentPageAsync === "function") {
    await figma.setCurrentPageAsync(page);
  } else {
    figma.currentPage = page;
  }
  page.children.slice().forEach((child) => child.remove());
  meta(page, { project: "Midnight Scent Theater", purpose });
  return page;
}

function text(value, size = 14, bold = false) {
  const node = figma.createText();
  node.fontName = bold ? BOLD : FONT;
  node.fontSize = size;
  node.characters = value;
  node.fills = [paint("#17121f")];
  return node;
}

function card(name, body, x, y, width = 300, height = 150, role = "frame", data = {}) {
  const frame = figma.createFrame();
  frame.name = `${role} / ${name} / default / figma-ready`;
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.cornerRadius = 16;
  if ("cornerSmoothing" in frame) frame.cornerSmoothing = 0.62;
  frame.fills = [paint("#fbf7f0")];
  frame.strokes = [paint("#b59b68")];
  frame.strokeWeight = 1;
  meta(frame, { role, motif: name, bounds: `${width}x${height}`, ...data });

  const title = text(name, 17, true);
  title.x = 18;
  title.y = 16;
  frame.appendChild(title);

  const copy = text(body, 12, false);
  copy.x = 18;
  copy.y = 48;
  copy.resize(width - 36, height - 60);
  frame.appendChild(copy);
  return frame;
}

function pageTitle(page, title, subtitle) {
  const h = text(title, 38, true);
  h.x = 80;
  h.y = 64;
  page.appendChild(h);

  const s = text(subtitle, 15, false);
  s.x = 80;
  s.y = 116;
  s.resize(980, 48);
  page.appendChild(s);
}

function motifPreview(kind) {
  const frame = figma.createFrame();
  frame.name = `preview / ${kind} / vector-shape / figma-ready`;
  frame.resize(220, 150);
  frame.fills = [paint("#120d1a")];
  frame.cornerRadius = 14;
  meta(frame, { role: "preview", motif: kind, codeHandoff: "Export only named child shapes." });

  if (kind === "moon-lens") {
    const lens = figma.createEllipse();
    lens.name = "mask / moon-lens / default";
    lens.x = 40;
    lens.y = 42;
    lens.resize(140, 68);
    lens.fills = [paint("#efe4c6")];
    lens.strokes = [paint("#b59b68")];
    lens.strokeWeight = 1.5;
    frame.appendChild(lens);
  } else if (kind === "scent-bottle-silhouette") {
    const body = figma.createRectangle();
    body.name = "hero-object / scent-bottle / body";
    body.x = 80;
    body.y = 38;
    body.resize(64, 88);
    body.cornerRadius = 18;
    body.fills = [paint("#efe4c6")];
    body.strokes = [paint("#b59b68")];
    body.strokeWeight = 1.5;
    frame.appendChild(body);
    const neck = figma.createRectangle();
    neck.name = "hero-object / scent-bottle / neck";
    neck.x = 96;
    neck.y = 20;
    neck.resize(32, 32);
    neck.cornerRadius = 6;
    neck.fills = [paint("#efe4c6")];
    frame.appendChild(neck);
  } else if (kind === "curtain-reveal") {
    ["left", "right"].forEach((side, index) => {
      const fold = figma.createRectangle();
      fold.name = `mask / curtain-fold / ${side}`;
      fold.x = index === 0 ? 26 : 124;
      fold.y = 22;
      fold.resize(70, 106);
      fold.cornerRadius = 24;
      fold.fills = [paint("#4b1f2f")];
      fold.strokes = [paint("#b59b68")];
      fold.strokeWeight = 1;
      frame.appendChild(fold);
    });
  } else {
    const smoke = figma.createEllipse();
    smoke.name = "decorative / smoke-mark / atmosphere";
    smoke.x = 62;
    smoke.y = 44;
    smoke.resize(96, 42);
    smoke.rotation = -16;
    smoke.fills = [paint("#c9c1d8")];
    smoke.opacity = 0.46;
    frame.appendChild(smoke);
  }
  return frame;
}

async function createShapeTokensPage() {
  const page = await makePage("00 Shape Tokens", "Geometry token inventory");
  pageTitle(page, "00 Shape Tokens", "Geometry only. Brand color, material, and theme fills are separate from shape tokens.");
  const groups = [
    ["Primitive Tokens", shapeTokens],
    ["Semantic Tokens", semanticTokens],
    ["Project Tokens", projectTokens]
  ];
  groups.forEach(([label, items], groupIndex) => {
    const groupTitle = text(label, 24, true);
    groupTitle.x = 80;
    groupTitle.y = 190 + groupIndex * 560;
    page.appendChild(groupTitle);
    items.forEach((token, index) => {
      const [name, value, type, desc] = token;
      page.appendChild(card(name, `value: ${value}\ntype: ${type}\n${desc}`, 80 + (index % 3) * 340, 240 + groupIndex * 560 + Math.floor(index / 3) * 170, 308, 130, "token", {
        token: name,
        value,
        type,
        colorRule: "Geometry token only."
      }));
    });
  });
}

async function createVectorGrammarPage() {
  const page = await makePage("01 Vector Grammar", "Role taxonomy, layer stack, safe zones, and responsive behavior");
  pageTitle(page, "01 Vector Grammar", "Shapes are stage objects. Every shape needs role, layer, bounds, anchors, material, responsive behavior, accessibility, and code handoff.");
  const layers = ["background-object", "atmosphere", "masks-and-clips", "primary-object", "supporting-forms", "labels-and-callouts", "interaction-states", "chrome"];
  layers.forEach((layer, index) => {
    page.appendChild(card(layer, `Layer ${index + 1}. Must not accidentally cover readable text.`, 80, 190 + index * 92, 420, 70, "layer", { layer }));
  });
  roles.forEach((role, index) => {
    const isDecorative = role === "decorative";
    page.appendChild(card(role, isDecorative ? "Must be explicitly marked decorative and must not compete with content." : "Requires role, layer, bounds, anchors, material, responsive behavior, a11y, and code handoff.", 560 + (index % 3) * 300, 190 + Math.floor(index / 3) * 156, 270, 126, "role", { role }));
  });
  page.appendChild(card("text-safe zones", "Hero headline outside lens or on stable plate. Smoke keeps at least shape.offset.md from copy. Curtains never close over CTA.", 560, 850, 580, 150, "rule", { rule: "text-safe zones" }));
}

async function createMotifLibraryPage() {
  const page = await makePage("02 Motif Library", "Art-directed motif families");
  pageTitle(page, "02 Motif Library", "Motifs are concept-bound vector families, not generic blobs.");
  motifs.forEach((motif, index) => {
    const x = 80 + (index % 2) * 600;
    const y = 180 + Math.floor(index / 2) * 270;
    const wrapper = card(motif.name, `Use: ${motif.use}\nAvoid: ${motif.avoid}\nLayer: ${motif.layer}\nMaterial: ${motif.material}\nMotion: ${motif.motion}\nExport: ${motif.export}`, x, y, 540, 220, motif.role, motif);
    const preview = motifPreview(motif.name);
    preview.x = 296;
    preview.y = 52;
    wrapper.appendChild(preview);
    page.appendChild(wrapper);
  });
}

async function createMorphBoardsPage() {
  const page = await makePage("03 Morph Boards", "Morph-compatible before and after boards");
  pageTitle(page, "03 Morph Boards", "Prefer compatible parametric shape families. Arbitrary SVG path morphs require normalized points and winding.");
  morphs.forEach(([id, before, after, compat, points, target], index) => {
    const x = 80 + (index % 2) * 660;
    const y = 180 + Math.floor(index / 2) * 280;
    const board = card(id, `Before: ${before}\nAfter: ${after}\nCompatibility: ${compat}\nPoint notes: ${points}\nEasing: cubic-bezier(0.22, 1, 0.36, 1)\nTechnique: ${target}\nReduced motion: static final state`, x, y, 610, 230, "morph-board", {
      beforeShape: before,
      afterShape: after,
      implementationTechnique: target
    });
    const beforeShape = motifPreview(before.includes("curtain") ? "curtain-reveal" : before.includes("bottle") ? "scent-bottle-silhouette" : "moon-lens");
    beforeShape.x = 32;
    beforeShape.y = 92;
    beforeShape.resize(170, 100);
    const afterShape = motifPreview(after.includes("curtain") ? "curtain-reveal" : after.includes("bottle") ? "scent-bottle-silhouette" : after.includes("smoke") ? "smoke-mark" : "moon-lens");
    afterShape.x = 390;
    afterShape.y = 92;
    afterShape.resize(170, 100);
    board.appendChild(beforeShape);
    board.appendChild(afterShape);
    page.appendChild(board);
  });
}

async function createMotionStoryboardsPage() {
  const page = await makePage("04 Motion Storyboards", "Five-frame motion storyboards");
  pageTitle(page, "04 Motion Storyboards", "Figma is the storyboard layer. Runtime animation happens in CSS, SVG, GSAP, Motion, or Canvas.");
  motions.forEach(([id, trigger, duration, target, fallback], index) => {
    const board = card(id, `trigger: ${trigger}\nduration: ${duration}\neasing: cubic-bezier(0.22, 1, 0.36, 1)\nimplementation: ${target}\nreduced motion: ${fallback}`, 80, 180 + index * 300, 1180, 240, "motion-board", {
      trigger,
      duration,
      implementationTarget: target,
      reducedMotionFallback: fallback
    });
    ["01 start", "02 anticipation", "03 transformation", "04 settle", "05 final state"].forEach((state, stateIndex) => {
      const stateCard = card(state, stateIndex === 2 ? "Transformation peak. Only the focal system moves." : "Storyboard state. Keep content readable.", 22 + stateIndex * 226, 94, 196, 112, "storyboard-frame", { state });
      board.appendChild(stateCard);
    });
    page.appendChild(board);
  });
}

async function createExportSpecsPage() {
  const page = await makePage("05 Export Specs", "Code-ready vector and motion handoff");
  pageTitle(page, "05 Export Specs", "Preserve viewBox, separate geometry and material, and document browser parity risks.");
  const specs = [
    ["SVG export rules", "Preserve viewBox. Simplify paths only after parity check. Avoid fragile masks unless documented."],
    ["title/desc accessibility", "Meaningful SVGs need title and desc. Decorative SVGs are aria-hidden in code."],
    ["currentColor icon rule", "Reusable icon geometry uses currentColor and no fixed theme fill."],
    ["shape token JSON", "Export primitive, semantic, and project tokens separately from color tokens."],
    ["motion manifest JSON", "Include trigger, duration, easing, keyframes, affected layers, fallback, and implementation target."],
    ["CSS variable mapping", "Map radius, smoothing notes, keyline, offset, and family to code variables."],
    ["React/Vue/Svelte notes", "Separate geometry props from material props. Keep accessibility fields explicit."],
    ["Figma-to-code parity risks", "Corner smoothing, boolean ops, filters, blend modes, and arbitrary morph paths need handling."]
  ];
  specs.forEach(([name, body], index) => {
    page.appendChild(card(name, body, 80 + (index % 2) * 520, 180 + Math.floor(index / 2) * 190, 460, 140, "export-spec", { topic: name }));
  });
}

async function createQaReviewPage() {
  const page = await makePage("99 QA Review", "Shape, morph, motion, export, and accessibility QA");
  pageTitle(page, "99 QA Review", "Fail the system if shapes are roleless, cover text, fake morphing, or lack code handoff.");
  qaChecks.forEach((check, index) => {
    page.appendChild(card(`qa-${String(index + 1).padStart(2, "0")}`, check, 80 + (index % 2) * 560, 180 + Math.floor(index / 2) * 118, 500, 84, "qa-check", {
      verdict: "must pass before handoff"
    }));
  });
}

(async function main() {
  await figma.loadFontAsync(FONT);
  await figma.loadFontAsync(BOLD);
  await createShapeTokensPage();
  await createVectorGrammarPage();
  await createMotifLibraryPage();
  await createMorphBoardsPage();
  await createMotionStoryboardsPage();
  await createExportSpecsPage();
  await createQaReviewPage();

  const current = figma.root.children.find((page) => page.name === "00 Shape Tokens") || figma.currentPage;
  if (typeof figma.setCurrentPageAsync === "function") {
    await figma.setCurrentPageAsync(current);
  }
  figma.viewport.scrollAndZoomIntoView(current.children);
  figma.closePlugin("Created Midnight Scent Theater visual grammar pages.");
})().catch((error) => {
  figma.closePlugin(`Midnight Scent Theater page creation failed: ${error.message}`);
});

