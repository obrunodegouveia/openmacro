/**
 * Seasonal decorations: what the app hangs up when a season is on.
 *
 * Nothing here names a season. Each component reads the live season from
 * `useSeason` and draws its pack (`SEASON_PACKS` in `@openmacro/core/season`),
 * so a new season is new data, not new components. On an ordinary day every
 * export renders nothing.
 *
 * Everything is drawn with emoji and plain views, not SVG: the app has no
 * SVG renderer, and adding a native module would hold a season back until
 * the next store build instead of shipping it as an update.
 *
 * All of it is decoration. It is hidden from VoiceOver and TalkBack, never
 * takes a tap meant for the screen under it (only the toy is pressable), and
 * stands still under Reduce Motion or the calm look, where whatever only
 * makes sense moving is not drawn at all.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { toyReaction, type SeasonPack } from '@openmacro/core/season';

import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { useSeason, type ActiveSeason } from '@/seasons';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';

/** Props that take a decoration out of the accessibility tree. */
const HIDDEN = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

/** How far below its anchor the toy hangs at rest, in points. */
const THREAD = 30;

/** How long the toy's line stays up. */
const LINE_MS = 1800;

/**
 * The toy on a thread, hanging from the top of the screen: the spider at
 * Halloween, a bell at Christmas.
 *
 * It bobs gently on its own. A tap drops it most of the way down the screen
 * (or rings it, for a bell); every third tap it says something, and every
 * tenth it throws a burst. That is the whole game, and it is there because a
 * seven-year-old will find it.
 *
 * @param props.season The season on screen.
 * @param props.top Where the thread is anchored, usually the safe-area inset.
 * @return The toy.
 */
function HangingToy({ season, top }: { season: ActiveSeason; top: number }) {
  const { t } = useLocale();
  const { toy } = season.pack;
  const bob = useSharedValue(0);
  const drop = useSharedValue(0);
  const swing = useSharedValue(0);
  const taps = useRef(0);
  const [line, setLine] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!season.motion) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [bob, season.motion]);

  useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const onPress = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current);
    emitFeedback(reaction === 'burst' ? 'complete' : 'select');
    if (reaction === 'burst') setBurst((n) => n + 1);
    else if (reaction !== null) setLine(reaction);
    if (!season.motion) return;
    if (toy.move === 'drop') {
      drop.value = withSequence(
        withSpring(220, { damping: 7, stiffness: 90 }),
        withDelay(500, withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })),
      );
    } else {
      swing.value = withSequence(
        withTiming(22, { duration: 120 }),
        withTiming(-18, { duration: 180 }),
        withTiming(12, { duration: 180 }),
        withTiming(-6, { duration: 180 }),
        withSpring(0, { damping: 6 }),
      );
    }
  };

  // The thread runs from the very top of the screen to the toy.
  const threadStyle = useAnimatedStyle(() => ({ height: top + THREAD + bob.value + drop.value }));
  const toyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bob.value + drop.value },
      { rotate: `${bob.value * 0.6 - 3 + swing.value}deg` },
    ],
  }));

  return (
    <View pointerEvents="box-none" style={styles.toyAnchor}>
      <Animated.View style={[styles.thread, threadStyle]} {...HIDDEN} />
      <Animated.View style={[styles.toyBody, { top: top + THREAD - 8 }, toyStyle]}>
        <Pressable onPress={onPress} hitSlop={12} {...HIDDEN}>
          <Text style={styles.toy} allowFontScaling={false}>{toy.emoji}</Text>
        </Pressable>
        {line !== null ? (
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(250)} style={styles.bubble} {...HIDDEN}>
            <Text style={styles.bubbleText} numberOfLines={2}>
              {t(`season.${season.id}.toy.${line as 1 | 2 | 3}`)}
            </Text>
          </Animated.View>
        ) : null}
        {burst > 0 ? (
          <View style={styles.toyBurst} pointerEvents="none">
            <SeasonalBurst key={burst} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

/**
 * The toy hanging over the Today screen. Place it last inside the screen's
 * root view.
 *
 * In the calm look it hangs still, and a creepy one (the spider) is not
 * there at all.
 *
 * @param props.top The safe-area top inset, so nothing hides under the clock.
 * @return The overlay, or nothing on an ordinary day.
 */
export function SeasonalOverlay({ top }: { top: number }) {
  const season = useSeason();
  if (!season || (season.calm && season.pack.toy.creepy)) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <HangingToy key={season.id} season={season} top={top} />
    </View>
  );
}

/**
 * One flyer crossing the top of the screen, then waiting for its next lap:
 * a bat, a sleigh.
 *
 * @param props.emoji What flies.
 * @param props.mirror Whether to flip it, so it faces the way it flies.
 * @param props.delay When its first lap starts, in milliseconds.
 * @param props.y How far from the top it flies.
 * @param props.size Its emoji size; a smaller one reads as further away.
 * @param props.width The screen width, so it crosses all of it.
 * @return The flyer.
 */
function Flyer({ emoji, mirror, delay, y, size, width }: { emoji: string; mirror: boolean; delay: number; y: number; size: number; width: number }) {
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
      { translateX: -size * 4 + x.value * (width + size * 8) },
      { translateY: Math.sin(x.value * Math.PI * 4) * 12 },
      { scaleX: mirror ? -1 : 1 },
    ],
  }));

  return (
    <Animated.Text style={[styles.flyer, { top: y, fontSize: size }, style]} allowFontScaling={false} {...HIDDEN}>
      {emoji}
    </Animated.Text>
  );
}

/** Where each flyer flies and when it starts, by its index. */
// High, in the band just under the clock: lower down they crossed the hero
// card's buttons and the Course tab's search field.
const FLIGHTS = [
  { delay: 1200, y: 8, size: 26 },
  { delay: 2000, y: 24, size: 18 },
  { delay: 7500, y: 40, size: 22 },
] as const;

/**
 * One flake (or whatever the season sheds) drifting slowly down the screen.
 *
 * @param props.emoji What drifts.
 * @param props.x Where it falls, from the left edge.
 * @param props.delay When it first falls.
 * @param props.duration How long one fall takes.
 * @param props.height The screen height.
 * @param props.size Its emoji size.
 * @return The flake.
 */
function Drift({ emoji, x, delay, duration, height, size }: { emoji: string; x: number; delay: number; duration: number; height: number; size: number }) {
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1));
  }, [delay, duration, fall]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -40 + fall.value * (height + 80) },
      { translateX: Math.sin(fall.value * Math.PI * 2) * 16 },
      { rotate: `${fall.value * 180}deg` },
    ],
  }));

  return (
    <Animated.Text style={[styles.drift, { left: x, fontSize: size }, style]} allowFontScaling={false}>
      {emoji}
    </Animated.Text>
  );
}

/**
 * The sky over whichever tab is open: the season's flyers crossing now and
 * then, and its ambient drift (snow) if it has one. Mounted once, over the
 * tab navigator, so it carries on when the learner switches tabs. Never over
 * a lesson: snow falling across a question is a distraction, not a
 * decoration.
 *
 * @return The sky, or nothing on an ordinary day, in the calm look, or
 *     under Reduce Motion.
 */
export function SeasonalSky() {
  const season = useSeason();
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const ambient = season?.pack.ambient ?? null;
  const flakes = useMemo(
    () =>
      ambient
        ? Array.from({ length: ambient.count }, (_, i) => ({
            x: ((i + 0.5) / ambient.count) * width - 10 + ((i * 37) % 19) - 9,
            delay: (i * 1709) % 9000,
            duration: 14000 + ((i * 2311) % 8000),
            size: 12 + ((i * 7) % 3) * 4,
          }))
        : [],
    [ambient, width],
  );
  if (!season?.motion) return null;
  const { flyer } = season.pack;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {ambient ? (
        <View style={[StyleSheet.absoluteFill, styles.ambient]}>
          {flakes.map((flake, i) => (
            <Drift key={i} emoji={ambient.emoji} height={height} {...flake} />
          ))}
        </View>
      ) : null}
      {FLIGHTS.slice(0, flyer.count).map((flight, i) => (
        <Flyer
          key={`${season.id}-${i}`}
          emoji={flyer.emoji}
          mirror={flyer.mirror ?? false}
          delay={flight.delay}
          y={top + flight.y}
          size={flight.size}
          width={width}
        />
      ))}
    </View>
  );
}

/**
 * The season's ornament caught on the top corner of a card: a cobweb, a
 * bow. Place it inside the card, which must not clip (`overflow` visible).
 *
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonalCardCorner() {
  const season = useSeason();
  if (!season) return null;
  return (
    <Text pointerEvents="none" style={styles.cardCorner} allowFontScaling={false} {...HIDDEN}>
      {season.pack.cardCorner}
    </Text>
  );
}

/**
 * The season's large, faint ornament in the top corner of a screen. Place it
 * as the first child of the screen's scroll content, so it scrolls away with
 * the title.
 *
 * @return The ornament, or nothing on an ordinary day.
 */
export function SeasonalScreenCorner() {
  const season = useSeason();
  if (!season) return null;
  return (
    <Text pointerEvents="none" style={styles.screenCorner} allowFontScaling={false} {...HIDDEN}>
      {season.pack.screenCorner}
    </Text>
  );
}

/** The emoji size for each footer ornament size. */
const FOOTER_SIZE = { s: { fontSize: 26 }, m: { fontSize: 30 }, l: { fontSize: 36 } } as const;

/**
 * The row of ornaments that ends a scrolling screen: pumpkins and a ghost,
 * trees and a snowman.
 *
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonalFooter() {
  const season = useSeason();
  if (!season) return null;
  return (
    <View style={styles.footer} {...HIDDEN}>
      {season.pack.footer.map((ornament, i) => (
        <Text key={i} style={[FOOTER_SIZE[ornament.size], ornament.lift && styles.lift]} allowFontScaling={false}>
          {ornament.emoji}
        </Text>
      ))}
    </View>
  );
}

/**
 * The emoji to show for a role, in season or out of it: the streak flame
 * becomes a jack-o'-lantern or a tree, the lesson-complete party popper a
 * pumpkin or a present. The meaning stays; only the picture dresses up.
 *
 * @param role Which emoji.
 * @param ordinary What to show on an ordinary day.
 * @return The emoji.
 */
export function useSeasonalEmoji(role: keyof SeasonPack['emoji'], ordinary: string): string {
  const season = useSeason();
  return season ? season.pack.emoji[role] : ordinary;
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
  const season = useSeason();
  if (!season) return null;
  return (
    <View style={styles.greeting}>
      <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.greetingText}>{t(`season.${season.id}.greeting`)}</Text>
    </View>
  );
}

/**
 * One emoji thrown up out of a point and falling away, for `SeasonalBurst`.
 *
 * @param props.emoji What is thrown.
 * @param props.index Its place in the burst, which fixes its angle and size.
 * @param props.count How many are thrown in all.
 * @return The particle.
 */
function BurstParticle({ emoji, index, count }: { emoji: string; index: number; count: number }) {
  const progress = useSharedValue(0);
  // Fanned out over the upper half-circle, alternating near and far.
  const angle = Math.PI * (0.12 + (0.76 * index) / (count - 1));
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
      {emoji}
    </Animated.Text>
  );
}

/**
 * A burst of the season's particles, thrown up once when it mounts. Used on
 * a correct answer. Place it inside a container that does not clip.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalBurst() {
  const season = useSeason();
  if (!season?.motion) return null;
  const { particles } = season.pack;
  return (
    <View pointerEvents="none" style={styles.burst} {...HIDDEN}>
      {particles.map((emoji, index) => (
        <BurstParticle key={index} emoji={emoji} index={index} count={particles.length} />
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
 * The season's particles drifting down the whole screen, for a finished
 * lesson. Place it last inside the screen's root view.
 *
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalRain() {
  const season = useSeason();
  const { width, height } = useWindowDimensions();
  const particles = season?.pack.particles;
  const drops = useMemo(
    () =>
      particles
        ? Array.from({ length: 14 }, (_, i) => ({
            // Spread evenly across the width, nudged so the columns don't line up.
            x: ((i + 0.5) / 14) * width - 14 + ((i * 37) % 23) - 11,
            delay: (i * 613) % 4000,
            duration: 5200 + ((i * 1337) % 3000),
            emoji: particles[i % particles.length]!,
          }))
        : [],
    [particles, width],
  );
  if (!season?.motion) return null;

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
  screenCorner: {
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
  ambient: { opacity: 0.45 },
  drift: { position: 'absolute', top: 0 },
  toyAnchor: {
    position: 'absolute',
    // Between the lockup and the streak on a phone; it swings, so a little
    // overlap on a narrow screen reads as the toy passing in front.
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
  toyBody: { position: 'absolute', left: 0, width: 32, alignItems: 'center' },
  toy: { fontSize: 26 },
  toyBurst: { position: 'absolute', top: 16, left: 16 },
  bubble: {
    position: 'absolute',
    top: 4,
    right: 34,
    width: 150,
    alignItems: 'flex-end',
  },
  bubbleText: {
    overflow: 'hidden',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    color: palette.ink,
  },
  flyer: { position: 'absolute', left: 0 },
  cardCorner: {
    position: 'absolute',
    top: -18,
    right: -14,
    fontSize: 46,
    opacity: 0.85,
    transform: [{ rotate: '12deg' }],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  lift: { marginBottom: 14 },
});
