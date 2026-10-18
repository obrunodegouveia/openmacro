/**
 * @openmacro/seasons: seasonal themes for any app, decided once and shown
 * everywhere.
 *
 * The engine is framework-free and has no dependencies. `./react` adds two
 * hooks, `./web` the pre-paint boot script for a browser. See README.md.
 */

export { decide } from './engine.ts';
export { createSeasonController, type SeasonController, type SeasonControllerOptions, type SeasonStorage } from './controller.ts';
export { musicFor, type HasMusic, type SeasonTrack } from './music.ts';
export { EMPTY_REMOTE_CONFIG, fetchRemoteConfig, isDatePoint, parseRemoteConfig, type RemoteSource } from './remote.ts';
export type {
  DatePoint,
  DecideInput,
  DecisionReason,
  RemoteSeasonConfig,
  SeasonDecision,
  SeasonLook,
  SeasonPreference,
  SeasonWindow,
} from './types.ts';
