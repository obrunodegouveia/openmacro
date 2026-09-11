#!/usr/bin/env node
/**
 * ============================================================================
 * Translation tooling — `npm run i18n:status`, `npm run i18n:extract`
 * ============================================================================
 *
 * Two jobs, both of which exist because translating 4,400 strings by hand is
 * a project rather than an afternoon, and a project needs to know where it is.
 *
 *   status              What fraction of the interface and of each module is
 *                       translated, per language. Prints the gap, because the
 *                       gap is the only number anyone acts on.
 *
 *   extract <moduleId>  Every translatable string in one module, as a JSON
 *                       object of key → English. Hand that to a translator
 *                       (or to a model, then to a human) and paste the result
 *                       into `packages/core/src/i18n/content/<locale>/`.
 *
 * `--strict` makes `status` exit non-zero on two things, and only two:
 *
 *   • a **broken** catalogue — unbalanced braces, or a message naming an
 *     argument the English source does not provide. Both render as visible
 *     nonsense and neither is a type error, so this is the only thing that
 *     catches them.
 *
 *   • a shipped language **missing an interface string**. Content may stay
 *     incomplete forever — that is the whole design — but a half-translated
 *     menu beside fully translated lessons reads as a bug.
 *
 * Untranslated content never fails the build. Deliberately: a rule that
 * punishes adding a lesson until every language has caught up is a rule that
 * stops lessons being added.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
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

const { MODULES } = await import('@openmacro/core/content/registry');
const {
  LOCALES,
  LOCALE_NAMES,
  DEFAULT_LOCALE,
  collectKeys,
  uiCoverage,
  missingUiKeys,
  validateCatalogue,
} = await import('@openmacro/core/i18n');
const { contentCoverage } = await import('@openmacro/core/i18n/content');

const [command = 'status', ...rest] = process.argv.slice(2);

// ---------------------------------------------------------------------------

function bar(ratio, width = 24) {
  const filled = Math.round(ratio * width);
  return `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
}

const pct = (ratio) => `${(ratio * 100).toFixed(ratio > 0 && ratio < 0.01 ? 2 : 0)}%`;

// ---------------------------------------------------------------------------

if (command === 'extract') {
  const [moduleId] = rest;
  if (!moduleId) {
    console.error('usage: npm run i18n:extract -- <moduleId>');
    console.error('\nModules:');
    for (const module of MODULES) console.error(`  ${module.id}`);
    process.exit(2);
  }
  const module = MODULES.find((candidate) => candidate.id === moduleId);
  if (!module) {
    console.error(`No module with id "${moduleId}".`);
    process.exit(2);
  }
  // Straight to stdout, so it can be piped to a file or a clipboard without
  // the tool having an opinion about where translations live on disk.
  process.stdout.write(`${JSON.stringify(collectKeys(module), null, 2)}\n`);
  process.exit(0);
}

if (command !== 'status') {
  console.error(`Unknown command "${command}". Try "status" or "extract <moduleId>".`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// status
// ---------------------------------------------------------------------------

const strict = rest.includes('--strict');
const verbose = rest.includes('--verbose');

const totalStrings = MODULES.reduce(
  (sum, module) => sum + Object.keys(collectKeys(module)).length,
  0,
);

console.log('');
console.log('OpenMacro — translation status');
console.log(`${MODULES.length} modules · ${totalStrings.toLocaleString('en-GB')} content strings`);

let failed = false;

for (const locale of LOCALES) {
  const isSource = locale === DEFAULT_LOCALE;
  console.log('');
  console.log(
    `── ${LOCALE_NAMES[locale]} (${locale})${isSource ? '  — source language' : ''} ${'─'.repeat(
      Math.max(0, 46 - LOCALE_NAMES[locale].length - locale.length),
    )}`,
  );

  const ui = uiCoverage(locale);
  console.log(`  interface   ${bar(ui)}  ${pct(ui).padStart(4)}`);

  const modules = contentCoverage(locale);
  const done = modules.reduce((sum, entry) => sum + entry.translated, 0);
  const all = modules.reduce((sum, entry) => sum + entry.total, 0);
  console.log(`  content     ${bar(all ? done / all : 1)}  ${pct(all ? done / all : 1).padStart(4)}   ${done.toLocaleString('en-GB')} / ${all.toLocaleString('en-GB')} strings`);

  if (!isSource) {
    const started = modules.filter((entry) => entry.ratio > 0);
    if (started.length) {
      console.log('');
      for (const entry of started) {
        console.log(
          `    ${entry.moduleId.padEnd(42)} ${bar(entry.ratio, 12)} ${pct(entry.ratio).padStart(4)}  (${entry.translated}/${entry.total})`,
        );
      }
    }
    const untouched = modules.length - started.length;
    if (untouched > 0) {
      console.log('');
      console.log(`    ${untouched} module${untouched === 1 ? '' : 's'} not started — falls back to English`);
    }

    const broken = validateCatalogue(locale);
    if (broken.length) {
      console.log('');
      console.log(`    ${broken.length} broken message${broken.length === 1 ? '' : 's'}:`);
      for (const { key, problem } of broken) console.log(`      ${key} — ${problem}`);
      failed = true;
    }

    const missing = missingUiKeys(locale);
    if (missing.length) {
      console.log('');
      console.log(`    ${missing.length} interface key${missing.length === 1 ? '' : 's'} missing:`);
      const show = verbose ? missing : missing.slice(0, 10);
      for (const key of show) console.log(`      ${key}`);
      if (show.length < missing.length) {
        console.log(`      … and ${missing.length - show.length} more (--verbose)`);
      }
      if (strict) failed = true;
    }
  }
}

console.log('');
console.log('A missing string is not a broken one — it renders in English.');
console.log('Add a module with:  npm run i18n:extract -- <moduleId>');
console.log('');

process.exit(failed ? 1 : 0);
