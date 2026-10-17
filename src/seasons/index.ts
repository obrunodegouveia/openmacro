/**
 * Seasons in the app: the hooks every decoration reads.
 *
 * The decision itself is `@openmacro/seasons`; the calendar and the packs
 * are `@openmacro/core/season`, shared with the website. See
 * `docs/seasons.md` for how it all fits.
 */

import { useEffect, useMemo } from 'react';
import { AppState, DevSettings } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import * as Updates from 'expo-updates';

import { useSeasonDecision, useSeasonPreference } from '@openmacro/seasons/react';
import { SEASON_PACKS, type SeasonId, type SeasonPack } from '@openmacro/core/season';

import { seasons } from './controller';

export { seasons };

/** The season on screen right now, with everything needed to draw it. */
export interface ActiveSeason {
  readonly id: SeasonId;
  readonly pack: SeasonPack;
  /** The calm look: colours and still ornaments only. */
  readonly calm: boolean;
  /**
   * Whether anything may move: the full look, and Reduce Motion off. A
   * decoration that only makes sense moving (bats, rain, a burst) renders
   * nothing when this is false; one that can stand still does.
   */
  readonly motion: boolean;
}

/**
 * The season to decorate for, live: it follows the learner's own setting,
 * the remote switch and the date the moment they change.
 *
 * @return The season, or `null` on an ordinary day.
 */
export function useSeason(): ActiveSeason | null {
  const decision = useSeasonDecision(seasons);
  const reduceMotion = useReducedMotion();
  return useMemo(() => {
    if (!decision.season) return null;
    const calm = decision.look === 'calm';
    return { id: decision.season, pack: SEASON_PACKS[decision.season], calm, motion: !calm && !reduceMotion };
  }, [decision, reduceMotion]);
}

/**
 * Keeps the season current while the app runs: decides again on returning to
 * the foreground (a phone left on the table overnight), at midnight, and
 * fetches the remote config. Mount once, in the root layout.
 */
export function useSeasonLifecycle(): void {
  useEffect(() => {
    const stop = seasons.start();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      seasons.update();
      void seasons.refresh();
    });
    return () => {
      stop();
      subscription.remove();
    };
  }, []);
}

/**
 * Everything the settings row needs.
 *
 * @return The season on offer (or `null`, when there is nothing to choose
 *     about), the learner's choice, a setter, and whether the colours on
 *     screen are stale until a restart.
 */
export function useSeasonSettings() {
  const decision = useSeasonDecision(seasons);
  const preference = useSeasonPreference(seasons);
  return {
    available: decision.available,
    preference,
    setPreference: seasons.setPreference,
    // The palette was painted at launch; decorations follow at once.
    needsRestart: decision.season !== seasons.boot.season,
  };
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
