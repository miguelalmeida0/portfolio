# Fake Case File Identifiers

Fake labels such as `Case File`, `CL-2049`, dossier numbers, and operation IDs are banned as decorative UI atmosphere.

## Why It Fails

They read as generated fiction. Real products use identifiers only when users need to search, reference, compare, audit, or report them.

## Detect

- fake case IDs without a data source
- incident-like IDs used as visual mood
- dossier language in ordinary product UI

## Fix

Use the actual entity name or task label. Keep real IDs secondary and searchable.

## Score Caps

- fake case-file or dossier identifier: max score 3
- fake ID used as visual atmosphere: max score 3
