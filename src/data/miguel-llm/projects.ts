export const projectKnowledge = [
  {
    id: 'project-camera-harness-overview',
    title: 'Camera Harness flagship',
    source: 'Camera Harness overview|/work/camera-harness',
    tags: [
      'project',
      'camera harness',
      'strongest project',
      'multimodal',
      'browser media',
      'experimental',
      'evidence'
    ],
    content:
      'Camera Harness is Miguel’s strongest experimental systems case study. It combines explicit camera lifecycle ownership, motion gating, generation-scoped asynchronous work, latest-frame backpressure, local object tracking, bounded semantic attempts, speech-driven Ask, and bounded transient image memory. It is a research prototype, not a production-ready perception product.'
  },
  {
    id: 'project-camera-harness-provenance',
    title: 'Camera Harness Ask provenance',
    source: 'Camera Harness decisions|/work/camera-harness#decisions',
    tags: ['camera harness', 'ask', 'provenance', 'evidence', 'microscope', 'limitation'],
    content:
      'Ask captures a fresh short frame window after the final transcript. It does not consume the visible Microscope track ID or best crop, and no immutable frozen frame or exact region is attached to the answer. The central lesson is that interface continuity is not evidence continuity.'
  },
  {
    id: 'project-camera-harness-locality',
    title: 'Camera Harness trust boundary',
    source: 'Camera Harness decisions|/work/camera-harness#decisions',
    tags: ['camera harness', 'local', 'hosted', 'privacy', 'security', 'trust'],
    content:
      'Microscope object processing is designed to use local loopback services with bounded image buffers. Ask and Watch may send JPEG frames to hosted inference depending on configuration, and browser speech-recognition locality is browser-dependent. The project must not be described as fully local or private in every mode.'
  },
  {
    id: 'project-camera-harness-microscope',
    title: 'Camera Harness Microscope',
    source: 'Camera Harness system flow|/work/camera-harness#system-flow',
    tags: ['camera harness', 'microscope', 'yolo-world', 'bytetrack', 'florence', 'tracking'],
    content:
      'Microscope is an automatic local object-label pipeline, not a magnifying glass. It runs YOLO-World, uses short-lived ByteTrack IDs, keeps bounded best crops, attempts Florence semantic refinement under a strict budget, and updates floating labels. Accuracy, broad class coverage, occlusion robustness, and calibrated confidence remain unproven.'
  },
  {
    id: 'project-camera-harness-architecture',
    title: 'Camera Harness current and proposed architecture',
    source: 'Camera Harness reflection|/work/camera-harness#reflection',
    tags: ['camera harness', 'architecture', 'visual evidence', 'proposed', 'frame broker'],
    content:
      'The current camera system has parallel Ask, Watch, Microscope, and gesture paths without one shared immutable evidence identity. The proposed architecture introduces a frame broker, immutable frame records, a track-and-region evidence store, answer-to-evidence links, and user confirmation. This architecture is proposed and not currently implemented.'
  },
  {
    id: 'project-camera-harness-drift',
    title: 'Camera Harness integration drift',
    source: 'Camera Harness result|/work/camera-harness#result',
    tags: ['camera harness', 'neural field', 'airscript', 'spatial lasso', 'historical', 'testing'],
    content:
      'Neural Field, AirScript, and Spatial Lasso were exposed in historical commit 4b18fce8. Active wiring and package commands were removed in stabilization commit a0f0f5a2, while modules, fixtures, screenshots, and reports remained. They are historical, not active features. The lesson is that readiness evidence must be commit-pinned to the active product graph.'
  },
  {
    id: 'project-atlas',
    title: 'Atlas',
    source: 'Atlas case study|/work/atlas',
    tags: ['project', 'atlas', 'architecture', 'rls', 'tenant isolation', 'retrieval', 'audit'],
    content:
      'Atlas is a read-only code-intelligence architecture built around the thesis “deterministic risk first, model explanation second.” Miguel designed workspace-to-repository-to-ingestion-run scope, request-scoped database context, PostgreSQL RLS, audit trails, and retrieval used to explain an established risk rather than invent the risk.'
  },
  {
    id: 'project-ghostwriter',
    title: 'Ghostwriter',
    source: 'Ghostwriter case study|/work/ghostwriter',
    tags: ['project', 'ghostwriter', 'reliability', 'migration', 'session', 'csp', 'database'],
    content:
      'Ghostwriter is an independent language playground spanning product, design, and engineering. Literary voice and mood controls lead to animated word edits of a returned rewrite. The server gateway validates policy and identity, reserves budget, records dispatch, calls the provider, then accounts for the result. Completed keys replay; changed-input conflicts reject; uncertain provider outcomes retain reservations without automatic paid regeneration. The project handoff reports 25 targeted tests using mocked provider/ledger dependencies and source contracts. Live AI remains gated pending authentication and deployment validation. Sharing requires explicit consent and hides source drafts by default; public sharing is disabled in closed beta. The earlier registration narrative is unsupported and must not be presented as an achievement.'
  },
  {
    id: 'project-creature-app',
    title: 'Creature App',
    source: 'Creature App project note|/work/creature-app',
    tags: ['project', 'creature app', 'pose tracking', 'three.js', 'correspondence', 'camera'],
    content:
      'Creature App is an exploratory body-to-character correspondence prototype. Miguel built the interaction and feedback layer around a tracked 3D character so landmark availability and tracking loss remain visible. The recorded state demonstrates the interface, not tracking accuracy across bodies or environments.'
  },
  {
    id: 'project-mirror-ai',
    title: 'Mirror AI',
    source: 'Mirror AI project note|/work/mirror-ai',
    tags: ['project', 'mirror ai', 'segmentation', 'selection', 'contour', 'inspector'],
    content:
      'Mirror AI is an independent local-first image and text assistant. Miguel’s scope spans product design, image selection, contextual inspection, keyboard/mobile interaction, local model integration, versioned scene caching, corrections, and Eval Lab. Cached geometry keeps hover and selection independent of fresh inference. Evidence arbitration separates spatial and semantic identity and preserves stronger evidence and user corrections. Failure capture saves question, answer, correction, and compressed display image locally; it does not retrain models. The supplied handoff reports 49 passing unit/component tests. The separate 630-sample cinematic report is historical saved-scene evidence, not model accuracy or cold-start speed. Recognition and latency vary by image, model, and hardware; some backend work remains scaffolded.'
  }
] as const;
