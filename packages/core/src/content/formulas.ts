/**
 * ============================================================================
 * Simulation formula registry
 * ============================================================================
 *
 * `interactive_sim` challenges reference maths by *name* (`formulaId`) rather
 * than embedding functions, so lesson files stay pure JSON-safe data.
 *
 * CONTRIBUTORS: adding a new simulation means adding one pure function here
 * and referencing its key from your lesson's `readouts`. Keep every function:
 *   - pure (no I/O, no randomness, no Date.now)
 *   - total (never throw; clamp or guard divide-by-zero instead)
 *   - documented with the economics it models
 */

/**
 * Inputs available to a formula: the challenge's `constants` merged with the
 * live slider values, plus any readouts already computed earlier in the list
 * (readouts are evaluated top-to-bottom, so later ones can build on earlier).
 */
export type FormulaInputs = Readonly<Record<string, number>>;

export type Formula = (inputs: FormulaInputs) => number;

/** Safe lookup: missing variables read as 0 rather than NaN-poisoning a sim. */
function read(inputs: FormulaInputs, key: string): number {
  const value = inputs[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export const FORMULAS = {
  /**
   * Simple deposit (money) multiplier: m = 1 / R.
   *
   * The theoretical ceiling on how many times a unit of base money can be
   * re-lent through the banking system when every bank holds exactly the
   * reserve requirement `R` and no cash leaks out of the system.
   *
   * Expects: `reserveRatio` as a decimal fraction (0.10 = 10%).
   */
  money_multiplier: (inputs) => {
    const reserveRatio = read(inputs, 'reserveRatio');
    if (reserveRatio <= 0) return 0;
    return 1 / reserveRatio;
  },

  /**
   * Total broad money created from an initial deposit: M = D x (1 / R).
   *
   * Expects: `initialDeposit`, `reserveRatio`.
   */
  total_money_created: (inputs) => {
    const deposit = read(inputs, 'initialDeposit');
    const reserveRatio = read(inputs, 'reserveRatio');
    if (reserveRatio <= 0) return 0;
    return deposit * (1 / reserveRatio);
  },

  /**
   * New credit issued on top of the original deposit: M - D.
   *
   * This is the number that surprises people: the original saver still sees
   * their full balance, yet this much *additional* deposit money now exists.
   *
   * Expects: `initialDeposit`, `reserveRatio`.
   */
  new_credit_created: (inputs) => {
    const deposit = read(inputs, 'initialDeposit');
    const reserveRatio = read(inputs, 'reserveRatio');
    if (reserveRatio <= 0) return 0;
    return deposit * (1 / reserveRatio) - deposit;
  },

  /**
   * Reserves the system must ultimately hold against total deposits: M x R,
   * which collapses to the original deposit D — a useful sanity check for
   * learners: base money never grew, only deposit money did.
   *
   * Expects: `initialDeposit`, `reserveRatio`.
   */
  required_reserves: (inputs) => {
    const deposit = read(inputs, 'initialDeposit');
    const reserveRatio = read(inputs, 'reserveRatio');
    if (reserveRatio <= 0) return 0;
    return deposit * (1 / reserveRatio) * reserveRatio;
  },
} satisfies Record<string, Formula>;

export type KnownFormulaId = keyof typeof FORMULAS;

/** Returns the formula, or `undefined` if the id is not registered. */
export function getFormula(id: string): Formula | undefined {
  return (FORMULAS as Record<string, Formula>)[id];
}

export function isKnownFormulaId(id: string): id is KnownFormulaId {
  return Object.prototype.hasOwnProperty.call(FORMULAS, id);
}
