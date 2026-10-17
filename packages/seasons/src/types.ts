/**
 * The shapes the season engine works with. Types only: nothing here exists at
 * runtime, so any file may import from it without pulling in code.
 */

/**
 * A day in a year, written so it can be stored as JSON and shipped in a
 * remote config. One of three forms, each with an optional `offset` in days:
 *
 * - `{ month: 10, day: 31 }`: a fixed day (31 October).
 * - `{ easter: -47 }`: days from Western Easter Sunday (-47 is Carnival
 *   Tuesday), for the movable feasts.
 * - `{ month: 11, weekday: 4, nth: 4 }`: the nth weekday of a month (the
 *   fourth Thursday of November). `weekday` is 0 for Sunday to 6 for
 *   Saturday; `nth: -1` is the last one.
 */
export type DatePoint =
  | { readonly month: number; readonly day: number; readonly offset?: number }
  | { readonly easter: number; readonly offset?: number }
  | { readonly month: number; readonly weekday: number; readonly nth: number; readonly offset?: number };

/**
 * When a season is on, both ends inclusive, in the viewer's local calendar.
 * A window whose end comes before its start wraps the new year (from
 * 20 December to 6 January).
 */
export interface SeasonWindow<Id extends string = string> {
  readonly id: Id;
  readonly from: DatePoint;
  readonly to: DatePoint;
  /**
   * Breaks a tie when two windows contain the same day: the higher number
   * wins, and equal numbers go to the window listed first. Defaults to 0, so
   * a short season (a single day) can be given 1 to sit inside a long one.
   */
  readonly priority?: number;
}

/**
 * How much of a season to show.
 *
 * - `full`: everything a season pack offers, motion included.
 * - `calm`: the colours and the still ornaments only. No animation, no
 *   popups, nothing marked as creepy. For anyone who finds a spider dropping
 *   down the screen less fun than its author did.
 */
export type SeasonLook = 'full' | 'calm';

/**
 * What the viewer chose, on this device.
 *
 * - `auto`: follow the calendar, everything on. The default.
 * - `calm`: follow the calendar with the calm look.
 * - `off`: never dress up.
 */
export type SeasonPreference = 'auto' | 'calm' | 'off';

/**
 * The remote switchboard, fetched at runtime so seasons can be changed with
 * no release of either client. Every field is optional; `{ "version": 1 }`
 * changes nothing.
 */
export interface RemoteSeasonConfig {
  readonly version: 1;
  /** `false` switches every season off, for everyone. The kill switch. */
  readonly enabled?: boolean;
  /** Seasons switched off for everyone, by id. */
  readonly disabled?: readonly string[];
  /** Shows the calm look to everyone, for example while an animation misbehaves. */
  readonly calm?: boolean;
  /** Turns a season on for everyone, ahead of or outside its window. */
  readonly force?: string | null;
  /** Moves a season's window, by id, without a release. */
  readonly windows?: Readonly<Record<string, { readonly from: DatePoint; readonly to: DatePoint }>>;
  /**
   * An ISO 8601 moment after which this config is ignored, so a forced
   * season or a kill switch cannot outlive the reason for it by accident.
   */
  readonly expires?: string;
}

/** Why a decision came out the way it did, for debugging and for tests. */
export type DecisionReason =
  | 'override'
  | 'remote-off'
  | 'remote-force'
  | 'preference-off'
  | 'calendar'
  | 'none';

/** Everything `decide` needs. Plain data, so it can cross into a boot script. */
export interface DecideInput<Id extends string = string> {
  /** The moment to decide for, in milliseconds since the epoch. */
  readonly now: number;
  /** The calendar. Its ids are the only seasons that can ever be shown. */
  readonly calendar: readonly SeasonWindow<Id>[];
  /**
   * A QA override such as `?season=` or an environment variable: an id
   * forces that season, `id:calm` forces it calm, `none` forces no season.
   * Anything else is ignored. Beats every other input.
   */
  readonly override?: string | null;
  /** The viewer's choice, if they have made one. */
  readonly preference?: SeasonPreference | null;
  /** The last remote config fetched, if any. */
  readonly remote?: RemoteSeasonConfig | null;
}

/** The outcome. */
export interface SeasonDecision<Id extends string = string> {
  /** The season to show, or `null` for the ordinary look. */
  readonly season: Id | null;
  /** How much of it. `full` whenever `season` is `null`. */
  readonly look: SeasonLook;
  /**
   * The season the viewer *could* have: on the calendar (or forced) and not
   * switched off remotely, whatever their own preference. A settings screen
   * shows its switch only while this is set, so it never offers a choice
   * about nothing.
   */
  readonly available: Id | null;
  readonly reason: DecisionReason;
}
