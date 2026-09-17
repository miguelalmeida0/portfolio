# Failure Report

## Verdict
Rejected execution pattern.

## What Failed
- The Booking nav item did not become selected.
- Nav QA failed to prove every item could receive active state.
- The app name `Microclimate` became hard to read over darker background colors.
- The wordmark sat on a variable image/color field with no plate, scrim, contrast token, or relocation strategy.

## Required Prevention
- Click every nav item and verify the clicked item becomes active.
- Require edge-item QA for first and last nav items.
- Use stable nav ids, not indexes.
- Do not place app names/wordmarks directly over unstable backgrounds without a readability strategy.
- Brand chrome must pass contrast/readability in all background states where it appears.

## Evidence
- `screenshots/booking-nav-item-never-selected.png`
- `screenshots/app-name-low-contrast-dark-background.png`
