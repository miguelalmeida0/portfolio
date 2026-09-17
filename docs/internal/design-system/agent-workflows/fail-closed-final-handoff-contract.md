# Fail-Closed Final Handoff Contract

For frontend/design work, the agent final response is forbidden unless one of these is true:

1. Final UI Integrity Gate v3 passed.
2. Final UI Integrity Gate v3 was blocked by missing tooling, and the agent clearly reports "blocked, not passed".
3. The task was explicitly non-visual and exempt.

## Required Final Response Fields

- `finalUiIntegrityVerdict`
- `finalUiIntegrityGateVersion`
- `widthSweepTested`
- `heightMatrixTested`
- `viewportMatrixTested`
- `scrollSamplesTested`
- `blockerCount`
- `screenshotEvidenceDirectory`
- `userComplaintStillVisible`
- `finalHandoffAllowed`

## Failed / Blocked Rules

If `finalUiIntegrityVerdict` is failed or blocked:

- finalVerdict cannot be passed
- agent must not say "done"
- agent must not say "no issues found"
- agent must list blockers and fixes

## Mandatory V3 Resize Sweep

Width sweep:

- minimum: 360
- maximum: 1920
- step: 40px or smaller if practical

Height samples:

- 720
- 844
- 900
- 1080

At minimum, test:

- 360x720
- 390x844
- 430x844
- 640x900
- 768x900
- 900x900
- 1024x900
- 1180x900
- 1280x900
- 1366x900
- 1440x900
- 1536x900
- 1728x1080
- 1920x1080

Legacy v2 viewport widths remain useful but are not enough for final handoff:

Viewport widths:

- 390
- 430
- 640
- 768
- 900
- 1024
- 1180
- 1280
- 1366
- 1440
- 1536
- 1728
- 1920

Scroll samples:

- 0
- 0.10
- 0.20
- 0.35
- 0.50
- 0.65
- 0.80
- 0.90
- 1.00

Applicable states:

- default
- nav active states
- selected card/detail panel open
- sticky/pinned active section
- compact nav state
- reduced motion state if practical
