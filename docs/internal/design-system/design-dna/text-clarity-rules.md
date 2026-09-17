# Text Clarity Rules

Text clarity is a post-build review layer. Do not run it during Fast Direction Gate.

## Rule

Interface copy must help the user understand state, action, consequence, and recovery. Vague or generic copy is a product-quality failure, not a writing preference.

## Required Checks

- CTAs say what action happens.
- Error messages explain what happened and how to fix it.
- Destructive confirmations name the exact object and consequence.
- Empty states explain what is missing and the next action.
- Loading states describe what is happening when the wait is meaningful.
- Success states confirm what changed.
- Terms stay consistent across navigation, panels, forms, and messages.
- Form labels are real labels, not placeholder-only hints.
- Copy is translation-safe and not dependent on English idioms.

## Rejected

- `Submit`, `OK`, `Click here`, or `Are you sure?` as default product copy.
- Error humor.
- Generic AI copy that sounds polished but says little.
- Technical jargon without context.
- Redundant headings and intros that slow scanning.

## Use

Route `skills/text-clarity-review/SKILL.md` after implementation for copy-heavy product UI, forms, settings, dashboards, destructive actions, onboarding, empty states, loading states, and error states.
