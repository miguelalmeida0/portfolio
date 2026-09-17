# Nav Active State Mismatch

## What The Failure Is
The active/selected state points to a different nav item than the one the user clicked.

## Why It Is Broken UX
Navigation is a control system. Wrong active state makes route feedback untrustworthy and can hide the user's current location.

## How To Detect
- Click every nav item.
- Verify the clicked item receives selected visual state.
- Verify `aria-current`/`aria-selected` agrees.
- Verify exactly one route item is active unless multi-select is explicit.

## How To Fix
Use stable `activeNavId`, unique `data-nav-id`, shared nav config, and one active state source across desktop/tablet/mobile.

## Score Caps
- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- visual active state and route target disagree: max score 3

## Required Future Checks
- click-through QA of every nav item
- aria/visual state agreement
- mobile bottom nav active test after scroll
