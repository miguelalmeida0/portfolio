# Portfolio Design System

Date: 2026-07-05  
Purpose: production-ready hiring portfolio system for Miguel Almeida.

## Design Read

Hiring portfolio for recruiters, hiring managers, and senior engineers. Dark editorial identity with practical product-engineering proof. The hero can be cinematic; the interior must be readable, structured, and useful.

## Color Tokens

Strong red is reserved for the hero identity moment only.

```txt
canvas-black       #050505  page/hero black
surface-black      #0d0e0e  interior section surface
surface-raised     #151515  cards/panels
surface-muted      #202020  subtle chips and fills
cream              #f4eadc  primary text on black
cream-soft         #d9d0c2  secondary text on black
muted-gray         #8b8983  metadata and captions
copper             #e8a878  interior accent and CTA emphasis
copper-soft        #f0c4a2  soft accent text
hero-red           #e91f2d  Almeida/portrait identity only
border             rgba(244, 234, 220, 0.16)
border-strong      rgba(244, 234, 220, 0.34)
focus              #f0c4a2
success            #9edc9a
warning            #f1c36f
danger             #e91f2d
```

## Palette Rules

- Hero: black, cream, red.
- Interior: near-black, cream, muted gray, copper.
- Do not use red for routine cards, badges, or buttons outside the hero.
- Avoid muddy sepia/espresso container surfaces.
- Copper is an accent, not a full-page wash.
- Contrast target: body text must be readable on every surface; tiny uppercase labels cannot carry essential meaning alone.

## Typography Tokens

- Display: impact-style condensed uppercase for the hero name only.
- Page title: large but readable editorial display, no negative letter spacing.
- Section heading: `clamp(2rem, 5vw, 4rem)`, tight but not clipped.
- Body: 16-19px, line-height 1.45-1.65.
- Compact body: 14-15px, line-height 1.45.
- Label: 10-12px uppercase mono, letter-spacing 0.14em-0.22em max.
- Button: 11-13px mono uppercase, letter-spacing 0.12em-0.18em.
- Data numeral: tabular figures, strong contrast.

Important information cannot be available only as tiny mono text.

## Spacing Rules

- Page gutter: `clamp(1.25rem, 3vw, 2.5rem)`.
- Section padding desktop: 88-128px.
- Section padding mobile: 56-80px.
- Card padding: 20-32px depending on density.
- Vertical rhythm: proof sections should scan in grouped rows, not loose poster spacing.

## Navigation Treatment

- Labels: Work, Story, CV, Contact.
- Nav should be quiet over the hero and functional elsewhere.
- Bracket detail may remain only as a light edge treatment.
- Active state: clear fill/border/text change keyed to the target item.
- Focus state: visible ring with `focus` token.
- Mobile: compact fixed top or bottom treatment with all labels readable and no clipping.
- Sticky nav must not cover anchor headings.

## Card Treatment

- Cards are evidence containers, not decorative posters.
- Radius: 8px or less.
- Border: subtle cream opacity.
- Background: near-black raised surface.
- Hover/focus: border changes and small translate only.
- Content hierarchy: name, type, role/stack, problem, contribution, proof, CTA.
- Screenshots are proof objects, not the entire card.

## CTA Hierarchy

- Primary: cream/copper fill or cream fill on black, used for one main action per cluster.
- Secondary: border button with cream text.
- Tertiary: text link with underline/focus affordance.
- Hero primary actions: View work, Download CV, Contact.
- Contact actions: Email, Copy email, LinkedIn, Download CV.
- No dead CTAs. Links must route to real sections, files, or actions.

## Focus States

- Every link and button needs visible `:focus-visible`.
- Focus should not rely on color alone.
- Use outline/ring plus border change.
- Interactive cards must expose a clear visible focus state.

## Mobile Rules

- Mobile is not a squeezed poster.
- The first viewport must show role/value and at least one action.
- Nav labels must remain readable.
- Tap targets should be at least 44px where practical.
- Email and URLs must wrap intentionally, not split awkwardly.
- Project cards should stack into proof-first summaries.
- Terminal interaction must not overflow or trap focus.

## Motion Rules

- Keep motion minimal.
- Use motion only for feedback, state, or gentle reveal.
- Respect `prefers-reduced-motion`.
- Avoid high-frequency decorative animation.

## Image Rules

- Hero portrait is the identity object.
- Portrait stays merged into black background, no card, no border.
- Project screenshots have stable aspect ratio and clear alt text.
- Text must not cover Miguel's face.
