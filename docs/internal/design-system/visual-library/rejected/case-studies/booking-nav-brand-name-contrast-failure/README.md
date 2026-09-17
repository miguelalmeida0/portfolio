# Booking Nav And Brand Name Contrast Failure

## Verdict
Rejected execution pattern.

## What Failed
- Booking navigation item never showed selected/active state.
- A route item could be clicked but never looked selected.
- The app name/wordmark struggled badly against darker background colors.
- Brand chrome was placed over a variable/dark image/color field without a stable readability strategy.

## Required Future Prevention
- Every nav item, including first/last edge items such as Booking, must become active when clicked.
- Active state QA must click every nav item, not only the first few.
- App/brand names over imagery, dark bands, gradients, or changing backgrounds need a stable contrast strategy.
- If the background changes behind brand chrome, use a plate, scrim, mask, inversion, relocation, or tokenized contrast mode.

## Evidence
- `screenshots/booking-nav-item-never-selected.png`
- `screenshots/app-name-low-contrast-dark-background.png`
