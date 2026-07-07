# Scroll Readability First

Scroll choreography must yield to readability.

If scroll choreography causes content to become unreadable, clipped, partially visible, overlapped, or stranded in blank space, the scroll choreography must be simplified or removed.

## Hard Blockers

- scroll movement creates unreadable text
- scroll route hides active content
- scroll state shows blank viewport with no reward
- scroll state presents only content fragments
- scroll experience is more important than comprehension
- user cannot read full active card/panel
- scroll interaction causes layout failure on any tested width

## Required

- active content must be readable at each scroll stop/state
- if route cannot be made safe, downgrade to simple vertical flow
- mobile-proven layout can be used as source of truth
- do not preserve elite scroll if it breaks layout integrity

## Score Caps

- scroll choreography damages readability: max score 3
- scroll route creates partial unreadable content: max score 3
- scroll creates huge accidental blank state: max score 4
- agent preserves scroll gimmick despite readability failure: max score 2
