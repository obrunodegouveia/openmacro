/**
 * A seasonal welcome by name: the first time a signed-in learner opens the
 * app each day while a season is on, "Happy Halloween, Maria!" (or "Ho ho
 * ho, Maria!") fills the screen with a burst of the season's particles, then
 * gets out of the way. Never in the calm look, which has no popups.
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
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { SeasonalBurst, SeasonalRain } from '@/components/ui/SeasonalDecor';
import { emitFeedback } from '@/feedback';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { useSeason } from '@/seasons';
import { fontScale, palette, radius, resolvePalette, spacing } from '@/theme/tokens';

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

  return (
    <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(400)} style={styles.backdrop}>
      <Pressable
        style={styles.fill}
        onPress={() => setName(null)}
        accessibilityRole="button"
        accessibilityLabel={welcome}
        accessibilityHint={t('season.welcomeDismiss')}
      >
        <SeasonalRain />
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.card}>
          <Text style={styles.emoji} allowFontScaling={false}>{season.pack.welcome}</Text>
          <Text maxFontSizeMultiplier={fontScale.title} style={styles.title}>{welcome}</Text>
          <View style={styles.burstAnchor}>
            <SeasonalBurst />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // The season's own shadow tone at 72%, so the scrim is tinted to match.
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: `${resolvePalette('light').shadow}B8` },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: palette.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    maxWidth: 360,
  },
  emoji: { fontSize: 88, lineHeight: 104 },
  title: {
    marginTop: spacing.sm,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    textAlign: 'center',
    color: palette.goldDark,
  },
  burstAnchor: { position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center' },
});
