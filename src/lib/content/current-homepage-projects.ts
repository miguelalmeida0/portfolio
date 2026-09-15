import type { ProjectTile } from './project-media';
import { getApprovedMedia } from './project-media';

const cameraResultPoster = getApprovedMedia('camera-harness-microscope-live');
const f24Poster = getApprovedMedia('f24-hackathon-presentation-room');
const ghostwriterPoster = getApprovedMedia('ghostwriter-home');
const ghostwriterFilm = getApprovedMedia('ghostwriter-portfolio-film');
const mirrorAiPoster = getApprovedMedia('mirror-ai-aquarium-selection');
const mirrorAiFilm = getApprovedMedia('mirror-ai-active-image-demo');

/** Recruiter-facing order for the current portfolio. */
export const currentHomepageProjectTiles: ProjectTile[] = [
  {
    id: 'vigia',
    title: 'VIGIA',
    category: 'Crisis operations system',
    status: 'Working prototype · Portugal',
    shortDescription:
      'I am building an operational picture that connects incident truth, routes, facilities and resource constraints before it presents an option to a human operator.',
    valueLine: 'The system advises. The human remains the authority.',
    href: '/work/vigia',
    media: {
      poster: '/projects/vigia/decision-loop.svg',
      alt: 'Portfolio diagram of the VIGIA decision loop from retained incident facts through operational constraints to a human decision.',
      aspectRatio: '21 / 9',
      focalPoint: { x: 50, y: 50 },
      publicSafe: true
    },
    size: 'hero',
    featured: true
  },
  {
    id: 'ghostwriter',
    title: 'Second Voice AI',
    category: 'Literary AI product',
    status: 'Deployed surface · AI access gated',
    shortDescription:
      'A literary rewrite interface with visible word-level edits, deliberate sharing and a server path that stops when authorization or accounting is uncertain.',
    valueLine: 'Playful on the surface; deliberately bounded underneath.',
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
    size: 'standard'
  },
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
    valueLine: 'Production work across product, design, backend and QA.',
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
