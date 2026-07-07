# Unsplash Asset Sourcing Rules

Unsplash is an asset source for real photographic atmosphere and editorial material. It is not proof of product operation, company facts, real facilities, or owned imagery.

## Use Unsplash When

- a visual-heavy page needs real photographic atmosphere
- the concept requires image-led composition
- landing, portfolio, artistic, editorial, or creative work needs real visuals
- Migi asks for real images
- generated or fake assets would weaken product truth
- a direction gate needs credible image roles before implementation

## Do Not Use Unsplash When

- the product requires exact real company, product, customer, team, or facility images
- the brief requires original proprietary visuals
- Migi provides exact assets
- images would create misleading factual claims
- placeholders would be more honest than unrelated stock
- the selected direction is explicitly typographic or image-free

## Search Plan Requirement

Before sourcing Unsplash images, create:

`docs/design/unsplash-search-plan.md`

Required sections:

```md
## Image roles needed

## Queries

For each role:
- primary query:
- alternate query:
- color filter if useful:
- orientation:
- content_filter:
- order_by:
- reason:
```

Use the `GET /search/photos` endpoint conceptually.

Supported search parameters:

- `query`
- `page`
- `per_page`
- `order_by`: `relevant` or `latest`
- `collections`
- `content_filter`: `low` or `high`
- `color`: `black_and_white`, `black`, `white`, `yellow`, `orange`, `red`, `purple`, `magenta`, `green`, `teal`, `blue`
- `orientation`: `landscape`, `portrait`, `squarish`

Rules:

- hero images usually need landscape orientation
- portrait images are useful for vertical cards or editorial panels
- squarish images are useful for object/specimen tiles
- use color filters only when they support the palette
- prefer `content_filter: high` for public-facing projects unless there is a documented reason not to
- use `order_by: relevant` for concept matching
- use `order_by: latest` only when recency matters

## Unsplash Image Selection Quality Bar

A selected image must have:

- strong composition
- clear focal object or atmosphere
- usable crop for its section
- sufficient resolution
- palette compatibility
- enough safe area for text if text overlays it
- no obvious stock cliche
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
- do not support the section's job
- only exist because the agent needed "an image"

## Asset Manifest Requirement

Every selected Unsplash image must be documented in:

`docs/design/unsplash-asset-manifest.md`

Each manifest entry must include:

- local filename
- local path
- Unsplash photo id
- source page URL from `links.html`
- download URL from `links.download` or `links.download_location` if available
- photographer name
- photographer username
- description
- alt description if available
- original width and height
- dominant color
- blur hash if available
- selected crop/orientation
- image role
- section usage
- why selected
- palette relationship
- text overlay / safe-zone notes
- attribution note if needed

If the app downloads images locally:

- store them under `src/assets/<project>/` or `public/images/<project>/`
- do not hotlink casually unless the project explicitly allows it
- document whether each image is local or remote

If using direct Unsplash image URLs:

- choose `urls.regular`, `urls.full`, `urls.small`, or `urls.thumb` based on need
- avoid `urls.raw` huge images for normal page use unless necessary
- prefer optimized local copies for production-like demos

## Download And Attribution Discipline

Agents must not pretend images are owned by the project.

Agents must preserve:

- photographer name
- source URL
- Unsplash photo id
- download or download-location metadata when available

If using the Unsplash API, follow Unsplash API expectations around download tracking by preserving and using the provided download/download-location metadata where applicable.

For local demos:

- record source and photographer in the manifest
- keep alt text accurate
- do not imply the image depicts the actual product/company unless true

## Product Truth

- Unsplash images are mood, atmosphere, subject, texture, or editorial source material.
- They are not proof of real product operation.
- Do not use stock imagery as factual evidence.
- Do not label stock images as internal labs, real customers, real products, real facilities, real robot fleets, real studies, or real teams unless that is true.

## Stop Conditions

- no relevant real images were found
- selected images are generic filler
- source or photographer metadata is missing
- image role is undefined
- image crop breaks responsive layout
- text overlay cannot be protected
- stock imagery creates a misleading factual claim
