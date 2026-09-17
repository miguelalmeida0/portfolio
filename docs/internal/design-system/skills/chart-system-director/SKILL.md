---
name: chart-system-director
description: Prevent broken, fake, or decorative charts by defining visualization intent, data contracts, chart type, library choice, labels, axes, legends, interactions, states, responsiveness, and accessibility before implementation. Use for dashboards, analytics, time series, comparisons, rankings, distributions, financial or operational metrics, maps, heatmaps, sparklines, timelines, gauges, diagrams, or any UI containing charts that encode data.
---

# Chart System Director

Use before implementing or reviewing any chart, graph, map, metric visualization, dashboard graph system, or data-encoding diagram.

## Read First

- `design-intelligence/visualization-tool-routing.md`
- `skills/data-visualization-selection/SKILL.md` when chart type selection is broad or ambiguous
- `evaluation/ui-scorecard.md`

## Required Output

```md
## Visualization Intent
- user question:
- decision supported:
- why visualization is needed:

## Data Contract
- data source / mock truth:
- fields:
- types:
- units:
- ranges:
- missing/null behavior:
- update frequency:

## Chart Type Selection
- selected chart:
- alternatives rejected:
- why this matches the task:
- what would be decorative:

## Library Recommendation
- recommended tool:
- why:
- fallback if unavailable:

## Axis / Scale Plan
- x:
- y:
- scale:
- domains:
- tick density:
- units:

## Label / Legend Plan
- labels:
- truncation/wrapping:
- legend:
- abbreviations:

## Tooltip Plan
- trigger:
- content:
- viewport containment:
- keyboard/focus behavior:

## Interaction Plan
- hover/focus:
- selection:
- filtering:
- drilldown:
- keyboard behavior:

## States
- empty:
- loading:
- error:
- no permission:
- stale data:

## Responsive / Accessibility Plan
- 1440:
- 1280:
- 1024:
- 768:
- 390:
- screen reader summary:
- color-independent encoding:
- high contrast:
- reduced motion:

## Screenshot QA Checklist
- labels visible:
- values not clipped:
- units visible:
- legend works:
- tooltip stays in viewport:
- no color-only meaning:
- chart remains useful without animation:
```

## Hard Rules

- No decorative chart wallpaper.
- No fake chart data without honest demo labeling.
- No random donut charts.
- No chart without a question it answers.
- No chart without a data contract.
- No unreadable axes or labels.
- No chart that clips labels, values, units, or tooltips.
- No chart that breaks at 768 or 390.
- No color-only status encoding.
- No truncated critical values.
- No hidden units.
- No unexplained abbreviations.

## Library Routing

- D3: bespoke geometry, custom scales, custom SVG, layout algorithms.
- Observable Plot: concise exploratory/statistical charts.
- Vega-Lite: declarative JSON specs, data-to-visual-encoding grammar, layered/multi-view charts, declarative selections.
- ECharts: production dashboards, many chart types, larger datasets, Canvas/SVG switching.
- Recharts: React product apps with normal SVG charts and custom React UI around them.
- Chart.js: simple standard Canvas charts, performance-sensitive datasets, decimation.
- Nivo: polished D3-backed React chart components.
- React Flow: node editors, workflow builders, selectable/draggable diagrams.
- React Konva/Konva: custom interactive 2D drawing/editing canvases with draggable/transformed shapes.
- Mermaid/D2: documentation diagrams.
- Custom SVG: small controlled canvases with exact art direction.
- CSS/HTML only: static composition with no real data mapping.

## Score Caps

- Decorative/fake chart: max score 4.
- Chart has no clear question: max score 5.
- Axes/labels unreadable: max score 5.
- Chart clips labels or tooltips: max score 4.
- Chart lacks empty/error/loading state: max score 6.
- Chart relies only on color: max score 5.
- Chart type mismatches data task: max score 5.

## Stop Conditions

Stop before implementation if the chart has no data contract, no user question, no label/axis plan, no responsive plan, or no accessibility fallback.

## Audit Upgrade: Self-Correction Contract

Audit fix: Keep chart discipline and emit repairable verdicts.

Required evidence:
- user question, data contract, chart choice, rejected charts, states, accessibility, and bounds proof.

Repair routing:
- data-visualization-selection owns chart choice gaps; data-viz-hardening-review owns rendered edge cases.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "chart-system-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
