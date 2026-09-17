---
name: data-viz-hardening-review
description: Stress-test charts, diagrams, labels, legends, axes, canvases, maps, timelines, and visual encodings with real-world data and viewport edge cases. Use after implementing or reviewing charts, dashboards, spatial maps, pattern canvases, diagrams, timelines, node graphs, floor maps, or any data visualization that must survive long labels, missing values, many items, narrow widths, zoom, accessibility, and async states.
---

# Data Viz Hardening Review

Use after a chart, graph, diagram, spatial map, floor plan, timeline, canvas, or visual encoding exists and before calling it final.

## Required Test Table

```md
| Visualization | Edge Case | Current Risk | Required Fix | Severity |
|---|---|---|---|---|
```

## Edge Cases To Test

- long labels
- German text expansion
- CJK labels
- RTL labels
- emoji in labels
- missing values
- zero values
- huge values
- negative values
- many series
- many points
- no data
- loading
- API errors
- narrow widths
- 200% zoom
- high contrast
- reduced motion
- keyboard navigation
- pan/zoom/drag performance
- repeated shadows/filters/glows
- dense SVG/DOM node count

## Hard Rules

- Every chart/diagram needs an empty state.
- Every chart/diagram needs a loading state if async.
- Every chart/diagram needs an error state if async.
- Labels must not overflow containers.
- Legends must wrap, collapse, or move.
- Tooltips must stay in the viewport.
- Values need units.
- Abbreviations need explanation.
- Important states cannot rely on color alone.
- Canvas controls need keyboard alternatives where practical.
- Interactive diagrams need a rendering/performance budget; dense labels, shadows, filters, and glows must not make pan, zoom, drag, selection, or hover feel slow.

## Review Steps

1. Identify each visualization and its user question.
2. Check the data contract, units, ranges, and null behavior.
3. Stress labels with long, translated, CJK, RTL, and emoji examples.
4. Stress values with zero, negative, huge, missing, and dense datasets.
5. Check empty, loading, and error states.
6. Check 1440, 1280, 1024, 768, and 390 widths when relevant.
7. Check 200% zoom, high contrast, reduced motion, and keyboard access.
8. Flag every collision, clipped label, misleading encoding, hidden unit, color-only state, and tooltip overflow.
9. For runnable diagrams/canvases with markup hooks, run `tools/diagram-integrity-check.mjs` or record why the detector was blocked.

## Score Caps

- Label overflow or clipping: max hardening score 4.
- Tooltip escapes viewport: max hardening score 5.
- Legend breaks or hides meaning: max hardening score 5.
- Missing empty state: max hardening score 6.
- Missing async loading/error state: max hardening score 5.
- Units absent for quantitative values: max hardening score 5.
- Many series/items make the visualization unreadable: max hardening score 5.
- Color-only encoding for important states: max hardening score 5.
- Canvas/diagram lacks keyboard fallback where practical: max hardening score 6.
- Diagram/canvas interaction is janky or performance-heavy without mitigation: max hardening score 5.
- Pattern canvas labels/callouts/status chips collide under zoom or dense data: max hardening score 3.

## Audit Upgrade: Self-Correction Contract

Audit fix: Require real edge-case fixtures and viewport stress.

Required evidence:
- long labels, missing values, many items, narrow widths, empty/loading/error states, and screenshot/tool evidence.

Repair routing:
- chart-system-director or diagram-canvas-system owns structural fixes.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "data-viz-hardening-review"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
