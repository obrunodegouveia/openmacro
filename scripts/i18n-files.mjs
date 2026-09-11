/**
 * ============================================================================
 * Shared plumbing for the translation round-trip
 * ============================================================================
 *
 * Naming, escaping and the generated-region rewrite — the three things
 * `extract` and `import` must agree on exactly, so they agree by sharing this
 * rather than by both being careful.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/**
 * Everything below this line in a catalogue file is rewritten by
 * `npm run i18n:import`; everything above it is hand-written and preserved.
 *
 * The alternative — generating the whole file — would delete the translator's
 * notes about `tu` versus `você` and the 1990 spelling reform, which are the
 * most valuable prose in the repository for whoever translates next. The
 * alternative to *that* — editing the file with an AST — is a lot of machinery
 * to avoid one comment.
 */
export const SENTINEL =
  '// ─── generated below · `npm run i18n:import` rewrites from here ───────────';

/**
 * `pt-PT` → `ptPT`, `zh-Hant` → `zhHant`. The catalogue's export name.
 *
 * Subtags keep the case the tag itself uses, rather than being title-cased.
 * BCP-47 already writes regions upper (`PT`) and scripts title (`Hant`), so
 * preserving it produces the names a person would have chosen — and, not
 * incidentally, the ones already written by hand in this repository.
 */
export function localeSymbol(locale) {
  const [base, ...rest] = locale.split('-');
  return base + rest.map((part) => part[0].toUpperCase() + part.slice(1)).join('');
}

/** `pt-PT` → `PtPT`, for suffixing a module symbol. */
export function localeSuffix(locale) {
  const symbol = localeSymbol(locale);
  return symbol[0].toUpperCase() + symbol.slice(1);
}

/** `start-here` → `startHere`. */
export function moduleSymbol(moduleId) {
  return moduleId.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * A TypeScript single-quoted string literal.
 *
 * Non-ASCII is left as itself — the files are UTF-8 and `Terminar sessão` is
 * enormously easier to review than `Terminar sessão`.
 */
export function tsString(value) {
  return `'${value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')}'`;
}

/** Stable fingerprint of an English source string. */
export function fingerprint(source) {
  return createHash('sha256').update(source, 'utf8').digest('hex').slice(0, 12);
}

/**
 * Replace the generated region of a file, keeping everything above it.
 *
 * When the file does not exist, or has no sentinel yet, `header` is used —
 * which is how a brand new language's catalogue gets its docblock.
 */
export function writeGenerated(path, header, body) {
  let preamble = header;

  if (existsSync(path)) {
    const existing = readFileSync(path, 'utf8');
    const at = existing.indexOf(SENTINEL);

    /**
     * An existing file with no sentinel is hand-written in full, and the
     * import has no way to tell which part of it is safe to replace.
     *
     * It refuses rather than guessing. The first version of this silently used
     * `header` in that case, which on its first real run replaced the
     * European Portuguese translator's notes — `tu` versus `você`, the 1990
     * spelling reform, which words keep their silent consonant — with a
     * four-line stub. Nothing failed; the prose was simply gone, and only a
     * `grep` for a phrase I happened to remember found it.
     *
     * Destroying work is not an acceptable outcome of a tool whose whole
     * purpose is to preserve it, so this is now an error with an instruction.
     */
    if (at === -1) {
      throw new Error(
        `${path} already exists and has no generated-region marker.\n` +
          `Add this line to it, below anything hand-written and above the exported object:\n\n` +
          `${SENTINEL}\n\n` +
          `Everything above that line is preserved on every import; everything below is rewritten.`,
      );
    }

    preamble = existing.slice(0, at);
  }

  writeFileSync(path, `${preamble}${SENTINEL}\n\n${body}`, 'utf8');
}

/** An object literal's entries, one key per line. */
export function entries(map, indent = '  ') {
  return Object.entries(map)
    .map(([key, value]) => `${indent}${tsString(key)}: ${tsString(value)},`)
    .join('\n');
}
