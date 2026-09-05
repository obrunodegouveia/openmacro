/**
 * ============================================================================
 * T-account scenarios and grading
 * ============================================================================
 *
 * A trimmed mirror of the app's `t_account_flow` model: the types from
 * `src/content/schema.ts` and the evaluation rules from
 * `src/engine/tAccounts.ts` (both in the Expo app at the repository root).
 *
 * Duplicated rather than imported so the website deploys on its own — but a
 * posting that grades correct here must grade correct in the app, so the two
 * change together. The rules are small on purpose.
 */

export type BalanceSheetSide = "asset" | "liability";

export type MonetaryTier =
  | "central_bank"
  | "commercial_bank"
  | "shadow_bank"
  | "fiduciary_core";

export interface TAccountLine {
  account: string;
  side: BalanceSheetSide;
  amount: number;
}

export interface TAccountEntity {
  id: string;
  label: string;
  tier: MonetaryTier;
  role?: string;
  openingLines?: TAccountLine[];
}

export interface BalanceSheetShift {
  entityId: string;
  side: BalanceSheetSide;
  account: string;
  delta: number;
}

/**
 * An entry chip in the tray.
 *
 * Note what it deliberately does not carry: where it goes. The chip names an
 * account and an amount, and the learner decides whose sheet it lands on and
 * which side. That decision *is* the skill — a chip that knows its own slot
 * would reduce the puzzle to sorting.
 */
export interface EntryChip {
  id: string;
  account: string;
  delta: number;
  /** Shown when this chip is placed somewhere it does not belong. */
  feedback?: string;
}

export interface AggregateEffect {
  aggregate: "M0" | "M1" | "M2" | "collateral";
  direction: "expand" | "contract" | "unchanged";
  note: string;
}

export interface TAccountScenario {
  id: string;
  moduleLabel: string;
  title: string;
  prompt: string;
  instructions: string;
  scenario: string;
  entities: TAccountEntity[];
  chips: EntryChip[];
  expectedShifts: BalanceSheetShift[];
  aggregateEffects: AggregateEffect[];
  explanation: string;
  xp: number;
}

/** Where a chip has been placed, or `null` while it sits in the tray. */
export type Placement = { entityId: string; side: BalanceSheetSide } | null;

const TOLERANCE = 0.005;

function slotKey(shift: BalanceSheetShift): string {
  return `${shift.entityId}::${shift.side}::${shift.account.trim().toLowerCase()}`;
}

/** Turns the learner's placements into postings. Unplaced chips are ignored. */
export function toShifts(
  scenario: TAccountScenario,
  placements: Record<string, Placement>,
): BalanceSheetShift[] {
  const shifts: BalanceSheetShift[] = [];
  for (const chip of scenario.chips) {
    const placement = placements[chip.id];
    if (!placement) continue;
    shifts.push({
      entityId: placement.entityId,
      side: placement.side,
      account: chip.account,
      delta: chip.delta,
    });
  }
  return shifts;
}

export interface EntityBalance {
  entityId: string;
  assetDelta: number;
  liabilityDelta: number;
  /** The double-entry constraint: both sides must move together. */
  balanced: boolean;
}

export function entityBalances(
  scenario: TAccountScenario,
  shifts: readonly BalanceSheetShift[],
): EntityBalance[] {
  return scenario.entities.map((entity) => {
    let assetDelta = 0;
    let liabilityDelta = 0;
    for (const shift of shifts) {
      if (shift.entityId !== entity.id) continue;
      if (shift.side === "asset") assetDelta += shift.delta;
      else liabilityDelta += shift.delta;
    }
    return {
      entityId: entity.id,
      assetDelta,
      liabilityDelta,
      balanced: Math.abs(assetDelta - liabilityDelta) <= TOLERANCE,
    };
  });
}

export interface Verdict {
  correct: boolean;
  allPlaced: boolean;
  allBalanced: boolean;
  balances: EntityBalance[];
  /** The one sentence most likely to unblock the learner. */
  hint?: string;
}

/**
 * Grades an attempt.
 *
 * Order of feedback matters: an unbalanced sheet is the most fundamental
 * error, so it is reported before anything about individual accounts.
 */
export function evaluate(
  scenario: TAccountScenario,
  placements: Record<string, Placement>,
): Verdict {
  const shifts = toShifts(scenario, placements);
  const balances = entityBalances(scenario, shifts);
  const allBalanced = balances.every((balance) => balance.balanced);

  const expectedKeys = new Set(scenario.expectedShifts.map(slotKey));
  const placedKeys = shifts.map(slotKey);

  const missing = scenario.expectedShifts.filter(
    (shift) => !placedKeys.includes(slotKey(shift)),
  );
  const wrong = shifts.filter((shift) => !expectedKeys.has(slotKey(shift)));

  const requiredChipIds = new Set(
    scenario.chips
      .filter((chip) =>
        scenario.expectedShifts.some(
          (shift) =>
            shift.account.trim().toLowerCase() === chip.account.trim().toLowerCase() &&
            Math.abs(shift.delta - chip.delta) <= TOLERANCE,
        ),
      )
      .map((chip) => chip.id),
  );
  const allPlaced = [...requiredChipIds].every((id) => placements[id]);

  const labelOf = (entityId: string) =>
    scenario.entities.find((entity) => entity.id === entityId)?.label ?? entityId;

  let hint: string | undefined;
  const firstWrong = wrong[0];
  const unbalanced = balances.find((balance) => !balance.balanced);

  if (firstWrong) {
    const chip = scenario.chips.find(
      (candidate) =>
        candidate.account.trim().toLowerCase() === firstWrong.account.trim().toLowerCase(),
    );
    hint =
      chip?.feedback ??
      `"${firstWrong.account}" does not belong on ${labelOf(firstWrong.entityId)}'s ${firstWrong.side} side.`;
  } else if (unbalanced) {
    hint = `${labelOf(unbalanced.entityId)}'s sheet does not balance — assets and liabilities have to move together.`;
  } else if (missing.length > 0) {
    const [first] = missing;
    hint = first
      ? `${labelOf(first.entityId)} is still missing an entry on the ${first.side} side.`
      : undefined;
  }

  return {
    correct: missing.length === 0 && wrong.length === 0 && allBalanced,
    allPlaced,
    allBalanced,
    balances,
    hint,
  };
}

/** Opening total for one side of an entity's sheet. */
export function openingTotal(
  entity: TAccountEntity,
  side: BalanceSheetSide,
): number {
  return (entity.openingLines ?? [])
    .filter((line) => line.side === side)
    .reduce((sum, line) => sum + line.amount, 0);
}
