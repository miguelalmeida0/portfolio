# Nav Item Never Selected

## What Failed
A navigation item can be clicked but never receives selected/active state.

## Why It Is Broken UX
The route control lies about the user's action. Edge items such as Booking are often missed when QA only clicks the first few nav items.

## How To Detect
- Click every nav item in order.
- Include first and last nav items.
- Compare clicked `data-nav-id` with active `data-nav-id`.
- Verify visual active state and aria/data active state agree.

## How To Fix
- Use `activeNavId`, not fragile `activeIndex`.
- Give every item a unique `data-nav-id`.
- Use one nav config for desktop and mobile.
- Add click-through QA proof.

## Score Caps
- clicked nav item does not become selected: max score 2
- nav item never receives selected state: max score 2
- no click-through QA of every nav item: max score 5
