# Brand Chrome Readability

App names, logos, wordmarks, initials, and persistent brand chrome must remain readable over every background state where they appear.

Brand chrome is not exempt from contrast rules.

## Hard Blockers

- app name struggles against a dark background
- app name sits over variable image/video/gradient/color without a contrast strategy
- wordmark contrast depends on a lucky crop or scroll position
- brand text crosses from light to dark background without adaptive treatment
- brand chrome is placed over busy imagery with no plate, mask, scrim, or relocation
- forced app name is included even though it cannot be kept readable
- app name readability fails in screenshot review

## Required

- define whether visible brand chrome is needed at all
- if used, assign a stable background/readability strategy
- test dark, light, image, video, gradient, and scroll states where applicable
- use adaptive foreground tokens when background changes
- use a restrained plate/scrim/mask when needed
- move or remove brand chrome if it weakens the composition
- add `data-brand-chrome` or `data-app-name` where practical
- add `data-brand-contrast-safe="true"` only after proof

## Allowed Strategies

- stable header/brand surface
- subtle brand plate
- image crop safe zone
- adaptive light/dark foreground token
- restrained text shadow for image backgrounds
- scrim/mask behind brand area
- no persistent wordmark when identity lives in the composition

## Score Caps

- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4
- wordmark contrast depends on lucky crop/scroll position: max score 4
- no brand chrome contrast proof: max score 5
- forced app-name chrome remains despite readability failure: max score 3
