# Chart Guidance

Use `chart-recommendation-matrix.json` and `skills/data-visualization-selection`.

## Rules

- Every chart must answer a user decision.
- Pick chart type from data shape.
- One major dashboard chart can be a visual anchor, but it must communicate state.
- Use multiple chart types only when each has a distinct job.
- Plan chart bounds before implementation.
- Provide accessibility fallback before coding.

## Chart Strategy In Visual Spec

Include:

- chart data shapes
- major chart
- supporting charts
- microcharts
- what each chart communicates
- accessibility fallback
- rendering strategy
- responsive fallback
- chart bounds strategy

## Blockers

- decorative chart wallpaper
- chart type does not match data
- no chart rationale for dashboard charts
- chart overflow
- chart relies on color alone
- inaccessible chart with no fallback
