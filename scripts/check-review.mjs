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
const { resolveDue, reviewChallenges } = await import('@openmacro/core/progress/reviewSession');
const { createSession, lessonSessionReducer } = await import('@openmacro/core/engine/lessonSession');

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

/**
 * ----------------------------------------------------------------------------
 * A review session drawn from more than one lesson
 * ----------------------------------------------------------------------------
 *
 * The trap this exists for: challenge ids are unique only *within* a lesson,
 * and twenty-one of them are reused across the course — `mc-haircut` sits in
 * both `kab-repos` and `open-market-operations`. A lesson never trips over
 * this because it only ever holds its own. A review queue holds whatever is
 * due, from anywhere, and the session reducer keys its queue by challenge id.
 *
 * Two colliding ids therefore collapse into one: the learner is asked once,
 * and the second item is graded on an answer it never received. Nothing about
 * that is visible in a type or on screen — the session simply runs one
 * question short — so it is checked by running the real reducer over a queue
 * built to contain the collision.
 */
/**
 * ----------------------------------------------------------------------------
 * Resolving a schedule against content that has moved on
 * ----------------------------------------------------------------------------
 *
 * A review item is a reference — `lessonId#challengeId` and nothing else — so
 * that an edit to the course does not leave the queue asking a question the
 * course no longer contains. The cost of that choice is that resolution can
 * fail, and the only acceptable failure is a silent drop. Anything else means
 * a learner opening review after a content update gets a crash or a blank
 * question.
 */
console.log('\nA schedule resolved against edited content');
{
  const lesson = {
    id: 'kab-repos',
    title: 'Repos',
    challenges: [{ id: 'mc-haircut', type: 'multiple_choice' }],
  };
  const lessons = new Map([[lesson.id, lesson]]);
  const lessonById = (id) => lessons.get(id);

  const items = [
    newReviewItem('kab-repos#mc-haircut', 'kab-repos', 'm', 'missed', DAY0),
    // The lesson was deleted from the course.
    newReviewItem('gone-lesson#mc-x', 'gone-lesson', 'm', 'missed', DAY0),
    // The lesson is still there; this challenge was rewritten out of it.
    newReviewItem('kab-repos#mc-removed', 'kab-repos', 'm', 'missed', DAY0),
  ];

  const due = resolveDue(items, lessonById, { today: addDays(DAY0, 1) });
  check('an item whose lesson is gone is dropped', !due.some((d) => d.lessonId === 'gone-lesson'));
  check(
    'an item whose challenge was rewritten out is dropped',
    !due.some((d) => d.itemId === 'kab-repos#mc-removed'),
  );
  check('the item that still exists survives', due.length === 1 && due[0].itemId === 'kab-repos#mc-haircut');
  check(
    'and carries the lesson it came from, for the "from" line',
    due[0]?.lessonTitle === 'Repos',
    due[0]?.lessonTitle,
  );
  check(
    'a schedule that resolves to nothing is an empty queue, not a throw',
    resolveDue(items, () => undefined, { today: addDays(DAY0, 1) }).length === 0,
  );
}

console.log('\nA session drawn from more than one lesson');
{
  const mc = (id, correctOptionId) => ({
    id,
    type: 'multiple_choice',
    prompt: `prompt for ${id}`,
    options: [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b' },
    ],
    correctOptionId,
    explanation: 'because',
  });

  // The same challenge id, due from two different lessons. `itemId` is what
  // the store keys on and is unique; `challenge.id` is not.
  const due = [
    { itemId: 'kab-repos#mc-haircut', challenge: mc('mc-haircut', 'a'), lessonId: 'kab-repos', lessonTitle: 'Repos' },
    { itemId: 'open-market-operations#mc-haircut', challenge: mc('mc-haircut', 'b'), lessonId: 'open-market-operations', lessonTitle: 'OMOs' },
  ];

  const challenges = reviewChallenges(due);
  check(
    'colliding challenges stay two distinct questions',
    new Set(challenges.map((c) => c.id)).size === 2,
    challenges.map((c) => c.id).join(', '),
  );
  check(
    '…re-keyed to the id the store records against',
    challenges.every((c, i) => c.id === due[i].itemId),
  );

  // Drive the real reducer, answering each question correctly, and confirm
  // the session asks both and grades both.
  const lesson = {
    id: '__review__',
    title: 'Review',
    subtitle: '',
    icon: '🔁',
    difficulty: 'core',
    estimatedMinutes: 1,
    hearts: 999,
    challenges,
    keyTakeaways: [],
  };
  const t = (key) => key;
  let session = createSession(lesson);
  const asked = [];
  for (let guard = 0; guard < 20 && session.status === 'in_progress'; guard++) {
    const current = lesson.challenges.find((c) => c.id === session.queue[0]);
    asked.push(current.id);
    session = lessonSessionReducer(session, {
      kind: 'submit',
      answer: { type: 'multiple_choice', optionId: current.correctOptionId },
      t,
    });
    session = lessonSessionReducer(session, { kind: 'continue' });
  }

  /**
   * Counting the questions is not enough: with colliding ids the reducer still
   * shifts twice, so a broken session asks the *same* question twice and looks
   * the right length. What has to hold is that two different ones were asked.
   */
  check(
    'two different questions are asked, not one twice',
    new Set(asked).size === 2,
    asked.join(', '),
  );
  check('the session finishes', session.status !== 'in_progress', session.status);

  const grades = gradesFor({ resolved: session.resolved, missed: session.missed });
  check(
    'both items are graded, under their own ids',
    grades.size === 2 && due.every((d) => grades.get(d.itemId) === 'known'),
    [...grades].map(([k, v]) => `${k}=${v}`).join(' '),
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
