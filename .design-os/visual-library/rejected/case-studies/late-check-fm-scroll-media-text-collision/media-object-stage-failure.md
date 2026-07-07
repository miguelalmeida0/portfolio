# Media Object Stage Failure

## What Failed

The media object was treated as an expressive layer rather than a staged interface object with a lane, bounds, state map, and collision rules.

## Required Media Stage Model

- media role: video object / broadcast tile
- start rect
- end rect
- media lane
- forbidden overlap zones
- crop and aspect-ratio behavior
- z-index rules
- responsive fallback
- reduced-motion fallback

## Bad Practice Captured

The video appears above readable content by z-index and covers text instead of docking in a reserved media lane.

## Required Fix

Define a protected media lane or make the text sit on an intentional readable surface. Do not solve by hiding text, clipping content, or relying on z-index alone.
