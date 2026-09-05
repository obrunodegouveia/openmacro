/**
 * Value formatting shared by the simulation widget and the lesson UI.
 *
 * Deliberately dependency-free (no `Intl`) so output is byte-identical across
 * Hermes, JSC and web, which keeps snapshot tests meaningful.
 */

import type { ValueFormat } from './content/schema';

/** `1000` -> `"$1,000"`, `1234.5` -> `"$1,234.50"`. */
export function formatCurrency(value: number, currency = '$'): string {
  const rounded = Math.round(value * 100) / 100;
  const hasCents = !Number.isInteger(rounded);
  const [whole = '0', cents] = Math.abs(rounded).toFixed(hasCents ? 2 : 0).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = rounded < 0 ? '-' : '';
  return `${sign}${currency}${grouped}${cents ? `.${cents}` : ''}`;
}

/** `0.1` -> `"10%"`. Trailing zeros are dropped when the result is round. */
export function formatPercent(value: number, fractionDigits = 0): string {
  const rounded = Number((value * 100).toFixed(fractionDigits));
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(fractionDigits)}%`;
}

/** `10` -> `"10x"`, `6.6666` -> `"6.7x"`. */
export function formatMultiplier(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}x`;
}

export function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/**
 * Dispatches on the `ValueFormat` declared in the lesson content.
 *
 * Money switches to compact suffixes once it passes a million. A sim about a
 * $1,000 deposit wants "$10,000" spelled out, and a sim about the Fed's
 * balance sheet emphatically does not want "$2,681,391,000,000" — which does
 * not fit the hero readout on a phone at any font size worth reading.
 */
export function formatValue(value: number, format: ValueFormat): string {
  switch (format) {
    case 'currency':
      return Math.abs(value) >= 1e6 ? formatCompactCurrency(value) : formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'multiplier':
      return formatMultiplier(value);
    case 'number':
      return formatNumber(value);
  }
}

/**
 * Deterministic shuffle.
 *
 * Cards must not appear in authored order, but `Math.random` would re-shuffle
 * on every re-render and make the UI jump. Seeding on the challenge id keeps
 * the order stable for the life of a challenge while looking arbitrary.
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const random = () => {
    hash += 0x6d2b79f5;
    let t = hash;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i] as T;
    const b = result[j] as T;
    result[i] = b;
    result[j] = a;
  }
  return result;
}

/**
 * Snaps a raw slider value onto its declared grid and strips floating-point
 * drift.
 *
 * Stepped sliders emit values like `0.30000000000000004`, which would never
 * equal the `0.3` an objective asks for. Rounding to the grid and then to six
 * decimals makes exact comparison safe.
 */
export function snapToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  return Number((min + steps * step).toFixed(6));
}

/** Currency symbols for the codes lessons actually use. */
const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  JPY: '\u00A5',
  CHF: 'CHF\u00A0',
};

/**
 * Balance-sheet scale money: `5.2e12` -> `"$5.2T"`, `-5e8` -> `"-$500M"`.
 *
 * Central bank balance sheets run to trillions while the operation posted
 * against them is millions, so a T-account has to show both without the big
 * number swamping the column. Grouped digits would wrap on a phone; compact
 * suffixes keep every line one glance wide.
 */
export function formatCompactCurrency(value: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency}\u00A0`;
  const sign = value < 0 ? '-' : '';
  const magnitude = Math.abs(value);

  const units: readonly [number, string][] = [
    [1e12, 'T'],
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ];

  for (const [scale, suffix] of units) {
    if (magnitude >= scale) {
      const scaled = magnitude / scale;
      // One decimal below 100 keeps "5.2T" readable; above it the decimal is
      // noise ("420B", not "420.0B").
      const text = scaled >= 100 ? String(Math.round(scaled)) : String(Math.round(scaled * 10) / 10);
      return `${sign}${symbol}${text}${suffix}`;
    }
  }

  return `${sign}${symbol}${Math.round(magnitude * 100) / 100}`;
}

/** Same, but always carrying an explicit + or - for a delta. */
export function formatSignedCompactCurrency(value: number, currency = 'USD'): string {
  const formatted = formatCompactCurrency(value, currency);
  return value > 0 ? `+${formatted}` : formatted;
}
