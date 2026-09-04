export const projectKnowledge = [
  {
    id: 'project-camera-harness-overview',
    title: 'Camera Harness flagship',
    source: 'Camera Harness overview|/work/camera-harness#what-it-is',
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
    source: 'Camera Harness Ask provenance|/work/camera-harness#ask-provenance',
    tags: ['camera harness', 'ask', 'provenance', 'evidence', 'microscope', 'limitation'],
    content:
      'Ask captures a fresh short frame window after the final transcript. It does not consume the visible Microscope track ID or best crop, and no immutable frozen frame or exact region is attached to the answer. The central lesson is that interface continuity is not evidence continuity.'
  },
  {
    id: 'project-camera-harness-locality',
    title: 'Camera Harness trust boundary',
    source: 'Camera Harness trust boundary|/work/camera-harness#trust-boundary',
    tags: ['camera harness', 'local', 'hosted', 'privacy', 'security', 'trust'],
    content:
      'Microscope object processing is designed to use local loopback services with bounded image buffers. Ask and Watch may send JPEG frames to hosted inference depending on configuration, and browser speech-recognition locality is browser-dependent. The project must not be described as fully local or private in every mode.'
  },
  {
    id: 'project-camera-harness-microscope',
    title: 'Camera Harness Microscope',
    source: 'Camera Harness Microscope|/work/camera-harness#microscope',
    tags: ['camera harness', 'microscope', 'yolo-world', 'bytetrack', 'florence', 'tracking'],
    content:
      'Microscope is an automatic local object-label pipeline, not a magnifying glass. It runs YOLO-World, uses short-lived ByteTrack IDs, keeps bounded best crops, attempts Florence semantic refinement under a strict budget, and updates floating labels. Accuracy, broad class coverage, occlusion robustness, and calibrated confidence remain unproven.'
  },
  {
    id: 'project-camera-harness-architecture',
    title: 'Camera Harness current and proposed architecture',
    source: 'Camera Harness current versus proposed architecture|/work/camera-harness#current-vs-proposed',
    tags: ['camera harness', 'architecture', 'visual evidence', 'proposed', 'frame broker'],
    content:
      'The current camera system has parallel Ask, Watch, Microscope, and gesture paths without one shared immutable evidence identity. The proposed architecture introduces a frame broker, immutable frame records, a track-and-region evidence store, answer-to-evidence links, and user confirmation. This architecture is proposed and not currently implemented.'
  },
  {
    id: 'project-camera-harness-drift',
    title: 'Camera Harness integration drift',
    source: 'Camera Harness integration drift|/work/camera-harness#integration-drift',
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
      'Ghostwriter is a focused reliability case study. Miguel traced a registration outage to a migration mismatch and an incomplete success boundary, then added a migration drift guard, session-family handling, idle timeout, CSP hardening, database consistency checks, and automated regressions. No production adoption or model-quality claim is attached.'
  }
] as const;
