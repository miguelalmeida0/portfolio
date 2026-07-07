# Fake Live UI Slop

## Failure
The UI used `LIVE` / live-feed language without real realtime behavior.

## Why It Feels Like AI Slop
Fake live labels are a common AI-builder shortcut: they create fake energy while promising product behavior that does not exist.

## Detect
- Search visible text for `LIVE`, `live feed`, `realtime`, `real-time`, `online now`, `presence`, `activity feed`, and `streaming`.
- Require `data-live-justified="true"` plus a live source/update cadence when live language appears.

## Fix
Use honest language such as Today, Tonight, Current board, Lobby board, Check-in board, Station board, Field notes, Latest notes, Front desk, House board, or Room board.

## Score Caps
- fake LIVE badge: max score 4
- fake live feed label: max score 3
- fake live icon/dot: max score 3
- fake realtime/presence status: max score 3
