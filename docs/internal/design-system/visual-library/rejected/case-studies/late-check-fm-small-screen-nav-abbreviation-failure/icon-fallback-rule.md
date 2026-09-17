# Icon Fallback Rule

## Preferred Icon Sources

- Material Symbols / Material Icons when available.
- Existing project icon system if already installed.
- Inline SVG icons with Material-style clarity if no icon package is available.
- Lucide or another approved icon set only if already part of the project.

## Late Check FM Station Icon Mapping

- check-in: `login`, `meeting_room`, `key`
- wall: `dashboard`, `view_quilt`, `article`
- beds: `bed`
- now/tonight: `schedule`, `event`
- rules: `rule`, `checklist`
- book: `calendar_month`, `shopping_bag`, `confirmation_number`

## Required Accessible Pattern

Use the icon for recognition and preserve the full destination name in `aria-label` and screen-reader text. Show the active full label when possible.
