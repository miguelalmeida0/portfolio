# Failure Report

## Summary

Late Check FM / Bunk Radio kept a promising Gen-Z hostel concept, but the repair preserved the video object at the expense of the page. The media became a persistent overlay, crossed content sections, and forced cards into skinny unreadable columns.

## Failure Class

- Persistent media overlay without a reserved lane.
- Media over text and cards.
- Content containers thinned to fit a media object.
- Scroll choreography preserved a gimmick over usability.
- Layout integrity failed at intermediate and final scroll states.

## Why It Fails

The video was treated as the primary object across the entire experience, even after the hero stage. That made the rest of the page work around the video instead of around readable hostel room and event content.

## Required Repair Direction

- Make the video hero-only by default.
- After the hero, remove it, dock it into a reserved media card, or replace it with a static thumbnail.
- Restore content cards to readable widths.
- Define protected text zones and a media movement map before any scroll choreography.
- Capture scroll-state screenshots after implementation.
