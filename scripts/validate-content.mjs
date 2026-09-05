#!/usr/bin/env node
/**
 * ============================================================================
 * Lesson content validator — `npm run lint:content`
 * ============================================================================
 *
 * Loads the real content registry and runs `src/content/validate.ts` over it,
 * so a contributor can check their lesson without launching the app.
 *
 * Going through the registry rather than scanning files means `.ts` and `.json`
 * lessons are checked by the *same* rules: a JSON lesson reaches the app only
 * by being imported into a module, so by the time it is in `MODULES` it is
 * just a lesson like any other. That also keeps this script honest — if it
 * validates, the app can run it.
 *
 * Checks the type system cannot express:
 *   - ids unique within a lesson; lesson ids unique across the course
 *   - a multiple_choice answer points at an option that exists
 *   - an order_flow's correct order covers exactly its events
 *   - an interactive_sim references a registered formula, and its objective
 *     asks for slider values the slider can actually reach
 *   - a t_account_flow's expected shifts name real entities, are each offered
 *     as a placeable option, and leave every entity balanced
 *
 * That last rule is the important one: an unbalanced expected answer is a
 * lesson that can never be solved, and it is the mistake a well-meaning
 * contributor makes first.
 *
 * Requires Node 22.18+: `module.registerHooks` arrived in 22.15 and unflagged
 * type stripping in 22.18. Running this on an older Node fails with
 * "does not provide an export named 'registerHooks'".
 *
 * Node runs the TypeScript sources directly via built-in type stripping. The
 * resolve hook teaches Node the two conventions TypeScript allows but Node's
 * ESM resolver does not: the `@/` path alias, and extensionless / directory
 * imports. JSON imports are handled too, since lesson modules use them.
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

/** Candidate file URLs for a specifier that may be missing its extension. */
function firstExisting(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
  return candidates.find(isFile) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    // `@/foo` -> `<root>/src/foo`
    if (specifier.startsWith('@/')) {
      const resolved = firstExisting(new URL(`src/${specifier.slice(2)}`, ROOT).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    // `./foo` -> `./foo.ts` | `./foo/index.ts`, and `./foo.json` as-is.
    if (specifier.startsWith('.') && context.parentURL) {
      const target = new URL(specifier, context.parentURL).href;
      // A lesson module may import a .json lesson; Node needs the import
      // attribute for those, which TypeScript source does not carry.
      if (target.endsWith('.json') && isFile(target)) {
        return { url: target, shortCircuit: true, importAttributes: { type: 'json' } };
      }
      const resolved = firstExisting(target);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { MODULES } = await import('@openmacro/core/content/registry');
const { validateModules } = await import('@openmacro/core/content/validate');

const lessonCount = MODULES.reduce((total, module) => total + module.lessons.length, 0);
const challengeCount = MODULES.reduce(
  (total, module) =>
    total + module.lessons.reduce((sum, lesson) => sum + lesson.challenges.length, 0),
  0,
);

const byType = new Map();
for (const module of MODULES) {
  for (const lesson of module.lessons) {
    for (const challenge of lesson.challenges) {
      byType.set(challenge.type, (byType.get(challenge.type) ?? 0) + 1);
    }
  }
}

const issues = validateModules(MODULES);

console.log(
  `\nOpenMacro content: ${MODULES.length} module(s), ${lessonCount} lesson(s), ${challengeCount} challenge(s).`,
);
for (const [type, count] of [...byType].sort()) {
  console.log(`  ${String(count).padStart(3)}  ${type}`);
}

if (issues.length === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ All content valid.\n');
  process.exit(0);
}

console.error(`\x1b[31m\n✗ ${issues.length} content issue(s):\x1b[0m`);
for (const issue of issues) {
  console.error(`  • ${issue.path}\n    ${issue.message}`);
}
console.error('');
process.exit(1);
