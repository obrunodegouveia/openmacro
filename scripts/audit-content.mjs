#!/usr/bin/env node
/**
 * ============================================================================
 * Content quality audit — `npm run audit:content`
 * ============================================================================
 *
 * `lint:content` answers "is this lesson playable?". This answers "is it any
 * good?", across every challenge in the course at once.
 *
 * The distinction matters because the failures it looks for are all *valid*
 * content. A challenge with four identically-phrased options, or a distractor
 * with no rebuttal, or an explanation of nine words, loads and plays and
 * teaches badly. Nothing in the type system or the validator will ever
 * complain, and by the time there are a hundred lessons nobody is re-reading
 * the early ones.
 *
 * Every rule below is a house style this repository already follows in its
 * best lessons, made checkable so it survives contact with volume. Findings
 * are advisory: this exits 0 unless `--strict` is passed, because a good
 * lesson occasionally has a reason to break one of these.
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

const findings = [];
const note = (severity, where, message) => findings.push({ severity, where, message });

/** Normalised text, for comparing prompts across the whole course. */
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const seenPrompts = new Map();
const seenLessonIds = new Map();

for (const module of MODULES) {
  for (const lesson of module.lessons) {
    const at = `${module.id}/${lesson.id}`;

    // --- lesson shape ------------------------------------------------------
    if (seenLessonIds.has(lesson.id)) {
      note('error', at, `duplicate lesson id, also in ${seenLessonIds.get(lesson.id)}`);
    }
    seenLessonIds.set(lesson.id, at);

    if (!lesson.keyTakeaways?.length) {
      note('warn', at, 'no keyTakeaways — the completion screen has nothing to leave behind');
    }

    /**
     * A lesson of one challenge type is a quiz, not a lesson. The course has
     * five types precisely so a concept can be approached more than one way.
     */
    const types = new Set(lesson.challenges.map((c) => c.type));
    if (lesson.challenges.length >= 3 && types.size === 1) {
      note('warn', at, `all ${lesson.challenges.length} challenges are ${[...types][0]}`);
    }

    /**
     * Roughly a minute and a half per challenge, plus video time. Wildly out
     * means the card is lying to someone deciding whether to start.
     */
    const videoMinutes = lesson.video?.minutes ?? 0;
    const expected = lesson.challenges.length * 1.5 + videoMinutes;
    if (lesson.estimatedMinutes > expected * 2.5 || lesson.estimatedMinutes < expected * 0.4) {
      note(
        'warn',
        at,
        `estimatedMinutes ${lesson.estimatedMinutes} against ~${Math.round(expected)} implied by ${lesson.challenges.length} challenges${videoMinutes ? ` and a ${videoMinutes} min video` : ''}`,
      );
    }

    for (const challenge of lesson.challenges) {
      const cAt = `${at}#${challenge.id}`;

      // --- every challenge -------------------------------------------------
      if (!challenge.tags?.length) note('warn', cAt, 'no tags');
      if (challenge.xp === undefined) note('warn', cAt, 'no explicit xp');

      const explanation = String(challenge.explanation ?? '');
      if (explanation.length < 80) {
        note('warn', cAt, `explanation is ${explanation.length} chars — too short to teach anything`);
      }

      /**
       * Duplicate *content*, not duplicate wording.
       *
       * A concept_match prompt is an instruction — "Match each term to what it
       * means" — and repeating it across lessons is house style, not
       * copy-paste. The content lives in the pairs, so that is what gets
       * compared. For the other types the prompt is the question, so it is.
       *
       * The first version of this rule checked the prompt everywhere and
       * reported four matched-pair challenges as duplicates when all four were
       * fine. A linter that cries wolf gets switched off.
       */
      const contentKey =
        challenge.type === 'concept_match'
          ? norm((challenge.pairs ?? []).map((p) => p.term).sort().join('|'))
          : norm(challenge.prompt);
      if (contentKey && seenPrompts.has(contentKey)) {
        note('error', cAt, `duplicates the content of ${seenPrompts.get(contentKey)}`);
      }
      if (contentKey) seenPrompts.set(contentKey, cAt);

      // --- multiple choice -------------------------------------------------
      if (challenge.type === 'multiple_choice') {
        const options = challenge.options ?? [];
        if (options.length < 3) note('warn', cAt, `${options.length} options — too few to be a real choice`);
        if (options.length > 5) note('warn', cAt, `${options.length} options — more than anyone reads`);

        const labels = new Map();
        for (const option of options) {
          const key = norm(option.label);
          if (labels.has(key)) note('error', cAt, `two options read the same: "${option.label}"`);
          labels.set(key, true);
        }

        /**
         * The rule this repository already follows: a wrong answer earns a
         * targeted rebuttal. "Incorrect" teaches nobody why they were wrong,
         * and the learner who picked it is the one most in need of the answer.
         */
        for (const option of options) {
          if (option.id === challenge.correctOptionId) {
            if (option.feedback) {
              note('warn', cAt, `the correct option "${option.id}" carries feedback, which reads as a rebuttal`);
            }
            continue;
          }
          if (!option.feedback) {
            note('warn', cAt, `distractor "${option.id}" has no feedback`);
          }
        }

        if (!options.some((o) => o.id === challenge.correctOptionId)) {
          note('error', cAt, `correctOptionId "${challenge.correctOptionId}" matches no option`);
        }

        /**
         * A correct answer noticeably longer than every distractor can be
         * picked on shape alone, without reading a word of the economics.
         */
        const correct = options.find((o) => o.id === challenge.correctOptionId);
        const others = options.filter((o) => o.id !== challenge.correctOptionId);
        if (correct && others.length) {
          const longest = Math.max(...others.map((o) => o.label.length));
          if (correct.label.length > longest * 1.6) {
            note('warn', cAt, 'the correct option is much the longest — guessable without reading');
          }
        }
      }

      // --- concept match ----------------------------------------------------
      if (challenge.type === 'concept_match') {
        const pairs = challenge.pairs ?? [];
        if (pairs.length < 3) note('warn', cAt, `${pairs.length} pairs — too few to be a match`);

        for (const pair of pairs) {
          /**
           * A term is a noun phrase. Phrasing one as a question turns the
           * left column into half a quiz and reads oddly beside real terms.
           */
          if (/^(why|how|what|when|where)\b/i.test(pair.term) || pair.term.trim().endsWith('?')) {
            note('warn', cAt, `pair "${pair.id}" uses a question as a term: "${pair.term}"`);
          }
          if (pair.term.length > 40) {
            note('warn', cAt, `pair "${pair.id}" term is ${pair.term.length} chars — longer than a term`);
          }
        }
      }

      // --- order flow -------------------------------------------------------
      if (challenge.type === 'order_flow') {
        const events = challenge.events ?? [];
        if (events.length < 3) note('warn', cAt, `${events.length} events — too few to order`);
        if (events.length > 7) note('warn', cAt, `${events.length} events — hard to drag on a phone`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const strict = process.argv.includes('--strict');
const only = process.argv.find((a) => a.startsWith('--module='))?.slice('--module='.length);
const shown = only ? findings.filter((f) => f.where.startsWith(`${only}/`)) : findings;

const errors = shown.filter((f) => f.severity === 'error');
const warnings = shown.filter((f) => f.severity === 'warn');

const lessons = MODULES.reduce((n, m) => n + m.lessons.length, 0);
const challenges = MODULES.reduce(
  (n, m) => n + m.lessons.reduce((k, l) => k + l.challenges.length, 0),
  0,
);

console.log(
  `\nOpenMacro content audit — ${MODULES.length} modules, ${lessons} lessons, ${challenges} challenges` +
    (only ? `  (filtered to ${only})` : '') +
    '\n',
);

const byModule = new Map();
for (const finding of shown) {
  const key = finding.where.split('/')[0];
  byModule.set(key, [...(byModule.get(key) ?? []), finding]);
}

for (const [moduleId, list] of [...byModule].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${moduleId}  (${list.length})`);
  // Show everything when narrowed to one module; summarise otherwise.
  const cap = only ? list.length : 12;
  for (const finding of list.slice(0, cap)) {
    const mark = finding.severity === 'error' ? '\x1b[31m✗\x1b[0m' : '\x1b[33m!\x1b[0m';
    console.log(`    ${mark} ${finding.where.split('/').slice(1).join('/')}\n        ${finding.message}`);
  }
  if (list.length > cap) console.log(`    … and ${list.length - cap} more`);
  console.log('');
}

if (shown.length === 0) console.log('  Nothing to report.\n');

console.log(`  ${errors.length} error(s), ${warnings.length} warning(s)\n`);
process.exit(strict && shown.length > 0 ? 1 : errors.length > 0 ? 1 : 0);
