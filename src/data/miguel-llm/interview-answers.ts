export interface MiguelInterviewAnswer {
  id: string;
  title: string;
  tags: string[];
  patterns: RegExp[];
  shortAnswer: string;
  sources: string[];
  suggestedNextQuestions: string[];
}

export const miguelInterviewAnswers: MiguelInterviewAnswer[] = [
  {
    id: 'interview-looking-for',
    title: 'What Miguel is looking for',
    tags: ['recruiter', 'looking for', 'opportunities', 'role', 'ai'],
    patterns: [
      /\bwhat (?:are|r) you looking for\b/,
      /\bwhat do you want (?:next|from your next role)?\b/,
      /\bwhat opportunities\b/,
      /\bwhat kind of (?:role|job|project)s?\b/
    ],
    shortAnswer:
      'I am open to any projects. I would like to join a team that is currently working with AI, or starting to implement AI in its processes, because that fascinates me a lot!',
    sources: ['Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['What kind of team would you like to join?', 'Why does AI interest you?']
  },
  {
    id: 'interview-team-fit',
    title: 'Team and environment fit',
    tags: ['recruiter', 'team', 'culture', 'adaptability', 'environment'],
    patterns: [
      /\b(?:which|what) kind of team\b/,
      /\b(?:which|what) type of team\b/,
      /\bteam would you like\b/,
      /\bideal team\b/,
      /\bwork(?:ing)? environment\b/,
      /\bteam culture\b/,
      /\badapt (?:to|in)\b/
    ],
    shortAnswer:
      'I am more than used to working with different people, and I can adapt super fast to any environment. I am open-minded about the team itself - what matters most is having an interesting challenge and people who care about building something well.',
    sources: ['Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['What are you looking for next?', 'How do you collaborate with design and product?']
  },
  {
    id: 'interview-introduction',
    title: 'Personal introduction',
    tags: ['recruiter', 'introduction', 'about', 'summary', 'identity'],
    patterns: [
      /\b(?:tell me|talk) about yourself\b/,
      /\bwho (?:are you|is miguel)\b/,
      /\bintroduce yourself\b/,
      /\bwalk me through your background\b/,
      /\bsummarize (?:yourself|miguel)\b/
    ],
    shortAnswer:
      'I am Miguel, a Portuguese software engineer living in Berlin. I grew up in Lisbon surrounded by computers and software, and that curiosity is still very much there: frontend, product UI, AI, new technologies, and a looooot of designing.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio positioning'],
    suggestedNextQuestions: ['Why did you choose frontend?', 'What are your passions?']
  },
  {
    id: 'interview-why-hire',
    title: 'Why hire Miguel',
    tags: ['recruiter', 'hire', 'value', 'fit', 'strengths'],
    patterns: [
      /\bwhy should (?:we|i) hire you\b/,
      /\bwhy (?:are you|would you be) a good fit\b/,
      /\bwhat (?:would|do) you bring\b/,
      /\bwhy miguel\b/,
      /\bvalue (?:can|would) you add\b/
    ],
    shortAnswer:
      'I bring a useful mix of frontend engineering and real design sensitivity. I can build clean, reusable React or TypeScript UI, make it work properly across screens, and still care about whether the final experience feels clear, polished, and human.',
    sources: ['Portfolio positioning / CV CTA', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What are your strongest skills?', 'What should we inspect first?']
  },
  {
    id: 'interview-strengths',
    title: 'Professional strengths',
    tags: ['recruiter', 'strengths', 'responsive', 'design', 'problem solving'],
    patterns: [
      /\bwhat are your (?:biggest |main |strongest )?strengths\b/,
      /\bwhat are you best at\b/,
      /\bwhere do you excel\b/,
      /\bstrongest skill\b/
    ],
    shortAnswer:
      'My strongest areas are responsive UI, reusable frontend architecture, and turning design intent into something that still works under real product constraints. I am also very persistent with complex problems - sometimes a little too persistent for my sleep schedule.',
    sources: ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio approach / CV'],
    suggestedNextQuestions: ['What is a growth area for you?', 'How do you approach responsive UI?']
  },
  {
    id: 'interview-growth-area',
    title: 'Weakness and growth area',
    tags: ['recruiter', 'weakness', 'growth', 'improvement', 'polishing'],
    patterns: [
      /\bwhat (?:is|are) your (?:biggest )?weakness/,
      /\bwhat are you (?:trying to |currently )?improv/,
      /\bgrowth area\b/,
      /\bwhat do you struggle with\b/,
      /\bdevelopment area\b/
    ],
    shortAnswer:
      'I am learning to call things done at the right moment. When I care about a project, I can keep polishing it because I can still see tiny improvements everywhere; the growth for me is protecting that care while recognizing when shipping is the better decision.',
    sources: ['Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you prioritize?', 'How do you handle deadlines?']
  },
  {
    id: 'interview-current-role',
    title: 'Current role',
    tags: ['recruiter', 'current role', 'employer', 'f24', 'experience'],
    patterns: [
      /\bwhere do you work (?:currently|now)\b/,
      /\bcurrent (?:job|role|employer)\b/,
      /\bwhat do you do at f24\b/,
      /\btell me about your current role\b/
    ],
    shortAnswer:
      'I currently work at F24 as a mid-level software engineer. I ship product features and take increasing ownership of shared frontend architecture and the design-system layer, with a strong focus on reliability and UI consistency.',
    sources: ['CV / Experience timeline'],
    suggestedNextQuestions: ['What have you learned at F24?', 'What are you looking for next?']
  },
  {
    id: 'interview-career-journey',
    title: 'Career journey',
    tags: ['recruiter', 'career', 'experience', 'journey', 'f24', 'freelance'],
    patterns: [
      /\bwalk me through your (?:career|experience|cv|resume)\b/,
      /\bcareer (?:journey|path|story)\b/,
      /\bhow did you get (?:here|into software|into tech)\b/,
      /\btell me about your experience\b/
    ],
    shortAnswer:
      'I started with freelance frontend work, then joined F24 and grew from building React and TypeScript UI into helping lead frontend delivery and taking more ownership of shared architecture. The common thread has always been the same: I like making complicated product flows clearer, more reusable, and much nicer to use.',
    sources: ['CV / Experience timeline'],
    suggestedNextQuestions: ['Why did you choose frontend?', 'What is your proudest achievement?']
  },
  {
    id: 'interview-why-technology',
    title: 'Why technology',
    tags: ['recruiter', 'motivation', 'technology', 'childhood', 'computers'],
    patterns: [
      /\bwhy (?:technology|tech|software)\b/,
      /\bwhat got you into (?:technology|tech|software|coding)\b/,
      /\bwhy did you become (?:a developer|an engineer)\b/
    ],
    shortAnswer:
      'Technology has fascinated me since I was a kid. I grew up surrounded by computers and software, so learning how things work and eventually building them myself felt less like a sudden career decision and more like following something that had always been there.',
    sources: ['Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['Why frontend specifically?', 'What are you learning now?']
  },
  {
    id: 'interview-why-frontend',
    title: 'Why frontend',
    tags: ['recruiter', 'frontend', 'motivation', 'design', 'product'],
    patterns: [
      /\bwhy frontend\b/,
      /\bwhy did you choose frontend\b/,
      /\bwhat do you like about frontend\b/,
      /\bwhy not backend\b/
    ],
    shortAnswer:
      'Frontend gives me the engineering problem and the human result at the same time. I enjoy clean architecture, but I also want to see the flow, shape the interaction, improve the design, and know that a person can actually understand what I built.',
    sources: ['Personal biography / Miguel-approved notes', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you balance design and engineering?', 'What tools do you prefer?']
  },
  {
    id: 'interview-passions',
    title: 'Passions',
    tags: ['personal', 'passions', 'ai', 'technology', 'architecture', 'music'],
    patterns: [
      /\bwhat are your passions\b/,
      /\bwhat are you passionate about\b/,
      /\bwhat do you love doing\b/,
      /\bwhat excites you in life\b/
    ],
    shortAnswer:
      'I am passionate about learning new AI topics and discovering new technologies. I also really enjoy upgrading a project architecture or improving a complicated flow until everything works more cleanly - and outside of tech, listening to music is a big part of my everyday life.',
    sources: ['Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['What AI topics are you learning?', 'What do you enjoy outside work?']
  },
  {
    id: 'interview-hobbies',
    title: 'Life outside work',
    tags: ['personal', 'hobbies', 'music', 'movies', 'tv', 'homebody'],
    patterns: [
      /\bwhat do you do (?:outside|after) work\b/,
      /\bwhat are your hobbies\b/,
      /\binterests outside (?:of )?work\b/,
      /\bwhat do you do for fun\b/,
      /\bfree time\b/
    ],
    shortAnswer:
      'I am a pretty simple homebody. I listen to a lot of music, watch TV shows and movies, and can happily talk about films for far too long; I also tend to keep learning or quietly improving some project because apparently my brain considers that relaxing.',
    sources: ['Personal biography / Miguel-approved notes', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What are your passions?', 'Where did you grow up?']
  },
  {
    id: 'interview-learning',
    title: 'Learning and staying current',
    tags: ['senior engineer', 'learning', 'new technology', 'ai', 'curiosity'],
    patterns: [
      /\bhow do you (?:keep|stay) (?:up to date|current)\b/,
      /^how do you learn$/,
      /\bhow do you learn (?:new )?(?:skills|things|technologies|topics)\b/,
      /\bwhat are you learning\b/,
      /\bnew technolog(?:y|ies)\b/,
      /\bhow do you grow\b/
    ],
    shortAnswer:
      'I learn by building, breaking things, reading until the pieces connect, and then trying the idea in a real interface. Right now a lot of that curiosity is going into AI, machine learning, image-to-text, text-to-speech, agents, and the product experiences around them.',
    sources: ['Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['Why does AI interest you?', 'How do you evaluate a new library?']
  },
  {
    id: 'interview-new-codebase',
    title: 'Learning an unfamiliar codebase',
    tags: ['senior engineer', 'codebase', 'onboarding', 'learning', 'architecture'],
    patterns: [
      /\blearn (?:a |an )?(?:new|unfamiliar|existing) codebase\b/,
      /\bunderstand (?:a |an )?(?:new|unfamiliar|existing) codebase\b/,
      /\bjoin (?:a |an )?existing project\b/,
      /\bramp up (?:on|in)\b/
    ],
    shortAnswer:
      'I learn a codebase by tracing one real user flow from the interface through state, data, and tests. That gives me a concrete map much faster than reading every folder in order; from there I ask why the unusual decisions exist before deciding they need to be “cleaned up.”',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['What would you do in your first 90 days?', 'How do you approach architecture?']
  },
  {
    id: 'interview-ai-interest',
    title: 'Interest in AI',
    tags: ['recruiter', 'senior engineer', 'ai', 'machine learning', 'product'],
    patterns: [
      /\bwhy (?:are you interested in|do you like|does) ai\b/,
      /\bwhat interests you about ai\b/,
      /\bai (?:interest|motivation|passion)\b/,
      /\bmachine learning\b/,
      /\bimage.to.text\b/,
      /\btext.to.speech\b/
    ],
    shortAnswer:
      'AI fascinates me because there is still so much to learn, but the part I care about most is making it useful to real people. I like thinking about how someone asks, edits, compares, trusts, and recovers when a model is wrong - that is where frontend and product judgment really matter.',
    sources: ['Personal biography / Miguel-approved notes', 'Ghostwriter project notes / MiguelLLM direction'],
    suggestedNextQuestions: ['Which AI project should I inspect?', 'How do you design for AI failure?']
  },
  {
    id: 'interview-career-goals',
    title: 'Career goals',
    tags: ['recruiter', 'goals', 'future', 'career', 'ai'],
    patterns: [
      /\bwhere do you see yourself\b/,
      /\b(?:career|professional) goals\b/,
      /\bwhat do you want to achieve\b/,
      /\bnext (?:three|3|five|5) years\b/,
      /\blong.term goal\b/
    ],
    shortAnswer:
      'I want to keep growing into an engineer who can own larger frontend systems without losing the design sensitivity that makes the product good. I would especially love to do that inside a company building AI solutions, where I can keep learning and help turn complex technology into clear experiences.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio positioning / CV CTA'],
    suggestedNextQuestions: ['What are you looking for next?', 'What is a growth area for you?']
  },
  {
    id: 'interview-why-change',
    title: 'Reason for exploring opportunities',
    tags: ['recruiter', 'leaving', 'change', 'next role', 'motivation'],
    patterns: [
      /\bwhy are you (?:leaving|looking to leave|changing)\b/,
      /\bwhy do you want (?:a new job|to move)\b/,
      /\breason for (?:leaving|changing jobs)\b/
    ],
    shortAnswer:
      'I am not trying to run away from something; I am looking toward the next challenge. I want to keep growing in a role where frontend engineering, design judgment, and AI-related product work can overlap more directly.',
    sources: ['Personal biography / Miguel-approved notes', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What are you looking for?', 'What kind of team suits you?']
  },
  {
    id: 'interview-why-company',
    title: 'Why this company',
    tags: ['recruiter', 'company', 'motivation', 'fit', 'product'],
    patterns: [
      /\bwhy (?:this|our) company\b/,
      /\bwhy (?:do you want to|would you) work (?:here|with us|for us)\b/,
      /\bwhat interests you about (?:us|this company)\b/
    ],
    shortAnswer:
      'The honest answer depends on the company, and I would always do that homework properly before an interview. In general, I get excited by a meaningful product, difficult frontend problems, people who care about the craft, and especially a team building AI solutions or beginning to use AI thoughtfully.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio positioning / CV CTA'],
    suggestedNextQuestions: ['What are you looking for next?', 'What kind of team suits you?']
  },
  {
    id: 'interview-motivation',
    title: 'Professional motivation',
    tags: ['recruiter', 'motivation', 'energy', 'learning', 'problem solving'],
    patterns: [
      /\bwhat motivates you\b/,
      /\bwhat keeps you motivated\b/,
      /\bwhat gives you energy\b/,
      /\bwhat drives you\b/
    ],
    shortAnswer:
      'Learning and visible progress motivate me. I love taking something confusing or technically awkward, understanding it properly, and reaching the point where the code is cleaner and the experience feels obvious to the person using it.',
    sources: ['Personal biography / Miguel-approved notes', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What are your passions?', 'What work makes you lose track of time?']
  },
  {
    id: 'interview-manager',
    title: 'Preferred management style',
    tags: ['recruiter', 'manager', 'management style', 'feedback', 'trust'],
    patterns: [
      /\b(?:ideal|good|best) manager\b/,
      /\bmanager (?:helps|would help|do you prefer|style)\b/,
      /\bmanagement style\b/,
      /\bwhat do you need from (?:a |your )?manager\b/,
      /\bwhat sort of manager\b/
    ],
    shortAnswer:
      'I work best with a manager who gives clear context, honest feedback, and enough trust for me to own the path to the result. I do not need someone to disappear or micromanage every pixel; a good rhythm of alignment, direct communication, and room to think brings out my best work.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio CV / approach section'],
    suggestedNextQuestions: ['How do you receive feedback?', 'How do you communicate progress?']
  },
  {
    id: 'interview-proud-project',
    title: 'Proudest or favorite project',
    tags: ['recruiter', 'project', 'favorite', 'proud', 'ghostwriter'],
    patterns: [
      /\b(?:project|work) are you most proud of\b/,
      /\bproudest (?:project|achievement)\b/,
      /\bfavou?rite project\b/,
      /\bproject feels most like you\b/
    ],
    shortAnswer:
      'Ghostwriter feels the most like me right now because it combined AI experimentation with constant UI iteration. I enjoyed improving the model workflow and then shaping the interface until the output stopped feeling like a demo and started feeling like a product.',
    sources: ['Miguel personality ingestion / Miguel-approved notes', 'Ghostwriter project notes / Miguel-provided project description'],
    suggestedNextQuestions: ['What was difficult about Ghostwriter?', 'What other project should I inspect?']
  },
  {
    id: 'interview-biggest-achievement',
    title: 'Biggest professional achievement',
    tags: ['recruiter', 'achievement', 'f24', 'frontend', 'global teams'],
    patterns: [
      /\bbiggest (?:professional )?achievement\b/,
      /\bmost significant achievement\b/,
      /\bwhat have you accomplished\b/,
      /\bcareer highlight\b/
    ],
    shortAnswer:
      'A meaningful career highlight was helping take frontend work at F24 from empty files into active use across global teams. I am proud of the product delivery, but also of the reusable patterns and stronger frontend judgment that grew around it.',
    sources: ['CV / Experience timeline'],
    suggestedNextQuestions: ['What did you learn at F24?', 'How do you approach ownership?']
  },
  {
    id: 'interview-complex-problem',
    title: 'Complex problem solving',
    tags: ['recruiter', 'senior engineer', 'problem solving', 'debugging', 'persistence'],
    patterns: [
      /\b(?:difficult|complex|hard|challenging) (?:problem|bug|issue)\b/,
      /\btell me about a challenge\b/,
      /\bhow do you solve problems\b/,
      /\bdebug(?:ging)? approach\b/,
      /\bstuck on a problem\b/
    ],
    shortAnswer:
      'I start by making the problem smaller: reproduce it, separate state from presentation, inspect assumptions, and remove variables until the failure becomes understandable. I am very persistent with complex issues - I genuinely have trouble sleeping when I know the answer is still hiding somewhere.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you handle ambiguity?', 'How do you verify a fix?']
  },
  {
    id: 'interview-failure',
    title: 'Failure and mistakes',
    tags: ['recruiter', 'behavioral', 'failure', 'mistake', 'learning'],
    patterns: [
      /\btell me about a (?:failure|mistake)\b/,
      /\bwhen (?:did )?you (?:fail|failed)\b/,
      /\bwhat went wrong\b/,
      /\blesson from a mistake\b/
    ],
    shortAnswer:
      'One pattern I have had to improve is polishing for too long because I can still see ways to make the work better. The lesson is that quality also includes timing: define what good means early, share sooner, and recognize when another pass adds less value than shipping.',
    sources: ['Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What is a growth area for you?', 'How do you decide something is done?']
  },
  {
    id: 'interview-conflict',
    title: 'Conflict and disagreement',
    tags: ['recruiter', 'behavioral', 'conflict', 'disagreement', 'collaboration'],
    patterns: [
      /\b(?:conflicts?|disagreements?)\b/,
      /\bwhen you disagreed\b/,
      /\bpush back\b/,
      /\bdifficult colleague\b/,
      /\bhandle different opinions\b/
    ],
    shortAnswer:
      'I try to pull the disagreement back to the product problem instead of making it personal. I explain the tradeoff, listen for context I may be missing, and if a small prototype or concrete example can settle the discussion faster, I would much rather build that than win an abstract argument.',
    sources: ['Portfolio CV / approach section', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you receive feedback?', 'How do you work with designers?']
  },
  {
    id: 'interview-feedback',
    title: 'Giving and receiving feedback',
    tags: ['recruiter', 'behavioral', 'feedback', 'collaboration', 'growth'],
    patterns: [
      /\bhow do you (?:give|receive|handle) feedback\b/,
      /\btell me about feedback\b/,
      /\bcritical feedback\b/,
      /\bcode review feedback\b/
    ],
    shortAnswer:
      'I like feedback when it is specific and connected to the work. I try not to defend the first version just because I made it; I want to understand what the other person sees, improve the result, and give feedback back with the same clarity and respect.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio CV / approach section'],
    suggestedNextQuestions: ['How do you handle disagreements?', 'How do you collaborate across disciplines?']
  },
  {
    id: 'interview-code-review',
    title: 'Code review',
    tags: ['senior engineer', 'code review', 'feedback', 'quality', 'collaboration'],
    patterns: [
      /\bcode reviews?\b/,
      /\breview (?:a |someone(?:'s)? )?(?:pull request|pr|code)\b/,
      /\bpull request reviews?\b/
    ],
    shortAnswer:
      'I treat code review as shared quality control, not a performance. I look first for behavior, maintainability, accessibility, and risks; I explain why a change matters, separate blockers from preferences, and stay completely open to the possibility that the author has context I do not.',
    sources: ['Portfolio production audit / approach section', 'CV / Experience timeline'],
    suggestedNextQuestions: ['How do you receive feedback?', 'How do you ensure quality?']
  },
  {
    id: 'interview-deadlines',
    title: 'Deadlines and pressure',
    tags: ['recruiter', 'behavioral', 'deadline', 'pressure', 'delivery'],
    patterns: [
      /\b(?:tight )?deadline\b/,
      /\bwork under pressure\b/,
      /\bhandle pressure\b/,
      /\bwhen time is short\b/,
      /\burgent (?:task|work)\b/
    ],
    shortAnswer:
      'When time is tight, I make the critical path explicit, protect the states the user really needs, and communicate tradeoffs early. I still care about polish, but I would rather ship a clear, dependable core than hide a broken flow under a beautiful surface.',
    sources: ['Portfolio production audit / approach section', 'CV / Experience timeline'],
    suggestedNextQuestions: ['How do you prioritize?', 'How do you decide something is done?']
  },
  {
    id: 'interview-prioritization',
    title: 'Prioritization',
    tags: ['recruiter', 'behavioral', 'prioritization', 'time management', 'delivery'],
    patterns: [
      /\bhow do you prioritize\b/,
      /\bmultiple (?:tasks|priorities|projects)\b/,
      /\btime management\b/,
      /\bcompeting priorities\b/,
      /\bdecide what to do first\b/
    ],
    shortAnswer:
      'I prioritize by impact, dependency, and risk. I first unblock the work that other people or flows depend on, then protect the important user path, and keep the team aware when something has to move; otherwise “priority” becomes five things wearing the same hat.',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you handle deadlines?', 'How do you work through ambiguity?']
  },
  {
    id: 'interview-ambiguity',
    title: 'Working through ambiguity',
    tags: ['recruiter', 'senior engineer', 'ambiguity', 'requirements', 'product'],
    patterns: [
      /\bambigu(?:ity|ous)\b/,
      /\bunclear requirements\b/,
      /\brequirements (?:are|were) unclear\b/,
      /\bnot enough information\b/,
      /\bhow do you start a vague\b/
    ],
    shortAnswer:
      'I turn ambiguity into something visible: write down the assumptions, identify the user decision we are trying to support, and make the smallest concrete flow we can react to. A rough working version usually creates a much better conversation than everyone imagining a different solution.',
    sources: ['Portfolio CV / approach section', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you start a new feature?', 'How do you collaborate with product?']
  },
  {
    id: 'interview-collaboration',
    title: 'Collaboration with design and product',
    tags: ['recruiter', 'design', 'product', 'collaboration', 'handoff'],
    patterns: [
      /\bwork with (?:design|designers|product|product managers)\b/,
      /\bcollaborate with (?:design|designers|product)\b/,
      /\bdesign handoff\b/,
      /\bcross.functional\b/,
      /\bdesigner and engineer\b/
    ],
    shortAnswer:
      'I like working close to design and product, especially early enough that implementation reality can improve the idea instead of only trimming it later. I share progress, keep edge cases visible, and try to preserve the design intent without pretending product constraints do not exist.',
    sources: ['Portfolio CV / approach section', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you handle disagreements?', 'How do you balance design and engineering?']
  },
  {
    id: 'interview-ownership',
    title: 'Ownership and leadership',
    tags: ['recruiter', 'senior engineer', 'ownership', 'leadership', 'frontend'],
    patterns: [
      /\b(?:take|show) ownership\b/,
      /\bleadership (?:style|experience)\b/,
      /\bhave you led\b/,
      /\blead a project\b/
    ],
    shortAnswer:
      'For me, ownership means carrying the problem beyond the first implementation: clarifying the flow, keeping people informed, checking the awkward states, and leaving the code easier to continue. I have helped lead frontend delivery, but I am careful not to inflate that into a seniority claim I have not earned.',
    sources: ['CV / Experience timeline', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What did you own at F24?', 'How do you keep a team aligned?']
  },
  {
    id: 'interview-mentoring',
    title: 'Mentoring and supporting teammates',
    tags: ['senior engineer', 'mentoring', 'teamwork', 'knowledge sharing', 'leadership'],
    patterns: [
      /\bmentor(?:ing|ed|ship)?\b/,
      /\bsupport (?:a |more )?junior\b/,
      /\bhelp (?:a |your )?teammate\b/,
      /\bknowledge sharing\b/
    ],
    shortAnswer:
      'I help teammates by giving context instead of only handing over the answer. I like pairing on the difficult part, explaining the tradeoff, and leaving the other person with a mental model they can reuse; I am still growing myself, so I approach mentoring as collaboration rather than pretending to know everything.',
    sources: ['CV / Experience timeline', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you approach code review?', 'What does ownership mean to you?']
  },
  {
    id: 'interview-design-engineering',
    title: 'Balancing design and engineering',
    tags: ['senior engineer', 'design', 'engineering', 'tradeoffs', 'product ui'],
    patterns: [
      /\bbalance design and engineering\b/,
      /\bdesign (?:versus|vs) engineering\b/,
      /\bwhen design and technical\b/,
      /\bpreserve design intent\b/
    ],
    shortAnswer:
      'I do not really see design and engineering as opposing teams. The job is to understand what makes the experience valuable, then choose an implementation that preserves that feeling without creating fragile code; when a tradeoff is real, I make it visible instead of quietly flattening the design.',
    sources: ['Portfolio CV / approach section', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you evaluate tradeoffs?', 'How do you build reusable UI?']
  },
  {
    id: 'interview-reusable-ui',
    title: 'Reusable UI and components',
    tags: ['senior engineer', 'reusable ui', 'components', 'design systems', 'architecture'],
    patterns: [
      /\breusable (?:ui|component|code)\b/,
      /\bcomponent (?:design|architecture|api)\b/,
      /\bhow do you build components\b/,
      /\bavoid duplication\b/,
      /\bshared (?:component|pattern)\b/
    ],
    shortAnswer:
      'I extract a shared component when the product has proved the pattern, not simply because two rectangles look similar. I want the API to express the real states clearly, keep composition flexible, and make the next screen easier without turning one component into a configurable spaceship.',
    sources: ['Portfolio approach / CV', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you approach design systems?', 'How do you avoid over-abstraction?']
  },
  {
    id: 'interview-architecture',
    title: 'Frontend architecture',
    tags: ['senior engineer', 'architecture', 'scalability', 'maintainability', 'state'],
    patterns: [
      /\bfrontend architecture\b/,
      /\barchitect(?:ure|ing) a (?:project|feature|frontend)\b/,
      /\bscale (?:a )?frontend\b/,
      /\bmaintainab(?:le|ility)\b/,
      /\bstructure a project\b/
    ],
    shortAnswer:
      'I want architecture to make change predictable. I start with clear ownership of state, readable boundaries, and components organized around product behavior; then I introduce abstraction where repetition or complexity proves it is useful, not because an architecture diagram looked impressive on Tuesday.',
    sources: ['CV / Experience timeline', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you manage state?', 'How do you choose libraries?']
  },
  {
    id: 'interview-overengineering',
    title: 'Avoiding overengineering',
    tags: ['senior engineer', 'architecture', 'simplicity', 'abstraction', 'tradeoffs'],
    patterns: [
      /\bover.?engineer(?:ing|ed)?\b/,
      /\bover.?abstract(?:ion|ing|ed)?\b/,
      /\bavoid unnecessary complexity\b/,
      /\bkeep (?:the )?(?:code|architecture) simple\b/
    ],
    shortAnswer:
      'I avoid overengineering by starting with the smallest complete version and letting real repetition earn an abstraction. I still leave sensible boundaries, but I do not make today’s feature pay rent for ten imaginary futures.',
    sources: ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio approach / CV'],
    suggestedNextQuestions: ['How do you approach architecture?', 'When do you extract a component?']
  },
  {
    id: 'interview-technical-debt',
    title: 'Technical debt',
    tags: ['senior engineer', 'technical debt', 'maintenance', 'prioritization', 'architecture'],
    patterns: [
      /\btechnical debt\b/,
      /\blegacy code\b/,
      /\brefactor(?:ing)? priorit/,
      /\bwhen (?:do|would) you refactor\b/
    ],
    shortAnswer:
      'I make technical debt visible and connect it to an actual cost: slower delivery, defects, confusing ownership, or user risk. Then I pay it down around active work where possible and argue for dedicated time when the debt is genuinely blocking the team, rather than treating every old line as an emergency.',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you prioritize?', 'How do you make technical tradeoffs?']
  },
  {
    id: 'interview-state-management',
    title: 'State management',
    tags: ['senior engineer', 'state management', 'frontend', 'architecture', 'ui'],
    patterns: [
      /\bstate management\b/,
      /\bmanage (?:application |ui )?state\b/,
      /\blocal (?:versus|vs) global state\b/,
      /\bserver state\b/
    ],
    shortAnswer:
      'I keep state as close as possible to the behavior that owns it and only move it outward when multiple parts genuinely need the same source of truth. I separate server data, durable product state, and temporary interaction state because mixing them is how simple screens become haunted houses.',
    sources: ['In the Loop project notes / Miguel-provided project description', 'Portfolio approach / CV'],
    suggestedNextQuestions: ['How do you structure a frontend?', 'How do you test stateful UI?']
  },
  {
    id: 'interview-api-collaboration',
    title: 'Working with APIs and backend engineers',
    tags: ['senior engineer', 'api', 'backend', 'data', 'collaboration'],
    patterns: [
      /\bwork with (?:apis?|backend|backend engineers?)\b/,
      /\bapi integration\b/,
      /\bdata fetching\b/,
      /\bfrontend and backend\b/
    ],
    shortAnswer:
      'I am comfortable integrating APIs and working with backend engineers around contracts, loading, errors, retries, and the data shape the interface actually needs. My strongest depth is still the product-facing frontend, so I am honest about that boundary while making sure the connection between both sides is reliable.',
    sources: ['CV / Experience timeline', 'MiguelLLM implementation / provider strategy'],
    suggestedNextQuestions: ['How do you manage state?', 'How do you handle API failure?']
  },
  {
    id: 'interview-testing',
    title: 'Testing and quality',
    tags: ['senior engineer', 'testing', 'qa', 'quality', 'production'],
    patterns: [
      /\bhow do you test\b/,
      /\btesting (?:strategy|approach|philosophy)\b/,
      /\bensure quality\b/,
      /\bquality assurance\b/,
      /\bverify your work\b/
    ],
    shortAnswer:
      'I test the behavior with the same suspicion a real user will eventually bring: the happy path, empty states, long content, loading, failure, keyboard flow, and different screen sizes. The exact test mix depends on risk, but “it worked once on my laptop” is not a quality strategy.',
    sources: ['Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you test responsive behavior?', 'How do you handle accessibility?']
  },
  {
    id: 'interview-accessibility',
    title: 'Accessibility',
    tags: ['senior engineer', 'accessibility', 'keyboard', 'focus', 'semantics'],
    patterns: [
      /\baccessib(?:ility|le)\b/,
      /\ba11y\b/,
      /\bkeyboard navigation\b/,
      /\bfocus management\b/,
      /\bsemantic html\b/
    ],
    shortAnswer:
      'I treat accessibility as part of whether the interface works, not a decorative audit at the end. That means semantic structure, keyboard access, visible focus, useful labels, understandable states, and checking that responsive changes do not quietly break the experience.',
    sources: ['Portfolio production audit / approach section', 'Portfolio hero / CV stack'],
    suggestedNextQuestions: ['How do you verify accessibility?', 'How do you approach responsive UI?']
  },
  {
    id: 'interview-performance',
    title: 'Frontend performance',
    tags: ['senior engineer', 'performance', 'frontend', 'loading', 'dependencies'],
    patterns: [
      /\bfrontend performance\b/,
      /\bperformance optimiz/,
      /\bmake (?:a|the) (?:site|app|page) faster\b/,
      /\bslow (?:page|interface|application)\b/,
      /\bweb vitals\b/
    ],
    shortAnswer:
      'I start with evidence: what is slow, for whom, and whether the cost is network, rendering, JavaScript, images, or repeated work. Then I fix the largest real bottleneck first and keep an eye on bundle weight and dependencies, because performance problems love arriving disguised as convenience.',
    sources: ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you choose dependencies?', 'How do you test production UI?']
  },
  {
    id: 'interview-responsive',
    title: 'Responsive design',
    tags: ['senior engineer', 'responsive', 'mobile', 'layout', 'css'],
    patterns: [
      /\bresponsive (?:design|ui|layout|interface)\b/,
      /\bmobile.first\b/,
      /\bdifferent screen sizes\b/,
      /\bcross.device\b/,
      /\bbreakpoints\b/
    ],
    shortAnswer:
      'Responsive work is one of my strongest areas. I start from the content and interaction priorities, use flexible layout rules instead of desktop coordinates, and test the awkward in-between widths where interfaces usually confess what they are really made of.',
    sources: ['Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['What are your frontend strengths?', 'How do you test responsive behavior?']
  },
  {
    id: 'interview-browser-support',
    title: 'Browser compatibility',
    tags: ['senior engineer', 'browser compatibility', 'responsive', 'testing', 'css'],
    patterns: [
      /\bcross.browser\b/,
      /\bbrowser compatib/,
      /\bdifferent browsers\b/,
      /\bsafari (?:bug|issues?|support)\b/
    ],
    shortAnswer:
      'I prefer progressive, standards-based CSS and browser APIs, then test the browsers that matter to the product instead of assuming support from memory. When one browser behaves differently, I isolate the real incompatibility and choose the smallest robust fallback rather than stacking mysterious offsets until it looks fine on my machine.',
    sources: ['Portfolio production audit / approach section', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you test responsive behavior?', 'How do you ensure quality?']
  },
  {
    id: 'interview-design-systems',
    title: 'Design systems',
    tags: ['senior engineer', 'design systems', 'tokens', 'patterns', 'consistency'],
    patterns: [
      /\bdesign system\b/,
      /\bcomponent library\b/,
      /\bdesign tokens\b/,
      /\bui consistency\b/,
      /\bshared frontend patterns\b/
    ],
    shortAnswer:
      'I see a design system as shared product language, not a gallery of isolated buttons. The useful work is in the states, naming, responsive behavior, accessibility, and documentation that help design and engineering make consistent decisions without making every screen feel identical.',
    sources: ['CV / Approach', 'Portfolio approach / CV'],
    suggestedNextQuestions: ['How do you build reusable components?', 'How do you collaborate with design?']
  },
  {
    id: 'interview-libraries',
    title: 'Libraries and dependencies',
    tags: ['senior engineer', 'libraries', 'dependencies', 'maintenance', 'tradeoffs'],
    patterns: [
      /\bchoose (?:a )?librar/,
      /\bthird.party (?:library|libraries|dependency|dependencies)\b/,
      /\bdependency (?:decision|choice|management)\b/,
      /\bbuild (?:versus|vs) buy\b/,
      /\btoo many libraries\b/
    ],
    shortAnswer:
      'I like good libraries a lot, but I want them to earn their place. I look at the problem they remove, bundle and maintenance cost, accessibility, API stability, community health, and how painful the exit would be; convenience today should not become archaeology next year.',
    sources: ['Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you evaluate tradeoffs?', 'How do you approach architecture?']
  },
  {
    id: 'interview-tools',
    title: 'Preferred tools',
    tags: ['recruiter', 'senior engineer', 'tools', 'react', 'typescript', 'svelte', 'design'],
    patterns: [
      /\bfavou?rite tools\b/,
      /\bpreferred (?:tools|stack|framework)\b/,
      /\bwhat (?:tools|technologies|stack) do you use\b/,
      /\breact (?:or|vs) svelte\b/,
      /\btech stack\b/
    ],
    shortAnswer:
      'My favorite tools are React, JavaScript, TypeScript, Svelte, and a looooot of designing. I choose between them based on the product and team, but TypeScript plus a component model I can reason about is usually a very comfortable place for me.',
    sources: ['Personal biography / Miguel-approved notes', 'Portfolio hero / CV stack'],
    suggestedNextQuestions: ['How do you choose a framework?', 'How do you structure a project?']
  },
  {
    id: 'interview-ai-failure',
    title: 'Designing reliable AI experiences',
    tags: ['senior engineer', 'ai', 'failure', 'fallback', 'trust', 'guardrails'],
    patterns: [
      /\bai (?:failure|errors?|reliability|safety|guardrails)\b/,
      /\bwhen (?:the )?(?:ai|model) is wrong\b/,
      /\bdesign for (?:ai|model) failure\b/,
      /\btrust (?:an )?ai\b/,
      /\bllm (?:errors?|hallucination)\b/
    ],
    shortAnswer:
      'I design AI as an uncertain collaborator, not an oracle. The interface should make outputs reviewable, let people edit or retry, explain what happened when something fails, protect secrets on the server, and keep a useful fallback path instead of collapsing into a spinner and an apology.',
    sources: ['Ghostwriter project notes / MiguelLLM direction'],
    suggestedNextQuestions: ['Why does AI interest you?', 'What did you build in Ghostwriter?']
  },
  {
    id: 'interview-security',
    title: 'Frontend and AI security',
    tags: ['senior engineer', 'security', 'api', 'secrets', 'validation', 'ai'],
    patterns: [
      /\bfrontend security\b/,
      /\bsecure (?:an |the )?(?:frontend|application|app|api|ai feature)\b/,
      /\bprotect (?:api )?keys?\b/,
      /\bsecurity approach\b/
    ],
    shortAnswer:
      'My baseline is to keep secrets and provider calls on the server, validate and limit what the client can send, expose only the data the UI needs, and make failure safe. I am not going to pretend to be a security specialist, but I build the obvious protections into the architecture instead of hoping a hidden button counts as access control.',
    sources: ['MiguelLLM implementation / provider strategy', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How did you build MiguelLLM?', 'How do you design for AI failure?']
  },
  {
    id: 'interview-production-incident',
    title: 'Production bugs and incidents',
    tags: ['senior engineer', 'production', 'incident', 'debugging', 'communication'],
    patterns: [
      /\bproduction (?:bug|issue|incident|failure)\b/,
      /\bincident response\b/,
      /\bsomething breaks in production\b/,
      /\bhotfix\b/
    ],
    shortAnswer:
      'With a production issue, I first protect the user and establish what is actually broken. Then I reproduce it, narrow the cause, communicate the impact and next step clearly, ship the smallest safe fix, and follow up on why our checks did not catch it so the same class of problem becomes less likely.',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you debug complex issues?', 'How do you verify a fix?']
  },
  {
    id: 'interview-estimation',
    title: 'Estimation and planning',
    tags: ['senior engineer', 'estimation', 'planning', 'risk', 'delivery'],
    patterns: [
      /\bestimat(?:e|ing|ion)\b/,
      /\bhow long (?:a |the )?(?:feature|task|project) (?:takes|will take)\b/,
      /\bplan (?:a |the )?(?:feature|work|delivery)\b/
    ],
    shortAnswer:
      'I estimate by breaking the work into observable pieces and calling out uncertainty separately from implementation effort. I include the less glamorous states - loading, errors, responsive behavior, review, and QA - then update the estimate when new information appears instead of defending an old guess for emotional reasons.',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you prioritize?', 'How do you handle deadlines?']
  },
  {
    id: 'interview-release-quality',
    title: 'Release and delivery confidence',
    tags: ['senior engineer', 'release', 'ci', 'delivery', 'quality'],
    patterns: [
      /\bci.?cd\b/,
      /\brelease process\b/,
      /\bdeploy(?:ment|ing)?\b/,
      /\bship (?:a |the )?(?:feature|change) safely\b/
    ],
    shortAnswer:
      'I want releases to be boring in the best possible way: small understandable changes, automated checks where they buy confidence, a deliberate UI pass, and a clear rollback or recovery path when the risk deserves one. Shipping is part of engineering, not the moment engineering stops.',
    sources: ['CV / Experience timeline', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you ensure quality?', 'How do you handle production incidents?']
  },
  {
    id: 'interview-observability',
    title: 'Frontend observability',
    tags: ['senior engineer', 'observability', 'monitoring', 'errors', 'production'],
    patterns: [
      /\bobservability\b/,
      /\bmonitor(?:ing)? (?:a |the )?frontend\b/,
      /\berror tracking\b/,
      /\bknow (?:a |the )?release (?:worked|is working)\b/
    ],
    shortAnswer:
      'For important flows, I want enough visibility to know whether users can complete them, where errors happen, and whether a release changed that behavior. I combine error reporting and product signals with direct reproduction, while being careful not to collect data simply because a dashboard has an empty slot.',
    sources: ['Portfolio production audit / approach section', 'CV / Experience timeline'],
    suggestedNextQuestions: ['How do you handle production incidents?', 'How do you define success?']
  },
  {
    id: 'interview-documentation',
    title: 'Documentation',
    tags: ['senior engineer', 'documentation', 'communication', 'architecture', 'team'],
    patterns: [
      /\bdocumentation\b/,
      /\bdocument (?:your |the )?(?:code|work|decision|architecture)\b/,
      /\bknowledge shar(?:e|ing)\b/
    ],
    shortAnswer:
      'I document the decisions and contracts that are not obvious from the code: why a boundary exists, how a shared component should be used, and what tradeoff the team accepted. The goal is useful context for the next person, not a second codebase written in paragraphs.',
    sources: ['Portfolio approach / CV', 'CV / Experience timeline'],
    suggestedNextQuestions: ['How do you communicate technical decisions?', 'How do you approach code review?']
  },
  {
    id: 'interview-feature-process',
    title: 'Starting a new feature',
    tags: ['senior engineer', 'process', 'feature', 'requirements', 'delivery'],
    patterns: [
      /\bstart (?:a )?(?:new )?feature\b/,
      /\bapproach (?:a )?(?:new )?(?:feature|project)\b/,
      /\bfrom requirements to\b/,
      /\bdevelopment process\b/,
      /\bhow do you build a feature\b/
    ],
    shortAnswer:
      'I start by understanding the user decision and the states around it, not by naming components. Then I map the smallest complete flow, align with design and product, build the core path, and pressure-test loading, empty, error, responsive, and accessibility behavior before polishing the details.',
    sources: ['Portfolio production audit / approach section', 'Portfolio CV / approach section'],
    suggestedNextQuestions: ['How do you handle ambiguity?', 'How do you test a feature?']
  },
  {
    id: 'interview-tradeoffs',
    title: 'Technical tradeoffs',
    tags: ['senior engineer', 'tradeoffs', 'decision making', 'architecture', 'product'],
    patterns: [
      /\btechnical trade.?off\b/,
      /\bmake (?:a )?technical decision\b/,
      /\bhow do you decide between\b/,
      /\bspeed (?:versus|vs) quality\b/,
      /\bengineering judgment\b/
    ],
    shortAnswer:
      'I make tradeoffs by asking what risk we are buying: user confusion, delivery time, maintenance, performance, or future flexibility. I prefer the simplest choice that keeps the important path reliable, and I document the compromise when the team may need to revisit it later.',
    sources: ['Portfolio production audit / approach section', 'Miguel personality ingestion / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you prioritize?', 'How do you choose dependencies?']
  },
  {
    id: 'interview-communication',
    title: 'Communication style',
    tags: ['recruiter', 'communication', 'teamwork', 'collaboration', 'remote'],
    patterns: [
      /\bcommunication style\b/,
      /\bhow do you communicate\b/,
      /\bkeep (?:a )?team (?:updated|aligned)\b/,
      /\bcommunicate technical\b/,
      /\bremote communication\b/
    ],
    shortAnswer:
      'I try to communicate early, clearly, and with enough context for the other person to act. I share work before it feels precious, call out risks instead of hiding them, and use concrete examples when technical language would only make a simple point sound expensive.',
    sources: ['Portfolio CV / approach section', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['How do you handle feedback?', 'How do you work across teams?']
  },
  {
    id: 'interview-remote-work',
    title: 'Remote and distributed work',
    tags: ['recruiter', 'remote', 'distributed team', 'communication', 'adaptability'],
    patterns: [
      /\bremote work\b/,
      /\bwork remotely\b/,
      /\bdistributed team\b/,
      /\bdifferent time zones\b/,
      /\bhybrid work\b/
    ],
    shortAnswer:
      'I am comfortable working remotely and with people who have different roles, backgrounds, and working styles. I adapt quickly, communicate progress and blockers clearly, and try to leave enough written context that collaboration does not depend on everyone being online in the same minute.',
    sources: ['Portfolio positioning / CV CTA', 'Personal biography / Miguel-approved notes'],
    suggestedNextQuestions: ['What kind of team suits you?', 'How do you communicate?']
  },
  {
    id: 'interview-availability',
    title: 'Availability',
    tags: ['recruiter', 'availability', 'start date', 'berlin', 'remote'],
    patterns: [
      /\bwhen can you start\b/,
      /\bwhat is your availability\b/,
      /\bare you available\b/,
      /\bstart date\b/
    ],
    shortAnswer:
      'I am based in Berlin and open to discussing the right opportunity. My exact start date depends on the role and timing, so I would rather confirm that directly than let a portfolio chatbot invent a calendar for me.',
    sources: ['Portfolio positioning / CV CTA', 'MiguelLLM guardrail'],
    suggestedNextQuestions: ['What are you looking for next?', 'How can I contact you?']
  },
  {
    id: 'interview-success',
    title: 'Definition of success',
    tags: ['recruiter', 'success', 'quality', 'product', 'team'],
    patterns: [
      /\bwhat does success (?:mean|look like)\b/,
      /\bhow do you define success\b/,
      /\bsuccessful project\b/,
      /\bhow do you measure success\b/
    ],
    shortAnswer:
      'Success is when the user can move through the important flow without fighting it, the team can safely continue the code, and the interface still feels considered after the launch excitement disappears. Beautiful screenshots are nice; dependable product behavior is the part that has to survive.',
    sources: ['Portfolio approach / manifesto', 'Portfolio production audit / approach section'],
    suggestedNextQuestions: ['How do you ensure quality?', 'How do you decide something is done?']
  },
  {
    id: 'interview-first-90-days',
    title: 'First 90 days',
    tags: ['recruiter', 'onboarding', 'first 90 days', 'new role', 'team'],
    patterns: [
      /\bfirst (?:30|60|90) days\b/,
      /\bfirst three months\b/,
      /\bstart(?:ing)? a new role\b/,
      /\bonboard(?:ing)?\b/
    ],
    shortAnswer:
      'First I would learn the product, people, release rhythm, and the parts of the frontend that cause the most friction. Then I would aim to ship something useful, earn context through real work, and gradually improve a shared pattern or flow once I understand why it looks the way it does.',
    sources: ['Personal biography / Miguel-approved notes', 'CV / Experience timeline'],
    suggestedNextQuestions: ['How do you learn a codebase?', 'What kind of team suits you?']
  }
];

export const interviewAnswerKnowledge = miguelInterviewAnswers.map((answer) => ({
  id: answer.id,
  title: answer.title,
  source: 'Miguel interview answer bank / Miguel-approved profile',
  tags: answer.tags,
  content: `Approved first-person interview answer: ${answer.shortAnswer}`
}));

export function findMiguelInterviewAnswer(normalizedQuestion: string) {
  return miguelInterviewAnswers.find((answer) =>
    answer.patterns.some((pattern) => pattern.test(normalizedQuestion))
  );
}
