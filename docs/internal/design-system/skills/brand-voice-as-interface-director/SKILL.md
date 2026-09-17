# Brand Voice As Interface Director

## Purpose
Turn brand voice into interface mechanics: CTAs, navigation labels, card copy, review language, detail panel copy, empty/loading/error states, tooltips, confirmation text, and microcopy.

The goal is not louder copy. The goal is copy that makes the product feel authored, useful, memorable, and specific to its world.

## Use When
- A playful, editorial, brand, landing, hospitality, media, creative, or product-story site feels generic.
- References include strong voice, comedic poster typography, playful instructions, ritual selectors, review theater, or branded microcopy.
- Migi says the page feels like SaaS, hotel template, AI copy, bland, generic, or not alive.
- CTAs, nav labels, cards, details, empty states, or reviews need personality without losing clarity.

## Do Not Use When
- Copy is legally regulated, medical, financial, safety-critical, or must remain strict and neutral.
- The task is a pure visual pass with no visible copy issues.
- A high-frequency utility flow needs minimal literal labels.

## Required Output Before Coding Or Copy Pass
- voice thesis: one sentence describing the product voice
- user state: what the user feels at the moment of interaction
- vocabulary bank: approved words, verbs, nouns, and phrases
- forbidden language: generic SaaS/hotel/template terms to remove
- CTA lexicon: primary, secondary, destructive, empty-state, and success CTAs
- navigation label strategy
- card/detail/review copy strategy
- empty/loading/error tone rules
- clarity guardrails: what must stay literal
- accessibility and translation notes

## Voice Interface Map
Use this table before implementation:

| Surface | Current Intent | Voice Rule | Example Copy | Clarity Risk |
|---|---|---|---|---|

## Hard Rules
- Brand voice must not make actions unclear.
- CTAs need verb/object clarity unless the interaction is intentionally ritualized and still obvious.
- Playful copy must never hide error recovery, destructive consequences, or form requirements.
- Do not use generic SaaS language on playful, editorial, or brand sites.
- Do not use fake hospitality, fake luxury, fake startup, or template words.
- Reviews and testimonials must feel like designed artifacts, not lorem praise blocks.
- Empty, loading, and error states should match the product register without becoming jokes at the user's expense.

## Review Checks
- Could this copy belong to any generic SaaS or hotel template?
- Do CTAs match the brand world and still explain the action?
- Do nav labels support the experience instead of defaulting to About, Services, Contact everywhere?
- Are detail panels and cards written in the same voice system?
- Are errors clear, respectful, and actionable?
- Does the voice improve memory without creating confusion?

## Stop Conditions
- Playful/brand site uses generic SaaS or template copy.
- CTAs do not match brand voice or do not explain the action.
- Error or destructive copy becomes cute instead of useful.
- Voice hides product truth.

## Score Caps
- playful/brand site uses generic SaaS copy: max score 5.
- CTAs do not match brand voice: max score 6.
- brand voice makes primary action unclear: max score 5.
- review/testimonial copy is generic filler: max score 6.
- empty/error/loading state copy is off-register or unhelpful: max score 6.

## Audit Upgrade: Self-Correction Contract

Audit fix: Treat voice as interaction clarity, not decorative tone.

Required evidence:
- voice register, UI state, before/after copy examples, risk of over-personality, and accessibility/readability check.

Repair routing:
- text-clarity-review owns confusing copy; truthful-state-product-naming owns misleading claims.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "brand-voice-as-interface-director"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
