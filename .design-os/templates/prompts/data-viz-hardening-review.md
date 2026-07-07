# Data Viz Hardening Review Prompt

Work in:
`{{PROJECT_PATH}}`

Target visualization(s):
`{{TARGET}}`

Evidence:
`{{SCREENSHOTS_OR_SOURCE}}`

Use:

- `skills/data-viz-hardening-review/SKILL.md`
- `templates/checklists/visualization-qa-checklist.md`

Produce:

- hardening audit table
- edge-case test matrix for long labels, missing values, many items, no data, async states, narrow widths, 200% zoom, high contrast, reduced motion, and keyboard navigation
- concrete required fixes
- final visualization hardening verdict

Do not accept clipped labels, broken legends, tooltip overflow, color-only status, or missing states.
