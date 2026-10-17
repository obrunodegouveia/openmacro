/**
 * Something crossing the top of the screen now and then: a bat, a sleigh, a
 * butterfly, a leaf on a gust.
 *
 * It flies a lap on a rising and dipping path (`wobble` high, `waves` times
 * across), banking into each turn or, given a `spin`, turning over and over
 * like a leaf, then waits off screen for its next lap. Winged flyers beat their wings
 * (a quick squash of the vertical scale, never a flash). Every part is a
 * Reanimated CSS animation on the UI thread, held in place when paused. See
 * `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState } from './shared';

/**
 * One flyer.
 *
 * @param props.emoji What flies.
 * @param props.mirror Flip it, so it faces the way it flies (left to right).
 * @param props.flapMs One wing beat, or none for a flyer without wings.
 * @param props.flapAxis Which way the wings fold: `y` squashes the height
 *     (a bat seen side on), `x` the width (a butterfly from above).
 * @param props.y Its cruising height, from the top.
 * @param props.size Its emoji size; a smaller one reads as further away.
 * @param props.width The screen's width, so it crosses all of it.
 * @param props.lapMs How long one crossing takes.
 * @param props.wobble How far the path rises and dips, in points.
 * @param props.waves How many rises and dips over one crossing.
 * @param props.spin How far it turns over one crossing, in degrees; none banks gently instead.
 * @param props.restMs How long it waits off screen between laps.
 * @param props.delay When the first lap starts.
 * @param props.seed Varies the path, so two flyers never fly in formation.
 * @param props.paused Hold it where it is.
 * @return The flyer.
 */
export function Flyer({
  emoji,
  mirror,
  flapMs,
  flapAxis = 'y',
  y,
  size,
  width,
  lapMs,
  wobble = 18,
  waves = 2,
  spin,
  restMs,
  delay,
  seed,
  paused,
}: {
  emoji: string;
  mirror: boolean;
  flapMs?: number;
  flapAxis?: 'x' | 'y';
  y: number;
  size: number;
  width: number;
  lapMs: number;
  wobble?: number;
  waves?: number;
  spin?: number;
  restMs: number;
  delay: number;
  seed: number;
  paused: boolean;
}) {
  const flight = useMemo(() => {
    const total = lapMs + restMs;
    // The share of the cycle spent flying, as a keyframe percentage.
    const end = (lapMs / total) * 100;
    const start = -size * 3;
    const span = width + size * 6;
    const lift = wobble * (0.7 + hash(seed, 1) * 0.6);
    const phase = hash(seed, 2) * Math.PI;
    // Sampled along the lap, four samples to each rise and dip: x advances,
    // y rides the swells, and the flyer banks with the slope of its path or
    // turns over with its spin.
    const steps = Math.max(8, Math.ceil(waves * 4));
    const frames: Record<string, object> = {};
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const dy = Math.sin(t * Math.PI * 2 * waves + phase) * lift - Math.sin(t * Math.PI) * lift * 0.6;
      const slope = Math.cos(t * Math.PI * 2 * waves + phase);
      const turn = spin ? spin * t * (hash(seed, 3) < 0.5 ? -1 : 1) : slope * 8;
      frames[`${(t * end).toFixed(2)}%`] = {
        opacity: i === 0 || i === steps ? 0 : 1,
        transform: [{ translateX: start + span * t }, { translateY: dy }, { rotate: `${turn.toFixed(1)}deg` }],
      };
    }
    frames['100%'] = { opacity: 0, transform: [{ translateX: start + span }, { translateY: 0 }, { rotate: `${spin ?? 0}deg` }] };
    return { frames, total };
  }, [lapMs, restMs, size, width, seed, wobble, waves, spin]);

  const flap = flapMs
    ? {
        animationName:
          flapAxis === 'x'
            ? { from: { transform: [{ scaleX: mirror ? -1 : 1 }, { scaleY: 1 }] }, to: { transform: [{ scaleX: mirror ? -0.35 : 0.35 }, { scaleY: 1 }] } }
            : { from: { transform: [{ scaleX: mirror ? -1 : 1 }, { scaleY: 1 }] }, to: { transform: [{ scaleX: mirror ? -1 : 1 }, { scaleY: 0.55 }] } },
        animationDuration: flapMs / 2,
        animationDirection: 'alternate' as const,
        animationIterationCount: 'infinite' as const,
        animationTimingFunction: 'ease-in-out' as const,
        animationPlayState: playState(paused),
      }
    : { transform: [{ scaleX: mirror ? -1 : 1 }] };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flyer,
        { top: y },
        {
          animationName: flight.frames,
          animationDuration: flight.total,
          animationDelay: delay,
          animationIterationCount: 'infinite',
          // Linear across the samples: an easing would restart at each one.
          animationTimingFunction: 'linear',
          animationFillMode: 'backwards',
          animationPlayState: playState(paused),
        },
      ]}
      {...HIDDEN}
    >
      <Animated.Text allowFontScaling={false} style={[{ fontSize: size }, flap]}>
        {emoji}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flyer: { position: 'absolute', left: 0 },
});
