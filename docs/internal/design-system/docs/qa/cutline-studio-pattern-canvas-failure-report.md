# Cutline Studio Pattern Canvas Failure Report

## Project
Cutline Studio

## Mode
Pattern canvas / diagram product surface

## Why It Failed
Cutline Studio failed because the diagram surface did not protect readability, hierarchy, or interaction integrity. The canvas looked hand-placed instead of modeled. Text was clipped, labels collided, badges and callouts covered important pattern information, and the canvas became visually noisy enough to imply poor runtime performance.

## Observed Failures

- Primary text was cut off underneath.
- Pattern-piece labels collided with objects, badges, callouts, and construction text.
- Measurement callouts and status chips overlapped core diagram content.
- Ruler and construction-line semantics were weak and noisy.
- The canvas felt like an overloaded static poster, not an operational pattern drafting surface.
- The density and layering imply serious performance risk unless the implementation has a clear rendering strategy.

## Why These Failures Matter Globally

- Text clipping is a hard layout failure. If the most basic visible text is cut, visual quality cannot be discussed yet.
- Diagram/canvas products depend on trust. Users must believe spatial relationships, measurements, and labels are intentional.
- Pattern canvases need a system, not decorative placement. A broken canvas damages the product object itself.
- Poor diagram performance is product failure because pan, zoom, selection, and editing must feel immediate.

## Rules That Should Catch It

- P0 Layout Integrity.
- Text Baseline / Clipping Integrity.
- Diagram Canvas System.
- Data Viz Hardening Review.
- Spatial Labels Need Protected Zones.
- No Catastrophic Diagram Overlap.
- Diagram / Canvas Performance Discipline.

## New Rule Strengthening Required

1. Primary headings and important UI text must never be clipped, even partially.
2. Pattern canvases must define label lanes, safe zones, callout routes, and collision rules before implementation.
3. Canvas badges, status chips, selected outlines, and callouts cannot obscure piece names, measurements, axes, or construction lines.
4. Diagram/canvas surfaces need an explicit performance budget and rendering strategy.
5. Diagram integrity QA is required or must produce a blocked report.

## Screenshots Saved

- `visual-library/rejected/case-studies/cutline-studio-pattern-canvas-failures/screenshots/text-cut-off-under-section-heading.png`
- `visual-library/rejected/case-studies/cutline-studio-pattern-canvas-failures/screenshots/pattern-canvas-overlapping-labels-and-objects.png`
- `visual-library/rejected/case-studies/cutline-studio-pattern-canvas-failures/screenshots/pattern-canvas-catastrophic-overlap-closeup.png`

## Scorecard Caps Added

- Primary heading or important text clipped/cut off: max score 3.
- Pattern canvas labels collide with objects, badges, callouts, construction lines, or ruler text: max score 3.
- Catastrophic diagram overlap where the canvas becomes unreadable: max score 2.
- Selected state, badge, or callout obscures core diagram data: max score 4.
- Diagram/canvas has no collision model: max score 4.
- Diagram/canvas performance is janky or unbudgeted: max score 5.

## Final Verdict

Rejected global case study. Future agents must treat this as unacceptable evidence for clipped text, diagram/canvas collision failure, weak spatial logic, and performance-hostile canvas composition.
