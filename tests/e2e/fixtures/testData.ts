export const site = {
  name: 'Miguel Almeida',
  email: 'miguelalmeida1592@gmail.com',
  linkedin: 'https://www.linkedin.com/in/miguelalmeida1/',
} as const;

export const homeHeroHeading =
  'I’m Miguel, a frontend engineer building multimodal and computer-vision systems.';

export const routes = {
  home: '/',
  story: '/story',
  cv: '/cv',
  linkedinBridge: '/out/linkedin',
  portfolioPdf: '/portfolio.pdf',
  missing: '/definitely-not-a-real-route'
} as const;

export const primaryNavigation = [
  { label: 'Work', href: '#work' },
  { label: 'Story', href: '/story' },
  { label: 'CV', href: '/cv' },
  { label: 'Contact', href: '#contact' }
] as const;

export const selectedWork = [
  'Camera Harness',
  'Production frontend at F24',
  'Ghostwriter',
  'Mirror AI'
] as const;

export const visitorFlows = {
  recruiter: {
    optionLabel: 'recruiter',
    alias: '1',
    greeting: 'Welcome. Let me save you scrolling.',
    errorFreeHelp: 'Numbers 1-4 work too.',
    ctas: ['Write directly', 'Book 15 min', 'Read the resume']
  },
  collaborator: {
    optionLabel: 'collaborator',
    alias: 'project',
    greeting: 'Hello, fellow maker.',
    ctas: ['Start a thread', 'See selected work']
  },
  curious: {
    optionLabel: 'curious',
    alias: '03',
    greeting: "Glad you're here. No pitch.",
    ctas: ['Read the story', 'Browse the work']
  },
  lost: {
    optionLabel: 'lost',
    alias: 'wrong',
    greeting: 'Happens to the best of us.',
    ctas: ['Start at the top', 'Or just say hi']
  }
} as const;

export const visitorInputError = 'Try recruiter, collaborator, curious, lost, or 1-4.';

export const cvSections = [
  'Technical focus',
  'Education',
  'Languages'
] as const;

export const storyChapters = ['Production engineering', 'AI service integration', 'Independent engineering'] as const;
