/**
 * OpenMacro's seasons: the year, dressed up.
 *
 * Everything about seasons lives in `@openmacro/seasons`, which knows
 * nothing about this product: the engine (calendar maths, the viewer's
 * preference, the remote kill switch, the pre-paint boot script), the six
 * preset seasons as data, and the renderers for React Native and the web.
 * OpenMacro uses it exactly as another app would, and this file is the whole
 * of what it chooses: the northern calendar, all six presets, where the
 * remote config lives and the prefix of its storage keys.
 *
 * A season changes how the app and the site *look* and nothing else. What is
 * asked, what counts as correct and what the learner is told stay exactly
 * the same, so a season never touches content or the engine (see "The parity
 * rule" in CONTRIBUTING.md). Both clients draw the same packs, from here.
 *
 * ## Adding a season
 *
 * See `docs/seasons.md`: a pack (in the package's presets, or here for one
 * only OpenMacro wants), a window, and its strings in every UI catalogue.
 * The type checker enforces the strings (`SEASON_PACKS` is typed against
 * `UiKey`); `npm run check:seasons` measures the palette and the motion.
 *
 * Dependency-free at runtime, so the web can serialise `SEASONS` into the
 * inline script that sets the season before first paint.
 */

import {
  NORTHERN_CALENDAR,
  PRESET_IDS,
  PRESET_PACKS,
  TOY_LINES,
  toyReaction,
  type PresetId,
  type SeasonPack as PackOf,
} from '@openmacro/seasons/presets';
import type { SeasonWindow } from '@openmacro/seasons/types';
import type { UiKey } from './i18n/ui/en';

export type {
  CardEdge,
  DepthLayer,
  FooterOrnament,
  Garland,
  Mist,
  MoteMotion,
  MoteShape,
  SeasonColors,
  SeasonPalette,
  SeasonScene,
  SkyGlow,
  Sun,
  Tinted,
  ToyMove,
} from '@openmacro/seasons/presets';

export { TOY_LINES, toyReaction };

/** Every season either client knows how to draw: the six presets, and El Salvador. */
export type SeasonId = PresetId | 'el-salvador';

/**
 * El Salvador, for the week of the Bitcoin conference in San Salvador:
 * the flag's cobalt blue and white, volcanoes and coffee, the torogoz (the
 * national bird) on a thread, and in the app the national anthem (Juan
 * Aberle, 1879, public domain; `src/seasons/music.ts`). OpenMacro's own
 * pack, not a preset: no other app wants it.
 */
const EL_SALVADOR: SeasonPack = {
  strings: {
    name: 'season.el-salvador.name',
    greeting: 'season.el-salvador.greeting',
    welcome: 'season.el-salvador.welcome',
    toy: ['season.el-salvador.toy.1', 'season.el-salvador.toy.2', 'season.el-salvador.toy.3'],
  },
  palette: {
    // The flag: cobalt blue on white, with the coat of arms' green as the cool.
    light: {
      canvas: '#F7FAFF',
      surface: '#FFFFFF',
      raised: '#FFFFFF',
      well: '#E6EEFB',
      hairline: '#D7E2F5',
      hairlineStrong: '#B7C9EA',
      ink: '#14213D',
      inkMuted: '#3E4C6B',
      inkFaint: '#4E5B78',
      accent: '#0F47AF',
      accentText: '#0F47AF',
      accentDeep: '#0B3A8F',
      accentSoft: '#E3ECFB',
      cool: '#13805B',
      coolText: '#0E6B4B',
      coolDeep: '#0B5C40',
      coolSoft: '#E2F4EC',
      correctText: '#0E7445',
      shadow: '#101A33',
    },
    // A San Salvador night: deep blue, the stripes gone pale.
    dark: {
      canvas: '#08122A',
      surface: '#0E1A38',
      raised: '#142347',
      well: '#050C1E',
      abyss: '#030814',
      hairline: '#1C2C55',
      hairlineStrong: '#2A3F73',
      ink: '#F2F5FB',
      inkMuted: '#B4BED6',
      inkFaint: '#A0ACC8',
      accent: '#6E9BF0',
      accentText: '#9CBCF6',
      accentDeep: '#3F73D6',
      accentSoft: '#13244A',
      cool: '#3CC08E',
      coolText: '#86DDB9',
      coolDeep: '#1E9468',
      coolSoft: '#0B2A22',
    },
  },
  emoji: { streak: '🌋', complete: '🇸🇻', perfect: '⭐' },
  particles: ['🇸🇻', '🌋', '☕', '🌺', '⭐', '🌊', '🐦', '💙'],
  welcome: '🇸🇻',
  toy: { emoji: '🐦', move: 'swing', creepy: false },
  flyer: null,
  cardCorner: '🇸🇻',
  screenCorner: '🌋',
  footer: [
    { emoji: '☕', size: 's' },
    { emoji: '🌋', size: 'l' },
    { emoji: '🇸🇻', size: 'm', lift: true },
    { emoji: '🌋', size: 'l' },
    { emoji: '🌺', size: 's' },
  ],
  look: {
    // Two bands of flag blue above and below a white sky.
    sky: {
      glows: [
        { color: { light: '#C9DAF8', dark: '#2A5BC4' }, x: 0.15, y: 0, rx: 0.9, ry: 0.6, alpha: { light: 0.3, dark: 0.22 } },
        { color: { light: '#C9DAF8', dark: '#2A5BC4' }, x: 0.85, y: 0.05, rx: 0.8, ry: 0.55, alpha: { light: 0.22, dark: 0.18 } },
        { color: { light: '#DDF2E8', dark: '#1E9468' }, x: 0.5, y: 0.7, rx: 0.6, ry: 0.25, alpha: { light: 0.14, dark: 0.07 } },
      ],
      height: 0.55,
      breatheMs: 12000,
    },
    // Blue and white confetti, drifting down slowly.
    motes: {
      colors: [{ light: '#0F47AF', dark: '#9CBCF6' }, { light: '#8FB0EA', dark: '#F2F5FB' }],
      glow: false,
      direction: 'fall',
      motion: 'tumble',
      wind: 10,
      layers: [
        { count: 8, size: 3, crossMs: 30000, opacity: 0.45, sway: 24, parallax: 0.01, front: false },
        { count: 6, size: 4, crossMs: 24000, opacity: 0.6, sway: 32, parallax: 0.03, front: false },
      ],
    },
    burst: { ring: '#0F47AF', gravity: 90, spin: 120 },
    garland: { colors: [], beads: ['🇸🇻', '⭐'], count: 9, sag: 10, beatMs: 3200 },
    edge: null,
    candle: null,
    mist: null,
    sun: null,
  },
};

/** A season, with its words as keys of OpenMacro's own UI catalogue. */
export type SeasonPack = PackOf<UiKey>;

/**
 * The calendar, in the learner's local time, both ends inclusive: the
 * northern hemisphere's (the package's `NORTHERN_CALENDAR`). The remote
 * config can move a window or switch a season off without a release (see
 * `docs/seasons.md`).
 */
export const SEASONS: readonly SeasonWindow<SeasonId>[] = [
  ...NORTHERN_CALENDAR,
  // 9 to 13 November 2026 only: the conference week. A window has no year,
  // so the year is checked here, where the calendar is read, and the window
  // is gone from 2027 on. Delete it once the week has passed.
  ...(new Date().getFullYear() === 2026
    ? [{ id: 'el-salvador' as const, from: { month: 11, day: 9 }, to: { month: 11, day: 13 }, priority: 1 }]
    : []),
];

/** Every valid id. */
export const SEASON_IDS: readonly SeasonId[] = [...PRESET_IDS, 'el-salvador'];

/**
 * What each season hangs up: the presets as they are. Typed against
 * `UiKey`, so a season whose words are missing from the English catalogue
 * does not compile.
 */
export const SEASON_PACKS: Readonly<Record<SeasonId, SeasonPack>> = {
  ...PRESET_PACKS,
  'el-salvador': EL_SALVADOR,
};

/**
 * Where the remote season config is served. A JSON document, validated
 * strictly; `{ "version": 1 }` changes nothing. See `docs/seasons.md`.
 */
export const SEASONS_REMOTE_URL = 'https://openmacro.org/api/seasons';

/** The prefix for every key the season controller stores, on either client. */
export const SEASONS_KEY_PREFIX = 'openmacro.seasons';
