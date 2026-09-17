# Miguel Style Principles

This file defines how future agents should reason before they design or code. It is not a visual theme.

## Required Design Intent Record

Before building or reviewing a UI, write this record in your notes or final report:

```md
Project type:
Task classification:
Primary user:
Primary object on the screen:
Primary action:
Visual-heavy work?:
Inspiration/reference provided?:
Screen archetype:
Project-specific visual identity:
Visual Concept Gate status:
Approved rendered concept:
Concept preview screenshots:
Density level:
Token direction:
Data/auth truth constraints:
Responsive risks:
Screenshot plan:
Scorecard target:
```

If any field is unknown and would change the UI, inspect the current project or ask one short question.

## Visual Concept Gate

Use for every new app, major screen, redesign, selection-first product, gallery, roster, visual-heavy interface, or project with inspiration images.

Do not implement immediately. First produce exactly 3 radically different rendered art-direction concept prototypes and wait for Migi's approval after he reviews the visuals.

Each concept must include:

- preview route
- screenshot files at 1440 / 768 / 390 for the gate to pass
- short explanation
- visual metaphor
- composition
- focal object
- emotional hook
- hidden information
- absent elements
- why it avoids obvious app/theme cliches
- why it creates desire
- how it works at 1440 / 768 / 390
- what would make it fail

The gate does not block small bug fixes, security patches, copy edits, or purely technical refactors.

Pass condition: implementation starts only after Migi approves one rendered concept with screenshot evidence.

Fail condition: the agent starts coding components before solving the art direction, or asks Migi to approve text-only concepts. No visual screenshots = Visual Concept Gate failed.

## Visual Target Reconstruction Mode

Use when Migi provides inspiration images, screenshots, or a strong visual target.

Analyze references for:

- composition
- focal object
- information hierarchy
- what is hidden
- what is absent
- emotional hook
- material/texture
- atmosphere
- interaction model
- why the reference creates desire

Do not flatten references into shallow style tokens such as dark, neon, cards, glass, glow, gradients, rounded panels, or big text.

If a reference shows a cinematic stage, do not build a dashboard. If it shows one dominant object, do not build a grid. If it hides information, do not expose stats. If it is art-directed, do not answer with generic components.

Required sequence:

1. reference analysis
2. 3 rendered art-direction concept prototypes with screenshots
3. approval checkpoint
4. visual shell prototype
5. screenshots
6. comparison against the chosen concept/reference
7. patch loop
8. product logic only after the visual shell works

## Evidence Order

Use sources in this order:

1. `design-dna/00_COMPACT_AGENT_CONTEXT.md`
2. `manual-preferences/00_global_frontend_principles.md`
3. `design-dna/*.md`
4. `extracted/{project}/*.md`
5. `captures/{project}/.../*.png`
6. `case-studies/in-the-loop-feedback/`

The case study is one app's feedback. Use it for failure modes only. Do not globalize its palette, social tone, avatar patterns, invite flow, bottom navigation, or consumer warmth.

## Golden Projects As Evidence

These projects prove range. They are not templates.

- Agent Boss proves dense enterprise control can feel trustworthy when evidence, state, and action hierarchy are explicit.
- Equity proves a data product can be dark, compact, and numerical without becoming fake-dashboard theater.
- Ghostwritter proves an AI writing product can be expressive while keeping input, output, and export actions visible.
- Ontime proves a social planning product can be warm and fast without heavy form energy. This is evidence for consumer coordination, not a universal tone.
- Portfolio proves an editorial site can lead with identity, media, and authored narrative instead of generic portfolio grids.

## Non-Negotiable Rules

### 1. Define Identity Before Palette

Action for agents:

- Choose 3 identity words tied to the product domain, such as `clinical, fast, private` or `editorial, tactile, selective`.
- Define semantic token roles before assigning colors.
- State which golden project is closest in product type, then state what you will not copy from it.

Pass condition: the UI could change palette and still preserve hierarchy, component roles, and product character.

Fail condition: the app inherits navy, warm social colors, editorial portrait treatment, terminal darkness, or cinematic gradients because a source project used them.

### 2. Name The Primary Object

Action for agents:

- Put the primary object in the first viewport.
- Give it the largest or clearest spatial claim.
- Attach the primary action to that object, not to a generic page header.

Examples of primary objects:

- enterprise: worker, route, approval, incident, control state
- finance: stock, watchlist, market event, research note
- writing: draft, rewrite, voice, comparison
- planning: plan, meetup, person, invitation
- portfolio: person, story, project, proof

Fail condition: the first viewport is mostly stat cards, marketing copy, or unrelated tiles.

### 3. Use One Primary Action Per Zone

Action for agents:

- For every major zone, label actions as `primary`, `secondary`, `tertiary`, or `passive`.
- Render only one `primary` action per zone.
- Demote extra actions to icon buttons, menus, links, or quiet secondary buttons.

Fail condition: two or more same-weight filled buttons compete in one card, toolbar, hero, or modal.

### 4. Separate Clickable From Passive

Action for agents:

- Audit every pill, chip, row, tag, icon, and metric.
- Assign it one role: action, navigation, selection, filter, input, status, metadata, or decoration.
- Give clickable roles hover, focus-visible, active, disabled, and selected states where relevant.
- Remove hover/cursor treatment from passive roles.

Fail condition: status tags look like filters, filters look like buttons, or rows look selectable when they are static.

### 5. Compose Screens, Do Not Stack Containers

Action for agents:

- Use cards only for repeated objects, framed tools, modals, or selectable items.
- Use section bands, grids, rails, split panes, inspectors, or direct object composition for page structure.
- Count nested bordered/rounded containers; if a primary region has more than two nested frames, simplify.

Fail condition: the screen is a card containing cards containing pills containing buttons.

### 6. Use Progressive Disclosure With A Named Trigger

Action for agents:

- Every drawer, accordion, details panel, or modal must answer: what object opened it and what decision does it support?
- Keep the triggering object visible or make the return path obvious.
- Do not hide the primary action inside disclosure.

Good disclosure targets: evidence trail, source detail, generated variants, stock context, route inspector, safety explanation.

### 7. Make Data And Claims Auditable

Action for agents:

- Any metric, status, proof claim, AI output, or live indicator needs source, recency, state, or fallback.
- If data is mocked, label it in code/docs or use neutral sample copy.
- Provide empty, loading, and error states for data surfaces.

Fail condition: "validated", "live", "secure", "optimized", or confidence scores appear without visible basis.

### 8. Build Semantic Tokens

Minimum token set:

```txt
surface/page
surface/panel
surface/raised
text/primary
text/secondary
text/muted
border/subtle
border/strong
action/primary
action/secondary
state/success
state/warning
state/danger
focus/ring
shadow/raised
```

Add product-specific tokens only after the role tokens exist.

Fail condition: component CSS hard-codes a source-project palette as the design system.

### 9. Use Screenshots As Evidence, Not Templates

Action for agents:

- Use captures to understand hierarchy, density, and interaction patterns.
- Do not recreate screenshots by matching colors, spacing, or layout literally.
- For any new UI, capture its own 390, 768, and 1440 px screenshots before finishing.

Fail condition: a new finance app looks like Equity only because Equity is dark, or a planning app looks like Ontime only because Ontime is warm.

### 10. Run The Scorecard Before Done

Action for agents:

- Score with `evaluation/ui-scorecard.md`.
- Fix blocker criteria before calling work complete.
- Include score, screenshots used, and remaining gaps in the final report.

Fail condition: final answer claims "high-quality", "responsive", or "Miguel-style" without screenshot evidence and scorecard result.

### 11. Do Not Mistake Implementation Progress For Design Progress

Robot Skill Forge showed that Codex agents tend to preserve existing structure and make "same layout with new paint" unless forced into art-direction mode.

Action for agents:

- When Migi says a UI is far from the inspiration, stop polishing.
- Do not keep the rejected component structure and adjust colors, glow, cards, borders, motion, or spacing.
- Return to the Visual Concept Gate and rethink the composition from first principles.
- Build the visual shell/poster first; add feature depth only after the visual direction works.

Fail condition: a rejected direction returns with the same layout and new paint.
