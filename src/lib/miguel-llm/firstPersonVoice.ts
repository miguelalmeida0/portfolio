/**
 * Present approved portfolio evidence in Miguel's prepared first-person voice.
 * This is a deterministic point-of-view edit, not a generated claim. Keep any
 * quoted recommendation intact and preserve the factual content and source ID.
 */
const verbForms: Array<[RegExp,string]> = [
  [/\bI is\b/g, 'I am'], [/\bI has\b/g, 'I have'],
  [/\bI works\b/g, 'I work'], [/\bI likes\b/g, 'I like'],
  [/\bI enjoys\b/g, 'I enjoy'], [/\bI prefers\b/g, 'I prefer'],
  [/\bI wants\b/g, 'I want'], [/\bI gets\b/g, 'I get'],
  [/\bI thinks\b/g, 'I think'], [/\bI keeps\b/g, 'I keep'],
  [/\bI reports\b/g, 'I report'], [/\bI describes\b/g, 'I describe'],
  [/\bI builds\b/g, 'I build'], [/\bI designs\b/g, 'I design'],
  [/\bI uses\b/g, 'I use'], [/\bI tends\b/g, 'I tend'],
  [/\bI demonstrates\b/g, 'I demonstrate'], [/\bI continues\b/g,'I continue'],
  [/\bI helps\b/g,'I help'], [/\bI cares\b/g,'I care'],
  [/\bI carries\b/g,'I carry'], [/\bI takes\b/g,'I take']
];
export function inMyVoice(input: string): string {
  // A testimonial is somebody else's voice: never rewrite its quotation.
  const parts = input.split(/(“[^”]*”|\u0022[^\u0022]*\u0022)/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) return part;
    let value = part
      .replace(/\b(contact|reach|email|ask|about|with|to|from|for) Miguel(?: Almeida)?\b/gi, (_, verb: string) => `${verb} me`)
      .replace(/\bMiguel(?: Almeida)?[’']s\b/g, 'my')
      .replace(/\bMiguel(?: Almeida)?\b/g, 'I')
      .replace(/\bHis\b/g, 'My')
      .replace(/\bhis\b/g, 'my')
      .replace(/\bHe\b/g, 'I')
      .replace(/\bhe\b/g, 'I')
      .replace(/\bhimself\b/g, 'myself')
      .replace(/\bhim\b/g, 'me');
    for (const [pattern, replacement] of verbForms) value = value.replace(pattern, replacement);
    return value.replace(/^my\b/, 'My');
  }).join('');
}

export function asFirstPersonAnswer(text: string, first = false, context: 'cv' | 'story' | 'flow' | 'leu' | 'work' = 'work'): string {
  const spoken = inMyVoice(text);
  if (!first || /\b(I|I'm|I’m|I've|I’ve|my|mine|me)\b/i.test(spoken)) return spoken;
  // An evidence excerpt can be exact while its introduction remains personal.
  // No metric, quotation, or attribution is changed to manufacture an answer.
  const openings = {
    cv: 'From my CV:',
    story: 'From my story:',
    flow: 'In Flow, I found this:',
    leu: 'In Leu, I found this:',
    work: 'From my work:'
  };
  return `${openings[context]} ${spoken}`;
}
