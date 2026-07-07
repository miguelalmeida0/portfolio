# Motion Tool Stack Guidance

Use this as a decision tree before implementing significant animation.

## Tool Selection Rule

Choose the smallest tool that can express the required choreography without harming accessibility, performance, or implementation clarity.

## Quick Routing

- **CSS transitions / keyframes:** product feedback, simple reveals, low-complexity state.
- **CSS Scroll-Driven Animations:** simple native scroll-linked progress when support and fallback are acceptable.
- **Motion for React:** React component state, layout animation, scroll values, parallax, micro-interactions.
- **GSAP + ScrollTrigger:** cinematic pinned sections, scrubbed timelines, horizontal scrollytelling, award-level landing motion.
- **Lenis:** scroll feel coordination for cinematic pages, only when native scroll is not enough.
- **View Transition API:** image-to-detail and route continuity.
- **WAAPI:** isolated programmatic motion without a full animation framework.
- **Rive / Lottie:** authored brand/illustration moments, not layout choreography.

## Advanced Motion Rule

If Migi asks for advanced, cinematic, artistic, Awwwards/Godly/Recent-level, scroll, or portfolio motion, do not ship a single background animation. Create `docs/design/motion-choreography-plan.md`, choose the tool stack, and prove at least page/section, image/media, typography, nav/menu, and micro-feedback layers.

## Reduced Motion

Reduced motion is not optional. It should remove spatial movement, scrubbed scroll, parallax, and looping motion while preserving content order, state, and meaning.

