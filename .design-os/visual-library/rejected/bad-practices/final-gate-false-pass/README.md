# Final Gate False Pass

## Failure

The agent reports completion even though screenshot evidence still shows blockers.

## Why V2 Missed It

The gate did not require a continuous resize sweep, horizontal route safety evidence, or strict enough final-report fields for V3 blockers.

## Detection

- Compare final verdict against blocker count, failed states, and remaining complaint flags.
- Reject passed handoff when `finalHandoffAllowed` is false or failed states exist.

## Fix

- Run Final UI Integrity Gate v3.
- Update done report with V3 fields.
- Report blocked/failed instead of success when tooling or UI blocks validation.

## Required Future Checks

Done-report validation must reject passed verdicts with V3 blockers.

## Score Caps

- final gate failed but handoff claimed success: max score 2
- final report lacks width sweep evidence: max score 4
- user complaint remains visible: max score 2
