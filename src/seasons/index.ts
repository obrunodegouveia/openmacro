/**
 * Seasons in the app.
 *
 * The decision is `@openmacro/seasons`, the six seasons are its presets
 * (referenced by `@openmacro/core/season`, shared with the website), and
 * the decorations are its native renderer, given this app's words, colours
 * and feedback by `SeasonsProvider`. What is left here is OpenMacro's own:
 * restarting to repaint the palette. See `docs/seasons.md`.
 */

import { DevSettings } from 'react-native';
import * as Updates from 'expo-updates';

import { useSeason as usePackageSeason, useSeasonSettings as usePackageSettings, type ActiveSeason as PackageSeason } from '@openmacro/seasons/native';
import type { SeasonId } from '@openmacro/core/season';
import type { UiKey } from '@openmacro/core/i18n';

import { seasons } from './controller';

export { seasons };
export { SeasonsProvider } from './provider';

/** The season on screen right now, with everything needed to draw it. */
export type ActiveSeason = PackageSeason<SeasonId, UiKey>;

/**
 * The season to decorate for, live: it follows the learner's own setting,
 * the remote switch and the date the moment they change.
 *
 * @return The season, or `null` on an ordinary day.
 */
export function useSeason(): ActiveSeason | null {
  return usePackageSeason<SeasonId, UiKey>();
}

/**
 * Everything the settings row needs.
 *
 * @return The season on offer (or `null`, when there is nothing to choose
 *     about), the learner's choice, a setter, and whether the colours on
 *     screen are stale until a restart.
 */
export function useSeasonSettings() {
  const { available, preference, setPreference, changedSinceLaunch } = usePackageSettings<SeasonId>();
  // The palette was painted at launch; decorations follow at once.
  return { available, preference, setPreference, needsRestart: changedSinceLaunch };
}

/**
 * Restarts the JavaScript, so the palette is painted again. Production and
 * preview builds reload the current update; a development build reloads
 * through the dev menu's own path.
 */
export function restartForSeason(): void {
  if (__DEV__) {
    DevSettings.reload();
    return;
  }
  void Updates.reloadAsync().catch(() => DevSettings.reload());
}
