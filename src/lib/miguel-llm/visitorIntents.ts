import { cvEducation, cvSkills } from '$lib/content/folio';
import { publicSources } from './publicSources';
import type { AskFact } from './askConversation';

/**
 * The visible question is the request; a clicked portfolio region only supplies
 * context. Select intent before retrieving any source-area excerpt.
 *
 * Every response below is grounded in the published CV and case studies.
 * Two short, canonical facts are intentional: a provider never needs to remix
 * these into a loosely related biography.
 */
export type VisitorIntent = 'role' | 'stack' | 'education' | 'quality' | 'work' | 'f24';
export type IntentResponse = { intent: VisitorIntent; facts: AskFact[]; followups: string[] };

const cv = ['CV · Professional experience|/cv#experience'];
const skills = ['CV · Technical skills|/cv#skills'];
const education = ['Education|/cv#education'];
const story = ['My background|/story'];
const work = ['My selected projects|/#work'];
const f24 = ['F24 case study|/work/f24'];
const needle = ['Needle case study|/work/needle'];
const leu = ['Leu case study|/work/leu'];

export const normalizeVisitorQuestion = (input: string) => input.toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^\p{L}\p{N}\s]/gu, ' ')
  .replace(/\s+/g, ' ').trim();

const has = (q: string, terms: RegExp) => terms.test(q);
const isExperienceTimeline = (q: string) => has(q, /\b(how (?:long|many years)|years of|since when|react experience|svelte experience|timeline|duration)\b/);

function intentFor(question: string, area?: string, projectSlug?: string): VisitorIntent | undefined {
  const q = normalizeVisitorQuestion(question);

  // A clicked CV, Story, or case-study record is an explicit request for that
  // exact authored excerpt. Never substitute an introductory answer for it.
  const summaryAreas = new Set(['role', 'stack', 'quality', 'f24', 'nav-work', 'selwork']);
  if (area && !summaryAreas.has(area)) return;

  // A project question stays about the named project. F24 is special because
  // a role question about Miguel's employer is still a professional overview.
  if (projectSlug && projectSlug !== 'f24' && !['role', 'stack', 'quality', 'nav-work', 'selwork'].includes(area ?? '')) {
    return undefined;
  }
  if (area === 'role') return 'role';
  if (area === 'stack') return 'stack';
  if (area === 'quality') return 'quality';
  if (area === 'f24') return 'f24';
  if (area === 'nav-work' || area === 'selwork') return 'work';

  // Do not replace detailed, quantitative answers with an introductory blurb.
  if (isExperienceTimeline(q) || /\b(favou?rite|prefer|preference|most comfortable)\b/.test(q)) return;

  if (!projectSlug && has(q, /\b(ux design institute|careerfoundry|education|educational background|educated|diploma|qualification|qualifications|school|college|university|study at|studied at|where did (?:you|he|miguel) study|what did (?:you|he|miguel) study|what (?:is|was) (?:your|his) education|how did (?:you|he) learn ux)\b/)) return 'education';

  if (projectSlug === 'f24' && has(q, /\b(what (?:do|does) (?:you|he|miguel) do at f24|what did (?:you|he|miguel) do at f24|experience at f24|role at f24|responsibilities at f24|production work at f24)\b/)) return 'f24';
  if (projectSlug) return;

  if (has(q, /\b(tech stack|technology stack|technical stack|programming languages|technologies|frameworks|coding tools|developer tools)\b/)) return 'stack';
  if (has(q, /\b(?:whats |your |his |my )stack\b/)) return 'stack';
  if (has(q, /\b(what|which|how)\b/) && has(q, /\b(build with|builds with|built with|code with|work with|use to build|uses to build|tools do|tools does|tools you|tools he|his stack|your stack|my stack|does he use|do you use)\b/)) return 'stack';

  if (has(q, /\b(how (?:do|does) (?:you|he|miguel) (?:test|make sure|ensure)|how (?:do|does) (?:you|he) know it works|testing approach|quality assurance|handle failures|test strategy)\b/)) return 'quality';

  if (has(q, /\b(what (?:have|has) (?:you|he|miguel) (?:built|worked on)|which (?:projects|products) (?:have|has)|show me (?:your|his) projects|selected work|portfolio projects|what (?:are|were) (?:your|his) projects)\b/)) return 'work';

  if (has(q, /^(?:what (?:do|does|did) (?:you|he|miguel) (?:actually )?(?:do|work on)(?: for a living| at work)?|what (?:is|was) (?:your|his|miguels) (?:job|role|profession)|whats (?:your|his|miguels) (?:job|role|profession)|what kind of (?:engineer|developer) (?:are you|is he)|describe (?:your|his) (?:work|job))$/)) return 'role';
}

export function visitorIntentAnswer(question: string, area?: string, projectSlug?: string): IntentResponse | undefined {
  const intent = intentFor(question, area, projectSlug);
  if (!intent) return;

  const create = (pairs: Array<[string, string[]]>, followups: string[]): IntentResponse => ({
    intent,
    facts: pairs.map(([text, sources], i) => ({
      id: `visitor:${intent}:${i}`, text, sources: publicSources(sources)
    })),
    followups
  });

  switch (intent) {
    case 'role':
      return create([
        ["I'm a frontend engineer and product designer based in Berlin. At F24, I build critical-communication interfaces, working on architecture, business logic, interaction states, and reliability.", [...cv, ...f24]],
        ["I also design and build independent products: Needle for visual search, Second Voice for AI-assisted writing, Leu for learning from PDFs, and Flow for voice-driven actions.", work]
      ], ['What did you improve at F24?', 'What technologies do you use?', 'What did you study?']);

    case 'stack': {
      const core = cvSkills.filter(value => ['React', 'TypeScript', 'JavaScript', 'Svelte'].includes(value));
      const supporting = cvSkills.filter(value => ['Next.js', 'Vite', 'Tailwind', 'Playwright', 'Figma'].includes(value));
      return create([
        [`My main frontend stack is ${core.join(', ')}. Those are the technologies I reach for most often.`, skills],
        [`Depending on the product, I also use ${supporting.join(', ')}. Needle uses Web Workers for search; Leu is my native SwiftUI and PDFKit project.`, [...skills, ...needle, ...leu]]
      ], ['Which framework do you prefer?', 'How much React experience do you have?', 'How do you test your products?']);
    }

    case 'education': {
      const ux = cvEducation.find(item => item.place === 'UX Design Institute');
      const dev = cvEducation.find(item => item.place === 'CareerFoundry');
      if (!ux || !dev) return;
      return create([
        [`I studied ${ux.title} at the ${ux.place} (${ux.year}) and ${dev.title} at ${dev.place} (${dev.year}).`, education],
        ["UX came first for me. It still shapes how I design frontend interfaces: clear hierarchy, understandable interactions, and careful handling of things that go wrong.", story]
      ], ['How did you move from UX to engineering?', 'What do you work on at F24?', 'What are your main technologies?']);
    }

    case 'quality':
      return create([
        ["I test more than the happy path: loading, empty and failure states, stale responses, keyboard navigation, and different screen sizes. I want the interface to remain usable when something breaks.", [...cv, ...story]],
        ["I use Playwright, regression tests, and typed contracts. At F24, I wrote automated checks within a much larger team test suite; I don't present those team-wide numbers as mine alone.", cv]
      ], ['What did you improve at F24?', 'How do you approach accessibility?', 'What went wrong in Flow?']);

    case 'work':
      return create([
        ["At F24, I work on production critical-communication software. Outside that, I build my own products from design to implementation.", [...cv, ...f24]],
        ["My selected work includes Needle (semantic artwork search), Second Voice (AI writing and edit comparison), Leu (PDF learning), and Flow (reversible voice actions). Each case study shows the real technical decisions and limitations.", work]
      ], ['Which project should I start with?', 'What does Needle do?', 'What did you build at F24?']);

    case 'f24':
      return create([
        ["I've been building production frontend software at F24 since August 2022. I worked on the original Svelte and TypeScript frontend, then continued delivering React features and reusable patterns with the wider product team.", [...cv, ...f24]],
        ["My CV documents alerting workflow improvements, business logic, test coverage, and multilingual message assistance. I can explain the specific impact without claiming the entire platform was my work alone.", cv]
      ], ['What measurable impact did you have at F24?', 'How did Svelte and React overlap?', 'How do you test critical workflows?']);
  }
}
