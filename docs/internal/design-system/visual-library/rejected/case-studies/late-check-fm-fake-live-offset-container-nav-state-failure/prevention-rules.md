# Prevention Rules

## No Fake Live
- Do not use `LIVE`, live feed, realtime, presence, or activity language without real live behavior.
- Require documented data source and update cadence.
- Replace fake live labels with honest board/station/current-state language.

## Offset Container Alignment
- Define offset direction and amount.
- Use matching radius tokens.
- Inspect all four corners.
- Block messy exposed corners and accidental backplate leaks.

## Navigation Active State Correctness
- Active state must be keyed by stable item id.
- Every nav item must have a unique id.
- Visual active state and aria state must agree.
- Click every nav item during QA.
- Block off-by-one or adjacent/right-side active state bugs.
