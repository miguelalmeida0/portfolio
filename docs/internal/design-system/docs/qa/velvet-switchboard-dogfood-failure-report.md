# Velvet Switchboard Dogfood Failure Report

## Project
Velvet Switchboard

## Mode
Artistic / editorial / landing page.

## What Improved

- Stronger typography than earlier generic landing outputs.
- Stronger image atmosphere.
- Stronger palette direction.
- Less default container gravity than previous runs.

## What Failed

- Navigation readability over scroll states was not protected.
- App/logo/name chrome was still forced into the UI.
- Decorative separator lines appeared above labels and sections.

## Why These Failures Matter Globally

Navigation can be creative, floating, spatial, or image-integrated, but it still has to survive the background it sits on. If nav becomes unreadable over giant type, image crops, dark/light transitions, or scroll-state changes, the page fails before taste is evaluated.

Forced logo or app-name chrome is a template habit. Migi often wants identity to live in the composition, not in a persistent logo-left or app-name chip at the top of the UI.

Tiny separator lines, red hairlines, label rails, and ornamental ticks are recurring AI-builder tells. They rarely add structure and often create fake editorial seriousness.

## Rules That Should Have Caught It

- Navigation Art Direction should have required background-state readability.
- No generic navbar gravity should have blocked forced logo-left/app-name behavior.
- Anti-AI-Tell preflight should have flagged decorative section-label ornaments.
- Screenshot scorecard should have inspected scroll-state readability, not only the first static viewport.

## New Rules Required

- Navigation Must Survive Its Background.
- No Forced App Name / Logo Chrome.
- No Decorative Separator Ornaments.
- No Decorative Orbital / Circular Line Overlays, because the same AI-decoration failure family appears as fake orbit/HUD/radar graphics in many generated interfaces.

## Design OS Patch

These failures should become global rules, scorecard caps, visual-spec requirements, prompt hard bans, and skill stop conditions. They are not project-specific taste notes.
