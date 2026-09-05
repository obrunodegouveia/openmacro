/** Shared number formatting. Kept tiny and dependency-free. */

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const full = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** `$10B` / `-$500M` — used on balance sheet lines, where space is tight. */
export function formatCompactCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${compact.format(Math.abs(value))}`;
}

/** `+$10B` — for signed postings, where the direction is the point. */
export function formatDelta(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatCompactCurrency(value)}`;
}

/** `$1,000` — for exact figures. */
export function formatCurrency(value: number): string {
  return full.format(value);
}
