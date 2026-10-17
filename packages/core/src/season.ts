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
  /** Lit from inside by the season's candle (`SeasonLook.candle`), like a jack-o'-lantern. */
  readonly lit?: boolean;
}

/**
 * A colour that differs by appearance. `#rrggbb` only, so `check:seasons`
 * can composite it over the canvas and measure the text on top.
 */
export interface Tinted {
  readonly light: string;
  readonly dark: string;
}

/**
 * One soft radial glow in a season's sky, behind the top of a screen.
 *
 * Positions and radii are fractions of the sky band (the width of the
 * screen, `SeasonLook.sky.height` of its height), so the same numbers fit a
 * phone and a desktop window. A glow must fade out inside the band
 * (`y + ry <= 1`), or the band's edge cuts it in a hard line; the app's
 * band has no mask to hide one. `check:seasons` holds every glow to this.
 */
export interface SkyGlow {
  /**
   * By appearance. In light, a pale tint of the hue: on a pale canvas a
   * saturated glow darkens the page under coloured text below AA, while a
   * pastel one brings the colour and barely moves the luminance.
   */
  readonly color: Tinted;
  /** Centre, as fractions of the band's width and height. */
  readonly x: number;
  readonly y: number;
  /** Horizontal and vertical radius, as fractions of the band's width and height. */
  readonly rx: number;
  readonly ry: number;
  /** Peak opacity at the centre, by appearance. Kept low: content is the hero. */
  readonly alpha: { readonly light: number; readonly dark: number };
}

/**
 * One depth of the ambient particle field. Near layers are bigger, faster
 * and more opaque; far ones small, slow and faint, which is what reads as
 * depth on a flat screen.
 */
export interface DepthLayer {
  /** How many particles, at most. Clients may draw fewer on a small screen. */
  readonly count: number;
  /** Particle diameter, in points (app) or CSS pixels (site). */
  readonly size: number;
  /** How long one particle takes to cross the screen, in milliseconds. */
  readonly crossMs: number;
  /** Peak opacity. */
  readonly opacity: number;
  /** How far a particle sways side to side, in points. */
  readonly sway: number;
  /**
   * How far the layer follows the pointer on the site, as a fraction of the
   * pointer's offset from the centre (0 = fixed at infinity). The app has no
   * pointer and ignores it.
   */
  readonly parallax: number;
  /** Drawn in front of the content, not behind it. Only the nearest layer, and only faint. */
  readonly front: boolean;
}

/**
 * How a season looks, beyond its emoji: the light, the air and the small
 * signature details. Plain values, so both clients draw the same art
 * direction from one place, and `check:seasons` can measure it.
 *
 * Everything that moves here is drawn only in the full look; the calm look
 * keeps the sky (still) and the still details, and Reduce Motion the same.
 */
export interface SeasonLook {
  /** The tinted glow behind the top of every tab screen. */
  readonly sky: {
    readonly glows: readonly SkyGlow[];
    /** How much of the screen's height the band covers, from the top. */
    readonly height: number;
    /** One slow breath of the glow (brighter and back), in milliseconds. */
    readonly breatheMs: number;
  };
  /** The ambient particle field: snow falling, embers rising. */
  readonly motes: {
    readonly color: Tinted;
    /** A soft halo around each mote, in its own colour. */
    readonly glow: boolean;
    readonly direction: 'fall' | 'rise';
    /** Sideways drift over one crossing, in points; positive blows right. */
    readonly wind: number;
    readonly layers: readonly DepthLayer[];
  };
  /** The burst on a correct answer. */
  readonly burst: {
    /** The soft ring that expands behind it. `#rrggbb`. */
    readonly ring: string;
    /** How far a particle falls by the end, in points. */
    readonly gravity: number;
    /** How far a particle turns by the end, in degrees. */
    readonly spin: number;
  };
  /** Fairy lights strung along the top of Today, if any. */
  readonly lights: {
    /** Bulb colours, in order along the string. `#rrggbb`. */
    readonly colors: readonly string[];
    /** Bulbs across a phone-width string. */
    readonly count: number;
    /** How far the middle of the string sags, in points. */
    readonly sag: number;
    /** One twinkle, in milliseconds. At least 400: nothing flashes faster than 3 Hz. */
    readonly twinkleMs: number;
  } | null;
  /** Snow settled on the top edge of the hero card, if any. */
  readonly snowCap: Tinted | null;
  /** A candle flickering inside the footer's lanterns (pumpkins), if any. */
  readonly candle: {
    /** `#rrggbb`. */
    readonly color: string;
    /** One irregular flicker cycle, in milliseconds. At least 400 (3 Hz). */
    readonly flickerMs: number;
  } | null;
  /** Fog lying along the bottom of Today, behind the content, if any. */
  readonly fog: {
    readonly color: Tinted;
    /** Peak opacity, by appearance. */
    readonly alpha: { readonly light: number; readonly dark: number };
    /** One slow drift across and back, in milliseconds. */
    readonly driftMs: number;
  } | null;
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
    /** One wing beat, in milliseconds, for flyers with wings; none for a sleigh. */
    readonly flapMs?: number;
  };
  /** What drifts down the tabs all the time, if anything. Kept faint and few. */
  readonly ambient: { readonly emoji: string; readonly count: number } | null;
  /** Caught on the top corner of a card. */
  readonly cardCorner: string;
  /** Large and faint, in the top corner of a screen. */
  readonly screenCorner: string;
  /** The row that ends a scrolling screen. */
  readonly footer: readonly FooterOrnament[];
  /** The light, the air and the signature details. */
  readonly look: SeasonLook;
}

/** What each season hangs up. */
export const SEASON_PACKS: Readonly<Record<SeasonId, SeasonPack>> = {
  halloween: {
    emoji: { streak: '🎃', complete: '🎃', perfect: '🧙' },
    particles: ['🎃', '🦇', '👻', '🍬', '🎃', '🕷️', '🍭', '👻'],
    welcome: '🎃',
    toy: { emoji: '🕷️', move: 'drop', creepy: true },
    flyer: { emoji: '🦇', count: 3, flapMs: 420 },
    ambient: null,
    cardCorner: '🕸️',
    screenCorner: '🕸️',
    footer: [
      { emoji: '🎃', size: 's', lit: true },
      { emoji: '🎃', size: 'l', lit: true },
      { emoji: '👻', size: 'm', lift: true },
      { emoji: '🎃', size: 'l', lit: true },
      { emoji: '🎃', size: 's', lit: true },
    ],
    look: {
      // Dusk: violet coming down from the top left, a pumpkin glow rising on
      // the right, a little slime green low in the middle.
      sky: {
        glows: [
          { color: { light: '#E4D6FF', dark: '#7B4DE8' }, x: 0.12, y: 0, rx: 0.9, ry: 0.8, alpha: { light: 0.15, dark: 0.26 } },
          { color: { light: '#FFDDB8', dark: '#FF8A1F' }, x: 0.92, y: 0.18, rx: 0.7, ry: 0.65, alpha: { light: 0.16, dark: 0.18 } },
          { color: { light: '#D3F2DF', dark: '#2FBF71' }, x: 0.45, y: 0.72, rx: 0.6, ry: 0.28, alpha: { light: 0.08, dark: 0.06 } },
        ],
        height: 0.6,
        breatheMs: 9000,
      },
      // Embers drifting up from the lanterns, few and faint.
      motes: {
        color: { light: '#E8700F', dark: '#FFA348' },
        glow: true,
        direction: 'rise',
        wind: 18,
        layers: [
          { count: 7, size: 2, crossMs: 26000, opacity: 0.35, sway: 10, parallax: 0.01, front: false },
          { count: 5, size: 3, crossMs: 19000, opacity: 0.5, sway: 16, parallax: 0.025, front: false },
          { count: 3, size: 4, crossMs: 14000, opacity: 0.55, sway: 22, parallax: 0.05, front: true },
        ],
      },
      burst: { ring: '#FF8A1F', gravity: 70, spin: 120 },
      lights: null,
      snowCap: null,
      candle: { color: '#FF8A1F', flickerMs: 2600 },
      fog: {
        color: { light: '#E6DDF0', dark: '#6B5A88' },
        alpha: { light: 0.2, dark: 0.22 },
        driftMs: 42000,
      },
    },
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
    look: {
      // A cold night: an aurora of teal and frost blue across the top, and
      // a warm candle glow low on the right, like a lit window.
      sky: {
        glows: [
          { color: { light: '#CDF1F3', dark: '#3FC1C9' }, x: 0.2, y: 0, rx: 0.85, ry: 0.7, alpha: { light: 0.19, dark: 0.2 } },
          { color: { light: '#D3E4F8', dark: '#2E7BD1' }, x: 0.75, y: 0.05, rx: 0.8, ry: 0.75, alpha: { light: 0.19, dark: 0.24 } },
          { color: { light: '#FFEDC4', dark: '#FFC23D' }, x: 0.9, y: 0.66, rx: 0.55, ry: 0.32, alpha: { light: 0.26, dark: 0.1 } },
        ],
        height: 0.6,
        breatheMs: 11000,
      },
      // Snow in three depths, blown a little to the right.
      motes: {
        color: { light: '#7FA9D6', dark: '#FFFFFF' },
        glow: false,
        direction: 'fall',
        wind: 40,
        layers: [
          { count: 12, size: 3, crossMs: 24000, opacity: 0.45, sway: 8, parallax: 0.01, front: false },
          { count: 8, size: 5, crossMs: 16000, opacity: 0.65, sway: 14, parallax: 0.03, front: false },
          { count: 4, size: 7, crossMs: 11000, opacity: 0.55, sway: 20, parallax: 0.06, front: true },
        ],
      },
      burst: { ring: '#FFC23D', gravity: 60, spin: 90 },
      // Old-fashioned warm bulbs; red and green here are tree lights, not
      // "wrong" and "correct": they sit above the content and mean nothing.
      lights: { colors: ['#FF5A5F', '#FFC23D', '#3FC1C9', '#2FBF71', '#B98CFF'], count: 11, sag: 14, twinkleMs: 2400 },
      snowCap: { light: '#FFFFFF', dark: '#E8F1FA' },
      candle: null,
      fog: null,
    },
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
