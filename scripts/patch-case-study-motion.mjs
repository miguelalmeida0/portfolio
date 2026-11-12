export function patchCaseStudyMotion(html) {
  if (html.includes('data-case-motion')) return html;
  if (!html.includes('</head>') || !html.includes('id="cs"')) {
    throw new Error('Expected the Compact index case-study document');
  }
  return html.replace('</head>', '<link rel="stylesheet" href="/case-motion/case-motion.css" data-case-motion><script type="module" src="/case-motion/index.js" data-case-motion></script></head>');
}
