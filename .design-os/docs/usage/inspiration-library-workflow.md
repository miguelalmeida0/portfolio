# Inspiration Library Workflow

The inspiration library helps agents collect and classify visual references safely before implementation.

## Where Files Go

- Source config: `inspiration-library/sources/`
- Local screenshots: `inspiration-library/screenshots/`
- Manifest templates/examples: `inspiration-library/manifests/`
- Queue files: `inspiration-library/queues/`
- Project manifest: `inspiration-manifest.local.json`

`inspiration-library/screenshots/` is ignored by git by default except for `.gitkeep`.

## Create A Manifest

```sh
node tools/design-os.mjs new-inspiration-manifest
```

Validate it:

```sh
node tools/design-os.mjs validate-inspiration-manifest inspiration-manifest.local.json
```

## Create A Queue

```sh
node tools/new-inspiration-queue.mjs
node tools/validate-inspiration-queue.mjs inspiration-library/queues/weekend-visual-corpus.queue.json
```

The weekend queue uses structured targets for at least 150 references without pretending screenshots were captured.

## Pinterest Policy

Pinterest is allowed for moodboard discovery only.

- Use it to find visual clusters and search language.
- Do not treat it as award-quality evidence.
- Do not bypass login walls.
- Do not scrape private or blocked pages.
- Keep source URLs and notes.
- Keep screenshots local by default.

## Award And Gallery Sources

Use `inspiration-library/sources/award-sites.json` for:

- Awwwards
- FWA
- CSS Design Awards
- Godly.website
- Mobbin
- Lapa Ninja
- Landingfolio
- SiteInspire
- Behance
- Dribbble
- Pinterest

Use `inspiration-library/sources/ui-gallery-sources.json` to track collection goals by category.

## Screenshot Policy

- Screenshots are local evidence by default.
- Do not commit copyrighted screenshots publicly unless Migi explicitly approves.
- Do not use screenshots as production assets.
- Do not capture or scrape private, blocked, or paywalled pages.
- Do not remove attribution notes.

## Visual Targets

Visual targets are evidence, not production assets.

If Migi asks for exact visual copying, create a target-copy report and keep target/current differences explicit. Do not place target screenshots into production UI.

## No Paid Tools

This workflow does not require:

- paid tools
- API keys
- hosted Lovable
- screenshot-to-code generation
- Onlook hosted usage
- external model calls
