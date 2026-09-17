# Visual Style Taxonomy

Source ingested from Migi's 85-row open-source style taxonomy. Use this as a selector and constraint system.

The original taxonomy contains style category, type, keywords, colors, effects, best-fit contexts, do-not-use contexts, light/dark support, performance, accessibility, mobile fit, conversion fit, framework compatibility, era/origin, complexity, prompt keywords, technical keywords, implementation checklist, and design-system variables.

## How To Use The Taxonomy

For each project, choose:

- one primary style family
- one optional supporting treatment
- explicit do-not-use styles
- token variables
- effect/motion limits
- accessibility and performance mitigations

Do not turn the taxonomy into style roulette. The selected style must fit the reference folder, product job, and Migi's current taste rules.

## Core Style Families From The Source

### Minimal / Swiss / Accessible

Good for enterprise apps, documentation, professional tools, dashboards, and high-trust products.

Use:

- clean grid
- strong typography hierarchy
- high contrast
- limited accent
- semantic spacing

Avoid:

- making it sterile
- using it for artistic/creative references that require more visual memory
- generic SaaS admin defaults

### Soft UI / Neumorphism / Clay

Good for calm, wellness, casual, playful, or tactile interfaces.

Use:

- restrained softness
- strong contrast corrections
- clear focus states
- touch-friendly controls

Avoid:

- critical dense dashboards
- low-contrast surfaces
- over-soft container soup

### Glass / Liquid / Aurora

Good for premium, atmospheric, brand-forward, or image-led interfaces when contrast is actively protected.

Use:

- one coherent material layer
- scrims/plates for text
- limited blur and transparency
- performance-aware effects

Avoid:

- stacking glass on glass
- unreadable text over gradients/images
- using glow/blur as the whole idea

### Brutalist / Raw / Retro-Futurist

Good for expressive brands, portfolios, games, music, counter-culture, or art-directed editorial surfaces.

Use:

- intentional edge
- strong typography
- disciplined contrast
- clear interaction grammar

Avoid:

- conservative enterprise, legal, healthcare, precision finance, or accessibility-first products unless explicitly requested
- accidental brokenness

### 3D / Hyperreal / Skeuomorphic

Good for product showcase, gaming, immersive experiences, configurators, architecture, luxury, and tactile storytelling.

Use:

- image/object role strategy
- performance constraints
- fallback views
- meaningful interaction

Avoid:

- data tables/forms
- low-end mobile
- accessibility-critical interfaces as primary representation

### Vibrant / Block / Flat

Good for startups, consumer products, entertainment, youth brands, and energetic product stories.

Use:

- controlled color count
- strong geometry
- clear hierarchy
- accessible contrast

Avoid:

- making every surface equally loud
- clashing with dense data work

### Dark / OLED / Command Surface

Good for low-light tools, coding, entertainment, premium dashboards, and monitoring when references support it.

Use:

- material range
- controlled accent
- high text contrast
- chart readability

Avoid:

- murky monochrome
- terminal-green panel spam
- neon accent everywhere

### Landing Page Patterns

Source rows include hero-centric, conversion-optimized, feature-rich showcase, minimal/direct, social proof, interactive product demo, trust/authority, and storytelling landing pages.

Miguel Design OS override:

- artistic/landing references require poster logic and image-led composition
- do not let feature-rich or conversion rows become Blogspot/card-grid pages
- hero is not enough; visual rhythm must continue after the hero

### BI / Analytics Patterns

Source rows include data-dense dashboard, heatmap style, executive dashboard, real-time monitoring, drill-down analytics, comparative analysis, and predictive analytics.

Miguel Design OS override:

- dashboards need graph richness, image/object/media anchors where references support them, compact controlled scale, chart bounds discipline, and P0 layout integrity
- real-time/live styling must not become fake status theater

### Mobile Patterns

Source rows include mobile-specific style systems such as soft playful surfaces, enterprise SaaS mobile, sketch/hand-drawn mobile, and mobile neumorphism.

Miguel Design OS override:

- mobile references imply real flows, not still-life mockups
- preserve thumb targets, bottom navigation craft, state clarity, and readable density

## Token Extraction Checklist

For the selected style, define:

- `--color-bg`
- `--color-surface`
- `--color-surface-raised`
- `--color-text`
- `--color-muted`
- `--color-accent`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--radius-card`
- `--radius-control`
- `--shadow-soft`
- `--border-subtle`
- `--motion-fast`
- `--motion-medium`
- `--spacing-base`
- `--font-display`
- `--font-body`

## Style QA Questions

- Does the selected style match the product job?
- Does it match the selected visual-library mode?
- Does it introduce any known Migi-rejected failure?
- Does it preserve contrast at 1440, 768, and 390?
- Does it avoid AI scale inflation?
- Does it preserve layout integrity?
- Are effects meaningful and performant?
- Does it create product identity instead of template flavor?
