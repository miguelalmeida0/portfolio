# Offset Container Alignment

Layered containers, offset shadows, backing cards, backplates, framed media, stacked panels, and object-behind-object compositions must be geometrically intentional.

Offset/backplate effects are allowed only when:

- offsets are consistent
- border radii align
- exposed corners look deliberate
- backing layer does not create messy accidental fragments
- parent/child corners are visually resolved
- backing layer follows the front layer's shape
- visible offset is balanced on intended sides
- construction looks designed at every viewport

## Hard Blockers

- messy exposed corner
- backing layer radius does not match front layer
- backing layer sticks out on a single accidental corner
- offset shadow/backplate looks like layout bug
- video/media frame corner looks broken
- backplate and foreground container are not aligned
- offset layer creates awkward notch or broken corner
- offset container changes from clean to messy after resize
- backing layer leaks because parent overflow/radius is wrong

## Required

- if a backplate is used, define offset direction and offset amount
- use shared radius tokens or matching CSS variables
- apply overflow clipping intentionally
- test corners at all breakpoints
- inspect all four corners of media containers
- avoid large radius foreground over square backing unless intentionally designed
- add `data-layered-container` where practical
- add `data-backplate` where practical
- add `data-frontplate` where practical

## Score Caps

- messy exposed backing corner: max score 4
- misaligned media backplate: max score 3
- mismatched radius causing broken corner: max score 3
- offset layer looks accidental: max score 4
- no corner inspection for layered media: max score 5
