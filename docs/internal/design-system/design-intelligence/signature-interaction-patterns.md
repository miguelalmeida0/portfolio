# Signature Interaction Patterns

These patterns turn elite reference-site mechanics into Design OS-native interaction systems. They are not visual clone instructions.

## Kinetic Poster Board

Source inspiration: Stiff

### Mechanics
- giant punchline typography
- mascot punctuation
- repeated side rail
- physical frame borders
- work cards as moving board

### When To Use
Use for playful studio, agency, culture, entertainment, or brand sites that can carry comedic scale.

### When Not To Use
Avoid for utility apps, dashboards, or pages where reading dense information is the core task.

### Required Ingredients
Poster stage, oversized type, illustration punctuation, framed work/cards, rail/navigation object.

### Implementation Pattern
Build as a spatial board with CSS grid/transform sections; cards can translate on scroll or route position.

### Motion Pattern
Type and cards move as physical objects; mascot/SVG punctuates section changes.

### Accessibility Fallback
Provide normal vertical reading order and skip links.

### Reduced-Motion Fallback
Disable scrubbed travel; show stacked poster sections.

### Common Failure Signs
- Three-card SaaS sections
- random mascot pasted in
- horizontal travel that traps keyboard users

### Score Caps
- generic section stack after signature refs: max 4
- no reduced-motion fallback: max 5

### Related Skills
- signature-interaction-director
- advanced-motion-choreography

## Scroll Route Choreography

Source inspiration: Stiff

### Mechanics
- horizontal then vertical then horizontal route
- spatial territories
- work as physical travel

### When To Use
Use when content can be experienced as a map, route, timeline, reel, or board.

### When Not To Use
Avoid when SEO text reading or form completion is primary.

### Required Ingredients
Route model, section coordinates, scroll progress, keyboard fallback.

### Implementation Pattern
Use pinned sections or CSS scroll snap; GSAP optional for scrubbed transforms.

### Motion Pattern
Motion follows a route instead of generic section stacking.

### Accessibility Fallback
Offer linear fallback links and keyboard navigation.

### Reduced-Motion Fallback
Collapse to normal vertical stack.

### Common Failure Signs
- random parallax
- motion with no route map
- scroll hijack

### Score Caps
- route claim but fade/slide delivered: max 4

### Related Skills
- advanced-motion-choreography

## Floating Product Ingredient Stage

Source inspiration: Bucks Sauce

### Mechanics
- depth objects
- product truth
- ingredient delight
- physical hero world

### When To Use
Use for tangible products, food, beverage, commerce, beauty, hardware, or objects with ingredients/materials.

### When Not To Use
Avoid for abstract SaaS unless product objects are real.

### Required Ingredients
Product object, ingredient objects, depth layers, truthful labels.

### Implementation Pattern
Use absolutely layered SVG/images with transforms and safe zones.

### Motion Pattern
Float/rotate at different depths; motion supports ingredient or product story.

### Accessibility Fallback
Static product object with labeled ingredients.

### Reduced-Motion Fallback
Remove floating motion and show ordered ingredient panel.

### Common Failure Signs
- stock objects unrelated to product
- floaty decoration with no truth

### Score Caps
- object motion decorative only: max 6

### Related Skills
- image-first-frontend
- motion-craft-director

## Scroll-to-Assemble Cards

Source inspiration: Bucks Sauce

### Mechanics
- scattered cards become ordered
- chaos to logic
- physical organization

### When To Use
Use when product value is organizing messy information or ingredients.

### When Not To Use
Avoid if cards are ordinary features with no before/after logic.

### Required Ingredients
Initial scattered state, organized target state, content hierarchy.

### Implementation Pattern
Animate card transforms from scattered positions to grid/list.

### Motion Pattern
Scroll or progress turns chaos into structure.

### Accessibility Fallback
Show ordered cards by default with optional before state.

### Reduced-Motion Fallback
Skip scattered state; reveal organized stack.

### Common Failure Signs
- cards scatter randomly
- no final organized state

### Score Caps
- random scroll effects: max 5

### Related Skills
- signature-interaction-director

## Review Theater Cards

Source inspiration: Bucks Sauce

### Mechanics
- reviews as artifacts
- testimonial cards with brand voice
- footer/social as designed objects

### When To Use
Use for brands with strong voice and real testimonials.

### When Not To Use
Avoid fake reviews or generic quote grids.

### Required Ingredients
Real review source, card frame system, voice rules, social/footer object.

### Implementation Pattern
Treat testimonial cards like posters/labels/tickets.

### Motion Pattern
Cards can slide, snap, or stage as a theater row.

### Accessibility Fallback
Readable list of reviews with source labels.

### Reduced-Motion Fallback
Static cards in accessible carousel/list.

### Common Failure Signs
- fake testimonials
- plain quote grid

### Score Caps
- generic reviews despite pattern: max 6

### Related Skills
- landing-page-craft-director

## Editorial List Detail Modal

Source inspiration: Wembi

### Mechanics
- large list rows
- surgical accent
- designed detail panel
- minimal nav

### When To Use
Use for editorial tech, explainers, feature lists, product sectors, FAQs, or structured discovery.

### When Not To Use
Avoid if the modal is only a default dialog or content dump.

### Required Ingredients
List rows, selected state, detail panel, close behavior, focus management.

### Implementation Pattern
Build list as buttons; detail panel/modal shares type, color, and spacing system.

### Motion Pattern
Panel opens with purposeful scale/slide; selected row remains visible.

### Accessibility Fallback
Focus trap, Escape close, aria-modal, return focus to row.

### Reduced-Motion Fallback
Inline accordion or full-page detail.

### Common Failure Signs
- default browser dialog styling
- row selection does not persist

### Score Caps
- default dialog styling: max 6

### Related Skills
- visual-spec-compiler
- text-clarity-review

## Portal Object Entry

Source inspiration: Podium

### Mechanics
- small object on empty stage
- curiosity hook
- scroll enters object
- media behind object

### When To Use
Use for portfolios, studios, campaigns, cinematic launches, and object-led editorial pages.

### When Not To Use
Avoid for high-frequency utility tasks or pages needing immediate forms.

### Required Ingredients
Portal shape, mask/media layer, empty stage, scroll states, fallback content.

### Implementation Pattern
Use CSS clip-path/SVG mask with media inside; scroll scales/crops into object.

### Motion Pattern
Slow scale/camera move into shape; media appears inside the portal.

### Accessibility Fallback
Provide direct Work/Content links and readable alt text.

### Reduced-Motion Fallback
Show portal as static hero media plus direct content grid.

### Common Failure Signs
- fake portal claim with fade only
- content inaccessible until animation ends

### Score Caps
- portal claim but only fade/slide: max 4

### Related Skills
- advanced-motion-choreography
- vector-form-system-director

## Media Constellation Stage

Source inspiration: Podium

### Mechanics
- work items as spatial constellation
- varied media sizes
- black cinematic stage

### When To Use
Use for portfolios, case studies, reels, and media-heavy brand work.

### When Not To Use
Avoid for dense admin or equal-card dashboards.

### Required Ingredients
Media metadata, varied positions, focus behavior, responsive packing.

### Implementation Pattern
Use positioned grid/canvas with semantic links and list fallback.

### Motion Pattern
Media can drift/reveal subtly; hover/focus clarifies item.

### Accessibility Fallback
Provide list view and keyboard order matching visual order.

### Reduced-Motion Fallback
Collapse to ordered project list/cards.

### Common Failure Signs
- random collage with no labels
- unreachable media

### Score Caps
- media collage with no interaction model: max 6

### Related Skills
- portfolio-experimental
- screenshot-scorecard-review

## Playful Entry Gate

Source inspiration: Don't Board Me

### Mechanics
- user performs playful action
- mini-game entry
- brand memory

### When To Use
Use for playful brand sites where ceremony is part of the promise.

### When Not To Use
Avoid for accessibility-critical, emergency, utility, dashboard, or conversion-sensitive flows.

### Required Ingredients
Gate action, skip link, success state, timing limit.

### Implementation Pattern
Use pointer/keyboard-triggered local state; never require physics precision.

### Motion Pattern
Bounce/throw/click creates transition into site.

### Accessibility Fallback
Skip button and keyboard activation required.

### Reduced-Motion Fallback
Skip gate and show site content.

### Common Failure Signs
- gate blocks access
- no keyboard alternative

### Score Caps
- playful gate blocks access: max 5

### Related Skills
- signature-interaction-director

## Mascot Hero Interaction

Source inspiration: Don't Board Me

### Mechanics
- custom SVG mascot
- typography frames mascot
- slow idle motion

### When To Use
Use for brands where a character can carry identity and tone.

### When Not To Use
Avoid generic mascot injection into serious products.

### Required Ingredients
Original mascot, type lockup, idle motion, alt/fallback.

### Implementation Pattern
Use inline SVG or optimized image with CSS motion.

### Motion Pattern
Slow breathing/idle motion; interaction response on hover/click.

### Accessibility Fallback
Static mascot with descriptive alt text.

### Reduced-Motion Fallback
Static mascot and no idle movement.

### Common Failure Signs
- generic mascot
- character obscures CTA

### Score Caps
- mascot pasted in without role: max 6

### Related Skills
- vector-form-system-director
- motion-craft-director

## Directional Page Transition

Source inspiration: Don't Board Me

### Mechanics
- route enters from clear direction
- background changes per destination
- new room feeling

### When To Use
Use for brand, service, portfolio, or editorial sites with a small route set.

### When Not To Use
Avoid complex apps where route changes must be instant and predictable.

### Required Ingredients
Direction map, route color tokens, history behavior, focus restoration.

### Implementation Pattern
Use CSS transitions between page states or route containers.

### Motion Pattern
New page slides from right/left/top with color/material shift.

### Accessibility Fallback
Respect browser history and focus target heading.

### Reduced-Motion Fallback
Instant route change with color state only.

### Common Failure Signs
- direction with no information model
- transition hides content

### Score Caps
- route transition blocks content: max 6

### Related Skills
- motion-craft-director

## Service Ritual Selector

Source inspiration: Don't Board Me

### Mechanics
- one decision at a time
- service choice as ritual
- minimal layout
- playful copy

### When To Use
Use for booking, intake, configurators, or service selection where focus matters.

### When Not To Use
Avoid when users need fast comparison tables.

### Required Ingredients
Step count, service options, back/next, validation, summary.

### Implementation Pattern
Build as accessible stepper/select flow with large type and clear affordances.

### Motion Pattern
Step transitions feel ceremonial but short.

### Accessibility Fallback
All fields accessible with labels and error messages.

### Reduced-Motion Fallback
Show standard form/list with same data.

### Common Failure Signs
- ceremony hides choices
- CTA disabled without explanation

### Score Caps
- ritual blocks task: max 5

### Related Skills
- text-clarity-review
- production-hardening-review

## Annotation Ritual

Source inspiration: Nocturne correction pattern from field guide failure

### What It Does
Reveals a specimen through draw-on annotation lines, protected labels, stamps, and collector notes.

### When To Use
Use for field guides, archives, botanical/specimen pages, technical product anatomy, or editorial evidence reveals.

### When Not To Use
Avoid when labels are decorative only or cannot be protected from illustration paths.

### Required Ingredients
Specimen object, annotation anchors, label boxes, protected zones, draw-on lines, stamps, and collector notes.

### Interaction Story
The user watches the specimen become legible through staged annotation instead of static labels.

### Motion Pattern
Lines draw from anchors to protected label boxes; stamps and notes appear after the line settles.

### Implementation Notes
Never use child SVG title tooltips. Leader lines must route around labels and text.

### Accessibility Fallback
Provide ordered annotation list tied to specimen regions.

### Reduced-Motion Fallback
Show all labels and notes statically with line drawing disabled.

### Common Failure Signs
- leader line cuts text
- native SVG tooltip appears
- labels clipped
- annotations are decorative

### Score Caps
- leader line cuts word: max 3
- native SVG tooltip visible: max 4
- static SVG where animated reveal is required: max 5

### Related Skills
- signature-interaction-director
- vector-form-system-director
- screenshot-scorecard-review

## Specimen Lens Entry

Source inspiration: Nocturne correction pattern from field guide failure

### What It Does
A tiny lens, seed, moon mark, or specimen dot acts as the entry object. On scroll or click, the user enters the object and reveals the field guide.

### When To Use
Use for botanical, scent, archive, field guide, museum, or evidence-led landing pages.

### When Not To Use
Avoid when the object cannot be implemented as a real mask, scale, or entry state.

### Required Ingredients
Entry mark, lens/specimen mask, field guide reveal, skip link, and static fallback.

### Interaction Story
The user enters through a small mark and discovers the specimen world inside it.

### Motion Pattern
Click or scroll expands the mark into a lens/mask that reveals the guide.

### Implementation Notes
Use CSS clip-path, SVG mask, or scale transform. Do not claim portal/lens with fade only.

### Accessibility Fallback
Provide direct link to the field guide content.

### Reduced-Motion Fallback
Show the lens mark and guide content statically.

### Common Failure Signs
- lens is only a decorative circle
- fade/slide instead of entry
- content blocked by animation

### Score Caps
- portal/lens claim but only fade/slide delivered: max 4
- no fallback: max 5

### Related Skills
- signature-interaction-director
- scroll-morphing-experience-director
- vector-form-system-director

## Field Guide Plate Drawer

Source inspiration: Nocturne correction pattern from field guide failure

### What It Does
Specimen plates begin scattered or stacked, then organize into an archival guide as the user scrolls.

### When To Use
Use for field guides, collections, catalogs, editorial archives, cards, specimens, ingredients, or evidence sets.

### When Not To Use
Avoid when plates are ordinary content cards with no archival or organization story.

### Required Ingredients
Specimen plates, scattered/stacked state, organized drawer state, labels, and keyboard/list fallback.

### Interaction Story
The user sees the collection become usable as plates file into an archival drawer.

### Motion Pattern
Scroll or click moves plates from offset stack into drawer/list positions.

### Implementation Notes
Keep DOM order logical; transforms are decoration over an accessible plate list.

### Accessibility Fallback
Provide ordered plate list with headings and details.

### Reduced-Motion Fallback
Show organized plate drawer directly.

### Common Failure Signs
- random scattered cards
- no final organization
- plates clip text or labels

### Score Caps
- static SVG where animated reveal is required: max 5
- random scroll effects: max 5

### Related Skills
- signature-interaction-director
- advanced-motion-choreography
