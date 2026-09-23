#!/usr/bin/env node
/**
 * ============================================================================
 * Review scheduler self-test — `npm run check:review`
 * ============================================================================
 *
 * A scheduler is a set of claims about the future, and every one of them is
 * cheap to get wrong in a way nothing else notices: an ease that drifts below
 * its floor turns the queue into the same six cards forever, an interval that
 * grows unbounded quietly stops asking about material the course claims a
 * learner still knows, a miss that reschedules for today makes a session
 * impossible to finish.
 *
 * None of that is visible in a type, and none of it would surface in review.
 * So this drives the real module through years of simulated practice and
 * checks the properties hold at the end.
 */

import { registerHooks } from 'node:module';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const isFile = (url) => {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
};
const firstExisting = (base) =>
  [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(isFile) ?? null;

registerHooks({
  resolve(specifier, context, nextResolve) {
    // `reviewStore` reaches AsyncStorage. The grading function under test is
    // pure and never touches it, but the module-level import must still
    // resolve under plain Node.
    if (specifier === '@react-native-async-storage/async-storage') {
      return {
        url: new URL('./stub-async-storage.mjs', import.meta.url).href,
        shortCircuit: true,
      };
    }
    if (specifier.startsWith('@/')) {
      const resolved = firstExisting(new URL(`src/${specifier.slice(2)}`, ROOT).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const resolved = firstExisting(new URL(specifier, context.parentURL).href);
      if (resolved) return { url: resolved, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { newReviewItem, reviewed, dueItems, summarise, addDays, compareDateKeys } = await import(
  '@openmacro/core/progress/review'
);
const { gradesFor } = await import('@/services/reviewStore');

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(
    ok
      ? `  \x1b[32m✓\x1b[0m ${name}${detail ? `  \x1b[2m${detail}\x1b[0m` : ''}`
      : `  \x1b[31m✗\x1b[0m ${name}${detail ? `  ${detail}` : ''}`,
  );
  if (!ok) failures += 1;
};

const DAY0 = '2026-01-01';
const item = (grade, on = DAY0) => newReviewItem('l#c', 'l', 'm', grade, on);

console.log('\nReview scheduler — self-test\n');

console.log('Grading a finished run');
/**
 * The mapping from what the runner saw to what the scheduler is told. Getting
 * this wrong is invisible — the queue simply fills with the wrong things — so
 * it is checked against the three outcomes a run can produce, and the one it
 * must stay silent about.
 */
{
  const clean = gradesFor({ lessonId: 'l', moduleId: 'm', resolved: ['a', 'b', 'c'], missed: [] });
  check('first-attempt answers are "known"', [...clean.values()].every((g) => g === 'known'), `${clean.size} items`);

  // Fumbled then solved — what the runner's re-queueing produces on every
  // lesson somebody finishes the hard way.
  const fumbled = gradesFor({ lessonId: 'l', moduleId: 'm', resolved: ['a', 'b'], missed: ['b'] });
  check('answered only after a miss is "struggled"', fumbled.get('b') === 'struggled');
  check('…and its neighbour is still "known"', fumbled.get('a') === 'known');

  // Out of hearts: 'c' was never solved.
  const failed = gradesFor({ lessonId: 'l', moduleId: 'm', resolved: ['a'], missed: ['b', 'c'] });
  check('never solved is "missed"', failed.get('b') === 'missed' && failed.get('c') === 'missed');
  check(
    'a challenge never reached is not graded at all',
    !failed.has('d'),
    'grading an unasked question would schedule it on the strength of nothing',
  );
}

console.log('\nDates');
check('addDays crosses a month boundary', addDays('2026-01-30', 3) === '2026-02-02');
check('…and a leap day', addDays('2028-02-28', 1) === '2028-02-29', addDays('2028-02-28', 1));
check('…and a year boundary', addDays('2026-12-31', 1) === '2027-01-01');
check('comparison orders date keys', compareDateKeys('2026-01-01', '2026-01-02') < 0);

console.log('\nA single item, practised well');
let known = item('known');
const intervals = [known.intervalDays];
let day = DAY0;
for (let i = 0; i < 8; i++) {
  day = known.dueOn;
  known = reviewed(known, 'known', day);
  intervals.push(known.intervalDays);
}
check('intervals grow', intervals.every((v, i) => i === 0 || v >= intervals[i - 1]), intervals.join(' → '));
check('…and are capped', known.intervalDays <= 180, `${known.intervalDays} days`);
check('…ease stays within bounds', known.ease <= 2.8 && known.ease >= 1.3, known.ease.toFixed(2));

console.log('\nA single item, repeatedly missed');
let bad = item('known');
for (let i = 0; i < 20; i++) bad = reviewed(bad, 'missed', bad.dueOn);
check('ease never falls below the floor', bad.ease >= 1.3, bad.ease.toFixed(2));
check('interval collapses to a day', bad.intervalDays === 1);
check('streak resets', bad.streak === 0);
check('lapses are counted once per fall from grace', bad.lapses === 1, `${bad.lapses} lapse(s)`);

console.log('\nA miss never reschedules for today');
for (const grade of ['known', 'struggled', 'missed']) {
  const before = item('known');
  const after = reviewed(before, grade, '2026-03-05');
  check(
    `"${grade}" schedules strictly in the future`,
    compareDateKeys(after.dueOn, '2026-03-05') > 0,
    after.dueOn,
  );
}

console.log('\nStruggling shortens the leash');
let cruising = item('known');
for (let i = 0; i < 5; i++) cruising = reviewed(cruising, 'known', cruising.dueOn);
const wasInterval = cruising.intervalDays;
const struggled = reviewed(cruising, 'struggled', cruising.dueOn);
check('a struggled review comes back sooner', struggled.intervalDays < wasInterval, `${wasInterval} → ${struggled.intervalDays} days`);
check('…and lowers the ease', struggled.ease < cruising.ease, `${cruising.ease.toFixed(2)} → ${struggled.ease.toFixed(2)}`);
check('…but is not counted as a lapse', struggled.lapses === cruising.lapses);

console.log('\nThe queue');
const many = [];
for (let m = 0; m < 4; m++) {
  for (let i = 0; i < 12; i++) {
    const it = newReviewItem(`l${m}-${i}#c`, `l${m}`, `module-${m}`, 'missed', DAY0);
    many.push({ ...it, dueOn: addDays(DAY0, i % 3) });
  }
}
const queue = dueItems(many, addDays(DAY0, 5), { limit: 20, maxPerModule: 5 });
check('returns no more than the limit', queue.length <= 20, `${queue.length} items`);
check('respects the per-module cap', [...new Set(queue.map((q) => q.moduleId))].every((m) => queue.filter((q) => q.moduleId === m).length <= 5));
check('draws from every module rather than one', new Set(queue.map((q) => q.moduleId)).size === 4);
check(
  'most overdue first',
  queue.every((q, i) => i === 0 || compareDateKeys(queue[i - 1].dueOn, q.dueOn) <= 0),
);
check(
  'nothing not yet due leaks in',
  dueItems(many, addDays(DAY0, -1)).length === 0,
  'queue on the day before anything is due',
);

console.log('\nSummary');
const s = summarise(many, addDays(DAY0, 1));
check('counts what is tracked', s.tracked === 48);
check('counts what is due today', s.dueToday === many.filter((i) => compareDateKeys(i.dueOn, addDays(DAY0, 1)) <= 0).length, `${s.dueToday} due`);
check('this week includes today', s.dueThisWeek >= s.dueToday);
check('names the weakest modules', s.weakestModules.length > 0, s.weakestModules.join(', '));

console.log('\nTwo years of honest practice');
/**
 * The realistic end state: a learner who mostly remembers. If the scheduler is
 * sane, the queue shrinks as knowledge settles rather than growing without
 * bound — a queue that only grows is one that gets abandoned.
 */
let library = [];
let today = DAY0;
let reviewsDone = 0;
let secondYearPeak = 0;

/**
 * Seeded across the first sixty days rather than all on day one.
 *
 * Seeding everything at once makes every item come due on the same morning,
 * and a backlog check against that measures the simulation rather than the
 * scheduler. A learner meets the course a few lessons at a time, which is
 * what this does: roughly three new challenges a day for two months.
 */
for (let d = 0; d < 730; d++) {
  today = addDays(today, 1);

  if (d < 60) {
    for (let n = 0; n < 3; n++) {
      const index = d * 3 + n;
      library.push(newReviewItem(`l${index}#c`, `l${index}`, `module-${index % 12}`, 'known', today));
    }
  }

  // What was waiting before the session, not what the session served — the
  // limit would otherwise hide a backlog by capping what it reports.
  const waiting = dueItems(library, today, { limit: 10000, maxPerModule: 10000 }).length;
  if (d >= 365) secondYearPeak = Math.max(secondYearPeak, waiting);

  const todays = dueItems(library, today, { limit: 30, maxPerModule: 6 });
  reviewsDone += todays.length;
  const graded = new Map(
    todays.map((it, i) => [it.id, reviewed(it, i % 9 === 0 ? 'missed' : 'known', today)]),
  );
  library = library.map((it) => graded.get(it.id) ?? it);
}

check('reviews were actually happening', reviewsDone > 500, `${reviewsDone} reviews over ${library.length} items`);

/**
 * The property a learner feels, measured in the second year — once the
 * material they met in the first has settled.
 *
 * A scheduler that lets work arrive faster than a session clears it produces
 * a number that only ever goes up, and the honest response to that screen is
 * to stop opening the app. The session limit is 30, so a steady state that
 * stays inside two sessions is one somebody can actually keep up with.
 */
check(
  'the backlog stays inside what a session can clear',
  secondYearPeak <= 60,
  `worst morning in year two: ${secondYearPeak} waiting, session limit 30`,
);

const atCap = library.filter((i) => i.intervalDays >= 180).length;
check(
  'well-known items settle at the long interval rather than churning',
  atCap > library.length / 2,
  `${atCap}/${library.length} at the 180-day cap`,
);

if (failures === 0) {
  console.log('\x1b[32m%s\x1b[0m', '\n✓ Review scheduler sound — every check passed.\n');
  process.exit(0);
}
console.log('\x1b[31m%s\x1b[0m', `\n✗ ${failures} check(s) failed.\n`);
process.exit(1);
