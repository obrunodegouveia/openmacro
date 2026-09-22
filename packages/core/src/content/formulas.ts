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
   * Deposits after a finite number of lending rounds:
   * M(n) = D x (1 - (1 - R)^n) / R.
   *
   * The multiplier formula is the limit of this as n goes to infinity, and
   * teaching only the limit hides where the number comes from. Each round
   * re-lends (1 - R) of what the last one deposited, so the series is
   * geometric and its partial sum is this.
   *
   * It is also the arithmetic of Sal Khan's island: 1,000 gold at a 10%
   * reserve ratio, stopped after three rounds, gives 2,710 — the figure the
   * video arrives at by drawing every step by hand.
   *
   * Expects: `initialDeposit`, `reserveRatio`, `rounds`.
   */
  deposits_after_rounds: (inputs) => {
    const deposit = read(inputs, 'initialDeposit');
    const reserveRatio = read(inputs, 'reserveRatio');
    const rounds = Math.max(0, Math.floor(read(inputs, 'rounds')));
    if (reserveRatio <= 0) return 0;
    return (deposit * (1 - (1 - reserveRatio) ** rounds)) / reserveRatio;
  },

  /**
   * How much of the theoretical maximum a finite chain has reached:
   * 1 - (1 - R)^n.
   *
   * The point it exists to make is how fast the tail dies. At a 10% reserve
   * ratio three rounds already reach 27% of the limit and ten rounds reach
   * 65%, so "the multiplier is ten" describes somewhere the system is always
   * heading and never actually arrives.
   *
   * Expects: `reserveRatio`, `rounds`.
   */
  share_of_limit: (inputs) => {
    const reserveRatio = read(inputs, 'reserveRatio');
    const rounds = Math.max(0, Math.floor(read(inputs, 'rounds')));
    if (reserveRatio <= 0) return 0;
    return 1 - (1 - reserveRatio) ** rounds;
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
  // Rates are decimals (0.0225 = 2.25%), matching `format: 'percent'`.
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

  // -------------------------------------------------------------------------
  // Reading a central bank balance sheet
  // -------------------------------------------------------------------------

  /**
   * Reserve balances as the residual of the Fed's balance sheet:
   * reserves = assets − currency − TGA − reverse repos − everything else.
   *
   * This is the identity the H.4.1's own Table 1 is built around, and it is
   * the reason banks cannot choose how many reserves the system holds. The
   * Fed sets the size of the asset side; the Treasury's cash balance, the
   * public's demand for notes and the take-up at the reverse repo facility
   * then decide how much of that is left over as reserves. Reserves are what
   * is left, not what anyone asked for.
   *
   * Expects: `totalAssets`, `currency`, `tga`, `rrp`, `otherLiabilities`.
   */
  fed_reserve_balances: (inputs) =>
    read(inputs, 'totalAssets') -
    read(inputs, 'currency') -
    read(inputs, 'tga') -
    read(inputs, 'rrp') -
    read(inputs, 'otherLiabilities'),

  /**
   * The "factors absorbing reserve balances": every liability that competes
   * with reserves for room on a fixed asset side.
   *
   * Expects: `currency`, `tga`, `rrp`.
   */
  fed_factors_absorbing: (inputs) =>
    read(inputs, 'currency') + read(inputs, 'tga') + read(inputs, 'rrp'),

  /**
   * Reserves as a share of the Fed's total assets.
   *
   * Chained: expects a `reserves` readout computed earlier in the same sim,
   * plus `totalAssets`.
   */
  fed_reserves_share: (inputs) => {
    const total = read(inputs, 'totalAssets');
    if (total <= 0) return 0;
    return read(inputs, 'reserves') / total;
  },

  // -------------------------------------------------------------------------
  // Bonds and the yield curve
  // -------------------------------------------------------------------------

  /**
   * Present value of a plain bond: the coupons plus the principal, each
   * discounted at the yield.
   *
   *   P = C x (1 - (1 + y)^-n) / y  +  F x (1 + y)^-n
   *
   * Annual coupons and annual compounding — the Treasury pays semi-annually
   * and the difference is a few cents on a hundred, which is not what this is
   * teaching. What it is teaching is the sign: the yield is in the
   * denominator, so price and yield can only ever move opposite ways.
   *
   * Expects: `face`, `couponRate`, `yieldRate`, `years` (rates as decimals).
   */
  bond_price: (inputs) => {
    const face = read(inputs, 'face');
    const coupon = face * read(inputs, 'couponRate');
    const y = read(inputs, 'yieldRate');
    const n = read(inputs, 'years');
    if (n <= 0) return face;
    // A zero yield discounts nothing: every cash flow is worth its face value.
    if (y === 0) return coupon * n + face;
    const discount = Math.pow(1 + y, -n);
    return coupon * ((1 - discount) / y) + face * discount;
  },

  /**
   * What the holder gains or loses against par, as a fraction of face.
   *
   * Chained: expects a `price` readout computed earlier, plus `face`.
   */
  bond_price_change: (inputs) => {
    const face = read(inputs, 'face');
    if (face <= 0) return 0;
    return (read(inputs, 'price') - face) / face;
  },

  /**
   * The slope of the curve in percentage points: the long yield minus the
   * short one. Negative is an inversion.
   *
   * Expects: `longYield`, `shortYield` (decimals).
   */
  curve_slope: (inputs) => read(inputs, 'longYield') - read(inputs, 'shortYield'),

  // -------------------------------------------------------------------------
  // Public debt dynamics
  // -------------------------------------------------------------------------

  /**
   * The debt ratio after `years`, rolled forward one year at a time:
   *
   *   d(t+1) = d(t) x (1 + r) / (1 + g)  -  primaryBalance
   *
   * where d is debt as a share of GDP, r the nominal interest rate on the
   * stock, g nominal GDP growth, and the primary balance is the surplus
   * (positive) or deficit (negative) before interest, also as a share of GDP.
   *
   * The whole argument about whether a debt is sustainable is contained in
   * `r - g`. Above zero the stock compounds faster than the economy and the
   * ratio climbs even with the budget balanced; below zero it melts on its own.
   * No opinion required — it is the same arithmetic either way.
   *
   * Expects: `debtRatio`, `interestRate`, `growthRate`, `primaryBalance`,
   * `years`.
   */
  debt_ratio_after: (inputs) => {
    const r = read(inputs, 'interestRate');
    const g = read(inputs, 'growthRate');
    const primary = read(inputs, 'primaryBalance');
    // Bounded so a content bug cannot spin the UI.
    const years = Math.min(Math.max(Math.round(read(inputs, 'years')), 0), 200);
    let debt = read(inputs, 'debtRatio');
    if (g <= -1) return debt;
    for (let year = 0; year < years; year += 1) {
      debt = (debt * (1 + r)) / (1 + g) - primary;
    }
    return debt;
  },

  /**
   * The snowball: how much the ratio moves in a year from interest and growth
   * alone, before anyone decides anything.
   *
   * Expects: `debtRatio`, `interestRate`, `growthRate`.
   */
  debt_snowball: (inputs) => {
    const g = read(inputs, 'growthRate');
    if (g <= -1) return 0;
    return (read(inputs, 'debtRatio') * (read(inputs, 'interestRate') - g)) / (1 + g);
  },

  // -------------------------------------------------------------------------
  // Speculating against a peg
  // -------------------------------------------------------------------------

  /**
   * Profit on a short currency position, as an amount of the notional.
   *
   *   profit = position x (entryRate - exitRate) / entryRate
   *
   * You borrowed the currency, sold it at `entryRate`, and buy it back at
   * `exitRate`. Rates are quoted as foreign units per unit of the currency
   * being shorted, so a fall in the rate is a gain.
   *
   * Expects: `position`, `entryRate`, `exitRate`.
   */
  fx_short_profit: (inputs) => {
    const entry = read(inputs, 'entryRate');
    if (entry <= 0) return 0;
    return (read(inputs, 'position') * (entry - read(inputs, 'exitRate'))) / entry;
  },

  /**
   * What holding the position costs while you wait.
   *
   * A short is a borrowing: you pay the interest rate of the currency you sold
   * and earn the rate of the one you hold. Defending a peg means raising the
   * first, which is the only weapon the authorities have against a speculator's
   * patience — and it is why the cost is worth putting beside the payoff.
   *
   * Expects: `position`, `domesticRate`, `foreignRate`, `months`.
   */
  fx_carry_cost: (inputs) =>
    read(inputs, 'position') *
    (read(inputs, 'domesticRate') - read(inputs, 'foreignRate')) *
    (read(inputs, 'months') / 12),

  /**
   * The asymmetry, as a plain multiple: what the bet pays against what it costs
   * to place. This single number is the whole reason a peg attracts an attack.
   *
   * Chained: expects `profit` and `carry` readouts computed earlier.
   */
  payoff_to_carry: (inputs) => {
    const carry = read(inputs, 'carry');
    if (carry <= 0) return 0;
    return read(inputs, 'profit') / carry;
  },

  // -------------------------------------------------------------------------
  // Living with a fixed exchange rate
  // -------------------------------------------------------------------------

  /**
   * Cumulative real appreciation under a fixed nominal peg.
   *
   *   drift = (1 + domestic)^n / (1 + anchor)^n - 1
   *
   * If your prices rise faster than the anchor's and the nominal rate cannot
   * move, the whole difference accumulates in the real exchange rate: your
   * exports get dearer abroad every year and nothing corrects it. This is the
   * slow, invisible cost of a peg, and it is why pegs that survive for decades
   * still end in one large devaluation rather than many small ones.
   *
   * Expects: `domesticInflation`, `anchorInflation`, `years`.
   */
  real_exchange_rate_drift: (inputs) => {
    const domestic = read(inputs, 'domesticInflation');
    const anchor = read(inputs, 'anchorInflation');
    const years = read(inputs, 'years');
    if (anchor <= -1 || domestic <= -1) return 0;
    return Math.pow(1 + domestic, years) / Math.pow(1 + anchor, years) - 1;
  },

  // -------------------------------------------------------------------------
  // Real assets against nominal claims
  // -------------------------------------------------------------------------

  /**
   * What holding cash returns in real terms: nothing nominal, minus inflation.
   *
   * Independent of the amount, which is the point — the loss is a rate, and it
   * applies to every euro held for the period regardless of who holds it.
   *
   * Expects: `inflation`, `years`.
   */
  cash_real_return: (inputs) => {
    const inflation = read(inputs, 'inflation');
    if (inflation <= -1) return 0;
    return 1 / Math.pow(1 + inflation, read(inputs, 'years')) - 1;
  },

  /**
   * Real return on the equity in a leveraged property purchase.
   *
   *   equity(0) = value x deposit
   *   debt      = value x (1 - deposit)          — fixed in nominal terms
   *   equity(n) = value x (1 + growth)^n - debt
   *
   * Deliberately interest-only: it ignores mortgage payments, maintenance,
   * transaction taxes and rent forgone or earned. That overstates the return,
   * and it isolates the thing being taught — that the debt does not grow with
   * the asset, so the whole appreciation lands on the deposit.
   *
   * Expects: `propertyValue`, `depositShare`, `houseGrowth`, `inflation`,
   * `years`.
   */
  leveraged_equity_real_return: (inputs) => {
    const value = read(inputs, 'propertyValue');
    const deposit = read(inputs, 'depositShare');
    const inflation = read(inputs, 'inflation');
    const years = read(inputs, 'years');
    const equity = value * deposit;
    if (equity <= 0 || inflation <= -1) return 0;
    const debt = value * (1 - deposit);
    const grown = value * Math.pow(1 + read(inputs, 'houseGrowth'), years);
    return (grown - debt) / equity / Math.pow(1 + inflation, years) - 1;
  },

  /**
   * The same position before inflation: how many times the deposit came back.
   *
   * Expects: `propertyValue`, `depositShare`, `houseGrowth`, `years`.
   */
  leveraged_equity_multiple: (inputs) => {
    const value = read(inputs, 'propertyValue');
    const deposit = read(inputs, 'depositShare');
    const equity = value * deposit;
    if (equity <= 0) return 0;
    const debt = value * (1 - deposit);
    return (value * Math.pow(1 + read(inputs, 'houseGrowth'), read(inputs, 'years')) - debt) / equity;
  },

  // -------------------------------------------------------------------------
  // Floating-rate mortgages
  // -------------------------------------------------------------------------

  /**
   * A floating rate plus its contract spread — the rate actually charged.
   *
   * Trivial arithmetic, and it earns its place as a readout: seeing the index
   * and the margin resolve into one number is most of the point of the reset
   * lesson.
   *
   * Expects: `euribor`, `spread`.
   */
  rate_plus_spread: (inputs) => read(inputs, 'euribor') + read(inputs, 'spread'),

  /**
   * The level monthly payment on an annuity mortgage.
   *
   *   m = P x i / (1 - (1 + i)^-n),  i = annualRate / 12,  n = years x 12
   *
   * At a zero rate it degenerates to the principal spread evenly, which is
   * what a euro area borrower on Euribor plus a thin spread was close to
   * paying in 2021.
   *
   * Expects: `principal`, `annualRate`, `years`.
   */
  mortgage_monthly_payment: (inputs) => {
    const principal = read(inputs, 'principal');
    const months = read(inputs, 'years') * 12;
    const rate = read(inputs, 'annualRate') / 12;
    if (months <= 0) return 0;
    if (rate <= 0) return principal / months;
    return (principal * rate) / (1 - Math.pow(1 + rate, -months));
  },

  /**
   * How much bigger the payment is than at some reference rate, as a fraction.
   *
   * Chained: expects a `payment` readout computed earlier, plus `principal`,
   * `baseRate` and `years`.
   */
  mortgage_payment_increase: (inputs) => {
    const principal = read(inputs, 'principal');
    const months = read(inputs, 'years') * 12;
    const base = read(inputs, 'baseRate') / 12;
    if (months <= 0 || principal <= 0) return 0;
    const basePayment =
      base <= 0 ? principal / months : (principal * base) / (1 - Math.pow(1 + base, -months));
    if (basePayment <= 0) return 0;
    return read(inputs, 'payment') / basePayment - 1;
  },

  // -------------------------------------------------------------------------
  // Buying property in Portugal
  // -------------------------------------------------------------------------

  /**
   * IMT on a permanent primary residence, Continente, 2026 table.
   *
   * Progressive with a deduction per bracket, then two flat bands at the top.
   * Figures from Ofício Circulado n.º 40129/2026; the table reproduces the
   * Tax Authority's own worked example exactly (€150,000 -> €1,008.98).
   *
   * Expects: `price`.
   */
  pt_imt_own_home: (inputs) => {
    const price = read(inputs, 'price');
    if (price <= 106346) return 0;
    if (price <= 145470) return price * 0.02 - 2126.92;
    if (price <= 198347) return price * 0.05 - 6491.02;
    if (price <= 330539) return price * 0.07 - 10457.96;
    if (price <= 660982) return price * 0.08 - 13763.35;
    if (price <= 1150853) return price * 0.06;
    return price * 0.075;
  },

  /**
   * Everything payable to complete a purchase: IMT, stamp duty at 0.8% of the
   * price, and the notary and registry bill.
   *
   * Chained: expects an `imt` readout computed earlier, plus `price` and
   * `deedCosts`.
   */
  pt_purchase_costs: (inputs) =>
    read(inputs, 'imt') + read(inputs, 'price') * 0.008 + read(inputs, 'deedCosts'),

  /**
   * Where the position stands after `years`, in euro.
   *
   *   sale proceeds net of selling costs
   *   - the price paid
   *   - the costs of buying
   *   - the annual carry, times the years
   *
   * Ignores the mortgage entirely: interest is the price of not paying cash,
   * and its correct comparator is the rent not paid rather than the
   * appreciation. Keeping it out isolates the question actually being asked.
   *
   * Expects: `price`, `growth`, `years`, `purchaseCosts`, `sellingRate`,
   * `carryAnnual`.
   */
  pt_net_position: (inputs) => {
    const price = read(inputs, 'price');
    const years = read(inputs, 'years');
    const sale = price * Math.pow(1 + read(inputs, 'growth'), years);
    return (
      sale * (1 - read(inputs, 'sellingRate')) -
      price -
      read(inputs, 'purchaseCosts') -
      read(inputs, 'carryAnnual') * years
    );
  },

  /**
   * The first whole year at which the position turns positive, or 0 if it
   * never does inside forty years — which is the answer whenever appreciation
   * runs below the annual carry.
   *
   * Same inputs as `pt_net_position`, except it searches over `years`.
   */
  pt_breakeven_years: (inputs) => {
    const price = read(inputs, 'price');
    const growth = read(inputs, 'growth');
    const purchase = read(inputs, 'purchaseCosts');
    const selling = read(inputs, 'sellingRate');
    const carry = read(inputs, 'carryAnnual');
    for (let year = 1; year <= 40; year += 1) {
      const sale = price * Math.pow(1 + growth, year);
      if (sale * (1 - selling) - price - purchase - carry * year > 0) return year;
    }
    return 0;
  },

  // -------------------------------------------------------------------------
  // Renting against buying
  // -------------------------------------------------------------------------

  /** Monthly payment on the loan implied by a price and a deposit share. */
  home_loan_payment: (inputs) => {
    const loan = read(inputs, 'price') * (1 - read(inputs, 'depositShare'));
    const months = read(inputs, 'loanTerm') * 12;
    const rate = read(inputs, 'loanRate') / 12;
    if (months <= 0) return 0;
    if (rate <= 0) return loan / months;
    return (loan * rate) / (1 - Math.pow(1 + rate, -months));
  },

  /**
   * Where owning stands against renting after `holdYears`, in euro.
   *
   * Cash in at exit is the sale net of selling costs, less whatever is still
   * owed. Cash out is the deposit, the purchase costs, the carry, and every
   * mortgage payment made — less the rent that was not paid, which is the
   * whole reason this is a different question from whether the asset covers
   * its own costs.
   *
   * Expects: `price`, `depositShare`, `loanRate`, `loanTerm`, `holdYears`,
   * `entryCosts`, `carryAnnual`, `sellingRate`, `growth`, `monthlyRent`.
   */
  rent_vs_buy_net: (inputs) => {
    const price = read(inputs, 'price');
    const deposit = price * read(inputs, 'depositShare');
    const loan = price - deposit;
    const term = read(inputs, 'loanTerm') * 12;
    const rate = read(inputs, 'loanRate') / 12;
    const years = Math.min(Math.max(Math.round(read(inputs, 'holdYears')), 0), 40);
    if (term <= 0) return 0;
    const payment =
      rate <= 0 ? loan / term : (loan * rate) / (1 - Math.pow(1 + rate, -term));

    let balance = loan;
    for (let month = 0; month < years * 12 && month < term; month += 1) {
      balance -= payment - balance * rate;
    }
    const sale = price * Math.pow(1 + read(inputs, 'growth'), years);
    const cashIn = sale * (1 - read(inputs, 'sellingRate')) - balance;
    const cashOut =
      deposit +
      read(inputs, 'entryCosts') +
      read(inputs, 'carryAnnual') * years +
      payment * 12 * years -
      read(inputs, 'monthlyRent') * 12 * years;
    return cashIn - cashOut;
  },

  /**
   * The first whole year at which owning is ahead of renting, or 0 if it never
   * happens inside forty years.
   *
   * Same inputs as `rent_vs_buy_net`, searching over the holding period.
   */
  rent_vs_buy_breakeven: (inputs) => {
    const price = read(inputs, 'price');
    const deposit = price * read(inputs, 'depositShare');
    const loan = price - deposit;
    const term = read(inputs, 'loanTerm') * 12;
    const rate = read(inputs, 'loanRate') / 12;
    const growth = read(inputs, 'growth');
    const selling = read(inputs, 'sellingRate');
    const entry = read(inputs, 'entryCosts');
    const carry = read(inputs, 'carryAnnual');
    const rent = read(inputs, 'monthlyRent');
    if (term <= 0) return 0;
    const payment =
      rate <= 0 ? loan / term : (loan * rate) / (1 - Math.pow(1 + rate, -term));

    let balance = loan;
    for (let year = 1; year <= 40; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        if ((year - 1) * 12 + month < term) balance -= payment - balance * rate;
      }
      const sale = price * Math.pow(1 + growth, year);
      const net =
        sale * (1 - selling) -
        balance -
        (deposit + entry + carry * year + payment * 12 * year - rent * 12 * year);
      if (net > 0) return year;
    }
    return 0;
  },

  // -------------------------------------------------------------------------
  // Property bought as an investment
  // -------------------------------------------------------------------------

  /**
   * IMT on a property that is not a permanent primary residence — the 2026
   * Table III schedule, which starts charging at the first euro rather than
   * at €106,346.
   *
   * Expects: `price`.
   */
  pt_imt_investment: (inputs) => {
    const price = read(inputs, 'price');
    if (price <= 106346) return price * 0.01;
    if (price <= 145470) return price * 0.02 - 1063.46;
    if (price <= 198347) return price * 0.05 - 5427.56;
    if (price <= 330539) return price * 0.07 - 9394.5;
    if (price <= 633931) return price * 0.08 - 12699.89;
    if (price <= 1150853) return price * 0.06;
    return price * 0.075;
  },

  /**
   * Net euro position on a property held purely as an investment.
   *
   * No rent is credited for living in it, because you do not. Rent received is
   * credited net of the Category F rate. Capital gains tax is charged on half
   * the gain at the marginal IRS rate, with the acquisition value uplifted by
   * an inflation coefficient and the purchase and selling costs deductible —
   * which is the actual Portuguese computation, and materially kinder than
   * taxing the raw price difference.
   *
   * Expects: `price`, `ltv`, `loanRate`, `loanTerm`, `years`, `entryCosts`,
   * `carryAnnual`, `sellingRate`, `growth`, `grossYield`, `rentTax`,
   * `cgtMarginal`, `inflCoefficient`.
   */
  buy_to_let_net: (inputs) => {
    const price = read(inputs, 'price');
    const loan = price * read(inputs, 'ltv');
    const equity = price - loan;
    const term = read(inputs, 'loanTerm') * 12;
    const rate = read(inputs, 'loanRate') / 12;
    const years = Math.min(Math.max(Math.round(read(inputs, 'years')), 0), 40);
    const entry = read(inputs, 'entryCosts');
    const selling = read(inputs, 'sellingRate');

    let payment = 0;
    let balance = loan;
    if (loan > 0 && term > 0) {
      payment = rate <= 0 ? loan / term : (loan * rate) / (1 - Math.pow(1 + rate, -term));
      for (let month = 0; month < years * 12 && month < term; month += 1) {
        balance -= payment - balance * rate;
      }
    }

    const sale = price * Math.pow(1 + read(inputs, 'growth'), years);
    const basis =
      price * Math.pow(1 + read(inputs, 'inflCoefficient'), years) + entry + sale * selling;
    const gain = sale - basis;
    const cgt = gain > 0 ? gain * 0.5 * read(inputs, 'cgtMarginal') : 0;

    const rentNet = price * read(inputs, 'grossYield') * (1 - read(inputs, 'rentTax'));
    const cashIn = sale * (1 - selling) - balance - cgt;
    const cashOut =
      equity + entry + read(inputs, 'carryAnnual') * years + payment * 12 * years - rentNet * years;
    return cashIn - cashOut;
  },

  /**
   * The same position as a return on the cash actually committed.
   *
   * Chained: expects a `net` readout computed earlier, plus `price` and `ltv`.
   * This is the number leverage is supposed to move, and the one that shows it
   * moving the wrong way when nothing is servicing the debt.
   */
  buy_to_let_return_on_equity: (inputs) => {
    const equity = read(inputs, 'price') * (1 - read(inputs, 'ltv'));
    if (equity <= 0) return 0;
    return read(inputs, 'net') / equity;
  },

  /**
   * Cost of trading against an automated market-maker, in basis points, as a
   * function of trade size relative to the depth of the liquidity pool.
   *
   * Project Mariana calibrated a hybrid-function market-maker for three
   * wholesale CBDCs and then simulated the resulting trading costs. The
   * published anchor: a €50 million EUR/CHF trade costs roughly one basis
   * point against a pool of about €1.8 billion (BIS, Project Mariana final
   * report, September 2023, Graph 4). The report also states that holding the
   * cost steady while doubling the trade size requires roughly doubling the
   * pool — that is, cost is approximately proportional to trade ÷ pool.
   *
   * So: cost_bp = 36 x (trade / pool), where 36 = 1,800 / 50 is the pool-to-
   * trade ratio the report puts at one basis point. This is a straight-line
   * reading of a convex bonding curve. It is faithful in the region the report
   * plots and increasingly wrong outside it, which is why the sliders that use
   * it stay inside that region.
   *
   * Expects: `tradeSize`, `poolSize`, in the same currency units.
   */
  amm_trading_cost_bp: (inputs) => {
    const pool = read(inputs, 'poolSize');
    if (pool <= 0) return 0;
    return 36 * (read(inputs, 'tradeSize') / pool);
  },

  /**
   * The same cost as money, so a basis point stops being an abstraction.
   *
   * Chained: expects a `costBp` readout computed earlier, plus `tradeSize`.
   */
  amm_trading_cost_amount: (inputs) =>
    read(inputs, 'tradeSize') * (read(inputs, 'costBp') / 10_000),

  /**
   * How many times the trade the pool has to hold — the ratio that actually
   * sets the price impact, stated the way a treasurer would think about it.
   *
   * Expects: `poolSize`, `tradeSize`.
   */
  amm_pool_to_trade: (inputs) => {
    const trade = read(inputs, 'tradeSize');
    if (trade <= 0) return 0;
    return read(inputs, 'poolSize') / trade;
  },

  /**
   * GDP from an outlay: the outlay, whatever it bought.
   *
   * Deliberately a pass-through, because that is the lesson. Expenditure-side
   * GDP records what was spent on newly produced final output in the period;
   * it does not ask whether the thing bought will still exist next year. A
   * hospital and a stock of munitions enter the same number at the same size,
   * and the sim exists so a learner can watch that happen while the split
   * moves underneath.
   *
   * Expects: `outlay`.
   */
  gdp_from_outlay: (inputs) => read(inputs, 'outlay'),

  /**
   * The part of an outlay that is still there next year.
   *
   * Expects: `outlay`, `capitalShare` as a decimal fraction.
   */
  capital_formed: (inputs) => read(inputs, 'outlay') * read(inputs, 'capitalShare'),

  /**
   * What the capital formed yields each year once it is working.
   *
   * A deliberately crude constant return: a road or a hospital raises what the
   * economy can produce, and the point here is the sign and the order of
   * magnitude rather than a growth model anybody should forecast with.
   *
   * Expects: `outlay`, `capitalShare`, `returnOnCapital` as a decimal fraction.
   */
  capital_yield: (inputs) =>
    read(inputs, 'outlay') * read(inputs, 'capitalShare') * read(inputs, 'returnOnCapital'),

  /**
   * Ten years of that yield, undiscounted.
   *
   * Undiscounted on purpose: discounting would be more correct and would put a
   * second unfamiliar idea in front of the one being taught.
   *
   * Expects: `outlay`, `capitalShare`, `returnOnCapital`.
   */
  capital_yield_decade: (inputs) =>
    read(inputs, 'outlay') * read(inputs, 'capitalShare') * read(inputs, 'returnOnCapital') * 10,


  /**
   * What the cost share predicts you will lose: share × shortfall.
   *
   * The intuitive answer, and the wrong one. If energy is 5% of costs, a 20%
   * energy shortfall "should" cost 1% of output — which is how a shock in a
   * small sector gets waved away, and is not what happens.
   *
   * Expects: `inputShare`, `shortfall`, both decimal fractions.
   */
  cost_share_estimate: (inputs) => read(inputs, 'inputShare') * read(inputs, 'shortfall'),

  /**
   * What fixed proportions actually cost you: the shortfall itself, less
   * whatever can be substituted away within the horizon.
   *
   * A car needs its chip, a smelter needs its power, and a bakery needs its
   * flour. Where inputs combine in fixed proportions, output is set by the
   * scarcest one and the cost share tells you nothing about the loss — a
   * missing €4 part idles a €30,000 vehicle. Leontief's insight and the
   * reason criticality is not size.
   *
   * `substitutability` is what the horizon allows: near zero in a month, far
   * higher over a decade, which is the whole difference between 1974 and
   * 1985.
   *
   * Expects: `shortfall`, `substitutability`, both decimal fractions.
   */
  output_lost_to_shortfall: (inputs) =>
    read(inputs, 'shortfall') * (1 - read(inputs, 'substitutability')),

  /**
   * How many times worse than the cost-share guess, as a multiplier.
   *
   * Expects: `inputShare`, `shortfall`, `substitutability`.
   */
  criticality_ratio: (inputs) => {
    const share = read(inputs, 'inputShare');
    const shortfall = read(inputs, 'shortfall');
    if (share <= 0 || shortfall <= 0) return 0;
    return (shortfall * (1 - read(inputs, 'substitutability'))) / (share * shortfall);
  },


  // -------------------------------------------------------------------------
  // Setting the policy rate
  // -------------------------------------------------------------------------

  /**
   * The Taylor rule: i = r* + π + a(π − π*) + b(gap).
   *
   * Taylor's 1993 coefficients were 0.5 and 0.5, fitted to what the Fed had
   * actually done, and the paper presented it as a description rather than an
   * instruction. It survives because of one property: the coefficient on
   * inflation exceeds one once you add the π term, so a point of extra
   * inflation raises the *real* rate rather than lowering it. A rule that
   * fails that test is one under which inflation feeds itself.
   *
   * Expects: `neutralReal` (r*), `inflation`, `target`, `outputGap`,
   * `inflationWeight`, `gapWeight` — all decimal fractions.
   */
  taylor_rate: (inputs) =>
    read(inputs, 'neutralReal') +
    read(inputs, 'inflation') +
    read(inputs, 'inflationWeight') * (read(inputs, 'inflation') - read(inputs, 'target')) +
    read(inputs, 'gapWeight') * read(inputs, 'outputGap'),

  /**
   * The stance: how far the prescribed real rate sits above neutral.
   *
   * Positive is restrictive, negative is accommodative, and the sign is the
   * only part anybody should trust — r* is unobservable and estimates of it
   * move by a point when the model changes.
   *
   * Expects: the same inputs as `taylor_rate`.
   */
  policy_stance: (inputs) =>
    read(inputs, 'inflationWeight') * (read(inputs, 'inflation') - read(inputs, 'target')) +
    read(inputs, 'gapWeight') * read(inputs, 'outputGap'),

  /**
   * What the rule prescribes once the floor at zero is applied.
   *
   * The gap between this and `taylor_rate` is the part of the prescription
   * that cannot be delivered with the rate alone, and is the reason asset
   * purchases were invented.
   *
   * Expects: the same inputs as `taylor_rate`.
   */
  taylor_rate_floored: (inputs) => {
    const prescribed =
      read(inputs, 'neutralReal') +
      read(inputs, 'inflation') +
      read(inputs, 'inflationWeight') * (read(inputs, 'inflation') - read(inputs, 'target')) +
      read(inputs, 'gapWeight') * read(inputs, 'outputGap');
    return Math.max(0, prescribed);
  },

  /**
   * Credit that lands in new productive capital, as a share of the economy.
   *
   * Expects: `creditGrowth`, `capitalShare` — decimal fractions.
   */
  credit_to_capital: (inputs) => read(inputs, 'creditGrowth') * read(inputs, 'capitalShare'),

  /**
   * Credit that lands on assets that already exist.
   *
   * It buys no new output. It bids up the price of the existing stock, which
   * is why an economy can run a credit boom, report strong growth in lending,
   * and add nothing to what it can produce.
   *
   * Expects: `creditGrowth`, `capitalShare`.
   */
  credit_to_existing_assets: (inputs) =>
    read(inputs, 'creditGrowth') * (1 - read(inputs, 'capitalShare')),

  /**
   * Extra output per year from the productive share, at a flat return.
   *
   * Crude on purpose, in the same way as the GDP module's capital yield: the
   * object is the sign and the order of magnitude, not a growth forecast.
   *
   * Expects: `creditGrowth`, `capitalShare`, `capitalReturn`.
   */
  capacity_from_credit: (inputs) =>
    read(inputs, 'creditGrowth') *
    read(inputs, 'capitalShare') *
    read(inputs, 'capitalReturn'),


  // -------------------------------------------------------------------------
  // Bank capital, liquidity and stress
  // -------------------------------------------------------------------------

  /**
   * Common equity tier 1 after a loss, as a share of risk-weighted assets.
   *
   * Take total assets as 100. Risk-weighted assets are `rwaDensity` × 100, and
   * capital is `cet1Ratio` × RWA. A loss of `lossRate` falls on *assets*, not
   * on the weighted number — so the ratio falls by `lossRate / rwaDensity`.
   *
   * That division is the lesson. A bank stuffed with mortgages carries low
   * risk weights, so it holds fewer euros of capital per euro of asset, and
   * the same percentage loss eats a larger share of its ratio. Density is the
   * amplifier hiding inside every capital ratio.
   *
   * Risk weights are held fixed, which flatters the result: in a real stress
   * they rise as exposures are downgraded, and the ratio falls further.
   *
   * Expects: `cet1Ratio`, `lossRate`, `rwaDensity` — decimal fractions.
   */
  cet1_after_shock: (inputs) => {
    const density = read(inputs, 'rwaDensity');
    if (density <= 0) return 0;
    return read(inputs, 'cet1Ratio') - read(inputs, 'lossRate') / density;
  },

  /**
   * How far the post-shock ratio sits above the 4.5% CET1 minimum.
   *
   * Negative means the bank is below the line and the question stops being
   * supervisory and starts being resolution.
   *
   * Expects: `cet1Ratio`, `lossRate`, `rwaDensity`.
   */
  distance_to_minimum: (inputs) => {
    const density = read(inputs, 'rwaDensity');
    if (density <= 0) return 0;
    return read(inputs, 'cet1Ratio') - read(inputs, 'lossRate') / density - 0.045;
  },

  /**
   * The loss rate on assets that takes the bank to the minimum.
   *
   * The number a supervisor actually wants: not "is it solvent today" but
   * "how far from today does it stop being".
   *
   * Expects: `cet1Ratio`, `rwaDensity`.
   */
  loss_rate_to_breach: (inputs) =>
    (read(inputs, 'cet1Ratio') - 0.045) * read(inputs, 'rwaDensity'),

  // -------------------------------------------------------------------------
  // Collateral
  // -------------------------------------------------------------------------

  /**
   * Cash a borrower raises against collateral, after the haircut.
   *
   * Expects: `collateralValue`, `haircut` — haircut as a decimal fraction.
   */
  collateral_cash_raised: (inputs) =>
    read(inputs, 'collateralValue') * (1 - read(inputs, 'haircut')),

  /**
   * How much collateral must be pledged to raise a given amount of cash.
   *
   * The direction that matters in a crisis: a bank does not ask what its
   * bonds are worth, it asks how many it must hand over to survive Friday.
   *
   * Expects: `cashNeeded`, `haircut`.
   */
  collateral_required: (inputs) => {
    const haircut = read(inputs, 'haircut');
    if (haircut >= 1) return Number.POSITIVE_INFINITY;
    return read(inputs, 'cashNeeded') / (1 - haircut);
  },

  /**
   * Cash still raisable after the collateral is marked down *and* the haircut
   * is widened — the two things that happen together in a crisis.
   *
   * Expects: `collateralValue`, `priceFall`, `haircut`.
   */
  collateral_after_stress: (inputs) =>
    read(inputs, 'collateralValue') *
    (1 - read(inputs, 'priceFall')) *
    (1 - read(inputs, 'haircut')),


  // -------------------------------------------------------------------------
  // Real-time data
  // -------------------------------------------------------------------------

  /**
   * The Taylor prescription computed on the output gap as later revised.
   *
   * Same rule as `taylor_rate`, reading `revisedGap` instead of `outputGap`,
   * so a sim can put the two side by side. Orphanides' point in one pair of
   * readouts: the rule did not fail in the 1970s, the gap estimate did.
   *
   * Expects: `neutralReal`, `inflation`, `target`, `revisedGap`,
   * `inflationWeight`, `gapWeight`.
   */
  taylor_rate_revised: (inputs) =>
    read(inputs, 'neutralReal') +
    read(inputs, 'inflation') +
    read(inputs, 'inflationWeight') * (read(inputs, 'inflation') - read(inputs, 'target')) +
    read(inputs, 'gapWeight') * read(inputs, 'revisedGap'),

  /**
   * How far the real-time prescription sat from the one the revised data
   * would have given. Negative means policy was set looser than it should
   * have been.
   *
   * Expects: `outputGap`, `revisedGap`, `gapWeight`.
   */
  real_time_policy_error: (inputs) =>
    read(inputs, 'gapWeight') * (read(inputs, 'outputGap') - read(inputs, 'revisedGap')),


  // -------------------------------------------------------------------------
  // Reserves and intervention
  // -------------------------------------------------------------------------

  /**
   * Months of imports the reserves would cover.
   *
   * The oldest adequacy metric and the crudest. Three months was the rule of
   * thumb when the risk was a trade shock and capital did not move; it says
   * nothing about a country whose danger is an investor leaving.
   *
   * Expects: `reserves`, `monthlyImports`.
   */
  reserve_import_cover: (inputs) => {
    const imports = read(inputs, 'monthlyImports');
    if (imports <= 0) return 0;
    return read(inputs, 'reserves') / imports;
  },

  /**
   * Reserves as a multiple of external debt falling due within the year.
   *
   * Guidotti and Greenspan's rule: a country should be able to live for a
   * year without borrowing abroad. A ratio below one means a refusal to roll
   * over is a crisis rather than an inconvenience.
   *
   * Expects: `reserves`, `shortTermDebt`.
   */
  reserve_debt_cover: (inputs) => {
    const debt = read(inputs, 'shortTermDebt');
    if (debt <= 0) return 0;
    return read(inputs, 'reserves') / debt;
  },

  /**
   * How many days of selling at the current rate the reserves survive.
   *
   * Expects: `reserves`, `dailyDrain`.
   */
  days_of_defence: (inputs) => {
    const drain = read(inputs, 'dailyDrain');
    if (drain <= 0) return Number.POSITIVE_INFINITY;
    return read(inputs, 'reserves') / drain;
  },

  /**
   * The annual carrying cost of sterilised intervention.
   *
   * Buying foreign currency creates domestic money; sterilising it means
   * selling domestic paper to take that money back. The central bank then
   * earns the foreign rate on the reserves and pays the domestic rate on the
   * paper — so a country with high domestic rates pays for its own reserves
   * every year, which is why large reserve stocks are not free.
   *
   * Expects: `reserves`, `domesticRate`, `foreignRate`.
   */
  sterilisation_cost: (inputs) =>
    read(inputs, 'reserves') * (read(inputs, 'domesticRate') - read(inputs, 'foreignRate')),

  // -------------------------------------------------------------------------
  // Foreign-currency debt
  // -------------------------------------------------------------------------

  /**
   * Debt-to-GDP after a depreciation, when part of the debt is in foreign
   * currency.
   *
   * The domestic-currency value of the foreign slice rises by the full
   * depreciation while GDP does not, so the ratio jumps without anybody
   * borrowing anything. This is why a devaluation that helps an exporter can
   * bankrupt the state that hoped it would.
   *
   * Expects: `debtRatio`, `fxShare`, `depreciation` — decimal fractions.
   */
  debt_ratio_after_depreciation: (inputs) => {
    const ratio = read(inputs, 'debtRatio');
    const fxShare = read(inputs, 'fxShare');
    const depreciation = read(inputs, 'depreciation');
    if (depreciation <= -1) return ratio;
    return ratio * (1 - fxShare) + (ratio * fxShare) / (1 - depreciation);
  },

  /**
   * How much of the jump was the currency rather than any new borrowing.
   *
   * Expects: `debtRatio`, `fxShare`, `depreciation`.
   */
  depreciation_debt_jump: (inputs) => {
    const ratio = read(inputs, 'debtRatio');
    const fxShare = read(inputs, 'fxShare');
    const depreciation = read(inputs, 'depreciation');
    if (depreciation <= -1) return 0;
    return (ratio * fxShare) / (1 - depreciation) - ratio * fxShare;
  },

  // -------------------------------------------------------------------------
  // Settlement
  // -------------------------------------------------------------------------

  /**
   * Liquidity saved by netting: the share of gross payments that never has to
   * be funded because it offsets.
   *
   * Expects: `grossPayments`, `netObligations`.
   */
  netting_efficiency: (inputs) => {
    const gross = read(inputs, 'grossPayments');
    if (gross <= 0) return 0;
    // Net obligations cannot exceed gross flow; a learner dragging the sliders
    // into that corner should see zero saving, not a negative percentage.
    const net = Math.min(read(inputs, 'netObligations'), gross);
    return (gross - net) / gross;
  },

  /**
   * Cash a bank must find to settle gross, given how much of its outgoing
   * payments are matched by incoming ones it can recycle.
   *
   * Expects: `grossPayments`, `offsetRate` — the share that can be recycled.
   */
  gross_settlement_need: (inputs) =>
    read(inputs, 'grossPayments') * (1 - read(inputs, 'offsetRate')),

  // -------------------------------------------------------------------------
  // Consolidated public sector
  // -------------------------------------------------------------------------

  /**
   * Average maturity of public debt once the central bank's holdings are
   * consolidated away.
   *
   * Asset purchases do not retire debt; they swap a long bond held by the
   * public for overnight reserves held by the public. Consolidating the two
   * balance sheets, the state's effective funding has shortened — which is
   * why a purchase programme and a debt office lengthening issuance can
   * cancel each other out without either being wrong.
   *
   * Reserves are treated as maturing overnight, so they contribute nothing to
   * the weighted average.
   *
   * Expects: `totalDebt`, `avgMaturity` (years), `cbHoldings`,
   * `heldMaturity` (years).
   */
  consolidated_maturity: (inputs) => {
    const total = read(inputs, 'totalDebt');
    if (total <= 0) return 0;
    const held = Math.min(read(inputs, 'cbHoldings'), total);
    const weighted = total * read(inputs, 'avgMaturity') - held * read(inputs, 'heldMaturity');
    return Math.max(weighted / total, 0);
  },

  /**
   * Years of average maturity the purchase programme took out of the market.
   *
   * Expects: `totalDebt`, `cbHoldings`, `heldMaturity`.
   */
  duration_removed: (inputs) => {
    const total = read(inputs, 'totalDebt');
    if (total <= 0) return 0;
    const held = Math.min(read(inputs, 'cbHoldings'), total);
    return (held * read(inputs, 'heldMaturity')) / total;
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
