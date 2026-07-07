# Domain-Generic Mock Data And Fake App Structure

## Failure

The UI uses random numbers, abstract route names, vague operational labels, or generic `mission control` / `topology` / `traces` language instead of real business content.

This makes the app immediately read as AI-generated, even when layout and responsiveness are technically acceptable.

## Why It Fails

- Real apps are organized around the work users actually do.
- Mock data must teach the agent the business domain.
- Random values and dramatic labels do not create product credibility.
- One-page information piles hide the fact that the app has no real information architecture.

## Required Future Rule

Every app needs a Domain Content Contract before visual spec or implementation:

- business type
- users
- entities
- pages/routes
- route jobs
- mock data schema
- realistic sample records
- units/ranges/statuses/source labels

## Examples Of Better Direction

- Hostel: Rooms, Beds, Bookings, Guests, Housekeeping, Events, Maintenance.
- Restaurant: Menu, Orders, Tables, Reservations, Kitchen Tickets, Inventory, Suppliers.
- Dashboard: real KPIs, queues, owners, SLAs, costs, segments, cohorts, incidents, and reports tied to user decisions.

## Score Caps

- no domain content contract: max score 4
- random mock values: max score 3
- generic mission/control language with no real user job: max score 3
- dashboard with abstract metrics and no real entities: max score 3
- no real pages/routes for multi-workflow app: max score 4
