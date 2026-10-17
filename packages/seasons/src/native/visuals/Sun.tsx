/**
 * A sun high in the sky behind the top of a screen: a warm core with a
 * crown of soft rays turning slowly around it, long and short in turn, and
 * the core breathing a little warmer and back.
 *
 * Drawn with React Native's own gradients: the core is a radial gradient,
 * each ray a linear one fading out along its length. One rotation of the
 * whole crown takes a minute or two, which reads as warmth rather than as
 * motion. It sits behind the content and never takes a touch. See
 * `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RAY_STRENGTH, SUN_REACH as REACH } from '../../presets/optics.ts';
import { HIDDEN, playState, rgba } from './shared.ts';

/** A ray's width at its root, as a fraction of the core's radius. */
const RAY_WIDTH = 0.22;

/** One slow breath of the core, in milliseconds. */
const BREATHE_MS = 6000;

/**
 * The sun.
 *
 * @param props.color Its colour, `#rrggbb`.
 * @param props.alpha The core's peak opacity.
 * @param props.x Its centre across the band, 0 to 1.
 * @param props.y Its centre down the band, 0 to 1.
 * @param props.radius The core's radius, as a fraction of the band's width.
 * @param props.rays How many rays.
 * @param props.turnMs One full turn of the rays, in milliseconds.
 * @param props.width The band's width, in points.
 * @param props.height The band's height, in points.
 * @param props.animate Whether the rays turn and the core breathes.
 * @param props.paused Hold them.
 * @return The sun.
 */
export function Sun({
  color,
  alpha,
  x,
  y,
  radius,
  rays,
  turnMs,
  width,
  height,
  animate,
  paused,
}: {
  color: string;
  alpha: number;
  x: number;
  y: number;
  radius: number;
  rays: number;
  turnMs: number;
  width: number;
  height: number;
  animate: boolean;
  paused: boolean;
}) {
  const r = radius * width;
  const crown = r * REACH;
  const core = useMemo(
    () => `radial-gradient(circle at 50% 50%, ${rgba(color, alpha)} 0%, ${rgba(color, alpha * 0.7)} 35%, ${rgba(color, alpha * 0.25)} 65%, ${rgba(color, 0)} 100%)`,
    [color, alpha],
  );
  const beams = useMemo(
    () =>
      Array.from({ length: rays }, (_, i) => ({
        angle: (i / rays) * 360,
        // Long and short in turn, like a child's drawing of the sun, but soft.
        length: crown * (i % 2 ? 0.72 : 1),
        background: `linear-gradient(to bottom, ${rgba(color, alpha * RAY_STRENGTH)} 0%, ${rgba(color, alpha * 0.18)} 55%, ${rgba(color, 0)} 100%)`,
      })),
    [rays, crown, color, alpha],
  );

  const turning = animate
    ? {
        animationName: { from: { transform: [{ rotate: '0deg' }] }, to: { transform: [{ rotate: '360deg' }] } },
        animationDuration: turnMs,
        animationIterationCount: 'infinite' as const,
        animationTimingFunction: 'linear' as const,
        animationPlayState: playState(paused),
      }
    : null;
  const breathing = animate
    ? {
        animationName: { from: { opacity: 0.8, transform: [{ scale: 0.96 }] }, to: { opacity: 1, transform: [{ scale: 1.04 }] } },
        animationDuration: BREATHE_MS / 2,
        animationDirection: 'alternate' as const,
        animationIterationCount: 'infinite' as const,
        animationTimingFunction: 'ease-in-out' as const,
        animationPlayState: playState(paused),
      }
    : null;

  return (
    <View pointerEvents="none" style={[styles.band, { height }]} {...HIDDEN}>
      <View style={[styles.centre, { left: x * width, top: y * height }]}>
        <Animated.View style={[styles.crown, { width: crown * 2, height: crown * 2, left: -crown, top: -crown }, turning]}>
          {beams.map((beam, i) => (
            <View
              key={i}
              style={[
                styles.ray,
                {
                  left: crown - (r * RAY_WIDTH) / 2,
                  top: crown,
                  width: r * RAY_WIDTH,
                  height: beam.length,
                  borderRadius: r * RAY_WIDTH,
                  experimental_backgroundImage: beam.background,
                  transform: [{ rotate: `${beam.angle}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', width: r * 2, height: r * 2, left: -r, top: -r, experimental_backgroundImage: core }, breathing]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  centre: { position: 'absolute', width: 0, height: 0 },
  crown: { position: 'absolute' },
  ray: { position: 'absolute', transformOrigin: 'top' },
});
