import type { DecideInput, SeasonDecision } from './types.ts';

/**
 * A date point or remote config read loosely, field by field. Both arrive
 * from storage or the network, so nothing about their shape is trusted.
 */
interface Loose {
  readonly [key: string]: unknown;
}

/**
 * Decides which season to show, and how much of it.
 *
 * Inputs are weighed in this order, and the first that applies wins:
 *
 * 1. A QA `override` (`?season=christmas`, `christmas:calm`, `none`).
 * 2. The remote kill switch: `enabled: false`, or the season listed in
 *    `disabled`. Beats the viewer's own "on", because it exists for the day
 *    a season breaks something. A disabled season that sits inside a longer
 *    one (by `priority`) gives way to it rather than to nothing.
 * 3. The viewer's preference: `off` hides the season, `calm` tones it down.
 * 4. The calendar, as moved by any remote `windows`, or a remote `force`.
 *
 * **This function must stay self-contained.** The website serialises it with
 * `Function.prototype.toString` into the inline script that sets the season
 * before first paint (see `boot-script.ts`), which is how the browser and
 * every other caller run the same code rather than a hand-kept copy. So it
 * closes over nothing, imports nothing at runtime, defines its helpers
 * inside itself, and sticks to syntax every supported browser runs as
 * written (no `?.`, no `??`, no spread, no `for...of`), so no compiler has a
 * reason to swap in a helper the inline copy would not have. The boot script
 * test runs it in an empty sandbox to keep that true.
 *
 * Dates are compared as whole days in the viewer's local calendar: a season
 * starts at midnight where the viewer is, not in UTC.
 *
 * @param input The moment, the calendar, and whatever overrides apply.
 * @return The decision. Never throws: malformed input counts as absent.
 */
export function decide<Id extends string>(input: DecideInput<Id>): SeasonDecision<Id> {
  var DAY = 86400000;
  var calendar = input.calendar;

  /** A UTC calendar day as a whole number, so no daylight-saving hour moves it. */
  function dayNumber(year: number, month: number, day: number): number {
    return Math.round(Date.UTC(year, month - 1, day) / DAY);
  }

  /** How many days a month has. */
  function daysIn(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  }

  /** Western Easter Sunday, by the anonymous Gregorian algorithm (Meeus). */
  function easter(year: number): number {
    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var n = h + l - 7 * m + 114;
    return dayNumber(year, Math.floor(n / 31), (n % 31) + 1);
  }

  /** Whether a value is a whole number in a range. */
  function whole(value: unknown, min: number, max: number): value is number {
    return typeof value === 'number' && value % 1 === 0 && value >= min && value <= max;
  }

  /** A date point in a given year, as a day number; NaN when it has no such day. */
  function point(raw: unknown, year: number): number {
    if (!raw || typeof raw !== 'object') return NaN;
    var p = raw as Loose;
    var offset = whole(p.offset, -366, 366) ? p.offset : 0;
    if (whole(p.easter, -366, 366)) return easter(year) + p.easter + offset;
    if (!whole(p.month, 1, 12)) return NaN;
    var month = p.month;
    var length = daysIn(year, month);
    if (p.day !== undefined) {
      // 29 February in a common year is no day at all, not 1 March.
      return whole(p.day, 1, length) ? dayNumber(year, month, p.day) + offset : NaN;
    }
    if (!whole(p.weekday, 0, 6) || !whole(p.nth, -5, 5) || p.nth === 0) return NaN;
    var day: number;
    if (p.nth > 0) {
      var firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
      day = 1 + ((p.weekday - firstWeekday + 7) % 7) + (p.nth - 1) * 7;
    } else {
      var lastWeekday = new Date(Date.UTC(year, month - 1, length)).getUTCDay();
      day = length - ((lastWeekday - p.weekday + 7) % 7) + (p.nth + 1) * 7;
    }
    return day >= 1 && day <= length ? dayNumber(year, month, day) + offset : NaN;
  }

  /** Whether `today` falls in a window, trying the window that started last year too. */
  function contains(from: unknown, to: unknown, today: number, year: number): boolean {
    for (var y = year - 1; y <= year; y++) {
      var start = point(from, y);
      var end = point(to, y);
      // An end before the start wraps into the next year.
      if (end < start) end = point(to, y + 1);
      if (start <= today && today <= end) return true;
    }
    return false;
  }

  /** Whether an id names a season on the calendar. */
  function known(id: unknown): id is Id {
    for (var i = 0; i < calendar.length; i++) {
      if (calendar[i]!.id === id) return true;
    }
    return false;
  }

  function result(season: Id | null, look: 'full' | 'calm', available: Id | null, reason: SeasonDecision<Id>['reason']): SeasonDecision<Id> {
    return { season: season, look: season ? look : 'full', available: available, reason: reason };
  }

  // 1. The QA override.
  var override = typeof input.override === 'string' ? input.override.trim().toLowerCase() : '';
  if (override === 'none') return result(null, 'full', null, 'override');
  if (override) {
    var parts = override.split(':');
    if (known(parts[0])) return result(parts[0], parts[1] === 'calm' ? 'calm' : 'full', parts[0], 'override');
  }

  // The remote config, if it is one this engine understands and has not expired.
  var remote: Loose | null = input.remote && typeof input.remote === 'object' ? (input.remote as unknown as Loose) : null;
  if (remote && remote.version !== 1) remote = null;
  if (remote && remote.expires !== undefined) {
    var expires = typeof remote.expires === 'string' ? Date.parse(remote.expires) : NaN;
    // An unreadable expiry is treated as expired: fail towards the calendar.
    if (!(input.now < expires)) remote = null;
  }

  // 4. What the calendar says, before anyone's preference.
  var date = new Date(input.now);
  var today = dayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate());
  var scheduled: Id | null = null;
  var reason: SeasonDecision<Id>['reason'] = 'calendar';
  if (remote && known(remote.force)) {
    scheduled = remote.force;
    reason = 'remote-force';
  } else {
    var moved = remote && remote.windows && typeof remote.windows === 'object' ? (remote.windows as Loose) : null;
    var skip = remote && Array.isArray(remote.disabled) ? (remote.disabled as unknown[]) : [];
    var best = -Infinity;
    // Whether a window that applies today was passed over because it is
    // switched off remotely, so the answer is "off", not "nothing on".
    var blocked = false;
    for (var w = 0; w < calendar.length; w++) {
      var entry = calendar[w]!;
      var custom = moved ? (moved[entry.id] as Loose | undefined) : undefined;
      var from = custom && typeof custom === 'object' ? custom.from : entry.from;
      var to = custom && typeof custom === 'object' ? custom.to : entry.to;
      var priority = typeof entry.priority === 'number' ? entry.priority : 0;
      if (priority > best && contains(from, to, today, date.getFullYear())) {
        // A season switched off remotely steps aside for the one beneath it:
        // with Halloween disabled, October is still autumn.
        if (skip.indexOf(entry.id) >= 0) {
          blocked = true;
          continue;
        }
        scheduled = entry.id;
        best = priority;
      }
    }
    if (!scheduled && blocked) return result(null, 'full', null, 'remote-off');
  }
  if (!scheduled) return result(null, 'full', null, 'none');

  // 2. The kill switch.
  if (remote) {
    var disabled = remote.disabled;
    if (remote.enabled === false || (Array.isArray(disabled) && disabled.indexOf(scheduled) >= 0)) {
      return result(null, 'full', null, 'remote-off');
    }
  }

  // 3. The viewer.
  var preference = input.preference;
  if (preference === 'off') return result(null, 'full', scheduled, 'preference-off');
  var calm = preference === 'calm' || (remote !== null && remote.calm === true);
  return result(scheduled, calm ? 'calm' : 'full', scheduled, reason);
}
