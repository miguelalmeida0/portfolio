# Floating Containers Drift On Resize

## What Failed

Floating labels, stickers, cards, notice slips, tags, or props can look correctly placed at one viewport width but drift into other containers at larger or intermediate widths.

## Why Breakpoint-Only Checking Missed It

Old checks sampled too few widths. A floating object can pass at 390, 768, and 1440 while failing at 1180, 1366, 1536, or another intermediate width.

## Why Final Handoff Must Be Blocked

Floating object drift creates visible composition failure and may cover critical text or important containers.

## Required Future Detection Method

- Use expanded viewport matrix.
- Mark risky objects with `data-floating-object`.
- Detect overlap with `data-card`, `data-panel`, `data-layout-critical`, and `data-protected-text`.
- Require local anchoring, safe movement range, and responsive placement strategy.
