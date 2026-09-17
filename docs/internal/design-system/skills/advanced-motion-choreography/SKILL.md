---
name: advanced-motion-choreography
description: Plan, specify, and evaluate award-level motion systems for artistic, cinematic, portfolio, agency, landing, editorial, and experimental UIs. Use when Migi asks for advanced animation, cinematic motion, scroll choreography, Awwwards/Godly/Recent-level motion, portfolio motion, or motion like Graffico, Manet, UXBert, or Podium.
---

# Advanced Motion Choreography

Advanced motion is choreography. It is not one background animation, a repeated fade-up, or hover scale sprinkled across the page.

## Use When

- Migi asks for advanced animation, cinematic motion, artistic motion, scroll animation, portfolio motion, or award-winning motion.
- References include Graffico, Manet, UXBert, Podium, Awwwards, Godly, Recent, or similar motion-heavy sites.
- Landing, portfolio, creative, agency, cinematic, editorial, or experimental UI needs motion as part of the identity.
- A strong static page still feels dead.
- Navigation, menu, reel, media, or section state matters.

## Do Not Use When

- Pure bug fix.
- Backend task.
- Minimal static page.
- High-frequency productivity UI where motion should be reduced.
- Migi explicitly asks for no motion.

## Required Inputs

- selected Design OS mode
- active design dials
- motion references or screenshots
- selected direction
- visual spec
- layout skeleton
- navigation strategy
- image/media strategy

## Required Output

Create:

```md
docs/design/motion-choreography-plan.md
```

## Required Sections

### Motion References

For each reference:

- source:
- observed mechanics:
- what to transfer:
- what not to copy:

### Motion Thesis

- what the motion should make the page feel like:
- what story motion tells:
- what should remain still:

### Motion Vocabulary

Name exact techniques, such as:

- pinned section
- scrubbed timeline
- scroll-linked parallax
- scroll-triggered reveal
- clip-path reveal
- mask reveal
- sticky horizontal scroll
- view transition
- image-to-panel expansion
- staggered typography
- kinetic marquee
- menu reveal
- reel overlay
- hover image trail
- floating CTA transition

### Motion Layers

Advanced motion needs at least five layers:

1. Page / section choreography
2. Image / media choreography
3. Typography choreography
4. Navigation / menu choreography
5. Micro-feedback layer

### Signature Motion Moment

- name:
- trigger:
- description:
- why it matters:
- tool:
- fallback:

### Section-by-Section Motion Map

For every section:

- section:
- trigger:
- motion:
- purpose:
- timing:
- easing:
- tool:
- desktop behavior:
- mobile behavior:
- reduced-motion fallback:

### Navigation Motion

- active state:
- menu open/close:
- section awareness:
- CTA motion:
- mobile nav motion:

### Image / Media Motion

- reveal method:
- crop behavior:
- parallax/depth:
- hover/focus:
- scroll handoff:

### Typography Motion

- headline reveal:
- line/word behavior:
- scroll-linked type:
- constraints:
- when static is better:

### Tool Stack Decision

- selected tool:
- why:
- what was rejected:
- dependency added? yes/no:
- performance impact:

### Reduced Motion

- what is removed:
- what remains:
- user preference handling:

### Performance Budget

- target fps:
- max simultaneous animated elements:
- properties animated:
- expensive effects:
- mobile fallback:

### Acceptance Criteria

- no token motion sprinkle
- more than one animation layer
- motion supports narrative
- reduced-motion exists
- no `transition: all`
- no layout jank
- no animation fatigue
- no fake "cool" motion

## Stop Conditions

Stop before implementation or final handoff if:

- advanced motion was requested and only one animation exists
- `docs/design/motion-choreography-plan.md` is missing
- no section-by-section motion map exists
- no reduced-motion plan exists
- motion is decorative only
- every section uses the same fade-up
- implementation lacks navigation/menu/media motion despite reference need
- no motion benchmark review exists when motion is central
- no motion sequence/evidence exists and no capture blocker is documented

## Signature Interaction Gate

For artistic, brand, portfolio, experimental landing, playful product, and image-led sites, consult `skills/signature-interaction-director/SKILL.md` when references include memorable mechanics such as portal entry, scroll route choreography, mascot motion, scroll-assembled cards, editorial list modals, media constellations, directional page transitions, or playful entry gates.

Rules:
- Select one signature interaction before implementation, or explicitly justify why none is appropriate.
- Extract mechanics, not brand skin. Do not copy logos, mascots, names, colors, exact content, or proprietary media.
- Include the selected mechanic in the visual spec when chosen.
- Final review must check whether the signature mechanic is visible, meaningful, accessible, and supported by reduced motion.
- If no signature interaction appears after award-level references, final verdict cannot be "masterpiece."
- Generic section stack after signature references is a hard failure.

## Elite Scroll Choreography Routing

When a landing, brand, portfolio, editorial, playful product, or video-first site depends on scroll as the experience, route to skills/elite-scroll-choreography-director/SKILL.md before implementation. The selected scroll pattern must appear in the visual spec, and skills/scroll-choreography-review/SKILL.md must run after implementation.

Block fade-only scroll when elite scroll was requested, pinned blank frames, moving objects covering critical text, horizontal routes without mobile fallback, scroll-to-assemble claims where objects do not visibly assemble, and scroll navigation that does not sync to chapters. Run layout-integrity review after scroll-choreography review.

## WebGL / Shader Primitive Routing

When advanced motion proposes WebGL, shaders, ShaderGradient, React Three Fiber, Three.js, GLSL, liquid-metal logo effects, animated premium gradients, or shader-based visual identity, route `skills/webgl-shader-primitives/SKILL.md` before implementation.

The motion plan must document:

- why the shader/WebGL primitive supports the concept
- exact section/component using it
- dependency/version strategy
- client-only boundary if React/Next is used
- static fallback
- reduced-motion fallback
- mobile fallback or reduced complexity
- bounded canvas/GPU area
- pointer-event strategy
- performance budget
- screenshot proof plan

Do not approve shader motion that is only a generic cool background, fake live/status theater, scrolljacking, or a way to distract from weak layout or typography.

## Anime.js Motion Primitive Routing

When advanced motion proposes Anime.js for timeline choreography, staggered DOM/SVG/object motion, CSS variable animation, weather/terrarium particles, selected-state transitions, rail/detail continuity, or tactile JavaScript feedback, route `skills/animejs-motion-director/SKILL.md` before implementation.

The motion plan must document why CSS is not enough, which components use Anime.js, scoped React/Next boundaries, cleanup on unmount, reduced-motion fallback, mobile behavior, and screenshot proof.

Do not approve Anime.js for generic fade-and-rise, fake live/status pulsing, scroll hijacking, full-page animation takeover, or motion that exists only because the dependency is available.

## Audit Upgrade: Self-Correction Contract

Audit fix: Move from heavy planning to execution verification.

Required evidence:
- motion layer map, implementation target, reduced-motion plan, capture sequence, and benchmark score.

Repair routing:
- review-animations owns code-level fixes; capture-motion-sequence evidence closes claims.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "advanced-motion-choreography"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
