# Failure Report

## Verdict
Rejected execution, promising visual direction.

## What Worked
- Late Check FM remained directionally stronger than prior tests.
- The brand voice, hostel/radio premise, bold typography, and physical-card energy remained worth preserving.

## What Failed
- `LIVE LOBBY FEED` suggested realtime behavior that did not exist.
- Live/status language functioned as visual garnish instead of product truth.
- The bottom-left video/backplate corner looked like broken layered boxes rather than a designed frame.
- Offset geometry lacked clean radius/edge alignment.
- Clicking some nav icons did not select those exact icons.
- A different item on the right side became selected, revealing a critical state-mapping bug.

## Required Prevention
- No final pass if live/realtime terminology appears without documented live behavior.
- No final pass if offset/backplate geometry has messy exposed corners.
- No final pass if clicking every nav item does not activate that exact item.
- Final UI integrity gate must search fake live copy, inspect layered corners, and test nav active mapping.

## Evidence
Screenshots referenced in Codex chat, not available to filesystem.
