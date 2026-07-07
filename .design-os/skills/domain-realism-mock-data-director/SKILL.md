# domain-realism-mock-data-director

## Name

domain-realism-mock-data-director

## Description

Plan and review domain-realistic app structure, business entities, pages/routes, mock data, metrics, statuses, and section labels before UI implementation.

## Purpose

Use this skill to stop AI-generated apps from shipping vague `mission control`, `topology`, `traces`, fake IDs, random metrics, or generic sections that do not belong to the actual business.

Every generated product UI must feel like a real app for that domain.

## Use When

- Creating a new app, dashboard, product UI, mobile flow, or dogfood project.
- The app uses mock data, sample data, metrics, tables, cards, charts, operational states, or route navigation.
- A concept names a business such as hostel, restaurant, clinic, gym, studio, marketplace, school, venue, logistics, finance, support, retail, SaaS, or dashboard.
- Migi complains about random values, generic sections, `mission control`, `topology`, `traces`, fake case files, fake replay language, or unclear app pages.
- The UI needs real pages/routes for multiple user workflows.

## Do Not Use When

- A tiny static landing page has no product data, app routes, metrics, or mock records.
- The task is a narrow bug fix that does not touch content, page structure, or data.
- Migi explicitly requests abstract placeholder scaffolding and it is clearly labeled as a throwaway wireframe.

## Files To Read

- `design-dna/domain-realism-and-mock-data-rules.md`
- `design-dna/no-ai-theater-chrome-rules.md`
- `design-dna/new-app-generation-rules.md`
- `design-dna/00_COMPACT_AGENT_CONTEXT.md`
- `templates/checklists/domain-realism-mock-data-checklist.md`
- `evaluation/ui-scorecard.md`

## Required Output Before Implementation

Produce a Domain Content Contract:

```md
## Domain Content Contract

- business type:
- primary users:
- user decisions:
- core entities:
- entity relationships:
- real pages/routes:
- route jobs:
- mock data files or fixtures:
- mock data schema:
- sample records:
- metric definitions:
- units/ranges/time windows:
- statuses and meanings:
- source/freshness/sample labels:
- banned generic terms:
- replacement domain terms:
- QA checks:
```

## Workflow

1. Identify the business domain and actual user.
2. List the real entities a human product designer would expect.
3. Split workflows into real pages/routes when the product has more than one job.
4. Define what each route helps the user decide or do.
5. Define mock records with plausible names, quantities, units, timestamps, statuses, prices, locations, owners, or durations.
6. Define metrics only when they answer a real user question.
7. Replace generic theater terms with domain language.
8. Mark sample/demo data truthfully.
9. Verify navigation labels map to real tasks.
10. Send dashboards through chart/data-viz skills only after the data contract is real.

## Domain Examples

Hostel app:

- Rooms, beds, bookings, guests, check-in, checkout, rates, floors, housekeeping, maintenance, events, staff notes, reviews.
- Routes: Rooms, Bookings, Guests, Housekeeping, Events, Maintenance, Rates.

Restaurant app:

- Menu items, pizzas, burgers, vegetables, ingredients, allergens, tables, reservations, kitchen tickets, orders, inventory, suppliers.
- Routes: Menu, Orders, Tables, Reservations, Kitchen, Inventory, Suppliers.

Dashboard app:

- Real KPIs, queues, incidents, owners, SLAs, costs, cohorts, segments, time ranges, charts, drilldowns, actions.
- Routes must follow real work: Overview, Queue, Customers, Orders, Inventory, Incidents, Reports, Settings, or domain-specific equivalents.

## Hard Bans

- Random values without units or source.
- Placeholder metrics that do not drive decisions.
- `Mission Control`, `Mission Room`, `Control Room`, `Command Center`, `Topology`, `Traces`, or `System Map` unless the domain truly needs them.
- Fake case files, fake replay doctrine, fake incident theater, or dramatic labels where real business sections should exist.
- One huge page crammed with unrelated workflows.
- Navigation labels that sound cool but do not name user tasks.
- Mock data that lives only as hardcoded decorative text inside components when meaningful data exists.

## Stop Conditions

- Stop if a new app has no Domain Content Contract.
- Stop if a dashboard has no data contract, metric definitions, or route jobs.
- Stop if a business app does not use business-specific entities.
- Stop if route/page labels are generic theater instead of real tasks.
- Stop if numbers appear without plausible units, ranges, time windows, or source/freshness.

## Scorecard Caps

- no Domain Content Contract before implementation: max score 4
- random mock values with no units/ranges/source: max score 3
- generic mission/control/command label with no real user job: max score 3
- topology/traces/system map outside justified domain: max score 4
- multi-workflow app has no real pages/routes: max score 4
- dashboard has abstract metrics and no real entities/user decisions: max score 3
- mock data lacks units/statuses/ranges/timestamps/source: max score 5
- route labels do not match business tasks: max score 4

## Self-Correction Contract

If this skill finds a P0/P1 issue, create a repair task with:

- owner skill
- target artifact or selector
- exact data/route/content fix
- acceptance check
- screenshot or report evidence needed to close it
