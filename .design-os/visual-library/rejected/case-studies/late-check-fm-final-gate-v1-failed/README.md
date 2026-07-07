# Late Check FM Final Gate V1 Failed

Rejected enforcement case study for the first final UI integrity gate.

The direction was good. The failure was enforcement: final handoff still allowed visible integrity failures after the supposed gate.

## Evidence

- `screenshots/late-check-fm-01-floating-label-overlaps-at-large-width.png`
- `screenshots/late-check-fm-02-cut-text-after-integrity-gate.png`

## Failure Summary

- Floating label/container worked at smaller widths but drifted and overlapped another container as width increased.
- Text was still cut/clipped after validation.
- Fixed breakpoint checking missed intermediate and large-width composition drift.
- Final handoff should have been blocked, not passed.

## Required Future Prevention

- Final UI Integrity Gate v2 must test viewport width matrix, scroll samples, and applicable states.
- Any sampled layout failure blocks final handoff.
- Final reports must include passed and failed viewport/scroll/state lists.
- Screenshot evidence at one width is insufficient.
