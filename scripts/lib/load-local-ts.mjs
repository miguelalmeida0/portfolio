import ts from 'typescript';
import { readFile, mkdir, mkdtemp, rm, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Compile source modules for isolated Node checks; never start a browser or HTTP server.
export async function loadLocalTs(entry, { stubs = {} } = {}) {
  const root = process.cwd();
  const cache = path.join(root, '.cache/recruiter-check');
  await mkdir(cache, { recursive: true });
  // Each load owns its files and module URLs, including when its stubs differ.
  const out = await mkdtemp(path.join(cache, 'load-'));
  const seen = new Map();
  async function resolveFile(base) {
    for (const candidate of [base, `${base}.ts`, path.join(base, 'index.ts')]) {
      try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
    }
    throw new Error(`Cannot resolve ${base}`);
  }
  async function compile(file) {
    if (seen.has(file)) return seen.get(file);
    const target = path.join(out, path.relative(root, file).replace(/\.ts$/, '.mjs'));
    seen.set(file, target);
    if (file.endsWith('.json')) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, await readFile(file, 'utf8'));
      return target;
    }
    let output = ts.transpileModule(await readFile(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    const imports = [...output.matchAll(/\bfrom\s+(['"])([^'"]+)\1/g)];
    for (const match of imports) {
      const spec = match[2];
      let replacement;
      if (Object.hasOwn(stubs, spec)) replacement = `data:text/javascript,${encodeURIComponent(stubs[spec])}`;
      else if (spec.startsWith('.') || spec.startsWith('$lib/')) {
        const base = spec.startsWith('$lib/') ? path.join(root, 'src/lib', spec.slice(5)) : path.resolve(path.dirname(file), spec);
        replacement = pathToFileURL(await compile(await resolveFile(base))).href;
      }
      if (replacement) output = output.replace(match[0], `from ${JSON.stringify(replacement)}`);
    }
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, output);
    return target;
  }
  try {
    return await import(pathToFileURL(await compile(await resolveFile(path.resolve(entry)))).href);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}
