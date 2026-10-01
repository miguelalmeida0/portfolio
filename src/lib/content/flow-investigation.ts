const revision = 'aa63e018da0e3aa8dca3445923538881487dab38';
const source = (path: string) => `https://github.com/miguelalmeida0/flow/blob/${revision}/${path}`;
export const flowSources = {
  transaction: source('src/domain/life-transaction.ts'),
  tests: source('src/domain/life-transaction.test.ts'),
  collisions: source('src/shared/command/journalEntrySelectionCollision.test.ts'),
  verification: source('docs/quality/VERIFICATION.md'),
  checkpoint: source('docs/history/checkpoints/CHECKPOINT_FLOW_APPLE_RESCUE_2026-09-04.md'),
  baseline: source('docs/internal/history/FRIENDS_IMPLEMENTATION_LEDGER.md')
};
export const flowIncidents = [
  {
    id: 'event-loss', number: '01', title: 'A scheduling operation could lose an event.',
    command: '“Move lunch after standup and protect my workout.”',
    observed: 'During arrangeDay, flexible events could disappear. With compound commands, a second failure could also leave the first operation applied. Both failures broke the same promise: an accepted command must preserve the integrity of the whole calendar.',
    cause: 'The early path coupled interpretation to mutation. Scheduling needed to preserve identities and constraints across a transformation, not simply produce a plausible-looking arrangement. Demo-specific event IDs and seeded times hid weaknesses against user-created data.',
    change: 'Resolve references, clone the document, apply actions to the draft, then validate the result. A failure returns before the candidate document becomes authoritative. Identity, relationships and protected anchors are constraints on the operation, not visual details to repair afterward.',
    result: 'The inspected transaction implementation validates both the input document and the candidate result. Source tests cover complete rollback on an invalid relationship, duplicate calendar identities, stable linked-event identity and atomic moves across dates.',
    tradeoff: 'Atomic rejection can turn a partly useful request into no change at all. That is deliberate: a clarification or conflict is easier to understand than an invisible half-success. The portfolio walkthrough illustrates this boundary; it does not run Flow’s engine.',
    link: flowSources.tests, linkLabel: 'Read the rollback and identity tests'
  },
  {
    id: 'intent-ownership', number: '02', title: 'The same words belonged to different domains.',
    command: '“Tomorrow I need to open the calendar before work.”',
    observed: 'Inside a Journal recording, those words can be content to save. In command mode, “open calendar” is an instruction. Journal selection, global navigation and domain-specific interpretation collided as the application grew.',
    cause: 'Global, Studio and planner interpretation paths could each make a locally reasonable decision about an utterance. Recognition success said nothing about which domain owned the result. A transcript could be heard correctly and never reach its intended handler.',
    change: 'Make the active context part of interpretation: route, current world, selected entity and voice mode. Test the boundary between navigation, Journal entry selection and dictation, rather than only testing each interpreter in isolation. Preserve free-form titles through routing.',
    result: 'journalEntrySelectionCollision.test.ts exercises “open calendar” from Journal, entry selection from Calendar, global Home/scroll commands and long-form dictation containing selection-like words. The file makes ownership collisions reproducible.',
    tradeoff: 'More interpreters increase the number of boundaries to maintain. A roughly four-line selection fix did not prove broad navigation reliability; the follow-up needed a dedicated collision suite. Passing these examples is evidence for those journeys, not unrestricted language understanding.',
    link: flowSources.collisions, linkLabel: 'Read the cross-domain collision tests'
  },
  {
    id: 'wake-reliability', number: '03', title: 'The first latency number measured a noisy machine.',
    command: 'Wake → acknowledgement → recognition → dispatch',
    observed: 'A wake first-paint observation of 227.1 ms missed the sub-100 ms acknowledgement target. Unrelated database, API and container workloads were consuming substantial CPU and memory on the same development machine.',
    cause: 'The benchmark mixed application work with machine contention. Separately, the microphone permission flow could block recognition before the command pipeline started. A slow acknowledgement and a recognition lifecycle failure needed different diagnoses.',
    change: 'Isolate the benchmark environment before changing Flow. Measure wake-handler to acknowledgement paint explicitly. Investigate microphone permission and recognition lifecycle separately, and keep deterministic voice-adapter tests distinct from real microphone acceptance.',
    result: 'An earlier isolated ten-run candidate recorded a 50.5 ms median and 73.5 ms p95. A later unchanged-source run recorded 10/10 acknowledgements below 100 ms: median 42.1 ms, p95 65.7 ms. The report retained the source/build hashes and raw samples.',
    tradeoff: 'These are historical acknowledgement measurements, not ASR latency or whole-transition timing. The 227.1 ms observation is not a controlled causal comparison. Physical microphone acceptance and visual release checks remained separate gates.',
    link: flowSources.verification, linkLabel: 'Read the measurement definitions and limits'
  },
  {
    id: 'conversation-state', number: '04', title: '“Yes” needed an identity. So did “that.”',
    command: 'Delete the meeting. → Actually, move the gym. → Yes.',
    observed: 'Ambiguous meetings, stale Calendar previews, lost callbacks and stalled Undo exposed a problem beyond parsing. Across turns, an old proposal or referent could survive after the state it described had changed.',
    cause: 'The command can be understood while its target remains unresolved. Preview, conversation and calendar state must not evolve as independent authorities. Legacy and newer execution paths also had to share contextual identity for “move that” and “open it.”',
    change: 'Bind confirmation to the currently valid proposal; a later command must not accidentally approve an old deletion. Derive previews from authoritative state. Keep history tied to domain transitions, with animation completion and callbacks synchronized to that lifecycle. Carry referents across execution paths.',
    result: 'The transaction boundary explicitly returns clarification, confirmation or conflict instead of always returning changed state. The development record also reports six cross-boundary referent journeys verified after repairing the legacy/kernel seam; that is a bounded journey result.',
    tradeoff: 'A safe interpreter still needs correct callers, history, persistence and UI lifecycles. Source-level transaction checks cannot certify every multi-turn browser journey. Undo and physical voice therefore remain separate acceptance surfaces.',
    link: flowSources.transaction, linkLabel: 'Inspect the transaction result boundary'
  }
];
export const flowLedger = [
  ['The distributed ZIP did not boot', 'Reproducibility', 'Declare the dependency graph and Node 22+ requirement; prove a clean install before adding features.'],
  ['“Open calendar” was recognized but ignored', 'Recognition → dispatch', 'Trace transcript, interpretation, route and handler separately. A transcript is not proof of execution.'],
  ['An explicit “8 AM” was not respected', 'Interpretation → scheduling', 'Follow the time payload through parsing and scheduling; distinguish missing input from an overwritten value.'],
  ['Audio and metadata disagreed', 'Recording lifecycle', 'Keep the audio blob, metadata, transcript and selected recording attached to the same identity.'],
  ['Undo stalled; callbacks were lost', 'History / animation', 'Treat completion as a domain lifecycle concern. A visual transition cannot be the sole record of a mutation.'],
  ['Voice UI obstructed the app', 'Responsive interaction', 'Verify focus, overlap and interaction priority on the actual rendered screens.'],
  ['A build ran from the home directory', 'Execution context', 'Check repository, working directory, runtime and dependencies before classifying a product failure.']
];
export const flowLessons = [
  ['Language became structured data', 'Selectors and constraints can be resolved and checked before they affect the UI.'],
  ['Mutations became transactions', 'A failed compound operation leaves the original document intact.'],
  ['Context became explicit state', 'Referents, pending proposals and voice mode have owners and lifetimes.'],
  ['Tests followed semantic outcomes', 'Quick-command buttons cannot stand in for the language path.'],
  ['Performance needed a controlled environment', 'Source size and corpus size are hypotheses; measure actual runtime and bundle behavior.'],
  ['Claims needed bounded evidence', 'Inspect the diff, the baseline and the exact journey a test exercised.']
];
