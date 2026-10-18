/**
 * The six preset seasons, as data: spring, summer, autumn and winter, which
 * between them cover the year, and Halloween and Christmas, which sit inside
 * them. Use them as they are, pick a few, or copy one as the start of your
 * own (see the README's "Define your own season").
 *
 * Each pack's words are keys (`season.<id>.name` and so on) with English
 * and European Portuguese text bundled in `strings.ts`; map them onto your
 * own i18n keys, or pass your own `translate`, to use your catalogue.
 */

import type { SeasonPack, SeasonStrings } from './types.ts';

/** Every preset season. */
export type PresetId = 'spring' | 'summer' | 'autumn' | 'winter' | 'halloween' | 'christmas';

/** Every preset id, nature seasons first. */
export const PRESET_IDS: readonly PresetId[] = ['spring', 'summer', 'autumn', 'winter', 'halloween', 'christmas'];

/** How many lines each preset's toy has (`season.<id>.toy.1` to `.3`). */
export const TOY_LINES = 3;

/** The string keys of one preset season. */
export type PresetSeasonKey<Id extends PresetId = PresetId> =
  | `season.${Id}.name`
  | `season.${Id}.greeting`
  | `season.${Id}.welcome`
  | `season.${Id}.toy.${1 | 2 | 3}`;

/**
 * A preset's string keys, by convention: `season.<id>.name`, `.greeting`,
 * `.welcome` and `.toy.1` to `.3`.
 *
 * @param id The season.
 * @return Its keys.
 */
export function presetStrings<Id extends PresetId>(id: Id): SeasonStrings<PresetSeasonKey<Id>> {
  return {
    name: `season.${id}.name`,
    greeting: `season.${id}.greeting`,
    welcome: `season.${id}.welcome`,
    toy: [`season.${id}.toy.1`, `season.${id}.toy.2`, `season.${id}.toy.3`],
  };
}

/** Shorthand used by the packs below. */
const stringsFor = presetStrings;

// ---------------------------------------------------------------------------
// The seasons
// ---------------------------------------------------------------------------

/** What each preset season hangs up. */
export const PRESET_PACKS: Readonly<{ [Id in PresetId]: SeasonPack<PresetSeasonKey<Id>> }> = {
  // -------------------------------------------------------------------------
  // Spring: blossom and new leaves. Petals tumbling, butterflies, a blossom
  // branch along the top, and a bee to bother.
  // -------------------------------------------------------------------------
  spring: {
    strings: stringsFor('spring'),
    palette: {
      // Blossom pink for the warm accent, wisteria for the cool one, on a
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
      // Sun orange for the warm accent, sea blue for the cool one, on sand.
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
    particles: ['☀️', '🍉', '🐚', '🌴', '🍦', '🌊', '🏖️', '🐠'],
    welcome: '🌞',
    // A beach ball, drawn: there is no emoji for one, and 🏐 is a volleyball.
    toy: { emoji: '🏐', shape: 'beach-ball', move: 'bounce', creepy: false },
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
          { count: 8, size: 2.5, crossMs: 34000, opacity: 0.65, sway: 26, parallax: 0.01, front: false },
          { count: 6, size: 3.5, crossMs: 26000, opacity: 0.9, sway: 36, parallax: 0.03, front: false },
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
      // Amber for the warm accent, dusk blue for the cool one, on parchment.
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
      // Glacier cyan for the warm accent, periwinkle for the cool one, on
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
      edge: { kind: 'frost', color: { light: '#7FB0DE', dark: '#DDEBFF' } },
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
      // Pumpkin for the warm accent, violet for the cool one, and a warm
      // parchment canvas. A success green stays, and reads as slime green.
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
      // Frost blue for the cool accent, candle gold for the warm one, and
      // a cold canvas. Red and green come from the decorations
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

/**
 * What the toy does on a given tap: nothing to say, a line, or a burst.
 *
 * Shared by both renderers, so the native spider and the web one are
 * equally chatty.
 *
 * @param taps How many times it has been tapped, this one included.
 * @param lines How many lines the toy has. Default `TOY_LINES`.
 * @return The line number (1 to `lines`) to say, `burst`, or `null`.
 */
export function toyReaction(taps: number, lines: number = TOY_LINES): number | 'burst' | null {
  if (taps > 0 && taps % 10 === 0) return 'burst';
  if (taps > 0 && taps % 3 === 0) return ((taps / 3 - 1) % Math.max(1, lines)) + 1;
  return null;
}
