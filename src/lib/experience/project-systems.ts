export type ProjectSystem = {
  summary: string;
  flow: { name: string; detail: string }[];
  tools: { area: string; names: string; purpose: string }[];
  quality: string;
};

export const projectSystems: Record<string, ProjectSystem> = {
  leu: {
    summary: 'The native reader owns source selection and exact return. A shared learning core owns session state, while a separate voice provider generates neural audio entirely in-process on the device.',
    flow: [
      { name: 'Read', detail: 'Select an exact passage in the native PDF reader.' },
      { name: 'Diagnose', detail: 'Ask a source-grounded question and capture the learner answer.' },
      { name: 'Repair', detail: 'Give specific feedback, clarification or a harder follow-up.' },
      { name: 'Teach back', detail: 'Return to the source, explain it, and preserve the completed trace.' }
    ],
    tools: [
      { area: 'Native interface', names: 'SwiftUI · PDFKit · Swift', purpose: 'Keep reading, selection, source return and learning state inside a native iOS experience.' },
      { area: 'Learning core', names: 'ShelfCore · source anchors · persisted session state', purpose: 'Preserve document identity, exact source ranges, drafts, feedback and Teach It Back transitions.' },
      { area: 'Neural voice', names: 'Kokoro-82M · ONNX Runtime · AVAudioEngine', purpose: 'Generate narration on-device, time-stretch playback without pitch shift, and map playback state back to the active source.' },
      { area: 'Verification', names: 'XCTest · XCUITest · iOS Simulator', purpose: 'Exercise cancellation, stale-result suppression, source ownership, selected-passage playback and the learning Listen journey.' }
    ],
    quality: 'A stale or cancelled speech result cannot start after a newer request or Stop. Voice preference persists across relaunch, playback itself does not, and narration marks are transient rather than saved as source annotations.'
  },
  'second-voice-ai': {
    summary: 'The browser owns the writing experience. The server owns validation, provider access and the spending decision. A durable operation key connects a request to its result.',
    flow: [
      { name: 'Compose', detail: 'Draft, author and tone in React.' },
      { name: 'Validate', detail: 'Check the session and request on the server.' },
      { name: 'Reserve', detail: 'Atomically reserve budget in PostgreSQL.' },
      { name: 'Generate', detail: 'Call Groq, then save the result for replay.' }
    ],
    tools: [
      { area: 'Interface', names: 'Next.js · React · TypeScript · Tailwind CSS · Framer Motion', purpose: 'Typed interaction states, responsive writing surfaces and edit transitions.' },
      { area: 'Request boundary', names: 'Next.js server routes · Zod · Supabase Auth', purpose: 'Validate input and session access before a generation can reach the provider.' },
      { area: 'Data & AI', names: 'Supabase · PostgreSQL · Groq', purpose: 'Keep the budget ledger and idempotent operations durable. Provider credentials and model policy stay on the server.' },
      { area: 'Verification', names: 'Playwright · axe-core · Node.js test runner · ESLint', purpose: 'Exercise the writing flow, accessibility, request concurrency and ledger behavior.' }
    ],
    quality: 'A repeated operation can replay a completed result. An interrupted provider request keeps its reservation until it can be reconciled, preventing an automatic retry from silently spending twice.'
  },
  vigia: {
    summary: 'Source adapters feed an operational model that separates observations from consequences and planning. The public console reads through a restricted gateway backed by the API and geospatial storage.',
    flow: [
      { name: 'Observe', detail: 'Normalize source data with provenance and freshness.' },
      { name: 'Connect', detail: 'Relate incidents, facilities and route restrictions.' },
      { name: 'Evaluate', detail: 'Apply deterministic consequence and planning logic.' },
      { name: 'Inspect', detail: 'Present the result in a read-only operator console.' }
    ],
    tools: [
      { area: 'Runtime & data', names: 'JavaScript · Node.js · PostgreSQL · PostGIS', purpose: 'Run the API and domain engines with durable spatial queries and a shared operational model.' },
      { area: 'Maps & routing', names: 'MapLibre · OSRM', purpose: 'Render geographic context and support route analysis around incidents and restrictions.' },
      { area: 'Packaging', names: 'Docker · Docker Compose · esbuild', purpose: 'Build the web surface and isolate API, operator and supporting services in repeatable environments.' },
      { area: 'Verification', names: 'Node.js test runner · fast-check', purpose: 'Exercise domain invariants with property tests and dedicated race, crash and replay checks.' }
    ],
    quality: 'Provenance, stale data and uncertainty remain part of the model. The public gateway exposes a restricted evaluation surface; it does not authorize dispatch or certify safe routes.'
  },
  flow: {
    summary: 'Speech is only the front door. A contextual resolver interprets the request against the current route and recent references; the command controller turns that into typed actions; the transaction layer clones, applies and validates shared state before commit; React renders that same state back as ordinary editable UI.',
    flow: [
      { name: 'Hear', detail: 'Capture a transcript without giving the recognizer authority to mutate product state.' },
      { name: 'Resolve', detail: 'Rank intent with route, selection, recent targets, pending context and the active time scope.' },
      { name: 'Transact', detail: 'Apply typed actions to a draft, validate invariants and stop on clarification, confirmation or conflict.' },
      { name: 'Keep editing', detail: 'Commit one shared document so voice and direct manipulation operate on the same objects.' }
    ],
    tools: [
      { area: 'Interface', names: 'React 19 · TypeScript 5.9 · Tailwind CSS · Motion', purpose: 'Render responsive product surfaces and keep voice-created state directly editable with ordinary controls.' },
      { area: 'Voice & intent', names: 'Web Speech API · contextual intent resolver · conversation context', purpose: 'Turn a transcript into a ranked intent using route, selection, recent references and pending conversational state.' },
      { area: 'State & safety', names: 'Zod · typed LifeAction transactions · shared LifeDocument · local persistence', purpose: 'Apply changes to a draft, validate invariants, preserve stable identity and commit one deterministic state transition.' },
      { area: 'Verification', names: 'Vitest · Testing Library · Playwright · command traces', purpose: 'Exercise parser behavior, state invariants, undo/redo, cross-surface journeys and the exact actions produced by a command.' }
    ],
    quality: 'Ambiguity can stop before mutation, protected calendar anchors remain fixed, command traces record the chosen intent and actual actions, and undo/redo restore complete transactions. Automated recognition verifies the application path; physical microphone acceptance is tracked separately.'
  },
  'mirror-ai': {
    summary: 'Image processing runs away from the interaction thread. A versioned scene manifest keeps geometry, identity and user corrections separate, while local storage makes repeated inspection immediate.',
    flow: [
      { name: 'Inspect', detail: 'Select a subject directly in the image.' },
      { name: 'Process', detail: 'Run detection and enrichment in browser workers.' },
      { name: 'Reconcile', detail: 'Resolve geometry, labels and user corrections.' },
      { name: 'Remember', detail: 'Cache the scene and retain correction history.' }
    ],
    tools: [
      { area: 'Interface', names: 'TypeScript · Vite · Web Workers', purpose: 'Keep selection and the contextual inspector responsive while processing runs asynchronously.' },
      { area: 'Vision & text', names: 'COCO-SSD · Florence-2 · SAM · Tesseract', purpose: 'Combine detection, semantic enrichment, segmentation and text extraction without treating an outline as proof of identity.' },
      { area: 'Local state', names: 'IndexedDB · Ollama', purpose: 'Persist scene data and corrections locally, with local model integration for supported inference paths.' },
      { area: 'Evaluation', names: 'Eval Lab · Replay cases · Unit & component tests', purpose: 'Turn corrections into inspectable regression cases and check asynchronous ownership.' }
    ],
    quality: 'Hovering a mapped region reads cached state instead of starting another model call. Stale responses cannot overwrite a newer selection, and a user correction takes priority over an uncertain model label.'
  }
};
