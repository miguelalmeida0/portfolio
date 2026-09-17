# Navigation Active State Checklist

Use for every route/chapter/nav system before final handoff.

## Required Checks

- every nav item has unique `data-nav-id`
- every nav item has `data-nav-target` where practical
- active state is keyed by stable id, not fragile index
- click handler passes item id
- visual active state, `aria-current`/`aria-selected`, and data selected hooks agree
- desktop/tablet/mobile variants share the same nav source-of-truth
- exactly one route nav item is active unless multi-select is explicit
- every nav item has been clicked during QA
- mobile bottom nav active state works after scroll

## Blockers

- clicked nav item does not become selected
- adjacent/right-side item becomes selected
- nav item never receives selected state
- route target and active visual state disagree
- active state is inaccessible
- duplicate mobile/desktop state mismatch

## Score Caps

- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- visual active state and route target disagree: max score 3
- active state is inaccessible/no `aria-current`: max score 5
- no click-through QA of every nav item: max score 5
- duplicate mobile/desktop nav state mismatch: max score 4
