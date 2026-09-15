import { homepageProjectTiles, type ProjectTile } from './project-media';

const vigiaTile: ProjectTile = {
  id: 'vigia',
  title: 'VIGIA',
  category: 'Crisis intelligence system',
  status: 'Portugal · live synthetic public demo',
  shortDescription:
    'I built an operational intelligence system that connects incidents, routes, facilities, resources, restrictions, and consequence-aware planning.',
  valueLine: 'Real product logic, public synthetic scenario, no operational services connected.',
  href: '/work/vigia',
  size: 'standard',
  sequence: ['Incident', 'Routes', 'Facilities', 'Consequences'],
  sequenceLabel: 'VIGIA operational intelligence sequence'
};

const secondVoiceTile = homepageProjectTiles.find((project) => project.id === 'ghostwriter');

const correctedSecondVoiceTile: ProjectTile | undefined = secondVoiceTile
  ? {
      ...secondVoiceTile,
      id: 'second-voice-ai',
      title: 'Second Voice AI',
      category: 'AI rewriting product',
      status: 'Editorial interaction · controlled deployment',
      shortDescription:
        'I built an expressive rewriting interface where people choose a literary voice, tune the mood, and see the transformation unfold through visible edits.',
      valueLine: 'Visible edits, deliberate sharing, and bounded generation.',
      href: '/work/second-voice-ai',
      sequenceLabel: 'Second Voice AI editorial control sequence'
    }
  : undefined;

const camera = homepageProjectTiles.find((project) => project.id === 'camera-harness');
const f24 = homepageProjectTiles.find((project) => project.id === 'f24-experience');
const mirror = homepageProjectTiles.find((project) => project.id === 'mirror-ai');

export const homepageReleaseProjectTiles: ProjectTile[] = [
  camera,
  vigiaTile,
  f24,
  correctedSecondVoiceTile,
  mirror
].filter((project): project is ProjectTile => Boolean(project));
