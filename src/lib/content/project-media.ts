export type PortfolioMediaAsset = {
  id: string;
  projectId: string;
  kind: 'poster' | 'video' | 'photo' | 'screen-recording' | 'synthetic';
  src: string;
  fallbackSrc?: string;
  poster?: string;
  alt: string;
  status: 'current' | 'historical' | 'synthetic';
  publicStatus: 'approved' | 'private' | 'needs-review';
  containsPerson: boolean;
  containsPrivateEnvironment: boolean;
  capturedAt?: string;
  note?: string;
};

export type ProjectMedia = {
  poster: string;
  webm?: string;
  mp4?: string;
  alt: string;
  aspectRatio?: string;
  videoFit?: 'contain' | 'cover';
  focalPoint?: {
    x: number;
    y: number;
  };
  duration?: number;
  publicSafe: boolean;
};

export type ProjectTile = {
  id: string;
  title: string;
  category: string;
  status?: string;
  shortDescription: string;
  valueLine?: string;
  href: string;
  media?: ProjectMedia;
  size: 'hero' | 'wide' | 'portrait' | 'standard' | 'small';
  featured?: boolean;
  sequence?: string[];
  sequenceLabel?: string;
};

export const portfolioMediaAssets: PortfolioMediaAsset[] = [
  {
    id: 'camera-harness-book-recognition-loop',
    projectId: 'camera-harness',
    kind: 'video',
    src: '/projects/camera-harness/book-recognition-loop-1080.m4v',
    alt:
      'Short Camera Harness recording identifying a JavaScript book while the live camera interface is active.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'A 6.7 second muted homepage loop. Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'camera-harness-microscope-live',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/recognition-poster-1600.webp',
    alt:
      'Camera Harness live Microscope interface identifying visible objects while the camera remains active.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Current product state. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.'
  },
  {
    id: 'camera-harness-current-camera-off',
    projectId: 'camera-harness',
    kind: 'screen-recording',
    src: '/projects/camera-harness/current-camera-off.png',
    alt:
      'Camera Harness camera-off interface with the capture surface, response panel, local voice controls, and explicit readiness state.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note:
      'Camera-off current surface. It demonstrates product structure, not live recognition or model accuracy.'
  },
  {
    id: 'camera-harness-historical-sensefield',
    projectId: 'camera-harness',
    kind: 'screen-recording',
    src: '/projects/camera-harness/historical-sensefield-camera-off.png',
    alt:
      'Historical Sensefield camera-off interface with the response area labelled No raw media stored.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Historical interface. Sensefield is not mounted in the current product.'
  },
  {
    id: 'camera-harness-hero-phone',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/camera-hero-phone.png',
    alt:
      'Camera Harness product interface showing Miguel raising a phone and a movement result awaiting confirmation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Camera Harness hero image. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.'
  },
  {
    id: 'camera-harness-peace-sign-result',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/gesture-1600.webp',
    alt:
      'Camera Harness product interface showing a live camera preview, a raised peace sign, and a movement result awaiting confirmation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Single recorded product state. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.'
  },
  {
    id: 'camera-harness-mug-result',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/movement-1600.webp',
    alt:
      'Camera Harness product interface showing a live camera preview with a mug and a movement result awaiting confirmation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Single recorded product state. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.'
  },
  {
    id: 'creature-mirror-tracking',
    projectId: 'creature-mirror',
    kind: 'poster',
    src: '/projects/creature-mirror/tracking-correspondence.png',
    alt:
      'Creature movement prototype with a tracked 3D character, body correspondence markers, tracking status, and a small camera preview.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'mirror-ai-home',
    projectId: 'mirror-ai',
    kind: 'poster',
    src: '/projects/mirror-ai/interface-1600.webp',
    alt: 'Mirror AI home interface with image upload, text input, a question field, and Eval Lab navigation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false
  },
  {
    id: 'mirror-ai-aquarium-selection',
    projectId: 'mirror-ai',
    kind: 'poster',
    src: '/projects/mirror-ai/aquarium-selection.png',
    alt:
      'Mirror AI prototype with an outlined aquarium subject and a side panel for inspecting and asking questions about the selection.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'mirror-ai-active-image-demo',
    projectId: 'mirror-ai',
    kind: 'video',
    src: '/projects/mirror-ai/active-image-demo.webm',
    fallbackSrc: '/projects/mirror-ai/active-image-demo.mp4',
    poster: '/projects/mirror-ai/active-image-demo-poster.jpg',
    alt:
      'A 9.8 second Active Image product film selecting a giraffe and then an ostrich, preserving each contour in the source image before the ostrich inspector pushes smoothly into focus.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note:
      'Deterministic capture of two recorded local-model states. It demonstrates the interaction and evidence layout, not generalized model performance.'
  },
  {
    id: 'f24-hackathon-presentation-room',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/presentation-room-1024.webp',
    alt: 'F24 colleagues gathered in a workshop room for an internal AI hackathon presentation.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'f24-hackathon-working-session',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/working-session-wide.png',
    alt: 'F24 hackathon participants working together around laptops in a shared studio.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'f24-hackathon-collaboration',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/collaboration-session.png',
    alt: 'F24 hackathon team members reviewing implementation work together at their desks.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'f24-hackathon-standing-session',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/standing-session.png',
    alt: 'F24 hackathon participants collaborating around standing and seated workstations.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'f24-hackathon-focus-session',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/focus-session.png',
    alt: 'Two F24 hackathon participants focused on the product at a shared workstation.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'f24-hackathon-team-demo',
    projectId: 'f24-ai-hackathon',
    kind: 'photo',
    src: '/projects/f24-ai-hackathon/team-demo.png',
    alt: 'The F24 AI hackathon team standing together after the internal product demo.',
    status: 'historical',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Published at the user’s explicit direction on 2026-07-29.'
  },
  {
    id: 'ghostwriter-home',
    projectId: 'ghostwriter',
    kind: 'poster',
    src: '/projects/ghostwriter/interface-1600.webp',
    alt:
      'Ghostwriter editorial interface with an author selector, mood control, and an illustrated writer at a typewriter.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07'
  },
  {
    id: 'ghostwriter-portfolio-film',
    projectId: 'ghostwriter',
    kind: 'video',
    src: '/projects/ghostwriter/ghostwriter-demo.webm',
    fallbackSrc: '/projects/ghostwriter/ghostwriter-demo.mp4',
    poster: '/projects/ghostwriter/ghostwriter-demo-poster.webp',
    alt:
      'A 9.4 second Ghostwriter product film selecting a harbor passage, choosing Tolkien, showing the mythic rewrite word by word, and copying the finished revision.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note:
      'Deterministic capture of the real Ghostwriter interaction using a synthetic draft and a recorded provider result. It demonstrates editorial control, not generalized model quality.'
  },
  {
    id: 'camera-harness-mug-private',
    projectId: 'camera-harness',
    kind: 'photo',
    src: 'docs/private-media-review/camera-harness/movement-mug-1600.jpg',
    alt: 'Private historical Camera Harness runtime capture.',
    status: 'historical',
    publicStatus: 'private',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note: 'Not rendered publicly. Contains a person, a private room, and desktop context.'
  },
  {
    id: 'tiny-invite-needs-review',
    projectId: 'tiny-invite',
    kind: 'poster',
    src: '/projects/tiny-invite.png',
    alt: 'Tiny Invite interface.',
    status: 'current',
    publicStatus: 'needs-review',
    containsPerson: true,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    note: 'Not rendered until image-rights and portrait provenance are confirmed.'
  }
];

export const approvedMedia = portfolioMediaAssets.filter(
  (asset) => asset.publicStatus === 'approved'
);

export function getApprovedMedia(id: string) {
  return approvedMedia.find((asset) => asset.id === id);
}

const cameraResultPoster = getApprovedMedia('camera-harness-microscope-live');
const f24Poster = getApprovedMedia('f24-hackathon-presentation-room');
const ghostwriterPoster = getApprovedMedia('ghostwriter-home');
const ghostwriterFilm = getApprovedMedia('ghostwriter-portfolio-film');
const mirrorAiPoster = getApprovedMedia('mirror-ai-aquarium-selection');
const mirrorAiFilm = getApprovedMedia('mirror-ai-active-image-demo');

export const homepageProjectTiles: ProjectTile[] = [
  {
    id: 'camera-harness',
    title: 'Camera Harness',
    category: 'Independent research prototype',
    status: 'Browser media · applied AI',
    shortDescription:
      'I built the camera lifecycle and async controls that keep late model responses from overwriting a newer interaction.',
    valueLine: 'Every answer should stay connected to the moment that produced it.',
    href: '/work/camera-harness',
    media: cameraResultPoster
      ? {
          poster: cameraResultPoster.src,
          mp4: '/projects/camera-harness/book-recognition-720.mp4',
          alt: cameraResultPoster.alt,
          aspectRatio: '16 / 10',
          videoFit: 'cover',
          focalPoint: { x: 50, y: 36 },
          duration: 6.7,
          publicSafe: true
        }
      : undefined,
    size: 'standard'
  },
  {
    id: 'f24-experience',
    title: 'Production frontend at F24',
    category: 'Professional experience',
    status: '2022 — now · Berlin',
    shortDescription:
      'I built a business application’s frontend from scratch and later migrated it to React. Hundreds of companies now use the application.',
    valueLine: 'Frontend lead for the company’s first shared AI service during an internal hackathon.',
    href: '/story#at-work',
    media: f24Poster
      ? {
          poster: f24Poster.src,
          alt: f24Poster.alt,
          aspectRatio: '16 / 10',
          focalPoint: { x: 50, y: 50 },
          publicSafe: true
        }
      : undefined,
    size: 'standard'
  },
  {
    id: 'ghostwriter',
    title: 'Ghostwriter',
    category: 'Editorial product',
    status: 'Interaction + reliability',
    shortDescription:
      'I built an expressive rewriting interface with budget reservation and explicit handling of uncertain AI requests.',
    valueLine: 'Visible edits, deliberate sharing, and controlled generation.',
    href: '/work/ghostwriter',
    media: ghostwriterFilm
      ? {
          poster: ghostwriterFilm.poster ?? ghostwriterPoster?.src ?? ghostwriterFilm.src,
          webm: ghostwriterFilm.src,
          mp4: ghostwriterFilm.fallbackSrc,
          alt: ghostwriterFilm.alt,
          aspectRatio: '16 / 10',
          focalPoint: { x: 50, y: 50 },
          duration: 9.4,
          publicSafe: true
        }
      : ghostwriterPoster
        ? {
            poster: ghostwriterPoster.src,
            alt: ghostwriterPoster.alt,
            aspectRatio: '16 / 10',
            focalPoint: { x: 50, y: 42 },
            publicSafe: true
          }
        : undefined,
    size: 'standard',
    sequence: ['Passage', 'Tolkien', 'Visible edit', 'User confirm'],
    sequenceLabel: 'Ghostwriter editorial control sequence'
  },
  {
    id: 'mirror-ai',
    title: 'Mirror AI',
    category: 'Visual selection interface',
    shortDescription:
      'I built an image-selection flow that keeps the chosen object visible while its contour and explanation open.',
    valueLine: 'The selected subject stays visible while its details open.',
    href: '/work/mirror-ai',
    media: mirrorAiFilm
      ? {
          poster: mirrorAiFilm.poster ?? mirrorAiPoster?.src ?? mirrorAiFilm.src,
          webm: mirrorAiFilm.src,
          mp4: mirrorAiFilm.fallbackSrc,
          alt: mirrorAiFilm.alt,
          aspectRatio: '16 / 10',
          focalPoint: { x: 50, y: 50 },
          duration: 9.8,
          publicSafe: true
        }
      : mirrorAiPoster
        ? {
            poster: mirrorAiPoster.src,
            alt: mirrorAiPoster.alt,
            aspectRatio: '16 / 10',
            focalPoint: { x: 50, y: 50 },
            publicSafe: true
          }
        : undefined,
    size: 'standard'
  }
];
