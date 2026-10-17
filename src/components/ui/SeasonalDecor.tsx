/**
 * Seasonal decorations: what the app hangs up when a season is on.
 *
 * Which season it is comes from `season` in the theme tokens (and from
 * `@openmacro/core/season` behind it), so the decorations and the repainted
 * palette always agree. On an ordinary day every export here renders nothing.
 *
 * Everything is drawn with emoji and plain views, not SVG: the app has no
 * SVG renderer, and adding a native module would hold Halloween back until
 * the next store build instead of shipping it as an update.
 *
 * All of it is decoration. It is hidden from VoiceOver and TalkBack, never
 * takes a tap meant for the screen under it (only the spider itself is
 * pressable), and stands still under Reduce Motion.
 */

import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { fontScale, palette, radius, season, spacing, typography } from '@/theme/tokens';

/** Props that take a decoration out of the accessibility tree. */
const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

/** How far below its anchor the spider hangs at rest, in points. */
const THREAD = 30;

/**
 * A spider on a thread, hanging from the top of the screen.
 *
 * It bobs gently on its own; a tap drops it most of the way down the screen
 * and it climbs back up. That is the whole game, and it is there because a
 * seven-year-old will find it.
 *
 * @param props.top Where the thread is anchored, usually the safe-area inset.
 * @return The spider, or nothing outside Halloween.
 */
function HangingSpider({ top }: { top: number }) {
  const reduceMotion = useReducedMotion();
  const bob = useSharedValue(0);
  const drop = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [bob, reduceMotion]);

  const onPress = () => {
    emitFeedback('select');
    drop.value = reduceMotion
      ? 0
      : withSequence(
          withSpring(220, { damping: 7, stiffness: 90 }),
          withDelay(500, withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })),
        );
  };

  // The thread runs from the very top of the screen to the spider.
  const threadStyle = useAnimatedStyle(() => ({ height: top + THREAD + bob.value + drop.value }));
  const spiderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value + drop.value }, { rotate: `${bob.value * 0.6 - 3}deg` }],
  }));

  return (
    <View pointerEvents="box-none" style={styles.spiderAnchor}>
      <Animated.View style={[styles.thread, threadStyle]} {...HIDDEN} />
      <Animated.View style={[styles.spiderBody, { top: top + THREAD - 8 }, spiderStyle]}>
        <Pressable onPress={onPress} hitSlop={12} {...HIDDEN}>
          <Text style={styles.spider} allowFontScaling={false}>🕷️</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/**
 * One bat crossing the top of the screen, then waiting for its next lap.
 *
 * @param props.delay When its first lap starts, in milliseconds.
 * @param props.y How far from the top it flies.
 * @param props.size Its emoji size; a smaller bat reads as further away.
 * @return The bat.
 */
function Bat({ delay, y, size }: { delay: number; y: number; size: number }) {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 6500, easing: Easing.inOut(Easing.quad) }),
          withDelay(9000, withTiming(0, { duration: 0 })),
        ),
        -1,
      ),
    );
  }, [delay, x]);

  const style = useAnimatedStyle(() => ({
    opacity: x.value > 0 && x.value < 1 ? 1 : 0,
    transform: [
      { translateX: -60 + x.value * 520 },
      { translateY: Math.sin(x.value * Math.PI * 4) * 12 },
    ],
  }));

  return (
    <Animated.Text style={[styles.bat, { top: y, fontSize: size }, style]} allowFontScaling={false} {...HIDDEN}>
      🦇
    </Animated.Text>
  );
}

/**
 * The spider hanging over the Today screen. Place it last inside the screen's
 * root view.
 *
 * @param props.top The safe-area top inset, so nothing hides under the clock.
 * @return The overlay, or nothing on an ordinary day.
 */
export function SeasonalOverlay({ top }: { top: number }) {
  if (season !== 'halloween') return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <HangingSpider top={top} />
    </View>
  );
}

/**
 * Bats crossing whichever tab is open. Mounted once, over the tab navigator,
 * so they keep flying when the learner switches tabs. Never over a lesson:
 * a bat crossing a question is a distraction, not a decoration.
 *
 * @return The bats, or nothing on an ordinary day or under Reduce Motion.
 */
export function SeasonalBats() {
  const reduceMotion = useReducedMotion();
  const { top } = useSafeAreaInsets();
  if (season !== 'halloween' || reduceMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {/* High, in the band just under the clock: lower down they crossed
          the hero card's buttons and the Course tab's search field. */}
      <Bat delay={1200} y={top + 8} size={26} />
      <Bat delay={2000} y={top + 24} size={18} />
      <Bat delay={7500} y={top + 40} size={22} />
    </View>
  );
}

/**
 * A cobweb caught on the top corner of a card. Place it inside the card,
 * which must not clip (`overflow` left visible).
 *
 * @return The web, or nothing on an ordinary day.
 */
export function SeasonalCardCorner() {
  if (season !== 'halloween') return null;
  return (
    <Text pointerEvents="none" style={styles.web} allowFontScaling={false} {...HIDDEN}>
      🕸️
    </Text>
  );
}

/**
 * A row of pumpkins and a ghost to end a scrolling screen on.
 *
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonalFooter() {
  if (season !== 'halloween') return null;
  return (
    <View style={styles.patch} {...HIDDEN}>
      <Text style={styles.patchSmall} allowFontScaling={false}>🎃</Text>
      <Text style={styles.patchLarge} allowFontScaling={false}>🎃</Text>
      <Text style={styles.patchGhost} allowFontScaling={false}>👻</Text>
      <Text style={styles.patchLarge} allowFontScaling={false}>🎃</Text>
      <Text style={styles.patchSmall} allowFontScaling={false}>🎃</Text>
    </View>
  );
}

/** The emoji a season swaps in for the app's own, by role. */
const SEASON_EMOJI = {
  halloween: { streak: '🎃', complete: '🎃', perfect: '🧙' },
} as const;

/**
 * The emoji to show for a role, in season or out of it: the streak flame
 * becomes a jack-o'-lantern for Halloween, the lesson-complete party popper a
 * pumpkin. The meaning stays; only the picture dresses up.
 *
 * @param role Which emoji.
 * @param ordinary What to show on an ordinary day.
 * @return The emoji.
 */
export function seasonalEmoji(role: keyof (typeof SEASON_EMOJI)['halloween'], ordinary: string): string {
  return season === 'halloween' ? SEASON_EMOJI.halloween[role] : ordinary;
}

/**
 * A small greeting pill, "🎃 Happy Halloween!", for the top of a screen.
 *
 * Unlike the decorations it is text, so VoiceOver reads it.
 *
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonalGreeting() {
  const { t } = useLocale();
  if (season !== 'halloween') return null;
  return (
    <View style={styles.greeting}>
      <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.greetingText}>{t('season.halloween.greeting')}</Text>
    </View>
  );
}

/**
 * A cobweb in the top corner of a screen. Place it as the first child of the
 * screen's scroll content, so it scrolls away with the title.
 *
 * @return The web, or nothing on an ordinary day.
 */
export function SeasonalScreenCorner() {
  if (season !== 'halloween') return null;
  return (
    <Text pointerEvents="none" style={styles.screenWeb} allowFontScaling={false} {...HIDDEN}>
      🕸️
    </Text>
  );
}

/** What a burst or a rain is made of. */
const PARTICLES = ['🎃', '🦇', '👻', '🍬', '🎃', '🕷️', '🍭', '👻'];

/**
 * One emoji thrown up out of a point and falling away, for `SeasonalBurst`.
 *
 * @param props.index Its place in the burst, which fixes its angle and size.
 * @return The particle.
 */
function BurstParticle({ index }: { index: number }) {
  const progress = useSharedValue(0);
  // Fanned out over the upper half-circle, alternating near and far.
  const angle = Math.PI * (0.12 + (0.76 * index) / (PARTICLES.length - 1));
  const reach = index % 2 === 0 ? 120 : 82;

  useEffect(() => {
    progress.value = withDelay(index * 25, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) / 0.3,
    transform: [
      { translateX: -Math.cos(angle) * reach * progress.value },
      // Up and out, then a little gravity at the end.
      { translateY: -Math.sin(angle) * reach * progress.value + 40 * progress.value * progress.value },
      { scale: 0.4 + progress.value * 0.8 },
      { rotate: `${(index % 2 ? 1 : -1) * 40 * progress.value}deg` },
    ],
  }));

  return (
    <Animated.Text style={[styles.particle, style]} allowFontScaling={false}>
      {PARTICLES[index]}
    </Animated.Text>
  );
}

/**
 * A burst of pumpkins, bats and ghosts, thrown up once when it mounts. Used
 * on a correct answer. Place it inside a container that does not clip.
 *
 * @return The burst, or nothing on an ordinary day or under Reduce Motion.
 */
export function SeasonalBurst() {
  const reduceMotion = useReducedMotion();
  if (season !== 'halloween' || reduceMotion) return null;
  return (
    <View pointerEvents="none" style={styles.burst} {...HIDDEN}>
      {PARTICLES.map((_, index) => (
        <BurstParticle key={index} index={index} />
      ))}
    </View>
  );
}

/**
 * One emoji falling down the screen, over and over, for `SeasonalRain`.
 *
 * @param props.x Where it falls, from the left edge.
 * @param props.delay When it first falls, in milliseconds.
 * @param props.duration How long one fall takes.
 * @param props.emoji What falls.
 * @param props.height The height of the screen.
 * @return The particle.
 */
function RainDrop({ x, delay, duration, emoji, height }: { x: number; delay: number; duration: number; emoji: string; height: number }) {
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1));
  }, [delay, duration, fall]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -60 + fall.value * (height + 120) },
      { translateX: Math.sin(fall.value * Math.PI * 3) * 18 },
      { rotate: `${fall.value * 240}deg` },
    ],
  }));

  return (
    <Animated.Text style={[styles.drop, { left: x }, style]} allowFontScaling={false}>
      {emoji}
    </Animated.Text>
  );
}

/**
 * Pumpkins, sweets and ghosts drifting down the whole screen, for a finished
 * lesson. Place it last inside the screen's root view.
 *
 * @return The rain, or nothing on an ordinary day or under Reduce Motion.
 */
export function SeasonalRain() {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const drops = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        // Spread evenly across the width, nudged so the columns don't line up.
        x: ((i + 0.5) / 14) * width - 14 + ((i * 37) % 23) - 11,
        delay: (i * 613) % 4000,
        duration: 5200 + ((i * 1337) % 3000),
        emoji: PARTICLES[i % PARTICLES.length]!,
      })),
    [width],
  );
  if (season !== 'halloween' || reduceMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {drops.map((drop, i) => (
        <RainDrop key={i} {...drop} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    alignSelf: 'flex-start',
    backgroundColor: palette.goldSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  greetingText: { ...typography.caption, fontWeight: '800', color: palette.goldDark },
  screenWeb: {
    position: 'absolute',
    top: -spacing.lg,
    right: -spacing.md,
    fontSize: 64,
    opacity: 0.55,
    transform: [{ rotate: '8deg' }],
  },
  particle: { position: 'absolute', fontSize: 26 },
  burst: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drop: { position: 'absolute', top: 0, fontSize: 28, opacity: 0.9 },
  spiderAnchor: {
    position: 'absolute',
    // Between the lockup and the streak on a phone; it swings, so a little
    // overlap on a narrow screen reads as the spider passing in front.
    left: '66%',
    top: 0,
    bottom: 0,
    width: 32,
  },
  thread: {
    position: 'absolute',
    top: 0,
    left: 15,
    width: 2,
    backgroundColor: palette.inkFaint,
    opacity: 0.6,
  },
  spiderBody: { position: 'absolute', left: 0, width: 32, alignItems: 'center' },
  spider: { fontSize: 26 },
  bat: { position: 'absolute', left: 0 },
  web: {
    position: 'absolute',
    top: -18,
    right: -14,
    fontSize: 46,
    opacity: 0.85,
    transform: [{ rotate: '12deg' }],
  },
  patch: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  patchSmall: { fontSize: 26 },
  patchLarge: { fontSize: 36 },
  patchGhost: { fontSize: 30, marginBottom: 14 },
});
