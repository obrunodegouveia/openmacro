/**
 * Calendars for the preset seasons, for either hemisphere.
 *
 * The nature seasons follow the astronomical seasons, rounded to fixed days,
 * and between them cover every day of the year. The holidays have
 * `priority: 1`, so they win the days they share with the season beneath
 * them; switch one off remotely and that season shows instead.
 *
 * Any calendar here is plain data (`SeasonWindow[]`): filter it, extend it
 * or move a window, and give it to `createSeasonController` and
 * `createBootScript` as it is.
 */

import type { SeasonWindow } from '../types.ts';
import type { PresetId } from './packs.ts';

/** Which half of the world the viewer's seasons follow. */
export type Hemisphere = 'north' | 'south';

/** Halloween and Christmas, which keep their dates in either hemisphere. */
const HOLIDAYS: readonly SeasonWindow<PresetId>[] = [
  // All of October, and the morning after.
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 }, priority: 1 },
  // Advent to Boxing Day.
  { id: 'christmas', from: { month: 12, day: 1 }, to: { month: 12, day: 26 }, priority: 1 },
];

/**
 * The northern hemisphere's year: spring from the March equinox, summer
 * from the June solstice, autumn from the September equinox and winter
 * from the December solstice, with Halloween and Christmas on top.
 */
export const NORTHERN_CALENDAR: readonly SeasonWindow<PresetId>[] = [
  { id: 'spring', from: { month: 3, day: 20 }, to: { month: 6, day: 20 } },
  { id: 'summer', from: { month: 6, day: 21 }, to: { month: 9, day: 22 } },
  { id: 'autumn', from: { month: 9, day: 23 }, to: { month: 12, day: 20 } },
  // Wraps the new year.
  { id: 'winter', from: { month: 12, day: 21 }, to: { month: 3, day: 19 } },
  ...HOLIDAYS,
];

/**
 * The southern hemisphere's year: the same four nature seasons, half a year
 * apart (summer at Christmas, winter in July), with Halloween and Christmas
 * on their usual dates. Christmas keeps its snowy pack; to give it a summer
 * look instead, define your own pack for it (see the README).
 */
export const SOUTHERN_CALENDAR: readonly SeasonWindow<PresetId>[] = [
  { id: 'autumn', from: { month: 3, day: 20 }, to: { month: 6, day: 20 } },
  { id: 'winter', from: { month: 6, day: 21 }, to: { month: 9, day: 22 } },
  { id: 'spring', from: { month: 9, day: 23 }, to: { month: 12, day: 20 } },
  // Wraps the new year.
  { id: 'summer', from: { month: 12, day: 21 }, to: { month: 3, day: 19 } },
  ...HOLIDAYS,
];

/**
 * The preset calendar for a hemisphere, optionally without the holidays.
 *
 * @param hemisphere `north` or `south`.
 * @param options.holidays Include Halloween and Christmas. Default true.
 * @return The calendar.
 */
export function presetCalendar(hemisphere: Hemisphere, options: { holidays?: boolean } = {}): readonly SeasonWindow<PresetId>[] {
  const calendar = hemisphere === 'south' ? SOUTHERN_CALENDAR : NORTHERN_CALENDAR;
  return options.holidays === false ? calendar.filter((window) => !HOLIDAYS.some((holiday) => holiday.id === window.id)) : calendar;
}
