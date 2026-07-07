# Clicked Nav Item Not Selected

## What The Failure Is
A nav item can be clicked but never receives active/selected visual state.

## Why It Is Broken UX
Users receive no correct feedback from a primary control. Icon-only nav becomes especially confusing when selected state is missing.

## How To Detect
- Click every nav item.
- Check visual active state, `data-nav-active`, `data-nav-selected`, `aria-current`, and `aria-selected`.
- Confirm mobile and desktop variants behave the same way.

## How To Fix
Use stable nav ids, one navigation config, one active source-of-truth, and shared active-state rendering.

## Score Caps
- clicked nav item does not become selected: max score 2
- nav item never receives selected state: max score 2
- active state is inaccessible/no `aria-current`: max score 5

## Required Future Checks
- click-through QA
- active id/route target agreement
- aria and visual state agreement
