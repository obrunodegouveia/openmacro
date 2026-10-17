/**
 * Seasons: the few weeks a year when both clients dress up.
 *
 * A season changes how the app and the site *look* — colours, a few
 * decorations — and nothing else. What is asked, what counts as correct and
 * what the learner is told stay exactly the same, so a season never touches
 * content or the engine (see "The parity rule" in CONTRIBUTING.md).
 *
 * The calendar lives here, once, so the app and the site switch on the same
 * day. How each one dresses up is theirs: the palette overrides are in
 * `src/theme/tokens.ts` in the app and under `[data-season]` in
 * `web/src/app/globals.css`, and each has its own `SeasonalDecor`.
 *
 * Adding a season: add its id to `SeasonId`, a window to `SEASONS`, and a
 * palette and decorations to both clients. A client that has not been given
 * one simply looks as it always does, which is the safe failure.
 *
 * Deliberately dependency-free, like `format.ts`, so the web can serialise
 * `SEASONS` into the inline script that sets the season before first paint.
 */

/** Every season either client knows how to draw. */
export type SeasonId = 'halloween';

/** A day of the year, 1-based: `{ month: 10, day: 31 }` is 31 October. */
export interface MonthDay {
  readonly month: number;
  readonly day: number;
}

/**
 * When a season is on, both ends inclusive, in the learner's own calendar.
 * A window may wrap the new year (`from` December, `to` January).
 */
export interface SeasonWindow {
  readonly id: SeasonId;
  readonly from: MonthDay;
  readonly to: MonthDay;
}

/**
 * The calendar. Checked in order; the first window that contains the date
 * wins, so windows should not overlap.
 */
export const SEASONS: readonly SeasonWindow[] = [
  // All of October, and the morning after.
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
];

/** Every valid id, for parsing an override. */
export const SEASON_IDS: readonly SeasonId[] = ['halloween'];

/**
 * A month and day as one comparable number: 1031 for 31 October.
 *
 * @param value The day to encode.
 * @return `month * 100 + day`.
 */
function ordinal(value: MonthDay): number {
  return value.month * 100 + value.day;
}

/**
 * Which season a date falls in.
 *
 * Uses the date's *local* month and day: Halloween starts at midnight where
 * the learner is, not in UTC.
 *
 * @param date The moment to check, usually `new Date()`.
 * @param seasons The calendar; only tests pass anything else.
 * @return The season, or `null` on an ordinary day.
 */
export function seasonOn(date: Date, seasons: readonly SeasonWindow[] = SEASONS): SeasonId | null {
  const today = ordinal({ month: date.getMonth() + 1, day: date.getDate() });
  for (const season of seasons) {
    const from = ordinal(season.from);
    const to = ordinal(season.to);
    const inside = from <= to ? today >= from && today <= to : today >= from || today <= to;
    if (inside) return season.id;
  }
  return null;
}

/**
 * Reads a season override, such as `?season=halloween` on the site or
 * `EXPO_PUBLIC_SEASON` in an app build, so a season can be looked at in July.
 *
 * @param value The raw override, if any.
 * @return A season id; `null` for "none" (force the ordinary look); or
 *     `undefined` when there is no valid override and the calendar decides.
 */
export function parseSeasonOverride(value: string | null | undefined): SeasonId | null | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (normalised === 'none') return null;
  return (SEASON_IDS as readonly string[]).includes(normalised) ? (normalised as SeasonId) : undefined;
}

/**
 * The season to show: the override when there is one, otherwise the calendar.
 *
 * @param date The moment to check.
 * @param override A raw override, passed through `parseSeasonOverride`.
 * @return The season, or `null` on an ordinary day.
 */
export function currentSeason(date: Date, override?: string | null): SeasonId | null {
  const forced = parseSeasonOverride(override);
  return forced === undefined ? seasonOn(date) : forced;
}
