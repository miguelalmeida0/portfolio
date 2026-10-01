// Historical engineering evidence supplied by the project owner, cross-checked
// against the linked native reports where available. These are not fresh runs.
const revision = '28ee88a17caf6dd612e2ff660225da1ce8473ef8';
const source = (path: string) => `https://github.com/miguelalmeida0/leu/blob/${revision}/${path}`;

export const leuSources = {
  reconstruction: { label: 'Extraction, migration and question-admission review', href: source('docs/design/bugfix-20260914/INTEGRATION_REVIEW.md') },
  plateau: { label: 'V36 report · sealed 160-case evaluation', href: source('docs/LEU_V36_SEMANTIC_UNDERSTANDING_REPORT.md') },
  development: { label: 'V37 Mac development report · dev14', href: source('spikes/v37/MAC_DEV_REPORT.md') },
  holdout: { label: 'Blind evaluation protocol', href: source('spikes/v37/HOLDOUT_PLAN.md') }
};

export const pipeline = [
  { name: 'PDF', detail: 'Visual layout is the input, not the reading order.' },
  { name: 'Canonical source', detail: 'Reconstruct text; retain page and passage identity.' },
  { name: 'Concepts & claims', detail: 'Separate definitions, relationships and mnemonic material.' },
  { name: 'Questions', detail: 'Build teaching context; reject invalid candidates.' },
  { name: 'Learner response', detail: 'Read the conclusion and its reason separately.' },
  { name: 'Judgement', detail: 'Check interpretation before granting learning credit.' },
  { name: 'Learner memory', detail: 'Persist evidence that will influence future study.' }
];

export const incidents = [
  {
    id: 'source-integrity', title: 'A readable PDF produced an unreadable source of truth.',
    observed: 'React Notes looked normal on screen. Extraction could turn “React Notes” into “Reac Note” and “Keys describe identity” into “Key describ identit”. Questions, search, speech, explanations and provenance all consumed that same damaged representation. V25 could pass 243/243 core tests while native reconstruction, Study/Lens handoff and gestures still had integration problems.',
    cause: 'PDFKit strings did not preserve semantic structure automatically. Explicit spaces in letter-spaced labels interfered with geometric grouping; headers entered the corpus, and blocks could join unrelated cards or pages. Old persisted extraction could outlive a parser fix.',
    change: 'Move source ownership into a reconstruction pipeline: geometry-aware extraction, line grouping, block classification and page reconstruction. Keep stable passage identities and canonical whitespace. Version extraction and invalidate incompatible checkpoints and derived banks.',
    result: 'The migration probe invalidated 212 old questions and one semantic index while preserving nonempty learner records. Running it again made no changes. This was a deterministic in-memory result; the separate file-store attempt was blocked by a write-permission error.',
    tradeoff: 'Generated intelligence can be rebuilt; learner history cannot be treated as disposable cache. Rebinding automatic objects to the new extraction adds migration state. The host result did not certify native persistence.',
    evidence: leuSources.reconstruction
  },
  {
    id: 'question-quality', title: 'A citation could be correct while the question was useless.',
    observed: 'Letter-spaced labels and front matter became study material. A DOM question used “the live cake sitting on the table” as its answer after mnemonic context was lost. Other failures included unrelated spans, mismatched distractors, oversized options and trivial recall. An early reasoning-depth evaluation reached about 18% against an 85% target.',
    cause: 'A short passage often lacked the relationships needed for a teaching question. Dropping paragraph roles let an analogy become a factual claim. Grounding checked where text came from, but did not establish that the question taught anything useful.',
    change: 'Replace passage-only generation with document structure, parsed cards, concepts, claims and relationship subgraphs. Assemble source-bound teaching packets before generation. Validate stems, distractors and provenance, then reject candidates deterministically at compilation and storage boundaries.',
    result: 'On the available 64-page manual, preserving mnemonic roles removed the “live cake” question and a similar HTTPS analogy. The compiled bank fell from 212 to 181 questions; all survivors passed the final surface gate. This did not establish that the reasoning-depth target had been met.',
    tradeoff: 'Surface validation cannot prove distractor plausibility or pedagogical value. The producer of the originally reported giant answer option remained unresolved because its affected record was unavailable.',
    evidence: leuSources.reconstruction
  },
  {
    id: 'semantic-ceiling', title: 'V36 was safer. It had not learned to reason.',
    observed: 'On a fresh sealed set of 160 explanations, V35 → V36 coarse accuracy moved from about 52% to 51%. Paraphrase stayed at 29%; novel vocabulary at 51%. Weak reasoning stayed at 0/16. Only five outcomes changed.',
    cause: 'More semantic and vector checks reduced some dangerous decisions without distinguishing a correct conclusion from an incorrect reason. False mastery moved from 11/104 to 10/104 and harmful writes from 25 to 23, but reasoning remained the limiting factor.',
    change: 'Stop extending the same matching architecture. V37 uses the model to read an answer into structured observations. Deterministic checks validate that interpretation; the existing judge, planner and evidence mapper retain decision authority.',
    result: 'The V37 dev14 candidate reached 75% coarse accuracy in each of three fresh Apple-model runs on the 80-answer development set. On that same development set, V36 scored 46.2%. The earlier 160-case sealed result is a different dataset and is not a direct before/after comparison.',
    tradeoff: 'Model reading introduced latency and run-to-run variation. Better development scores justified the new direction; they did not certify the blind holdout or a physical iPhone.',
    evidence: leuSources.plateau
  },
  {
    id: 'learner-state', title: 'The expensive error was writing false mastery into memory.',
    observed: 'A fluent answer could hide a false clause, or reach the right conclusion for the wrong reason. Giving it credit would change later review and study decisions. Recording a misconception that was never expressed could also corrupt future sessions.',
    cause: 'A single similarity or correctness score collapsed conclusion, reasoning and misconception into one decision. It also penalised valid explanations using vocabulary absent from the PDF.',
    change: 'Read segments, polarity, role, relation, claim and misconception IDs, target versus neighbouring concept, reason-to-conclusion links, specificity and confidence. Check the reading deterministically. A disputed judgement can be downgraded, rejected or turned into a follow-up; the model cannot directly write mastery.',
    result: 'Across three dev14 Mac runs: 91.4% commit accuracy, 2/58 false mastery and 3/80 harmful writes in each run. Weak-reasoning recall was 55%; precision averaged about 63.5%. The system asked a follow-up on 56.2% of answers.',
    tradeoff: 'Conservative writes cost extra questions. Weak-reasoning precision still missed the 65% development target, and novel vocabulary reached 67.9% against 70%. Two false-mastery cases and one false-misconception case remained.',
    evidence: leuSources.development
  },
  {
    id: 'performance', title: 'Reopening a document should not rerun its intelligence pipeline.',
    observed: 'Generating study intelligence took 25.90 seconds. Installing its question bank took 11.36 seconds. Reopening previously processed material had a p50 of 10.34 seconds. Repeated work made the reading interaction pay for computation it had already completed.',
    cause: 'Cold computation, incremental updates and reuse were not sufficiently separated. Treating every interaction as a fresh pipeline made persistence an architectural concern, not just a storage detail.',
    change: 'Make intelligence incremental and persisted. Distinguish the work required for new material, changed material and unchanged material. Pair reuse with extraction-version checks so a fast reopen cannot silently return stale intelligence.',
    result: 'Recorded V28.1 measurements: generation 25.90 s → 2.03 s; question-bank installation 11.36 s → 129 ms; reopen p50 10.34 s → 64 ms. These are three separate operations, not one end-to-end latency figure.',
    tradeoff: 'A faster pipeline has more invalidation and recovery states to maintain. These historical measurements are not physical-iPhone latency certification and do not measure the later V37 model-reading path.'
  },
  {
    id: 'native-verification', title: 'A green core and a rendered screen could both hide a failed integration.',
    observed: 'The Apple verification job grew toward the hosted runner’s roughly 60-minute limit. Some failures were real assertions; others were XCUITest startup failures. One shard exited before its automation connection existed. Another timed out querying focused applications while the captured accessibility tree still showed the app.',
    cause: 'One exit code covered different failure classes. SwiftUI state, PDFKit page position and the accessibility tree could also disagree. Tests sometimes searched for a session-start control after the app had already entered the active study screen.',
    change: 'Split portable-core, apple-unit and apple-ui-a through apple-ui-d. Preserve xcresult artifacts, keep assertion failures hard, and retry only recognised Simulator/XCUITest infrastructure failures with a Simulator reset. Replace unsupported regex lookbehind with explicit token-boundary logic.',
    result: 'Native reader checks explicitly exercised Page 1 of 4 → swipe → Page 2 of 4 → swipe back → Page 1 of 4. Stable accessibility identifiers became contracts for reader, study and Teach Leu states. CI diagnosis could now distinguish an assertion from “Early unexpected exit” or “operation never finished bootstrapping”.',
    tradeoff: 'Sharding and selective retries improve diagnosis; no aggregate CI reliability gain is claimed. A valid iOS 26.5 Simulator was also rejected by the discovery helper, requiring direct UDID targeting. The app, automation harness and developer tooling each needed separate evidence.'
  },
  {
    id: 'device-boundaries', title: 'A model experiment was not a certified iPhone product.',
    observed: 'Local Qwen experiments around 0.8B, 2B and 4B exposed different failures: false approvals at 2B and unjustified contradictions at 4B. The dynamic arm64 LeuQwenNative framework also failed iOS packaging through resource placement, plist and signing integration problems.',
    cause: 'Model size did not establish safe judgement, and framework execution did not establish installation inside a signed app. Apple Foundation Models added another boundary: Mac inference could not substitute for supported-iPhone consistency and latency checks.',
    change: 'Keep local Qwen experimental and off by default. Place model interpretations behind deterministic validation. Repair framework packaging and verify it separately from app installation. Track portable logic, native UI, Mac inference and physical-device gates independently.',
    result: 'Framework-level packaging verification passed, but a later physical build/install remained blocked by a permissionDenied/signing path. V37’s measured Mac runs reached warm p50 ≈4.2 s, p95 ≈6.9 s and cold ≈2.9–3.5 s. Mac–iPhone consistency and physical-iPhone latency remained unverified.',
    tradeoff: 'The available base iPhone 15 could not satisfy the intended iPhone 15 Pro model gate. Larger models, successful builds and Mac scores were insufficient grounds for a release claim.',
    evidence: leuSources.development
  }
];

export const evidenceLayers = [
  ['Portable logic', 'Deterministic checks', '243/243 V25 core passes did not prove native reconstruction or gestures.'],
  ['Native build', 'Separate integration gate', 'A framework build did not prove signed application installation.'],
  ['Native UI', 'Scenario-specific evidence', 'Page round trips crossed SwiftUI, PDFKit and accessibility automation.'],
  ['Model evaluation', 'Mac development benchmark', 'V37 dev14: three real Apple-model runs on 80 open answers; five canonical checks.'],
  ['Blind holdout', 'Sealed evaluation protocol', '240 authored cases, 36 targets, seven documents. Development scores are not holdout results.'],
  ['Performance', 'Path-specific measurements', 'V28.1 pipeline timings and V37 Mac inference measure different work.'],
  ['Physical device', 'Not yet certified', 'Mac–iPhone consistency, supported-iPhone latency and the local-model install remain separate gates.'],
  ['Human listening', 'Open quality gate', 'Synthesis and waveform tests cannot establish voice quality on actual hardware.']
];
