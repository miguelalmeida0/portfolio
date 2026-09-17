IMPLEMENT UNSPLASH ASSET SOURCING LAYER IN MIGUEL DESIGN OS.

Work only inside:
/Users/malmeida/Desktop/miguel-design-os

Do not modify:
- source-projects/
- captures/
- raw-chat-input/
- /Users/malmeida/Desktop/design-os-random-test
- /Users/malmeida/Desktop/visual-taste
- /Users/malmeida/Desktop/robotstack-os

Do not build frontend apps.
Do not delete files.
Do not recatalog screenshots unless necessary.

Context:
Migi provided Unsplash API documentation. We need to convert it into a Miguel Design OS-native image sourcing workflow for visual-heavy landing pages, portfolios, creative sites, editorial pages, and product concepts.

Goal:
Design OS should make agents source real, relevant, high-quality images instead of using fake screenshots, placeholder rectangles, CSS art, AI-looking robot renders, or irrelevant stock imagery.

This is especially important for:
- image-first frontend
- landing-page craft
- portfolio/experimental pages
- visual-spec compiler
- robotics/nocturne/artistic landing pages
- direction gates
- asset manifests
- anti-AI preflight

==================================================
PHASE 1 — ARCHIVE RAW UNSPLASH DOCS
==================================================

Save the attached Unsplash docs into:

research-input/asset-sourcing/raw/unsplash-api-docs.md

Create/update:

research-input/asset-sourcing/manifest.md
research-input/asset-sourcing/manifest.json

Manifest entry must include:
- source: Unsplash API docs
- content type: API documentation
- main endpoints covered:
  - GET /search/photos
  - GET /search/collections
  - GET /collections
  - GET /collections/:id
  - GET /collections/:id/photos
  - GET /topics
  - GET /topics/:id_or_slug
  - GET /topics/:id_or_slug/photos
  - stats endpoints
- useful fields:
  - id
  - width
  - height
  - color
  - blur_hash
  - description
  - alt_description
  - user.name
  - user.username
  - urls.raw/full/regular/small/thumb
  - links.html
  - links.download
  - links.download_location
- why it matters for Design OS

Do not paste the full raw docs into Design DNA. Archive raw docs only under research-input.

==================================================
PHASE 2 — CREATE UNSPLASH ASSET SOURCING RULES
==================================================

Create:

design-dna/unsplash-asset-sourcing-rules.md

Rules to include:

# Unsplash Asset Sourcing Rules

Unsplash should be used when:
- a visual-heavy page needs real photographic atmosphere
- the concept requires image-led composition
- landing/portfolio/artistic/editorial work needs real visuals
- Migi asks for real images
- generated/fake assets would weaken product truth

Unsplash should not be used when:
- the product requires exact real company/product images
- the brief requires original proprietary visuals
- user provides exact assets
- images would create misleading factual claims
- placeholders would be more honest than unrelated stock

==================================================
PHASE 3 — SEARCH QUERY STRATEGY
==================================================

Add a rule:

Agents must create a search plan before sourcing images.

Create required artifact for projects using Unsplash:

docs/design/unsplash-search-plan.md

Required sections:

## Image roles needed
Example:
- hero atmosphere
- macro detail
- object/subject close-up
- environmental scene
- texture/material
- closing image

## Queries
For each role:
- primary query
- alternate query
- color filter if useful
- orientation
- content_filter
- order_by
- reason

Use the Unsplash search photos endpoint conceptually:
GET /search/photos

Supported parameters from the docs:
- query
- page
- per_page
- order_by: relevant/latest
- collections
- content_filter: low/high
- color: black_and_white, black, white, yellow, orange, red, purple, magenta, green, teal, blue
- orientation: landscape, portrait, squarish

Rules:
- hero images usually need landscape orientation
- portrait images are useful for vertical cards or editorial panels
- squarish images are useful for object/specimen tiles
- use color filters only when they support the palette
- prefer content_filter high for public-facing projects unless there is a reason not to
- use order_by relevant for concept matching; latest only when recency matters

==================================================
PHASE 4 — IMAGE SELECTION QUALITY BAR
==================================================

Create rules:

# Unsplash Image Selection Quality Bar

A selected image must have:
- strong composition
- clear focal object or atmosphere
- usable crop for its section
- sufficient resolution
- palette compatibility
- enough safe area for text if text overlays it
- no obvious stock cliché
- no watermark
- no misleading subject
- no broken URL
- no tiny decorative-only role unless intentionally secondary

Reject images that:
- look generic
- fight the selected palette
- have no focal point
- are too busy for text
- are low resolution
- feel like filler
- do not support the section’s job
- only exist because the agent needed “an image”

==================================================
PHASE 5 — ASSET MANIFEST REQUIREMENT
==================================================

Create/update:

templates/unsplash-asset-manifest.template.md
templates/unsplash-asset-manifest.template.json

Also add project artifact requirement:

docs/design/unsplash-asset-manifest.md

Each selected Unsplash image must include:
- local filename
- local path
- Unsplash photo id
- source page URL: links.html
- download URL: links.download or links.download_location if available
- photographer name
- photographer username
- description
- alt_description if available
- original width/height
- dominant color
- blur_hash if available
- selected crop/orientation
- image role
- section usage
- why selected
- palette relationship
- text overlay/safe-zone notes
- attribution note if needed

If the app downloads images locally:
- store them under src/assets/<project>/ or public/images/<project>/
- do not hotlink casually unless project explicitly allows it
- document whether image is local or remote

If using direct Unsplash image URLs:
- use the correct `urls.regular`, `urls.full`, `urls.small`, etc. based on need
- avoid raw huge images for normal page use unless necessary
- prefer optimized local copies for production-like demos

==================================================
PHASE 6 — DOWNLOAD / ATTRIBUTION / PRODUCT TRUTH RULES
==================================================

Add rules:

# Unsplash Download and Attribution Discipline

Agents must not pretend images are owned by the project.

Agents must preserve:
- photographer name
- source URL
- Unsplash photo id
- download/download_location if available

If using the Unsplash API, prefer following Unsplash API expectations around download tracking by using the provided download/download_location metadata where applicable.

For local demos:
- record source and photographer in manifest
- keep alt text accurate
- do not imply the image depicts the actual product/company unless true

Product truth:
- Unsplash images are mood/atmosphere/source material
- they are not proof of real product operation
- do not use stock imagery as factual evidence
- do not label stock images as internal labs, real customers, real products, or real facilities

==================================================
PHASE 7 — CREATE ASSET SOURCING SKILL
==================================================

Create:

skills/unsplash-asset-sourcing/SKILL.md

Purpose:
Help agents plan, select, document, and use Unsplash imagery for image-led frontend work.

When to use:
- landing pages
- portfolios
- creative/editorial sites
- image-first frontend
- projects where real imagery is required
- before implementation when image roles are needed

Required inputs:
- product concept
- visual mode
- palette direction
- section plan
- image roles
- optional reference screenshots

Required outputs:
- docs/design/unsplash-search-plan.md
- docs/design/unsplash-asset-manifest.md
- local downloaded assets or documented remote URLs
- alt text
- attribution/source metadata

Workflow:
1. define image roles
2. create search queries
3. choose orientation/color/content filters
4. inspect candidates
5. reject generic/filler images
6. select final images
7. download or document URLs
8. write manifest
9. connect images to section composition
10. verify image crops/responsiveness

Stop conditions:
- no real images found
- images are irrelevant
- image source metadata missing
- selected images are placeholders/filler
- image role is decorative only when page is image-first
- image cannot be used without breaking layout/text readability

==================================================
PHASE 8 — UPDATE EXISTING SKILLS / WORKFLOWS
==================================================

Update:

skills/image-first-frontend/SKILL.md
skills/landing-page-craft-director/SKILL.md
skills/visual-spec-compiler/SKILL.md
skills/frontend-art-director-review/SKILL.md
skills/anti-ai-slop-review/SKILL.md
skills/screenshot-scorecard-review/SKILL.md
skills/visual-target-reconstruction/SKILL.md
skills/anti-ai-tell-preflight/SKILL.md if present

Add:
- if real imagery is needed, use unsplash-asset-sourcing
- image role must be documented before implementation
- every major image must have manifest entry
- reject generic stock filler
- verify text safe zones
- verify responsive crops
- no fake product screenshots or CSS-div placeholders

Update workflows:

agent-workflows/image-first-frontend-workflow.md
agent-workflows/frontend-aha-moment-workflow.md
agent-workflows/reference-locked-build-mode.md
agent-workflows/simple-visual-reference-workflow.md

Add:
- image sourcing phase before implementation
- unsplash-search-plan artifact
- unsplash-asset-manifest artifact
- asset role validation

==================================================
PHASE 9 — UPDATE PROMPT TEMPLATES
==================================================

Update these templates if present:

templates/prompts/master-next-app-prompt.md
templates/prompts/codex-new-frontend-prompt.md
templates/prompts/codex-landing-image-first.md
templates/prompts/codex-imagegen-frontend-web.md
templates/prompts/codex-visual-review.md
templates/prompts/implementation-after-selected-direction.md

Add Unsplash section:

## Unsplash Asset Sourcing

If real imagery is required:
- create docs/design/unsplash-search-plan.md
- define image roles
- search with query/orientation/color/content_filter/order_by
- select images based on art direction and crop quality
- download locally when possible
- create docs/design/unsplash-asset-manifest.md
- include photographer/source/download metadata
- verify responsive crops and text safe zones
- do not use placeholder or fake imagery

==================================================
PHASE 10 — SCORECARD UPDATE
==================================================

Update:

evaluation/ui-scorecard.md

Add category:

## Asset Sourcing / Image Truth

Caps:
- image-first page uses no real images or documented image source: max 6
- Unsplash images used without source/photographer manifest: max 6
- major image has no defined role: max 6
- image feels generic/filler stock: max 6
- image crop breaks responsive layout: max 5
- text overlays busy image without safe-zone/scrim: max 5
- image is used as factual product proof without truth basis: max 5
- broken remote image URL: max 4
- missing alt text for meaningful image: max 6
- stock imagery fights selected palette: max 6

Add:
These caps do not apply to purely typographic/minimal pages where image use is explicitly not part of the chosen direction.

==================================================
PHASE 11 — DESIGN INTELLIGENCE
==================================================

Create:

design-intelligence/unsplash-query-playbook.json
design-intelligence/unsplash-asset-guidance.md

Query playbook should include categories:
- robotics / machine / industrial
- nocturnal botanical / flowers / greenhouse / moonlight
- architecture / interior / spaces
- fashion/editorial / portraits
- product material / macro texture
- technology / lab / science
- landscape / atmospheric
- abstract light / glass / water

For each:
- useful queries
- useful orientation
- useful color filters
- image roles
- avoid terms
- common stock clichés

==================================================
PHASE 12 — AGENTS / README UPDATE
==================================================

Update:

AGENTS.md
README.md
design-dna/00_COMPACT_AGENT_CONTEXT.md
design-dna/new-app-generation-rules.md

Add routing:
Use unsplash-asset-sourcing when:
- real imagery is needed
- image-first frontend is active
- landing page depends on photography
- user asks for Unsplash or real image assets
- visual spec includes image roles but no assets

Add:
For visual-heavy work, images are not filler. They must have roles, manifests, crop strategy, palette relationship, and source truth.

==================================================
PHASE 13 — VALIDATION
==================================================

Update skill registry if present.

Run:

node tools/design-os.mjs doctor
node tools/design-os.mjs list-skills
git diff --check

If JSON files are created/edited, parse them:

find design-intelligence -name "*.json" -type f -print0 | xargs -0 -I{} node -e "JSON.parse(require('fs').readFileSync('{}','utf8')); console.log('ok {}')"

Final response must include:
- raw docs archived
- files created
- files updated
- new skill created
- templates created/updated
- scorecard caps added
- design intelligence created
- skill registry updated
- validation results
- what remains manual
- confirmation no frontend app was modified
- confirmation protected folders untouched

Do not claim success if:
- Unsplash docs were not archived
- no unsplash-asset-sourcing skill was created
- no asset manifest template was created
- no scorecard caps were added
- no prompt templates were updated
- JSON validation fails