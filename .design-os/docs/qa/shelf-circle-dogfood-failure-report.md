# Shelf Circle Dogfood Failure Report

## Project
Shelf Circle

## Mode
Mobile product flow / selection-first product

## What Improved
- Practical product direction: the app focused on shared household objects and borrowing/reserving behavior.
- Warmer palette: the screen moved away from generic SaaS color defaults.
- Bottom navigation present: the app attempted a mobile-first navigation structure.
- Real local interactions attempted: chips, item cards, detail sheet, and add actions were represented as interactive product surfaces.

## What Failed
- Modal / sheet vertical fit: the detail sheet opened too low and appeared cut off, making the viewport feel broken and actions feel unsafe.
- Active bars overlapped controls: a decorative/active underline crossed button content and reduced label readability.
- Selected chip state did not persist: selectable object-name chips felt glitchy because selection was not visibly retained.
- Bottom navigation missed icons: product destinations were text-only, reducing scan speed and mobile-native clarity.
- Add-action card looked like an object card: the add-new affordance masqueraded as normal content, making the product model unclear.

## Why These Failures Matter Globally
- Mobile product quality depends on fit, state, and touch clarity before visual taste is even evaluated.
- Bottom sheets, selected chips, bottom nav, and add actions are common product primitives. If they fail once, they will recur across apps unless Design OS blocks them.
- These are usability failures, not aesthetic preferences: a cut-off sheet, nonpersistent selection, or ambiguous add card makes the app harder to operate.
- Mobile UI needs clear icon-supported destinations and safe-area-aware overlays because users navigate by thumb, scan, and repeated use.

## Which Design OS Rules Should Have Caught It
- P0 Layout Integrity should have blocked the cut-off sheet and overlapping control indicator.
- Mobile Navigation Defaults should have blocked weak bottom navigation craft.
- Selection / Gallery / Browse Mode should have required committed selected states.
- Interface Feel rules should have caught missing state persistence and misleading tap feedback.
- Mobile Product Flow Mode should have required safe-area-aware sheets and product-specific navigation.

## New Rules Required
- Modal and bottom sheet fit is non-negotiable.
- Control decoration cannot collide with control content.
- Selectable controls must preserve state.
- Mobile bottom navigation requires icons and labels for practical product apps.
- Add actions must not masquerade as content items.
