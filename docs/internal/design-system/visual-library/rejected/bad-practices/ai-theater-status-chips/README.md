# AI Theater Status Chips

Decorative chips such as `Narrative`, `Fictional incident`, and fake severity badges are banned when they do not drive real product behavior.

## Why It Fails

They make the UI feel like a generated scenario instead of a human product. They add drama but not structure.

## Detect

- repeated narrative/status chips across pages
- fake severity on static content
- labels that do not filter, scope, route, or change data

## Fix

Remove them. Use real route labels, filters, or metadata only when they support a user task.

## Score Caps

- fake narrative/fictional incident chip: max score 4
- fake severity/status badge used as theater: max score 4
- repeated AI-theater chips across pages: max score 3
