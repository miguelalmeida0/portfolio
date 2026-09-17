# Component Recipes

Build components as contracts. A component is not complete until role, states, tokens, and failure behavior are defined.

## Button

Required variants:

- `primary`: one per zone; strongest action treatment.
- `secondary`: same intent area, lower emphasis.
- `tertiary`: text/ghost for optional actions.
- `icon`: compact tool action; tooltip or accessible label required.
- `danger`: destructive; never used as visual spice.

Required states:

```txt
default, hover, focus-visible, active, disabled, loading
```

Implementation checks:

- Loading state preserves width/height.
- Disabled button remains readable and explains why when blocked by app state.
- Label is a verb phrase: `Run check`, `Copy rewrite`, `Create plan`.
- No button shares the passive tag style.

## Status Tag

Use for read-only state such as `Delayed`, `Draft saved`, `3 conflicts`, `Mock data`.

Implementation checks:

- No pointer cursor.
- No hover transform.
- No `onClick`.
- Color is paired with text or icon, not color alone.
- Text stays readable at 390 px.

## Filter Chip

Use only when the user changes visible results.

Implementation checks:

- Selected state persists after click.
- Hover/focus styles exist.
- `aria-pressed` or equivalent state is used when appropriate.
- It does not look like a status tag.

## Segmented Control

Use for mutually exclusive modes, views, or time ranges.

Implementation checks:

- Exactly one option is selected unless the product supports "none".
- Keyboard navigation works.
- Label width does not shift when selected.
- At 390 px, options either fit or become a scroll/stack pattern.

## Page Shell

Use for app chrome, navigation, and persistent context.

Implementation checks:

- Shell exposes product identity without becoming the main object.
- Main content is not wrapped in a decorative page card.
- Active route is visible.
- Sticky regions reserve space and do not cover content.
- Desktop and mobile navigation are explicitly designed, not left to browser wrapping.

## Hero Object

Use for the first-viewport object that explains the screen.

Implementation checks:

- Contains the primary object name/state.
- Contains or directly points to the primary action.
- Does not rely on a decorative headline alone.
- On mobile, appears before secondary panels.

Examples:

- `StockHeader`: symbol, price, change, recency, add-to-watchlist.
- `RewriteWorkspace`: draft input, voice controls, generate action, output preview.
- `PlanHeader`: event/time/people, confirm or invite action.

## Data Row

Use for lists, tables, feeds, logs, and comparison surfaces.

Implementation checks:

- Primary label and key metric are aligned consistently.
- Numbers use tabular numerals where available.
- Row click behavior is explicit; static rows do not hover like links.
- Source/time/status is present when trust depends on freshness.
- Row actions are visually separate from row selection.

## Card Or Tile

Use only when it frames one repeated object or one compact tool.

Implementation checks:

- One card equals one object or decision.
- No card inside a card unless the inner card is a distinct repeated object.
- Primary card has stronger position, scale, or contrast than supporting cards.
- Desktop data rows do not become bulky cards unless comparison is no longer the task.

## Drawer Or Inspector

Use for detail that supports a selected object without replacing the whole screen.

Implementation checks:

- Triggering object remains visible or return path is obvious.
- Close control is visible and keyboard reachable.
- Drawer has a title matching the selected object.
- Source list keeps selection state.
- Mobile behavior is a route, full-screen drawer, or bottom sheet with safe-area padding.

## Composer And Result

Use for writing, AI generation, editing, upload, or transformation flows.

Implementation checks:

- Input and output can be viewed together on desktop.
- Original input remains recoverable after output appears.
- Primary generation action has loading and error states.
- Output has copy/export/save actions.
- Variants/history are secondary to the current result.

## Empty, Loading, Error

Every data or async component needs these states.

Implementation checks:

- Empty state gives one next action.
- Loading state preserves layout dimensions.
- Error state says what failed and how to recover.
- Serious products use neutral error copy, not cheerful filler.

