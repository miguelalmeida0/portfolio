# Brand Name Low Contrast On Dark Backgrounds

## What Failed
The app name or wordmark is placed over a dark background region and becomes hard to read.

## Why It Feels Weak
Brand chrome is still UI text. If it struggles against the background, the page feels unfinished and unreliable.

## How To Detect
- Inspect every background state behind the app name.
- Test dark bands, images, gradients, video, and scroll states.
- Check contrast/readability, not just style.

## How To Fix
- Move the wordmark to a stable surface.
- Add a subtle plate/scrim.
- Use adaptive light/dark wordmark tokens.
- Hide redundant brand chrome if the composition already carries identity.

## Score Caps
- app name unreadable over dark/variable background: max score 3
- brand chrome over image/background without contrast strategy: max score 4
- wordmark contrast depends on lucky crop/scroll position: max score 4
