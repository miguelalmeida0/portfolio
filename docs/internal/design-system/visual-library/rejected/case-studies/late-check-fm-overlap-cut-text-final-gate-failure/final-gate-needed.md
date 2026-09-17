# Final Gate Needed

## Problem

Build/lint, component structure, and subjective review are not enough. A UI can compile and still visibly fail.

## Required Gate

Run `final-ui-integrity-gate` after implementation, build/lint, screenshot capture, scroll/media/layout work, and responsive pass.

## Fail-Closed Rule

If any P0 blocker appears, final handoff is forbidden. The agent must fix the UI and rerun validation before responding.

## Verdict Terms

- `passed`: all required visual integrity checks pass.
- `partial`: non-blocking issues remain and are documented.
- `failed`: P0 blockers are present.
- `blocked`: the gate could not run; do not claim passed.
