#!/usr/bin/env node
/**
 * ============================================================================
 * T-account engine and validator checks — `npm run test:engine`
 * ============================================================================
 *
 * Runs the pure grading rules in `packages/core/src/engine/tAccounts.ts` and
 * the `t_account_flow` content rules in `validate.ts` against small fixtures,
 * plus a few facts about the Olivia warm-up that a 12-year-old meets first.
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
const { getLessonById } = await import('@openmacro/core/content/registry');

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
