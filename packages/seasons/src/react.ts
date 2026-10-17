import { useSyncExternalStore } from 'react';

import type { SeasonController } from './controller.ts';
import type { SeasonDecision } from './types.ts';

/** What a server render sees: no season, so prerendered HTML has no ornaments. */
const NONE: SeasonDecision<never> = { season: null, look: 'full', available: null, reason: 'none' };

const noSubscription = () => () => {};

/**
 * The live season decision, re-rendering whenever it changes.
 *
 * Works in React DOM and React Native alike. On the server, and during
 * hydration, it reports no season; the decorations arrive on the client with
 * no mismatch, while the palette, set by the boot script, is already there.
 *
 * @param controller The app's controller, or `null` where there is none yet
 *     (on the server).
 * @return The decision.
 */
export function useSeasonDecision<Id extends string>(controller: SeasonController<Id> | null): SeasonDecision<Id> {
  return useSyncExternalStore(
    controller ? controller.subscribe : noSubscription,
    controller ? controller.getSnapshot : () => NONE,
    () => NONE,
  );
}

/**
 * The viewer's preference, re-rendering whenever it changes.
 *
 * @param controller The app's controller, or `null`.
 * @return The preference, `auto` without a controller.
 */
export function useSeasonPreference(controller: SeasonController<string> | null) {
  return useSyncExternalStore(
    controller ? controller.subscribe : noSubscription,
    () => (controller ? controller.getPreference() : 'auto'),
    () => 'auto' as const,
  );
}
