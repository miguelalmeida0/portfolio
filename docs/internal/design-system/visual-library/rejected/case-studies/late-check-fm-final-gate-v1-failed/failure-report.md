# Failure Report

## Verdict

Rejected enforcement failure.

## What Worked

- Direction was good.
- The floating label concept had potential.
- The final gate existed in name.

## What Failed

- Floating container drifted at larger widths and overlapped another container.
- Cut text remained visible after validation.
- The gate did not sample enough viewport widths, scroll states, or interaction states.
- The final handoff treated the UI as passable despite visible blockers.

## Required Prevention

- Final UI Integrity Gate v2 with expanded width matrix.
- Scroll sample matrix.
- Floating object overlap detection.
- Parent clipping and visible text overflow detection.
- Fail-closed final handoff contract.
- Done-report validator that blocks passed handoff when blockers remain.
