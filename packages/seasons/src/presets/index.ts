/**
 * `@openmacro/seasons/presets`: six seasons as data, ready to use or to copy.
 *
 * Spring, summer, autumn and winter cover the year; Halloween and Christmas
 * sit inside them. Each is one `SeasonPack`: palette (by role), sky,
 * particles, signature details, toy and the keys of its words, with English
 * and European Portuguese bundled. Calendars for both hemispheres, a
 * translator, the palette roles and `checkPack` come with them.
 *
 * Dependency-free and framework-free: a server, a build script or a test
 * can import this without React.
 */

export { BEACH_BALL, type ToyShape } from './drawings.ts';
export { NORTHERN_CALENDAR, SOUTHERN_CALENDAR, presetCalendar, type Hemisphere } from './calendar.ts';
export { AA, atmosphereOver, checkPack, composite, contrast, luminance, worstSky, type CheckOptions } from './check.ts';
export {
  GLOW_FALLOFF,
  MAX_FRONT_OPACITY,
  MAX_GLOW_ALPHA,
  MAX_PARTICLES,
  MIN_CYCLE_MS,
  RAY_FALLOFF,
  RAY_STRENGTH,
  SUN_FALLOFF,
  SUN_REACH,
  type Falloff,
} from './optics.ts';
export { PRESET_IDS, PRESET_PACKS, TOY_LINES, presetStrings, toyReaction, type PresetId, type PresetSeasonKey } from './packs.ts';
export { PALETTE_ROLES, SURFACE_ROLES, TEXT_ROLES, mapPalette, type PaletteRole, type RoleInfo, type RoleKind } from './palette.ts';
export {
  PRESET_STRINGS,
  createTranslator,
  interpolate,
  presetLocale,
  type ChromeKey,
  type PresetDictionary,
  type PresetLocale,
  type PresetStringKey,
  type Translate,
  type TranslateValues,
} from './strings.ts';
export type {
  CardEdge,
  DepthLayer,
  FooterOrnament,
  Garland,
  Mist,
  MoteMotion,
  MoteShape,
  SeasonColors,
  SeasonPack,
  SeasonPalette,
  SeasonScene,
  SeasonStrings,
  SkyGlow,
  Sun,
  Tinted,
  ToyMove,
} from './types.ts';
