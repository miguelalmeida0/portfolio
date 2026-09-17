# Cutline Studio Pattern Canvas Failures

## Why Rejected

Cutline Studio is rejected here because the pattern canvas failed basic visual integrity. The UI allowed primary text to be cut off, pattern-piece labels to collide, badges and callouts to sit on top of important names and measurements, and the diagram surface to become a noisy pile of overlapping layers.

This is not a small aesthetic issue. Pattern canvases, diagrams, graphs, maps, and spatial product objects need elite containment, label hierarchy, collision logic, and performance discipline. If the user has to fight the canvas to read the object, the product has failed before taste is evaluated.

## Screenshots

| Filename | Failure Shown | Why Rejected | Correction Principle | Mapped Rule | Scorecard Cap |
| --- | --- | --- | --- | --- | --- |
| `screenshots/text-cut-off-under-section-heading.png` | Heading text is visibly cut off underneath | Primary text cannot be clipped by viewport, parent overflow, line-height, transforms, or decorative cropping. | Protect text boxes with correct line-height, overflow strategy, vertical rhythm, and screenshot checks at real viewports. | P0 Layout Integrity; Text Baseline / Clipping Integrity | primary heading or important text clipped: max 3 |
| `screenshots/pattern-canvas-overlapping-labels-and-objects.png` | Full pattern canvas has overlapping pieces, callouts, labels, ruler text, chips, and construction lines | The canvas has no credible label collision model, layer model, or visual priority system. | Build the canvas from a coordinate/layer/object/label model with safe zones, label routing, collision rules, and detector QA. | Diagram Canvas System; Spatial Labels Need Protected Zones | pattern canvas label/object collision: max 3 |
| `screenshots/pattern-canvas-catastrophic-overlap-closeup.png` | Close-up shows badges, piece names, measurement callouts, and construction text colliding into unreadable content | This is catastrophic diagram failure: the canvas became illegible and visually chaotic. | Reduce layers, reserve label lanes, route callouts outside shapes, clamp text, and use data-driven collision avoidance. | No Catastrophic Diagram Overlap; Diagram Performance Discipline | catastrophic diagram overlap: max 2 |

## Correction Principles

- Primary headings and important UI text must never be clipped or cut off.
- Pattern canvases need a model: coordinate system, object geometry, label lanes, callout anchors, protected zones, z-index layers, and collision behavior.
- Labels cannot be placed by eye. They need safe zones, priority rules, fallback placement, truncation rules, and zoom/viewport behavior.
- Status chips, badges, callouts, and selected outlines must never cover piece names, measurements, axes, ruler labels, or construction semantics.
- Construction lines and rulers must communicate real measurement or drafting state; they cannot become noisy texture.
- If the diagram surface feels slow, janky, or overdrawn, visual ambition must be reduced or moved to Canvas/Konva/SVG layers with a performance budget.

## Rules This Should Catch

- P0 Layout Integrity.
- Text Baseline / Clipping Integrity.
- Diagram Canvas System.
- Data Viz Hardening Review.
- Spatial Labels Need Protected Zones.
- No Catastrophic Diagram Overlap.
- Diagram / Canvas Performance Discipline.
- Chart / Diagram Review Mandatory.

## Scorecard Caps

- Primary heading or important text clipped/cut off: max score 3.
- Pattern canvas labels collide with objects, badges, or construction lines: max score 3.
- Catastrophic diagram overlap where labels, objects, badges, and callouts become unreadable: max score 2.
- Selected state, badge, or callout obscures core diagram data: max score 4.
- Diagram/canvas has no collision model: max score 4.
- Diagram/canvas feels janky or performance-heavy without mitigation: max score 5.
- Diagram integrity detector is skipped without a blocked reason: max score 6.
