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
  metrics?: CaseStudyMetric[];
  mediaId?: string;
  artifactCaption?: string;
  outcome: string;
  lesson: string;
  nextQuestion: string;
  sectionTitles: {
    problem: string;
    responsibility: string;
    alternatives: string;
    behavior: string;
    result: string;
  };
  alternatives: [
    { title: string; body: string },
    { title: string; body: string }
  ];
  decision: string;
  tradeoff: string;
  behavior: Array<{
    state: string;
    before: string;
    after: string;
  }>;
  conditions: string;
};

export const caseStudies: CaseStudy[] = [
  {
    "slug": "camera-harness",
    "title": "Camera Harness",
    "type": "Interactive AI · frontend systems · motion design",
    "thesis": "Turning a live camera into an interactive companion—with clear control over what it sees, when it responds, and when it stops.",
    "role": "Frontend engineering · interaction design · motion integration",
    "timeline": "Independent experimental project",
    "team": "Independent",
    "stack": "JavaScript / TypeScript · Three.js · Blender · Node.js · Python · browser media APIs",
    "problem": "Camera Harness brings three interactions into the browser: asking about a camera view, observing changes, and exploring object labels. Each combines a continuous stream of images with work that finishes at unpredictable times. I built explicit session ownership so switching modes, interrupting speech, and stopping the camera have a defined effect on pending work.",
    "contribution": "I connected camera permissions, mode selection, frame capture, inference responses, speech, and cleanup. I also integrated a Blender-authored iris whose opening, waiting, and reveal states follow the camera lifecycle.",
    "technicalSignal": "An answer can finish successfully and still belong to an interaction the user has already left.",
    "status": "Research prototype. The public artifact shows real recorded states; it does not establish general recognition accuracy.",
    "constraints": [
      "Camera and microphone resources need explicit ownership and cleanup.",
      "Slow model work cannot be allowed to overwrite newer interface state.",
      "Transient image data must stay bounded and processing location must stay legible."
    ],
    "keyFlows": [
      "Capture a bounded visual window",
      "Run the mode-specific local or hosted path",
      "Reject work from stale generations",
      "Render an answer with an explicit confidence and processing boundary"
    ],
    "technicalDecisions": [
      "Use cheap continuous signals before invoking deeper model work.",
      "Replace stale queued frames with the newest evidence instead of growing a FIFO.",
      "Attach asynchronous work to a generation and reject late responses from older generations."
    ],
    "designDecisions": [
      "Use floating labels instead of permanent detection rectangles.",
      "Keep uncertain output confirmable rather than presenting it as fact.",
      "Describe the local/hosted boundary in product language."
    ],
    "limitations": [
      "Ask does not consume the visible Microscope track or its best crop.",
      "Recognition accuracy and occlusion robustness are not established.",
      "Confidence tiers are heuristic rather than calibrated probabilities."
    ],
    "links": [],
    "evidence": [],
    "mediaId": "camera-harness-peace-sign-result",
    "artifactCaption": "Recorded working state · one example, not a performance claim",
    "outcome": "Camera Harness connects an expressive interface with explicit control over asynchronous work. The iris communicates camera state; the runtime coordinates requests and speech; mode changes invalidate older operations. The next architectural need is connecting every answer to the exact visual evidence that produced it.",
    "lesson": "Interface continuity is not evidence continuity. A trustworthy camera interface needs to preserve which frame, region, model, and moment produced every visible claim.",
    "nextQuestion": "How should one shared evidence record connect Ask, Watch, and Microscope without turning the live interface into a slow audit tool?",
    "sectionTitles": {
      "problem": "I made mode changes invalidate obsolete AI work.",
      "responsibility": "From camera lifecycle to model integration",
      "alternatives": "Two ways to handle work that arrives late",
      "behavior": "What happens when the interaction changes",
      "result": "An expressive interface with explicit rules underneath."
    },
    "alternatives": [
      {
        "title": "Cancel requests when the mode changes",
        "body": "Abort pending requests during a transition. This reduces browser work, but cancellation alone cannot prevent every completion race or prove remote processing stopped."
      },
      {
        "title": "Cancel—and validate ownership",
        "body": "Abort where supported, then check session, mode, and operation identity before accepting a completion."
      }
    ],
    "decision": "I combined cancellation with generation-based ownership. A mode transition changes which work is valid, and obsolete completions cannot finish the active operation.",
    "tradeoff": "Every asynchronous path must carry and check its ownership. That adds coordination code and means discarding completed work when its original interaction is no longer active.",
    "behavior": [
      {
        "state": "Waiting",
        "before": "Animation suggests readiness before the camera is ready.",
        "after": "The iris can hold until the runtime signals readiness."
      },
      {
        "state": "Mode change",
        "before": "A delayed response appears in the wrong interaction.",
        "after": "Generation checks reject obsolete work."
      },
      {
        "state": "Speech failure",
        "before": "A voice error makes working visual analysis appear unavailable.",
        "after": "Watch tracks optional speech failure separately."
      },
      {
        "state": "Cancellation",
        "before": "Camera, microphone, and queued work outlive the session.",
        "after": "Ending stops owned media tracks and clears pending interaction state."
      },
      {
        "state": "Restart",
        "before": "An old answer appears in the new session.",
        "after": "The current turn resets; bounded history stays separate."
      },
      {
        "state": "Uncertainty",
        "before": "Unstructured model prose looks like evidence of a change.",
        "after": "The local Watch normalizer retains uncertainty."
      }
    ],
    "conditions": "Experimental implementation. The September project handoff reports nine additional simulated-input and source checks across Microscope and conversation display. Broad recognition accuracy and renewed end-to-end validation remain open; the broader lifecycle run was blocked by a missing Three.js dependency. Hosted analysis can transmit sampled images, and important observations require manual confirmation."
  },
  {
    "slug": "ghostwriter",
    "title": "Ghostwriter",
    "type": "Independent project · product, design & engineering",
    "thesis": "A sentence can have more than one life.",
    "role": "Product · design · engineering",
    "timeline": "Independent project · gated live-AI beta",
    "team": "Independent",
    "stack": "Next.js · React · TypeScript · Supabase · CSP · automated tests",
    "problem": "I built a language playground where you choose a literary voice, turn a mood dial, and watch your words take another shape. The transformation unfolds through word-level cuts and insertions, with clear requesting, playback, completion, and error states—and reduced-motion support.",
    "contribution": "I shaped the editorial interface, author and mood controls, rewrite playback, server-side rewrite orchestration, persistence, sharing, and application safeguards.",
    "technicalSignal": "I made the transformation visible: which words disappear, which arrive, and how the passage changes character.",
    "status": "Working demonstration. Live AI remains gated pending authentication and deployment verification.",
    "constraints": [
      "Private writing is not permission to publish.",
      "A timed-out provider request may already have incurred cost.",
      "Live AI requires authenticated, approved beta access."
    ],
    "keyFlows": [
      "Validate policy",
      "Authenticate",
      "Reserve budget",
      "Record dispatch",
      "Call provider",
      "Account for the result"
    ],
    "technicalDecisions": [
      "Reserve budget before dispatch.",
      "Replay completed operation keys; reject changed-input conflicts.",
      "Retain reservations when provider or settlement status is uncertain."
    ],
    "designDecisions": [
      "Show the returned rewrite through animated edits, not simulated model reasoning.",
      "Separate generation from deliberate sharing.",
      "Keep the source draft out of public output by default."
    ],
    "limitations": [
      "Live AI is gated pending authentication and deployment checks.",
      "Financial tests use injected provider and ledger dependencies, not a production load test."
    ],
    "links": [],
    "evidence": [],
    "mediaId": "ghostwriter-home",
    "artifactCaption": "Ghostwriter · the editorial interface",
    "outcome": "An implemented editing experience, a centralized AI gateway, and a durable accounting migration. The September project handoff reports 25 passing targeted tests across financial controls, provider responses, and sharing privacy. A synthetic 100-request race against a two-operation budget admitted at most two operations.",
    "lesson": "A playful surface needs explicit rules for private text, overlapping requests, and uncertain cost.",
    "nextQuestion": "How can a small beta keep an expressive interaction while making access and spending accountable?",
    "sectionTitles": {
      "problem": "I made every rewrite a visible, controllable interaction.",
      "responsibility": "I built the interface and its server safeguards",
      "alternatives": "The request timed out. The cost might not have.",
      "behavior": "How the gateway handles uncertainty",
      "result": "What I verified."
    },
    "alternatives": [
      {
        "title": "Automatically regenerate after a timeout",
        "body": "Feels seamless, but a provider may already have performed billable work. Repeating the generation can compound an unknown charge."
      },
      {
        "title": "Preserve the uncertain operation",
        "body": "Retain its reservation until reconciliation. Replay completed keys without another generation, and reject a reused key with different input."
      }
    ],
    "decision": "Before a rewrite can spend, the server reserves its budget. An interrupted provider response or failed settlement keeps that reservation. Uncertainty does not automatically trigger another paid generation.",
    "tradeoff": "Recovery is less seamless and live generation requires approved access. A deliberate user retry can create a new operation; the multi-pass Rewrite Lab is disabled for the initial closed beta.",
    "behavior": [
      {
        "state": "Identity",
        "before": "Invalid identity or missing approval.",
        "after": "Reject before provider dispatch."
      },
      {
        "state": "Budget",
        "before": "Accounting controls unavailable.",
        "after": "Reject generation."
      },
      {
        "state": "Replay",
        "before": "Completed operation submitted with the same key.",
        "after": "Return its stored result without another generation."
      },
      {
        "state": "Conflict",
        "before": "Same key, different input.",
        "after": "Reject the conflict."
      },
      {
        "state": "Interruption",
        "before": "Provider response interrupted or browser stops waiting.",
        "after": "Preserve the reservation; do not assume remote work stopped."
      },
      {
        "state": "Settlement",
        "before": "Accounting settlement fails.",
        "after": "Keep the operation conservatively accounted for."
      }
    ],
    "conditions": "These reported checks use injected/mock provider and ledger dependencies; some privacy checks inspect source contracts. They are not production load tests or proof of PostgreSQL transactions. Live AI remains gated pending complete browser authentication, production configuration, migration verification, and clean-database transactional validation."
  },
  {
    "slug": "atlas",
    "title": "Atlas",
    "type": "Read-only code intelligence",
    "thesis": "Deterministic risk first. Model explanation second.",
    "role": "Product architecture · frontend · trust boundaries",
    "timeline": "Independent system",
    "team": "Independent",
    "stack": "TypeScript · PostgreSQL · RLS · retrieval · audit trails",
    "problem": "A code-intelligence product becomes hard to trust when a model can invent the finding, blur repository scope, or imply it changed code it only inspected.",
    "contribution": "I designed the architecture and review flow so findings are deterministic, scope is explicit, and the model is limited to explaining existing evidence.",
    "technicalSignal": "The model can explain a finding; it cannot create the finding or change the repository.",
    "status": "Architecture note. The public story is intentionally limited to documented boundaries and known limitations.",
    "constraints": [
      "Read-only analysis must never imply autonomous code modification.",
      "Tenant identity must remain explicit at every database boundary.",
      "The model may explain an established risk but must not invent it."
    ],
    "keyFlows": [
      "Ingest a repository into an explicit run",
      "Generate a deterministic finding and evidence location",
      "Retrieve that established evidence",
      "Offer a model-assisted explanation for human review"
    ],
    "technicalDecisions": [
      "Generate risk deterministically before any model explanation.",
      "Scope rows by workspace, repository, and ingestion run.",
      "Set database identity for each request and enforce it through row-level security."
    ],
    "designDecisions": [
      "Separate evidence from explanation in the interface.",
      "Keep provenance inspectable before offering model language.",
      "Place scope and known gaps beside the result."
    ],
    "limitations": [
      "No production adoption claim is made.",
      "Model explanations still require review.",
      "No public product screenshot is presented as implementation proof."
    ],
    "links": [],
    "evidence": [],
    "artifactCaption": "Architecture note · no simulated product UI",
    "outcome": "The architecture gives every explanation a deterministic finding, an evidence location, and a tenant-scoped ingestion context to return to.",
    "lesson": "A model is most useful after the system has already established what is true and where that truth came from.",
    "nextQuestion": "What is the smallest audit trail that lets a reviewer reconstruct an explanation without retaining unnecessary repository data?",
    "sectionTitles": {
      "problem": "The trust boundary",
      "responsibility": "Where I drew the line",
      "alternatives": "Two roles the model could play",
      "behavior": "How the review flow changes",
      "result": "What the architecture guarantees"
    },
    "alternatives": [
      {
        "title": "Let the model find and explain risk",
        "body": "Flexible, but the reviewer cannot tell whether the underlying issue is real or generated language."
      },
      {
        "title": "Establish the finding before explanation",
        "body": "More constrained, but every explanation starts from a known location and a defined repository scope."
      }
    ],
    "decision": "I made deterministic analysis the source of truth. Retrieval can supply established evidence to the model, which may explain it but cannot create the finding or edit the repository.",
    "tradeoff": "The model has less freedom and the deterministic layer takes more upfront work. The reviewer gets a result that can be traced and challenged.",
    "behavior": [
      {
        "state": "Waiting",
        "before": "A model response was the whole result.",
        "after": "The finding exists before explanation begins."
      },
      {
        "state": "Error",
        "before": "A failed explanation could erase the useful output.",
        "after": "The deterministic finding remains reviewable."
      },
      {
        "state": "Cancellation",
        "before": "Model work could blur run boundaries.",
        "after": "Each explanation remains tied to one ingestion run."
      },
      {
        "state": "Recovery",
        "before": "Review restarted from generated language.",
        "after": "Review resumes from the finding and evidence location."
      }
    ],
    "conditions": "This is a documented architecture note, not a production-adoption claim. Model explanations still require human review."
  },
  {
    "slug": "creature-app",
    "title": "Creature App",
    "type": "Movement correspondence prototype",
    "thesis": "Making body-to-character correspondence readable while it is still imperfect.",
    "role": "Interaction design · frontend prototype · visual feedback",
    "timeline": "Independent prototype",
    "team": "Independent",
    "stack": "Browser camera · pose tracking · Three.js · TypeScript",
    "problem": "A character can move convincingly while hiding which body points are tracked and where the mapping has broken.",
    "contribution": "I built the camera-to-character interaction and the feedback layer that keeps correspondence and tracking loss visible.",
    "technicalSignal": "The interface treats tracking quality as visible state instead of hiding it behind animation.",
    "status": "Exploratory prototype shown through a real recorded interface state.",
    "constraints": [
      "Camera feedback must stay legible beside the character.",
      "Tracking loss must be visible rather than disguised as intentional motion.",
      "The scene must remain useful on a laptop-sized viewport."
    ],
    "keyFlows": [
      "Acquire camera and pose state",
      "Map available landmarks to the character rig",
      "Render correspondence feedback",
      "Surface tracking loss or ambiguity"
    ],
    "technicalDecisions": [
      "Keep the camera preview visible as a reference frame.",
      "Treat landmark availability as state that can change frame by frame.",
      "Separate the motion mapping from the feedback overlay."
    ],
    "designDecisions": [
      "Use a restrained stage so correspondence remains the focus.",
      "Keep status near the motion rather than in a distant diagnostic panel.",
      "Let the character carry delight while the surrounding UI carries clarity."
    ],
    "limitations": [
      "The captured state does not establish tracking accuracy across bodies or environments.",
      "Occlusion and camera placement remain meaningful constraints."
    ],
    "links": [],
    "evidence": [],
    "mediaId": "creature-mirror-tracking",
    "artifactCaption": "Recorded prototype state · movement correspondence in the interface",
    "outcome": "The prototype makes the mapping visible enough to inspect, instead of asking the character animation to stand in for tracking quality.",
    "lesson": "Playful interfaces still need an honest way to show when the underlying signal is incomplete.",
    "nextQuestion": "Can correspondence feedback become quieter once the mapping is stable without making recovery confusing?",
    "sectionTitles": {
      "problem": "When playful movement hides a tracking failure",
      "responsibility": "The interaction I built",
      "alternatives": "Two ways to present imperfect tracking",
      "behavior": "How the character responds now",
      "result": "What the prototype makes legible"
    },
    "alternatives": [
      {
        "title": "Show only the animated character",
        "body": "More magical at first, but a bad pose can look like a broken animation with no explanation."
      },
      {
        "title": "Keep correspondence visible",
        "body": "Adds a small amount of interface, but lets the person understand and correct the camera relationship."
      }
    ],
    "decision": "I kept the camera reference and tracking state close to the character, while separating motion mapping from the feedback overlay.",
    "tradeoff": "The stage is less minimal. In return, tracking failure becomes something the person can diagnose instead of a mysterious visual glitch.",
    "behavior": [
      {
        "state": "Waiting",
        "before": "The character could appear frozen without context.",
        "after": "The interface shows that tracking is not ready."
      },
      {
        "state": "Error",
        "before": "Bad mapping looked like bad animation.",
        "after": "Missing correspondence is visible."
      },
      {
        "state": "Cancellation",
        "before": "Old motion could linger after tracking loss.",
        "after": "The active state stops when the signal disappears."
      },
      {
        "state": "Recovery",
        "before": "Re-entry felt arbitrary.",
        "after": "The visible camera reference helps the person realign."
      }
    ],
    "conditions": "Observed in the recorded laptop prototype. It does not establish tracking accuracy across bodies, rooms, lighting, or occlusion."
  },
  {
    "slug": "mirror-ai",
    "title": "Mirror AI",
    "type": "Independent project · product design & engineering",
    "thesis": "Point to what you want to understand.",
    "role": "Product design · frontend engineering · local model integration",
    "timeline": "Independent local-first prototype",
    "team": "Independent",
    "stack": "TypeScript · Vite · browser workers · IndexedDB · COCO-SSD · Florence-2 · SAM · Tesseract · Ollama",
    "problem": "I built a local-first assistant that lets you explore an image directly: select a subject, ask about it, and correct what the model gets wrong. A contour reveals the subject under the pointer; selecting it opens a crop, interpretation, and focused questions while the original image stays central.",
    "contribution": "I built the image-first interaction, contextual inspector, keyboard and mobile selection, local model integration, scene caching, asynchronous state handling, correction workflows, and Eval Lab.",
    "technicalSignal": "Once a region is mapped, hovering and selecting reads the local scene map. It does not ask the model to think again.",
    "status": "Working local-first prototype. Recognition quality and cold-start speed vary by image, model, and hardware.",
    "constraints": [
      "Geometry and semantic identity are different evidence.",
      "User corrections must survive later weaker model results.",
      "Pointer interaction must stay responsive while models work."
    ],
    "keyFlows": [
      "Prepare image",
      "Build interactive map",
      "Identify regions",
      "Reconcile evidence",
      "Inspect or correct"
    ],
    "technicalDecisions": [
      "Cache versioned scene geometry and semantics.",
      "Run detection and image processing in browser workers.",
      "Reconcile evidence without overwriting stronger identities or corrections."
    ],
    "designDecisions": [
      "Keep the image central and the selected subject visible.",
      "Expose uncertainty instead of unsupported specificity.",
      "Capture mistakes as reviewable Eval Lab cases."
    ],
    "limitations": [
      "Recognition quality and cold-start speed remain variable.",
      "Optional neural speech requires additional dependencies.",
      "Some separate backend capabilities remain scaffolded."
    ],
    "links": [],
    "evidence": [],
    "mediaId": "mirror-ai-home",
    "artifactCaption": "Mirror AI · image and text assistant",
    "outcome": "The supplied project handoff reports 49 passing unit/component tests across coordinate transforms, cache versions, selection, correction precedence, concurrent results, and segmentation handling. A retained cinematic report records 630 samples with no detected popup gaps, duplicates, or hover-label overflow.",
    "lesson": "Keep interaction responsive while models work, and retain enough evidence to challenge their answers.",
    "nextQuestion": "How can difficult real-model cases improve without losing uncertainty or correction history?",
    "sectionTitles": {
      "problem": "I made images directly interactive while models work.",
      "responsibility": "From local inference to correction history",
      "alternatives": "The outline can be right while the answer is wrong.",
      "behavior": "When models disagree",
      "result": "What I verified—and what remains uncertain."
    },
    "alternatives": [
      {
        "title": "Wait for every model to finish",
        "body": "Simplifies the final presentation, but makes selection wait on slow or disagreeing semantic results."
      },
      {
        "title": "Separate interaction from identification",
        "body": "Expose mapped regions immediately. Let semantic readings arrive progressively, with uncertainty and evidence-merging rules."
      }
    ],
    "decision": "I separated spatial geometry, semantic identity, and corrections in a versioned scene manifest. Known-region interactions use cached state; incoming model results pass arbitration rules before changing an identity.",
    "tradeoff": "The interface must communicate incomplete identification. Local inference avoids a paid API requirement in the core path, but needs model downloads, memory, and suitable hardware. Saved-scene playback gives repeatable presentation, not a cold-start benchmark.",
    "behavior": [
      {
        "state": "Wrong identity",
        "before": "A detector locates a region but assigns the wrong category.",
        "after": "Retain its output as evidence and reconcile independent semantic readings."
      },
      {
        "state": "Disagreement",
        "before": "Models disagree or remain inconclusive.",
        "after": "Preserve uncertainty instead of forcing a precise label."
      },
      {
        "state": "Late result",
        "before": "Weaker evidence arrives after a stronger identity.",
        "after": "Apply evidence-merging rules; reject stale runs."
      },
      {
        "state": "Correction",
        "before": "The user challenges an interpretation.",
        "after": "Preserve append-only correction history and give the correction precedence."
      },
      {
        "state": "Missing region",
        "before": "The initial map misses an area.",
        "after": "Allow deliberate region selection and targeted analysis."
      },
      {
        "state": "Wrong answer",
        "before": "A response does not match the image.",
        "after": "Capture context and expected behaviour as an Eval Lab regression case."
      }
    ],
    "conditions": "The 49-test run is reported by the project handoff; retained browser reports are separate historical evidence. These checks are not production load tests or a model-accuracy score. Recognition and cold starts vary: a fresh-profile giraffe experiment remained a generic uncertain animal. Core analysis uses browser/local Ollama inference; model downloads need network access. Scene manifests and compressed failure images are saved locally. Creating a regression case does not retrain the model or prove a fix."
  }
];

export const flagshipStudy = caseStudies[0];

export const recruiterCaseStudies = caseStudies.filter(({ slug }) =>
  ['camera-harness', 'ghostwriter', 'mirror-ai'].includes(slug)
);

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
