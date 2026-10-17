/**
 * A burst: particles thrown up out of a point, falling away under gravity,
 * spinning and fading, over a soft ring of light that expands behind them.
 * Played once, when it mounts.
 *
 * Particles alternate between a near and a far depth (bigger and further,
 * or smaller and closer in), and each varies its angle, reach, spin and
 * timing a little by index, so no two bursts of the same set look stamped.
 * Each runs on the UI thread from a single shared value; nothing re-renders
 * while it plays. See `shared.ts` for the rules every visual here follows.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { HIDDEN, hash, rgba } from './shared';

/** How long one particle flies. */
const FLIGHT_MS = 1000;

/** How long the ring takes to expand and fade. */
const RING_MS = 700;

/**
 * One particle of the burst.
 *
 * @param props.emoji What is thrown.
 * @param props.index Its place in the burst.
 * @param props.count How many are thrown in all.
 * @param props.reach How far the near ones fly, in points.
 * @param props.gravity How far it has fallen by the end.
 * @param props.spin How far it has turned by the end, in degrees.
 * @param props.size Its emoji size at the near depth.
 * @return The particle.
 */
function Particle({ emoji, index, count, reach, gravity, spin, size }: { emoji: string; index: number; count: number; reach: number; gravity: number; spin: number; size: number }) {
  const t = useSharedValue(0);
  const near = index % 2 === 0;
  // Fanned over the upper half-circle, each nudged off its slot.
  const angle = Math.PI * (0.1 + (0.8 * (index + (hash(index, 1) - 0.5) * 0.6)) / Math.max(1, count - 1));
  const distance = reach * (near ? 1 : 0.68) * (0.85 + hash(index, 2) * 0.3);
  const turn = spin * (hash(index, 3) - 0.5) * 2;
  const scale = near ? 1 : 0.72;

  useEffect(() => {
    t.value = withDelay(index * 22 + hash(index, 4) * 40, withTiming(1, { duration: FLIGHT_MS, easing: Easing.linear }));
  }, [index, t]);

  const style = useAnimatedStyle(() => {
    // Thrown out fast and slowing (ease-out), while gravity pulls down
    // harder as time goes on (t²): a ballistic arc, not a straight line.
    const out = 1 - (1 - t.value) * (1 - t.value);
    return {
      opacity: t.value < 0.6 ? 1 : 1 - (t.value - 0.6) / 0.4,
      transform: [
        { translateX: -Math.cos(angle) * distance * out },
        { translateY: -Math.sin(angle) * distance * out + gravity * t.value * t.value },
        { scale: scale * (0.45 + Math.min(1, t.value * 3) * 0.55) },
        { rotate: `${turn * t.value}deg` },
      ],
    };
  });

  return (
    <Animated.Text style={[styles.particle, { fontSize: size, zIndex: near ? 2 : 1 }, style]} allowFontScaling={false}>
      {emoji}
    </Animated.Text>
  );
}

/**
 * The soft ring behind the burst.
 *
 * @param props.color Its colour, `#rrggbb`.
 * @param props.size Its diameter when fully grown, in points.
 * @return The ring.
 */
function Ring({ color, size }: { color: string; size: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: RING_MS, easing: Easing.out(Easing.cubic) });
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - t.value),
    transform: [{ scale: 0.15 + t.value * 0.85 }],
  }));
  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size,
          borderColor: rgba(color, 0.8),
          backgroundColor: rgba(color, 0.12),
          boxShadow: `0 0 ${size / 6}px ${rgba(color, 0.6)}`,
        },
        style,
      ]}
    />
  );
}

/**
 * The burst. Place it inside a container that does not clip; it centres on
 * its own position.
 *
 * @param props.particles What is thrown, one emoji each.
 * @param props.ring The ring's colour, `#rrggbb`, or none for no ring.
 * @param props.gravity How far a particle falls by the end, in points.
 * @param props.spin How far a particle turns by the end, in degrees.
 * @param props.reach How far the near particles fly, in points.
 * @param props.size The near particles' emoji size.
 * @return The burst.
 */
export function Burst({
  particles,
  ring,
  gravity = 60,
  spin = 90,
  reach = 120,
  size = 26,
}: {
  particles: readonly string[];
  ring?: string;
  gravity?: number;
  spin?: number;
  reach?: number;
  size?: number;
}) {
  return (
    <View pointerEvents="none" style={styles.origin} {...HIDDEN}>
      {ring ? <Ring color={ring} size={reach * 1.4} /> : null}
      {particles.map((emoji, index) => (
        <Particle key={index} emoji={emoji} index={index} count={particles.length} reach={reach} gravity={gravity} spin={spin} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  origin: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: { position: 'absolute' },
  ring: { position: 'absolute', borderWidth: 2 },
});
