<script lang="ts">
  import ArchitectureFlow from '$lib/components/case-study/ArchitectureFlow.svelte';
  import CaseStudyHero from '$lib/components/case-study/CaseStudyHero.svelte';
  import CaseStudySection from '$lib/components/case-study/CaseStudySection.svelte';
  import CaseStudySectionNav from '$lib/components/case-study/CaseStudySectionNav.svelte';
  import EvidenceStatus from '$lib/components/case-study/EvidenceStatus.svelte';
  import EvidenceTimeline from '$lib/components/case-study/EvidenceTimeline.svelte';
  import InteractiveArchitecture, {
    type ArchitectureExplorerMode
  } from '$lib/components/case-study/InteractiveArchitecture.svelte';
  import SystemComparison from '$lib/components/case-study/SystemComparison.svelte';
  import TestInterpretationTable from '$lib/components/case-study/TestInterpretationTable.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import ResponsivePicture from '$lib/components/media/ResponsivePicture.svelte';
  import { getCaseStudy } from '$lib/content/case-studies';
  import { getApprovedMedia } from '$lib/content/project-media';

  const study = getCaseStudy('camera-harness');

  if (!study) {
    throw new Error('Camera Harness case study content is missing');
  }

  const recordedStates = [
    {
      media: getApprovedMedia('camera-harness-mug-result'),
      caption: 'Mug movement · awaiting confirmation'
    },
    {
      media: getApprovedMedia('camera-harness-peace-sign-result'),
      caption: 'Peace-sign movement · awaiting confirmation'
    }
  ].filter((item) => item.media);

  const visualEvidenceType = `type VisualEvidence = {
  frameId: string;
  capturedAt: number;
  source: { width: number; height: number };
  transform: { mirrored: boolean; visibleWidth: number; visibleHeight: number };
  trackId?: string;
  region?: { x: number; y: number; width: number; height: number };
  cropId?: string;
  inferenceId?: string;
  model?: { name: string; version: string };
  processingBoundary: "browser" | "local-service" | "hosted-service";
};`;

  const sections = [
    { id: 'what-it-is', label: 'What it is' },
    { id: 'trust-boundary', label: 'Trust boundary' },
    { id: 'runtime-architecture', label: 'Runtime' },
    { id: 'ask-provenance', label: 'Ask provenance' },
    { id: 'microscope', label: 'Microscope' },
    { id: 'integration-drift', label: 'Integration drift' },
    { id: 'current-vs-proposed', label: 'Current / proposed' },
    { id: 'limitations', label: 'Limitations' }
  ];

  const runtimeNodes = [
    { title: 'User · camera · microphone', detail: 'Live input', boundary: 'browser' as const },
    {
      title: 'Browser UI + main-thread orchestration',
      detail: 'Generation ownership, scheduling, visible commit',
      boundary: 'browser' as const
    },
    {
      title: 'Motion differencing + gesture worker',
      detail: 'Cheap browser signals',
      boundary: 'browser' as const
    },
    {
      title: 'Loopback Node launcher',
      detail: 'Local service coordination',
      boundary: 'local' as const
    },
    {
      title: 'YOLO-World · ByteTrack · Florence',
      detail: 'Local object path',
      boundary: 'local' as const
    },
    {
      title: 'SmolVLM + local voice',
      detail: 'Optional local interpretation and speech',
      boundary: 'local' as const
    },
    {
      title: 'Hosted Hugging Face inference',
      detail: 'Ask / Watch depending on configuration',
      boundary: 'hosted' as const
    },
    {
      title: 'LocalStorage + bounded counters',
      detail: 'Persistent text/settings; no raw-image persistence claim',
      boundary: 'persistent' as const
    }
  ];

  const architectureModes: ArchitectureExplorerMode[] = [
    {
      id: 'current',
      label: 'Current',
      disclosure:
        'Current integrated product. Ask, Watch, and Microscope share a surface but do not share one immutable evidence record.',
      nodes: [
        {
          id: 'current-camera',
          title: 'Camera',
          detail:
            'The browser owns the live media track and explicitly stops it on exit, visibility changes, and lifecycle invalidation.',
          boundary: 'browser',
          retention: 'transient',
          status: 'current'
        },
        {
          id: 'current-lifecycle',
          title: 'Browser lifecycle',
          detail:
            'A generation owns asynchronous work. Responses from an earlier mode or camera session are rejected before visible commit.',
          boundary: 'browser',
          retention: 'mixed',
          status: 'current'
        },
        {
          id: 'current-motion',
          title: 'Motion gate',
          detail:
            'A small grayscale canvas detects pixel change and decides when deeper visual analysis is worth requesting.',
          boundary: 'browser',
          retention: 'transient',
          status: 'current'
        },
        {
          id: 'current-detector',
          title: 'Local detector + ByteTrack',
          detail:
            'Microscope forwards a bounded 416-pixel frame to loopback YOLO-World and ByteTrack for candidate boxes and short-lived IDs.',
          boundary: 'local',
          retention: 'transient',
          status: 'current'
        },
        {
          id: 'current-semantic',
          title: 'Florence semantic pass',
          detail:
            'A strict request budget applies semantic text generation to selected best crops. Its confidence tiers are heuristic.',
          boundary: 'local',
          retention: 'transient',
          status: 'current'
        },
        {
          id: 'current-ask',
          title: 'Ask frame window',
          detail:
            'Ask captures a separate short frame window after the final transcript and may use hosted inference depending on configuration.',
          boundary: 'hosted',
          retention: 'transient',
          status: 'current'
        },
        {
          id: 'current-interface',
          title: 'Interface state',
          detail:
            'Floating labels, observations, and answers can look continuous even when their source windows are different.',
          boundary: 'interface',
          retention: 'mixed',
          status: 'current'
        },
        {
          id: 'current-confirmation',
          title: 'Manual confirmation',
          detail:
            'The product keeps uncertain interpretation confirmable instead of presenting model output as established fact.',
          boundary: 'evidence',
          retention: 'persisted',
          status: 'current'
        }
      ]
    },
    {
      id: 'historical',
      label: 'Historical',
      disclosure:
        'Historical implementation — not active in the current product. Retained modules and test artifacts must not be read as current wiring.',
      nodes: [
        {
          id: 'historical-camera',
          title: 'Camera and gesture worker',
          detail:
            'A local MediaPipe worker supplied deterministic gesture landmarks to the historical interaction system.',
          boundary: 'browser',
          retention: 'transient',
          status: 'historical'
        },
        {
          id: 'historical-neural',
          title: 'Neural Field',
          detail:
            'Renderer logic, contracts, fixtures, and UI integration existed at commit 4b18fce8.',
          boundary: 'interface',
          retention: 'mixed',
          status: 'historical'
        },
        {
          id: 'historical-airscript',
          title: 'AirScript',
          detail:
            'Gesture-driven drawing was exposed historically. It is not mounted in the current product.',
          boundary: 'interface',
          retention: 'mixed',
          status: 'historical'
        },
        {
          id: 'historical-lasso',
          title: 'Spatial Lasso',
          detail:
            'Region and relation interactions existed in the historical integration and deterministic test fixtures.',
          boundary: 'interface',
          retention: 'mixed',
          status: 'historical'
        },
        {
          id: 'historical-artifacts',
          title: 'Tests and retained artifacts',
          detail:
            'Screenshots and pass reports remained after active UI wiring and package commands were removed at a0f0f5a2.',
          boundary: 'evidence',
          retention: 'persisted',
          status: 'historical'
        }
      ]
    },
    {
      id: 'proposed',
      label: 'Proposed',
      disclosure:
        'Proposed architecture — not currently implemented. It gives each answer an inspectable frame, track, or region identity.',
      nodes: [
        {
          id: 'proposed-broker',
          title: 'Camera frame broker',
          detail:
            'One lifecycle owner would distribute versioned frames instead of allowing each mode to capture its own parallel window.',
          boundary: 'browser',
          retention: 'transient',
          status: 'proposed'
        },
        {
          id: 'proposed-frame',
          title: 'Immutable frame record',
          detail:
            'A frame ID, timestamp, source dimensions, and visible transform would make the evidence addressable.',
          boundary: 'evidence',
          retention: 'transient',
          status: 'proposed'
        },
        {
          id: 'proposed-perception',
          title: 'Motion + detector + gestures',
          detail:
            'Each perception result would cite the immutable frame it consumed and the model or policy that produced it.',
          boundary: 'local',
          retention: 'transient',
          status: 'proposed'
        },
        {
          id: 'proposed-store',
          title: 'Track and region evidence store',
          detail:
            'Boxes, crops, short-lived tracks, and selected regions would share one bounded evidence contract.',
          boundary: 'evidence',
          retention: 'mixed',
          status: 'proposed'
        },
        {
          id: 'proposed-modes',
          title: 'Mode-specific consumers',
          detail:
            'Ask, Watch, Microscope, and any retained spatial tools would consume explicit evidence IDs with separate privacy policies.',
          boundary: 'interface',
          retention: 'mixed',
          status: 'proposed'
        },
        {
          id: 'proposed-answer',
          title: 'Answer-to-evidence links',
          detail:
            'Every generated sentence could link back to the exact frame, crop, track, or region used for inference.',
          boundary: 'evidence',
          retention: 'persisted',
          status: 'proposed'
        },
        {
          id: 'proposed-confirm',
          title: 'User confirm or discard',
          detail:
            'The user would inspect the evidence address before confirming, rejecting, or discarding the interpretation.',
          boundary: 'interface',
          retention: 'persisted',
          status: 'proposed'
        }
      ]
    }
  ];

  const orchestrationNodes = [
    {
      title: 'Pixel differencing',
      detail: 'Detect possible visual change · Browser',
      boundary: 'browser' as const
    },
    {
      title: 'YOLO-World',
      detail: 'Propose object candidates · Local service',
      boundary: 'local' as const
    },
    {
      title: 'ByteTrack',
      detail: 'Maintain short-lived identity · Local service',
      boundary: 'local' as const
    },
    {
      title: 'Florence-2',
      detail: 'Bounded semantic refinement · Local service',
      boundary: 'local' as const
    },
    {
      title: 'Hosted / local VLM',
      detail: 'Interpret broader scene or movement · Hybrid',
      boundary: 'hosted' as const
    },
    {
      title: 'Generation check',
      detail: 'Reject stale work before visible commit · Browser',
      boundary: 'browser' as const
    }
  ];

  const testRows = [
    {
      evidence: 'Unit / contract tests',
      proves: 'Deterministic logic, schemas, geometry, policies, and normalizers',
      doesNotProve: 'Current product integration'
    },
    {
      evidence: 'Mocked integration',
      proves: 'Event sequencing and policy behavior',
      doesNotProve: 'Real service availability or model quality'
    },
    {
      evidence: 'Fake-media E2E',
      proves: 'DOM behavior and lifecycle cleanup',
      doesNotProve: 'Camera quality or recognition accuracy'
    },
    {
      evidence: 'Visual snapshot',
      proves: 'One deterministic UI state',
      doesNotProve: 'Current live behavior'
    },
    {
      evidence: 'Physical symbolic trace',
      proves: 'Trace procedure integrity',
      doesNotProve: 'Autonomous perception'
    },
    {
      evidence: 'Real-model sample',
      proves: 'A model executed on one machine',
      doesNotProve: 'An accuracy distribution'
    },
    {
      evidence: 'Historical benchmark',
      proves: 'One captured performance state',
      doesNotProve: 'Current end-to-end quality'
    }
  ];
</script>

<svelte:head>
  <title>Camera Harness / Evidence boundaries for live visual interfaces</title>
  <meta
    name="description"
    content="A technical case study about lifecycle ownership, bounded asynchronous work, local and hosted model boundaries, and missing evidence provenance in a live multimodal interface."
  />
</svelte:head>

<a class="skip-link" href="#case-content">Skip to case study</a>
<SiteHeader />

<main id="case-content" class="camera-case page-gutter">
  <CaseStudyHero
    {study}
    headline="Building an evidence boundary for live visual interfaces"
  >
    <svelte:fragment slot="opening">
      A hybrid browser experiment combining motion, local object tracking, semantic labels,
      speech, and hosted visual analysis. Its central problem is evidence identity: the frame the
      user sees, the object a label names, and the window Ask analyzes can still be different.
    </svelte:fragment>
  </CaseStudyHero>

  <CaseStudySectionNav items={sections} />

  <section class="recorded-states" aria-labelledby="recorded-states-title">
    <header>
      <p>Recorded product states</p>
      <h2 id="recorded-states-title">Two movement results from the working interface.</h2>
    </header>

    <div class="recorded-state-grid">
      {#each recordedStates as item}
        {#if item.media}
          <figure>
            <div class="recorded-state-frame">
              <ResponsivePicture
                fallbackSrc={item.media.src}
                alt={item.media.alt}
                width={item.media.responsive?.width ?? 2100}
                height={item.media.responsive?.height ?? 910}
                avifSrcset={item.media.responsive?.avifSrcset}
                webpSrcset={item.media.responsive?.webpSrcset}
                sizes={item.media.responsive?.sizes ?? '100vw'}
                loading="lazy"
                fetchpriority="auto"
                objectPosition="center top"
              />
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        {/if}
      {/each}
    </div>

    <p class="recorded-state-limit">
      These are individual captured states. They show the product flow, not a general recognition
      accuracy result.
    </p>
  </section>

  <CaseStudySection
    id="what-it-is"
    eyebrow="01 · Current implementation"
    title="Observe → propose → track → question → confirm or reject"
    intro="The latest integrated product contains three concepts: Ask / Conversation, Watch / Observing, and Microscope. They share an interface, but they do not yet share one evidence record."
  >
    <div class="mode-sequence">
      <article>
        <EvidenceStatus status="verified" />
        <h3>Ask / Conversation</h3>
        <p>Speech-driven questions with generation-owned requests and stale-result rejection.</p>
      </article>
      <article>
        <EvidenceStatus status="verified" />
        <h3>Watch / Observing</h3>
        <p>Motion-triggered visual interpretation with bounded work and mode invalidation.</p>
      </article>
      <article>
        <EvidenceStatus status="partial" />
        <h3>Microscope</h3>
        <p>Automatic local object candidates, short-lived ByteTrack IDs, and bounded Florence attempts.</p>
      </article>
    </div>
    <div class="claim-limit">
      <p>
        Camera start/stop, lifecycle cleanup, local floating labels, and bounded semantic attempts
        exist. AirScript, Spatial Lasso, and Spatial Ask are not mounted in the current default
        product. Ask is not grounded to a user-selected region, and app-wide local-only processing
        would be an inaccurate claim.
      </p>
    </div>
  </CaseStudySection>

  <CaseStudySection
    id="why-it-is-hard"
    eyebrow="02 · Central argument"
    title="A visual interface can appear continuous even when its underlying evidence is not."
    tone="argument"
  >
    <div class="identity-stream" aria-label="Visual evidence identities">
      {#each [
        'Captured frame',
        'Visible video frame',
        'Motion event',
        'Detector output',
        'Detection box',
        'Track ID',
        'Best crop',
        'Semantic label',
        'Speech transcript',
        'Ask frame window',
        'Answer',
        'User confirmation'
      ] as identity, index}
        <span><small>{String(index + 1).padStart(2, '0')}</small>{identity}</span>
      {/each}
    </div>
    <p class="wide-copy">
      The user sees one scene. The implementation handles multiple time windows, coordinate
      systems, model boundaries, and lifecycles. Without a shared immutable identity, visual
      continuity becomes a presentation property rather than an evidence guarantee.
    </p>
  </CaseStudySection>

  <CaseStudySection
    id="trust-boundary"
    eyebrow="03 · Privacy and trust"
    title="Local is a mode boundary, not a blanket promise"
    intro="Microscope inference is designed to stay on the local machine, and raw image buffers are bounded and discarded. Ask and Watch may use hosted visual inference depending on configuration, and browser speech-processing locality depends on the browser."
  >
    <div class="boundary-ledger">
      <div>
        <h3>Verified controls</h3>
        <ul>
          <li>Media tracks are explicitly stopped.</li>
          <li>Requests are aborted and stale generations are rejected.</li>
          <li>Collections and Microscope image buffers are bounded and cleared.</li>
          <li>Local object processing uses loopback services.</li>
          <li>Provider tokens remain server-side.</li>
          <li>Test instrumentation is sanitized and bounded.</li>
        </ul>
      </div>
      <div>
        <h3>Required qualification</h3>
        <ul>
          <li>Ask and Watch may transmit JPEG frames to hosted inference.</li>
          <li>Browser speech locality is browser-dependent and unknown.</li>
          <li>No persistence does not mean no transmission.</li>
          <li>Base64 images remain sensitive while in memory.</li>
          <li>Confidence tiers are heuristic, not calibrated.</li>
          <li>No broad security or browser-support guarantee is made.</li>
        </ul>
      </div>
    </div>
  </CaseStudySection>

  <CaseStudySection
    id="runtime-architecture"
    eyebrow="04 · Runtime topology"
    title="One browser surface, several processing boundaries"
    intro="The architecture spans browser signals, loopback services, optional hosted inference, persistent text settings, and transient media. Neural Field belongs to the historical record, not this current topology."
  >
    <InteractiveArchitecture modes={architectureModes} label="Camera Harness architecture states" />
  </CaseStudySection>

  <CaseStudySection
    id="cheap-to-deep"
    eyebrow="05 · Orchestration"
    title="Cheap continuous signal → bounded expensive work → visible commit"
    intro="Continuously running the deepest model would waste compute and increase stale work. This system favors freshness: the latest frame replaces queued work, semantic requests have budgets, and every asynchronous result must still belong to the active generation before it can alter the interface."
  >
    <ArchitectureFlow nodes={orchestrationNodes} label="Cheap-to-deep processing path" />
    <p class="wide-copy">
      Model execution alone is not trustworthy product behavior. The scheduler, freshness policy,
      memory bounds, and final commit check are what keep slow inference from becoming stale UI.
    </p>
  </CaseStudySection>

  <CaseStudySection
    id="temporal-identity"
    eyebrow="06 · Temporal identity"
    title="Short-lived continuity, with explicit limits"
    intro="YOLO-World proposes detections. ByteTrack assigns service-side IDs with an approximately two-second expiry policy. The browser scores candidates, keeps bounded best-frame crops, and rejects stale semantic results before updating floating labels."
  >
    <div class="track-line" aria-label="Temporal object identity flow">
      <span>Detection</span><i>→</i><span>Track ID</span><i>→</i><span>Best crop</span><i>→</i
      ><span>Semantic attempt</span><i>→</i><span>Floating label</span>
    </div>
    <blockquote>
      Current evidence supports short-lived track IDs, but controlled occlusion, overlap, camera
      motion, disappearance, and re-entry performance remain unproven.
    </blockquote>
  </CaseStudySection>

  <CaseStudySection
    id="ask-provenance"
    eyebrow="07 · Ask provenance"
    title="Interface continuity is not evidence continuity"
    intro="Ask owns its generation, scheduler, memory bounds, and speech. The missing piece is an immutable frame or crop that the user can inspect and that every downstream answer must cite."
  >
    <ArchitectureFlow
      label="Current Ask flow"
      nodes={[
        { title: 'Final transcript', detail: 'Speech intent', boundary: 'browser' },
        { title: 'Generation-owned request', detail: 'Mode-scoped work', boundary: 'browser' },
        { title: 'Fresh short frame window', detail: 'Captured after transcript', boundary: 'browser' },
        { title: 'Hosted / local analysis', detail: 'Configuration-dependent', boundary: 'hosted' },
        { title: 'Schema normalization', detail: 'Bounded response', boundary: 'browser' },
        { title: 'Stale-generation check', detail: 'Commit or reject', boundary: 'browser' }
      ]}
    />
    <SystemComparison
      label="Ask evidence continuity comparison"
      left={{
        id: 'appears',
        label: 'What the interface implies',
        status: 'Visible continuity',
        title: 'One object. One answer.',
        description:
          'A persistent label beside a live scene can make the later answer feel grounded to that same object.',
        points: ['Visible label', 'Spoken question', 'Answer appears attached to the scene']
      }}
      right={{
        id: 'actual',
        label: 'What currently happens',
        status: 'Separate evidence windows',
        title: 'Microscope track and Ask window diverge.',
        description:
          'Ask captures fresh frames after the final transcript. It does not consume the visible Microscope track or best crop.',
        points: ['Local track and crop', 'Separate Ask frame window', 'No shared immutable evidence ID']
      }}
    />
    <p class="wide-copy">
      Frames are captured after the transcript. No immutable frozen frame, exact crop, region ID,
      visible track ID, or Microscope best-frame record is attached to the answer. The answer can
      therefore describe a different evidence window from the label the user sees.
    </p>
  </CaseStudySection>

  <CaseStudySection
    id="microscope"
    eyebrow="08 · Microscope"
    title="A local object-label pipeline, not a magnifying glass"
    intro="Microscope starts or reuses the camera, opens a local perception session, captures a 416-pixel frame on a motion-adaptive cadence, runs YOLO-World and ByteTrack, scores candidate tracks, retains bounded best crops, and invokes Florence under a strict budget."
  >
    <div class="microscope-grid">
      <article>
        <h3>What is implemented</h3>
        <p>
          Automatic no-click operation, loopback inference, latest-frame backpressure, bounded
          raw-image memory, failure-stop behavior, visibility cleanup, and floating labels.
        </p>
      </article>
      <article>
        <h3>What is not established</h3>
        <p>
          Broad recognition quality, calibrated confidence, selected-region magnification,
          pixel-level citation, or shared Ask evidence. Semantic analysis may take seconds and
          labels may be wrong or sticky.
        </p>
      </article>
    </div>
  </CaseStudySection>

  <CaseStudySection
    id="integration-drift"
    eyebrow="09 · Governance failure"
    title="When the test system outlived the product integration"
    intro="The strongest lesson was not a model result. It was discovering how passing artifacts and screenshots could survive after the features they described left the active product graph."
  >
    <EvidenceTimeline
      items={[
        {
          ref: '01',
          title: 'Contracts and fixtures developed',
          detail:
            'Deterministic hand, object, relation, lifecycle, and rendering contracts established an isolated evaluation vocabulary.',
          status: 'Historical preparation'
        },
        {
          ref: '02',
          title: 'Neural Field integrated',
          detail:
            'The renderer and state contracts entered the product graph alongside browser gesture infrastructure.',
          status: 'Historical integration'
        },
        {
          ref: '03',
          title: 'AirScript and Spatial Lasso exposed',
          detail:
            'Commit 4b18fce8 connected the historical interaction tools to the active UI and package command surface.',
          status: 'Commit 4b18fce8'
        },
        {
          ref: '04',
          title: 'Historical pass evidence produced',
          detail:
            'Deterministic tests, screenshots, and pass reports captured the integrated state at that point in time.',
          status: 'Commit-bound evidence'
        },
        {
          ref: '05',
          title: 'Stabilization removes active integration',
          detail:
            'Commit a0f0f5a2 removed visible controls, lifecycle wiring, imports, and package commands while re-centering the product on Microscope.',
          status: 'Commit a0f0f5a2'
        },
        {
          ref: '06',
          title: 'Tests, screenshots, and reports remain',
          detail:
            'Detached modules and retained artifacts continued to describe a state that was no longer active.',
          status: 'Evidence retained'
        },
        {
          ref: '07',
          title: 'Evidence becomes stale relative to the product graph',
          detail:
            'The failure was governance, not only implementation: readiness evidence was not invalidated when the active wiring changed.',
          status: 'Integration drift'
        }
      ]}
    />
    <blockquote>Readiness evidence must be commit-pinned to the active production graph.</blockquote>
  </CaseStudySection>

  <CaseStudySection
    id="testing"
    eyebrow="10 · Evaluation architecture"
    title="Broad coverage did not prevent evidence drift"
    intro="The repository contains contract tests, schemas, geometry policies, service tests, fake-media browser tests, visual regression, race scenarios, privacy scans, physical traces, and real-model samples. Each answers a different question."
  >
    <TestInterpretationTable rows={testRows} />
    <p class="wide-copy">
      Several tests proved isolated contracts rather than the active product graph. Test count alone
      could not establish that a feature remained integrated.
    </p>
  </CaseStudySection>

  <CaseStudySection
    id="performance"
    eyebrow="11 · Qualified performance"
    title="Performance without one misleading FPS number"
    intro="Retained measurements describe different stages, commits, and environments. They are useful as historical observations, not current product guarantees."
  >
    <div class="metric-lines">
      {#each study.metrics ?? [] as metric}
        <article>
          <EvidenceStatus status={metric.status === 'reproduced' ? 'verified' : metric.status} />
          <h3>{metric.label}</h3>
          <strong>{metric.value}</strong>
          <p>{metric.environment}</p>
          <small>{metric.qualification}</small>
        </article>
      {/each}
      <article>
        <EvidenceStatus status="historical" />
        <h3>Contextual power sample</h3>
        <strong>Approximately 5.5 W</strong>
        <p>No idle baseline or controlled comparison</p>
        <small>Not an energy-efficiency claim.</small>
      </article>
    </div>
    <p class="wide-copy">
      The next valid benchmark is a commit-pinned stage budget covering capture, queueing,
      detector time, semantic time, dropped work, memory, and energy per completed task.
    </p>
  </CaseStudySection>

  <CaseStudySection
    id="current-vs-proposed"
    eyebrow="12 · Architecture conclusion"
    title="Give every answer an evidence address"
    intro="The current product has parallel camera paths. The proposed architecture introduces one immutable frame record and a shared track-and-region evidence store. It is a recommendation, not a shipped feature."
  >
    <SystemComparison
      label="Current and proposed evidence architecture"
      left={{
        id: 'current',
        label: 'Current architecture',
        status: 'Implemented · parallel paths',
        title: 'Several camera consumers, no shared evidence address.',
        description:
          'Ask and Watch own a frame window. Microscope owns detector tracks and crops. Gesture artifacts belong to another lineage.',
        points: [
          'Ask / Watch frame window',
          'Microscope detector and track path',
          'Historical Neural Field artifacts',
          'No shared immutable evidence identity'
        ]
      }}
      right={{
        id: 'proposed',
        label: 'Proposed architecture',
        status: 'Recommendation · not implemented',
        title: 'One broker, versioned evidence, inspectable answers.',
        description:
          'A shared record would connect frames, tracks, regions, models, answers, and user confirmation without flattening privacy boundaries.',
        points: [
          'Immutable frame record',
          'Track and region evidence store',
          'Mode-specific privacy policy',
          'Answer-to-evidence link',
          'User confirm or discard'
        ]
      }}
    />
    <pre class="evidence-type"><code>{visualEvidenceType}</code></pre>
  </CaseStudySection>

  <CaseStudySection
    id="limitations"
    eyebrow="13 · Current status"
    title="What works, what remains open, and what is no longer current"
    intro="The case study ends at the real boundary of the evidence. That boundary is more useful than promotional certainty."
  >
    <div class="status-columns">
      <article>
        <h3>Works in implementation</h3>
        <ul>
          <li>Explicit camera lifecycle ownership</li>
          <li>Motion gating and speech-driven Ask orchestration</li>
          <li>Automatic local object candidates and short-lived track IDs</li>
          <li>Bounded semantic attempts and transient image memory</li>
          <li>Stale-generation rejection</li>
        </ul>
      </article>
      <article>
        <h3>Partial or unproven</h3>
        <ul>
          <li>Recognition accuracy and occlusion robustness</li>
          <li>Region-grounded Ask and shared Microscope evidence</li>
          <li>Calibrated confidence and broad class coverage</li>
          <li>Cross-browser behavior, accessibility conformance, and long-session resources</li>
          <li>Controlled energy efficiency and latency distribution</li>
        </ul>
      </article>
      <article>
        <h3>Not current</h3>
        <ul>
          <li>Neural Field active UI</li>
          <li>AirScript active UI</li>
          <li>Spatial Lasso active UI</li>
          <li>Spatial Ask in the default launcher</li>
        </ul>
      </article>
    </div>
    <a class="next-project" href="/work/atlas">Next case study · Atlas →</a>
  </CaseStudySection>
</main>

<style>
  :global(html) {
    scroll-padding-top: 5.5rem;
  }

  .camera-case {
    min-height: 100svh;
    background: #050505;
    color: var(--foreground);
  }

  .skip-link {
    position: fixed;
    top: 0.6rem;
    left: 0.6rem;
    z-index: 100;
    padding: 0.75rem 1rem;
    background: var(--foreground);
    color: var(--background);
    transform: translateY(-150%);
  }

  .skip-link:focus {
    transform: translateY(0);
  }

  h3,
  p {
    margin: 0;
  }

  .recorded-states {
    width: min(100%, 96rem);
    margin-inline: auto;
    padding-block: clamp(3rem, 5vw, 5rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .recorded-states > header {
    display: grid;
    grid-template-columns: minmax(10rem, 0.28fr) minmax(0, 1fr);
    gap: clamp(1rem, 4vw, 4rem);
    margin-bottom: clamp(2rem, 4vw, 3.5rem);
  }

  .recorded-states > header p,
  .recorded-states figcaption {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .recorded-states h2 {
    max-width: 48rem;
    margin: 0;
    font-size: clamp(1.55rem, 2.3vw, 2.3rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .recorded-state-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2rem);
  }

  .recorded-state-grid figure {
    display: grid;
    gap: 0.7rem;
    min-width: 0;
    margin: 0;
  }

  .recorded-state-frame {
    aspect-ratio: 21 / 9;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #090909;
  }

  .recorded-state-grid :global(img) {
    display: block;
    max-width: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  .recorded-state-limit {
    max-width: 48rem;
    margin: 1.5rem 0 0 auto;
    color: rgb(244 234 220 / 0.56);
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .mode-sequence,
  .microscope-grid,
  .boundary-ledger,
  .status-columns {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    padding: 1px;
    background: rgb(244 234 220 / 0.15);
  }

  .mode-sequence article,
  .microscope-grid article,
  .boundary-ledger > div,
  .status-columns article {
    min-width: 0;
    background: #080808;
    padding: clamp(1rem, 2.5vw, 2rem);
  }

  .mode-sequence h3,
  .microscope-grid h3,
  .boundary-ledger h3,
  .status-columns h3,
  .metric-lines h3 {
    margin: 1rem 0 0;
    font-size: clamp(1.05rem, 1.35vw, 1.35rem);
    line-height: 1.08;
  }

  .mode-sequence p,
  .microscope-grid p {
    margin-top: 0.75rem;
    color: rgb(244 234 220 / 0.64);
    font-size: 0.96rem;
    line-height: 1.55;
  }

  .claim-limit,
  .wide-copy {
    max-width: 58rem;
    margin: clamp(2rem, 5vw, 4rem) 0 0 auto;
    color: rgb(244 234 220 / 0.7);
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
    line-height: 1.62;
  }

  .identity-stream {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    background: rgb(244 234 220 / 0.14);
  }

  .identity-stream span {
    display: grid;
    min-width: min(100%, 11rem);
    flex: 1 1 12rem;
    gap: 1.5rem;
    background: #080808;
    padding: 1rem;
    color: var(--foreground);
    font-size: 0.95rem;
  }

  .identity-stream small {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  .boundary-ledger,
  .microscope-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ul {
    display: grid;
    gap: 0.7rem;
    margin: 1rem 0 0;
    padding-left: 1.1rem;
    color: rgb(244 234 220 / 0.66);
    font-size: 0.96rem;
    line-height: 1.5;
  }

  .track-line {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    overflow-x: auto;
    padding-block: 1rem;
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  .track-line span {
    display: inline-flex;
    min-width: max-content;
    min-height: 3.1rem;
    align-items: center;
    border: 1px solid rgb(244 234 220 / 0.22);
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .track-line i {
    color: var(--accent);
    font-style: normal;
  }

  blockquote {
    max-width: 64rem;
    margin: clamp(2rem, 5vw, 5rem) 0 0 auto;
    color: var(--foreground);
    font-family: var(--font-display);
    font-size: clamp(1.3rem, 2.2vw, 2.2rem);
    font-weight: 680;
    line-height: 1.18;
  }

  .metric-lines {
    border-top: 1px solid rgb(244 234 220 / 0.16);
  }

  .metric-lines article {
    display: grid;
    grid-template-columns: minmax(7rem, 0.25fr) minmax(10rem, 0.5fr) minmax(10rem, 0.5fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    padding-block: 1.3rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .metric-lines h3 {
    margin: 0;
  }

  .metric-lines strong {
    font-size: 1rem;
  }

  .metric-lines p,
  .metric-lines small {
    color: rgb(244 234 220 / 0.58);
    font-size: 0.84rem;
    line-height: 1.45;
  }

  pre {
    max-width: 100%;
    margin: 1rem 0 0;
    overflow-x: auto;
    color: rgb(244 234 220 / 0.72);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    line-height: 1.55;
    white-space: pre;
  }

  .evidence-type {
    margin-top: 1px;
    border: 1px solid rgb(244 234 220 / 0.14);
    background: #080808;
    padding: clamp(1rem, 3vw, 2.5rem);
  }

  .next-project {
    display: inline-flex;
    min-height: 3rem;
    align-items: center;
    margin-top: 3rem;
    border-bottom: 1px solid var(--accent);
    color: var(--foreground);
    font-size: 1rem;
    font-weight: 720;
  }

  .next-project:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 4px;
  }

  @media (max-width: 820px) {
    .mode-sequence,
    .status-columns {
      grid-template-columns: 1fr;
    }

    .metric-lines article {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 660px) {
    :global(html) {
      scroll-padding-top: 4.75rem;
    }

    .boundary-ledger,
    .microscope-grid,
    .recorded-state-grid {
      grid-template-columns: 1fr;
    }

    .recorded-states > header {
      grid-template-columns: 1fr;
    }

    .metric-lines article {
      grid-template-columns: 1fr;
      gap: 0.55rem;
    }

    blockquote {
      font-size: clamp(1.25rem, 6vw, 1.8rem);
    }
  }
</style>
