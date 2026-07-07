# Horizontal Scroll Partial Content

## Failure

Horizontal scroll shows fragments of cards, panels, giant text, or active content instead of readable resting states.

## Why V2 Missed It

V2 sampled vertical scroll points but did not understand horizontal route safety or active panel readability.

## Detection

- Flag uncontrolled body horizontal overflow.
- Flag `data-horizontal-stage` states where active panel/content is clipped.
- Flag large blank regions during horizontal route states.

## Fix

- Define scroll route map and snap/settle states.
- Make active panel fully readable.
- Allow inactive peeking only when active content is safe.
- Fall back to vertical flow on mobile/tablet when needed.

## Required Future Checks

Run horizontal scroll safety review and Final UI Integrity Gate v3.

## Score Caps

- horizontal route has unreadable partial content: max score 3
- active content cut during horizontal scroll: max score 3
- horizontal scroll creates accidental blank area: max score 4
- no horizontal route safety review: max score 5
