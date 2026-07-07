# Clickable Vs Static Rules

Every visible element must declare one interaction role. This prevents chip soup, fake buttons, and unclear rows.

## Role Map

Use these roles in component names, props, or comments when the distinction is unclear:

```txt
action      performs a command
navigation  changes route/location
selection   changes current object or mode
filter      changes visible results
input       accepts user data
status      reports state, read-only
metadata    describes an object, read-only
decoration  visual support only
```

## Implementation Rules

Clickable roles must have:

- semantic element where possible: `button`, `a`, `input`, `select`
- accessible name
- hover style on pointer devices
- focus-visible style
- active/pressed feedback
- disabled state when unavailable
- selected/current state when persistent

Static roles must not have:

- `cursor: pointer`
- hover lift
- `onClick`
- `tabIndex=0`
- button-like fill/contrast
- command verbs as labels

## Required Audit

Before finishing, inspect the DOM or component tree and answer:

1. Which elements use `onClick`?
2. Do all `onClick` elements look interactive before hover?
3. Which pills/tags are read-only?
4. Do read-only pills avoid hover, pointer cursor, and button contrast?
5. Are selected states different from hover states?
6. Can keyboard users see focus on all controls?

## Component Decisions

Use `Button` for commands:

- `Create plan`
- `Run check`
- `Copy rewrite`
- `Save setting`

Use `Link` for navigation:

- `View case study`
- `Open report`
- `Back to watchlist`

Use `FilterChip` for result filtering:

- `Active`
- `Delayed`
- `Owned`

Use `StatusTag` for read-only state:

- `Draft saved`
- `Market data delayed`
- `Mock data`
- `3 conflicts`

Use `MetadataLabel` for read-only descriptors:

- `Updated 2 min ago`
- `Source: SEC filing`
- `Owner: Design`

## Screenshot Checks

At 390, 768, and 1440 px:

- Primary action is visible without reading every label.
- Passive tags do not visually compete with primary/secondary actions.
- A row hover style appears only when row click/selection exists.
- Focus ring is not clipped by overflow containers.
- Selection-first objects have a visible hover and selected reward that clarifies selection, not decorative motion.
- Text, badges, controls, stats, and labels do not overlap or collide inside clickable cards.

## Motion Rule

Motion on interactive elements is allowed only when it clarifies selection, hover, state change, transition, hierarchy, progress, spatial relationship, or user feedback.

If motion does not clarify one of those, remove it.
