---
name: data-visualization-selection
description: Select, justify, and QA chart/data visualization choices for dashboards, analytics, monitoring, BI, forecasting, comparison, funnels, maps, networks, and any UI where data must be visualized. Use when Codex needs to choose chart types, design graph systems, avoid decorative charts, define accessibility fallbacks, pick rendering libraries, or review whether dashboard charts communicate real product state.
---

# Data Visualization Selection

Use this skill when a UI includes charts, metrics, graph-rich dashboards, analytics, BI views, monitoring surfaces, financial data, forecast bands, funnels, heatmaps, maps, networks, or any data visualization that affects user decisions.

## Files To Read

- `skills/data-visualization-selection/references/chart-type-selection.md`
- `templates/chart-selection-report.template.md`

## Operating Rule

Do not choose a chart because it "looks dashboardy." Choose the chart from the data shape, user question, data volume, accessibility burden, interaction need, and tool/rendering constraints.

For implementation planning, pair this skill with:

- `skills/chart-system-director/SKILL.md` for visualization intent, data contract, labels, states, responsiveness, and accessibility.
- `design-intelligence/visualization-tool-routing.md` for D3, Observable Plot, Vega-Lite, ECharts, Recharts, Chart.js, Nivo, React Flow, React Konva/Konva, Mermaid, D2, custom SVG, or CSS/HTML routing.
- `skills/diagram-canvas-system/SKILL.md` when the visualization is a map, floor plan, seating chart, timeline, node graph, pattern canvas, or spatial editor.
- `skills/data-viz-hardening-review/SKILL.md` after implementation.

Every chart must answer at least one of:

- What changed?
- What is bigger/smaller?
- What is the share?
- What is related?
- Where is it?
- Where did users drop off?
- How far from target?
- What is anomalous?
- What is the hierarchy?
- What should the user do next?

If a chart cannot answer one of those, remove it or replace it with text, a table, a stat, or a better visualization.

## Workflow

1. Identify the data shape: time, categories, part-to-whole, correlation, intensity, geography, flow, KPI target, forecast, anomaly, hierarchy, network, distribution, finance, real-time, sentiment, or process.
2. Identify the user question and decision pressure.
3. Select the primary chart from the matrix.
4. Name secondary options and why they were rejected.
5. Define accessibility fallback before implementation.
6. Define data volume handling: SVG, Canvas, WebGL, aggregation, downsampling, pagination, or table.
7. Define interaction level: hover, sort, filter, drill, zoom, brush, pause, or keyboard traversal.
8. Define chart bounds: plot area, label margins, clipping, responsive fallback, and overflow control.
9. When the visualization is spatial, map-like, timeline-like, or canvas-based, define label safe zones and collision rules for objects, badges, cards, glows, axes, and annotations.
10. Check whether the chart/map/timeline belongs in the dashboard composition or is just decorative.
11. Fill `templates/chart-selection-report.template.md` for significant visual/data work.

## Chart Integrity Rules

- Use line/area for trend over time.
- Use sorted bars for category comparison.
- Avoid pie/donut for precision, many categories, or accessibility-critical contexts.
- Use stacked bar or waffle for part-to-whole when accessibility matters.
- Use scatter/bubble only when relationship patterns need enough points to be meaningful.
- Use heatmaps only when color intensity is the actual insight and a legend/fallback exists.
- Use funnel/Sankey only when stages or flows are real and sequential/distributional.
- Use bullet charts for compact KPI target grids; use gauges sparingly.
- Use confidence bands only when uncertainty is part of the product truth.
- Use anomaly markers only when anomaly logic is real and explainable.
- Never use 3D charts as the primary product representation unless the third dimension is essential and a 2D fallback exists.
- Real-time charts require pause/reduced-motion behavior and current value text.
- Word clouds are supplementary only; provide a sortable list.

## Required Output

For each meaningful chart, report:

- data question
- selected chart
- rejected alternatives
- data volume strategy
- accessibility fallback
- interaction level
- responsive behavior
- chart bounds strategy
- why the chart is useful instead of decorative
- recommended visualization library/tool
- empty/loading/error states
- data-viz hardening risks

## Stop Conditions

Stop and redesign when:

- chart choice does not match data shape
- chart has no product decision
- labels, bars, axes, or lines escape the container
- spatial labels are covered by objects, cards, glows, badges, or controls
- a map, floor plan, timeline, or seating chart is reduced to generic card decoration
- chart relies on color alone
- chart is inaccessible with no fallback
- chart is decorative wallpaper
- real-time motion lacks pause/reduced-motion handling
- dashboard references are graph-rich but output is chart-lite
- chart or diagram has no data contract
- visualization library/tool choice is arbitrary
- chart/diagram lacks empty/loading/error states

## Audit Upgrade: Self-Correction Contract

Audit fix: Tie chart choice to a decision matrix and accessibility fallback.

Required evidence:
- data shape, user decision, volume, update frequency, chosen/rejected chart types, and fallback plan.

Repair routing:
- chart-system-director owns final chart contract.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "data-visualization-selection"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
