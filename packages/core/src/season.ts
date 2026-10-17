/**
 * OpenMacro's seasons: the few weeks a year when both clients dress up.
 *
 * The machinery (calendar maths, the viewer's preference, the remote kill
 * switch, the pre-paint boot script) is `@openmacro/seasons`, which knows
 * nothing about this product. This file is what it is given: *which*
 * seasons, *when*, and what each one hangs up.
 *
 * A season changes how the app and the site *look* and nothing else. What is
 * asked, what counts as correct and what the learner is told stay exactly
 * the same, so a season never touches content or the engine (see "The parity
 * rule" in CONTRIBUTING.md).
 *
 * ## Adding a season
 *
 * 1. Add its id to `SeasonId`, a window to `SEASONS` and a pack to
 *    `SEASON_PACKS`. The pack is data, so both clients pick it up at once.
 * 2. Add its strings (`season.<id>.*`) to every UI catalogue.
 * 3. Give it a palette in the app (`src/theme/palette.ts`) and on the site
 *    (`[data-season]` in `web/src/app/globals.css`).
 *
 * Steps 1 and 2 are enforced by the type checker; `npm run check:seasons`
 * enforces step 3 and measures the new palette's contrast. Nothing about a
 * season can ship to one client and not the other.
 *
 * Deliberately dependency-free at runtime, like `format.ts`, so the web can
 * serialise `SEASONS` into the inline script that sets the season before
 * first paint.
 */

import type { SeasonWindow } from '@openmacro/seasons/types';

/** Every season either client knows how to draw. */
export type SeasonId = 'halloween' | 'christmas';

/**
 * The calendar, in the learner's local time, both ends inclusive. The
 * remote config can move a window or switch a season off without a release
 * (see `docs/seasons.md`).
 */
export const SEASONS: readonly SeasonWindow<SeasonId>[] = [
  // All of October, and the morning after.
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
  // Advent to Boxing Day.
  { id: 'christmas', from: { month: 12, day: 1 }, to: { month: 12, day: 26 } },
];

/** Every valid id. */
export const SEASON_IDS: readonly SeasonId[] = SEASONS.map((season) => season.id);

/**
 * Where the remote season config is served. A JSON document, validated
 * strictly; `{ "version": 1 }` changes nothing. See `docs/seasons.md`.
 */
export const SEASONS_REMOTE_URL = 'https://openmacro.org/api/seasons';

/** The prefix for every key the season controller stores, on either client. */
export const SEASONS_KEY_PREFIX = 'openmacro.seasons';

/** One ornament in the row that ends a scrolling screen. */
export interface FooterOrnament {
  readonly emoji: string;
  readonly size: 's' | 'm' | 'l';
  /** Sits higher than its neighbours, like the ghost floating over the pumpkins. */
  readonly lift?: boolean;
}

/**
 * Everything a season hangs up, as data both clients draw. Emoji throughout,
 * so a new season ships as an over-the-air update and weighs nothing; a
 * client may draw a part with its own artwork instead (the site's SVG
 * cobwebs), as long as it means the same thing.
 */
export interface SeasonPack {
  /** Swaps for the app's own emoji, by role. The meaning stays; the picture dresses up. */
  readonly emoji: {
    /** The streak flame. */
    readonly streak: string;
    /** The party popper on a finished lesson. */
    readonly complete: string;
    /** The trophy on a perfect one. */
    readonly perfect: string;
  };
  /** Thrown up on a correct answer, and raining down on a finished lesson. */
  readonly particles: readonly string[];
  /** The big emoji on the once-a-day welcome. */
  readonly welcome: string;
  /**
   * The toy on a thread at the top of Today, the one thing a learner can
   * play with. Each tap moves it; every third tap it says something (from
   * `season.<id>.toy.1` to `.3`), and every tenth it throws a burst.
   */
  readonly toy: {
    readonly emoji: string;
    /** `drop` falls down the screen and climbs back; `swing` rings like a bell. */
    readonly move: 'drop' | 'swing';
    /** Hidden in the calm look. Spiders are; bells are not. */
    readonly creepy: boolean;
  };
  /** What crosses the top of the tabs now and then. */
  readonly flyer: {
    readonly emoji: string;
    /** How many, staggered. */
    readonly count: number;
    /** Mirror it, for emoji that face the wrong way for a left-to-right flight. */
    readonly mirror?: boolean;
  };
  /** What drifts down the tabs all the time, if anything. Kept faint and few. */
  readonly ambient: { readonly emoji: string; readonly count: number } | null;
  /** Caught on the top corner of a card. */
  readonly cardCorner: string;
  /** Large and faint, in the top corner of a screen. */
  readonly screenCorner: string;
  /** The row that ends a scrolling screen. */
  readonly footer: readonly FooterOrnament[];
}

/** What each season hangs up. */
export const SEASON_PACKS: Readonly<Record<SeasonId, SeasonPack>> = {
  halloween: {
    emoji: { streak: '🎃', complete: '🎃', perfect: '🧙' },
    particles: ['🎃', '🦇', '👻', '🍬', '🎃', '🕷️', '🍭', '👻'],
    welcome: '🎃',
    toy: { emoji: '🕷️', move: 'drop', creepy: true },
    flyer: { emoji: '🦇', count: 3 },
    ambient: null,
    cardCorner: '🕸️',
    screenCorner: '🕸️',
    footer: [
      { emoji: '🎃', size: 's' },
      { emoji: '🎃', size: 'l' },
      { emoji: '👻', size: 'm', lift: true },
      { emoji: '🎃', size: 'l' },
      { emoji: '🎃', size: 's' },
    ],
  },
  christmas: {
    emoji: { streak: '🎄', complete: '🎁', perfect: '🎅' },
    particles: ['❄️', '🎁', '⭐', '🍪', '🎄', '🔔', '🦌', '☃️'],
    welcome: '🎅',
    toy: { emoji: '🔔', move: 'swing', creepy: false },
    // Reindeer face left in most emoji fonts; mirrored, they pull the sleigh
    // the way it flies.
    flyer: { emoji: '🦌🦌🛷', count: 1, mirror: true },
    ambient: { emoji: '❄️', count: 9 },
    cardCorner: '🎀',
    screenCorner: '❄️',
    footer: [
      { emoji: '🎁', size: 's' },
      { emoji: '🎄', size: 'l' },
      { emoji: '⛄', size: 'm', lift: true },
      { emoji: '🎄', size: 'l' },
      { emoji: '🎁', size: 's' },
    ],
  },
};

/** How many taps the toy counts before it repeats itself. */
export const TOY_LINES = 3;

/**
 * What the toy does on a given tap: nothing to say, a line, or a burst.
 *
 * Shared so the app's spider and the site's are equally chatty.
 *
 * @param taps How many times it has been tapped, this one included.
 * @return The line number (1 to `TOY_LINES`) to say, `burst`, or `null`.
 */
export function toyReaction(taps: number): number | 'burst' | null {
  if (taps > 0 && taps % 10 === 0) return 'burst';
  if (taps > 0 && taps % 3 === 0) return ((taps / 3 - 1) % TOY_LINES) + 1;
  return null;
}
