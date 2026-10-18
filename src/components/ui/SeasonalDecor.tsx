/**
 * Seasonal decorations: what the app hangs up when a season is on.
 *
 * The drawing is `@openmacro/seasons/native`, given OpenMacro's words,
 * colours and feedback by `SeasonsProvider` (`src/seasons/provider.tsx`).
 * This file only places it on OpenMacro's screens: where the toy hangs,
 * how the garland meets the content's padding, the hero card's radius, the
 * safe area. Nothing here names a season, and on an ordinary day every
 * export renders nothing. See the package's README for what each one does.
 */

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SeasonAtmosphere,
  SeasonBurst,
  SeasonCardCorner,
  SeasonFooter,
  SeasonGarland,
  SeasonGreeting,
  SeasonRain,
  SeasonScreenCorner,
  SeasonSky,
  SeasonToy,
  useSeasonEmoji,
} from '@openmacro/seasons/native';

import { radius, spacing } from '@/theme/tokens';

export { SeasonFooter as SeasonalFooter, SeasonGreeting as SeasonalGreeting, SeasonScreenCorner as SeasonalScreenCorner, SeasonBurst as SeasonalBurst, SeasonRain as SeasonalRain };

/** The emoji to show for a role, in season or out of it. */
export const useSeasonalEmoji = useSeasonEmoji;

/**
 * The atmosphere behind a tab screen. Place it as the first child of the
 * screen's root view, before the scroll view.
 *
 * @param props.mist Lay the season's mist along the bottom (Today).
 * @return The atmosphere, or nothing on an ordinary day.
 */
export function SeasonalAtmosphere({ mist = false }: { mist?: boolean }) {
  return <SeasonAtmosphere mist={mist} />;
}

/**
 * Where the toy hangs across Today: centred in the gap between the lockup
 * (which ends near half the width) and the streak and XP column (which
 * starts near 84%), so it never crowds either. It used to hang at 66%, a
 * little closer to the pills than to the lockup.
 */
const TOY_LEFT = '63%';

/**
 * The band the flyers cross, below the safe-area inset: the strip above
 * Today's header row (the garland's, at Christmas), so a sleigh or a flight
 * of bats passes over the lockup, the toy and the streak rather than
 * through them. It used to be `{ top: 8, depth: 40 }`, the header's own
 * height.
 */
const FLIGHT_BAND = { top: 0, depth: 22 } as const;

/**
 * The toy hanging over the Today screen, in the gap between the lockup and
 * the streak. Place it last inside the screen's root view.
 *
 * @param props.top The safe-area top inset, so nothing hides under the clock.
 * @return The toy, or nothing on an ordinary day.
 */
export function SeasonalOverlay({ top }: { top: number }) {
  return <SeasonToy top={top} left={TOY_LEFT} />;
}

/**
 * The flyers and the nearest particles over whichever tab is open. Mounted
 * once, over the tab navigator; never over a lesson.
 *
 * @return The sky, or nothing on an ordinary day.
 */
export function SeasonalSky() {
  const { top } = useSafeAreaInsets();
  return <SeasonSky top={top} band={FLIGHT_BAND} />;
}

/**
 * The garland along the top of Today. Place it as the first child of the
 * scroll content.
 *
 * @return The garland, or nothing on an ordinary day or for a season without.
 */
export function SeasonalGarland() {
  return <SeasonGarland style={styles.garland} />;
}

/**
 * The season's ornament on a card's top corner, and on the hero card its
 * settled edge. Place it inside the card, which must not clip.
 *
 * @param props.edge Draw the season's edge too: on the hero card only.
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonalCardCorner({ edge = true }: { edge?: boolean }) {
  return <SeasonCardCorner edge={edge} inset={radius.xl} />;
}

const styles = StyleSheet.create({
  // Eats the content's top padding, runs edge to edge, and gives a little of
  // its height back so the header sits only slightly lower than usual.
  garland: { marginTop: -spacing.lg, marginBottom: -spacing.md, marginHorizontal: -spacing.lg },
});
