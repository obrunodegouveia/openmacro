#!/usr/bin/env node
/**
 * ============================================================================
 * T-account engine and validator checks — `npm run test:engine`
 * ============================================================================
 *
 * Runs the pure grading rules in `packages/core/src/engine/tAccounts.ts` and
 * the `t_account_flow` content rules in `validate.ts` against small fixtures,
 * plus a few facts about the Olivia warm-up that a 12-year-old meets first,
 * and the speaker reactions in `engine/speaker.ts`.
 *
 * The equity flag is display-only by design: these tests pin that it never
 * changes a grade, and that the balance check stays assets = liabilities +
 * equity.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import './i18n-loader.mjs';

const {
  describeVerdict,
  entityBalance,
  entityHasEquity,
  evaluateTAccount,
  isEquity,
} = await import('@openmacro/core/engine/tAccounts');
const { looksLikeEquity, validateLesson } = await import('@openmacro/core/content/validate');
const { getLessonById, MODULES, ALL_LESSONS } = await import('@openmacro/core/content/registry');

/** A minimal two-entity sheet: a person who buys on credit from a shop. */
function fixture(overrides = {}) {
  return {
    id: 'fixture',
    type: 't_account_flow',
    prompt: 'Post it.',
    explanation: 'Because.',
    currency: 'EUR',
    entities: [
      {
        id: 'kid',
        label: 'Kid',
        tier: 'person',
        openingLines: [
          { account: 'Cash', side: 'asset', amount: 10 },
          { account: 'Equity', side: 'liability', amount: 10, equity: true },
        ],
      },
      {
        id: 'shop',
        label: 'Shop',
        tier: 'small_business',
        openingLines: [
          { account: 'Stock', side: 'asset', amount: 50 },
          { account: 'Supplier loan', side: 'liability', amount: 50 },
        ],
      },
    ],
    options: [
      { id: 'a', shift: { entityId: 'kid', side: 'asset', account: 'Prize', delta: 5 } },
      {
        id: 'b',
        shift: { entityId: 'kid', side: 'liability', account: 'Equity', delta: 5, equity: true },
      },
      { id: 'c', shift: { entityId: 'shop', side: 'asset', account: 'Stock', delta: -5 } },
    ],
    expectedShifts: [
      { entityId: 'kid', side: 'asset', account: 'Prize', delta: 5 },
      { entityId: 'kid', side: 'liability', account: 'Equity', delta: 5, equity: true },
    ],
    ...overrides,
  };
}

function lessonOf(challenge) {
  return {
    id: 'fixture-lesson',
    title: 'Fixture',
    subtitle: 'Fixture',
    icon: 'x',
    difficulty: 'intro',
    estimatedMinutes: 1,
    challenges: [challenge],
  };
}

function issuesFor(challenge) {
  return validateLesson(lessonOf(challenge)).map((issue) => issue.message);
}

test('equity counts on the right-hand side: assets = liabilities + equity', () => {
  const balance = entityBalance('kid', [
    { entityId: 'kid', side: 'asset', account: 'Prize', delta: 5 },
    { entityId: 'kid', side: 'liability', account: 'Equity', delta: 5, equity: true },
  ]);
  assert.equal(balance.balanced, true);
  assert.equal(balance.liabilityDelta, 5);
});

test('the equity flag never changes a grade', () => {
  const challenge = fixture();
  const flagged = evaluateTAccount(challenge, [challenge.options[0].shift, challenge.options[1].shift]);
  assert.equal(flagged.correct, true);
  // The same posting without the flag lands in the same slot.
  const { equity: _drop, ...bare } = challenge.options[1].shift;
  const unflagged = evaluateTAccount(challenge, [challenge.options[0].shift, bare]);
  assert.equal(unflagged.correct, true);
});

test('a missing equity posting is not described as a missing debt', () => {
  const challenge = fixture();
  // Only the asset half posted: the sheet is unbalanced, which the engine
  // reports first.
  const verdict = evaluateTAccount(challenge, [challenge.options[0].shift]);
  assert.match(describeVerdict(challenge, verdict) ?? '', /does not balance/);

  // With the balance complaint set aside, what is left is the missing equity
  // posting — and it must be called equity, not a liability.
  const missingOnly = { ...verdict, balances: verdict.balances.map((b) => ({ ...b, balanced: true })) };
  const message = describeVerdict(challenge, missingOnly) ?? '';
  assert.match(message, /equity/);
  assert.doesNotMatch(message, /liability/);
});

test('isEquity and entityHasEquity', () => {
  const challenge = fixture();
  assert.equal(isEquity({ side: 'liability', equity: true }), true);
  assert.equal(isEquity({ side: 'liability' }), false);
  assert.equal(isEquity({ side: 'asset', equity: true }), false);
  assert.equal(entityHasEquity(challenge, challenge.entities[0]), true);
  assert.equal(entityHasEquity(challenge, challenge.entities[1]), false);
});

test('looksLikeEquity names the owner’s stake, not mixed lines', () => {
  for (const name of ['Equity', 'Net worth', 'Shareholders’ equity', 'Partners’ capital', 'Capital and reserves']) {
    assert.equal(looksLikeEquity(name), true, name);
  }
  for (const name of ['Other liabilities and capital', 'Other deposits and equity', 'Customer deposits', 'Bank reserves']) {
    assert.equal(looksLikeEquity(name), false, name);
  }
});

test('the validator accepts a correctly flagged sheet', () => {
  assert.deepEqual(issuesFor(fixture()), []);
});

test('the validator rejects an equity line that is not flagged', () => {
  const challenge = fixture();
  challenge.entities[0].openingLines[1] = { account: 'Equity', side: 'liability', amount: 10 };
  assert.ok(issuesFor(challenge).some((message) => /reads as equity but is not flagged/.test(message)));
});

test('the validator rejects equity on the asset side', () => {
  const challenge = fixture();
  challenge.options[2] = {
    id: 'c',
    shift: { entityId: 'shop', side: 'asset', account: 'Stock', delta: -5, equity: true },
  };
  assert.ok(issuesFor(challenge).some((message) => /asset side/.test(message)));
});

test('the validator rejects a flag that disagrees across occurrences', () => {
  const challenge = fixture();
  challenge.entities[1].openingLines[1] = {
    account: 'Supplier loan',
    side: 'liability',
    amount: 50,
    equity: true,
  };
  challenge.options.push({
    id: 'd',
    shift: { entityId: 'shop', side: 'liability', account: 'Supplier loan', delta: 5 },
  });
  assert.ok(issuesFor(challenge).some((message) => /Flag every occurrence or none/.test(message)));
});

test('Olivia’s amp: person and shop tiers, two traps, equity shown apart', () => {
  const lesson = getLessonById('kab-what-a-bank-is-for');
  const amp = lesson?.challenges.find((challenge) => challenge.id === 'olivia-amp-pay-later');
  assert.ok(amp && amp.type === 't_account_flow');
  assert.deepEqual(
    amp.entities.map((entity) => entity.tier),
    ['person', 'small_business'],
  );
  const traps = amp.options.length - amp.expectedShifts.length;
  assert.ok(traps >= 1 && traps <= 2, `expected 1–2 traps, found ${traps}`);
  for (const option of amp.options) {
    const expected = amp.expectedShifts.some(
      (shift) => shift.entityId === option.shift.entityId && shift.account === option.shift.account,
    );
    if (!expected) assert.ok(option.feedback, `trap ${option.id} needs feedback`);
  }
  for (const entity of amp.entities) assert.equal(entityHasEquity(amp, entity), true);

  const verdict = evaluateTAccount(amp, amp.expectedShifts);
  assert.equal(verdict.correct, true);
  assert.equal(verdict.allBalanced, true);
});

// ---- speakers --------------------------------------------------------------

const { speakerExpression, speakerReaction, promptAsks } = await import('@openmacro/core/engine/speaker');
const { CHARACTER_EXPRESSIONS, CHARACTER_IDS } = await import('@openmacro/core/content/characters');

test('speaker reactions: one mapping, decided in core', () => {
  assert.equal(speakerExpression('question', 'What is truly hers now?'), 'thinking');
  assert.equal(speakerExpression('question', 'O que é dela agora?'), 'thinking');
  assert.equal(speakerExpression('question', 'Match each word to what happens at her table.'), 'happy');
  assert.equal(speakerExpression('correct'), 'excited');
  assert.equal(speakerExpression('incorrect'), 'oops');
  assert.equal(speakerExpression('idle'), 'happy');
  assert.ok(promptAsks('Is it “an asset?”'));
  for (const moment of ['question', 'correct', 'incorrect', 'idle']) {
    assert.ok(CHARACTER_EXPRESSIONS.includes(speakerExpression(moment, 'x?')));
  }
});

test('a challenge without a speaker draws nobody', () => {
  assert.equal(speakerReaction({ prompt: 'Why?' }, 'question'), null);
  assert.deepEqual(speakerReaction({ prompt: 'Why?', speaker: 'breno' }, 'incorrect'), {
    character: 'breno',
    expression: 'oops',
  });
});

test('the validator rejects an unregistered speaker', () => {
  const lesson = {
    id: 'speaker-fixture',
    challenges: [{ ...fixture(), speaker: 'sal' }],
  };
  const issues = validateLesson(lesson);
  assert.ok(issues.some((issue) => issue.message.includes('speaker "sal"')), JSON.stringify(issues));
  assert.deepEqual(CHARACTER_IDS, ['olivia', 'breno']);
});

test('Olivia and Breno voice the module-16 warm-ups', () => {
  const speakers = (lessonId) =>
    Object.fromEntries(
      getLessonById(lessonId)
        .challenges.filter((challenge) => challenge.speaker)
        .map((challenge) => [challenge.id, challenge.speaker]),
    );
  assert.deepEqual(speakers('kab-what-a-bank-is-for'), {
    'olivia-what-is-an-asset': 'olivia',
    'olivia-iou': 'olivia',
    'olivia-amp-pay-later': 'olivia',
    'olivia-whats-truly-hers': 'olivia',
  });
  assert.deepEqual(speakers('kab-income-statement'), {
    'olivia-merch-words': 'olivia',
    'olivia-profit': 'olivia',
    'olivia-breno-shop-profit': 'breno',
    'olivia-profit-grows-equity': 'olivia',
  });
});

// ---- kids mode ---------------------------------------------------------------

const { lessonForMode, lessonsForMode, moduleHasKidsPath, nextKidsLesson, onKidsPath, resumeId, effectiveMode } =
  await import('@openmacro/core/engine/lessonMode');

test('kids mode: only the kids challenges, in order, same lesson otherwise', () => {
  const lesson = getLessonById('kab-what-a-bank-is-for');
  const kids = lessonForMode(lesson, 'kids');
  assert.deepEqual(
    kids.challenges.map((challenge) => challenge.id),
    lesson.challenges.filter((challenge) => challenge.kids).map((challenge) => challenge.id),
  );
  assert.ok(kids.challenges.length > 0 && kids.challenges.length < lesson.challenges.length);
  assert.equal(kids.id, lesson.id);
  assert.equal(kids.video, lesson.video);
  assert.equal(lessonForMode(lesson, 'kids'), kids, 'stable identity');
  assert.equal(lessonForMode(lesson, 'standard'), lesson);
  assert.equal(resumeId(lesson, 'kids'), 'kab-what-a-bank-is-for.kids');
  assert.equal(resumeId(lesson, 'standard'), 'kab-what-a-bank-is-for');
});

test('kids mode leaves lessons off the path whole', () => {
  const module = MODULES.find((candidate) => candidate.id === 'banking-and-money');
  const off = module.lessons.find((lesson) => !onKidsPath(lesson));
  assert.ok(off, 'the grown-up end of the module has no kids challenges');
  assert.equal(effectiveMode(off, 'kids'), 'standard');
  assert.equal(lessonForMode(off, 'kids'), off);
  assert.equal(resumeId(off, 'kids'), off.id);
});

test('the kids path: the first ten Khan lessons, then it ends', () => {
  const module = MODULES.find((candidate) => candidate.id === 'banking-and-money');
  assert.ok(moduleHasKidsPath(module));
  const path = lessonsForMode(module, 'kids');
  assert.deepEqual(
    path.map((lesson) => lesson.id),
    module.lessons.slice(0, 10).map((lesson) => lesson.id),
  );
  for (const lesson of path) {
    assert.ok(lesson.challenges.every((challenge) => challenge.kids && challenge.speaker), lesson.id);
    assert.ok(lesson.challenges.length >= 4, `${lesson.id} has ${lesson.challenges.length}`);
    assert.ok(lesson.challenges.length >= (lesson.hearts ?? 3), `${lesson.id}: fewer steps than hearts`);
  }
  assert.equal(nextKidsLesson(module, path[0].id)?.id, path[1].id);
  assert.equal(nextKidsLesson(module, path.at(-1).id), null);
  assert.equal(lessonsForMode(module, 'standard'), module.lessons);
  // What Is Economics? is the other module with a kids path, checked below.
  const withKids = new Set(['banking-and-money', 'what-is-economics']);
  for (const other of MODULES.filter((candidate) => !withKids.has(candidate.id))) {
    assert.equal(moduleHasKidsPath(other), false, `${other.id} has no kids path`);
    assert.equal(lessonsForMode(other, 'kids'), other.lessons);
  }
});

test('the kids path: every lesson of What Is Economics?, voiced throughout', () => {
  const module = MODULES.find((candidate) => candidate.id === 'what-is-economics');
  assert.equal(MODULES[0], module, 'it opens the course');
  assert.ok(moduleHasKidsPath(module));
  const path = lessonsForMode(module, 'kids');
  assert.deepEqual(
    path.map((lesson) => lesson.id),
    module.lessons.map((lesson) => lesson.id),
  );
  for (const lesson of path) {
    assert.ok(lesson.challenges.every((challenge) => challenge.kids && challenge.speaker), lesson.id);
    assert.ok(lesson.challenges.length >= 4, `${lesson.id} has ${lesson.challenges.length}`);
    assert.ok(lesson.challenges.length >= (lesson.hearts ?? 3), `${lesson.id}: fewer steps than hearts`);
  }
  assert.equal(nextKidsLesson(module, path.at(-1).id), null);
});

test('a kids run earns no more XP than the whole lesson can', () => {
  for (const lesson of ALL_LESSONS.filter(onKidsPath)) {
    const xp = (challenges) => challenges.reduce((sum, challenge) => sum + (challenge.xp ?? 10), 0);
    assert.ok(xp(lessonForMode(lesson, 'kids').challenges) < xp(lesson.challenges), lesson.id);
  }
});

test('Spanish writes numbers its own way, and a billion is not a billón', async () => {
  const { formatCurrency, formatCompactCurrency } = await import('@openmacro/core/format');
  const { resolveLocale } = await import('@openmacro/core/i18n/locales');
  assert.equal(formatCurrency(1234.5, '€', 'es-ES'), '€1.234,50');
  assert.match(formatCompactCurrency(2e9, 'EUR', 'es-ES'), /mM/);
  assert.match(formatCompactCurrency(2e12, 'EUR', 'es-ES'), /billones/);
  assert.equal(resolveLocale('es-MX'), 'es-ES');
});

test('an assigned exam asks only about lessons the learner has finished', async () => {
  const { assembleAssignedExam } = await import('@openmacro/core/engine/assignedExam');
  const done = new Set(MODULES[0].lessons.slice(0, 3).map((lesson) => lesson.id));
  const assignment = { seed: 'fixture-seed', itemCount: 20 };

  const { exam } = assembleAssignedExam(MODULES, (id) => done.has(id), assignment);
  assert.ok(exam.items.length > 0);
  assert.ok(exam.items.every((item) => done.has(item.lessonId)));
  assert.equal(new Set(exam.items.map((item) => item.id)).size, exam.items.length);

  // The app and the website must set the same paper from the same inputs.
  const again = assembleAssignedExam(MODULES, (id) => done.has(id), assignment);
  assert.deepEqual(again.exam.items, exam.items);
});

test('an assigned exam is empty before any lesson is finished, and capped after many', async () => {
  const { assembleAssignedExam } = await import('@openmacro/core/engine/assignedExam');
  const assignment = { seed: 'fixture-seed', itemCount: 20 };
  assert.equal(assembleAssignedExam(MODULES, () => false, assignment).exam.items.length, 0);

  const everything = assembleAssignedExam(MODULES, () => true, assignment).exam;
  assert.equal(everything.items.length, 20);
  const levels = new Set(everything.items.map((item) => item.level));
  assert.ok(levels.size > 1, 'a learner who has done every level is asked about more than one');
});

test('an assigned exam shown in Portuguese grades, and sends scores without answers', async () => {
  const { assembleAssignedExam, assignedExamSubmission } = await import(
    '@openmacro/core/engine/assignedExam'
  );
  const { gradeExam } = await import('@openmacro/core/engine/exam');
  const { localisedModules, localisedLessonById } = await import('@openmacro/core/i18n/content');
  const { createTranslator } = await import('@openmacro/core/i18n');

  const modules = localisedModules('pt-PT');
  const { exam } = assembleAssignedExam(modules, () => true, { seed: 'pt', itemCount: 10 });
  const result = gradeExam(
    exam,
    {},
    (item) =>
      localisedLessonById('pt-PT', item.lessonId)?.challenges.find(
        (entry) => entry.id === item.challengeId,
      ),
    createTranslator('pt-PT'),
  );
  assert.equal(result.asked, 10);
  assert.equal(result.correct, 0);

  const sent = assignedExamSubmission('exam-id', result);
  assert.deepEqual(Object.keys(sent).sort(), [
    'p_asked',
    'p_by_level',
    'p_correct',
    'p_exam',
    'p_fingerprint',
    'p_missed_items',
    'p_paper_items',
    'p_weak_modules',
  ]);
  assert.equal(sent.p_asked, 10);
  assert.equal(sent.p_paper_items.length, 10);
  // Nothing was answered, so every item was missed. Ids only, no answers.
  assert.deepEqual(sent.p_missed_items, sent.p_paper_items);
  assert.ok(sent.p_missed_items.every((id) => /^[^#]+#[^#]+$/.test(id)));
});

test('a retake draws only from its focus lessons and never repeats an excluded item', async () => {
  const { assembleAssignedExam } = await import('@openmacro/core/engine/assignedExam');
  const first = assembleAssignedExam(MODULES, () => true, { seed: 'first', itemCount: 20 }).exam;
  const focusLessons = [...new Set(first.items.map((item) => item.lessonId))];
  const excludeItems = first.items.map((item) => item.id);

  const retake = assembleAssignedExam(MODULES, () => true, {
    seed: 'retake',
    itemCount: 20,
    focusLessons,
    excludeItems,
  }).exam;
  assert.ok(retake.items.length > 0);
  assert.ok(retake.items.every((item) => focusLessons.includes(item.lessonId)));
  assert.ok(retake.items.every((item) => !excludeItems.includes(item.id)));

  // Focus never reaches past what the learner has finished.
  const none = assembleAssignedExam(MODULES, () => false, {
    seed: 'retake',
    itemCount: 20,
    focusLessons,
  }).exam;
  assert.equal(none.items.length, 0);
});

test('the study plan names the missed questions in the exam language, and ticks redone lessons', async () => {
  const { examStudyPlan } = await import('@openmacro/core/engine/assignedExam');
  const { localisedModules } = await import('@openmacro/core/i18n/content');
  const modules = localisedModules('pt-PT');
  const lesson = modules[0].lessons[0];
  const other = modules[0].lessons[1];
  const exam = {
    reviewItems: [`${lesson.id}#${lesson.challenges[0].id}`, 'gone#nothing'],
    reviewLessons: [other.id, lesson.id],
    assignedAt: '2026-11-08T12:00:00Z',
  };
  const done = { [lesson.id]: '2026-11-09T10:00:00Z', [other.id]: '2026-11-01T10:00:00Z' };
  const plan = examStudyPlan(modules, exam, (id) => done[id]);
  assert.equal(plan.missed.length, 1, 'an item the course no longer has is left out');
  assert.equal(plan.missed[0].prompt, lesson.challenges[0].prompt);
  assert.deepEqual(plan.lessons.map((entry) => entry.lessonId), [lesson.id, other.id]);
  // Finished after the exam was assigned counts; finished before does not.
  assert.deepEqual(plan.lessons.map((entry) => entry.redone), [true, false]);
  assert.equal(plan.redoneCount, 1);
  assert.equal(examStudyPlan(modules, { reviewItems: [], reviewLessons: [], assignedAt: exam.assignedAt }, () => null), null);
});

test('the exam speed bonus: never below the pass mark, full when fast, half when steady', async () => {
  const { examSpeedBonusXp } = await import('@openmacro/core/engine/assignedExam');
  // 20 questions: 14 right is the pass mark; 600 s is 30 s a question.
  assert.equal(examSpeedBonusXp(20, 20, 300), 100);
  assert.equal(examSpeedBonusXp(20, 14, 600), 100);
  assert.equal(examSpeedBonusXp(20, 14, 601), 50);
  assert.equal(examSpeedBonusXp(20, 14, 1200), 50);
  assert.equal(examSpeedBonusXp(20, 14, 1201), 0);
  // Rushing and guessing never pay, however fast.
  assert.equal(examSpeedBonusXp(20, 13, 10), 0);
  assert.equal(examSpeedBonusXp(20, 20, null), 0);
  assert.equal(examSpeedBonusXp(0, 0, 0), 0);
  // Leaving once, however briefly, costs the whole bonus.
  assert.equal(examSpeedBonusXp(20, 20, 300, 1), 0);
  // An odd full bonus halves down, as integer division does in SQL.
  assert.equal(examSpeedBonusXp(3, 3, 120), 7);
});

test('the speed bonus in core is the one the database pays', async () => {
  const { readFileSync } = await import('node:fs');
  const { EXAM_SPEED_BONUS } = await import('@openmacro/core/engine/assignedExam');
  const sql = readFileSync(new URL('../supabase/migrations/0010_exam_timer.sql', import.meta.url), 'utf8');
  const body = sql.slice(sql.indexOf('create function public.submit_assigned_exam'));
  assert.match(body, new RegExp(`ceil\\(v_asked \\* ${EXAM_SPEED_BONUS.minShare}\\)`));
  assert.match(body, new RegExp(`v_duration <= v_asked \\* ${EXAM_SPEED_BONUS.fastSecondsPerQuestion}\\b`));
  assert.match(body, new RegExp(`v_duration <= v_asked \\* ${EXAM_SPEED_BONUS.steadySecondsPerQuestion}\\b`));
  assert.match(body, new RegExp(`v_bonus := v_asked \\* ${EXAM_SPEED_BONUS.xpPerQuestion};`));
  assert.match(body, /if v_row\.leaves = 0\b/);
  assert.match(body, new RegExp(`v_bonus := \\(v_asked \\* ${EXAM_SPEED_BONUS.xpPerQuestion}\\) / 2;`));
});

test('the exam clock and the reply from handing in', async () => {
  const { formatExamClock, examTimingFromReply } = await import('@openmacro/core/engine/assignedExam');
  assert.equal(formatExamClock(0), '0:00');
  assert.equal(formatExamClock(65.9), '1:05');
  assert.equal(formatExamClock(3725), '1:02:05');
  assert.equal(formatExamClock(-3), '0:00');
  assert.deepEqual(examTimingFromReply([{ duration_seconds: 412, bonus_xp: 100, leaves: 0 }]), {
    seconds: 412,
    bonusXp: 100,
    leaves: 0,
  });
  assert.deepEqual(examTimingFromReply([{ duration_seconds: null, bonus_xp: 0, leaves: 2 }]), {
    seconds: null,
    bonusXp: 0,
    leaves: 2,
  });
  assert.equal(examTimingFromReply([]), null);
  const { examStartFromReply } = await import('@openmacro/core/engine/assignedExam');
  assert.deepEqual(examStartFromReply([{ elapsed_seconds: 90, leaves: 1 }]), { seconds: 90, leaves: 1 });
  assert.deepEqual(examStartFromReply(null), { seconds: 0, leaves: 0 });
  assert.equal(examTimingFromReply(null), null);
});

test('optional modules: hidden unless unlocked, never in an assigned exam', async () => {
  const { OPTIONAL_MODULES, isOptionalModule, unlockedFromRows } = await import(
    '@openmacro/core/content/optional'
  );
  const { localisedModules, localisedLessonById, localisedCourse } = await import(
    '@openmacro/core/i18n/content'
  );
  const { assembleAssignedExam } = await import('@openmacro/core/engine/assignedExam');
  const [first] = OPTIONAL_MODULES;
  const lessonId = first.lessons[0].id;

  // Not in the public registry at all, so no public page can list it.
  assert.ok(!MODULES.some((module) => module.id === first.id));
  assert.equal(getLessonById(lessonId), undefined);

  for (const locale of ['en', 'pt-PT', 'es-ES']) {
    assert.ok(!localisedModules(locale).some((module) => isOptionalModule(module.id)));
    assert.equal(localisedLessonById(locale, lessonId), undefined);
    const granted = localisedModules(locale, [first.id]);
    assert.equal(granted.at(-1).id, first.id);
    assert.ok(localisedLessonById(locale, lessonId, [first.id]));
    assert.equal(localisedCourse(locale, [first.id]).modules.length, MODULES.length + 1);
  }

  // Unknown ids from the database unlock nothing.
  assert.deepEqual(unlockedFromRows([{ module_id: 'nope' }, { module_id: first.id }]), [first.id]);
  assert.deepEqual(unlockedFromRows(null), []);

  const { exam } = assembleAssignedExam(localisedModules('en', [first.id]), () => true, {
    seed: 'private',
    itemCount: 60,
  });
  const privateLessons = new Set(first.lessons.map((lesson) => lesson.id));
  assert.ok(exam.items.every((item) => !privateLessons.has(item.lessonId)));
});

test('every module, private ones included, is fully translated in every language', async () => {
  const { contentCoverage } = await import('@openmacro/core/i18n/content');
  const { OPTIONAL_MODULES } = await import('@openmacro/core/content/optional');
  const { LOCALES } = await import('@openmacro/core/i18n');
  for (const locale of LOCALES) {
    const coverage = contentCoverage(locale);
    for (const module of OPTIONAL_MODULES) {
      assert.ok(coverage.some((entry) => entry.moduleId === module.id), `${module.id} counted`);
    }
    const gaps = coverage.filter((entry) => entry.ratio < 1);
    assert.deepEqual(
      gaps.map((entry) => `${locale}/${entry.moduleId}: ${entry.total - entry.translated} missing`),
      [],
    );
  }
});

test('Bitcoin mode unlocks the Bitcoin modules; grants add to it, in one order', async () => {
  const { unlockedModules, BITCOIN_MODE_MODULES, OPTIONAL_MODULES, isBitcoinModeModule } =
    await import('@openmacro/core/content/optional');
  assert.deepEqual(unlockedModules([], false), []);
  assert.deepEqual(unlockedModules([], true), [...BITCOIN_MODE_MODULES]);
  // A grant and the mode for the same module is still one module.
  assert.deepEqual(unlockedModules([...BITCOIN_MODE_MODULES], true), [...BITCOIN_MODE_MODULES]);
  // Unknown ids unlock nothing.
  assert.deepEqual(unlockedModules(['not-a-module'], false), []);
  for (const id of BITCOIN_MODE_MODULES) {
    assert.ok(OPTIONAL_MODULES.some((module) => module.id === id), `${id} is an optional module`);
    assert.ok(isBitcoinModeModule(id));
  }
});

test('a final exam passes at 70%, the same mark as the speed bonus', async () => {
  const { examPassed, assignedExamFromRow, ASSIGNED_EXAM_COLUMNS } = await import(
    '@openmacro/core/engine/assignedExam'
  );
  assert.equal(examPassed(20, 14), true);
  assert.equal(examPassed(20, 13), false);
  assert.equal(examPassed(7, 5), true); // ceil(4.9)
  assert.equal(examPassed(7, 4), false);
  // Nothing handed in, or a score that cannot be, never passes.
  assert.equal(examPassed(null, null), false);
  assert.equal(examPassed(0, 0), false);
  assert.equal(examPassed(20, 21), false);
  assert.ok(ASSIGNED_EXAM_COLUMNS.includes('is_final'));
  const row = { id: 'x', locale: 'en', seed: 's', item_count: 20 };
  assert.equal(assignedExamFromRow(row)?.isFinal, false);
  assert.equal(assignedExamFromRow({ ...row, is_final: true })?.isFinal, true);
});

test('a time limit per question, and the teacher’s note and videos in the study plan', async () => {
  const { readFileSync } = await import('node:fs');
  const { assignedExamFromRow, questionSecondsLeft, examStudyPlan, ASSIGNED_EXAM_COLUMNS } =
    await import('@openmacro/core/engine/assignedExam');
  const { localisedModules } = await import('@openmacro/core/i18n/content');

  const row = { id: 'x', locale: 'pt-PT', seed: 's', item_count: 20 };
  assert.equal(assignedExamFromRow(row)?.secondsPerQuestion, null);
  assert.equal(assignedExamFromRow({ ...row, seconds_per_question: 0 })?.secondsPerQuestion, null);
  const timed = assignedExamFromRow({ ...row, seconds_per_question: 60, study_note: '  Estuda a curva.  ' });
  assert.equal(timed.secondsPerQuestion, 60);
  assert.equal(timed.studyNote, 'Estuda a curva.');
  assert.equal(assignedExamFromRow({ ...row, study_note: '   ' })?.studyNote, null);

  // Counts down in whole seconds, never below zero; untimed exams have no clock.
  assert.equal(questionSecondsLeft(timed, 0), 60);
  assert.equal(questionSecondsLeft(timed, 59_001), 1);
  assert.equal(questionSecondsLeft(timed, 60_000), 0);
  assert.equal(questionSecondsLeft(timed, 90_000), 0);
  assert.equal(questionSecondsLeft({ secondsPerQuestion: null }, 5_000), null);

  // Both clients select what the migration adds.
  const sql = readFileSync(new URL('../supabase/migrations/0012_exam_question_timer.sql', import.meta.url), 'utf8');
  for (const column of ['seconds_per_question', 'study_note']) {
    assert.ok(ASSIGNED_EXAM_COLUMNS.includes(column), `${column} is read`);
    assert.match(sql, new RegExp(`add column if not exists ${column}\\b`));
  }

  const modules = localisedModules('pt-PT');
  const withVideo = modules.flatMap((module) => module.lessons).find((lesson) => lesson.video);
  const without = modules.flatMap((module) => module.lessons).find((lesson) => !lesson.video);
  const plan = examStudyPlan(
    modules,
    {
      reviewItems: [],
      reviewLessons: [without.id, withVideo.id],
      assignedAt: '2026-11-08T12:00:00Z',
      studyNote: 'Estuda a curva.',
    },
    (id) => (id === withVideo.id ? '2026-11-09T10:00:00Z' : null),
  );
  assert.equal(plan.note, 'Estuda a curva.');
  assert.deepEqual(plan.videos.map((video) => [video.lessonId, video.watched]), [[withVideo.id, true]]);
  // A note alone is still a plan.
  const noteOnly = examStudyPlan(
    modules,
    { reviewItems: [], reviewLessons: [], assignedAt: '2026-11-08T12:00:00Z', studyNote: 'Lê.' },
    () => null,
  );
  assert.equal(noteOnly?.note, 'Lê.');
});

test('video progress: stretches played, merged; seeks add nothing', async () => {
  const {
    createWatchTracker,
    mergeSegments,
    watchedSeconds,
    videoProgressArgs,
    videoProgressFromRow,
    videoWatched,
    MAX_SEGMENTS,
    VIDEO_WATCHED_SHARE,
  } = await import('@openmacro/core/engine/videoProgress');
  const { readFileSync } = await import('node:fs');

  assert.deepEqual(mergeSegments([[10, 20], [0, 5], [5, 8], [19, 30], [40, 40], [-1, 3], [1]]), [[0, 8], [10, 30]]);
  assert.equal(watchedSeconds([[0, 8], [10, 30]]), 28);

  // Played 0 → 6 s in real time, then a seek to 300, then on to 304.
  const tracker = createWatchTracker();
  tracker.observe(0, true, 0);
  tracker.observe(2, true, 2000);
  tracker.observe(4, true, 4000);
  tracker.observe(6, true, 6000);
  tracker.observe(300, true, 8000); // a seek: 294 s in 2 s
  tracker.observe(302, true, 10000);
  tracker.observe(304, false, 12000);
  tracker.observe(400, false, 14000); // paused: nothing counts
  assert.deepEqual(tracker.segments(), [[0, 6], [300, 304]]);
  assert.equal(tracker.changed, true);
  tracker.saved();
  assert.equal(tracker.changed, false);

  // Resuming starts from what was stored, and watching it again adds nothing.
  const again = createWatchTracker([[0, 6]]);
  again.observe(0, true, 0);
  again.observe(2, true, 2000);
  assert.equal(again.changed, false);
  assert.deepEqual(again.segments(), [[0, 6]]);

  // Too many stretches: the closest are joined, never more than allowed.
  const many = Array.from({ length: MAX_SEGMENTS + 5 }, (_, i) => [i * 10, i * 10 + 2]);
  assert.equal(mergeSegments(many).length, MAX_SEGMENTS);

  const args = videoProgressArgs('kab-treasuries', 'JBWdbzzYbtU', 600.4, [[0, 300], [290, 700]]);
  assert.deepEqual(args, {
    p_video_key: 'kab-treasuries',
    p_video_id: 'JBWdbzzYbtU',
    p_duration: 600,
    p_segments: [[0, 601]],
    p_watched: 600,
  });

  const row = videoProgressFromRow({ video_key: 'x', duration_seconds: 600, watched_seconds: 540, completed_at: null });
  assert.equal(row.share, 0.9);
  assert.equal(videoWatched(row.share), true);
  assert.equal(videoWatched(0.89), false);
  assert.equal(videoWatched(null), false);

  // The database's 90% is the same.
  const sql = readFileSync(new URL('../supabase/migrations/0013_video_progress.sql', import.meta.url), 'utf8');
  assert.match(sql, new RegExp(`p_duration \\* ${VIDEO_WATCHED_SHARE}\\b`));
  assert.match(sql, new RegExp(`jsonb_array_length\\(p_segments\\) > ${MAX_SEGMENTS}\\b`));
});

test('the study plan ticks a video by how much of it was played', async () => {
  const { examStudyPlan } = await import('@openmacro/core/engine/assignedExam');
  const { localisedModules } = await import('@openmacro/core/i18n/content');
  const modules = localisedModules('pt-PT');
  const videos = modules.flatMap((module) => module.lessons).filter((lesson) => lesson.video).slice(0, 3);
  const exam = { reviewItems: [], reviewLessons: videos.map((l) => l.id), assignedAt: '2026-11-08T12:00:00Z' };
  const shares = { [videos[0].id]: 0.95, [videos[1].id]: 0.4 };
  const plan = examStudyPlan(modules, exam, () => '2026-11-09T10:00:00Z', (id) => shares[id] ?? null);
  assert.deepEqual(
    plan.videos.map((video) => [video.watched, video.share]),
    // 95%: watched. 40%: not, though the lesson was finished. Nothing recorded: the lesson decides.
    [[true, 0.95], [false, 0.4], [true, null]],
  );
});

test('a watched video earns XP once, by its listed length, never the player’s', async () => {
  const { videoXp, videoXpForRow, videoMinutesByKey, VIDEO_XP_CAP, VIDEO_XP_PER_MINUTE } = await import(
    '@openmacro/core/engine/videoProgress'
  );
  const { applyBonusXp, seedSnapshot } = await import('@openmacro/core/progress/rules');
  assert.equal(videoXp(10), 10 * VIDEO_XP_PER_MINUTE);
  assert.equal(videoXp(100), VIDEO_XP_CAP);
  assert.equal(videoXp(undefined), 0);
  assert.equal(videoXp(0), 0);

  const minutes = videoMinutesByKey(MODULES);
  const [key, listed] = [...minutes.entries()][0];
  assert.ok(minutes.size > 20, 'the course videos are counted');
  const watched = { video_key: key, duration_seconds: listed * 60, completed_at: '2026-11-09T15:00:00Z' };
  assert.equal(videoXpForRow(watched, minutes), videoXp(listed));
  // Not watched, not a course video, or a length far below the listed one: nothing.
  assert.equal(videoXpForRow({ ...watched, completed_at: null }, minutes), 0);
  assert.equal(videoXpForRow({ ...watched, video_key: 'invented' }, minutes), 0);
  assert.equal(videoXpForRow({ ...watched, duration_seconds: 30 }, minutes), 0);

  const seed = seedSnapshot('2026-11-09');
  const after = applyBonusXp(seed, 24);
  assert.equal(after.profile.totalXp, seed.profile.totalXp + 24);
  // The streak and the lessons are untouched; nonsense adds nothing.
  assert.equal(after.profile.dayStreak, seed.profile.dayStreak);
  assert.deepEqual(after.progress, seed.progress);
  assert.equal(applyBonusXp(seed, -5), seed);
  assert.equal(applyBonusXp(seed, Number.NaN), seed);
});

// ---------------------------------------------------------------------------
// Daily reminders
// ---------------------------------------------------------------------------

const { planReminders, isReminderTime, REMINDER_DAYS } = await import('@openmacro/core/progress/reminders');

const at19 = { hour: 19, minute: 0 };
const kinds = (plan) => plan.map((r) => r.kind);

test('reminders: a week of reminders, the last one saying so', () => {
  const plan = planReminders({ now: new Date(2026, 10, 9, 10, 0), time: at19, dayStreak: 0, streakActiveToday: false });
  assert.equal(plan.length, REMINDER_DAYS);
  assert.deepEqual(kinds(plan), ['daily', 'comeback', 'comeback', 'comeback', 'comeback', 'comeback', 'last']);
  assert.equal(plan[0].at.getDate(), 9);
  assert.equal(plan[0].at.getHours(), 19);
});

test('reminders: today is skipped once the streak has been kept today', () => {
  const plan = planReminders({ now: new Date(2026, 10, 9, 10, 0), time: at19, dayStreak: 4, streakActiveToday: true });
  assert.equal(plan[0].at.getDate(), 10);
  assert.equal(plan[0].kind, 'keep-streak');
  assert.equal(plan[0].streak, 4);
  assert.equal(plan[1].kind, 'comeback');
  assert.equal(plan.length, REMINDER_DAYS - 1);
});

test('reminders: a streak not yet kept today is named on today’s reminder', () => {
  const plan = planReminders({ now: new Date(2026, 10, 9, 10, 0), time: at19, dayStreak: 12, streakActiveToday: false });
  assert.equal(plan[0].kind, 'save-streak');
  assert.equal(plan[0].streak, 12);
  assert.equal(plan[1].kind, 'comeback');
});

test('reminders: a time already past today starts tomorrow, as an ordinary reminder', () => {
  const plan = planReminders({ now: new Date(2026, 10, 9, 20, 0), time: at19, dayStreak: 12, streakActiveToday: false });
  assert.equal(plan[0].at.getDate(), 10);
  assert.equal(plan[0].kind, 'daily');
  assert.equal(plan[0].streak, 0);
});

test('reminders: never in the past, one per day, at the chosen local time across a clock change', () => {
  // Europe moves its clocks on 29 March 2026; the reminder stays at 08:00 local.
  const now = new Date(2026, 2, 26, 8, 0);
  const plan = planReminders({ now, time: { hour: 8, minute: 0 }, dayStreak: 0, streakActiveToday: false });
  assert.ok(plan.every((r) => r.at.getTime() > now.getTime()));
  assert.ok(plan.every((r) => r.at.getHours() === 8 && r.at.getMinutes() === 0));
  assert.equal(new Set(plan.map((r) => r.at.toDateString())).size, plan.length);
});

test('reminders: a plan of one is not a goodbye', () => {
  const plan = planReminders({ now: new Date(2026, 10, 9, 10, 0), time: at19, dayStreak: 0, streakActiveToday: false, days: 1 });
  assert.deepEqual(kinds(plan), ['daily']);
});

test('reminders: stored times are validated', () => {
  assert.equal(isReminderTime({ hour: 19, minute: 0 }), true);
  assert.equal(isReminderTime({ hour: 24, minute: 0 }), false);
  assert.equal(isReminderTime({ hour: 7.5, minute: 0 }), false);
  assert.equal(isReminderTime(null), false);
});
