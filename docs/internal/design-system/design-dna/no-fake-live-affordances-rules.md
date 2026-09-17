# No Fake Live Affordances

Do not use `LIVE`, `live feed`, `live lobby feed`, `live activity`, `real-time`, `online now`, pulsing live dots, recording-style indicators, fake tickers, fake presence states, or fake activity badges unless the UI is backed by actual live/realtime behavior.

`LIVE` is allowed only if at least one is true:

- there is real realtime data
- there is a live stream
- there is websocket/SSE/polling behavior
- there are actual timestamps updating
- there is real presence/activity state
- the product requirement explicitly asks for live status
- there is a documented data source and update cadence

## Hard Blockers

- decorative `LIVE` badge with no live data
- fake `live feed` label on static content
- fake pulsing live dot
- fake online/presence status
- fake realtime activity label
- fake notification/activity ticker
- `live` used only because it sounds cool
- live terminology used as visual garnish

## Use Instead

- Today
- Tonight
- Now showing
- Current board
- Lobby board
- Check-in board
- Station board
- Field notes
- Latest notes
- Front desk
- Tonight downstairs
- House board
- Room board

## Required Proof

When live language appears, document:

- data source
- update cadence
- realtime mechanism or polling behavior
- visible timestamp/update behavior
- fallback when data is stale/unavailable

Expected hooks:

- `data-live-justified="true"`
- `data-live-source`
- `data-update-cadence`
- `data-realtime-source`

## Score Caps

- fake LIVE badge: max score 4
- fake live feed label: max score 3
- fake live icon/dot: max score 3
- fake realtime/presence status: max score 3
- no justification for live terminology: max score 5
- repeated fake activity language: max score 3
