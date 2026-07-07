---
name: unsplash-asset-sourcing
description: Plan, select, document, and verify Unsplash imagery for image-led frontend work, landing pages, portfolios, creative/editorial sites, and concepts that need real photographic assets with source truth.
---

# Unsplash Asset Sourcing

## Purpose

Help agents plan, select, document, and use Unsplash imagery for image-led frontend work without falling into fake screenshots, placeholder rectangles, CSS-div imagery, generic stock filler, or misleading product claims.

## Use When

- landing pages need real photography
- portfolios need editorial or project imagery
- creative/editorial sites need photographic atmosphere
- image-first frontend is active
- Migi asks for real images or Unsplash assets
- a visual spec includes image roles but no assets
- generated/fake assets would weaken product truth

## Do Not Use When

- Migi provides exact production assets
- the product requires exact real company, product, customer, facility, team, or proprietary images
- imagery would create misleading factual claims
- the selected direction is explicitly typographic/minimal and image-free
- unrelated stock imagery would be less honest than a placeholder

## Required Inputs

- product concept
- visual mode
- selected direction
- palette direction
- section plan
- image roles
- optional reference screenshots
- product-truth constraints

## Files To Read

- `design-dna/unsplash-asset-sourcing-rules.md`
- `design-dna/art-directed-palette-exploration.md` when expressive mode is active
- `design-intelligence/unsplash-asset-guidance.md`
- `design-intelligence/unsplash-query-playbook.json`
- `templates/unsplash-asset-manifest.template.md`
- `templates/unsplash-asset-manifest.template.json`

## Required Outputs

- `docs/design/unsplash-search-plan.md`
- `docs/design/unsplash-asset-manifest.md`
- local downloaded assets or documented remote URLs
- accurate alt text
- photographer/source/download metadata
- crop and responsive notes
- text safe-zone notes

## Workflow

1. Define image roles from the selected direction and section plan.
2. Create `docs/design/unsplash-search-plan.md`.
3. For each role, choose query, alternate query, orientation, optional color filter, `content_filter`, and `order_by`.
4. Inspect candidates against composition, focal object, crop quality, palette fit, safe text zones, resolution, and source metadata.
5. Reject generic, misleading, filler, low-resolution, over-busy, or palette-fighting images.
6. Select final images.
7. Download locally when possible or document remote URLs explicitly.
8. Write `docs/design/unsplash-asset-manifest.md`.
9. Connect every selected image to a section composition and image role.
10. Verify responsive crops and text safe zones at 1440 / 768 / 390.

## Search Defaults

- Use `GET /search/photos` conceptually.
- Use `content_filter: high` for public-facing projects unless documented otherwise.
- Use `order_by: relevant` for concept matching.
- Use `order_by: latest` only when recency matters.
- Use `orientation: landscape` for hero atmosphere.
- Use `orientation: portrait` for editorial panels and vertical cards.
- Use `orientation: squarish` for specimen, object, or tile systems.
- Use color filters only when they support the selected palette.

## Manifest Entry Requirements

Each selected image must include:

- local filename
- local path
- Unsplash photo id
- source page URL from `links.html`
- download URL from `links.download` or `links.download_location` when available
- photographer name
- photographer username
- description
- alt description
- original width / height
- dominant color
- blur hash when available
- selected crop / orientation
- image role
- section usage
- why selected
- palette relationship
- text overlay / safe-zone notes
- attribution note if needed
- product-truth note

## Review Questions

- Does every major image have a role?
- Does the image support the section job?
- Is the image strong enough to drive composition?
- Is the crop robust at 1440 / 768 / 390?
- Can text sit on it safely, or should text move outside the image?
- Does the image fit the selected palette?
- Is the image too generic or obviously stock?
- Is the image source metadata preserved?
- Is alt text accurate?
- Could the image mislead users into believing something false about the product?

## Stop Conditions

- no real images found
- selected images are irrelevant
- image source metadata is missing
- selected images are placeholders or filler
- image role is decorative-only when the page is image-first
- image cannot be used without breaking layout or text readability
- image crop fails responsive checks
- image creates misleading product proof

## Output Contract

```md
Unsplash asset sourcing: active/inactive
Search plan:
Image roles:
Selected images:
Local assets or remote URLs:
Manifest:
Alt text:
Attribution/source metadata:
Crop strategy:
Text safe zones:
Palette relationship:
Product-truth notes:
Rejected image types:
Remaining image risks:
```

## Scorecard Caps

- Image-first page uses no real images or documented image source: max score 6.
- Unsplash images used without source/photographer manifest: max score 6.
- Major image has no defined role: max score 6.
- Image feels generic/filler stock: max score 6.
- Image crop breaks responsive layout: max score 5.
- Text overlays busy image without safe-zone/scrim: max score 5.
- Image is used as factual product proof without truth basis: max score 5.
- Broken remote image URL: max score 4.
- Missing alt text for meaningful image: max score 6.
- Stock imagery fights selected palette: max score 6.

## Audit Upgrade: Self-Correction Contract

Audit fix: Become an asset pipeline, not only Unsplash lookup.

Required evidence:
- role/query/orientation/source/license/crop/alt/product-truth manifest for every asset source.

Repair routing:
- image-first-frontend owns placement repairs; truthful-state-product-naming owns proof claims.

Machine-readable verdict:
- Emit or update `templates/skill-verdict.template.json` with `skillId: "unsplash-asset-sourcing"`, `status`, `evidence`, `machineVerdict.scoreCaps`, `repairTasks`, and `nextSkills`.

Self-correction rule:
- If this skill finds a P0/P1 issue, it must name the owner skill, target artifact or selector, concrete action, acceptance check, and evidence needed to close the repair.
