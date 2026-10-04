export type ProjectSystem = {
  summary: string;
  flow: { name: string; detail: string }[];
  tools: { area: string; names: string; purpose: string }[];
  quality: string;
};

export const projectSystems: Record<string, ProjectSystem> = {
  f24: {
    summary: 'Built the original frontend’s modular architecture within the product team: reusable UI, feature logic and backend data connections with separate responsibilities. It became part of the product delivered together, now used by hundreds of companies.',
    flow: [
      { name: 'Reusable interface', detail: 'Shared components provide consistent building blocks across product workflows.' },
      { name: 'Feature modules', detail: 'Independent modules organise application behaviour and keep changes local to the feature.' },
      { name: 'Data integration', detail: 'Frontend data connections turn backend responses into usable application state.' },
      { name: 'Backend services', detail: 'Operational services provide the contracts integrated into the product interface.' }
    ],
    tools: [
      { area: 'Architecture', names: 'Modular structure and reusable components', purpose: 'Built the original Svelte frontend around shared foundations and feature boundaries. Components and application logic could be reused as the product grew.' },
      { area: 'Integration', names: 'Backend services connected to frontend workflows', purpose: 'Implemented the frontend data connections and request handling. Loading, results, errors and recovery are explicit parts of the interaction.' },
      { area: 'Performance', names: 'Application responsiveness and efficient data handling', purpose: 'Improved application performance alongside ongoing product delivery. In the React activity-history example below, incremental loading and cancellation control how data reaches the interface.' },
      { area: 'Verification', names: 'Production flows and regression coverage', purpose: 'Playwright covers product flows in the existing frontend. React component tests target request handling, pagination recovery and keyboard detail access.' },
      { area: 'Evolution', names: 'Svelte foundations, continued React delivery', purpose: 'Continued React feature delivery as the application evolves. The migration direction and shared React foundation are team work.' }
    ],
    quality: 'Reusable architecture, working service integrations and performance improvements were part of frontend delivery, from the original frontend through its continued evolution.'
  },
  flow: {
    summary: 'Voice input and React controls resolve to typed actions. A transaction validates a copy of shared state before committing it. Calendar, Journal, Friends and Memories read that state; animation presents changes without owning them.',
    flow: [
      { name: 'Interpret', detail: 'Resolve conversation to intent; clarify or confirm ambiguity.' },
      { name: 'Execute', detail: 'Validate and apply a deterministic action.' },
      { name: 'Persist', detail: 'Update shared life state and action history.' },
      { name: 'Inspect & correct', detail: 'Edit in the UI, interrupt presentation, or undo the action.' }
    ],
    tools: [
      { area: 'Interface', names: 'Presentation reads committed state', purpose: 'React surfaces render editable objects. Interrupting motion must not undo or partly apply an action.' },
      { area: 'Action boundary', names: 'Validate before and after the change', purpose: 'Interpret input, clarify ambiguity and apply the transaction to a clone. Return conflicts without exposing a partially changed document.' },
      { area: 'Shared state', names: 'One identity across connected views', purpose: 'Plans and calendar entries keep stable relationships in browser storage and undo history. This adds validation work but avoids separate voice-only objects.' },
      { area: 'Verification', names: 'Rollback and identity are explicit cases', purpose: 'Transaction tests cover invalid relationships, rescheduling without duplication and preserving source state. Live speech requires separate testing.' }
    ],
    quality: 'The product film uses deterministic speech input through the production action engine. It demonstrates editable results; microphone recognition and latency require separate live voice checks.'
  },
  leu: {
    summary: 'The native reader owns source selection and exact return. A shared learning core owns session state, while a separate voice provider generates neural audio entirely in-process on the device.',
    flow: [
      { name: 'Read', detail: 'Select an exact passage in the native PDF reader.' },
      { name: 'Diagnose', detail: 'Ask a source-grounded question and capture the learner answer.' },
      { name: 'Repair', detail: 'Give specific feedback, clarification or a harder follow-up.' },
      { name: 'Teach back', detail: 'Return to the source, explain it, and preserve the completed trace.' }
    ],
    tools: [
      { area: 'Native interface', names: 'The reader owns the source', purpose: 'PDFKit selections retain document identity and text ranges. Source matching rejects ambiguous passages instead of returning an arbitrary location.' },
      { area: 'Learning core', names: 'Session state survives view changes', purpose: 'The learning core carries source anchors, drafts and feedback between steps. More state is required, but the answer stays connected to its passage.' },
      { area: 'Neural voice', names: 'Audio runs separately from learning state', purpose: 'The in-process voice provider owns generation and playback. On-device narration costs model storage and memory; device acceptance remains separate from the film.' },
      { area: 'Verification', names: 'Cancellation and source ownership', purpose: 'Native test definitions cover stale results and selected-passage playback. The public source links below establish a narrower, inspectable reader boundary.' }
    ],
    quality: 'A stale or cancelled speech result cannot start after a newer request or Stop. Voice preference persists across relaunch, playback itself does not, and narration marks are transient rather than saved as source annotations.'
  },
  'second-voice-ai': {
    summary: 'The React browser interface owns the draft, submitted settings and result. The server validates requests and calls the provider. Keeping these boundaries separate lets the writer retain their work when a request fails.',
    flow: [
      { name: 'Compose', detail: 'Draft, author and tone in React.' },
      { name: 'Validate', detail: 'Check the session and request on the server.' },
      { name: 'Generate', detail: 'Read a bounded, cancellable provider response on the server.' },
      { name: 'Review or recover', detail: 'Show the result or an error while preserving the writer’s input.' }
    ],
    tools: [
      { area: 'Interface', names: 'Selected settings differ from submitted settings', purpose: 'Capture the source and voice when a rewrite starts. Later control changes cannot relabel an older result.' },
      { area: 'Request boundary', names: 'Validate on the server', purpose: 'Parse the request before calling the provider. Public sharing requires explicit consent; the browser does not own provider access.' },
      { area: 'Provider boundary', names: 'Bound the wait and response size', purpose: 'Abort cancelled reads and reject oversized responses. These paths return errors to a recoverable writing interface.' },
      { area: 'Verification', names: 'Inspect failure handling in source and tests', purpose: 'The linked public tests cover bounded JSON, oversized responses and cancellation while reading. Portfolio bridge and text-diff tests verify separate local behavior.' }
    ],
    quality: 'The tradeoff is keeping draft, submitted request and successful result as distinct state. The portfolio uses prepared examples for predictable interaction; a successful live model call is a separate check.'
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
};
