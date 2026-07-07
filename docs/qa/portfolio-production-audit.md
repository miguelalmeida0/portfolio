# Portfolio Production Audit

Date: 2026-07-05  
Scope: homepage, work section, contact section, story route, CV route  
Evidence: `docs/qa/screenshots/portfolio-production-audit/`

Design OS was available and read. Product Design saved user context was not available.

## 1. Current First Impression

The portfolio is memorable as an editorial poster, especially the black hero, red portrait, and name lockup. It does not yet work as a hiring artifact. A recruiter landing on the first viewport sees a strong visual identity and the phrase "Software Engineer", but not enough practical signal: role level, product specialty, location, openness, stack, or proof.

The hero currently makes the visitor admire the page before it helps them decide whether Miguel fits a role.

Evidence:
- `baseline-desktop-hero.png`
- `baseline-mobile-hero.png`

## 2. Recruiter Clarity Issues

- The first viewport does not clearly say "mid-level frontend/product engineer".
- "Software Engineer" is too broad and undersells the frontend/product UI specialty.
- Location, remote openness, stack, and F24 proof are not visible above the fold.
- Primary actions are absent from the hero. Recruiters cannot immediately choose Work, CV, or Contact without interpreting the decorative navigation.
- The nav has "CV", but the page also uses "The Sheet"; recruiters should not have to decode that naming.
- The contact section appears late and the email wraps badly on desktop and mobile.

## 3. Senior-Engineer Credibility Issues

- The work section lists visual concepts, but does not explain role, stack, problem, contribution, constraints, proof, or engineering decisions.
- The site says reusable systems and reliability, but does not show enough concrete habits: state design, QA, responsive checks, accessibility, production constraints, component extraction, or design-system work.
- F24 credibility is mentioned in copy, but the homepage does not give it a structured proof section.
- The story has useful material but often translates experience into mood words rather than engineering behaviors.

## 4. Visual-System Issues

- Hero red is powerful, but the rest of the site moves into copper/dark surfaces without a clear bridge. The result feels like two brand systems.
- Strong red should stay in the hero identity moment; copper/peach should carry interior emphasis.
- The nav ornaments compete with the hero instead of quietly supporting it.
- Some uppercase microcopy is too small and too widely tracked to carry important information.
- Cards are dark and tasteful, but their hierarchy currently favors screenshot presence over hiring evidence.

## 5. Navigation Issues

- The bracketed nav is visually heavy and takes too much attention in the hero.
- Mobile nav currently becomes a two-row top grid, consuming meaningful first-viewport space.
- Active state is based on pathname/hash and is not robust for scroll-position sections.
- Navigation labels are understandable, but the treatment makes them feel like a graphic element before a utility.
- Sticky nav risks covering anchor starts unless spacing is managed deliberately.

## 6. Project-Section Issues

- The current section title "Projects" and equal three-card grid read as a gallery.
- Tiny Invite, Toikien, and Tickerbase are presented as visual screenshots, not as proof of frontend/product engineering.
- There is no featured project hierarchy.
- There are no role/stack/problem/contribution/proof fields.
- "Toikien" reads like a typo for "Tolkien". If intentional, it needs a clarifying subtitle.
- All cards link to `/story`, which is not a clear case-study destination.

## 7. Story/Copy Issues

- The story is distinctive but too poetic in hiring-critical places.
- The copy repeats ideas like calm, care, restraint, details, and reliability without enough concrete examples.
- Aviation is a useful differentiator, but it needs a stronger practical translation: checklist thinking, failure-state respect, precise communication, and QA discipline.
- F24 should be described as critical communication software used by thousands of operators, not only as an emotional lesson.
- Some visible UI copy uses em dashes and ornamental phrasing where simpler hiring language would be clearer.

## 8. Contact/CV Issues

- The homepage email visibly breaks across lines on desktop and mobile.
- Direct contact exists, but the terminal-style interaction visually competes with the practical contact actions.
- The copy button is useful and already has feedback, but the tile layout forces bad wrapping.
- LinkedIn and phone are present, but the direct hiring path should also include CV download near contact.
- The CV route has a strong editorial sheet, but its first viewport is poster-like and does not immediately explain that "The Sheet" means a practical CV.
- Figure labels need to be more recruiter-readable and less cryptic.

## 9. Accessibility Issues

- The portrait is treated as part of the visual identity but should remain decorative or have clear alt intent. Current implementation uses a labeled figure with an empty image, which can be confusing.
- Focus states exist in places, but nav focus is overly ornamental and not sufficiently clear as a product control.
- Some important text is tiny uppercase with wide tracking.
- Terminal interaction is keyboard-accessible at a basic level, but it should remain optional and not be the primary contact path.
- The story uses scroll progress and animated entry; reduced-motion support exists globally, but route-specific behavior should still be checked.
- Clickable project cards need stronger textual affordance than only the whole card being a link.

## 10. Responsive Risks

- Mobile hero currently spends most of the viewport on nav, portrait, and name while providing almost no hiring clarity.
- Desktop contact email wraps poorly despite available horizontal space.
- Mobile contact repeats the same broken email wrapping.
- Project cards collapse, but the content is still screenshot-led and not optimized for scanning.
- Sticky nav can visually hover over section content in screenshots.
- The required widths still need a post-fix sweep: 1440, 1280, 1024, 768, 390.

## 11. Exact Patch Plan

1. Create a design system document that locks the palette: near-black canvas, warm cream text, muted gray secondary text, copper/peach interior accent, red only for hero identity.
2. Rewrite the hero so it keeps the portrait/name lockup but adds a positioning line, proof strip, and working CTAs: View work, Download CV, Contact.
3. Reduce nav visual weight, make it functional first, preserve character only as a light edge detail, and improve mobile behavior.
4. Rebuild work as a proof section with one featured project and two supporting project cards, each with role, stack, problem, contribution, proof, and CTA.
5. Add a concrete "How I build" section focused on reusable UI, production care, design collaboration, and calm systems.
6. Rewrite experience/story copy to connect aviation, UX, F24, and mid-level ownership to practical engineering traits.
7. Fix contact layout so email never breaks badly, direct contact actions come first, and terminal is optional personality.
8. Clarify CV route naming as "CV / The Sheet" and improve profile/figure labels.
9. Verify semantic headings, links/buttons, focus states, image treatment, no dead CTAs, no console errors.
10. Capture required final screenshots and write final QA review docs honestly.
