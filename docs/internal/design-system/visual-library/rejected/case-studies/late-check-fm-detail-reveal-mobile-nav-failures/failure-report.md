# Failure Report

## Verdict
Rejected UX execution, promising visual direction.

## What worked
- Late Check FM had a stronger visual direction than prior tests.
- The broadcast/hostel concept, physical cards, and bold voice remained worth preserving.
- The issue was not the concept; the issue was interaction geography and mobile route access.

## What failed
- Clicking a card opened a detail panel far away from the selected object.
- The selected trigger and revealed content did not share a visible zone, connector, animation, or selected-state relationship.
- The detail reveal felt like an unrelated panel on the page rather than a response to the selected card.
- Mobile route navigation appeared at the top and disappeared when the user scrolled.
- Route access was not thumb-reachable or persistent on compact screens.
- Scroll-heavy mobile users lost access to primary movement controls.

## Required prevention
- Add an anchored detail reveal rule and checklist.
- Require `data-detail-trigger`, `data-detail-panel`, and `data-detail-for` hooks for testable detail interactions.
- Require selected trigger state, focus behavior, close behavior, mobile behavior, and accessibility behavior for all detail reveals.
- Use persistent bottom navigation by default for mobile app-like, route-based, scroll-heavy, and interactive experiences.
- Block final handoff when selected details are spatially lost or mobile route navigation disappears on scroll.

## Evidence
Screenshots referenced in Codex chat, not available to filesystem.
