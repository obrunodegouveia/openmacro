/**
 * Lets the translation tooling import the TypeScript sources directly.
 *
 * Shared by `i18n.mjs` and anything else that needs the catalogues at build
 * time. Same resolution rules as `audit-content.mjs`, in one place rather
 * than copied into each script.
 */

import { registerHooks } from 'node:module';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);

function isFile(url) {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
}

function firstExisting(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
  return candidates.find(isFile) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const resolved = firstExisting(new URL(`src/${specifier.slice(2)}`, ROOT).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const target = new URL(specifier, context.parentURL).href;
      if (target.endsWith('.json') && isFile(target)) {
        return { url: target, shortCircuit: true, importAttributes: { type: 'json' } };
      }
      const resolved = firstExisting(target);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
