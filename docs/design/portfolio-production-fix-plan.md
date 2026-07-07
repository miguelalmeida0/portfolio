# Portfolio Production Fix Plan

Date: 2026-07-05  
Design read: hiring portfolio for recruiters and senior engineers, with a dark editorial/cinematic language, leaning toward portfolio/editorial plus production UI evidence.

## What Must Remain

- Dark editorial atmosphere.
- Cinematic Miguel portrait and large name treatment.
- Black / cream / copper system.
- Red hero identity accent for "Almeida" and the portrait moment.
- Practical CV route.
- Personal story format.
- Restrained, serious tone.
- Visual confidence.

## What Must Be Removed Or Demoted

- Hero as poster-only communication.
- "Software Engineer" as the only role explanation.
- Equal-weight project gallery.
- Red as a broad site accent outside the hero.
- Heavy bracket nav that competes with content.
- Broken email wrapping.
- Terminal as a primary contact path.
- Abstract story/career copy that does not prove engineering behavior.

## Files To Change

- `src/lib/components/revamp/HeroSection.svelte`
- `src/lib/components/revamp/HeroPortrait.svelte` if portrait semantics/layout need adjustment
- `src/lib/components/revamp/SiteHeader.svelte`
- `src/lib/components/revamp/SelectedWork.svelte`
- `src/lib/components/revamp/Experience.svelte`
- `src/lib/components/revamp/ConversationStarter.svelte`
- `src/routes/+page.svelte`
- `src/routes/cv/+page.svelte`
- `src/routes/story/+page.svelte`
- `src/app.css`
- `src/lib/components/shared/CopyEmailAction.svelte`
- `src/lib/content/folio.ts` where shared content should move out of components

## Sections To Rebuild

1. Hero
   - Add short positioning line: "Product UI. Reusable systems."
   - Add proof strip: "Berlin / Remote · TypeScript · Svelte · React · Design Systems · F24".
   - Add CTAs: View work, Download CV, Contact.
   - Keep portrait and name treatment.

2. Work
   - Replace equal gallery with featured project plus supporting evidence cards.
   - Use Tiny Invite as featured product UI case study because it has the strongest full-flow screenshot.
   - Support with Tolkien Rewrite and Tickerbase.
   - If "Toikien" remains, clarify it as "Toikien, a Tolkien-inspired rewrite tool." Prefer "Tolkien Rewrite" in public UI to avoid typo risk.

3. Engineering Credibility
   - Add "How I build" or replace the weak history teaser with a concrete production habits section.
   - Show reusable UI, production care, design collaboration, and calm systems with project/F24 ties.

4. Contact
   - Direct contact card first: email, copy button, LinkedIn, CV, phone if shown.
   - Terminal interaction below as optional.
   - Email must not split awkwardly.

5. CV
   - Label route clearly: "CV / The Sheet".
   - Make "A practical CV view" visible.
   - Improve figure labels and contact readability.

6. Story
   - Tighten copy around practical traits.
   - Keep personal voice but reduce poetry in hiring-critical chapters.

## Copy To Rewrite

- Hero role from "Software Engineer" to specific frontend/product positioning.
- Project card descriptions into problem/contribution/proof language.
- Experience "history" copy into production habits.
- Story chapters into "experience -> engineering trait" copy.
- Contact heading from playful-first to practical-first.
- CV poster tagline and sheet headings.

## Components To Adjust

- `ActionLink`: may need clearer focus/CTA hierarchy but can remain.
- `CopyEmailAction`: adjust tile layout, font sizing, and wrapping behavior.
- `SiteHeader`: reduce ornament weight, improve mobile layout, add data hooks.
- `SelectedWork`: new layout and structured project data.
- `Experience`: likely repurpose to engineering proof, not only job history.
- `ConversationStarter`: direct contact hierarchy first, terminal optional second.

## Responsive Checks

Required widths:
- 1440
- 1280
- 1024
- 768
- 390

For each:
- hero clarity and portrait composition
- nav readability and no clipping
- CTAs reachable
- project proof readable
- contact email not broken
- CV readable
- story line length comfortable
- terminal no overflow
- no horizontal overflow
- sticky nav not covering content

## QA Screenshots Needed

Save to `docs/qa/screenshots/portfolio-production-fix/`:

- `desktop-hero.png`
- `desktop-work-featured-project.png`
- `desktop-project-cards.png`
- `desktop-how-i-build.png`
- `desktop-story.png`
- `desktop-contact.png`
- `desktop-sheet.png`
- `mobile-hero.png`
- `mobile-work.png`
- `mobile-contact.png`
- `mobile-sheet.png`
- `tablet-hero.png`
- `tablet-work.png`

## Required QA Docs

- `docs/qa/recruiter-clarity-review.md`
- `docs/qa/senior-engineer-credibility-review.md`
- `docs/qa/copy-review.md`
- `docs/qa/accessibility-review.md`
- `docs/qa/responsive-review.md`
- `docs/qa/contact-cv-review.md`
- `docs/qa/build-report.md`
- `docs/qa/screenshot-review.md`

## Validation Commands

- Inspect `package.json` scripts.
- Run `npm run lint` only if it exists.
- Run `npm run check` because this is a SvelteKit project and no lint script exists currently.
- Run `npm run build`.
- Run Playwright screenshot probes against the local dev server.

## Acceptance Gate

The patch is successful only if:
- first viewport explains Miguel's role and value
- project section reads as evidence
- contact works without broken email wrapping
- CV naming is recruiter-clear
- mobile is not a compressed desktop poster
- focus states are visible
- screenshots exist
- build/check pass
- remaining weaknesses are documented honestly
