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

/** Every season either client knows how to draw: all six presets. */
export type SeasonId = PresetId;

/** A season, with its words as keys of OpenMacro's own UI catalogue. */
export type SeasonPack = PackOf<UiKey>;

/**
 * The calendar, in the learner's local time, both ends inclusive: the
 * northern hemisphere's (the package's `NORTHERN_CALENDAR`). The remote
 * config can move a window or switch a season off without a release (see
 * `docs/seasons.md`).
 */
export const SEASONS: readonly SeasonWindow<SeasonId>[] = NORTHERN_CALENDAR;

/** Every valid id. */
export const SEASON_IDS: readonly SeasonId[] = PRESET_IDS;

/**
 * What each season hangs up: the presets as they are. Typed against
 * `UiKey`, so a season whose words are missing from the English catalogue
 * does not compile.
 */
export const SEASON_PACKS: Readonly<Record<SeasonId, SeasonPack>> = PRESET_PACKS;

/**
 * Where the remote season config is served. A JSON document, validated
 * strictly; `{ "version": 1 }` changes nothing. See `docs/seasons.md`.
 */
export const SEASONS_REMOTE_URL = 'https://openmacro.org/api/seasons';

/** The prefix for every key the season controller stores, on either client. */
export const SEASONS_KEY_PREFIX = 'openmacro.seasons';
