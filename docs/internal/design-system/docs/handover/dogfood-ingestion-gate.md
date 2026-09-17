# Dogfood Ingestion Gate

Every dogfood project must prove it has ingested Miguel Design OS before any application UI is created.

Do not start application UI until Design OS ingestion proof exists in the dogfood project.

## Required Ingestion Steps

Inside the dogfood project, create:

```txt
docs/design-os-ingestion-report.md
```

That report must include:

- Design OS path verified as `/Users/malmeida/Desktop/miguel-design-os`
- `node tools/design-os.mjs doctor` result
- `node tools/design-os.mjs list-skills` result
- confirmation that `HANDOVER_START_HERE.md` was read
- required first-read files inspected
- required Design DNA rules inspected
- approved visual memory inspected
- rejected visual memory inspected
- relevant skills selected
- scroll safety decision
- protected folders or external baselines not touched
- explicit stop/fail status if ingestion is incomplete

## Fail-Closed Rule

If any of these fail, stop before UI:

- Design OS path is wrong
- `HANDOVER_START_HERE.md` is missing
- doctor fails
- skill listing fails
- required rules cannot be read
- approved/rejected memory cannot be inspected
- scroll safety decision is missing
- the ingestion report cannot be created inside the dogfood project

## Prompt

Use:

- `templates/prompts/dogfood-design-os-ingestion-gate.md`
