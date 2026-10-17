/**
 * OpenMacro's seasons: the year, dressed up.
 *
 * The machinery (calendar maths, the viewer's preference, the remote kill
 * switch, the pre-paint boot script) is `@openmacro/seasons`, which knows
 * nothing about this product. This file is what it is given: *which*
 * seasons, *when*, and what each one hangs up.
 *
 * Four nature seasons cover the whole year, and two holidays sit inside
 * them with a higher `priority`: Halloween in autumn, Christmas across the
 * turn from autumn to winter. Switch a holiday off remotely and the nature
 * season beneath it shows instead.
 *
 * A season changes how the app and the site *look* and nothing else. What is
 * asked, what counts as correct and what the learner is told stay exactly
 * the same, so a season never touches content or the engine (see "The parity
 * rule" in CONTRIBUTING.md).
 *
 * ## One season, one object
 *
 * Everything a season is lives in its `SeasonPack`: the palette, the sky,
 * the particles in each depth, the signature details, the toy and the keys
 * of its strings. Both clients draw any pack with the same components, so a
 * new season is new data and no new component code (the site may add its
 * own SVG artwork for a season, as it does for Halloween, but never needs
 * to). The shape is deliberately plain, serialisable and free of OpenMacro
 * names, so it can move into `@openmacro/seasons` as it is.
 *
 * ## Adding a season
 *
 * 1. Add its id to `SeasonId`, a window to `SEASONS` and a pack to
 *    `SEASON_PACKS`.
 * 2. Add its strings (`season.<id>.*`) to every UI catalogue.
 *
 * The type checker enforces both; `npm run check:seasons` measures the new
 * palette's contrast (under the sky and the mist too) and holds the motion
 * to its limits. Nothing about a season can ship to one client and not the
 * other.
 *
 * Deliberately dependency-free at runtime, like `format.ts`, so the web can
 * serialise `SEASONS` into the inline script that sets the season before
 * first paint.
 */

import type { SeasonWindow } from '@openmacro/seasons/types';
import type { UiKey } from './i18n/ui/en';

/** Every season either client knows how to draw. */
export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter' | 'halloween' | 'christmas';

/**
 * The calendar, in the learner's local time, both ends inclusive. The
 * remote config can move a window or switch a season off without a release
 * (see `docs/seasons.md`).
 *
 * The nature seasons follow the northern hemisphere's astronomical seasons,
 * rounded to fixed days, and between them cover every day of the year. The
 * holidays win the days they share (`priority: 1`).
 */
export const SEASONS: readonly SeasonWindow<SeasonId>[] = [
  { id: 'spring', from: { month: 3, day: 20 }, to: { month: 6, day: 20 } },
  { id: 'summer', from: { month: 6, day: 21 }, to: { month: 9, day: 22 } },
  { id: 'autumn', from: { month: 9, day: 23 }, to: { month: 12, day: 20 } },
  // Wraps the new year.
  { id: 'winter', from: { month: 12, day: 21 }, to: { month: 3, day: 19 } },
  // All of October, and the morning after.
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 }, priority: 1 },
  // Advent to Boxing Day.
  { id: 'christmas', from: { month: 12, day: 1 }, to: { month: 12, day: 26 }, priority: 1 },
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

// ---------------------------------------------------------------------------
// The shape of a season
// ---------------------------------------------------------------------------

/**
 * A colour that differs by appearance. `#rrggbb` only, so `check:seasons`
 * can composite it over the canvas and measure the text on top.
 */
export interface Tinted {
  readonly light: string;
  readonly dark: string;
}

/**
 * A season's colours for one appearance, by role rather than by any one
 * client's token names: each client maps the roles onto its own tokens
 * (`seasonal` in `src/theme/palette.ts`, `seasonStyles` in
 * `web/src/lib/season-palette.ts`). `#rrggbb` throughout.
 *
 * Only accents and surfaces move. The app's "correct" green and "wrong" red
 * are not here at all: they mean the same thing all year, and a learner
 * should never have to relearn that for a month.
 */
export interface SeasonColors {
  /** The page behind everything. */
  readonly canvas: string;
  /** Cards. */
  readonly surface: string;
  /** Cards on cards, popovers. */
  readonly raised: string;
  /** Sunken wells and insets. */
  readonly well: string;
  /** The deepest shade, behind scrims. Dark appearance only; light keeps its own. */
  readonly abyss?: string;
  /** Hairline borders, and the stronger ones. */
  readonly hairline: string;
  readonly hairlineStrong: string;
  /** Text, from the strongest to the faintest. Each clears AA on every surface. */
  readonly ink: string;
  readonly inkMuted: string;
  readonly inkFaint: string;
  /** The warm accent where the app is gold (the streak, XP): a fill. */
  readonly accent: string;
  /** The warm accent as text. */
  readonly accentText: string;
  /** A deeper warm fill, for pressed edges. */
  readonly accentDeep: string;
  /** A pale warm wash, behind accent text. */
  readonly accentSoft: string;
  /** The cool accent where the app is blue (actions, links): a fill. */
  readonly cool: string;
  /** The cool accent as text. */
  readonly coolText: string;
  /** A deeper cool fill, for a button's bevel. */
  readonly coolDeep: string;
  /** A pale cool wash. */
  readonly coolSoft: string;
  /** A link colour, where the cool accent is too close to the text to read as one. */
  readonly link?: string;
  /** "Correct" green as text, a shade deeper where the season's sky would wash it out. */
  readonly correctText?: string;
  /** The tint of shadows. */
  readonly shadow?: string;
}

/** A season's colours, by appearance. */
export interface SeasonPalette {
  readonly light: SeasonColors;
  readonly dark: SeasonColors;
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
 * What one particle looks like when it is drawn, not an emoji.
 *
 * - `dot`: a soft round mote (snow, embers, fireflies).
 * - `petal`: a blossom petal, rounded with one pointed end.
 * - `leaf`: a leaf, pointed at both ends.
 * - `spark`: a four-pointed glint (ice crystals, sparkles).
 */
export type MoteShape = 'dot' | 'petal' | 'leaf' | 'spark';

/**
 * How the particles move, beyond falling or rising: the season's motion
 * character, which is most of what makes snow read as snow and petals as
 * petals.
 *
 * - `drift`: a slow sine sway on the wind. Snow, embers.
 * - `tumble`: turning end over end as it sways, its face flipping towards
 *   and away from the viewer. Petals.
 * - `flutter`: swinging side to side like a pendulum, tilting into each
 *   swing, with a spin now and then. Leaves.
 * - `pulse`: wandering slowly and glowing up and fading, each on its own
 *   beat (never faster than once a second). Fireflies.
 * - `glint`: drifting very slowly and catching the light now and then.
 *   Ice crystals.
 */
export type MoteMotion = 'drift' | 'tumble' | 'flutter' | 'pulse' | 'glint';

/**
 * One depth of the ambient particle field. Near layers are bigger, faster
 * and more opaque; far ones small, slow and faint, which is what reads as
 * depth on a flat screen.
 */
export interface DepthLayer {
  /** How many particles, at most. Clients may draw fewer on a small screen. */
  readonly count: number;
  /** Particle size, in points (app) or CSS pixels (site). An emoji is drawn at about twice this. */
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
  /** The drawn shape. Defaults to `dot`. Ignored when `emoji` is set. */
  readonly shape?: MoteShape;
  /** Emoji drawn instead of shapes, one per particle in turn (the snowflake among the snow). */
  readonly emoji?: readonly string[];
}

/**
 * A garland strung along the top of Today: fairy lights at Christmas, a
 * blossom branch in spring.
 */
export interface Garland {
  /** Bulb colours, in order along the string. `#rrggbb`. Ignored when `beads` is set. */
  readonly colors: readonly string[];
  /** Emoji hung on the string instead of bulbs (blossoms, leaves). */
  readonly beads?: readonly string[];
  /** Bulbs or beads across a phone-width string. */
  readonly count: number;
  /** How far the middle of each swag sags, in points. */
  readonly sag: number;
  /**
   * One twinkle (bulbs) or one sway (beads), in milliseconds. At least
   * 1000: nothing flashes faster than 3 Hz, with room to spare.
   */
  readonly beatMs: number;
  /** The string's colour; the faint text colour when absent. */
  readonly wire?: Tinted;
}

/**
 * Something settled on the top edge of the hero card.
 *
 * - `snow`: a soft drift with lumps and drips.
 * - `frost`: a thin crystalline rim that catches the light now and then.
 * - `scatter`: a few emoji resting along the edge (fallen leaves).
 */
export type CardEdge =
  | { readonly kind: 'snow'; readonly color: Tinted }
  | { readonly kind: 'frost'; readonly color: Tinted }
  | { readonly kind: 'scatter'; readonly emoji: readonly string[] };

/**
 * Something low along the bottom of Today, behind the content.
 *
 * - `drift`: two banks of fog sliding slowly past each other (Halloween).
 * - `breathe`: mist swelling and rising a little, then settling, like
 *   breath on a cold day (winter).
 * - `shimmer`: thin bands of warm air wavering over hot ground (summer).
 */
export interface Mist {
  readonly mode: 'drift' | 'breathe' | 'shimmer';
  readonly color: Tinted;
  /** Peak opacity, by appearance. */
  readonly alpha: { readonly light: number; readonly dark: number };
  /** One full cycle (across and back, one breath, one waver), in milliseconds. At least 1000. */
  readonly cycleMs: number;
}

/**
 * A sun high in the sky, behind the top of a screen: a warm core and a slow
 * crown of rays turning around it.
 */
export interface Sun {
  readonly color: Tinted;
  /** Peak opacity of the core, by appearance. Measured with the sky by `check:seasons`. */
  readonly alpha: { readonly light: number; readonly dark: number };
  /** Centre, as fractions of the sky band, like a `SkyGlow`. */
  readonly x: number;
  readonly y: number;
  /** The core's radius, as a fraction of the band's width. */
  readonly radius: number;
  /** How many rays. */
  readonly rays: number;
  /** One full turn of the rays, in milliseconds. Slow. */
  readonly turnMs: number;
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
  /** The ambient particle field: snow falling, petals tumbling, fireflies wandering. */
  readonly motes: {
    /** Particle colours, one per particle in turn, by appearance. */
    readonly colors: readonly Tinted[];
    /** A soft halo around each mote, in its own colour. */
    readonly glow: boolean;
    readonly direction: 'fall' | 'rise';
    /** The motion character. */
    readonly motion: MoteMotion;
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
  /** A garland along the top of Today, if any. */
  readonly garland: Garland | null;
  /** Something settled on the hero card's top edge, if anything. */
  readonly edge: CardEdge | null;
  /** A candle flickering inside the footer's lit ornaments (pumpkins), if any. */
  readonly candle: {
    /** `#rrggbb`. */
    readonly color: string;
    /** One irregular flicker cycle, in milliseconds. At least 1000. */
    readonly flickerMs: number;
  } | null;
  /** Fog, mist or heat lying along the bottom of Today, if any. */
  readonly mist: Mist | null;
  /** A sun in the sky, if any. */
  readonly sun: Sun | null;
}

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
 * How the toy on a thread at the top of Today answers a tap.
 *
 * - `drop`: it falls most of the way down the screen and climbs back.
 * - `swing`: it rings like a bell.
 * - `bounce`: it drops a little way and bounces on its thread, squashing
 *   at the bottom of each bounce, like a ball on elastic.
 * - `buzz`: it darts about in a little loop and back.
 */
export type ToyMove = 'drop' | 'swing' | 'bounce' | 'buzz';

/**
 * A season's strings, as keys into the UI catalogues. Every catalogue must
 * have every one (`check:seasons`).
 */
export interface SeasonStrings {
  /** Its name, for the settings hint: "Halloween". */
  readonly name: UiKey;
  /** The greeting pill: "🎃 Happy Halloween!". */
  readonly greeting: UiKey;
  /** The once-a-day welcome, with a `{name}`: "Happy Halloween, {name}!". */
  readonly welcome: UiKey;
  /** What the toy says, every third tap in turn. */
  readonly toy: readonly UiKey[];
}

/**
 * Everything a season is, as one plain object both clients draw. Emoji
 * throughout, so a new season ships as an over-the-air update and weighs
 * nothing; a client may draw a part with its own artwork instead (the
 * site's SVG cobwebs), as long as it means the same thing.
 */
export interface SeasonPack {
  /** Its words. */
  readonly strings: SeasonStrings;
  /** Its colours. */
  readonly palette: SeasonPalette;
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
   * play with. Each tap moves it; every third tap it says something (its
   * `strings.toy`, in turn), and every tenth it throws a burst.
   */
  readonly toy: {
    readonly emoji: string;
    readonly move: ToyMove;
    /** Hidden in the calm look. Spiders and bees are; bells are not. */
    readonly creepy: boolean;
  };
  /** What crosses the top of the tabs now and then, if anything. Only ever in the full look. */
  readonly flyer: {
    /** What flies; a list gives each member of the flight its own, in turn. */
    readonly emoji: string | readonly string[];
    /** How many. */
    readonly count: number;
    /** The first member's size, in points; the others vary around it. */
    readonly size: number;
    /** One crossing, in milliseconds. */
    readonly lapMs: number;
    /** The wait off screen between crossings, in milliseconds. */
    readonly restMs: number;
    /** How far the path rises and dips, in points. */
    readonly wobble: number;
    /** How many rises and dips over one crossing. */
    readonly waves: number;
    /** How far it turns over one crossing, in degrees (a leaf on the wind); without it, it banks gently. */
    readonly spin?: number;
    /**
     * Fly together, each this many milliseconds behind the one before (a
     * gust of leaves). Without it, each keeps its own schedule.
     */
    readonly spacingMs?: number;
    /** Mirror it, for emoji that face the wrong way for a left-to-right flight. */
    readonly mirror?: boolean;
    /** One wing beat, in milliseconds, for flyers with wings; none for a sleigh. */
    readonly flapMs?: number;
    /** Which way the wings fold: `y` (the default) for a bat seen side on, `x` for a butterfly from above. */
    readonly flapAxis?: 'x' | 'y';
  } | null;
  /** Caught on the top corner of a card. */
  readonly cardCorner: string;
  /** Large and faint, in the top corner of a screen. */
  readonly screenCorner: string;
  /** The row that ends a scrolling screen. */
  readonly footer: readonly FooterOrnament[];
  /** The light, the air and the signature details. */
  readonly look: SeasonLook;
}

/**
 * A season's string keys, by the catalogues' convention:
 * `season.<id>.name`, `.greeting`, `.welcome` and `.toy.1` to `.3`.
 *
 * @param id The season.
 * @return Its keys.
 */
function stringsFor(id: SeasonId): SeasonStrings {
  return {
    name: `season.${id}.name`,
    greeting: `season.${id}.greeting`,
    welcome: `season.${id}.welcome`,
    toy: [`season.${id}.toy.1`, `season.${id}.toy.2`, `season.${id}.toy.3`],
  };
}

// ---------------------------------------------------------------------------
// The seasons
// ---------------------------------------------------------------------------

/** What each season hangs up. */
export const SEASON_PACKS: Readonly<Record<SeasonId, SeasonPack>> = {
  // -------------------------------------------------------------------------
  // Spring: blossom and new leaves. Petals tumbling, butterflies, a blossom
  // branch along the top, and a bee to bother.
  // -------------------------------------------------------------------------
  spring: {
    strings: stringsFor('spring'),
    palette: {
      // Blossom pink where the app is gold, wisteria where it is blue, on a
      // canvas with a breath of new green in it.
      light: {
        canvas: '#F6FAF4',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#EAF3E6',
        hairline: '#DCE9D6',
        hairlineStrong: '#C2D8BA',
        ink: '#1A2A21',
        inkMuted: '#44574B',
        inkFaint: '#506355',
        accent: '#F06A9B',
        accentText: '#AD2A60',
        accentDeep: '#962253',
        accentSoft: '#FDE8F0',
        cool: '#6A60D6',
        coolText: '#4A41B5',
        coolDeep: '#4A41B5',
        coolSoft: '#EDEBFD',
        // Teal, because blue has become wisteria, next to the usual violet.
        link: '#14A3A8',
        correctText: '#0E7445',
        shadow: '#13241A',
      },
      // A mild spring night.
      dark: {
        canvas: '#0A120E',
        surface: '#111C16',
        raised: '#17251D',
        well: '#060B08',
        abyss: '#040805',
        hairline: '#213229',
        hairlineStrong: '#2E4538',
        ink: '#EAF4EC',
        inkMuted: '#AAC0B1',
        inkFaint: '#93AC9B',
        accent: '#FF8FB8',
        accentText: '#FFA9C8',
        accentDeep: '#E0628F',
        accentSoft: '#3A1627',
        cool: '#8C84F0',
        coolText: '#B9B2FF',
        coolDeep: '#5E55D0',
        coolSoft: '#1C1A3A',
        link: '#3FC1C9',
      },
    },
    emoji: { streak: '🌱', complete: '🌷', perfect: '🌈' },
    particles: ['🌸', '🌷', '🦋', '🌼', '🐝', '🌱', '🌸', '🍀'],
    welcome: '🌷',
    toy: { emoji: '🐝', move: 'buzz', creepy: true },
    flyer: { emoji: '🦋', count: 2, size: 22, lapMs: 12000, restMs: 9000, wobble: 26, waves: 4, flapMs: 360, flapAxis: 'x' },
    cardCorner: '🌷',
    screenCorner: '🌸',
    footer: [
      { emoji: '🌱', size: 's' },
      { emoji: '🌷', size: 'l' },
      { emoji: '🐣', size: 'm', lift: true },
      { emoji: '🌷', size: 'l' },
      { emoji: '🌱', size: 's' },
    ],
    look: {
      // A spring morning: blossom pink drifting in from the top left, new
      // green on the right, and a little warm sun low in the middle.
      sky: {
        glows: [
          { color: { light: '#FFD6E5', dark: '#E0628F' }, x: 0.15, y: 0, rx: 0.85, ry: 0.75, alpha: { light: 0.3, dark: 0.24 } },
          { color: { light: '#D5F0CC', dark: '#3FBF6E' }, x: 0.88, y: 0.1, rx: 0.75, ry: 0.7, alpha: { light: 0.3, dark: 0.18 } },
          { color: { light: '#FFF1C2', dark: '#8C84F0' }, x: 0.5, y: 0.7, rx: 0.6, ry: 0.3, alpha: { light: 0.25, dark: 0.08 } },
        ],
        height: 0.6,
        breatheMs: 10000,
      },
      // Petals in three depths, tumbling on a light breeze.
      motes: {
        colors: [
          { light: '#F28DB2', dark: '#FFB8D0' },
          { light: '#F6A9C5', dark: '#FFD3E2' },
          { light: '#E57AA3', dark: '#FF9EC1' },
        ],
        glow: false,
        direction: 'fall',
        motion: 'tumble',
        wind: 60,
        layers: [
          { count: 8, size: 6, crossMs: 26000, opacity: 0.55, sway: 14, parallax: 0.01, front: false, shape: 'petal' },
          { count: 6, size: 10, crossMs: 18000, opacity: 0.8, sway: 22, parallax: 0.03, front: false, shape: 'petal' },
          { count: 3, size: 7, crossMs: 13000, opacity: 0.6, sway: 30, parallax: 0.06, front: true, emoji: ['🌸'] },
        ],
      },
      burst: { ring: '#F06A9B', gravity: 50, spin: 140 },
      // A blossom branch: a green stem with flowers hung along it, swaying.
      garland: {
        colors: [],
        beads: ['🌸', '🌼', '🌸', '🌷'],
        count: 9,
        sag: 12,
        beatMs: 3200,
        wire: { light: '#7FA36F', dark: '#5E8A55' },
      },
      edge: null,
      candle: null,
      mist: null,
      sun: null,
    },
  },

  // -------------------------------------------------------------------------
  // Summer: a sea-blue sky running into sunset, a slow sun, heat shimmering
  // over the ground and fireflies at dusk. A beach ball to bounce.
  // -------------------------------------------------------------------------
  summer: {
    strings: stringsFor('summer'),
    palette: {
      // Sun orange where the app is gold, sea blue where it is blue, on sand.
      light: {
        canvas: '#FFFCF6',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#FBEEDB',
        hairline: '#F1E2CA',
        hairlineStrong: '#E0CAA6',
        ink: '#1E2333',
        inkMuted: '#484F62',
        inkFaint: '#575E71',
        accent: '#FF9F1C',
        accentText: '#A14E00',
        accentDeep: '#8C4400',
        accentSoft: '#FFF0D9',
        cool: '#0B8FB3',
        coolText: '#056B87',
        coolDeep: '#066A86',
        coolSoft: '#E0F5FA',
        correctText: '#0E7445',
        shadow: '#1A1E2A',
      },
      // A summer night: warm navy, the sun gone gold.
      dark: {
        canvas: '#0A0F1C',
        surface: '#111829',
        raised: '#172036',
        well: '#060912',
        abyss: '#04060C',
        hairline: '#1F2A44',
        hairlineStrong: '#2B3A5C',
        ink: '#F4F1EA',
        inkMuted: '#B5B7C5',
        inkFaint: '#A3A6B8',
        accent: '#FFB547',
        accentText: '#FFC56E',
        accentDeep: '#E08A1A',
        accentSoft: '#35260C',
        cool: '#22B8D8',
        coolText: '#80DCF1',
        coolDeep: '#108AA6',
        coolSoft: '#0A2630',
      },
    },
    emoji: { streak: '☀️', complete: '🍉', perfect: '🌞' },
    particles: ['☀️', '🍉', '🐚', '🌴', '🍦', '🌊', '🏐', '🐠'],
    welcome: '🌞',
    toy: { emoji: '🏐', move: 'bounce', creepy: false },
    flyer: null,
    cardCorner: '🕶️',
    screenCorner: '☀️',
    footer: [
      { emoji: '🐚', size: 's' },
      { emoji: '🌴', size: 'l' },
      { emoji: '🍉', size: 'm', lift: true },
      { emoji: '🌴', size: 'l' },
      { emoji: '🐚', size: 's' },
    ],
    look: {
      // Sea blue overhead on the left, the sun's warmth on the right, and a
      // sunset blush low in the middle.
      sky: {
        glows: [
          { color: { light: '#CBEFF8', dark: '#1C8FB8' }, x: 0.12, y: 0, rx: 0.9, ry: 0.75, alpha: { light: 0.24, dark: 0.2 } },
          { color: { light: '#FFE3C2', dark: '#FF7A45' }, x: 0.85, y: 0.12, rx: 0.75, ry: 0.7, alpha: { light: 0.1, dark: 0.12 } },
          { color: { light: '#FFE1EA', dark: '#C2569C' }, x: 0.45, y: 0.72, rx: 0.65, ry: 0.28, alpha: { light: 0.18, dark: 0.08 } },
        ],
        height: 0.6,
        breatheMs: 12000,
      },
      // Fireflies: few, slow, each glowing up and fading on its own beat.
      motes: {
        colors: [{ light: '#D99A06', dark: '#FFE27A' }, { light: '#E0A81E', dark: '#F6FF9E' }],
        glow: true,
        direction: 'rise',
        motion: 'pulse',
        wind: 14,
        layers: [
          { count: 8, size: 2, crossMs: 34000, opacity: 0.55, sway: 26, parallax: 0.01, front: false },
          { count: 6, size: 3, crossMs: 26000, opacity: 0.8, sway: 36, parallax: 0.03, front: false },
          { count: 3, size: 4, crossMs: 20000, opacity: 0.6, sway: 44, parallax: 0.05, front: true, shape: 'spark' },
        ],
      },
      burst: { ring: '#FF9F1C', gravity: 80, spin: 100 },
      garland: null,
      edge: null,
      candle: null,
      // Heat over the ground: thin bands wavering, warm and faint.
      mist: {
        mode: 'shimmer',
        color: { light: '#FFC98A', dark: '#FF9F5A' },
        alpha: { light: 0.22, dark: 0.1 },
        cycleMs: 5200,
      },
      sun: {
        color: { light: '#FFB547', dark: '#FFB547' },
        alpha: { light: 0.12, dark: 0.1 },
        x: 0.86,
        y: 0.08,
        radius: 0.2,
        rays: 12,
        turnMs: 120000,
      },
    },
  },

  // -------------------------------------------------------------------------
  // Autumn: golden hour. Leaves fluttering down, a gust now and then, a few
  // leaves settled on the hero card, and an acorn on a thread.
  // -------------------------------------------------------------------------
  autumn: {
    strings: stringsFor('autumn'),
    palette: {
      // Amber where the app is gold, dusk blue where it is blue, on parchment.
      light: {
        canvas: '#FBF6EE',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#F2E7D6',
        hairline: '#EADCC6',
        hairlineStrong: '#D8C3A3',
        ink: '#2A1F17',
        inkMuted: '#58483B',
        inkFaint: '#655446',
        accent: '#E07A1F',
        accentText: '#9B480A',
        accentDeep: '#843C07',
        accentSoft: '#FCEBD8',
        cool: '#3C6E91',
        coolText: '#2B5573',
        coolDeep: '#2B5573',
        coolSoft: '#E3EDF4',
        correctText: '#0E7445',
        shadow: '#22170F',
      },
      // A wood-smoke evening.
      dark: {
        canvas: '#120D09',
        surface: '#1B140E',
        raised: '#241A12',
        well: '#0A0705',
        abyss: '#070503',
        hairline: '#33261B',
        hairlineStrong: '#463424',
        ink: '#F4ECE2',
        inkMuted: '#C3B4A3',
        inkFaint: '#B3A291',
        accent: '#F29A3E',
        accentText: '#FFB565',
        accentDeep: '#C96F1A',
        accentSoft: '#3A2410',
        cool: '#5E95BF',
        coolText: '#9CC6E6',
        coolDeep: '#3C6E91',
        coolSoft: '#13212D',
      },
    },
    emoji: { streak: '🍁', complete: '🥧', perfect: '🍎' },
    particles: ['🍁', '🍂', '🌰', '🍄', '🍎', '🦔', '🍁', '🥧'],
    welcome: '🍁',
    toy: { emoji: '🌰', move: 'drop', creepy: false },
    // A gust: a handful of leaves blown across together, spinning.
    flyer: { emoji: ['🍂', '🍁', '🍂', '🍁'], count: 4, size: 20, lapMs: 4600, restMs: 16000, wobble: 34, waves: 2, spin: 600, spacingMs: 280 },
    cardCorner: '🍁',
    screenCorner: '🍂',
    footer: [
      { emoji: '🍄', size: 's' },
      { emoji: '🍁', size: 'l' },
      { emoji: '🦔', size: 'm', lift: true },
      { emoji: '🍁', size: 'l' },
      { emoji: '🌰', size: 's' },
    ],
    look: {
      // Golden hour: amber light low from the right, a rose haze on the
      // left, and gold under it all.
      sky: {
        glows: [
          { color: { light: '#FFE0B5', dark: '#E8892B' }, x: 0.85, y: 0.1, rx: 0.85, ry: 0.8, alpha: { light: 0.34, dark: 0.25 } },
          { color: { light: '#FFD9CC', dark: '#B5442A' }, x: 0.1, y: 0, rx: 0.75, ry: 0.7, alpha: { light: 0.28, dark: 0.22 } },
          { color: { light: '#FFF0C4', dark: '#F2C14E' }, x: 0.45, y: 0.72, rx: 0.65, ry: 0.28, alpha: { light: 0.25, dark: 0.07 } },
        ],
        height: 0.6,
        breatheMs: 11000,
      },
      // Leaves in three depths, swinging down on a steady wind.
      motes: {
        colors: [
          { light: '#D9822B', dark: '#F29A3E' },
          { light: '#B8502E', dark: '#E06A45' },
          { light: '#C49A1E', dark: '#E8C547' },
        ],
        glow: false,
        direction: 'fall',
        motion: 'flutter',
        wind: 80,
        layers: [
          { count: 7, size: 6, crossMs: 24000, opacity: 0.55, sway: 18, parallax: 0.01, front: false, shape: 'leaf' },
          { count: 5, size: 10, crossMs: 17000, opacity: 0.75, sway: 28, parallax: 0.03, front: false, shape: 'leaf' },
          { count: 2, size: 8, crossMs: 12000, opacity: 0.65, sway: 36, parallax: 0.06, front: true, emoji: ['🍁', '🍂'] },
        ],
      },
      burst: { ring: '#E07A1F', gravity: 70, spin: 220 },
      garland: null,
      edge: { kind: 'scatter', emoji: ['🍂', '🍁', '🍂'] },
      candle: null,
      mist: null,
      sun: null,
    },
  },

  // -------------------------------------------------------------------------
  // Winter: a crisp, clear day after the holidays. Ice crystals catching the
  // light, frost along the hero card, breath-like mist, a mitten.
  // -------------------------------------------------------------------------
  winter: {
    strings: stringsFor('winter'),
    palette: {
      // Glacier cyan where the app is gold, periwinkle where it is blue, on
      // a cold white. No gold anywhere: that is Christmas.
      light: {
        canvas: '#F4F7FC',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#E8EEF7',
        hairline: '#DAE2F0',
        hairlineStrong: '#C3CFE3',
        ink: '#17203A',
        inkMuted: '#45506A',
        inkFaint: '#535F7A',
        accent: '#3FB5D0',
        accentText: '#0D6880',
        accentDeep: '#0B5B70',
        accentSoft: '#E1F5FA',
        cool: '#5B6CD6',
        coolText: '#3F4FB5',
        coolDeep: '#3F4FB0',
        coolSoft: '#ECEEFC',
        // Rose, because blue has become periwinkle, next to the usual violet.
        link: '#D9668F',
        correctText: '#0E7445',
        shadow: '#121A30',
      },
      // A clear, starry, indigo night.
      dark: {
        canvas: '#0D0F20',
        surface: '#14182E',
        raised: '#1A1F3A',
        well: '#080915',
        abyss: '#05060F',
        hairline: '#252B4A',
        hairlineStrong: '#323A62',
        ink: '#EEF1FB',
        inkMuted: '#B0B7D0',
        inkFaint: '#98A0BD',
        accent: '#6FD3EA',
        accentText: '#8FE1F2',
        accentDeep: '#3FB5D0',
        accentSoft: '#0E2A33',
        cool: '#7D8BF0',
        coolText: '#B0B9FF',
        coolDeep: '#5B6CD6',
        coolSoft: '#181E40',
        link: '#F08DB0',
      },
    },
    emoji: { streak: '❄️', complete: '☕', perfect: '⛸️' },
    particles: ['❄️', '🧤', '☕', '🧣', '⛸️', '🐧', '🌨️', '🧊'],
    welcome: '☃️',
    toy: { emoji: '🧤', move: 'swing', creepy: false },
    // A robin, now and then. Faces left in most emoji fonts.
    flyer: { emoji: '🐦', count: 1, size: 20, lapMs: 7000, restMs: 14000, wobble: 12, waves: 3, mirror: true, flapMs: 300 },
    cardCorner: '🧣',
    screenCorner: '❄️',
    footer: [
      { emoji: '🧊', size: 's' },
      { emoji: '🌲', size: 'l' },
      { emoji: '🐧', size: 'm', lift: true },
      { emoji: '🌲', size: 'l' },
      { emoji: '🧊', size: 's' },
    ],
    look: {
      // Ice light from the top left, a lavender cold on the right, and a
      // pale silver low across the middle.
      sky: {
        glows: [
          { color: { light: '#D5F0F8', dark: '#3FB5D0' }, x: 0.15, y: 0, rx: 0.85, ry: 0.75, alpha: { light: 0.34, dark: 0.22 } },
          { color: { light: '#E2E0FB', dark: '#7D8BF0' }, x: 0.85, y: 0.08, rx: 0.8, ry: 0.75, alpha: { light: 0.32, dark: 0.24 } },
          { color: { light: '#EAF0FA', dark: '#C9D6FF' }, x: 0.5, y: 0.7, rx: 0.7, ry: 0.3, alpha: { light: 0.3, dark: 0.06 } },
        ],
        height: 0.6,
        breatheMs: 14000,
      },
      // Ice crystals, few and slow, catching the light as they turn.
      motes: {
        colors: [{ light: '#5B8FC4', dark: '#E6F0FF' }, { light: '#7C93D6', dark: '#C9D6FF' }],
        glow: false,
        direction: 'fall',
        motion: 'glint',
        wind: 24,
        layers: [
          { count: 12, size: 3, crossMs: 32000, opacity: 0.6, sway: 8, parallax: 0.01, front: false },
          { count: 8, size: 8, crossMs: 24000, opacity: 0.85, sway: 12, parallax: 0.03, front: false, shape: 'spark' },
          { count: 3, size: 11, crossMs: 18000, opacity: 0.6, sway: 16, parallax: 0.06, front: true, shape: 'spark' },
        ],
      },
      burst: { ring: '#3FB5D0', gravity: 40, spin: 160 },
      garland: null,
      edge: { kind: 'frost', color: { light: '#9CC4E4', dark: '#DDEBFF' } },
      candle: null,
      // Mist like breath on a cold day: swelling, rising a little, settling.
      mist: {
        mode: 'breathe',
        color: { light: '#D3DEF0', dark: '#9FB3D9' },
        alpha: { light: 0.24, dark: 0.13 },
        cycleMs: 7000,
      },
      sun: null,
    },
  },

  // -------------------------------------------------------------------------
  // Halloween: dusk, embers, fog, bats, a spider, lit pumpkins.
  // -------------------------------------------------------------------------
  halloween: {
    strings: stringsFor('halloween'),
    palette: {
      // Pumpkin for the streak and XP, violet where the app is usually blue,
      // and a warm parchment canvas. Mint stays, and reads as slime green.
      light: {
        canvas: '#FBF5EC',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#F3E8D8',
        hairline: '#EDE2D2',
        hairlineStrong: '#D9C9B2',
        ink: '#241A2E',
        inkMuted: '#4F4060',
        inkFaint: '#625371',
        accent: '#FF8A1F',
        accentText: '#A84A00',
        accentDeep: '#8F4100',
        accentSoft: '#FFEBD6',
        cool: '#7B4DE8',
        coolText: '#5B32C4',
        coolDeep: '#5B32C4',
        coolSoft: '#EFE8FF',
        // Teal, because blue has become violet.
        link: '#14A3A8',
        correctText: '#0E7445',
        shadow: '#1A0F24',
      },
      // A midnight-purple night.
      dark: {
        canvas: '#0D0815',
        surface: '#160E22',
        raised: '#1F142F',
        well: '#07040C',
        abyss: '#07040C',
        hairline: '#2E2140',
        hairlineStrong: '#3F2E55',
        ink: '#EEE6F5',
        inkMuted: '#B9ABCC',
        inkFaint: '#9D8EB3',
        accent: '#FF8A1F',
        accentText: '#FFA348',
        accentDeep: '#D9650A',
        accentSoft: '#3A220C',
        cool: '#7B4DE8',
        coolText: '#C4A8FF',
        coolDeep: '#5B32C4',
        coolSoft: '#22163A',
        link: '#3FC1C9',
      },
    },
    emoji: { streak: '🎃', complete: '🎃', perfect: '🧙' },
    particles: ['🎃', '🦇', '👻', '🍬', '🎃', '🕷️', '🍭', '👻'],
    welcome: '🎃',
    toy: { emoji: '🕷️', move: 'drop', creepy: true },
    flyer: { emoji: '🦇', count: 3, size: 24, lapMs: 7000, restMs: 9000, wobble: 18, waves: 2, flapMs: 420 },
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
        colors: [{ light: '#E8700F', dark: '#FFA348' }],
        glow: true,
        direction: 'rise',
        motion: 'drift',
        wind: 18,
        layers: [
          { count: 7, size: 2, crossMs: 26000, opacity: 0.35, sway: 10, parallax: 0.01, front: false },
          { count: 5, size: 3, crossMs: 19000, opacity: 0.5, sway: 16, parallax: 0.025, front: false },
          { count: 3, size: 4, crossMs: 14000, opacity: 0.55, sway: 22, parallax: 0.05, front: true },
        ],
      },
      burst: { ring: '#FF8A1F', gravity: 70, spin: 120 },
      garland: null,
      edge: null,
      candle: { color: '#FF8A1F', flickerMs: 2600 },
      mist: {
        mode: 'drift',
        color: { light: '#E6DDF0', dark: '#6B5A88' },
        alpha: { light: 0.2, dark: 0.22 },
        cycleMs: 42000,
      },
      sun: null,
    },
  },

  // -------------------------------------------------------------------------
  // Christmas: a snowy night. Fairy lights, snow on the hero card, a sleigh,
  // a bell.
  // -------------------------------------------------------------------------
  christmas: {
    strings: stringsFor('christmas'),
    palette: {
      // Frost blue where the app is usually blue, candle gold for the streak
      // and XP, and a cold canvas. Red and green come from the decorations
      // only, never from the palette, where they would read as "wrong" and
      // "correct".
      light: {
        canvas: '#F3F7FB',
        surface: '#FFFFFF',
        raised: '#FFFFFF',
        well: '#E8EFF7',
        hairline: '#DCE6F0',
        hairlineStrong: '#C3D2E2',
        ink: '#14233A',
        inkMuted: '#45566D',
        inkFaint: '#536580',
        accent: '#FFC23D',
        accentText: '#8A5A00',
        accentDeep: '#6E4700',
        accentSoft: '#FFF3D6',
        cool: '#2E7BD1',
        coolText: '#1C5A9E',
        coolDeep: '#1C5A9E',
        coolSoft: '#E4F0FB',
        correctText: '#0E7445',
        shadow: '#0A1626',
      },
      dark: {
        canvas: '#081120',
        surface: '#0E1A2C',
        raised: '#132238',
        well: '#040912',
        abyss: '#040912',
        hairline: '#1E3048',
        hairlineStrong: '#2C4260',
        ink: '#E8F1FA',
        inkMuted: '#A9BBD0',
        inkFaint: '#93A7BF',
        accent: '#FFC23D',
        accentText: '#FFD36B',
        accentDeep: '#E0A526',
        accentSoft: '#33270B',
        cool: '#2E7BD1',
        coolText: '#8CC4FF',
        coolDeep: '#1C5A9E',
        coolSoft: '#10233A',
      },
    },
    emoji: { streak: '🎄', complete: '🎁', perfect: '🎅' },
    particles: ['❄️', '🎁', '⭐', '🍪', '🎄', '🔔', '🦌', '☃️'],
    welcome: '🎅',
    toy: { emoji: '🔔', move: 'swing', creepy: false },
    // Reindeer face left in most emoji fonts; mirrored, they pull the sleigh
    // the way it flies.
    flyer: { emoji: '🦌🦌🛷', count: 1, size: 26, lapMs: 9000, restMs: 16000, wobble: 10, waves: 1, mirror: true },
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
      // Snow in three depths, blown a little to the right, a snowflake or
      // two among the nearest.
      motes: {
        colors: [{ light: '#7FA9D6', dark: '#FFFFFF' }],
        glow: false,
        direction: 'fall',
        motion: 'drift',
        wind: 40,
        layers: [
          { count: 12, size: 3, crossMs: 24000, opacity: 0.45, sway: 8, parallax: 0.01, front: false },
          { count: 8, size: 5, crossMs: 16000, opacity: 0.65, sway: 14, parallax: 0.03, front: false },
          { count: 3, size: 7, crossMs: 11000, opacity: 0.55, sway: 20, parallax: 0.06, front: true, emoji: ['❄️'] },
        ],
      },
      burst: { ring: '#FFC23D', gravity: 60, spin: 90 },
      // Old-fashioned warm bulbs; red and green here are tree lights, not
      // "wrong" and "correct": they sit above the content and mean nothing.
      garland: { colors: ['#FF5A5F', '#FFC23D', '#3FC1C9', '#2FBF71', '#B98CFF'], count: 11, sag: 14, beatMs: 2400 },
      edge: { kind: 'snow', color: { light: '#FFFFFF', dark: '#E8F1FA' } },
      candle: null,
      mist: null,
      sun: null,
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
