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
      ['Start with Needle if you want to see Miguel build a complete technical product: semantic search across 10,000 artworks, with retrieval, a visual interface, performance work, and an actual live app.', needle],
      ['For AI-assisted interaction design, Second Voice is a good next stop. For state management and reliability, look at Flow and Leu.', [...sv, ...flow, ...leu]]
    ], ['How does Needle search artworks?', 'What did Miguel build at F24?', 'How does Second Voice handle AI output?']);
  }

  if (match(q, /\b(impact|results|outcomes|achievement|metrics|measurable|numbers|improve|improved|improvement|accomplished|shipped)\b/) && (aboutCareer || match(q, /\bf24\b/))) {
    return make('impact', [
      [`The published CV reports a 75% reduction in request volume for one F24 alerting workflow, a 10× expansion in regression-test files (3 to 30), and message assistance shipped across 13 languages.`, cv],
      [`Miguel also reports authoring 2,000+ checks within a wider frontend suite of 7,000+ passing tests across 954 files. Those numbers describe his documented contribution and the team's suite—not a claim that he built the whole product alone.`, cv]
    ], ['Which parts did Miguel own at F24?', 'How does he test important workflows?', 'What did he build independently?']);
  }

  if (match(q, /\b(what did (he|miguel) (do|own|ship)|his role at f24|f24 responsibilities|f24 experience|at f24|original frontend)\b/)) {
    return make('f24-ownership', [
      ['At F24, Miguel worked on critical-communication software: he helped take the original Svelte/TypeScript frontend from mockups into production, owning frontend architecture, business rules, and interaction states within the product team.', f24],
      ['He then continued delivering React features and shared UI patterns alongside Product, Design, Backend, and QA. His public CV also documents improvements to alerting workflows, regressions, and multilingual messaging.', cv]
    ], ['What measurable impact did he have?', 'How did Svelte and React overlap?', 'How does he handle failure states?']);
  }

  if (match(q, /\b(how many years|how long .* (work|been|engineer)|timeline|career path|career progression|before f24)\b/) && !projectSlug) {
    return make('timeline', [
      ['Miguel moved from UX into frontend engineering, completed a UX Design diploma in 2021, and did independent client work in 2021–2022 before joining F24 in August 2022.', cv],
      ['His current published CV lists him as a Software Engineer working across frontend and product systems. The four-plus years of professional experience are broader than the time spent specifically in React.', cv]
    ], ['What did he build at F24?', 'What is his current stack?', 'How did UX shape his engineering?']);
  }

  if (match(q, /\b(how much react|years of react|react experience|svelte experience|how long.*svelte)\b/) && !projectSlug) {
    if (q.includes('svelte') && !q.includes('react')) {
      return make('framework-svelte', [
        ['Miguel’s public career history lists Svelte frontend work from 2022 to 2023 and continued frontend delivery from 2023 to 2025, before his current React-focused role.', cv],
        ['The important distinction is real production delivery across changing frontends, not a made-up framework-specific number of years.', [...cv, ...f24]]
      ], ['What changed between Svelte and React?', 'Which React project is best to review?']);
    }
    return make('framework-react', [
      ['The documented React role starts in 2026, not four years of React. Miguel’s broader production frontend experience began with Svelte and TypeScript at F24 in 2022.', cv],
      ['Needle, Second Voice, and Flow also show his React/TypeScript work in independent products with different technical challenges.', [...needle, ...sv, ...flow]]
    ], ['Which React project is best to review?', 'How does he structure reusable UI?']);
  }

  if (match(q, /\b(education|diploma|degree|studied|what did (?:miguel|he) study|study at|college|university|background in ux|why ux)\b/) && !projectSlug) {
    const education = cvEducation.map(record => `${record.title} (${record.year})`).join('; ');
    return make('education', [
      [`Miguel started with UX before moving deeper into engineering. His published education includes ${education}.`, cv],
      ['That still shows up in his code: he thinks about what people need to understand, how focus moves, and what happens when the happy path breaks.', story]
    ], ['How did he transition into frontend?', 'What does he care about in UX?', 'How does he work with designers?']);
  }

  if (match(q, /\b(recommendation|references|former manager|team lead say|colleague say)\b/)) {
    return make('reference', [
      ['There is a professional recommendation in Miguel’s CV, with its original attribution. It is better to read the actual quote than have this guide embellish someone else’s words.', ['Professional recommendation|/cv#recommendation']],
      ['The work samples also show how he documents decisions, tests risky states, and distinguishes shipped behavior from what still needs verification.', [...work, ...cv]]
    ], ['What did Miguel own at F24?', 'How does he collaborate?', 'What should a senior engineer review first?']);
  }

  if (match(q, /\b(how (does|do) (he|miguel) (work|collaborate)|collaboration|collaborat|teammates|cross functional|with design|with product|with backend|team player|handoff)\b/)) {
    return make('collaboration', [
      ['Miguel likes being close to the people shaping the product. At F24 he worked with Design, Product, Backend, and QA, turning mockups and product constraints into maintainable, testable UI.', [...cv, ...story]],
      ['He tends to take ownership of the entire interaction—not just how the screen looks, but its data contract, failure states, keyboard behavior, and what happens after release.', story]
    ], ['What did he own end to end?', 'How does he test UX decisions?', 'What kind of team suits him?']);
  }

  if (match(q, /\b(design philosophy|design taste|ux approach|ux philosophy|visual hierarchy|interface design|what (does he|do you) care about in (design|ux)|motion design|animations|responsive design|good ux)\b/)) {
    return make('design', [
      ['His design instinct is to remove friction before adding flair. Clear hierarchy, comfortable spacing, motion with a purpose, and predictable states matter more to him than decoration.', story],
      ['He learned UX first, then frontend, so the design thinking stays connected to implementation. In Second Voice that means showing exactly what the AI changed; in Leu it means never losing the passage that started a question.', [...sv, ...leu]]
    ], ['How does Second Voice show changes?', 'How does Leu preserve source context?', 'What does he consider good frontend engineering?']);
  }

  if (match(q, /\b(how does he (debug|test|handle bugs|ensure quality|build)|testing strategy|quality|accessibility|reliability|edge case|failure state|production readiness|resilien|maintainab|readability|architecture practices)\b/) && !projectSlug) {
    return make('engineering', [
      ['Miguel treats the difficult states as part of the product: failed requests should not erase useful work, stale responses should not overwrite newer ones, and closing an overlay should restore keyboard focus.', [...story, ...f24]],
      ['His CV documents typed contracts, Playwright and regression coverage. Flow adds structured actions with undo; Leu adds source-linked state and explicit verification limits. The common thread is making behavior inspectable and recoverable.', [...cv, ...flow, ...leu]]
    ], ['What did he improve at F24?', 'How does Flow undo a change?', 'How does he handle AI mistakes?']);
  }

  if (match(q, /\b(ai interests|interested in ai|ai workflows|ai products|machine learning|on.device ai|agents|future of frontend|why ai|ai career)\b/) && !projectSlug) {
    return make('ai-interest', [
      ['What interests Miguel about AI is the part people actually use: asking a better question, checking an answer, editing a result, and recovering when the system gets it wrong.', [...story, ...sv, ...leu]],
      ['That shows up differently in Second Voice’s inspectable rewrites, Leu’s source-grounded learning loop, and his interest in voice, image-to-text, and AI workflows. He wants to combine those ideas with serious frontend craft.', [...sv, ...leu, ...cv]]
    ], ['What did he build in Second Voice?', 'Does Leu run narration on device?', 'What kind of role is he looking for?']);
  }

  if (match(q, /\b(ideal (team|role|job)|next role|looking for|opportunities|job fit|why this team|why hire|hire miguel|good fit|best suited|what kind of company)\b/) && !projectSlug) {
    return make('role-fit', [
      ['Miguel is most at home where frontend engineering and product judgment meet. He enjoys teams that care about design quality, reusable code, dependable interactions, and thoughtfully integrated AI.', [...cv, ...story]],
      ['His F24 work gives him production constraints and teamwork; Needle, Second Voice, Leu and Flow show the range of products he can carry from idea to usable interface. He stays open-minded about interesting teams and problems rather than insisting on one rigid job description.', [...f24, ...needle, ...sv, ...leu, ...flow]]
    ], ['What did he own at F24?', 'Which independent project should I inspect?', 'How does he collaborate?']);
  }

  if (match(q, /\b(strengths|what makes him different|stands out|why should i interview|what is special|unique about miguel|what can he bring)\b/) && !projectSlug) {
    return make('strengths', [
      ['The useful combination is design judgment plus implementation ownership. Miguel can reason about a dense interface, build its frontend contracts, and stay with it through edge cases and verification.', [...cv, ...story]],
      ['For proof, compare his production work at F24 with Needle’s visual search, Second Voice’s transparent rewrite UI, and Flow’s reversible action model. Different products, the same care for clarity and behavior.', [...f24, ...needle, ...sv, ...flow]]
    ], ['What did Miguel improve at F24?', 'Which project best shows his technical depth?', 'How does he handle difficult UX?']);
  }

  if (match(q, /\b(weakness|growth area|what would he improve|still learning|gets better|working on personally|working on improving|working to improve)\b/) && !projectSlug) {
    return make('growth', [
      ['One thing Miguel is consciously working on is knowing when to stop polishing. He can happily spend too long refining an interaction because he cares about how it feels.', story],
      ['The practical balance is to define the acceptance bar early: get the critical behavior right, verify the edge cases, and leave optional polish for a deliberate next pass.', [...story, ...cv]]
    ], ['What motivates him?', 'How does he decide something is ready?', 'How does he approach UI reliability?']);
  }

  if (match(q, /\b(what does he do for fun|hobbies|outside (?:of )?work|free time|music|films|movies|tv shows|personal interests|as a person)\b/) && !projectSlug) {
    return make('personal', [
      ['Outside work, Miguel is a fairly relaxed homebody. He likes music, films and TV, learning new technology, and the kind of side project that quietly turns into a very detailed experiment.', story],
      ['He is particularly drawn to AI workflows and the little details that make an interface feel right. Curiosity is a big part of his personality, not just his CV.', [...story, ...work]]
    ], ['How did he start in UX?', 'What inspires his projects?', 'Which project feels most personal?']);
  }

  if (match(q, /\b(lisbon|portugal|portuguese|berlin|where is he from|where did he grow up|where is he based|location)\b/) && !projectSlug) {
    return make('origin', [
      ['Miguel is Portuguese, grew up in Lisbon, and is now based in Berlin. His public portfolio focuses on the work he does there as a frontend engineer and product designer.', [...story, ...cv]],
      ['If the question is about relocation, availability, or contract terms, it is best to ask him directly; this guide does not speak for him on those details.', ['Contact Miguel|/#contact']]
    ], ['How did he get into frontend?', 'What is his work background?', 'How can I contact him?']);
  }

  if (match(q, /\b(how to contact|contact miguel|email miguel|reach miguel|talk to miguel|book an interview|set up an interview)\b/)) {
    return make('contact', [
      ['The easiest way is to reach out directly through the portfolio’s Contact section or his LinkedIn profile. You can also read or download his CV first.', ['Contact Miguel|/#contact', ...cv]],
      ['This is a guide to his public work, not Miguel in a live chat, so questions about scheduling and personal availability are best sent to him.', ['Contact Miguel|/#contact']]
    ], ['Which project should I review first?', 'What did he work on at F24?']);
  }

  if (match(q, /\b(who is miguel|tell me about miguel|tell me about yourself|describe miguel|introduce miguel|who are you|quick introduction|thirty second intro|30 second intro|in a nutshell)\b/) && !projectSlug) {
    return make('introduction', [
      ['Miguel is a Portuguese frontend engineer based in Berlin, with a background in UX design. He has worked on production software at F24 since 2022 and also designs and builds his own products.', [...story, ...cv]],
      ['He cares a great deal about the quiet details: interactions that make sense, sturdy frontend systems, and AI features people can actually understand. He also really likes a good film and a stubborn technical puzzle.', [...story, ...needle, ...sv]]
    ], ['What did he build at F24?', 'Which project should I start with?', 'How did UX shape his work?']);
  }

  if (match(q, /\b(what languages|which languages|what can he speak|speaks|spoken languages)\b/) && !match(q, /\b(programming|code|typescript|javascript)\b/)) {
    return make('languages', [
      [`The public CV lists ${cvLanguages.join('; ')}. For exact proficiency wording, the CV is the reference.`, ['Languages|/cv#languages']]
    ], ['What did Miguel study?', 'What is his engineering stack?']);
  }

  if (match(q, /\b(what tech stack|technical stack|programming languages|tools does he use|his stack|frontend technologies)\b/) && !projectSlug) {
    const named = cvSkills.slice(0, 9).join(', ');
    return make('tech-stack', [
      [`His public CV lists ${named}. Day to day, his frontend story runs through TypeScript, Svelte, React, and careful testing.`, cv],
      ['The projects broaden that picture: Needle uses Web Workers and hybrid search; Flow has an action/state engine; Leu is a native SwiftUI and PDFKit app.', [...needle, ...flow, ...leu]]
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
    needle: 'Needle is Miguel’s semantic search interface for 10,000 artworks. He built the query and retrieval experience, including hybrid HNSW/exact search, worker-based processing, and a dense visual result view that stays usable.',
    'second-voice-ai': 'Second Voice is an AI writing product with an important design rule: your original stays visible, and every rewrite stays inspectable. Miguel built the editing experience and the request/recovery states around it.',
    leu: 'Leu makes reading more active without losing the source. It links questions, feedback, mastery decisions, and narration back to the actual PDF passage, with a native SwiftUI and PDFKit interface.',
    flow: 'Flow turns a spoken instruction into structured, editable product state. The interesting engineering work is not just understanding a sentence; it is making proposed calendar or personal actions safe to inspect, confirm, undo, and correct.',
    f24: 'F24 is Miguel’s professional production work. He helped build the original Svelte/TypeScript frontend and continued delivering features and shared UI architecture as React became part of the codebase.'
  };
  return make(`project-${slug}`, [
    [openings[slug], source],
    [`His documented contribution: ${item.ownership} The case study also explains what was tested and what remains unverified.`, source]
  ], [
    `What was the hardest decision in ${item.name}?`,
    `What evidence supports ${item.name}?`,
    `What technology does ${item.name} use?`
  ]);
}
