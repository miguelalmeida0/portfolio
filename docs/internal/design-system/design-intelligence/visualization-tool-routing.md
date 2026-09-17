# Visualization Tool Routing

Use this guide before implementing charts, diagrams, maps, timelines, pattern canvases, node graphs, or spatial product objects.

## Tool Choices

Use D3 when:

- bespoke visualization is needed
- custom geometry or SVG control matters
- axes, scales, shapes, zoom, drag, or layout algorithms are central
- force graphs, trees, treemaps, maps, Voronoi, contours, chords, or custom shapes are needed
- maximum control over marks, labels, layers, and interaction is needed

Use Observable Plot when:

- exploratory charts are needed
- concise code matters
- normal chart marks, scales, transforms, or facets are enough
- statistical clarity matters more than custom UI chrome

Use Vega-Lite when:

- declarative JSON chart specs are useful
- chart types should be generated from a data-to-visual-encoding grammar
- axes, legends, scales, transforms, layering, multi-view, and selections should be specified declaratively

Use ECharts when:

- production dashboard charts are needed
- many chart types are needed out of the box
- Canvas/SVG switching matters
- larger datasets or progressive rendering matter
- accessibility descriptions or decals are useful

Use Recharts when:

- a React product app needs normal charts
- composable React components are preferred
- SVG charting is enough
- custom React UI around the chart matters

Use Chart.js when:

- simple standard charts are enough
- Canvas performance matters
- large datasets need decimation
- quick production chart defaults are desired
- huge DOM/SVG node count should be avoided

Use Nivo when:

- a React app needs rich D3-backed chart components
- design polish and component variety matter
- chart type variety matters

Use React Flow when:

- node-based editors are needed
- the user can drag, pan, zoom, or select objects
- workflows, graph editors, logic builders, diagrams, or spatial editors are needed
- custom React nodes and panels are needed

Use React Konva/Konva when:

- custom interactive 2D canvas is needed
- shapes need dragging, transforming, events, export, or free drawing
- product objects behave like a drawing/editing canvas

Use Mermaid when:

- documentation diagrams are enough
- diagrams can come from text
- flowcharts, sequence diagrams, ER diagrams, Gantt, timelines, architecture diagrams, Sankey, treemaps, or similar docs diagrams are needed

Use D2 when:

- text-to-diagram with stronger style, theming, layout, or export is needed
- software diagrams, architecture diagrams, containers, tooltips, links, and exports are needed

Use custom SVG when:

- the product object is a small controlled canvas
- exact art direction matters
- data size is low
- labels, layers, and collision rules can be implemented directly
- the visual object is domain-specific, like garment pattern pieces or floor tables

Use CSS/HTML only when:

- the diagram is actually a static product composition
- there is no data mapping, zooming, panning, axes, or interaction

## When Not To Use Charts

Do not use a chart when:

- the user question is better answered by one number, a sentence, a table, or a list
- data is too thin or fake to support visual encoding
- the chart does not change a user decision
- labels, units, and scale cannot be made legible
- the chart exists only to make a dashboard look intelligent

## Fake / Decorative Chart Signals

A chart is fake or decorative when:

- no user question is named
- no data contract exists
- axes or units are hidden without reason
- labels are unreadable or clipped
- the chart is visually attractive but communicates no state, comparison, trend, risk, priority, distribution, or progress
- it uses a random donut, gauge, waveform, heatmap, or line chart because the surface needs decoration

## Spatial UI Rules

Spatial UI needs a real layout model when:

- objects can overlap
- labels sit near objects
- selection changes inspector/details
- maps, floor plans, pattern pieces, timelines, or nodes encode product state
- breakpoints require alternate layouts

Labels need collision prevention when:

- labels sit over, inside, or near spatial objects
- objects can move, resize, glow, select, or receive badges
- long labels, units, or translated labels appear
- canvas zoom/pan or responsive resizing changes relationships

Before implementing spatial UI, define:

- coordinate system
- canvas bounds
- layer model
- object model
- label safe zones
- collision strategy
- selection/inspector relationship
- responsive fallback

## Data Contract Requirement

Every chart or diagram that encodes data needs a data contract before implementation:

- user question
- data fields
- types and units
- expected ranges
- empty/missing/null behavior
- update frequency
- demo-data truth label
- chart/diagram selection rationale
- accessibility fallback
