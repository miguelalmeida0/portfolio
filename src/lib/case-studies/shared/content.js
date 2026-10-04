// A small structured inline-content vocabulary. Strings never enter innerHTML.
const decode = value => value.replace(/&(?:amp|lt|gt|quot|nbsp|#39);/g, x => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&nbsp;':'\u00a0','&#39;':"'"})[x]);
export function inlineContent(value) {
  const root = [], stack = [root];
  for (const part of String(value).split(/(<\/?(?:span|b|mark|br)(?:\s+class="[\w -]+")?\s*\/?>)/g).filter(Boolean)) {
    if (part.startsWith('</')) { stack.pop(); continue; }
    const tag = part.match(/^<(span|b|mark|br)(?:\s+class="([\w -]+)")?\s*\/?>$/);
    if (tag) { const node = { tag: tag[1], class: tag[2], children: [] }; stack.at(-1).push(node); if (tag[1] !== 'br') stack.push(node.children); }
    else stack.at(-1).push({ text: decode(part) });
  }
  return root;
}
