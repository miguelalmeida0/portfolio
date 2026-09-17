# Failure Report

## Summary

Late Check FM reached a promising direction but still had visible integrity blockers: overlapping label containers, cut text, and a fixed overlay collision. This should have failed before final handoff.

## Failure Class

- Overlapping critical containers.
- Cut/clipped words.
- Fixed or overlay element covering content.
- Final validation not fail-closed.

## Why It Kills Trust

Users read clipped words and colliding containers as broken implementation. For Migi, this also means the agent's final report cannot be trusted: visible screenshots contradict the claim that the UI is ready.

## Required Fix

- Create and run a final UI integrity gate.
- Treat screenshot evidence as stronger than build/lint.
- Block final response until P0 layout failures are fixed and validation reruns.
