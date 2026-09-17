# Interface Feel Rules

Use this after the main UI exists and before final screenshot review.

## Rule

A UI can be visually promising and still feel unfinished if interaction feedback, spacing, state handling, and invisible details are weak.

Make Interfaces Feel Better is a micro-polish gate. It must not replace visual direction, reference lock, or layout integrity.

## What To Improve

- invisible details
- hover states
- press states
- focus states
- selected states
- selected+hover and selected+focus states
- disabled states
- loading states
- empty states
- error states
- perceived performance
- typography smoothing
- tabular numbers for aligned data
- consistent spacing
- consistent icon/button sizing
- local response to user action
- no dead surfaces
- no jank
- no clumsy motion
- no generic UI defaults

## Principles

- Feedback should be immediate.
- State should be visible.
- Interactive labels must stay readable in every state, including selected+hover and selected+focus.
- Motion should clarify, not decorate.
- Empty/loading/error states should be product-specific.
- Polish should support the core loop, not distract from it.
- Small details should compound quietly.

## Stop Condition

If the UI works but feels dead, unresponsive, generic, clumsy, or loses label readability in any hover/focus/selected combined state, run this pass before screenshot-scorecard review.
