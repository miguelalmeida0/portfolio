# Production Hardening Review Prompt

Work in:
`{{PROJECT_PATH}}`

Target screen/component:
`{{TARGET}}`

Data model / API states:
`{{DATA_MODEL_OR_API_STATES}}`

Supported breakpoints:
`{{BREAKPOINTS}}`

Supported locales:
`{{LOCALES}}`

Source/screenshot evidence:
`{{SOURCE_OR_SCREENSHOTS}}`

Use `skills/production-hardening-review/SKILL.md`.

Produce:

- production readiness verdict
- hardening audit table
- edge-case test matrix
- domain realism review: realistic business entities, sample records, units/ranges/statuses/source labels, and route/page jobs
- concrete code/layout fixes
- empty/loading/error state review
- i18n checklist
- accessibility checklist
- responsive/performance/network resilience notes

Do not run this during Fast Direction Gate.
