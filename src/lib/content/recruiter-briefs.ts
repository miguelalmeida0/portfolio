export type RecruiterBrief = {
  problem: string;
  ownership: string;
  decision: string;
  result: string;
  proof: { label: string; href: string; note: string };
};

export const recruiterBriefs: Record<string, RecruiterBrief> = {
  'camera-harness': {
    problem: 'The camera keeps moving while AI takes time to respond. Answers, labels, and speech can outlive the interaction that started them.',
    ownership: 'I built the browser experience and the runtime behind it: camera and microphone lifecycle, asynchronous coordination, Blender motion, and local/hosted inference integration.',
    decision: 'Give work a session and mode identity. Bound pending work and reject obsolete completions.',
    result: 'An implemented companion with coordinated states, explicit cleanup, and targeted overlay, mode-transition, and conversation checks.',
    proof: { label: 'Inspect architecture & checks', href: '#system-flow', note: 'Implementation boundaries and scoped checks, below.' }
  },
  ghostwriter: {
    problem: 'A playful rewrite interface must handle private text, overlapping requests, and uncertain provider costs.',
    ownership: 'I designed and engineered the complete writing flow, from editorial controls and rewrite playback to server orchestration and spending safeguards.',
    decision: 'Reserve budget before generation; retain reservations when a provider outcome is uncertain.',
    result: 'An implemented editing experience and tested server safeguards. Live AI remains gated pending authentication and deployment verification.',
    proof: { label: 'Explore the gateway decisions', href: '#incident', note: 'Project handoff reports 25 targeted checks with mocked dependencies; not production load testing.' }
  },
  'mirror-ai': {
    problem: 'A region can be correctly outlined but wrongly identified, while slow models make direct interaction wait.',
    ownership: 'I built the image interaction, local model integration, cache, and asynchronous state—and connected user corrections to Eval Lab.',
    decision: 'Keep the selected subject visible, read cached scene geometry for interaction, and reconcile identities separately from spatial evidence.',
    result: 'A working local-first prototype with persistent corrections and testable evidence handling.',
    proof: { label: 'Inspect the interface & evidence', href: '#artifact', note: 'Product screenshot; the handoff separately reports 49 unit/component tests.' }
  },
  atlas: {
    problem: 'Model-generated explanations can blur what was actually found and which repository it belongs to.',
    ownership: 'The documented review architecture and tenant-scoped evidence boundaries.',
    decision: 'Establish findings deterministically before asking a model to explain them.',
    result: 'An architecture note with explicit scope; production adoption is not established.',
    proof: { label: 'Inspect the decision', href: '#decisions', note: 'Architecture account; not a production benchmark.' }
  },
  'creature-app': {
    problem: 'An animated character can hide tracking loss and confusing body-to-rig mapping.',
    ownership: 'The camera-to-character interaction and visible correspondence feedback.',
    decision: 'Keep the camera reference and tracking state next to the character.',
    result: 'A recorded prototype that makes missing correspondence inspectable.',
    proof: { label: 'Inspect the recorded state', href: '#artifact', note: 'One prototype state; not a tracking-accuracy evaluation.' }
  }
};
