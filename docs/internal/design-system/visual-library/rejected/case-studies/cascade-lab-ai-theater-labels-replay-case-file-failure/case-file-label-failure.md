# Fake Case File Label Failure

`Case File CL-2049` reads as fake dossier language. It is not how a real product would label a useful incident record unless the domain explicitly has case records with real identifiers.

This pattern makes the UI feel like a generic AI scenario instead of a tool built around user tasks.

## Rule

Do not invent case-file, dossier, operation, or incident IDs as aesthetic garnish.

## Score Caps

- fake case-file or dossier identifier: max score 3
- fake ID used as visual atmosphere: max score 3
