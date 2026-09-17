# Cascade Lab AI Theater Labels, Replay, And Case File Failure

## Verdict

Rejected execution, direction still salvageable.

## What Failed

- Decorative chips like `Narrative`, `Fictional incident`, and `SEV-2` appeared as repeated page chrome.
- `Replay` and `Mission` language consumed major page space and made the UI feel AI-generated.
- Large replay metadata strips displaced useful task content.
- Bottom content was cut by the viewport.
- Fake `Case File` and `CL-2049` labels made the app feel like robot theater rather than a human-designed incident tool.
- The app used abstract incident theater where real domain sections, route jobs, and data entities should have carried the product.

## Required Future Prevention

- Remove AI-theater chrome before taste scoring.
- Use plain task labels unless a dramatic term maps to a real domain object.
- Do not allocate prime page space to replay/mission/status theater.
- Never use fake case IDs or dossier labels as visual garnish.
- Require a Domain Content Contract before implementation so visible sections, mock data, and route labels come from real business work.
- Block final handoff when content is cut at the bottom edge.

## Screenshots

- `screenshots/cascade-lab-01-ai-theater-status-chips.png`
- `screenshots/cascade-lab-02-replay-metadata-strip-ai-slop.png`
- `screenshots/cascade-lab-03-replay-mission-chrome-wastes-page-space.png`
- `screenshots/cascade-lab-04-bottom-content-clipped-amateur.png`
- `screenshots/cascade-lab-05-case-file-cl-number-ai-slop.png`
