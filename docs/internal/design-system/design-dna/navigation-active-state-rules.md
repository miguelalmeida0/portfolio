# Navigation Active State Correctness

Every navigation item must have correct click-to-active-state behavior.

When a user clicks or taps a nav item, that exact item must become active/selected.

## Hard Blockers

- clicked nav item does not become selected
- adjacent nav item becomes selected instead
- item to the right becomes selected instead
- two nav icons never receive active state
- active background/color is applied to the wrong nav item
- route/section changes but active nav indicator points elsewhere
- active state is based on unstable array index after filtering/reordering
- mobile and desktop nav have different incorrect active mappings
- icon-only nav has no visible active state
- selected state updates visually but `aria-current`/`aria-selected` does not
- `aria-current`/`aria-selected` updates but visual state does not

## Required

- active state must be keyed by stable item id, not fragile index
- every nav item must have a unique id
- click handler must pass that item id
- route/section target must match that item id
- visual active state, `aria-current`/`aria-selected`, and selected data attribute must agree
- compact/mobile nav and desktop nav must use the same source-of-truth
- every nav item must be manually or automatically clicked during QA
- first, last, and edge nav items must be included in click-through QA
- labels such as Booking, Book, Settings, Profile, Archive, and other trailing items must not be skipped
- exactly one route nav item should be active at a time unless explicitly multi-select

## Required Hooks

- `data-nav-item`
- `data-nav-id`
- `data-nav-target`
- `data-nav-active`
- `data-nav-selected`
- `data-nav-testid` where practical
- `aria-current="page"` or `aria-selected="true"` for active item

## Implementation Guidance

- prefer `activeNavId` over `activeIndex`
- if using index, prove the rendered array cannot reorder/filter/change
- never derive active state from DOM position
- never duplicate mobile/desktop nav state separately
- use one navigation config as source-of-truth

## QA Requirement

Click every nav item in order and verify:

- the clicked item receives active background/color
- no adjacent item receives active state incorrectly
- first and last nav items can become active
- no item is unreachable by active state
- `aria-current`/`aria-selected` matches the clicked item
- target section/route matches clicked item
- mobile bottom nav works while scrolled
- desktop/tablet/mobile variants all match

## Score Caps

- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- first/last nav item never receives selected state: max score 2
- visual active state and route target disagree: max score 3
- active state is inaccessible/no `aria-current`: max score 5
- no click-through QA of every nav item: max score 5
- duplicate mobile/desktop nav state mismatch: max score 4
