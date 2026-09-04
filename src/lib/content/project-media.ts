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
  responsive?: ResponsiveImageSources;
};

export type ResponsiveImageSources = {
  avifSrcset: string;
  webpSrcset: string;
  sizes: string;
  width: number;
  height: number;
};

export type ProjectMedia = {
  poster: string;
  posterSources?: ResponsiveImageSources;
  webm?: string;
  mp4?: string;
  alt: string;
  aspectRatio?: string;
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
  technicalTension?: string;
  href: string;
  media?: ProjectMedia;
  size: 'hero' | 'wide' | 'portrait' | 'standard' | 'small';
  featured?: boolean;
  sequence?: string[];
  sequenceLabel?: string;
};

const responsiveCaseStudyImage = (
  name: string,
  widths: number[],
  width: number,
  height: number,
  sizes: string
): ResponsiveImageSources => ({
  avifSrcset: widths
    .map((candidate) => `/media/v1/case-study/${name}-${candidate}.avif ${candidate}w`)
    .join(', '),
  webpSrcset: widths
    .map((candidate) => `/media/v1/case-study/${name}-${candidate}.webp ${candidate}w`)
    .join(', '),
  sizes,
  width,
  height
});

export const portfolioMediaAssets: PortfolioMediaAsset[] = [
  {
    id: 'camera-harness-book-recognition-loop',
    projectId: 'camera-harness',
    kind: 'video',
    src: '/media/v1/home/camera-harness-preview.webm',
    fallbackSrc: '/media/v1/home/camera-harness-preview.mp4',
    poster: '/media/v1/home/camera-harness-poster-1024.webp',
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
    src: '/projects/camera-harness/microscope-live-result.png',
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
      'Camera-off current surface. It demonstrates product structure, not live recognition or model accuracy.',
    responsive: responsiveCaseStudyImage(
      'camera-harness-current',
      [640, 1024, 1440],
      1440,
      900,
      '(max-width: 760px) calc(100vw - 2.5rem), 52rem'
    )
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
    note: 'Historical interface. Sensefield is not mounted in the current product.',
    responsive: responsiveCaseStudyImage(
      'camera-harness-historical',
      [640, 1024, 1440],
      1440,
      900,
      '(max-width: 760px) calc(100vw - 2.5rem), 52rem'
    )
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
      'Camera Harness hero image. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.',
    responsive: responsiveCaseStudyImage(
      'camera-harness-hero',
      [768, 1280, 1920],
      2108,
      902,
      '(max-width: 1120px) calc(100vw - 2.5rem), 52rem'
    )
  },
  {
    id: 'camera-harness-peace-sign-result',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/camera-peace-sign-result-crop.png',
    alt:
      'Camera Harness product interface showing a live camera preview, a raised peace sign, and a movement result awaiting confirmation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Single recorded product state. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.',
    responsive: responsiveCaseStudyImage(
      'camera-harness-peace',
      [768, 1280, 1920],
      2100,
      910,
      '(max-width: 760px) calc(100vw - 2.5rem), 46rem'
    )
  },
  {
    id: 'camera-harness-mug-result',
    projectId: 'camera-harness',
    kind: 'photo',
    src: '/projects/camera-harness/camera-mug-result-crop.png',
    alt:
      'Camera Harness product interface showing a live camera preview with a mug and a movement result awaiting confirmation.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: true,
    containsPrivateEnvironment: true,
    capturedAt: '2026-07',
    note:
      'Single recorded product state. Published at the user’s explicit direction on 2026-07-29; it does not establish general recognition accuracy.',
    responsive: responsiveCaseStudyImage(
      'camera-harness-mug',
      [768, 1280, 1920],
      2100,
      910,
      '(max-width: 760px) calc(100vw - 2.5rem), 46rem'
    )
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
    src: '/media/v1/home/mirror-ai-preview.webm',
    fallbackSrc: '/media/v1/home/mirror-ai-preview.mp4',
    poster: '/media/v1/home/mirror-ai-poster-1024.webp',
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
    src: '/projects/f24-ai-hackathon/presentation-room.png',
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
    src: '/projects/toikien.png',
    alt:
      'Ghostwriter editorial interface with an author selector, mood control, and an illustrated writer at a typewriter.',
    status: 'current',
    publicStatus: 'approved',
    containsPerson: false,
    containsPrivateEnvironment: false,
    capturedAt: '2026-07',
    responsive: responsiveCaseStudyImage(
      'ghostwriter',
      [768, 1280, 1440],
      1440,
      900,
      '(max-width: 960px) calc(100vw - 2.5rem), 52rem'
    )
  },
  {
    id: 'ghostwriter-portfolio-film',
    projectId: 'ghostwriter',
    kind: 'video',
    src: '/media/v1/home/ghostwriter-preview.webm',
    fallbackSrc: '/media/v1/home/ghostwriter-preview.mp4',
    poster: '/media/v1/home/ghostwriter-poster-1024.webp',
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
const ghostwriterPoster = getApprovedMedia('ghostwriter-home');
const ghostwriterFilm = getApprovedMedia('ghostwriter-portfolio-film');
const creaturePoster = getApprovedMedia('creature-mirror-tracking');
const mirrorAiPoster = getApprovedMedia('mirror-ai-aquarium-selection');
const mirrorAiFilm = getApprovedMedia('mirror-ai-active-image-demo');

const homepageCardSizes =
  '(max-width: 680px) calc(100vw - 2.5rem), (max-width: 1100px) calc(50vw - 2rem), 46rem';

const responsiveProjectPoster = (
  name: string,
  width: number,
  height: number,
  sizes = homepageCardSizes
): ResponsiveImageSources => ({
  avifSrcset: `/media/v1/home/${name}-640.avif 640w, /media/v1/home/${name}-1024.avif 1024w, /media/v1/home/${name}-1440.avif 1440w`,
  webpSrcset: `/media/v1/home/${name}-640.webp 640w, /media/v1/home/${name}-1024.webp 1024w, /media/v1/home/${name}-1440.webp 1440w`,
  sizes,
  width,
  height
});

export const homepageProjectTiles: ProjectTile[] = [
  {
    id: 'camera-harness',
    title: 'Camera Harness',
    category: 'Live visual interfaces',
    status: 'Experimental · hybrid local / hosted',
    shortDescription:
      'Keeping frames, tracks, labels, and answers attached to the same evidence.',
    technicalTension: 'Generation ownership · latest-frame queue · bounded image memory',
    href: '/work/camera-harness',
    media: cameraResultPoster
      ? {
          poster: '/media/v1/home/camera-harness-poster-1024.webp',
          posterSources: responsiveProjectPoster('camera-harness-poster', 1440, 900),
          webm: '/media/v1/home/camera-harness-preview.webm',
          mp4: '/media/v1/home/camera-harness-preview.mp4',
          alt: cameraResultPoster.alt,
          aspectRatio: '16 / 10',
          focalPoint: { x: 50, y: 36 },
          duration: 6.7,
          publicSafe: true
        }
      : undefined,
    size: 'hero',
    featured: true
  },
  {
    id: 'ghostwriter',
    title: 'Ghostwriter',
    category: 'Literary rewrite',
    status: 'Tolkien mode · deterministic film',
    shortDescription:
      'Keep the meaning. Change the atmosphere. Watch a plain passage become a story, then decide what leaves the draft.',
    technicalTension: 'Select passage → choose Tolkien → inspect rewrite → confirm',
    href: '/work/ghostwriter',
    media: ghostwriterFilm
      ? {
          poster: ghostwriterFilm.poster ?? ghostwriterPoster?.src ?? ghostwriterFilm.src,
          posterSources: responsiveProjectPoster('ghostwriter-poster', 1440, 900),
          webm: '/media/v1/home/ghostwriter-preview.webm',
          mp4: '/media/v1/home/ghostwriter-preview.mp4',
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
    id: 'creature-mirror',
    title: 'Creature App',
    category: 'Movement correspondence',
    status: 'Prototype',
    shortDescription: 'Mapping live body movement onto a tracked 3D character.',
    href: '/story#builder',
    media: creaturePoster
      ? {
          poster: '/media/v1/home/creature-app-1024.webp',
          posterSources: responsiveProjectPoster('creature-app', 1440, 900),
          alt: creaturePoster.alt,
          aspectRatio: '16 / 10',
          focalPoint: { x: 45, y: 42 },
          publicSafe: true
        }
      : undefined,
    size: 'standard'
  },
  {
    id: 'mirror-ai',
    title: 'Mirror AI',
    category: 'Visual selection interface',
    status: 'Prototype',
    shortDescription:
      'Images should be explorable. Select a subject to reveal its contour, identity, and visible evidence.',
    technicalTension: 'Point → local segmentation → item semantics → anchored inspector',
    href: '/story#builder',
    media: mirrorAiFilm
      ? {
          poster: mirrorAiFilm.poster ?? mirrorAiPoster?.src ?? mirrorAiFilm.src,
          posterSources: responsiveProjectPoster('mirror-ai-poster', 1440, 900),
          webm: '/media/v1/home/mirror-ai-preview.webm',
          mp4: '/media/v1/home/mirror-ai-preview.mp4',
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
