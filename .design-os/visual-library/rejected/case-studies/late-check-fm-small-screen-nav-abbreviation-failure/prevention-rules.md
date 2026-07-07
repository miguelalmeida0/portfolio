# Prevention Rules

## Required

- Define desktop, tablet, and mobile nav variants before implementation.
- Define label/icon behavior and active-state behavior.
- Use icons or a real menu pattern in compact navigation.
- Preserve accessible labels with `aria-label` or screen-reader text.
- Keep hit targets at least 44px where practical.
- Test 1440, 1280, 1024, 768, and 390.

## Hard Bans

- Arbitrary two-letter compact nav labels.
- Hiding full labels without icons.
- Active compact nav item that is not understandable.
- Nav item without a full accessible name.
- Compact nav that looks clipped, broken, or like initials from overflow.

## Score Caps

- compact nav uses arbitrary abbreviations: max score 4
- nav hides full labels without icons: max score 4
- nav icons lack accessible labels: max score 5
- active compact nav item is unclear: max score 5
- nav looks clipped/broken at small width: max score 3
- no small-screen nav variant: max score 5
