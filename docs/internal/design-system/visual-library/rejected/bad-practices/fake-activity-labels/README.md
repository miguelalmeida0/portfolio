# Fake Activity Labels

## What The Failure Is
Labels such as activity feed, live activity, online now, presence, streaming, or currently live appear without actual activity data.

## Why It Feels Like AI Slop
The interface borrows operational language to look dynamic while remaining static.

## How To Detect
- Search for activity/realtime/presence language.
- Check whether there is a data source, timestamp, polling, websocket, SSE, or update cadence.
- Flag static content labeled as activity.

## How To Fix
Use accurate static-language labels like Field notes, Latest notes, Today, Current board, or Station board.

## Score Caps
- fake realtime/presence status: max score 3
- no justification for live terminology: max score 5
- repeated fake activity language: max score 3

## Required Future Checks
- copy audit
- data-source proof
- timestamp/update proof if claiming live activity
