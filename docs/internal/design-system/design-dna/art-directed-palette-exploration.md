# Art-Directed Palette Exploration

Use this for artistic, cinematic, landing, portfolio, creative, editorial, and experimental interfaces.

## Rule

For expressive visual modes, the palette must be actively designed, not safely defaulted.

Agents must explore original, expressive, balanced palettes when the mode allows it. This does not mean every UI should be loud or colorful. It means color must become a deliberate art-direction tool when the selected mode supports it.

Migi is open to bold and unusual color palettes if:

- the result is readable
- contrast is strong
- colors are not painful to look at
- the palette feels balanced
- colors support the concept
- the palette feels human/art-directed, not machine-generated
- OKLCH/APCA or equivalent contrast checks pass

The palette should help create memory, mood, and identity.

## Domain Palette Fit

Even expressive palettes must fit the product domain, user environment, task pressure, and emotional state. A palette can be bold and still be wrong if it feels randomly imported from another product type.

Before locking tokens, document:

- product domain
- user environment
- task pressure
- emotional state
- state color semantics
- why the palette belongs to this product
- what random or "looks cool" palette was rejected

For practical product surfaces such as hospitality operations, finance, healthcare, logistics, education, or music utility, domain fit is required even when the UI is visually ambitious.

## Do Not Default To

- muddy brown/black generated-app backgrounds
- muddy sepia/espresso/umber brown-black archive wash on pages, stages, cards, panels, containers, sidebars, or navigation
- generic charcoal plus orange
- generic blue-grey SaaS
- AI purple/blue glow
- washed-out beige premium cliche
- green terminal palette
- neon lime tech palette
- safe neutral surfaces with one predictable accent
- dull gradients that feel like AI filler
- palettes that are visually interesting but domain-random

Color should be part of the concept.

## Strict Ban: Sepia Archive Brown Surface Wash

Migi has repeatedly rejected the muddy sepia/espresso/umber brown-black surface family.

Do not use it for:

- page backgrounds
- hero stages
- product cards
- panels
- notes
- command containers
- framed illustrations
- drawers/sheets
- modals
- sidebars
- navigation
- "archive" or "field guide" visual systems

Do not rename it as nocturne, archive, botanical, brass, tobacco, parchment, vintage, cinematic, commander, incident, operational, or premium. Those labels do not make the color acceptable.

If a generated direction contains this surface family, it fails the palette gate. Visible sepia containers cap score at 2. Replace it with a more authored palette such as ink blue, aubergine-black, deep green-black, mineral grey, true black/cream, cold moonlit blue, oxidized red, surgical green, chrome blue, or another reference-specific system with contrast proof.

## Required Palette Exploration

For Landing / Portfolio / Artistic / Cinematic / Experimental modes, palette exploration is required before implementation.

Propose at least 3 palette directions:

1. Safe refined palette.
2. Artistic expressive palette.
3. Unexpected / high-character palette.

For each:

- base color system
- accent logic
- image compatibility
- mood
- contrast risk
- why it fits the concept
- why it avoids AI-default color

Then select one and lock it.

Do not pick the safest option automatically.

## OKLCH / APCA Requirement

When OKLCH/APCA rules exist, use them.

For the selected palette:

- define semantic tokens
- define foreground/background contrast targets
- repair contrast by changing OKLCH lightness, not random hex guessing
- avoid hue drift
- ensure text and UI remain readable
- document contrast reasoning

Bold color is allowed. Unreadable color is not.

## Palette Exploration Seeds

These are inspiration seeds, not mandatory presets.

### Robotics / Synthetic Body

- cold white + oxidized red + graphite + lab blue
- black chrome + acid yellow + muted steel
- pale surgical green + deep ink + rust signal
- bone + cobalt + carbon + soft infrared
- silver fog + safety orange + ultraviolet shadow

### Creative / Portfolio

- ink black + electric coral + smoked lavender
- paper white + cobalt + acidic green accent
- deep plum + ivory + chrome blue
- clay pink + black + cold cyan
- monochrome + one violent saturated accent

### Cinematic / Atmospheric

- midnight blue + sodium orange + fog grey
- deep aubergine + pale mint + off-white
- dark umber + icy blue + muted red
- storm grey + amber + porcelain
- black + washed teal + signal red

## Stop Condition

If an artistic, landing, portfolio, cinematic, or experimental UI uses a dull generated-app palette with no documented exploration, stop and redesign the palette before continuing.
