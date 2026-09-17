# Off-By-One Navigation Selection

## What The Failure Is
Clicking a nav item selects a neighboring item because active state is mapped by fragile index or DOM position.

## Why It Is Broken UX
It shows the route model is not trustworthy. The UI appears functional until the user interacts, then the control points somewhere else.

## How To Detect
- Click items in order.
- Compare clicked `data-nav-id` to active `data-nav-id`.
- Watch for the item to the right becoming selected.

## How To Fix
Key active state by stable id. Do not derive active state from DOM index after filtering, sorting, or responsive duplication.

## Score Caps
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- no click-through QA of every nav item: max score 5

## Required Future Checks
- automated or manual nav click-through
- stable id audit
- desktop/mobile shared source-of-truth review
