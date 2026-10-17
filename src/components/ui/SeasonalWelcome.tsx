/**
 * A seasonal welcome by name: the first time a signed-in learner opens the
 * app each day while a season is on, "Happy Halloween, Maria!" (or "Ho ho
 * ho, Maria!") is staged across the screen (a glow blooming, motes rising,
 * the card springing in over a burst of the season's particles), then gets
 * out of the way. The staging is `WelcomeStage`, an app-agnostic primitive;
 * this file decides when it shows and what it says. Never in the calm look, which has no popups.
 *
 * The name is the signed-in account's own, read from the session. Nobody's
 * name is written into the app; a learner who is signed out, or whose account
 * has no name, simply gets no welcome.
 *
 * Once a day per account, remembered on the device. A tap anywhere closes it,
 * and it closes itself after a few seconds.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { emitFeedback } from '@/feedback';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { useSeason } from '@/seasons';
import { WelcomeStage } from '@/seasons/visuals';
import { fontScale, resolvePalette } from '@/theme/tokens';

/** Where the last welcome is remembered, as `<user id>:<local date>`. */
const STORAGE_KEY = 'openmacro.season.welcomed';

/** How long the welcome stays before it closes itself. */
const SHOW_MS = 5000;

/** Today's local date, so "once a day" follows the learner's own midnight. */
function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/**
 * The first word of a display name, or null when there is no usable name.
 * The auth provider falls back to the email or "Learner"; neither is a name.
 *
 * @param displayName The account's display name.
 * @return The first name, or null.
 */
function firstName(displayName: string): string | null {
  if (!displayName || displayName.includes('@') || displayName === 'Learner') return null;
  return displayName.trim().split(/\s+/)[0] ?? null;
}

/**
 * The welcome overlay. Place it last inside the tab layout's root view.
 *
 * @return The welcome while it is showing, otherwise nothing.
 */
export function SeasonalWelcome() {
  const { identity } = useAuth();
  const { t } = useLocale();
  const season = useSeason();
  const scheme = useColorScheme();
  const [name, setName] = useState<string | null>(null);
  const id = season && !season.calm ? season.id : null;

  const userId = identity?.userId ?? null;
  const displayName = identity?.displayName ?? '';

  useEffect(() => {
    const first = firstName(displayName);
    if (!id || !userId || !first) return;
    let cancelled = false;
    const mark = `${userId}:${today()}`;
    void (async () => {
      try {
        if ((await AsyncStorage.getItem(STORAGE_KEY)) === mark) return;
        await AsyncStorage.setItem(STORAGE_KEY, mark);
      } catch {
        // Without storage it may show more than once a day; that is fine.
      }
      if (cancelled) return;
      setName(first);
      emitFeedback('complete');
    })();
    return () => {
      cancelled = true;
    };
  }, [id, userId, displayName]);

  useEffect(() => {
    if (!name) return;
    const timer = setTimeout(() => setName(null), SHOW_MS);
    return () => clearTimeout(timer);
  }, [name]);

  if (!name || !season) return null;
  const welcome = t(`season.${season.id}.welcome`, { name });
  const colours = resolvePalette(scheme);

  return (
    <WelcomeStage
      emoji={season.pack.welcome}
      title={welcome}
      particles={season.pack.particles}
      colors={{
        // The season's own shadow tone at 72% (the scrim is tinted to
        // match); a light shadow, in either appearance.
        scrim: `${resolvePalette('light').shadow}B8`,
        surface: colours.surface,
        border: colours.gold,
        title: colours.goldDark,
        glow: season.pack.look.burst.ring,
      }}
      animate={season.motion}
      onDismiss={() => setName(null)}
      label={welcome}
      hint={t('season.welcomeDismiss')}
      maxTitleScale={fontScale.title}
    />
  );
}
