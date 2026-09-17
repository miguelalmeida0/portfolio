# Service Floor Desktop Product Failure Report

## Project
Service Floor

## Mode
Desktop product / hospitality operations command surface

## Why It Failed
Service Floor failed because it did not behave like a premium restaurant operations surface. The product object should have been the floor map and service state, but the UI leaned on generic dark-dashboard furniture, arbitrary color, and panel/card structure.

## Observed Failures

- Palette felt random for a restaurant/service operations app.
- Floor map containers overlapped section labels and server names.
- Top navigation changed active visual state but did not change visible content.
- The app regressed into generic dark dashboard/card soup instead of a hospitality command surface.

## Why These Failures Matter Globally

- Palette is not decoration. It must fit the domain, user environment, task pressure, and emotional state.
- Spatial UIs depend on readable labels. If a map/floor-plan label is covered, the core model breaks.
- Navigation cannot be theater. If a tab changes selected styling but the product state is unchanged, trust drops immediately.
- Desktop command surfaces need a primary product object. Cards and panels support the object; they must not replace it.

## Rules That Should Have Caught It

- Human Palette Direction should have rejected a machine-looking random palette.
- P0 Layout Integrity should have caught map-label collisions.
- Dashboard / Command Center Mode should have protected the central command object.
- Interaction Grammar should have caught active navigation with no visible state change.

## New Rules Required

1. Domain Palette Fit.
2. No Placebo Navigation.
3. Spatial Labels Need Protected Zones.
4. Desktop Command Surface Must Not Collapse Into Card Soup.

## Screenshots Saved

- `visual-library/rejected/case-studies/service-floor-desktop-product-failure/screenshots/service-floor-random-domain-palette-map-label-collision.png`
- `visual-library/rejected/case-studies/service-floor-desktop-product-failure/screenshots/service-floor-map-label-collision-closeup.png`
- `visual-library/rejected/case-studies/service-floor-desktop-product-failure/screenshots/service-floor-placebo-navigation-no-content-change.png`

## Scorecard Caps Added

- Random domain palette: max score 5.
- Placebo navigation: max score 3.
- Spatial label collision: max score 4.
- Generic card-soup regression in desktop command surface: max score 5.
- Primary product object buried by support cards/panels: max score 5.

## Final Verdict

Rejected global case study. Service Floor should become negative evidence for domain palette fit, real navigation state change, spatial label safe zones, and primary-object command-surface hierarchy.

