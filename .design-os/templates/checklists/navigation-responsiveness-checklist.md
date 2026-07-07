# Navigation Responsiveness Checklist

Use this for every visual/product/landing/mobile page with navigation.

## Variants

- Desktop nav variant is defined.
- Tablet nav variant is defined.
- Mobile/compact nav variant is defined.
- Overflow behavior is defined.
- Active state behavior is defined.

## Compact Nav Implementation Pattern

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

## Review

- 768px screenshot proves compact nav clarity.
- 390px screenshot proves compact nav clarity.
- No arbitrary abbreviations appear as the only visible label.
- Every icon-only item has a full accessible name.
- Active item is understandable without decoding.
