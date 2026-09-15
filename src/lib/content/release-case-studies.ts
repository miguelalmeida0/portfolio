import { caseStudies, type CaseStudy } from './case-studies';

const legacySecondVoice = caseStudies.find((study) => study.slug === 'ghostwriter');

if (!legacySecondVoice) {
  throw new Error('Second Voice AI source case study is missing');
}

export const secondVoiceStudy: CaseStudy = {
  ...legacySecondVoice,
  slug: 'second-voice-ai',
  title: 'Second Voice AI',
  type: 'Independent AI product · product, design & engineering',
  thesis: 'Rewrite a passage through a chosen literary voice while keeping the transformation visible and controllable.',
  status: 'Live deployment; production-readiness hardening is still in progress.',
  limitations: [
    'The deployment exists, but owner-canary and limited-beta readiness gates are not cleared.',
    'Live AI access remains bounded by authentication, provider, migration, and operational controls.',
    'Financial tests use injected provider and ledger dependencies rather than a production load test.'
  ],
  links: [],
  artifactCaption: 'Second Voice AI · the editorial rewriting interface',
  conditions:
    'The product is deployed, but deployment is not the same as production readiness. Local verification passed; owner-canary and limited-beta gates remain blocked while production migrations, external provider controls, monitoring, backup custody, legal/operator review, and staffed acceptance are completed.'
};

export const vigiaStudy: CaseStudy = {
  slug: 'vigia',
  title: 'VIGIA',
  type: 'Crisis intelligence · spatial decision support · operational systems',
  thesis: 'Turn fragmented incident, route, facility, resource, and environmental information into an operational picture people can act on.',
  role: 'Product strategy · interaction design · frontend engineering · intelligence architecture',
  timeline: 'Independent crisis-intelligence system · Portugal first',
  team: 'Independent',
  stack: 'JavaScript · Node.js · PostGIS · MapLibre · OSRM · operational data adapters · deterministic domain engines',
  problem:
    'During a fast-moving incident, the useful question is rarely just where the fire is. Operators need to understand what changed, which roads and facilities matter, what nearby support is actually available, how far away it is, and what remains unknown. VIGIA connects those pieces instead of turning them into another disconnected dashboard.',
  contribution:
    'I shaped the operational model and interface around incidents, facilities, routes, restrictions, dependencies, situation history, resource feasibility, and consequence-aware intelligence. The public portfolio build keeps the real console structure and domain engines while replacing operational transport with a controlled synthetic scenario.',
  technicalSignal:
    'The public demo runs the actual consequence, mission, planning, and operational-period logic without connecting to production services or creating operational writes.',
  status:
    'Public synthetic read-only demo. It is a portfolio demonstration, not an emergency service or source of operational authority.',
  constraints: [
    'Never fabricate operational facts to make the interface look richer.',
    'A public portfolio build must not expose dispatch, mutation, authentication, secrets, or production data.',
    'Maps must preserve uncertainty and provenance rather than imply safe passage or current conditions.',
    'The product must remain useful when external data or model capabilities are unavailable.'
  ],
  keyFlows: [
    'Inspect an incident and its immediate operational context',
    'See how a road report changes healthcare and fire-response access',
    'Compare stored route options and affected services',
    'Inspect resource feasibility and bounded operational-period schedules',
    'Reset the synthetic scenario without persistent state'
  ],
  technicalDecisions: [
    'Replace the operational API transport at build time with a fail-closed unavailable adapter.',
    'Keep every visitor session in memory with no database, model, authentication, dispatch, or ingestion dependency.',
    'Run retained consequence and planning engines against explicit synthetic inputs instead of replacing the product with static mockups.',
    'Ship a local MapLibre scene with retained Portugal boundary data and synthetic route geometry rather than depending on a live basemap.'
  ],
  designDecisions: [
    'Preserve the approved operational console instead of creating a marketing-site simulation.',
    'Use one persistent synthetic-scenario orientation rather than warning badges on every panel.',
    'Keep addresses, routes, services, consequences, and next inspections closer to the map and mission surfaces.',
    'Disable unavailable controls explicitly instead of leaving dead or misleading actions.'
  ],
  limitations: [
    'Every incident, facility, route, resource, timing, and observation in the public demo is synthetic.',
    'The public scenario does not claim current wildfire conditions, safe passage, dispatch authority, or emergency readiness.',
    'The portfolio build intentionally disconnects operational APIs, live basemaps, thermal services, storage, models, and authentication.',
    'A known duplicate capability-key warning in the XIII scheduling source is preserved rather than hidden by changing operational logic.'
  ],
  links: [
    {
      label: 'Open live synthetic demo',
      href: 'https://vigia-public-demo.onrender.com',
      kind: 'demo',
      status: 'available',
      external: true
    }
  ],
  evidence: [
    {
      id: 'vigia-public-demo-boundary',
      title: 'Public demo boundary',
      claim: 'Operational transport and mutation capability are removed from the browser build.',
      status: 'verified',
      source: 'portfolio-demo/build.mjs and unavailable-api.mjs',
      publicSafe: true
    },
    {
      id: 'vigia-public-demo-tests',
      title: 'Scenario and browser-bundle checks',
      claim: 'The September 15 demo handoff reports 163 passing domain and demo/bundle tests with none skipped.',
      status: 'historical',
      source: 'portfolio-demo/README.md',
      qualification: 'Reported by the project handoff before public deployment; not a browser-performance score.',
      publicSafe: true
    }
  ],
  artifactCaption: 'VIGIA · controlled synthetic portfolio scenario',
  outcome:
    'The public build keeps VIGIA explorable without turning a crisis system into a fake static showcase. A visitor can change a road condition or resource delay and inspect computed consequences, stored routes, service impact, and planning results while the operational network remains disconnected.',
  lesson:
    'For high-stakes software, a convincing demo should preserve the real decision logic while making the boundary between demonstration and operational truth impossible to miss.',
  nextQuestion:
    'How far can the public scenario expand its real decision logic without introducing live operational dependencies or making synthetic state look current?',
  sectionTitles: {
    problem: 'A map alone does not tell an operator what changed.',
    responsibility: 'From fragmented data to an operational picture',
    alternatives: 'Two ways to make a crisis product publicly explorable',
    behavior: 'What the controlled scenario actually changes',
    result: 'A real product surface with a hard public boundary.'
  },
  alternatives: [
    {
      title: 'Publish screenshots or a static mock dashboard',
      body: 'Safe and easy to host, but it removes the actual consequence, mission, routing, and planning behavior that makes VIGIA worth evaluating.'
    },
    {
      title: 'Keep the real console, replace operational transport',
      body: 'Run the existing domain logic against a controlled synthetic scenario while failing closed on every production service and mutation path.'
    }
  ],
  decision:
    'I kept the real operator-console structure and domain engines, then created a separate public-demo boundary that swaps operational transport for an unavailable adapter and feeds the product a deterministic synthetic scenario.',
  tradeoff:
    'The demo cannot show live emergency data or production integrations. In return, recruiters can explore meaningful system behavior without credentials, secrets, database state, paid model calls, or the risk of mistaking the portfolio for an emergency service.',
  behavior: [
    {
      state: 'Road blocked',
      before: 'Stored service routes use the baseline synthetic road state.',
      after: 'The scenario recomputes affected service and route consequences from the explicit blocked-road input.'
    },
    {
      state: 'Information expires',
      before: 'A retained road observation can support the current scenario state.',
      after: 'The interface surfaces that a fresh check is needed instead of silently treating stale information as current.'
    },
    {
      state: 'Resource delayed',
      before: 'The operational-period scenario uses its baseline resource timing.',
      after: 'The bounded planning engine recomputes resource feasibility and schedule impact from the delay.'
    },
    {
      state: 'Unsupported action',
      before: 'A production console control could imply real operational capability.',
      after: 'The public build disables it and states that operational services are not connected.'
    },
    {
      state: 'Reset',
      before: 'The visitor has changed local scenario inputs.',
      after: 'The original synthetic inputs are reconstructed with no persistent storage.'
    }
  ],
  conditions:
    'Public portfolio scenario only. The Render deployment is a static site built from VIGIA XIII portfolio-demo commit 4676e61. The browser artifact intentionally has no operational API, database, authentication, model, dispatch, or persistent-storage connection.'
};

export const releaseCaseStudies = [vigiaStudy, secondVoiceStudy];

export function getReleaseCaseStudy(slug: string): CaseStudy | undefined {
  if (slug === vigiaStudy.slug) return vigiaStudy;
  if (slug === secondVoiceStudy.slug) return secondVoiceStudy;
  return caseStudies.find((study) => study.slug === slug);
}
