/**
 * What a season *is*, as plain data: its palette, its sky, its particles,
 * its small signature details, its toy and the keys of its words.
 *
 * Types only. A pack is serialisable (no functions, no components), so it
 * can be written by hand, shipped in a remote config or generated, and both
 * renderers (`@openmacro/seasons/native` and `@openmacro/seasons/web`) draw
 * any pack with the same components. A new season is a new object, never
 * new component code.
 *
 * Colours are `#rrggbb` throughout, so `checkPack` can composite them and
 * measure the text on top.
 */

import type { SeasonTrack } from '../music.ts';

/**
 * A colour that differs by appearance. `#rrggbb` only, so `checkPack`
 * can composite it over the canvas and measure the text on top.
 */
export interface Tinted {
  readonly light: string;
  readonly dark: string;
}

/**
 * A season's colours for one appearance, by *role* rather than by any app's
 * token names. Each app maps the roles onto its own tokens with one typed
 * function (see `mapPalette` and the README's "Palette roles"), so a pack
 * fits any design system. `#rrggbb` throughout.
 *
 * Only accents and surfaces move. Status colours ("correct" green, "wrong"
 * red) are deliberately not here: they mean the same thing all year, and a
 * user should never have to relearn that for a month.
 *
 * `checkPack` holds every text role to WCAG AA (4.5:1) on every surface
 * role, in both appearances, under the sky and the mist too.
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
  /** The warm accent (a streak, points, highlights): a fill. */
  readonly accent: string;
  /** The warm accent as text. */
  readonly accentText: string;
  /** A deeper warm fill, for pressed edges. */
  readonly accentDeep: string;
  /** A pale warm wash, behind accent text. */
  readonly accentSoft: string;
  /** The cool accent (actions, links): a fill. */
  readonly cool: string;
  /** The cool accent as text. */
  readonly coolText: string;
  /** A deeper cool fill, for a button's bevel. */
  readonly coolDeep: string;
  /** A pale cool wash. */
  readonly coolSoft: string;
  /** A link colour, where the cool accent is too close to the text to read as one. */
  readonly link?: string;
  /** A success green as text, a shade deeper where the season's sky would wash it out. */
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
 * screen, `SeasonScene.sky.height` of its height), so the same numbers fit a
 * phone and a desktop window. A glow must fade out inside the band
 * (`y + ry <= 1`), or the band's edge cuts it in a hard line; the native
 * band has no mask to hide one. `checkPack` holds every glow to this.
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
  /** How many particles, at most. A renderer may draw fewer on a small screen. */
  readonly count: number;
  /** Particle size, in points (native) or CSS pixels (web). An emoji is drawn at about twice this. */
  readonly size: number;
  /** How long one particle takes to cross the screen, in milliseconds. */
  readonly crossMs: number;
  /** Peak opacity. */
  readonly opacity: number;
  /** How far a particle sways side to side, in points. */
  readonly sway: number;
  /**
   * How far the layer follows the pointer on the web, as a fraction of the
   * pointer's offset from the centre (0 = fixed at infinity). Native has no
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
 * A garland strung along the top of a screen: fairy lights at Christmas, a
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
 * Something settled on the top edge of a card (the one the app wants to
 * make a fuss of).
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
 * Something low along the bottom of a screen, behind the content.
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
  /** Peak opacity of the core, by appearance. Measured with the sky by `checkPack`. */
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
 * signature details. Plain values, so every renderer draws the same art
 * direction from one place, and `checkPack` can measure it.
 *
 * Everything that moves here is drawn only in the full look; the calm look
 * keeps the sky (still) and the still details, and Reduce Motion the same.
 *
 * (Named a scene rather than a look so it does not clash with the engine's
 * `SeasonLook`, which is `full` or `calm`. The pack's field is still `look`.)
 */
export interface SeasonScene {
  /** The tinted glow behind the top of every screen. */
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
  /** A garland along the top of a screen, if any. */
  readonly garland: Garland | null;
  /** Something settled on a card's top edge, if anything. */
  readonly edge: CardEdge | null;
  /** A candle flickering inside the footer's lit ornaments (pumpkins), if any. */
  readonly candle: {
    /** `#rrggbb`. */
    readonly color: string;
    /** One irregular flicker cycle, in milliseconds. At least 1000. */
    readonly flickerMs: number;
  } | null;
  /** Fog, mist or heat lying along the bottom of a screen, if any. */
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
  /** Lit from inside by the season's candle (`SeasonScene.candle`), like a jack-o'-lantern. */
  readonly lit?: boolean;
}

/**
 * How the toy on a thread at the top of a screen answers a tap.
 *
 * - `drop`: it falls most of the way down the screen and climbs back.
 * - `swing`: it rings like a bell.
 * - `bounce`: it drops a little way and bounces on its thread, squashing
 *   at the bottom of each bounce, like a ball on elastic.
 * - `buzz`: it darts about in a little loop and back.
 */
export type ToyMove = 'drop' | 'swing' | 'bounce' | 'buzz';

/**
 * A season's words, as *keys*, never as text: the renderers pass each key
 * through the app's `translate` function. Use the presets' keys with the
 * bundled strings (`createTranslator`), or your own i18n keys and your own
 * `t`. `Key` narrows them to your catalogue's keys, so the type checker
 * proves every season has its words.
 *
 * @typeParam Key The app's string keys.
 */
export interface SeasonStrings<Key extends string = string> {
  /** Its name, for a settings hint: "Halloween". */
  readonly name: Key;
  /** The greeting pill: "🎃 Happy Halloween!". */
  readonly greeting: Key;
  /** The once-a-day welcome, with a `{name}`: "Happy Halloween, {name}!". */
  readonly welcome: Key;
  /** What the toy says, every third tap in turn. */
  readonly toy: readonly Key[];
}

/**
 * Everything a season is, as one plain object every renderer draws. Emoji
 * throughout, so a new season ships as an over-the-air update and weighs
 * nothing; an app may draw a part with its own artwork instead (the `art`
 * option of either provider), as long as it means the same thing.
 *
 * @typeParam Key The app's string keys (see `SeasonStrings`).
 */
export interface SeasonPack<Key extends string = string> {
  /** Its words, as keys. */
  readonly strings: SeasonStrings<Key>;
  /** Its colours. */
  readonly palette: SeasonPalette;
  /** Swaps for the app's own emoji, by role (`useSeasonEmoji`). The meaning stays; the picture dresses up. */
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
   * The toy on a thread at the top of a screen, the one thing a user can
   * play with. Each tap moves it; every third tap it says something (its
   * `strings.toy`, in turn), and every tenth it throws a burst.
   */
  readonly toy: {
    readonly emoji: string;
    readonly move: ToyMove;
    /** Hidden in the calm look. Spiders and bees are; bells are not. */
    readonly creepy: boolean;
  };
  /** What crosses the top of the screen now and then, if anything. Only ever in the full look. */
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
  readonly look: SeasonScene;
  /**
   * Music for the season, if any: tracks whose audio the app supplies (the
   * presets ship none). Played only in the full look with the preference On;
   * see `musicFor` and the hooks `useSeasonMusic`.
   */
  readonly music?: readonly SeasonTrack[];
}
