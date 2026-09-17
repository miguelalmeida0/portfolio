---
name: diagram-canvas-system
description: Design and review spatial diagrams, maps, editors, pattern canvases, node graphs, floor maps, timeline canvases, seating charts, workflow builders, and object-based product surfaces with real coordinate, layer, object, label, collision, selection, and responsive models. Use when labels, guides, callouts, connected objects, selectable objects, or canvas-like product objects can collide or become fake layout.
---

# Diagram Canvas System

Use before implementing or reviewing pattern drafting canvases, floor maps, node graphs, workflow builders, architecture diagrams, timelines, seating charts, spatial maps, editors with selectable objects, or diagrams with labels/guides/callouts.

## Required Output

```md
## Primary Product Object
- object:
- user decision:
- support panels:
- why this is operational, not decorative:

## Coordinate System
- coordinate origin:
- units:
- scale:
- object positions source:
- bounds:

## Canvas Bounds
- desktop:
- tablet:
- mobile:
- overflow / clipping:
- safe area:

## Layer Model
1. canvas background:
2. measurement/grid/guides layer:
3. zone/section labels layer:
4. objects layer:
5. selected object layer:
6. annotations/callouts layer:
7. overlay/controls layer:
8. tooltip/focus layer:

## Object Model
- object types:
- geometry:
- state:
- selection:
- drag/resize if any:
- inspector fields:

## Label Model
- label types:
- priority:
- label lanes:
- safe zones:
- callout routes:
- badge/status safe zones:
- truncation/wrapping:
- units:
- collision rules:

## Interaction Model
- selection:
- inspector update:
- hover/focus:
- keyboard:
- zoom/pan:
- reset/home:

## Responsive Behavior
- 1440:
- 1280:
- 1024:
- 768:
- 390:
- fallback if canvas cannot fit:

## Performance Budget
- expected object count:
- expected label count:
- rendering layer:
- pan/zoom/drag target:
- expensive effects avoided:
- virtualization/culling if needed:
- reduced-motion behavior:

## Hardening Test Cases
- long labels:
- overlapping objects:
- selected state:
- missing object data:
- many objects:
- small viewport:
- 200% zoom:
```

## Required Layer Model

1. canvas background
2. measurement/grid/guides layer
3. zone/section labels layer
4. objects layer
5. selected object layer
6. annotations/callouts layer
7. overlay/controls layer
8. tooltip/focus layer

## Hard Rules

- Labels need protected zones.
- Objects must not overlap critical labels.
- Selected states must not obscure data.
- Measurement labels must remain readable.
- Diagram objects need semantic state.
- Decorative grids are forbidden unless functional.
- Canvas must have a real object model, not random absolute-positioned cards.
- Badges, selected outlines, and callouts must not cover piece names, measurements, axes, ruler labels, or construction lines.
- Pattern canvases must define label lanes, callout routes, badge safe zones, and construction-line semantics.
- Canvas performance must be budgeted before dense labels, shadows, filters, glows, pan/zoom, drag, or live interaction are added.
- Selection must update inspector/details.
- Nav/tabs must change content/state.
- All object positions must be documented or data-driven.
- Small breakpoints must have a fallback.

## Tool Routing

- React Flow: interactive node editors, workflow builders, graph editors.
- React Konva/Konva: interactive 2D canvases with draggable, transformable, evented, exportable, or free-drawn shapes.
- D3/custom SVG: custom geometry, spatial layout, line/shape control, exact domain-specific SVG.
- D2/Mermaid: documentation diagrams, not rich product canvases.
- HTML/CSS: only for static compositions with no spatial data behavior.

## Detector Hook

When a runnable UI exists, use `tools/diagram-integrity-check.mjs` where practical to verify geometry. Mark diagram roots and parts with `data-diagram-root`, `data-diagram-object`, `data-diagram-label`, `data-diagram-protected-label`, `data-diagram-callout`, and `data-diagram-selected` so label/object collisions can be detected instead of guessed from taste alone.

## Score Caps

- Diagram labels collide with objects: max score 4.
- Pattern canvas labels collide with pieces, badges, callouts, construction lines, ruler labels, or measurement chips: max score 3.
- Catastrophic diagram overlap makes the canvas unreadable: max score 2.
- Object layout is arbitrary and undocumented: max score 5.
- Selected object, badge, or callout obscures critical labels/data: max score 4.
- Canvas has no layer model: max score 6.
- Canvas has no collision model for labels, badges, callouts, and measurement layers: max score 4.
- Canvas feels slow, janky, or performance-heavy without mitigation: max score 5.
- Primary product object is buried by panels: max score 6.
- Diagram is decorative rather than operational: max score 5.
- Inspector does not update from selection: max score 4.

## Stop Conditions

Stop before implementation if the canvas has no coordinate system, no layer model, no label safe zones, no collision strategy, or no selection-to-inspector behavior for selectable objects.

## Audit Upgrade: Self-Correction Contract

Audit fix: Keep the strong model and require detector-backed proof.

Required evidence:
- coordinate/layer/object/label/collision/selection model plus diagram-integrity check or blocker.

Repair routing:
- data-viz-hardening-review owns edge cases after implementation.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "diagram-canvas-system"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
