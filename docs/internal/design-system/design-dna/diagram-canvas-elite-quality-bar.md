# Diagram / Canvas Elite Quality Bar

Use this for pattern canvases, floor maps, seating charts, node editors, timelines, graphs, spatial maps, construction diagrams, and any product surface where objects, labels, measurements, callouts, badges, or guides coexist.

## Hard Position

A diagram is not elite because it looks dense. It is elite when the spatial model is readable, trustworthy, fast, and useful at every zoom/viewport state.

## Non-Negotiables

- Primary text is never clipped, cut off, or cropped by line-height, masks, parent overflow, transforms, sticky containers, or viewport framing.
- Every canvas has a coordinate system, bounds, layer model, object model, label model, and collision strategy.
- Pattern canvases define label lanes, callout routes, badge/status safe zones, measurement hierarchy, and construction-line semantics before implementation.
- Badges, selected outlines, handles, callouts, and hover states do not cover piece names, measurements, axes, ruler labels, or construction lines.
- Zoom/detail states increase clarity. They must not create a more chaotic overlap pile.
- Construction lines and guides are functional measurement aids, not decorative texture.
- Selection updates inspector/details and never hides the selected object's essential data.
- The rendering strategy is chosen intentionally: custom SVG for small controlled diagrams, Canvas/Konva for dense interactive shape fields, D3 for bespoke geometry, React Flow for node editors, and HTML/CSS only for static compositions.
- Performance has a budget: object count, label count, expensive effects, pan/zoom/drag target, culling/virtualization if needed, and reduced-motion behavior.
- Runnable diagrams use `tools/diagram-integrity-check.mjs` where practical or document why the detector is blocked.

## Elite Behavior

- Labels have priority levels and fallback positions.
- Callouts route around objects instead of crossing important text.
- Rulers, axes, and measurement labels occupy protected lanes.
- Status chips sit in safe zones or outside core geometry.
- Selected states clarify the object without swallowing the drawing.
- Dense canvases can simplify: hide secondary annotations, collapse labels, switch to inspector details, or change representation at small widths.
- The canvas still communicates if animation is disabled.

## Rejected Immediately

- clipped headings or important labels
- overlapping pattern pieces with no layout model
- badges covering labels or measurements
- callouts crossing through important text
- ruler/axis labels fighting with object labels
- construction lines used as noisy background texture
- close-up states that are less readable than overview states
- hundreds of shadow/filter/glow-heavy DOM/SVG nodes with no rendering plan
- pan, zoom, drag, hover, or selection that feels slow

## Required Proof

- visual spec includes label/callout/badge/collision/performance strategy
- screenshot review checks overview and close-up states
- detector pass or blocked report exists for runnable spatial UI
- data-viz hardening covers long labels, translated labels, dense objects, no data, and 200% zoom
