# Fake Live UI Affordances

## What The Failure Is
The UI displays `LIVE`, live feed, realtime, presence, online, pulsing dot, recording, or activity badges without real live behavior.

## Why It Feels Like AI Slop
It pretends static content is operationally alive. This creates fake product energy and misleads users about the system.

## How To Detect
- Search visible text for live/realtime/presence/activity terms.
- Inspect badges, dots, tickers, and status chips.
- Require `data-live-justified="true"` plus live source/update cadence.

## How To Fix
Replace fake live language with honest board/state language: Today, Tonight, Current board, Lobby board, Check-in board, Station board, Front desk, House board, or Room board.

## Score Caps
- fake LIVE badge: max score 4
- fake live feed label: max score 3
- fake live icon/dot: max score 3
- fake realtime/presence status: max score 3

## Required Future Checks
- visible-copy scan before handoff
- documented live data source when live language appears
- stale/offline fallback when realtime is real
