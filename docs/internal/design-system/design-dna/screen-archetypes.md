# Screen Archetypes

Pick one archetype per screen. Source projects are evidence for archetype behavior, not templates for color or layout.

## Art-Directed Visual Experience

Use when: the product depends on strong art direction, inspiration images, a cinematic target, a visual-heavy first impression, or a selection/discovery experience.

Build:

- primary object: one dominant object, scene, collection, or visual metaphor
- required surfaces: approved rendered art-direction concept, concept preview route, 1440 / 768 / 390 concept screenshots, focal composition, hidden/absent information plan, responsive visual shell, screenshot comparison against concept/reference
- controls: only enough controls to prove the primary interaction before feature depth
- copy: minimal and subordinate to the visual concept unless the concept is typographic

Do not: code the app first, flatten references into dark/neon/cards/glow, or substitute generic components for a cinematic or object-led target.

Approval rule: no implementation until Migi reviews 3 rendered concept prototypes and approves one visual direction. Text-only concepts do not satisfy the gate.

## Enterprise Trust Cockpit

Evidence: Agent Boss.

Use when: users approve, supervise, audit, or control high-risk work.

Build:

- primary object: case, worker, route, approval, incident, or control state
- required surfaces: status, evidence/source, next action, audit trail
- controls: primary action plus secondary review/detail actions
- copy: precise, accountable, no playful ambiguity

Do not copy: navy palette, exact shell, route names, or agent-specific language unless the product is actually agent control.

## Research Terminal

Evidence: Equity.

Use when: users compare time-sensitive entities, records, metrics, markets, logs, or feeds.

Build:

- primary object: entity being researched
- required surfaces: search, metric strip, source/recency, list/table/feed
- controls: filters and watch/save actions clearly separated from status tags
- copy: terse, sourced, numerical

Do not copy: dark terminal styling unless the product needs high-density scanning.

## Rewrite Studio

Evidence: Ghostwritter.

Use when: users create, transform, compare, or export language/output.

Build:

- primary object: draft, prompt, rewrite, or output variant
- required surfaces: input, mode controls, output, copy/export, history/variants
- controls: generate action with loading/error and recoverable input
- copy: expressive only where it helps choose voice or outcome

Do not copy: cinematic AI treatment unless the product benefits from expressive creative framing.

## Consumer Coordination

Evidence: Ontime and the In The Loop case study, both scoped to social/planning contexts.

Use when: users coordinate people, time, place, attendance, or invitations.

Build:

- primary object: plan, meetup, invitation, person, or availability state
- required surfaces: current plan, participants, time/place, confirm/share action
- controls: low-friction choices, not long forms
- copy: plain, warm only if the product relationship supports it

Do not copy: bottom navigation, avatars, warm palette, or invite mechanics for non-social products.

## Editorial Presence

Evidence: Portfolio.

Use when: the screen presents a person, practice, body of work, narrative, or brand point of view.

Build:

- primary object: person, project, story, proof, or offer
- required surfaces: subject signal, subject-identifying media or typographic identity, selected proof, contact/path
- controls: few, clear navigation paths
- copy: authored and selective

Do not copy: portrait-led layout unless the subject is a person or personal practice.

## Selection Roster

Evidence: Robot Skill Forge rejected directions.

Use when: users browse, compare, collect, choose, or discover selectable objects before doing anything else.

Build:

- primary object: selectable card/object/character/tool/artifact/place
- required surfaces: image-led roster, distinct object personality, approved rendered concept, clear content zones, rewarding hover/selected state, selected preview
- optional surfaces: class/tier/rarity/vibe labels only when they clarify desire rather than creating badge soup
- controls: choose/select, compare, save/favorite, inspect details after selection
- copy: short object hooks that increase desire to choose; dense specs come after selection

Do not: make the first screen a beige catalog, product brochure, SaaS settings page, dense terminal, newspaper layout, stats dashboard, or obvious genre-cliche treatment. Do not use overlapping card content or badge/glow/stat overload as excitement.

Scope: use this archetype only when selection/discovery is the core loop. Do not apply game energy to products whose primary task is approval, research, settings, or reading.

Overlap rule: text, badges, controls, and stats must not collide. Accidental overlap blocks elite scoring even if the concept has energy.

## Settings And Safety

Use when: users manage preferences, permissions, risk, privacy, or irreversible choices.

Build:

- primary object: setting group or permission
- required surfaces: current value, consequence, save/reset or confirmation
- controls: toggles, selects, segmented controls, or explicit confirmations
- copy: plain and consequence-oriented

Do not: hide serious consequences behind cute copy or ambiguous toggles.

## Selection Rule

If a screen seems to fit multiple archetypes, choose based on the primary object:

- object is a visual target, inspiration-led composition, or art-directed first impression: Art-Directed Visual Experience
- object is a decision/risk item: Enterprise Trust Cockpit
- object is a data entity/feed: Research Terminal
- object is generated/transformed output: Rewrite Studio
- object is people/time/place coordination: Consumer Coordination
- object is authored identity/proof: Editorial Presence
- object is a selectable roster/gallery/collection: Selection Roster
- object is configuration/risk: Settings And Safety
