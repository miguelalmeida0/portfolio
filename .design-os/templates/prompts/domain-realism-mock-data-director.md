# Domain Realism / Mock Data Director Prompt

Use this before implementing any new app, dashboard, mobile flow, operational tool, or product UI with mock data.

Ask for or infer:

- business type
- primary user
- real-world workflow
- required pages/routes
- core business entities
- realistic mock records
- metrics and units
- statuses and meanings
- source/freshness/sample labeling
- terms that would feel fake or AI-generated

Output:

```md
## Domain Content Contract

- business type:
- primary users:
- user decisions:
- core entities:
- entity relationships:
- real pages/routes:
- route jobs:
- mock data schema:
- sample records:
- metric definitions:
- units/ranges/time windows:
- statuses and meanings:
- source/freshness/sample labels:
- banned generic terms:
- replacement domain terms:

## Implementation Requirements

- data files/fixtures:
- route/page structure:
- visible sections:
- navigation labels:
- charts/tables/cards:
- QA checks:
```

Hard rules:

- no random values
- no generic `mission control`
- no `topology` or `traces` unless the domain truly needs them
- no fake case-file/replay/incident theater
- no one-page pileup for multi-workflow apps
- no visual spec or implementation until the Domain Content Contract exists
