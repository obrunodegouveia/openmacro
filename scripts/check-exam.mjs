#!/usr/bin/env node
/**
 * ============================================================================
 * Exam engine self-test — `npm run check:exam`
 * ============================================================================
 *
 * The exam engine makes claims that TypeScript cannot hold it to: that a seed
 * rebuilds the same paper, that the paper spans the course rather than one
 * corner of it, that the level gate actually gates. This drives the real
 * engine against the real registry and checks each of them.
 *
 * It also sits a paper three times — as a candidate who knows everything, one
 * who knows nothing, and one who is strong on the easy material and weak on
 * the hard — because the third is the case a single overall percentage would
 * wave through, and refusing to is the entire point of the level thresholds.
 *
 * The loader preamble is the one from `validate-content.mjs`: Node runs the
 * TypeScript sources directly, and needs to be taught the `@/` alias and
 * extensionless imports.
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
const { assembleExam, gradeExam, DEFAULT_BLUEPRINT, certificateCode, verifyCertificate } =
  await import('@openmacro/core/engine/exam');
const { evaluateReadouts, observationKey } = await import('@openmacro/core/engine/simulation');

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

let failures = 0;
function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ''}`);
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? `  ${detail}` : ''}`);
    failures += 1;
  }
}

// ---------------------------------------------------------------------------
// Simulating a candidate
// ---------------------------------------------------------------------------

// Keyed the way the exam keys items: challenge ids repeat across lessons.
const CHALLENGES = new Map();
for (const module of MODULES) {
  for (const lesson of module.lessons) {
    for (const challenge of lesson.challenges) CHALLENGES.set(`${lesson.id}#${challenge.id}`, challenge);
  }
}
const lookup = (item) => CHALLENGES.get(item.id);

const meets = (actual, comparator, expected, tolerance = 1e-9) => {
  switch (comparator) {
    case 'eq': return Math.abs(actual - expected) <= tolerance;
    case 'gte': return actual >= expected - tolerance;
    case 'lte': return actual <= expected + tolerance;
    case 'gt': return actual > expected + tolerance;
    case 'lt': return actual < expected - tolerance;
    default: return false;
  }
};

/**
 * A correct answer for any challenge type.
 *
 * Simulations are the awkward one: "correct" means the objective is complete,
 * which needs both a slider position that hits the target and the full set of
 * required observations. The observations are recorded as though the learner
 * had visited each required value, and the target is found by grid search —
 * the same search the pre-merge checks use.
 */
function correctAnswer(challenge) {
  switch (challenge.type) {
    case 'multiple_choice':
      return { type: 'multiple_choice', optionId: challenge.correctOptionId };
    case 'concept_match':
      return {
        type: 'concept_match',
        pairings: Object.fromEntries(challenge.pairs.map((pair) => [pair.id, pair.id])),
      };
    case 'order_flow':
      return { type: 'order_flow', order: [...challenge.correctOrder] };
    case 't_account_flow':
      return { type: 't_account_flow', shifts: challenge.expectedShifts.map((s) => ({ ...s })) };
    case 'interactive_sim': {
      const observed = (challenge.objective.requiredObservations ?? []).flatMap((requirement) =>
        requirement.values.map((value) => observationKey(requirement.sliderKey, value)),
      );
      const target = challenge.objective.target;
      const base = Object.fromEntries(challenge.sliders.map((s) => [s.key, s.defaultValue]));
      if (!target) return { type: 'interactive_sim', sliderValues: base, observed };
      let combos = [{}];
      for (const slider of challenge.sliders) {
        const points = [
          slider.min,
          slider.min + (slider.max - slider.min) / 3,
          slider.defaultValue,
          slider.min + (2 * (slider.max - slider.min)) / 3,
          slider.max,
        ];
        combos = combos.flatMap((combo) => points.map((value) => ({ ...combo, [slider.key]: value })));
      }
      const hit = combos.find((values) =>
        meets(evaluateReadouts(challenge, values)[target.readoutKey], target.comparator, target.value, target.tolerance),
      );
      return { type: 'interactive_sim', sliderValues: hit ?? base, observed };
    }
    default:
      return null;
  }
}

/** A deliberately wrong answer, for the candidate who knows nothing. */
function wrongAnswer(challenge) {
  switch (challenge.type) {
    case 'multiple_choice': {
      const other = challenge.options.find((o) => o.id !== challenge.correctOptionId);
      return { type: 'multiple_choice', optionId: other ? other.id : '__none__' };
    }
    case 'concept_match': {
      const ids = challenge.pairs.map((p) => p.id);
      const rotated = ids.map((_, i) => ids[(i + 1) % ids.length]);
      return { type: 'concept_match', pairings: Object.fromEntries(ids.map((id, i) => [id, rotated[i]])) };
    }
    case 'order_flow':
      return { type: 'order_flow', order: [...challenge.correctOrder].reverse() };
    case 't_account_flow':
      return { type: 't_account_flow', shifts: [] };
    case 'interactive_sim':
      return {
        type: 'interactive_sim',
        sliderValues: Object.fromEntries(challenge.sliders.map((s) => [s.key, s.defaultValue])),
        observed: [],
      };
    default:
      return null;
  }
}

const answersFor = (exam, decide) =>
  Object.fromEntries(
    exam.items.map((item) => {
      const challenge = CHALLENGES.get(item.id);
      return [item.id, decide(item, challenge)];
    }),
  );

// ---------------------------------------------------------------------------
// The checks
// ---------------------------------------------------------------------------

console.log('\nExam engine — self-test\n');
const totalChallenges = CHALLENGES.size;
console.log(
  `  registry: ${MODULES.length} modules, ${totalChallenges} challenges, blueprint asks for ${DEFAULT_BLUEPRINT.itemCount}\n`,
);

console.log('Assembly');
const { exam, shortfalls } = assembleExam(MODULES, 'governor-2026');
check('paper assembled with no shortfalls', shortfalls.length === 0, shortfalls.join('; '));
check('paper has the requested number of items', exam.items.length === DEFAULT_BLUEPRINT.itemCount, `${exam.items.length} items`);
check(
  'no item appears twice',
  new Set(exam.items.map((i) => i.id)).size === exam.items.length,
);

const again = assembleExam(MODULES, 'governor-2026').exam;
check(
  'same seed rebuilds an identical paper',
  again.fingerprint === exam.fingerprint &&
    again.items.every((item, i) => item.id === exam.items[i].id),
  exam.fingerprint,
);
const other = assembleExam(MODULES, 'governor-2027').exam;
check('a different seed gives a different paper', other.fingerprint !== exam.fingerprint, other.fingerprint);

console.log('\nCoverage');
const byLevel = new Map();
for (const item of exam.items) byLevel.set(item.level, (byLevel.get(item.level) ?? 0) + 1);
for (const [level, weight] of Object.entries(DEFAULT_BLUEPRINT.levelWeights)) {
  const want = Math.round(weight * DEFAULT_BLUEPRINT.itemCount);
  const got = byLevel.get(level) ?? 0;
  check(`${level} quota respected`, Math.abs(got - want) <= 1, `wanted ~${want}, got ${got}`);
}
const perModule = new Map();
for (const item of exam.items) perModule.set(item.moduleId, (perModule.get(item.moduleId) ?? 0) + 1);
const worst = [...perModule.entries()].sort((a, b) => b[1] - a[1])[0];
check(
  'no module dominates the paper',
  worst[1] <= Math.ceil(exam.items.length / 6),
  `${perModule.size} modules represented, heaviest is ${worst[0]} with ${worst[1]}`,
);
const applied = exam.items.filter((i) => ['interactive_sim', 't_account_flow', 'order_flow'].includes(i.type)).length;
check(
  'applied share meets the blueprint minimum',
  applied / exam.items.length >= DEFAULT_BLUEPRINT.minAppliedShare - 1e-9,
  `${applied}/${exam.items.length} = ${Math.round((applied / exam.items.length) * 100)}%`,
);

console.log('\nGrading');
const perfect = gradeExam(exam, answersFor(exam, (_i, c) => correctAnswer(c)), lookup);
check('a candidate who knows everything scores 100%', perfect.correct === exam.items.length, `${perfect.correct}/${perfect.asked}`);
check('…and passes', perfect.passed === true);
check('…and is issued a certificate', typeof perfect.certificate === 'string' && perfect.certificate.length > 0, perfect.certificate ?? '');

const blank = gradeExam(exam, {}, lookup);
check('an unanswered paper scores zero', blank.correct === 0);
check('…and fails', blank.passed === false);
check('…and is issued no certificate', blank.certificate === null);
check('…and every module shows as weak', blank.weakModules.length === perModule.size);

const wrong = gradeExam(exam, answersFor(exam, (_i, c) => wrongAnswer(c)), lookup);
check('deliberately wrong answers score near zero', wrong.share < 0.15, `${wrong.correct}/${wrong.asked}`);

console.log('\nThe level gate');
const lopsided = gradeExam(
  exam,
  answersFor(exam, (item, c) => (item.level === 'advanced' ? wrongAnswer(c) : correctAnswer(c))),
  lookup,
);
const advanced = lopsided.byLevel.find((l) => l.level === 'advanced');
check('beginner and intermediate are passed', lopsided.byLevel.filter((l) => l.level !== 'advanced').every((l) => l.passed));
check('advanced is failed', advanced.passed === false, `${advanced.correct}/${advanced.asked}`);

/**
 * The test above fails on the overall mark too, so it does not actually prove
 * the gate does anything. This one does: a candidate who aces everything easy
 * and lands just under the advanced threshold, clearing the overall pass mark
 * on the strength of the rest of the paper. If the gate is doing its job this
 * is a fail; with only an overall percentage it would be a pass.
 */
const advancedItems = exam.items.filter((i) => i.level === 'advanced');
const allowedWrong = Math.floor(advancedItems.length * (1 - DEFAULT_BLUEPRINT.levelPassMark)) + 1;
const sacrificed = new Set(advancedItems.slice(0, allowedWrong).map((i) => i.id));
const nearMiss = gradeExam(
  exam,
  answersFor(exam, (item, c) => (sacrificed.has(item.id) ? wrongAnswer(c) : correctAnswer(c))),
  lookup,
);
const nearMissAdvanced = nearMiss.byLevel.find((l) => l.level === 'advanced');
check(
  'a near-miss candidate clears the overall pass mark',
  nearMiss.share >= DEFAULT_BLUEPRINT.passMark,
  `overall ${(nearMiss.share * 100).toFixed(1)}% vs pass mark ${DEFAULT_BLUEPRINT.passMark * 100}%`,
);
check(
  '…but is under the advanced threshold',
  nearMissAdvanced.share < DEFAULT_BLUEPRINT.levelPassMark,
  `advanced ${(nearMissAdvanced.share * 100).toFixed(1)}% vs ${DEFAULT_BLUEPRINT.levelPassMark * 100}%`,
);
check(
  '…and the gate fails them anyway — which an overall percentage would not',
  nearMiss.passed === false,
);
check(
  'the paper as a whole is failed, whatever the overall mark',
  lopsided.passed === false,
  `overall ${Math.round(lopsided.share * 100)}%`,
);

console.log('\nCertificates');
check(
  'a certificate verifies against the mark it was issued for',
  verifyCertificate(perfect.certificate, exam.fingerprint, perfect.correct, perfect.asked),
);
check(
  'a certificate does not verify against an inflated mark',
  !verifyCertificate(perfect.certificate, exam.fingerprint, perfect.correct, perfect.asked - 5),
);
check(
  'a certificate does not verify against a different paper',
  !verifyCertificate(perfect.certificate, other.fingerprint, perfect.correct, perfect.asked),
);
check(
  'the code is stable for the same inputs',
  certificateCode(exam.fingerprint, 40, 40) === certificateCode(exam.fingerprint, 40, 40),
);

console.log('\nDegrading honestly');
/**
 * The shortfall path. A blueprint can ask for more than the registry holds —
 * during early authoring, or if someone sets itemCount optimistically. The
 * engine must say so rather than crash or quietly hand back a short paper
 * that looks complete.
 */
const greedy = assembleExam(MODULES, 'greedy', { ...DEFAULT_BLUEPRINT, itemCount: 5000 });
check('an impossible blueprint does not crash', Array.isArray(greedy.exam.items));
check('…it reports the shortfall', greedy.shortfalls.length > 0, `${greedy.shortfalls.length} reported`);
check('…and still never repeats an item', new Set(greedy.exam.items.map((i) => i.id)).size === greedy.exam.items.length, `${greedy.exam.items.length} items drawn from ${totalChallenges}`);
check('…and never invents one', greedy.exam.items.every((i) => CHALLENGES.has(i.id)));

const zeroed = assembleExam(MODULES, 'zeroed', {
  ...DEFAULT_BLUEPRINT,
  levelWeights: { beginner: 0, intermediate: 0, advanced: 0 },
});
check('a blueprint weighting nothing yields an empty paper, not a crash', zeroed.exam.items.length === 0 && zeroed.shortfalls.length > 0);
check('…and an empty paper cannot be passed', gradeExam(zeroed.exam, {}, lookup).passed === false);

console.log('\nDeterminism across many seeds');
let sameSeedStable = true;
const fingerprints = new Set();
for (let i = 0; i < 200; i++) {
  const a = assembleExam(MODULES, `seed-${i}`);
  const b = assembleExam(MODULES, `seed-${i}`);
  if (a.exam.fingerprint !== b.exam.fingerprint) sameSeedStable = false;
  if (a.shortfalls.length > 0) sameSeedStable = false;
  fingerprints.add(a.exam.fingerprint);
}
check('200 seeds each rebuild identically, with no shortfalls', sameSeedStable);
check('200 seeds produce 200 distinct papers', fingerprints.size === 200, `${fingerprints.size} distinct`);

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Exam engine sound — every check passed.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} check(s) failed.\n`);
process.exit(1);
