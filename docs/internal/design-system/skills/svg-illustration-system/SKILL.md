---
name: svg-illustration-system
description: Plan, implement, and review high-quality SVG illustration systems with path discipline, accessibility, annotation safety, material-specific texture, and isolated illustration proof. Use for custom SVG scenes, editorial SVG, botanical plates, hero illustration, vector objects, masks, labels, and shape-heavy illustration surfaces.
---

# SVG Illustration System

## Illustration-First Gate

Create isolated SVG illustration assets before full-page implementation. Required outputs are `docs/design/illustration-art-direction.md`, `docs/design/illustration-style-guide.md`, `docs/design/illustration-asset-options.md`, at least 1 isolated hero SVG/component, and `docs/qa/illustration-gate-review.md`.

Stop after the gate unless explicitly instructed to continue.

## Native Tooltip Ban

No art-directed SVG may expose browser-native tooltips over the visual surface.

- Do not put `title` attributes on child SVG elements.
- Do not create child `<title>` elements that appear as browser hover tooltips in art-directed surfaces.
- Use top-level SVG `<title>` and `<desc>` only for accessibility.
- Decorative inner groups must be `aria-hidden="true"` and `pointer-events="none"` unless intentionally interactive.

If a browser-native tooltip appears in screenshot review: max score 4.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text.

Every annotation must define anchor point, leader path, label box, protected label zone, collision fallback, and responsive fallback.

If a leader line cuts through text: max score 3. If annotation labels collide with art or other labels: max score 4.

## Botanical / Organic Illustration Minimum Bar

Require reference grammar, silhouette study, linework strategy, detail budget, material/texture strategy, simplification strategy, and a clear explanation of what makes the subject believable.

Reject repeated ellipse leaves, generic petals, flat doodle stems, childlike plant silhouettes, copy-paste leaves, and generic botanical icons scaled up as hero art.

## No Ambient Background Blobs

Reject vague blobs, ghost ellipses, generic glows, random translucent ovals, fake lenses, decorative orbits, and dot/star fields unless they have explicit role, layer, bounds, purpose, and reference justification.

## Audit Upgrade: Self-Correction Contract

Audit fix: Become a real SVG production system.

Required evidence:
- viewBox, layer model, path/defs/ID plan, title/desc, token map, hooks, responsive and export plan.

Repair routing:
- illustration-quality-review owns art quality; vector-form-system-director owns geometry/collision issues.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "svg-illustration-system"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
