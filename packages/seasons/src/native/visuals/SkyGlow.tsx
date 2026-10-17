/**
 * A tinted sky behind the top of a screen: a few soft radial glows, stacked,
 * breathing slowly brighter and back.
 *
 * Drawn with React Native's own `experimental_backgroundImage` gradients, so
 * it needs no gradient package and no native module. It sits behind the
 * content and never takes a touch. See `shared.ts` for the rules every
 * visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { GLOW_FALLOFF as FALLOFF } from '../../presets/optics.ts';
import { HIDDEN, playState, rgba } from './shared.ts';

/** One glow, already resolved for the appearance on screen. */
export interface Glow {
  /** `#rrggbb`. */
  readonly color: string;
  /** Centre, as fractions of the band's width and height. */
  readonly x: number;
  readonly y: number;
  /** Radii, as fractions of the band's width and height. */
  readonly rx: number;
  readonly ry: number;
  /** Opacity at the centre. */
  readonly alpha: number;
}

/** How much dimmer the glow is at the bottom of its breath. */
const BREATH_LOW = 0.72;

/**
 * The CSS gradient for a set of glows, each fading to nothing at its edge
 * along `FALLOFF`.
 *
 * @param glows The glows.
 * @return A comma-separated list of `radial-gradient()`s.
 */
export function glowGradient(glows: readonly Glow[]): string {
  return glows
    .map(
      (glow) =>
        `radial-gradient(ellipse ${Math.round(glow.rx * 100)}% ${Math.round(glow.ry * 100)}% at ${Math.round(glow.x * 100)}% ${Math.round(glow.y * 100)}%, ` +
        FALLOFF.map(([at, k]) => `${rgba(glow.color, glow.alpha * k)} ${at * 100}%`).join(', ') +
        ')',
    )
    .join(', ');
}

/**
 * The sky. Place it as the first child of a screen's root view, before the
 * scroll view, so everything else draws over it.
 *
 * @param props.glows The glows, resolved for the current appearance.
 * @param props.height How tall the band is, in points.
 * @param props.breatheMs One breath, in milliseconds.
 * @param props.animate Whether it breathes; still, it holds its brightest.
 * @param props.paused Hold the breath (screen out of focus, app in the background).
 * @return The sky.
 */
export function SkyGlow({
  glows,
  height,
  breatheMs,
  animate,
  paused,
}: {
  glows: readonly Glow[];
  height: number;
  breatheMs: number;
  animate: boolean;
  paused: boolean;
}) {
  const background = useMemo(() => glowGradient(glows), [glows]);
  const breath = animate
    ? {
        animationName: { from: { opacity: BREATH_LOW, transform: [{ scale: 1 }] }, to: { opacity: 1, transform: [{ scale: 1.04 }] } },
        animationDuration: breatheMs / 2,
        animationDirection: 'alternate' as const,
        animationIterationCount: 'infinite' as const,
        animationTimingFunction: 'ease-in-out' as const,
        animationPlayState: playState(paused),
      }
    : null;

  return (
    <View pointerEvents="none" style={[styles.band, { height }]} {...HIDDEN}>
      <Animated.View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: background }, breath]} />
    </View>
  );
}

const styles = StyleSheet.create({
  band: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
});
