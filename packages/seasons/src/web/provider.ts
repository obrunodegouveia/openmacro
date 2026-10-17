/**
 * `@openmacro/seasons/web/provider`: the provider, the hooks and the
 * text-only pieces (`SeasonIcon`, `SeasonGreeting`), with no visuals, for
 * the always-loaded part of an app that loads the decorations lazily.
 * Everything here is also exported from `@openmacro/seasons/web`.
 */

export {
  SeasonProvider,
  startSeasonRuntime,
  useReducedMotion,
  useSeason,
  useSeasonContext,
  useSeasonEmoji,
  useSeasonMusic,
  type ActiveSeason,
  type SeasonProviderProps,
  type WebSeasonArt,
} from './context.tsx';
export { SeasonGreeting, SeasonIcon } from './text.tsx';
