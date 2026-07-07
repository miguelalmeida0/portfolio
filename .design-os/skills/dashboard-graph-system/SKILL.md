---
name: dashboard-graph-system
description: Design or review graph-rich dashboard systems with meaningful chart selection, dashboard attraction zones, chart bounds, data-shape rationale, accessibility fallbacks, palette/material discipline, and anti-decorative-chart enforcement. Use for dashboards, command centers, BI, analytics, monitoring, forecasts, heatmaps, funnels, KPIs, and operational data products.
---

# Dashboard Graph System

Use when a dashboard or command center needs charts, graph systems, KPIs, timelines, maps, heatmaps, forecasts, anomaly states, or comparison views.

## Files To Read

- `skills/chart-system-director/SKILL.md`
- `skills/diagram-canvas-system/SKILL.md` when maps, floor plans, seating charts, timelines, canvases, or node graphs are involved
- `skills/data-visualization-selection/SKILL.md`
- `design-intelligence/visualization-tool-routing.md`
- `design-intelligence/chart-guidance.md`
- `design-intelligence/chart-recommendation-matrix.json`
- `design-dna/layout-recipes.md`
- `design-dna/human-dashboard-palette-rules.md`
- `design-dna/dashboard-route-architecture-rules.md`
- `design-dna/domain-realism-and-mock-data-rules.md`
- `templates/chart-selection-report.template.md`
- `templates/checklists/human-dashboard-palette-checklist.md`
- `templates/checklists/dashboard-route-architecture-checklist.md`

## Workflow

1. Identify dashboard attraction zone.
2. Identify the primary product object. For operational desktop products, this may be a map, floor plan, seating chart, timeline, canvas, roster, queue, or major chart. Support panels must orbit the object; they must not bury it.
3. If visual direction is uncertain for a dashboard redesign, confirm `docs/design/direction-options.md` and `docs/design/selected-direction.md` exist before implementation.
   - Direction A should be Safe Refined.
   - Direction B should be Artistic Expressive.
   - Direction C should be Unexpected High-Character.
   - The three directions must differ in composition, palette, graph emphasis, media/object strategy, and motion/live energy.
4. Identify user decisions.
5. Define the dashboard Domain Content Contract: real business entities, KPIs, queues, owners, SLAs, costs, cohorts/segments, time ranges, statuses, drilldowns, and actions. Reject abstract `mission control`, `topology`, `traces`, or `system map` labels unless the product is truly observability/network/distributed-systems and the data contract proves it.
6. Define task inventory and route architecture so complex processes do not collapse into one overloaded page.
6. Define Human Dashboard Palette Strategy from approved references, product domain, task pressure, and OKLCH/APCA contrast logic.
7. Define chart/diagram data contracts.
8. Select chart data shapes.
9. Choose one major chart or map only if it communicates core state.
10. For maps, floor plans, seating charts, timelines, and canvases, define coordinate systems, layer models, label safe zones, and object collision rules.
11. Choose supporting charts only when they add distinct meaning.
12. Define accessibility fallback for every chart.
13. Define chart bounds and responsive adaptations.
14. Integrate chart color with design-system state and palette.
15. Reject decorative chart wallpaper, robotic AI dashboard palette, route underuse, and generic card-soup regression.

## Output

For dashboard work, include in `docs/design/visual-spec.md`:

- graph system strategy
- primary product object / command-surface strategy
- human dashboard palette strategy
- dashboard route architecture
- domain content contract
- real entities, KPI definitions, units, ranges, statuses, and source/freshness labels
- task inventory and route jobs
- spatial label safe zones when maps/floor plans/timelines/canvases exist
- direction options / selected direction when dashboard visual direction was not already approved
- major chart
- supporting charts
- microcharts
- data shape and decision for each
- accessibility fallback
- chart bounds strategy
- responsive chart behavior
- visualization tool/library recommendation
- data-viz hardening plan

## Stop Conditions

- chart type does not match data shape
- no chart rationale
- dashboard visual direction is uncertain but no direction gate occurred
- dashboard directions are minor variations of the same card grid, palette, or chart layout
- dashboard palette is robotic, one-note, or visibly AI-generated
- approved dashboard references are available but palette/material/routing lessons are not transferred
- complex operational work is crammed into one page instead of focused routes
- navigation exists but does not create distinct route jobs
- implementation starts before Migi selects a dashboard direction
- chart is decorative
- dashboard is graph-lite despite graph-rich references
- desktop command surface buries the primary product object in cards
- map/floor-plan/timeline/canvas labels collide with objects, cards, glows, or badges
- nav/tabs change active state without changing visible product state
- chart overflows its card
- chart relies on color alone
- chart, graph, map, or diagram has no data contract
- dashboard has random metrics, generic operational theater, or routes that do not match real business tasks
- visualization tool/library choice has no rationale
- canvas or spatial product object has no coordinate/layer/object model
- selection does not update inspector/details

## Audit Upgrade: Self-Correction Contract

Audit fix: Orchestrate the dashboard/chart/data-viz stack instead of overlapping it.

Required evidence:
- dashboard attraction zone, chart hierarchy, graph mix, data decisions, image/media roles, and route table.

Repair routing:
- chart-system-director and data-visualization-selection own chart-specific repairs.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "dashboard-graph-system"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
