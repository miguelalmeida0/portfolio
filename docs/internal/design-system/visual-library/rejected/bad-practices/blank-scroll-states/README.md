# Blank Scroll States

## Failure

A scroll or resize state shows a huge empty viewport with no meaningful content or intentional pause.

## Why V2 Missed It

V2 had a basic blank-area heuristic but did not connect blank states to horizontal routes, active content, or intentional blank markers.

## Detection

- Measure meaningful content area in every sampled viewport/scroll state.
- Allow blankness only when `data-intentional-blank-stage` is present and documented.

## Fix

- Bring active content into view.
- Shorten the route.
- Replace risky choreography with a vertical readable flow.

## Required Future Checks

Final gate must sample scroll states and fail blank states without intentional markers.

## Score Caps

- scroll creates huge accidental blank state: max score 4
- active content stranded offscreen: max score 3
- no blank-state check: max score 5
