# Brand Chrome Readability Checklist

Use when an app name, wordmark, initials, logo text, or persistent brand chrome appears over any non-stable background.

## Required Checks

- visible brand chrome is justified
- dark background states checked
- light background states checked
- image/video background states checked
- gradient/scroll-changing states checked
- contrast/readability strategy defined
- brand chrome does not depend on a lucky crop
- `data-brand-chrome` or `data-app-name` used where practical
- `data-brand-contrast-safe="true"` used only after proof

## Accepted Strategies

- stable header/brand surface
- subtle brand plate
- image crop safe zone
- adaptive light/dark foreground token
- restrained text shadow for image backgrounds
- scrim/mask behind brand area
- no persistent wordmark when identity lives in the composition

## Blockers

- app name unreadable over dark/variable background
- brand chrome over image/background without contrast strategy
- wordmark contrast depends on lucky crop/scroll position
- no brand chrome contrast proof
- forced app-name chrome remains despite readability failure

## Score Caps

- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4
- wordmark contrast depends on lucky crop/scroll position: max score 4
- no brand chrome contrast proof: max score 5
- forced app-name chrome remains despite readability failure: max score 3
