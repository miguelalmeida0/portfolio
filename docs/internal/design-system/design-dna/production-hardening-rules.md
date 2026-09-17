# Production Hardening Rules

Production hardening is a post-build review layer. Do not run it during Fast Direction Gate.

## Rule

A UI that only works with perfect data is not production-ready. Finished product UI must survive long text, missing data, slow networks, errors, translations, accessibility needs, large datasets, and responsive stress.

## Required Resilience

- Long text wraps, truncates, or clamps intentionally.
- Flex/grid children that contain text use `min-width: 0` where needed.
- Primary lists have empty states.
- Async actions have loading, success, error, and retry paths.
- Destructive and concurrent actions prevent double-submit and explain consequence.
- Modals and sheets fit small viewports and long content.
- Icon-only controls have accessible labels.
- Status is not communicated by color alone.
- Animated interfaces support reduced motion.
- Large datasets have pagination, search, filtering, or virtualization plans.
- Layouts survive 1440, 1280, 1024, 768, and 390 when relevant.

## Visualization Hardening

Charts, diagrams, maps, timelines, and canvases must also survive:

- long labels
- German text expansion
- CJK and RTL labels
- emoji in labels
- missing, zero, huge, and negative values
- many series, many points, or many objects
- no data
- loading and API error states
- narrow widths
- 200% zoom
- high contrast
- reduced motion
- keyboard navigation where practical

Route `skills/data-viz-hardening-review/SKILL.md` after implementing any meaningful chart, graph, diagram, map, timeline, or canvas. For runnable spatial UIs, run `tools/diagram-integrity-check.mjs` when markup hooks are practical, or record why it was blocked.

## Use

Route `skills/production-hardening-review/SKILL.md` after implementation and before calling product UI production-ready.
