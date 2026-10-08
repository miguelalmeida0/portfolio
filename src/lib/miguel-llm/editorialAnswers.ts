import { cvEducation, cvSkills, cvLanguages } from '$lib/content/folio';
import { currentGuideProjects } from './currentPortfolio';
import { publicSources } from './publicSources';
import type { AskFact } from './askConversation';

/**
 * Public, evidence-led answers for common visitor intents. These are editorial
 * summaries of the same facts used by /cv, /story and the five current cases.
 * They are not claims about Miguel's current feelings or private life.
 *
 * The remote model may SELECT these fact IDs, but may not invent their text.
 */
export type EditorialAnswer = {
  facts: AskFact[];
  followups: string[];
  conversational?: boolean;
};

const cv = ['Experience & CV|/cv'];
const story = ['Background & approach|/story'];
const f24 = ['F24 case study|/work/f24', ...cv];
const needle = ['Needle case study|/work/needle'];
const sv = ['Second Voice case study|/work/second-voice-ai'];
const leu = ['Leu case study|/work/leu'];
const flow = ['Flow case study|/work/flow'];
const work = ['Selected projects|/#work'];

function make(prefix: string, facts: Array<[string, string[]]>, followups: string[], conversational = false): EditorialAnswer {
  return { facts: facts.map(([text, sources], index) => ({
    id: `editorial:${prefix}:${index}`, text, sources: publicSources(sources)
  })), followups, conversational };
}
const match = (q: string, pattern: RegExp) => pattern.test(q);

/**
 * Specific intents first; broad words like "work", "design", and "team" must
 * never hijack an explicit technical/project question. Call only after project,
 * incident, comparison, and page-topic routing has been resolved.
 */
export function editorialAnswer(question: string, projectSlug?: string): EditorialAnswer | undefined {
  const q = question.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  const aboutCareer = match(q, /\b(experience|career|profession|job|work|years|role|company|employer)\b/);

  if (match(q, /\b(which|what)\s+(project|work|case study).*(start|first|look at|recommend|most impressive)|where should i start|what should i inspect first/)) {
    return make('start', [
      ['I’d start with Needle if you want to see my technical work. I built a semantic search experience for 10,000 artworks, including retrieval, visual exploration, and performance work. You can try the live app.', needle],
      ['For AI interface design, I’d show you Second Voice next. Flow and Leu go deeper into state, reliability, and decisions that need to be explainable.', [...sv, ...flow, ...leu]]
    ], ['How does Needle search artworks?', 'What did Miguel build at F24?', 'How does Second Voice handle AI output?']);
  }

  if (match(q, /\b(impact|results|outcomes|achievement|metrics|measurable|numbers|improve|improved|improvement|accomplished|shipped)\b/) && (aboutCareer || match(q, /\bf24\b/))) {
    return make('impact', [
      [`At F24 I cut request volume by 75% in one alerting workflow, expanded regression-test files from 3 to 30, and helped ship message assistance across 13 languages. These are the figures in my public CV.`, cv],
      [`I also wrote 2,000+ checks within a wider frontend suite reporting 7,000+ passing tests across 954 files. That suite is team work, not something I claim to have built alone.`, cv]
    ], ['Which parts did Miguel own at F24?', 'How does he test important workflows?', 'What did he build independently?']);
  }

  if (match(q, /\b(what did (he|miguel) (do|own|ship)|his role at f24|f24 responsibilities|f24 experience|at f24|original frontend)\b/)) {
    return make('f24-ownership', [
      ['At F24 I worked on critical-communication software. I helped bring the original Svelte and TypeScript frontend from mockups into production, owning core frontend architecture, business rules, and interaction states within the team.', f24],
      ['I went on to deliver React features and shared UI patterns with Product, Design, Backend, and QA. My CV documents the alerting, testing, and multilingual messaging work.', cv]
    ], ['What measurable impact did he have?', 'How did Svelte and React overlap?', 'How does he handle failure states?']);
  }

  if (match(q, /\b(how many years|how long .* (work|been|engineer)|timeline|career path|career progression|before f24)\b/) && !projectSlug) {
    return make('timeline', [
      ['I started in UX, completed a design diploma in 2021, and built client interfaces independently in 2021–2022. I joined F24 in August 2022.', cv],
      ['Today my CV describes my role as Software Engineer, Frontend & Product Systems. My overall frontend experience is broader than my time working specifically with React.', cv]
    ], ['What did he build at F24?', 'What is his current stack?', 'How did UX shape his engineering?']);
  }

  if (match(q, /\b(how much react|years of react|react experience|svelte experience|how long.*svelte)\b/) && !projectSlug) {
    if (q.includes('svelte') && !q.includes('react')) {
      return make('framework-svelte', [
        ['I worked with Svelte in production from 2022 through my subsequent frontend delivery work in 2023–2025. My current role also includes React.', cv],
        ['The important part for me is delivering production features as stacks evolve, not inflating the number of years I have used a particular framework.', [...cv, ...f24]]
      ], ['What changed between Svelte and React?', 'Which React project is best to review?']);
    }
    return make('framework-react', [
      ['My documented React role starts in 2026, so I would not claim four years of professional React experience. I began my production frontend work with Svelte and TypeScript at F24 in 2022.', cv],
      ['Needle, Second Voice, and Flow also show how I use React and TypeScript across quite different product problems.', [...needle, ...sv, ...flow]]
    ], ['Which React project is best to review?', 'How does he structure reusable UI?']);
  }

  if (match(q, /\b(education|diploma|degree|studied|what did (?:miguel|he) study|study at|college|university|background in ux|why ux)\b/) && !projectSlug) {
    const education = cvEducation.map(record => `${record.title} (${record.year})`).join('; ');
    return make('education', [
      [`I started in UX before going deeper into engineering. My education includes ${education}.`, ['Education|/cv#education']],
      ['That UX background is still in my code: what someone needs to understand, where focus goes, and what happens when the happy path breaks.', story]
    ], ['How did he transition into frontend?', 'What does he care about in UX?', 'How does he work with designers?']);
  }

  if (match(q, /\b(recommendation|references|former manager|team lead say|colleague say)\b/)) {
    return make('reference', [
      ['I have a recommendation in my CV, with its original attribution. I’d rather you read my former teammate’s exact words than have this guide dress them up.', ['Professional recommendation|/cv#recommendation']],
      ['My work samples show how I document decisions, test risky states, and separate shipped behavior from things I still need to verify.', [...work, ...cv]]
    ], ['What did Miguel own at F24?', 'How does he collaborate?', 'What should a senior engineer review first?']);
  }

  if (match(q, /\b(how (does|do) (he|miguel) (work|collaborate)|collaboration|collaborat|teammates|cross functional|with design|with product|with backend|team player|handoff)\b/)) {
    return make('collaboration', [
      ['I like working closely with the people shaping a product. At F24 I partnered with Design, Product, Backend, and QA to turn mockups and real constraints into maintainable, testable UI.', [...cv, ...story]],
      ['I try to own the whole interaction, not just the pixels: contracts, failure states, keyboard behavior, and what happens after release.', story]
    ], ['What did he own end to end?', 'How does he test UX decisions?', 'What kind of team suits him?']);
  }

  if (match(q, /\b(design philosophy|design taste|ux approach|ux philosophy|visual hierarchy|interface design|what (does he|do you) care about in (design|ux)|motion design|animations|responsive design|good ux)\b/)) {
    return make('design', [
      ['My first instinct is to remove friction before adding anything decorative. I care about hierarchy, breathing room, meaningful motion, and states that behave predictably.', story],
      ['I learned UX before frontend, so my design decisions stay connected to the implementation. In Second Voice that means showing what AI changed; in Leu it means never losing the source passage.', [...sv, ...leu]]
    ], ['How does Second Voice show changes?', 'How does Leu preserve source context?', 'What does he consider good frontend engineering?']);
  }

  if (match(q, /\b(how does (?:he|miguel) (debug|test|handle bugs|handle failure|ensure quality|build)|testing strategy|quality|accessibility|reliability|edge case|failure states?|production readiness|resilien|maintainab|readability|architecture practices)\b/) && !projectSlug) {
    return make('engineering', [
      ['I treat the difficult states as part of the product: a failed request shouldn’t erase useful work, a stale response shouldn’t overwrite new data, and an overlay should return keyboard focus when it closes.', [...story, ...f24]],
      ['I use typed contracts, Playwright and regression tests. In Flow I make actions undoable; in Leu I preserve source-linked state. I want people to be able to inspect and recover from what software does.', [...cv, ...flow, ...leu]]
    ], ['What did he improve at F24?', 'How does Flow undo a change?', 'How does he handle AI mistakes?']);
  }

  if (match(q, /\b(ai interests|interested in ai|ai workflows|ai products|machine learning|on.device ai|agents|future of frontend|why ai|ai career)\b/) && !projectSlug) {
    return make('ai-interest', [
      ['What draws me to AI is what happens in the interface: asking better questions, checking an answer, editing a result, and recovering when a model gets things wrong.', [...story, ...sv, ...leu]],
      ['I explore that in Second Voice’s inspectable rewrites and Leu’s source-grounded learning loop. I’m also curious about voice, image-to-text, and AI workflows, particularly where they meet thoughtful frontend engineering.', [...sv, ...leu, ...cv]]
    ], ['What did he build in Second Voice?', 'Does Leu run narration on device?', 'What kind of role is he looking for?']);
  }

  if (match(q, /\b(ideal (team|role|job)|next role|looking for|opportunities|job fit|why this team|why hire|hire miguel|good fit|best suited|what kind of company)\b/) && !projectSlug) {
    return make('role-fit', [
      ['I’m happiest where frontend engineering and product judgment meet. I enjoy teams that care about design quality, reusable code, dependable interactions, and useful AI.', [...cv, ...story]],
      ['F24 has taught me about production constraints and collaboration. Needle, Second Voice, Leu, and Flow let me explore different product ideas end to end. I’m open-minded about good teams and interesting problems.', [...f24, ...needle, ...sv, ...leu, ...flow]]
    ], ['What did he own at F24?', 'Which independent project should I inspect?', 'How does he collaborate?']);
  }

  if (match(q, /\b(strengths|what makes him different|stands out|why should i interview|what is special|unique about miguel|what can he bring)\b/) && !projectSlug) {
    return make('strengths', [
      ['I bring both design judgment and implementation ownership. I can work through a dense interface, build the frontend contracts behind it, and stay with the work through edge cases and verification.', [...cv, ...story]],
      ['For examples, look at my production work at F24, Needle’s visual search, Second Voice’s transparent rewrite UI, and Flow’s reversible actions. The problems differ, but I apply the same care to clarity and behavior.', [...f24, ...needle, ...sv, ...flow]]
    ], ['What did Miguel improve at F24?', 'Which project best shows his technical depth?', 'How does he handle difficult UX?']);
  }

  if (match(q, /\b(weakness|growth area|what would he improve|still learning|gets better|working on personally|working on improving|working to improve)\b/) && !projectSlug) {
    return make('growth', [
      ['I’m working on knowing when to stop polishing. I can spend longer than planned refining an interaction because I genuinely care about how it feels.', story],
      ['What helps me is defining the acceptance bar early: make the critical behavior reliable, verify edge cases, and plan optional polish for a separate pass.', [...story, ...cv]]
    ], ['What motivates him?', 'How does he decide something is ready?', 'How does he approach UI reliability?']);
  }

  if (match(q, /\b(what does he do for fun|hobbies|outside (?:of )?work|free time|music|films|movies|tv shows|personal interests|as a person)\b/) && !projectSlug) {
    return make('personal', [
      ['Outside work, I’m a pretty relaxed homebody. I love music, films, and TV, and I keep finding new technology to explore. Sometimes a tiny side project turns into a rather detailed experiment.', story],
      ['I’m especially drawn to AI workflows and those small interface details that make something feel right. Curiosity isn’t just a line on my CV.', [...story, ...work]]
    ], ['How did he start in UX?', 'What inspires his projects?', 'Which project feels most personal?']);
  }

  if (match(q, /\b(lisbon|portugal|portuguese|berlin|where is he from|where did he grow up|where is he based|location)\b/) && !projectSlug) {
    return make('origin', [
      ['I’m Portuguese, grew up in Lisbon, and now live in Berlin. I work where frontend engineering and product design overlap.', [...story, ...cv]],
      ['For relocation, availability, or contract details, please contact me directly. This guide uses my public notes, not my live calendar or personal commitments.', ['Contact Miguel|/#contact']]
    ], ['How did he get into frontend?', 'What is his work background?', 'How can I contact him?']);
  }

  if (match(q, /\b(how to contact|contact miguel|email miguel|reach miguel|talk to miguel|book an interview|set up an interview)\b/)) {
    return make('contact', [
      ['You can reach me through the Contact section or LinkedIn, or read my CV if you’d like more background first.', ['Contact Miguel|/#contact', ...cv]],
      ['This is a portfolio guide using my prepared answers, not a live chat with me. Please email me for interview scheduling or availability.', ['Contact Miguel|/#contact']]
    ], ['Which project should I review first?', 'What did he work on at F24?']);
  }

  if (match(q, /\b(who is miguel|tell me about miguel|tell me about yourself|describe miguel|introduce miguel|who are you|quick introduction|thirty second intro|30 second intro|in a nutshell)\b/) && !projectSlug) {
    return make('introduction', [
      ['I’m a Portuguese frontend engineer based in Berlin. I started in UX, have worked on production software at F24 since 2022, and love building independent products.', [...story, ...cv]],
      ['I care about small details: interactions that make sense, resilient frontend systems, and AI features you can actually understand. I’m also always up for a good film or a stubborn technical puzzle.', [...story, ...needle, ...sv]]
    ], ['What did he build at F24?', 'Which project should I start with?', 'How did UX shape his work?']);
  }

  if (match(q, /\b(what languages|which languages|what can he speak|speaks|spoken languages)\b/) && !match(q, /\b(programming|code|typescript|javascript)\b/)) {
    return make('languages', [
      [`My CV lists ${cvLanguages.join('; ')}. You can check the proficiency wording there.`, ['Languages|/cv#languages']]
    ], ['What did Miguel study?', 'What is his engineering stack?']);
  }

  if (match(q, /\b(favou?rite (?:tech(?:nology)? )?(?:stack|tools|frameworks|languages)|(?:stack|tools|frameworks) (?:do you|does he) (?:prefer|love|like)|which (?:tech|tools|frameworks) (?:do you|does he) (?:prefer|like)|what (?:is|are) (?:your|his|miguel's) favou?rite (?:tech(?:nology)? )?(?:stack|tools|frameworks))\b/)) {
    return make('favorite-stack', [
      ["I reach for React and TypeScript most often, and I have a soft spot for Svelte too. I also love the design side of frontend—that’s as important to me as choosing the framework.", [...cv, ...story]],
      ["I prefer a lean, maintainable stack. I’ll bring in a library when it solves a real problem, but I don't want the product to depend on packages it doesn’t need. For native work I use SwiftUI and PDFKit in Leu.", [...story, ...leu]]
    ], ['How much React experience do you have?', 'How do you decide which libraries to use?', 'What did you build with Svelte?']);
  }

  if (match(q, /\b(what tech stack|technical stack|programming languages|tools does he use|his stack|frontend technologies)\b/) && !projectSlug) {
    const named = cvSkills.slice(0, 9).join(', ');
    return make('tech-stack', [
      [`My CV lists ${named}. My main frontend tools are React, TypeScript, and Svelte, with testing and UX design part of how I work.`, cv],
      ['My projects stretch beyond that: I use Web Workers and hybrid search in Needle, structured actions in Flow, and SwiftUI/PDFKit for native Leu.', [...needle, ...flow, ...leu]],
      ['From 2022 to 2023, I built reusable Svelte and TypeScript UI at F24. I continued frontend delivery from 2023 to 2025, then moved into my documented React role in 2026.', cv]
    ], ['How long has he used React?', 'Which project shows complex state management?', 'How does he test frontend work?']);
  }

  // Avoid treating any mention of a project name as permission to make up a
  // personal preference or give an unsourced career claim.
  return undefined;
}

export function projectIntroduction(slug: string): EditorialAnswer | undefined {
  const item = currentGuideProjects.find(project => project.slug === slug);
  if (!item) return;
  const source = [`${item.name} case study|/work/${item.slug}`];
  const openings: Record<string, string> = {
    needle: 'I built Needle to make 10,000 artworks searchable by meaning. It combines hybrid HNSW/exact retrieval, Web Workers, and a visual result view that stays usable even when the collection gets dense.',
    'second-voice-ai': 'I built Second Voice around a simple rule: you should always see your original writing and exactly what AI changed. I designed the editing experience, comparison, and recovery states around that.',
    leu: 'I built Leu to help people understand what they read without losing their place. Questions, feedback, learner state, and narration all link back to the PDF passage in a native SwiftUI/PDFKit interface.',
    flow: 'I built Flow to turn spoken instructions into structured, editable actions. The hard part is making those actions safe to inspect, confirm, undo, and correct—not simply recognizing a sentence.',
    f24: 'At F24 I helped build the original production Svelte/TypeScript frontend, then continued shipping features and shared UI architecture as React became part of the codebase.'
  };
  return make(`project-${slug}`, [
    [openings[slug], source],
    [`My documented contribution: ${item.ownership} The case study also explains what I verified and what still needs work.`, source]
  ], [
    `What was the hardest decision in ${item.name}?`,
    `What evidence supports ${item.name}?`,
    `What technology does ${item.name} use?`
  ]);
}
