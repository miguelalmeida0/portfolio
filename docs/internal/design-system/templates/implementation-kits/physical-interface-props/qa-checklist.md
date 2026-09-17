# QA Checklist

- Every prop has a role.
- Prop text never clips.
- Props do not cover critical text, controls, or media subjects.
- Material language matches the product world.
- Mobile fallback preserves meaning.
- Decorative props are limited and secondary.

# Compact Nav Implementation Pattern

For compact viewports:

- prefer icon + active full label
- never show only arbitrary initials
- maintain aria-label with full destination name
- use title only if it does not create browser-native tooltip issues in art-directed UI
- ensure 44px minimum hit target where practical
- do not let active state change width enough to break layout
- no giant empty nav bar after label collapse

Example acceptable JSX pattern:

```tsx
<button aria-label="Check-in" data-nav-item>
  <MaterialIcon name="login" aria-hidden="true" />
  <span className="sr-only">Check-in</span>
  <span className="active-label">Check-in</span>
</button>
```

If Material Icons package is not available:

- use project-approved existing icons
- or create simple inline SVG icons
- do not install new dependencies unless explicitly approved
