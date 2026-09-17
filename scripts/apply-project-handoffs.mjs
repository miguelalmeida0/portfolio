import { readFile, writeFile } from 'node:fs/promises';
import { loadLocalTs } from './lib/load-local-ts.mjs';
const file = 'src/lib/content/case-studies.ts';
const { caseStudies } = await loadLocalTs(file);
const camera = caseStudies.find(x => x.slug === 'camera-harness');
Object.assign(camera, {
  type: 'Interactive AI · frontend systems · motion design',
  thesis: 'Turning a live camera into an interactive companion—with clear control over what it sees, when it responds, and when it stops.',
  role: 'Frontend engineering · interaction design · motion integration',
  timeline: 'Independent experimental project',
  stack: 'JavaScript / TypeScript · Three.js · Blender · Node.js · Python · browser media APIs',
  mediaId: 'camera-harness-peace-sign-result',
  problem: 'Camera Harness brings three interactions into the browser: asking about a camera view, observing changes, and exploring object labels. Each combines a continuous stream of images with work that finishes at unpredictable times. I built explicit session ownership so switching modes, interrupting speech, and stopping the camera have a defined effect on pending work.',
  contribution: 'I connected camera permissions, mode selection, frame capture, inference responses, speech, and cleanup. I also integrated a Blender-authored iris whose opening, waiting, and reveal states follow the camera lifecycle.',
  technicalSignal: 'An answer can finish successfully and still belong to an interaction the user has already left.',
  alternatives: [
    { title: 'Cancel requests when the mode changes', body: 'Abort pending requests during a transition. This reduces browser work, but cancellation alone cannot prevent every completion race or prove remote processing stopped.' },
    { title: 'Cancel—and validate ownership', body: 'Abort where supported, then check session, mode, and operation identity before accepting a completion.' }
  ],
  decision: 'I combined cancellation with generation-based ownership. A mode transition changes which work is valid, and obsolete completions cannot finish the active operation.',
  tradeoff: 'Every asynchronous path must carry and check its ownership. That adds coordination code and means discarding completed work when its original interaction is no longer active.',
  behavior: [
    { state: 'Waiting', before: 'Animation suggests readiness before the camera is ready.', after: 'The iris can hold until the runtime signals readiness.' },
    { state: 'Mode change', before: 'A delayed response appears in the wrong interaction.', after: 'Generation checks reject obsolete work.' },
    { state: 'Speech failure', before: 'A voice error makes working visual analysis appear unavailable.', after: 'Watch tracks optional speech failure separately.' },
    { state: 'Cancellation', before: 'Camera, microphone, and queued work outlive the session.', after: 'Ending stops owned media tracks and clears pending interaction state.' },
    { state: 'Restart', before: 'An old answer appears in the new session.', after: 'The current turn resets; bounded history stays separate.' },
    { state: 'Uncertainty', before: 'Unstructured model prose looks like evidence of a change.', after: 'The local Watch normalizer retains uncertainty.' }
  ],
  outcome: 'Camera Harness connects an expressive interface with explicit control over asynchronous work. The iris communicates camera state; the runtime coordinates requests and speech; mode changes invalidate older operations. The next architectural need is connecting every answer to the exact visual evidence that produced it.',
  conditions: 'Experimental implementation. The September project handoff reports nine additional simulated-input and source checks across Microscope and conversation display. Broad recognition accuracy and renewed end-to-end validation remain open; the broader lifecycle run was blocked by a missing Three.js dependency. Hosted analysis can transmit sampled images, and important observations require manual confirmation.',
  sectionTitles: { problem: 'The scene moves on. The interface must keep up.', responsibility: 'What I owned across the flow', alternatives: 'Two ways to handle work that arrives late', behavior: 'What happens when the interaction changes', result: 'An expressive interface with explicit rules underneath.' }
});
const ghost = caseStudies.find(x => x.slug === 'ghostwriter');
Object.assign(ghost, {
  type: 'Independent project · product, design & engineering',
  thesis: 'A sentence can have more than one life.',
  role: 'Product · design · engineering', timeline: 'Independent project · gated live-AI beta',
  problem: 'I built a language playground where you choose a literary voice, turn a mood dial, and watch your words take another shape. The transformation unfolds through word-level cuts and insertions, with clear requesting, playback, completion, and error states—and reduced-motion support.',
  contribution: 'I shaped the editorial interface, author and mood controls, rewrite playback, server-side rewrite orchestration, persistence, sharing, and application safeguards.',
  technicalSignal: 'I made the transformation visible: which words disappear, which arrive, and how the passage changes character.',
  status: 'Working demonstration. Live AI remains gated pending authentication and deployment verification.',
  mediaId: 'ghostwriter-home', artifactCaption: 'Ghostwriter · the editorial interface',
  constraints: ['Private writing is not permission to publish.', 'A timed-out provider request may already have incurred cost.', 'Live AI requires authenticated, approved beta access.'],
  keyFlows: ['Validate policy', 'Authenticate', 'Reserve budget', 'Record dispatch', 'Call provider', 'Account for the result'],
  technicalDecisions: ['Reserve budget before dispatch.', 'Replay completed operation keys; reject changed-input conflicts.', 'Retain reservations when provider or settlement status is uncertain.'],
  designDecisions: ['Show the returned rewrite through animated edits, not simulated model reasoning.', 'Separate generation from deliberate sharing.', 'Keep the source draft out of public output by default.'],
  limitations: ['Live AI is gated pending authentication and deployment checks.', 'Financial tests use injected provider and ledger dependencies, not a production load test.'],
  alternatives: [
    { title: 'Automatically regenerate after a timeout', body: 'Feels seamless, but a provider may already have performed billable work. Repeating the generation can compound an unknown charge.' },
    { title: 'Preserve the uncertain operation', body: 'Retain its reservation until reconciliation. Replay completed keys without another generation, and reject a reused key with different input.' }
  ],
  decision: 'Before a rewrite can spend, the server reserves its budget. An interrupted provider response or failed settlement keeps that reservation. Uncertainty does not automatically trigger another paid generation.',
  tradeoff: 'Recovery is less seamless and live generation requires approved access. A deliberate user retry can create a new operation; the multi-pass Rewrite Lab is disabled for the initial closed beta.',
  behavior: [
    { state: 'Identity', before: 'Invalid identity or missing approval.', after: 'Reject before provider dispatch.' },
    { state: 'Budget', before: 'Accounting controls unavailable.', after: 'Reject generation.' },
    { state: 'Replay', before: 'Completed operation submitted with the same key.', after: 'Return its stored result without another generation.' },
    { state: 'Conflict', before: 'Same key, different input.', after: 'Reject the conflict.' },
    { state: 'Interruption', before: 'Provider response interrupted or browser stops waiting.', after: 'Preserve the reservation; do not assume remote work stopped.' },
    { state: 'Settlement', before: 'Accounting settlement fails.', after: 'Keep the operation conservatively accounted for.' }
  ],
  outcome: 'An implemented editing experience, a centralized AI gateway, and a durable accounting migration. The September project handoff reports 25 passing targeted tests across financial controls, provider responses, and sharing privacy. A synthetic 100-request race against a two-operation budget admitted at most two operations.',
  conditions: 'These reported checks use injected/mock provider and ledger dependencies; some privacy checks inspect source contracts. They are not production load tests or proof of PostgreSQL transactions. Live AI remains gated pending complete browser authentication, production configuration, migration verification, and clean-database transactional validation.',
  lesson: 'A playful surface needs explicit rules for private text, overlapping requests, and uncertain cost.',
  nextQuestion: 'How can a small beta keep an expressive interaction while making access and spending accountable?',
  sectionTitles: { problem: 'Making the edit visible.', responsibility: 'Product, design & engineering', alternatives: 'The request timed out. The cost might not have.', behavior: 'How the gateway handles uncertainty', result: 'What I verified.' }
});
const original = await readFile(file, 'utf8');
const start = original.indexOf('export const caseStudies: CaseStudy[] = ');
const end = original.indexOf('\nexport const flagshipStudy');
await writeFile(file, original.slice(0,start).replace("state: 'Waiting' | 'Error' | 'Cancellation' | 'Recovery';", 'state: string;') + 'export const caseStudies: CaseStudy[] = ' + JSON.stringify(caseStudies,null,2) + ';\n' + original.slice(end));
