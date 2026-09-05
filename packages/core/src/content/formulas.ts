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
  // -------------------------------------------------------------------------
  // Purchasing power and inflation
  // -------------------------------------------------------------------------

  /**
   * What a fixed sum still buys after `years` of compounding inflation:
   * P = nominal / (1 + i)^years.
   *
   * Compounded, not multiplied. "10% for 10 years" erodes to 38.6% of the
   * original, not to zero, and the gap between those two answers is the whole
   * intuition this formula exists to build.
   *
   * Expects: `nominal`, `inflationRate` (0.10 = 10%), `years`.
   */
  purchasing_power: (inputs) => {
    const nominal = read(inputs, 'nominal');
    const rate = read(inputs, 'inflationRate');
    const years = read(inputs, 'years');
    if (rate <= -1) return 0;
    return nominal / Math.pow(1 + rate, years);
  },

  /**
   * Share of value lost over the period, as a fraction: 1 - 1/(1 + i)^years.
   *
   * Expects: `inflationRate`, `years`.
   */
  purchasing_power_lost: (inputs) => {
    const rate = read(inputs, 'inflationRate');
    const years = read(inputs, 'years');
    if (rate <= -1) return 1;
    return 1 - 1 / Math.pow(1 + rate, years);
  },

  /**
   * Years for money to lose half its value at a constant rate.
   *
   * The exact log form, not the "rule of 70" approximation: the shortcut is
   * fine in a headline and wrong enough at high inflation to mislead, and a
   * learner comparing 2% with 50% would see the error.
   *
   * Expects: `inflationRate`.
   */
  halving_years: (inputs) => {
    const rate = read(inputs, 'inflationRate');
    if (rate <= 0) return 0;
    return Math.log(2) / Math.log(1 + rate);
  },

  /**
   * Real return once inflation is taken out, by the exact Fisher relation:
   * (1 + nominal) / (1 + inflation) - 1.
   *
   * Not the `nominal - inflation` approximation. At the rates a saver in a
   * high-inflation country actually faces, the approximation is off by
   * percentage points in the direction that flatters the saver.
   *
   * Expects: `nominalRate`, `inflationRate`.
   */
  real_interest_rate: (inputs) => {
    const nominal = read(inputs, 'nominalRate');
    const inflation = read(inputs, 'inflationRate');
    if (inflation <= -1) return 0;
    return (1 + nominal) / (1 + inflation) - 1;
  },

  // -------------------------------------------------------------------------
  // Reserves, settlement and central bank operations
  // -------------------------------------------------------------------------

  /**
   * Reserves left after a payment leaves the bank: reserves - outflow.
   *
   * Expects: `reserves`, `outflow`.
   */
  reserves_after_payment: (inputs) => {
    read(inputs, 'reserves');
    return read(inputs, 'reserves') - read(inputs, 'outflow');
  },

  /**
   * How much a peg can defend before the reserves run out:
   * fxReserves / defenceRate, i.e. the quantity of domestic currency the
   * central bank can buy back at the pegged price.
   *
   * Expects: `fxReserves`, `pegRate`.
   */
  peg_defence_capacity: (inputs) => {
    const fxReserves = read(inputs, 'fxReserves');
    const pegRate = read(inputs, 'pegRate');
    if (pegRate <= 0) return 0;
    return fxReserves * pegRate;
  },

  /**
   * Share of a currency's issuance actually backed by hard reserves.
   *
   * Expects: `fxReserves`, `moneyBase`, `pegRate`.
   */
  peg_backing_ratio: (inputs) => {
    const fxReserves = read(inputs, 'fxReserves');
    const base = read(inputs, 'moneyBase');
    const pegRate = read(inputs, 'pegRate');
    if (base <= 0) return 0;
    return (fxReserves * pegRate) / base;
  },

  /**
   * Where an overnight rate settles between the floor and the ceiling of a
   * corridor, given how much excess liquidity is in the system.
   *
   * Modelled as a linear glide from the ceiling at zero excess to the floor
   * once excess passes `saturationPoint`. Real corridors are not linear, but
   * the shape — abundant reserves pin the rate to the floor, scarce reserves
   * push it to the ceiling — is the mechanism being taught.
   *
   * Expects: `floorRate`, `ceilingRate`, `excessReserves`, `saturationPoint`.
   */
  corridor_rate: (inputs) => {
    const floor = read(inputs, 'floorRate');
    const ceiling = read(inputs, 'ceilingRate');
    const excess = read(inputs, 'excessReserves');
    const saturation = read(inputs, 'saturationPoint');
    if (saturation <= 0) return floor;
    const slack = Math.min(Math.max(excess / saturation, 0), 1);
    return ceiling - (ceiling - floor) * slack;
  },

  // -------------------------------------------------------------------------
  // Leverage and solvency
  // -------------------------------------------------------------------------

  /**
   * Equity remaining after an asset loses value: equity - assets x lossRate.
   *
   * Expects: `assets`, `equity`, `lossRate`.
   */
  equity_after_loss: (inputs) => {
    const assets = read(inputs, 'assets');
    const equity = read(inputs, 'equity');
    const lossRate = read(inputs, 'lossRate');
    return equity - assets * lossRate;
  },

  /**
   * Assets per unit of equity — the leverage ratio.
   *
   * Expects: `assets`, `equity`.
   */
  leverage_ratio: (inputs) => {
    const assets = read(inputs, 'assets');
    const equity = read(inputs, 'equity');
    if (equity <= 0) return 0;
    return assets / equity;
  },

  /**
   * The asset write-down that wipes equity out entirely, as a fraction of
   * assets: equity / assets. A bank levered 20x is insolvent on a 5% loss.
   *
   * Expects: `assets`, `equity`.
   */
  wipeout_loss_rate: (inputs) => {
    const assets = read(inputs, 'assets');
    const equity = read(inputs, 'equity');
    if (assets <= 0) return 0;
    return equity / assets;
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
