/**
 * Transform documented portfolio prose into a prepared first-person voice.
 *
 * Never substitute a subject in isolation: that previously produced grammar
 * such as "I does not want" and "I loses track". A clause is rewritten only
 * when its verb can be converted with a known grammatical rule. Unrecognized
 * clauses stay intact rather than becoming malformed assertions.
 *
 * Verbatim recommendation quotes remain untouched.
 */
const irregular = new Map<string, string>([
  ['is', 'am'], ['isn\'t', 'am not'], ['has', 'have'],
  ['hasn\'t', 'haven\'t'], ['does', 'do'], ['doesn\'t', 'don\'t'],
  ['goes', 'go'], ['loses', 'lose'], ['uses', 'use'], ['focuses', 'focus'],
  ['chooses', 'choose'], ['watches', 'watch'], ['catches', 'catch'],
  ['teaches', 'teach'], ['fixes', 'fix'], ['passes', 'pass'],
  ['studies', 'study'], ['tries', 'try'], ['carries', 'carry']
]);

const unchanged = new Set([
  'am', 'are', 'was', 'were', 'wasn\'t', 'weren\'t', 'had', 'hadn\'t',
  'have', 'haven\'t', 'do', 'don\'t', 'did', 'didn\'t',
  'can', 'cannot', 'can\'t', 'could', 'couldn\'t', 'will', 'won\'t',
  'would', 'wouldn\'t', 'should', 'shouldn\'t', 'must', 'may',
  'might', 'need', 'built', 'said', 'made', 'wrote', 'went', 'found',
  'learned', 'learnt', 'taught', 'led', 'saw', 'felt', 'became', 'grew'
]);

/** Returns null for any verb whose first-person form cannot be established. */
function firstPersonVerb(raw: string): string | null {
  const word = raw.replace(/’/g, "'").toLowerCase();
  const converted = irregular.get(word);
  if (converted) return converted;
  if (unchanged.has(word) || /^[a-z]+ed$/.test(word)) return raw;
  if (/^[a-z]+ies$/.test(word)) return raw.slice(0, -3) + 'y';
  if (/^[a-z]+(?:sses|ches|shes|xes|zzes)$/.test(word)) return raw.slice(0, -2);
  if (/^[a-z]+s$/.test(word) && !/(?:ss|us|is)$/.test(word)) return raw.slice(0, -1);
  // Ordinary base verbs are safe only when they appear in an explicit list.
  return null;
}

function convertUnquoted(input: string): string {
  let text = input
    .replace(/\b(?:ask|contact|email|reach) Miguel(?: Almeida)?\b/gi, match => match.replace(/Miguel(?: Almeida)?/i, 'me'))
    .replace(/\b(?:Miguel(?: Almeida)?|He|he)[’']s\s+(?=a\b|an\b|the\b|working\b|based\b|been\b)/g, 'I am ');

  // Replace the subject and verb together; preserve capitalisation after
  // a sentence boundary without affecting a person's quoted words.
  text = text.replace(/\b(Miguel(?: Almeida)?|He|he)\s+([A-Za-z]+(?:[’'][A-Za-z]+)?)\b/g,
    (match, _name: string, rawVerb: string) => {
      const verb = firstPersonVerb(rawVerb);
      return verb === null ? match : `I ${verb}`;
    });

  text = text
    .replace(/\bMiguel(?: Almeida)?[’']s\b/g, 'my')
    .replace(/\bHis\b/g, 'My')
    .replace(/\bhis\b/g, 'my')
    .replace(/\bhimself\b/g, 'myself');

  // Repair previously authored first-person clauses as well.
  text = text.replace(/\bI\s+([A-Za-z]+(?:[’'][A-Za-z]+)?)\b/g,
    (match, rawVerb: string) => {
      const verb = firstPersonVerb(rawVerb);
      return verb === null ? match : `I ${verb}`;
    });

  // A name in a proper self-introduction is correct: "I'm Miguel".
  return text.replace(/^my\b/, 'My');
}

export function inMyVoice(input: string): string {
  // Curly/straight-double quoted recommendations are source quotations.
  const sections = input.split(/(“[^”]*”|"[^"]*")/g);
  return sections.map((section, index) => index % 2 === 1 ? section : convertUnquoted(section)).join('');
}

export function asFirstPersonAnswer(
  text: string,
  first = false,
  context: 'cv' | 'story' | 'flow' | 'leu' | 'work' = 'work'
): string {
  const spoken = inMyVoice(text);
  if (!first || /\b(I|I'm|I’m|I've|I’ve|my|mine|me)\b/i.test(spoken)) return spoken;
  const openings = {
    cv: 'From my CV:',
    story: 'From my story:',
    flow: 'In Flow, I documented:',
    leu: 'In Leu, I documented:',
    work: 'From my work:'
  };
  return `${openings[context]} ${spoken}`;
}
