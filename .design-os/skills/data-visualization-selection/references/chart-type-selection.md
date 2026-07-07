# Chart Type Selection Matrix

Source ingested from Migi's open-source chart-selection table. Use this as a decision matrix, not as decoration guidance.

## Selection Heuristics

| Data shape | Primary chart | Secondary options | Use when | Avoid when | Accessibility fallback |
| --- | --- | --- | --- | --- | --- |
| Trend over time | Line chart | Area, smooth area | Time axis; rise/fall/rate of change matters | Fewer than 4 points, more than 6 series, no time dimension | Data table with timestamps/values; line styles beyond color |
| Category comparison | Bar chart | Column, grouped bar | Discrete categories by magnitude or rank | More than 15 categories without search/table; time data; proportions | Always-visible value labels; CSV/table export |
| Part-to-whole | Stacked bar or waffle; donut only for simple overview | Pie, donut | 5 or fewer categories; rough share is enough | More than 5 categories, small slice differences, precision needed | Stacked bar plus percentage table |
| Correlation/distribution | Scatter or bubble | Heat map, matrix | Two continuous variables, clusters, outliers | Categorical variables, fewer than 20 points, mobile-primary precision | Data table plus correlation annotation and shape markers |
| Heatmap/intensity | Heat map | Grid heat map, bubble heat | 2D density/intensity or calendar/matrix patterns | Few cells, exact values primary, no colorblind fallback | Numeric legend, value table, pattern overlay |
| Geographic | Choropleth or bubble map | Geographic heat map | Region/location is the core insight | Region size misleads comparison; mobile-primary | Sortable region table, labels, keyboard navigation |
| Funnel/conversion | Funnel chart | Sankey, waterfall | Sequential stages and drop-off matter | Non-sequential stages, values not monotonic, fewer than 3 stages | Linear stage list with count and drop-off percent |
| KPI vs target | Bullet chart; gauge for single emphasis | Progress, dial | KPI has benchmark/threshold | No target; many KPIs in gauges | Visible value, percent of target, labeled thresholds |
| Forecast | Line with confidence band | Ribbon chart | Historical plus predicted values and uncertainty | No baseline, low confidence, non-data-literate audience | Actual/forecast toggles; legend distinguishes line style |
| Anomaly detection | Line with highlights | Scatter alert | Operational time-series outliers | Fake anomaly logic; real-time without pause | Annotation list and shape markers |
| Hierarchical size | Treemap | Sunburst, icicle | Proportional hierarchy overview | Depth greater than 3; precise sibling comparison | Collapsible tree table as primary view |
| Flow/process | Sankey | Alluvial, chord | Quantity moves source to target | Loops, few pairs, mobile-primary | Flow table and keyboard node list |
| Cumulative changes | Waterfall | Cascade, stacked bar | Additive positive/negative components to total | Non-additive data; more than 12 bars | Running-total table with directional icons |
| Multi-variable comparison | Radar only for small familiar sets | Parallel coordinates, grouped bar | 5-8 axes, 2-3 entities, quick shape comparison | Precision needed; more than 8 axes | Grouped bar and raw table |
| OHLC finance | Candlestick | OHLC, Heikin-Ashi | Trading/investment OHLC data | Non-financial audience; no OHLC; a11y-first | OHLC table and numeric summary |
| Network/relationship | Network graph | Tree, adjacency matrix | Topology or connection exploration | More than 500 nodes without clustering; mobile | Adjacency list; hierarchical tree where possible |
| Statistical distribution | Box plot | Violin, beeswarm | Spread/median/outliers across groups | Fewer than 20 points/group; unfamiliar audience | Stats table: min, Q1, median, Q3, max, mean |
| Compact KPI target | Bullet chart | Gauge, progress bar | 3-10 KPIs in limited dashboard space | Single hero KPI; no target range | Always-visible values and labeled ranges |
| Percentage/proportion | Waffle chart | Pictogram, 100% stacked bar | Fraction of a whole with visual engagement | More than 5 categories; exact values primary | Percent text and legend |
| Hierarchical proportional | Sunburst | Treemap, icicle, circle packing | Nested proportions need hierarchy and size overview | More than 3 levels; mobile; precision | Collapsible indented list with percentages |
| Root cause/decomposition | Decomposition tree | Decision tree, flow chart | Metric split into contributing factors | No parent-child causal relationship | Keyboard expand/collapse tree with value/percent |
| 3D spatial | 3D scatter/surface only if essential | Point cloud, volumetric | Z-axis carries essential scientific/spatial meaning | 2D projection works; standard business UI | Mandatory 2D projection plus data table |
| Real-time streaming | Streaming area | Ticker, moving gauge | Live monitoring at high update rate | Slow update frequency; no reduced-motion support | Pause/resume, current value text, reduced motion freeze |
| Sentiment/emotion | Sentiment list with optional word cloud | Sentiment arc, radar | Exploratory NLP frequency/sentiment | Precision or screen-reader primary context | Sortable sentiment/frequency list |
| Process mining | Process map only when source row is complete | Variants/path table | Event logs and bottleneck paths | Source matrix row was incomplete in attachment | Require explicit process table before use |

## Rendering Guidance

- SVG is usually fine for small to moderate datasets.
- Use Canvas for dense time-series, scatter, heatmap, or streaming data.
- Use WebGL only when data volume or 3D spatial need justifies it.
- Downsample, aggregate, paginate, or filter before shipping unreadable charts.
- A chart that needs exact reading must expose values, labels, or a table.

## Accessibility Rules

- Never rely on color alone.
- Add labels or value text where possible.
- Distinguish series by line style, marker shape, texture, or pattern.
- Provide a table/list fallback for C/D-grade visualizations.
- Keep legends visible, labeled, and keyboard-reachable when interactive.
- Respect `prefers-reduced-motion` for live/animated charts.

## Miguel Design OS Dashboard Rule

Dashboard mode should be graph-rich, but not chart-noisy. Use at least two meaningful visualization types when dashboard data supports it, and make one visualization a clear decision anchor only if it communicates real state.
