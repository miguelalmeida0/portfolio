# Offset Container Alignment Checklist

Use for layered containers, offset shadows, backing cards, backplates, framed media, stacked panels, and object-behind-object compositions.

## Required Checks

- offset direction defined
- offset amount defined
- frontplate/backplate radii align
- all four corners inspected
- backplate follows frontplate shape
- overflow clipping is intentional
- exposed corners look deliberate
- resize behavior remains clean
- `data-layered-container` used where practical
- `data-frontplate` used where practical
- `data-backplate` used where practical

## Blockers

- messy exposed corner
- backing layer radius does not match front layer
- backing layer sticks out on a single accidental corner
- offset shadow/backplate looks like layout bug
- media frame corner looks broken
- offset layer creates awkward notch or leak

## Score Caps

- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- mismatched radius causing broken corner: max score 3
- offset layer looks accidental: max score 4
- no corner inspection for layered media: max score 5
