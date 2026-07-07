# Domain Realism / Mock Data Checklist

Use before visual spec and again before final review.

## Domain Contract

- [ ] Business type is named.
- [ ] Primary users are named.
- [ ] Core entities are domain-specific.
- [ ] Entity relationships are clear.
- [ ] Routes/pages match real workflows.
- [ ] Each route has a job.
- [ ] Navigation labels name user tasks.

## Mock Data

- [ ] Mock records are plausible for the business.
- [ ] Data lives in fixtures/constants/data files where practical.
- [ ] Metrics have units.
- [ ] Values have plausible ranges.
- [ ] Statuses have domain meaning.
- [ ] Time windows or timestamps are present when needed.
- [ ] Source/freshness/sample labeling is honest.

## Anti-Theater

- [ ] No random `mission control`, `mission room`, `control room`, or `command center` label without a real job.
- [ ] No `topology`, `traces`, or `system map` unless the product domain justifies them.
- [ ] No fake case files, replay doctrine, fake severity chips, or abstract incident theater replacing real sections.
- [ ] No random values or placeholder metrics.
- [ ] No one-page pileup when real pages/routes are needed.

## Evidence

- [ ] `docs/design/visual-spec.md` includes Domain Content Contract.
- [ ] Relevant mock data files are referenced.
- [ ] Screenshot review verifies real domain sections are visible.
- [ ] Scorecard caps were applied if any domain realism issue remains.
