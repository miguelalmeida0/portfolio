# Service Floor Desktop Product Failure

## Why Rejected

Service Floor is rejected because the desktop product surface failed product fit and interaction truth. It used a random dark hospitality-ish palette, let floor-map table containers collide with section labels and server names, changed navigation selected state without changing visible content, and collapsed into generic dark dashboard/card soup instead of a premium restaurant operations command surface.

This is a global Design OS failure, not only a Service Floor issue. Future desktop product agents must prove that palette, navigation, spatial labels, and primary-object hierarchy fit the product domain before visual approval.

## Screenshots

| Filename | Failure Shown | Why Rejected | Correction Principle | Mapped Rule | Scorecard Cap |
| --- | --- | --- | --- | --- | --- |
| `screenshots/service-floor-random-domain-palette-map-label-collision.png` | Random domain palette, floor-map label collisions, generic dashboard/card soup | The product should feel like a hospitality operations surface, but the palette and panels feel arbitrary; the floor map is buried under cards and labels are not protected. | Choose a domain-fit palette and make the floor map the central product object with safe zones for spatial labels. | Domain Palette Fit; Spatial Labels Need Protected Zones; Desktop Command Surface Must Not Collapse Into Card Soup | random domain palette max 5; spatial label collision max 4; generic card-soup regression max 5 |
| `screenshots/service-floor-map-label-collision-closeup.png` | Table container overlaps the `Window` section label and server text | Floor-plan labels must remain readable because they define the spatial model. | Reserve label safe zones, offset table objects, fade labels only when intentionally secondary, or convert to layered map labels with clear z-index rules. | Spatial Labels Need Protected Zones | spatial label collision max 4 |
| `screenshots/service-floor-placebo-navigation-no-content-change.png` | `Kitchen` nav appears active while the visible screen remains the same floor view | This is placebo navigation: the control changes its active look but not the product state. | Tabs/nav must switch visible content, route, panel scope, or data filter; otherwise remove or disable the control. | No Placebo Navigation | placebo navigation max 3 |

## Correction Principles

- Palette must fit the domain, task pressure, environment, and user state; "cool" colors are not enough.
- In spatial UIs, labels need protected zones so objects, glows, cards, and map items do not cover section words or names.
- Clickable navigation must change visible state, route, scope, or content. Active styling alone is a hard failure.
- Desktop command surfaces need one central product object. For Service Floor, the floor map is the product object; side panels support it, they do not replace it.
- Hospitality operations should feel warm, legible, and action-oriented under pressure, not like a generic dark dashboard with restaurant copy.

## Rules This Should Catch

- Domain Palette Fit.
- No Placebo Navigation.
- Spatial Labels Need Protected Zones.
- Desktop Command Surface Must Not Collapse Into Card Soup.
- P0 Layout Integrity.
- Dashboard / Command Center Mode.
- Human Palette Direction.
- Primary object and primary action clarity.

## Scorecard Caps

- Random domain palette: max score 5.
- Placebo navigation: max score 3.
- Spatial label collision: max score 4.
- Generic card-soup regression in desktop command surface: max score 5.
- Primary product object buried by support panels: max score 5.
- Active nav state changes without visible content/state change: max score 3.

