export type EvidenceStatus =
  | 'verified'
  | 'partial'
  | 'historical'
  | 'synthetic'
  | 'proposed'
  | 'not-implemented'
  | 'unknown';

export type CaseStudyEvidence = {
  id: string;
  title: string;
  claim: string;
  status: EvidenceStatus;
  source?: string;
  qualification?: string;
  publicSafe: boolean;
};

export type CaseStudyMetric = {
  id: string;
  label: string;
  value: string;
  status: 'reproduced' | 'historical' | 'synthetic';
  environment?: string;
  source?: string;
  qualification: string;
};

export type CaseStudyDecision = {
  problem: string;
  initialApproach?: string;
  failure: string;
  decision: string;
  tradeoff: string;
  currentResult: string;
  remainingLimitation?: string;
};

export type ProjectLink = {
  label: string;
  href?: string;
  kind: 'case-study' | 'repository' | 'demo';
  status: 'available' | 'private' | 'not-public';
  external?: boolean;
};

export type CaseStudy = {
  slug: string;
  title: string;
  type: string;
  thesis: string;
  role: string;
  timeline: string;
  team: string;
  stack: string;
  problem: string;
  contribution: string;
  technicalSignal: string;
  status: string;
  constraints: string[];
  keyFlows: string[];
  technicalDecisions: string[];
  designDecisions: string[];
  limitations: string[];
  links: ProjectLink[];
  evidence: CaseStudyEvidence[];
  decisions?: CaseStudyDecision[];
  metrics?: CaseStudyMetric[];
  image?: string;
  imageAlt?: string;
  objectPosition?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'camera-harness',
    title: 'Camera Harness',
    type: 'Experimental multimodal system',
    thesis: 'Building an evidence boundary for live visual interfaces',
    role: 'Frontend architecture · browser media · applied AI',
    timeline: 'Research prototype',
    team: 'Independent',
    stack:
      'Svelte · TypeScript · browser media APIs · YOLO-World · ByteTrack · Florence-2 · hosted/local VLMs',
    problem:
      'A live interface can look continuous while its labels, tracks, questions, and answers refer to different visual events.',
    contribution:
      'Built and audited lifecycle ownership, generation-scoped async work, latest-frame backpressure, local tracking, bounded semantic requests, and transient image-memory controls.',
    technicalSignal:
      'Generation-owned async work · latest-frame replacement · bounded transient media',
    status:
      'Research prototype. Perception paths work end to end, while provenance, accuracy, browser breadth, and long-session behavior remain under evaluation.',
    constraints: [
      'Camera and microphone work must be explicitly owned and cleaned up.',
      'Slow model work must not overwrite newer interface state.',
      'Transient image data must remain bounded and mode-specific.',
      'Local and hosted processing boundaries must be visible to the user.'
    ],
    keyFlows: [
      'Ask / Conversation',
      'Watch / Observing',
      'Microscope local object labels',
      'Observe → propose → track → question → confirm or reject'
    ],
    technicalDecisions: [
      'Use cheap continuous signals before invoking deeper model work.',
      'Replace stale queued frames with the newest evidence instead of growing a FIFO.',
      'Attach asynchronous work to a generation and reject responses from stale generations.',
      'Bound raw-image buffers, semantic attempts, tracks, timers, and usage counters.'
    ],
    designDecisions: [
      'Use floating labels instead of permanent detection rectangles.',
      'Keep uncertain model output confirmable rather than presenting it as fact.',
      'Expose the local/hosted boundary as product language, not an implementation footnote.'
    ],
    limitations: [
      'Ask does not consume the visible Microscope track or best crop.',
      'Recognition accuracy and occlusion robustness are not established.',
      'Confidence tiers are heuristic rather than calibrated probabilities.',
      'Neural Field, AirScript, Spatial Lasso, and Spatial Ask are not active in the current integrated UI.'
    ],
    links: [
      {
        label: 'Read case study',
        href: '/work/camera-harness',
        kind: 'case-study',
        status: 'available'
      },
      {
        label: 'Private research repository',
        kind: 'repository',
        status: 'private'
      },
      {
        label: 'No public demo',
        kind: 'demo',
        status: 'not-public'
      }
    ],
    evidence: [
      {
        id: 'camera-lifecycle',
        title: 'Lifecycle ownership',
        claim:
          'Media tracks, requests, timers, generated nodes, crops, and track collections are explicitly cleaned up.',
        status: 'verified',
        source: 'Camera Harness dossier · lifecycle and privacy audit',
        publicSafe: true
      },
      {
        id: 'ask-provenance',
        title: 'Ask provenance',
        claim:
          'Ask captures a fresh bounded frame window after the final transcript and does not share an immutable evidence record with Microscope.',
        status: 'partial',
        source: 'Camera Harness dossier · Ask pipeline trace',
        qualification:
          'The visible object label and the answer can originate from different evidence windows.',
        publicSafe: true
      },
      {
        id: 'integration-drift',
        title: 'Integration drift',
        claim:
          'Neural Field, AirScript, and Spatial Lasso artifacts remain after active UI wiring was removed.',
        status: 'historical',
        source: 'Camera Harness dossier · commits 4b18fce8 and a0f0f5a2',
        publicSafe: true
      },
      {
        id: 'evidence-broker',
        title: 'Shared evidence broker',
        claim:
          'An immutable frame and region evidence store should connect Ask, Microscope, Watch, and future spatial tools.',
        status: 'proposed',
        source: 'Camera Harness dossier · architecture recommendation',
        qualification: 'Architecture recommendation; not implemented.',
        publicSafe: true
      }
    ],
    metrics: [
      {
        id: 'detector-latency',
        label: 'YOLO local detector',
        value: 'Tens of milliseconds',
        status: 'historical',
        environment: 'Retained short Apple-hardware samples',
        source: 'Camera Harness dossier · retained performance artifacts',
        qualification: 'Historical short samples; requires commit-pinned reproduction.'
      },
      {
        id: 'semantic-latency',
        label: 'Florence semantic pass',
        value: 'Several seconds',
        status: 'historical',
        environment: 'Historical local-model evidence',
        source: 'Camera Harness dossier · retained performance artifacts',
        qualification: 'Separate stage, not end-to-end response time.'
      }
    ]
  },
  {
    slug: 'atlas',
    title: 'Atlas',
    type: 'Read-only code intelligence',
    thesis: 'Deterministic risk first. Model explanation second.',
    role: 'Product architecture · frontend · trust boundaries',
    timeline: 'Independent system',
    team: 'Independent',
    stack: 'TypeScript · PostgreSQL · RLS · retrieval · audit trails',
    problem:
      'Code-intelligence tools lose trust when a model invents the underlying risk or tenant context leaks across analysis boundaries.',
    contribution:
      'Designed the product around deterministic risk generation, request-scoped database context, explicit workspace and ingestion-run scope, and retrieval used only to explain established findings.',
    technicalSignal:
      'PostgreSQL RLS · request-scoped context · workspace → repository → ingestion-run scope',
    status:
      'Architecture case study. Public narrative is limited to verified system boundaries and known limitations.',
    constraints: [
      'Read-only analysis must never imply autonomous code modification.',
      'Tenant identity must remain explicit at every database boundary.',
      'The model may explain an established risk but must not invent it.'
    ],
    keyFlows: [
      'Repository ingestion',
      'Deterministic risk generation',
      'Evidence retrieval',
      'Model-assisted explanation',
      'Audit review'
    ],
    technicalDecisions: [
      'Generate risk deterministically before any model explanation.',
      'Scope rows by workspace, repository, and ingestion run.',
      'Set database identity for each request and enforce it through RLS.',
      'Retain audit trails around ingestion and explanation.'
    ],
    designDecisions: [
      'Separate evidence from explanation in the interface.',
      'Keep risk provenance inspectable before offering model language.',
      'Present security scope and known gaps alongside the result.'
    ],
    limitations: [
      'No production adoption claim is made.',
      'Model explanations still require review.',
      'Performance observations are only useful with their dataset and environment context.'
    ],
    links: [
      {
        label: 'Read case study',
        href: '/work/atlas',
        kind: 'case-study',
        status: 'available'
      },
      { label: 'Private repository', kind: 'repository', status: 'private' },
      { label: 'No public demo', kind: 'demo', status: 'not-public' }
    ],
    evidence: [
      {
        id: 'atlas-risk',
        title: 'Deterministic risk boundary',
        claim: 'The underlying risk is generated before model-assisted explanation.',
        status: 'verified',
        source: 'Atlas architecture notes',
        publicSafe: true
      },
      {
        id: 'atlas-tenant',
        title: 'Tenant isolation',
        claim:
          'Workspace, repository, and ingestion-run scope is enforced through request context and PostgreSQL RLS.',
        status: 'verified',
        source: 'Atlas architecture notes',
        publicSafe: true
      }
    ]
  },
  {
    slug: 'ghostwriter',
    title: 'Ghostwriter',
    type: 'Reliability case study',
    thesis: 'Treat authentication success as a database contract, not a UI event',
    role: 'Frontend · application reliability',
    timeline: 'Independent product',
    team: 'Independent',
    stack: 'Next.js · React · TypeScript · Supabase · CSP · automated tests',
    image: '/projects/toikien.png',
    imageAlt: 'Ghostwriter editing interface with author-inspired rewrite controls.',
    objectPosition: 'left top',
    problem:
      'Registration appeared complete before the expected database state existed, exposing migration drift and an incomplete success boundary.',
    contribution:
      'Traced the outage through registration and database state, repaired the success boundary, and added migration drift checks, session-family handling, idle timeout, CSP, consistency checks, and automated regression coverage.',
    technicalSignal:
      'Migration drift guard · session-family behavior · database consistency checks',
    status:
      'Focused reliability case study based on the registration incident and the controls added afterward.',
    constraints: [
      'Authentication UI must not report success before required database state exists.',
      'Session behavior and timeout must remain understandable to the user.',
      'Security headers must not break the editing workflow.'
    ],
    keyFlows: [
      'Registration',
      'Session creation and renewal',
      'Idle timeout',
      'Rewrite workspace'
    ],
    technicalDecisions: [
      'Move the success boundary behind verified database consistency.',
      'Add a migration drift guard instead of relying on local schema assumptions.',
      'Model sessions as a family and test expiry and idle behavior.',
      'Harden CSP while preserving required application connections.'
    ],
    designDecisions: [
      'Keep authentication failure copy direct and recoverable.',
      'Avoid presenting backend inconsistency as a generic form error.',
      'Preserve the editorial writing surface while adding operational feedback.'
    ],
    limitations: [
      'This case study covers reliability controls, not model quality.',
      'No production user or adoption metrics are claimed.'
    ],
    links: [
      {
        label: 'Read case study',
        href: '/work/ghostwriter',
        kind: 'case-study',
        status: 'available'
      },
      { label: 'Private repository', kind: 'repository', status: 'private' },
      { label: 'No public demo', kind: 'demo', status: 'not-public' }
    ],
    evidence: [
      {
        id: 'ghostwriter-registration',
        title: 'Registration success boundary',
        claim:
          'Registration success now depends on the required database state rather than the client transition alone.',
        status: 'verified',
        source: 'Ghostwriter reliability notes',
        publicSafe: true
      },
      {
        id: 'ghostwriter-guard',
        title: 'Migration drift guard',
        claim: 'Automated checks detect schema drift before the registration path is treated as healthy.',
        status: 'verified',
        source: 'Ghostwriter reliability notes',
        publicSafe: true
      }
    ]
  }
];

export const flagshipStudy = caseStudies[0];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
