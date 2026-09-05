/**
 * ============================================================================
 * T-account evaluation
 * ============================================================================
 *
 * Pure logic for `t_account_flow` challenges: what the learner has posted,
 * whether each balance sheet still balances, and how their postings differ
 * from the expected ones.
 *
 * Kept free of React so the same rules run in the app, in the web playground
 * and in the content validator — a lesson that grades one way on a phone and
 * another way in CI would be worse than no validation at all.
 */

import type {
  BalanceSheetShift,
  BalanceSheetSide,
  TAccountEntity,
  TAccountFlowChallenge,
  TAccountLine,
} from '../content/schema';

/**
 * Currency amounts are integers of the minor unit in practice, but lesson
 * authors write them as plain numbers. Compare with a tolerance so a lesson
 * written as `0.1 + 0.2` never fails on float noise.
 */
const AMOUNT_TOLERANCE = 0.005;

/** Identity of a posting, ignoring its magnitude. */
function slotKey(shift: BalanceSheetShift): string {
  return `${shift.entityId}::${shift.side}::${shift.account.trim().toLowerCase()}`;
}

function sameAmount(a: number, b: number): boolean {
  return Math.abs(a - b) <= AMOUNT_TOLERANCE;
}

/**
 * Collapses repeated postings to the same slot into one net figure.
 *
 * A learner who posts +10 and then +10 again to the same account has posted
 * +20, and should be told their reserves are double-counted rather than told
 * they have two entries.
 */
export function netShifts(shifts: readonly BalanceSheetShift[]): BalanceSheetShift[] {
  const totals = new Map<string, BalanceSheetShift>();

  for (const shift of shifts) {
    const key = slotKey(shift);
    const existing = totals.get(key);
    if (existing) {
      totals.set(key, { ...existing, delta: existing.delta + shift.delta });
    } else {
      totals.set(key, { ...shift });
    }
  }

  // Drop slots that net to nothing: posting +10 and -10 is the same as never
  // having touched the account.
  return [...totals.values()].filter((shift) => !sameAmount(shift.delta, 0));
}

export interface EntityBalance {
  entityId: string;
  /** Net change in total assets. */
  assetDelta: number;
  /** Net change in total liabilities. */
  liabilityDelta: number;
  /**
   * True when both sides moved by the same amount — the double-entry
   * constraint. An unbalanced sheet is always wrong, whatever else is right.
   */
  balanced: boolean;
}

/** Net movement per side for one entity, given the learner's postings. */
export function entityBalance(
  entityId: string,
  shifts: readonly BalanceSheetShift[],
): EntityBalance {
  let assetDelta = 0;
  let liabilityDelta = 0;

  for (const shift of shifts) {
    if (shift.entityId !== entityId) continue;
    if (shift.side === 'asset') assetDelta += shift.delta;
    else liabilityDelta += shift.delta;
  }

  return {
    entityId,
    assetDelta,
    liabilityDelta,
    balanced: sameAmount(assetDelta, liabilityDelta),
  };
}

/** One `EntityBalance` per entity in the challenge, in display order. */
export function entityBalances(
  challenge: TAccountFlowChallenge,
  shifts: readonly BalanceSheetShift[],
): EntityBalance[] {
  return challenge.entities.map((entity: TAccountEntity) =>
    entityBalance(entity.id, shifts),
  );
}

export interface ShiftDiff {
  /** Expected postings the learner never made. */
  missing: BalanceSheetShift[];
  /** Postings the learner made that no expected posting accounts for. */
  unexpected: BalanceSheetShift[];
  /**
   * Right slot, wrong number — carried separately from `missing` because the
   * feedback is different: "the account is right, the amount is not".
   */
  wrongAmount: Array<{ expected: BalanceSheetShift; actual: BalanceSheetShift }>;
}

/**
 * Compares the learner's postings against the expected set.
 *
 * Order never matters — a balance sheet is a set of positions, not a sequence.
 */
export function diffShifts(
  expected: readonly BalanceSheetShift[],
  submitted: readonly BalanceSheetShift[],
): ShiftDiff {
  const net = netShifts(submitted);
  const bySlot = new Map(net.map((shift) => [slotKey(shift), shift]));

  const missing: BalanceSheetShift[] = [];
  const wrongAmount: ShiftDiff['wrongAmount'] = [];
  const matchedSlots = new Set<string>();

  for (const want of expected) {
    const key = slotKey(want);
    const got = bySlot.get(key);

    if (!got) {
      missing.push(want);
      continue;
    }

    matchedSlots.add(key);
    if (!sameAmount(got.delta, want.delta)) {
      wrongAmount.push({ expected: want, actual: got });
    }
  }

  const unexpected = net.filter((shift) => !matchedSlots.has(slotKey(shift)));

  return { missing, unexpected, wrongAmount };
}

export interface TAccountVerdict extends ShiftDiff {
  /** Every expected posting present, correct, and nothing extra. */
  correct: boolean;
  /** Every entity's assets and liabilities moved together. */
  allBalanced: boolean;
  balances: EntityBalance[];
}

/** Full evaluation of an attempt: correctness plus everything needed to explain it. */
export function evaluateTAccount(
  challenge: TAccountFlowChallenge,
  submitted: readonly BalanceSheetShift[],
): TAccountVerdict {
  const diff = diffShifts(challenge.expectedShifts, submitted);
  const balances = entityBalances(challenge, netShifts(submitted));

  return {
    ...diff,
    balances,
    allBalanced: balances.every((balance) => balance.balanced),
    correct:
      diff.missing.length === 0 &&
      diff.unexpected.length === 0 &&
      diff.wrongAmount.length === 0,
  };
}

/**
 * The single most useful sentence about a wrong attempt.
 *
 * Ordered by what unblocks the learner fastest: an unbalanced sheet is the
 * most fundamental error, then postings in the wrong place, then amounts.
 * Returns `undefined` when the attempt is correct.
 */
export function describeVerdict(
  challenge: TAccountFlowChallenge,
  verdict: TAccountVerdict,
): string | undefined {
  if (verdict.correct) return undefined;

  const labelOf = (entityId: string) =>
    challenge.entities.find((entity) => entity.id === entityId)?.label ?? entityId;

  const unbalanced = verdict.balances.find((balance) => !balance.balanced);
  if (unbalanced) {
    return `${labelOf(unbalanced.entityId)}'s sheet does not balance — assets and liabilities have to move together.`;
  }

  const [firstUnexpected] = verdict.unexpected;
  if (firstUnexpected) {
    return `${labelOf(firstUnexpected.entityId)} should not have a "${firstUnexpected.account}" entry in this operation.`;
  }

  const [firstWrongAmount] = verdict.wrongAmount;
  if (firstWrongAmount) {
    return `The amount on ${labelOf(firstWrongAmount.expected.entityId)}'s "${firstWrongAmount.expected.account}" is off.`;
  }

  const [firstMissing] = verdict.missing;
  if (firstMissing) {
    return `${labelOf(firstMissing.entityId)} is still missing a posting on the ${firstMissing.side} side.`;
  }

  return undefined;
}

/** Opening balance for one side of an entity's sheet. */
export function openingTotal(
  entity: TAccountEntity,
  side: BalanceSheetSide,
): number {
  return (entity.openingLines ?? [])
    .filter((line: TAccountLine) => line.side === side)
    .reduce((sum, line) => sum + line.amount, 0);
}
