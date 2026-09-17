# Horizontal Scroll Safety Failure

Horizontal scroll is allowed only when it creates readable route states.

Observed failure:
- The route shows partial containers and cut text.
- Active content is split across viewport edges.
- The user sees fragments, not a designed scroll chapter.

Prevention:
- Define a route map and readable resting states.
- Active panel must be fully readable.
- Inactive panels may peek only when active content is safe.
- Mobile/tablet fallback must simplify to a readable flow if needed.
