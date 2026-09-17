# Navigation Active State Mismatch Failure

## Failure
Clicking a nav item did not select that item. Another item to the right became selected instead.

## Why It Is Broken UX
Navigation state is a contract. If the selected state points to the wrong destination, users lose trust in the interface and route model.

## Detect
- Click every nav item in order.
- Verify the clicked item receives visual active state.
- Verify `aria-current` / `aria-selected` matches the clicked item.
- Verify no adjacent or right-side item receives selection by mistake.

## Fix
Use stable `activeNavId`, unique `data-nav-id`, a single nav config source-of-truth, and shared desktop/mobile state.

## Score Caps
- clicked nav item does not become selected: max score 2
- adjacent/right-side item becomes selected: max score 2
- nav item never receives selected state: max score 2
- visual active state and route target disagree: max score 3
