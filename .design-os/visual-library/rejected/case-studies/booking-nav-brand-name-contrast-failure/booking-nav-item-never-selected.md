# Booking Nav Item Never Selected

## Failure
The Booking navigation item could be clicked but never showed selected state.

## Why It Fails
Navigation is a stateful control. If one item can never become active, the route system is broken and users cannot trust location feedback.

## Detection
- Click every nav item in order.
- Include first and last items.
- Confirm clicked item receives visual active state.
- Confirm `data-nav-active`, `data-nav-selected`, `aria-current`, or `aria-selected` matches the clicked item.

## Required Fix
- Key active state by stable nav id.
- Ensure Booking has a unique `data-nav-id`.
- Ensure click handler passes Booking's id.
- Ensure no filtering/reordering breaks active mapping.

## Score Caps
- clicked nav item does not become selected: max score 2
- nav item never receives selected state: max score 2
- no click-through QA of every nav item: max score 5
