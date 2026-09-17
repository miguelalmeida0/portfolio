---
name: vector-form-system-director
description: Design, generate, and review SVG/vector/form systems, labels, annotations, masks, abstract forms, and illustration-heavy visual surfaces with role, layer, bounds, anchors, accessibility, and collision discipline.
---

# Vector Form System Director

## Hard Rule

No shape may exist without role, layer, bounds, anchors, responsive behavior, and accessibility meaning or explicit decorative status.

## Annotation Protected Zone

Leader lines, annotation rules, stems, connectors, and decorative lines may never cross through label text.

Every annotation must define:

- anchor point
- leader path
- label box
- protected label zone
- collision fallback
- responsive fallback

If a leader line cuts through text: max score 3.
If annotation labels collide with art or other labels: max score 4.

## No Ambient Background Blobs

Reject roleless blobs, ghost ellipses, generic radial glows, random translucent ovals, fake lenses, decorative orbits, and dot/star fields unless named in the shape inventory with role, layer, bounds, anchors, and purpose.

## Illustration-First Gate

If the vector system is the hero illustration or custom SVG scene, create isolated asset options and complete `docs/qa/illustration-gate-review.md` before full-page implementation.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## Audit Upgrade: Self-Correction Contract

Audit fix: Move beyond bans into an engineering model with hooks.

Required evidence:
- shape inventory, role map, layer stack, bounds, anchors, accessibility/decorative status, and `data-vector-*` hooks.

Repair routing:
- shape-quality-review owns final rejection; layout-integrity-review owns collisions.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "vector-form-system-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
