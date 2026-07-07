# No AI Theater Chrome

Do not add fake narrative, incident, replay, mission, dossier, or case-file chrome to make a static UI feel more dramatic.

These labels are AI tells when they are repeated across pages without real product meaning. They make the interface feel written by a generator instead of designed by a human product team.

## Hard Blockers

- decorative `Narrative` chip
- decorative `Fictional incident` chip
- decorative `SEV-2` or severity badge when severity is not real product data
- `Replay` used as default app chrome, route label, or page identity
- `Mission` or `Mission Room` used as generic product theater
- large replay/status metadata strips taking prime page space
- `Case File`, `CL-2049`, `INC-0000`, dossier labels, operation IDs, or fake investigation IDs used as aesthetic garnish
- repeated narrative/status chips across every page
- incident-drama language replacing useful navigation or task labels
- UI depending on fake labels instead of real information architecture
- `Mission Control`, `Control Room`, `Command Center`, `Topology`, `Traces`, or `System Map` used as generic app structure without a native domain/data contract
- random values or abstract metrics standing in for real business entities

## Allowed Only When

The label is a real domain object, backed by product requirements, and helps the user make a decision.

For example, an actual incident-management product may show severity only when severity drives triage, escalation, permissions, filtering, or reporting. A replay system may use replay only if the user can actually replay a trace, session, video, timeline, event stream, or state transition.

Even when allowed, do not repeat these terms as decorative chrome on every page.

## Use Instead

- Overview
- Timeline
- Services
- Traces
- Dependencies
- Root cause
- Impact
- Actions
- Follow-up
- Postmortem
- Incident summary
- Current status
- Route map
- Decision log
- Service owner
- Evidence
- Notes

## Required Proof

When narrative, replay, mission, severity, or case-file language appears, document:

- user task it supports
- real data source or domain reason
- route or state it changes
- why the word is better than a plain product label
- why it is not repeated decorative theater
- Domain Content Contract when the term depends on a specific business, operations, observability, or dashboard data model

## Score Caps

- fake narrative/fictional incident chip: max score 4
- fake severity/status badge used as theater: max score 4
- replay/mission chrome used as default identity: max score 4
- oversized replay metadata strip: max score 4
- fake case-file or dossier identifier: max score 3
- repeated AI-theater chips across pages: max score 3
- UI relies on AI-theater labels instead of real IA: max score 5
- generic domain-theater labels replace real business sections: max score 3
- random mock data / abstract metrics support the theater: max score 3
