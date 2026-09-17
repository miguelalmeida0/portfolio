# App Name Low Contrast On Dark Background

## Failure
The app name `Microclimate` lost readability when placed over darker background colors.

## Why It Fails
Brand chrome is still interface text. It must survive the backgrounds it crosses. A beautiful image or dark band does not excuse a weak wordmark.

## Detection
- Capture all background states behind the app name.
- Check dark, light, image, gradient, and scroll states.
- Verify the app name has a stable readable surface or adaptive color.

## Required Fix
- Move the brand name to a stable region.
- Add a subtle plate/scrim.
- Use adaptive light/dark tokens.
- Add text shadow only if it is restrained and intentional.
- Hide brand chrome if the identity is better carried by the composition.

## Score Caps
- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4
- wordmark contrast depends on lucky crop/scroll position: max score 4
