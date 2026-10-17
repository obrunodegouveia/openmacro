/**
 * A seasonal welcome by name: the first time a signed-in learner opens the
 * app each day while a season is on, "Happy Halloween, Maria!" fills the
 * screen with a burst of pumpkins, then gets out of the way.
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
import { palette, season, spacing } from '@/theme/tokens';

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
  const [name, setName] = useState<string | null>(null);

  const userId = identity?.userId ?? null;
  const displayName = identity?.displayName ?? '';

  useEffect(() => {
    const first = firstName(displayName);
    if (season !== 'halloween' || !userId || !first) return;
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
  }, [userId, displayName]);

  useEffect(() => {
    if (!name) return;
    const timer = setTimeout(() => setName(null), SHOW_MS);
    return () => clearTimeout(timer);
  }, [name]);

  if (!name) return null;

  return (
    <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(400)} style={styles.backdrop}>
      <Pressable
        style={styles.fill}
        onPress={() => setName(null)}
        accessibilityRole="button"
        accessibilityLabel={t('season.halloween.welcome', { name })}
        accessibilityHint={t('season.welcomeDismiss')}
      >
        <SeasonalRain />
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.card}>
          <Text style={styles.pumpkin} allowFontScaling={false}>🎃</Text>
          <Text style={styles.title}>{t('season.halloween.welcome', { name })}</Text>
          <View style={styles.burstAnchor}>
            <SeasonalBurst />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(20, 8, 32, 0.72)' },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: palette.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    maxWidth: 360,
  },
  pumpkin: { fontSize: 88, lineHeight: 104 },
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
