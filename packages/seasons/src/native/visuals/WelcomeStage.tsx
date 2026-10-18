/**
 * A full-screen greeting, staged in layers: the scrim darkens, a glow blooms
 * behind where the card will be, motes rise through it in depth, the card
 * springs in, its emoji pops, the title follows, and a burst with a ring of
 * light goes off behind it all.
 *
 * Purely presentational: the caller decides when it shows, and dismisses it
 * on `onDismiss` (a tap anywhere). Without motion every layer simply fades
 * in, still. See `shared.ts` for the rules every visual here follows.
 */

import { useWindowDimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, ZoomIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Burst } from './Burst.tsx';
import { ParticleField, type MoteMotion, type MoteShape, type ParticleLayer } from './ParticleField.tsx';
import { HIDDEN, rgba } from './shared.ts';

/** When each layer arrives, in milliseconds after mounting. */
const CUE = { glow: 0, card: 120, emoji: 320, title: 460, burst: 380 } as const;

/** The glow's diameter, as a fraction of the shorter screen side. */
const GLOW_SIZE = 1.15;

/** The motes rising behind the card. */
const MOTES: readonly ParticleLayer[] = [
  { count: 10, size: 3, crossMs: 9000, opacity: 0.45, sway: 10 },
  { count: 6, size: 5, crossMs: 6500, opacity: 0.7, sway: 16 },
];

/**
 * The season's own air for the stage: its particles' colours, shape and
 * motion, so spring welcomes you with tumbling petals and winter with
 * glinting crystals. Without it, plain motes rise in the glow colour.
 */
export interface WelcomeMotes {
  readonly colors: readonly string[];
  readonly motion: MoteMotion;
  readonly direction: 'fall' | 'rise';
  readonly shape?: MoteShape;
  readonly glow: boolean;
}

/** The colours it is drawn in, all supplied by the caller. */
export interface WelcomeColors {
  /** The scrim over the screen, any CSS colour. */
  readonly scrim: string;
  readonly surface: string;
  readonly border: string;
  readonly title: string;
  /** The glow, the motes and the ring, `#rrggbb`. */
  readonly glow: string;
}

/**
 * The glow behind the card, blooming in and then breathing.
 *
 * @param props.color Its colour, `#rrggbb`.
 * @param props.size Its diameter.
 * @param props.animate Whether it blooms and breathes.
 * @return The glow.
 */
function Bloom({ color, size, animate }: { color: string; size: number; animate: boolean }) {
  const t = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (!animate) return;
    t.value = withSequence(
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withRepeat(withTiming(0.85, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [animate, t]);
  const style = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ scale: 0.5 + t.value * 0.5 }] }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bloom,
        {
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          experimental_backgroundImage: `radial-gradient(circle at 50% 50%, ${rgba(color, 0.55)} 0%, ${rgba(color, 0.18)} 40%, ${rgba(color, 0)} 70%)`,
        },
        style,
      ]}
    />
  );
}

/**
 * The stage.
 *
 * @param props.emoji The big emoji on the card.
 * @param props.title The greeting.
 * @param props.particles What the burst throws.
 * @param props.colors See `WelcomeColors`.
 * @param props.motes The season's air, see `WelcomeMotes`.
 * @param props.animate Whether anything moves.
 * @param props.onDismiss A tap anywhere.
 * @param props.label The accessibility label for the whole stage (the greeting).
 * @param props.hint The accessibility hint (how to close it).
 * @param props.maxTitleScale The Dynamic Type cap for the title.
 * @return The stage, to be placed over the whole screen.
 */
export function WelcomeStage({
  emoji,
  title,
  particles,
  colors,
  motes,
  animate,
  onDismiss,
  label,
  hint,
  maxTitleScale,
}: {
  emoji: string;
  title: string;
  particles: readonly string[];
  colors: WelcomeColors;
  motes?: WelcomeMotes;
  animate: boolean;
  onDismiss: () => void;
  label: string;
  hint: string;
  maxTitleScale?: number;
}) {
  const { width, height } = useWindowDimensions();
  const glow = Math.min(width, height) * GLOW_SIZE;
  const layers = useMemo(() => MOTES.map((layer) => ({ ...layer, shape: motes?.shape })), [motes?.shape]);
  const enter = <T extends { delay: (ms: number) => T }>(animation: T, at: number) => (animate ? animation.delay(at) : undefined);

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(400)} style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}>
      <Pressable style={styles.fill} onPress={onDismiss} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hint}>
        <Bloom color={colors.glow} size={glow} animate={animate} />
        {animate ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none" {...HIDDEN}>
            <ParticleField
              layers={layers}
              colors={motes?.colors ?? [colors.glow]}
              glow={motes?.glow ?? true}
              motion={motes?.motion}
              direction={motes?.direction ?? 'rise'}
              wind={12}
              width={width}
              height={height}
              paused={false}
            />
          </View>
        ) : null}
        {/* Behind the card, so the burst flies out from under it. */}
        {animate ? (
          <View style={styles.burstAnchor} pointerEvents="none">
            <BurstLater particles={particles} ring={colors.glow} delay={CUE.burst} />
          </View>
        ) : null}
        <Animated.View
          entering={animate ? ZoomIn.springify().damping(11).stiffness(140).delay(CUE.card) : FadeIn.duration(200)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, boxShadow: `0 18px 48px ${rgba(colors.glow, 0.35)}` }]}
        >
          <Animated.Text entering={enter(ZoomIn.springify().damping(8), CUE.emoji)} style={styles.emoji} allowFontScaling={false} {...HIDDEN}>
            {emoji}
          </Animated.Text>
          <Animated.Text
            entering={enter(FadeInDown.duration(320), CUE.title)}
            maxFontSizeMultiplier={maxTitleScale}
            style={[styles.title, { color: colors.title }]}
          >
            {title}
          </Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * A burst that waits its cue, so it goes off as the card lands.
 *
 * @param props.particles What it throws.
 * @param props.ring The ring's colour.
 * @param props.delay How long it waits.
 * @return The burst, once its time has come.
 */
function BurstLater({ particles, ring, delay }: { particles: readonly string[]; ring: string; delay: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return on ? <Burst particles={particles} ring={ring} reach={170} size={30} gravity={90} spin={140} /> : null;
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  bloom: { position: 'absolute', top: '50%', left: '50%' },
  card: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 3,
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 360,
  },
  emoji: { fontSize: 88, lineHeight: 104 },
  title: { marginTop: 8, fontSize: 34, lineHeight: 40, fontWeight: '900', textAlign: 'center' },
  burstAnchor: { position: 'absolute', top: '46%', left: 0, right: 0, height: 0 },
});
