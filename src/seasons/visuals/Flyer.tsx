/**
 * Something crossing the top of the screen now and then: a bat, a sleigh.
 *
 * It flies a lap on a gently rising and dipping path, banking into each turn,
 * then waits off screen for its next lap. Winged flyers beat their wings
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
 * @param props.y Its cruising height, from the top.
 * @param props.size Its emoji size; a smaller one reads as further away.
 * @param props.width The screen's width, so it crosses all of it.
 * @param props.lapMs How long one crossing takes.
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
  y,
  size,
  width,
  lapMs,
  restMs,
  delay,
  seed,
  paused,
}: {
  emoji: string;
  mirror: boolean;
  flapMs?: number;
  y: number;
  size: number;
  width: number;
  lapMs: number;
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
    const lift = 10 + hash(seed, 1) * 14;
    const phase = hash(seed, 2) * Math.PI;
    // Sampled along the lap: x advances, y rides two slow swells, and the
    // flyer banks with the slope of its path.
    const steps = 8;
    const frames: Record<string, object> = {};
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const dy = Math.sin(t * Math.PI * 2 + phase) * lift - Math.sin(t * Math.PI) * lift * 0.6;
      const slope = Math.cos(t * Math.PI * 2 + phase);
      frames[`${(t * end).toFixed(2)}%`] = {
        opacity: i === 0 || i === steps ? 0 : 1,
        transform: [{ translateX: start + span * t }, { translateY: dy }, { rotate: `${(slope * 8).toFixed(1)}deg` }],
      };
    }
    frames['100%'] = { opacity: 0, transform: [{ translateX: start + span }, { translateY: 0 }, { rotate: '0deg' }] };
    return { frames, total };
  }, [lapMs, restMs, size, width, seed]);

  const flap = flapMs
    ? {
        animationName: { from: { transform: [{ scaleX: mirror ? -1 : 1 }, { scaleY: 1 }] }, to: { transform: [{ scaleX: mirror ? -1 : 1 }, { scaleY: 0.55 }] } },
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
