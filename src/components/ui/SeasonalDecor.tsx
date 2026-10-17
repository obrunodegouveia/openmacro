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

import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

import { emitFeedback } from '@/feedback';
import { palette, season, spacing } from '@/theme/tokens';

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
 * What floats over the whole Today screen: the spider and, unless Reduce
 * Motion is on, two bats. Place it last inside the screen's root view.
 *
 * @param props.top The safe-area top inset, so nothing hides under the clock.
 * @return The overlay, or nothing on an ordinary day.
 */
export function SeasonalOverlay({ top }: { top: number }) {
  const reduceMotion = useReducedMotion();
  if (season !== 'halloween') return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {reduceMotion ? null : (
        <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
          <Bat delay={1200} y={top + 96} size={26} />
          <Bat delay={2000} y={top + 130} size={18} />
        </View>
      )}
      <HangingSpider top={top} />
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

const styles = StyleSheet.create({
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
