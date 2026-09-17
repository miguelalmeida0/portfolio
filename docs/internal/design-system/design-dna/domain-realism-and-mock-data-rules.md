# Domain Realism And Mock Data

Every app Design OS generates must feel like it belongs to a real business, product, service, place, or workflow.

The UI must be built from real domain objects and plausible mock records, not abstract agent theater.

## Hard Rule

Before visual spec or implementation, define a Domain Content Contract:

- business type
- primary users
- core entities
- real page/route map
- route jobs
- mock data schema
- sample records
- units, ranges, statuses, timestamps, locations, categories, owners, prices, quantities, or durations as relevant
- relationships between entities
- source/freshness/sample labeling
- interactions that change visible product state

No Domain Content Contract means no production-quality app implementation.

## Required Domain Specificity

If the app is about a hostel, use hostel concepts:

- rooms
- beds
- bookings
- guests
- check-in and checkout
- rates
- locations or floors
- housekeeping
- maintenance
- events
- staff notes
- reviews

If the app is about a restaurant, use restaurant concepts:

- menu categories
- dishes such as pizza, burgers, bowls, vegetables, drinks, desserts, or specials as appropriate
- ingredients
- allergens
- tables
- reservations
- orders
- kitchen tickets
- prep status
- inventory
- suppliers
- item prices and margins

If the app is an operational dashboard, use real operational concepts:

- KPIs tied to user decisions
- queues
- incidents
- owners
- SLAs
- time ranges
- costs
- cohorts
- customer segments
- statuses
- drilldowns
- actions
- pages/routes that match real workflows

Use `topology`, `traces`, `mission control`, `command center`, `system map`, or similar terms only when they are native to the product domain and backed by a clear data contract.

## Hard Blockers

- random numbers with no units, ranges, source, or domain meaning
- generic `mission control`, `mission room`, `control room`, `command center`, `topology`, `traces`, or `system map` labels when the product is not actually about those workflows
- one-page piles of every idea instead of real routes/pages
- dashboard panels that do not correspond to a real business question or decision
- route names that sound dramatic but do not match user tasks
- fake case files, replay doctrine, fictional incident theater, or status chips replacing real product entities
- placeholder entities such as `Item 1`, `Metric A`, `System Node`, `Service 03`, or arbitrary IDs
- fake precision such as random percentages, latencies, scores, severities, or counts without plausible business context
- UI sections that a real user in that domain would not understand
- mock data stored only inside presentational components when the app has meaningful data

## Required Implementation Principles

- Put meaningful mock data in data files, fixtures, constants, or typed structures where practical.
- Name entities in the language of the business.
- Give every visible metric a unit, range, time window, and reason it matters.
- Give every status a domain meaning and a user action.
- Split multi-workflow products into real pages/routes instead of a single overloaded page.
- Navigation labels must map to real business tasks, not generic UI categories.
- Dashboard charts and tables must answer named user questions.
- If mock data is not real production data, label it honestly as sample, demo, fixture, or static.
- Use realistic examples: names, prices, rooms, products, SKUs, locations, tickets, statuses, counts, dates, and notes that fit the domain.

## Review Questions

- Could a real user from this business explain what each page is for?
- Are the section labels the words that business would actually use?
- Does every number have a unit and plausible range?
- Does every dashboard panel support a decision, task, or status check?
- Are there enough real pages/routes for the workflows?
- Is any copy only there because it sounds cinematic or AI-generated?
- Would a human product designer choose these entities, or did the agent invent generic operational theater?

## Score Caps

- no Domain Content Contract before implementation: max score 4
- random mock values with no units/ranges/source: max score 3
- generic `mission control` / `control room` / `command center` label with no real job: max score 3
- `topology`, `traces`, or `system map` used outside a justified observability/network/distributed-systems domain: max score 4
- multi-workflow app has no real pages/routes: max score 4
- dashboard has abstract metrics but no real entities or user decisions: max score 3
- mock data lacks units, statuses, ranges, timestamps, or source/freshness where needed: max score 5
- route/page labels do not correspond to real business tasks: max score 4
- UI sections are generic AI theater instead of business-specific sections: max score 3
