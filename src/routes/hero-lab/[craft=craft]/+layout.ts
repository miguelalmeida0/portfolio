// Local Canon export only; normal application routing remains server rendered.
export const prerender = import.meta.env.VITE_CANON_PREVIEW === '1';
export const trailingSlash = 'never';
