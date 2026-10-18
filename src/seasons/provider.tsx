/**
 * OpenMacro's season provider: `SeasonProvider` from
 * `@openmacro/seasons/native`, given this app's controller, packs, words,
 * colours, feedback and navigator. The same five lines another app writes.
 * The packs are the presets plus this app's music (`./music.ts`), so
 * `useSeasonMusic()` returns what the player plays.
 *
 * Mounted once in the root layout, inside the locale provider (for the
 * words). It also keeps the season current while the app runs: midnight,
 * returning to the foreground, the remote config.
 */

import { useCallback, type ReactNode } from 'react';
import { useIsFocused } from 'expo-router';

import type { UiKey } from '@openmacro/core/i18n';
import { SeasonProvider, type FeedbackKind, type SeasonChrome } from '@openmacro/seasons/native';
import type { TranslateValues } from '@openmacro/seasons/presets';

import { emitFeedback, touchHaptic } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, resolvePalette } from '@/theme/tokens';

import { seasons } from './controller';
import { SEASON_PACKS_WITH_MUSIC } from './music';

/**
 * The chrome in the app's own tokens, which were painted at launch (see
 * `src/theme/tokens.ts`), so the toy's bubble and the greeting match the
 * rest of the screen even before a restart.
 *
 * @param _season The season on screen (its colours are already in the tokens).
 * @param scheme The appearance.
 * @return The chrome.
 */
function chrome(_season: unknown, scheme: 'light' | 'dark'): SeasonChrome {
  const colours = resolvePalette(scheme);
  return {
    thread: palette.inkFaint,
    bubble: { background: palette.surface, border: palette.border, text: palette.ink },
    greeting: { background: palette.goldSoft, text: palette.goldDark },
    // The season's own shadow tone at 72% (the scrim is tinted to match); a
    // light shadow, in either appearance.
    welcome: { scrim: `${resolvePalette('light').shadow}B8`, surface: colours.surface, border: colours.gold, title: colours.goldDark },
  };
}

/**
 * The toy's taps and bursts through the app's own feedback: sound and
 * haptics for a tap or a burst, a haptic tick for picking it up and letting go.
 *
 * @param kind What happened.
 */
function feedback(kind: FeedbackKind): void {
  if (kind === 'grab' || kind === 'release') touchHaptic(kind);
  else emitFeedback(kind);
}

/**
 * Seasons for the whole app.
 *
 * @param props.children The app.
 * @return The provider.
 */
export function SeasonsProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const translate = useCallback((key: string, values?: TranslateValues) => t(key as UiKey, values), [t]);
  return (
    <SeasonProvider controller={seasons} packs={SEASON_PACKS_WITH_MUSIC} translate={translate} chrome={chrome} feedback={feedback} useFocused={useIsFocused}>
      {children}
    </SeasonProvider>
  );
}
