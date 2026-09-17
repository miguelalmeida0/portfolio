# Protected-Zone Failure

## What Failed

Critical text did not have protected zones that the moving media object was forbidden to enter.

## Critical Text In This Case

- display text
- card title: `BRING A CHARGER`
- body copy under the card
- stage labels and CTA-style copy

## Required Protected-Zone Map

| Zone | Element | Rect Source | Forbidden For |
|---|---|---|---|
| headline-zone | display text | `data-protected-text` | moving media |
| card-title-zone | room/station card title | `data-layout-critical` | moving media |
| body-copy-zone | explanatory copy | `data-protected-text` | moving media |
| CTA-zone | action labels | `data-layout-critical` | moving media |

## Hard Rule

Scroll-transformed media cannot cross protected text zones. If it must visually pass nearby, the text needs an intentional readable panel, mask, or lane separation.
