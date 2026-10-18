/**
 * Value formatting shared by the simulation widget and the lesson UI.
 *
 * Deliberately dependency-free (no `Intl`) so output is byte-identical across
 * Hermes, JSC and web, which keeps snapshot tests meaningful.
 *
 * ---------------------------------------------------------------------------
 * WHY THE SEPARATORS ARE A PARAMETER
 * ---------------------------------------------------------------------------
 *
 * `1,000` is not a cosmetic difference in Portuguese — it reads as one. A
 * learner driving a reserve-ratio slider in a fully translated lesson was
 * being shown the deposit total in US notation, so the one number the
 * exercise exists to teach was the one thing still in English, and wrong by
 * three orders of magnitude to anybody reading it as written.
 *
 * Passing a locale rather than reaching for `Intl.NumberFormat` keeps the
 * promise at the top of this file: Hermes ships a partial `Intl` and its
 * grouping has differed from V8's, which would make the same lesson render
 * differently on a phone and in a browser.
 */

import type { ValueFormat } from './content/schema';

/**
 * How a locale writes a number. Anything not listed falls back to English,
 * which is also what an unlocalised caller gets.
 */
const SEPARATORS: Readonly<Record<string, { group: string; decimal: string }>> = {
  en: { group: ',', decimal: '.' },
  // European Portuguese groups with a non-breaking space and separates the
  // decimal with a comma — `1 234,50`. The space is non-breaking on purpose:
  // a readout must never wrap between a thousand and its hundreds.
  'pt-PT': { group: '\u00A0', decimal: ',' },
};

function separators(locale: string): { group: string; decimal: string } {
  return SEPARATORS[locale] ?? SEPARATORS.en!;
}

/**
 * Compact magnitude suffixes, which are not the same symbols everywhere.
 *
 * English "billion" is 10^9 and Portuguese *bilião* is 10^12, so `€100B`
 * rendered for a Portuguese reader says a thousand times what it means. The
 * long scale needs *mil milhões* for 10^9, which is why this cannot be a
 * shared table with a locale-specific separator bolted on — the letters
 * themselves move.
 *
 * Each entry is `[scale, singular, plural]`; the singular is used only when
 * the scaled figure is exactly 1 (`1 bilião`, `2,5 biliões`).
 *
 * WHY pt-PT SPELLS OUT «biliões»
 *
 * It used to be `B`, which is the correct initial for *bilião* and still the
 * wrong choice. A Portuguese reader of financial news meets `B` as the English
 * billion every day (`$5B` in any wire story), so `$5,2 B` next to `$10 mM`
 * on one balance sheet read as 5.2 thousand million — off by a factor of a
 * thousand, on the one figure the sheet exists to show. The alternatives were
 * worse: `bi` is Brazilian shorthand for *bilhão*, which is 10^9 there, and
 * `Bi` is no better known. Spelled out, the word cannot be misread, and at
 * 7 letters it still fits every place this formatter is used: the T-account
 * columns put the amount on its own (web: a non-shrinking span beside a
 * wrapping account name; app: its own line), and the sim readouts wrap.
 * `mM` and `M` stay abbreviated — those have no English look-alike problem.
 */
const MAGNITUDES: Readonly<Record<string, readonly (readonly [number, string, string])[]>> = {
  en: [
    [1e12, 'T', 'T'],
    [1e9, 'B', 'B'],
    [1e6, 'M', 'M'],
    [1e3, 'K', 'K'],
  ],
  'pt-PT': [
    [1e12, '\u00A0bilião', '\u00A0biliões'],
    [1e9, '\u00A0mM', '\u00A0mM'],
    [1e6, '\u00A0M', '\u00A0M'],
    [1e3, '\u00A0mil', '\u00A0mil'],
  ],
};

function magnitudes(locale: string): readonly (readonly [number, string, string])[] {
  return MAGNITUDES[locale] ?? MAGNITUDES.en!;
}

/** `1234.5` -> `"1,234.5"` in English, `"1\u00A0234,5"` in Portuguese. */
function group(whole: string, cents: string | undefined, locale: string): string {
  const { group: g, decimal } = separators(locale);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, g);
  return cents ? `${grouped}${decimal}${cents}` : grouped;
}

/** Currency symbols for the codes lessons actually use. */
const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
  JPY: '\u00A5',
  CHF: 'CHF\u00A0',
};

/** `1000` -> `"$1,000"`, `1234.5` -> `"$1,234.50"`. */
export function formatCurrency(value: number, currency = '$', locale = 'en'): string {
  const rounded = Math.round(value * 100) / 100;
  const hasCents = !Number.isInteger(rounded);
  const [whole = '0', cents] = Math.abs(rounded).toFixed(hasCents ? 2 : 0).split('.');
  const sign = rounded < 0 ? '-' : '';
  return `${sign}${currency}${group(whole, cents, locale)}`;
}

/**
 * `0.1` -> `"10%"`, `0.0425` -> `"4.25%"`.
 *
 * Two decimals, with trailing zeros dropped so a round number still reads
 * round. It used to round to whole per cent, which quietly broke every rate
 * sim: a corridor running from 3% to 4% displayed "3%" for its floor, its
 * target of 3.01% and everything up to 3.49%, so the learner could not see the
 * number they were being asked to move.
 */
export function formatPercent(value: number, fractionDigits = 2, locale = 'en'): string {
  const rounded = Number((value * 100).toFixed(fractionDigits));
  const [whole = '0', cents] = Math.abs(rounded).toString().split('.');
  return `${rounded < 0 ? '-' : ''}${group(whole, cents, locale)}%`;
}

/** `10` -> `"10x"`, `6.6666` -> `"6.7x"`. */
export function formatMultiplier(value: number, locale = 'en'): string {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  const [whole = '0', cents] = text.replace('-', '').split('.');
  return `${rounded < 0 ? '-' : ''}${group(whole, cents, locale)}x`;
}

export function formatNumber(value: number, locale = 'en'): string {
  const rounded = Math.round(value * 100) / 100;
  const [whole = '0', cents] = Math.abs(rounded).toString().split('.');
  return `${rounded < 0 ? '-' : ''}${group(whole, cents, locale)}`;
}

/**
 * Dispatches on the `ValueFormat` declared in the lesson content.
 *
 * Money switches to compact suffixes once it passes a million. A sim about a
 * $1,000 deposit wants "$10,000" spelled out, and a sim about the Fed's
 * balance sheet emphatically does not want "$2,681,391,000,000" — which does
 * not fit the hero readout on a phone at any font size worth reading.
 */
export function formatValue(
  value: number,
  format: ValueFormat,
  currency = 'USD',
  locale = 'en',
): string {
  switch (format) {
    case 'currency':
      return Math.abs(value) >= 1e6
        ? formatCompactCurrency(value, currency, locale)
        : formatCurrency(value, CURRENCY_SYMBOLS[currency] ?? `${currency}\u00A0`, locale);
    case 'percent':
      return formatPercent(value, 2, locale);
    case 'multiplier':
      return formatMultiplier(value, locale);
    case 'number':
      return formatNumber(value, locale);
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


/**
 * Balance-sheet scale money: `5.2e12` -> `"$5.2T"`, `-5e8` -> `"-$500M"`.
 *
 * Central bank balance sheets run to trillions while the operation posted
 * against them is millions, so a T-account has to show both without the big
 * number swamping the column. Grouped digits would wrap on a phone; compact
 * suffixes keep every line one glance wide.
 */
export function formatCompactCurrency(value: number, currency = 'USD', locale = 'en'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency}\u00A0`;
  const sign = value < 0 ? '-' : '';
  const magnitude = Math.abs(value);

  for (const [scale, singular, plural] of magnitudes(locale)) {
    if (magnitude >= scale) {
      const scaled = magnitude / scale;
      // One decimal below 100 keeps "5.2T" readable; above it the decimal is
      // noise ("420B", not "420.0B").
      const text = scaled >= 100 ? String(Math.round(scaled)) : String(Math.round(scaled * 10) / 10);
      const [whole = '0', cents] = text.split('.');
      const suffix = text === '1' ? singular : plural;
      return `${sign}${symbol}${group(whole, cents, locale)}${suffix}`;
    }
  }

  return `${sign}${symbol}${formatNumber(Math.round(magnitude * 100) / 100, locale)}`;
}

/** Same, but always carrying an explicit + or - for a delta. */
export function formatSignedCompactCurrency(value: number, currency = 'USD', locale = 'en'): string {
  const formatted = formatCompactCurrency(value, currency, locale);
  return value > 0 ? `+${formatted}` : formatted;
}
