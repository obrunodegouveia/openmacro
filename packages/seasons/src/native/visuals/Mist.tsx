/**
 * Something low along the bottom of a screen, behind the content, in one of
 * three moods:
 *
 * - `drift`: two banks of fog sliding slowly past each other (Halloween).
 * - `breathe`: two banks of mist swelling and rising a little, then
 *   settling, out of step, like breath on a cold day.
 * - `shimmer`: thin bands of warm air wavering over hot ground.
 *
 * Each bank is a row of soft gradients wider than the screen, so its
 * movement never shows an edge. Place it behind the content (before the
 * scroll view), where it shows only through the gaps between cards and
 * never dims text. See `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, playState, rgba } from './shared.ts';

/** How much wider than the screen each bank is, so its movement never shows an edge. */
const OVERHANG = 0.3;

/** How many bands of warm air shimmer. */
const BANDS = 4;

/**
 * One bank's gradient: a row of soft puffs along the bottom.
 *
 * @param color The mist, `#rrggbb`.
 * @param alpha Its densest opacity.
 * @param puffs How many puffs, and so how lumpy the bank is.
 * @param shift Moves the puffs along, so two banks do not line up.
 * @return A list of `radial-gradient()`s.
 */
function bank(color: string, alpha: number, puffs: number, shift: number): string {
  return Array.from({ length: puffs }, (_, i) => {
    const x = Math.round(((i + shift) / puffs) * 100);
    const y = 70 + ((i * 37) % 3) * 10;
    return `radial-gradient(ellipse ${Math.round(140 / puffs)}% 80% at ${x}% ${y}%, ${rgba(color, alpha)} 0%, ${rgba(color, alpha * 0.4)} 50%, ${rgba(color, 0)} 100%)`;
  }).join(', ');
}

/**
 * One band of warm air: a row of thin, soft lenses, denser in places, so its
 * waver reads as heat rising off the ground rather than as a stripe. Soft at
 * every edge, so a band never shows a line.
 *
 * @param color The air, `#rrggbb`.
 * @param alpha Its densest opacity.
 * @param shift Moves the dense places along, so the bands do not line up.
 * @return A list of `radial-gradient()`s.
 */
function ripple(color: string, alpha: number, shift: number): string {
  const lenses = 7;
  return Array.from({ length: lenses }, (_, i) => {
    const x = Math.round(((i + 0.5 + (shift % 1)) / lenses) * 100);
    const strength = 0.4 + 0.6 * Math.abs(Math.sin((i + shift) * 1.7));
    return `radial-gradient(ellipse ${Math.round(120 / lenses)}% 50% at ${x}% 50%, ${rgba(color, alpha * strength)} 0%, ${rgba(color, alpha * strength * 0.35)} 45%, ${rgba(color, 0)} 100%)`;
  }).join(', ');
}

/**
 * The movement of one bank or band, by mode.
 *
 * @param mode The mood.
 * @param i Which bank or band.
 * @param travel How far a drifting bank travels, in points.
 * @param cycleMs One full cycle.
 * @param paused Hold it.
 * @return The animation style.
 */
function movement(mode: 'drift' | 'breathe' | 'shimmer', i: number, travel: number, cycleMs: number, paused: boolean): ViewStyle {
  const common = {
    animationDirection: 'alternate' as const,
    animationIterationCount: 'infinite' as const,
    animationTimingFunction: 'ease-in-out' as const,
    animationPlayState: playState(paused),
  };
  if (mode === 'drift') {
    return {
      ...common,
      animationName: {
        from: { transform: [{ translateX: i ? travel : -travel }] },
        to: { transform: [{ translateX: i ? -travel : travel }] },
      },
      animationDuration: (cycleMs / 2) * (i ? 1.3 : 1),
    } as ViewStyle;
  }
  if (mode === 'breathe') {
    // Out of step: one bank breathes out while the other settles.
    return {
      ...common,
      animationName: {
        from: { opacity: 0.45, transform: [{ translateY: 14 }, { scaleY: 0.9 }] },
        to: { opacity: 1, transform: [{ translateY: -10 }, { scaleY: 1.1 }] },
      },
      animationDuration: (cycleMs / 2) * (1 + i * 0.17),
      animationDelay: -i * (cycleMs / 3),
    } as ViewStyle;
  }
  // Shimmer: each band wavers on its own beat, stretching, sliding a little
  // and brightening, never in step with its neighbours.
  return {
    ...common,
    animationName: {
      from: { opacity: 0.4, transform: [{ translateX: -travel * 0.08 }, { scaleY: 0.7 }] },
      to: { opacity: 1, transform: [{ translateX: travel * 0.08 }, { scaleY: 1.5 }] },
    },
    animationDuration: (cycleMs / 2) * (1 + ((i * 0.29) % 0.5)),
    animationDelay: -i * (cycleMs / 5),
  } as ViewStyle;
}

/**
 * The mist.
 *
 * @param props.mode `drift`, `breathe` or `shimmer`.
 * @param props.color Its colour, `#rrggbb`.
 * @param props.alpha Its densest opacity.
 * @param props.height How high it reaches, in points.
 * @param props.bottom How far above the bottom edge it lies (a tab bar's height).
 * @param props.width The screen's width.
 * @param props.cycleMs One full cycle: across and back, one breath, one waver.
 * @param props.animate Whether it moves; still, it lies where it is.
 * @param props.paused Hold it.
 * @return The mist.
 */
export function Mist({
  mode,
  color,
  alpha,
  height,
  bottom,
  width,
  cycleMs,
  animate,
  paused,
}: {
  mode: 'drift' | 'breathe' | 'shimmer';
  color: string;
  alpha: number;
  height: number;
  bottom: number;
  width: number;
  cycleMs: number;
  animate: boolean;
  paused: boolean;
}) {
  const layers = useMemo(() => {
    if (mode === 'shimmer') {
      // Thin bands stacked low over the ground, fainter as they rise.
      return Array.from({ length: BANDS }, (_, i) => ({
        background: ripple(color, alpha * (1 - i * 0.18), i * 1.3),
        top: height * (0.5 + i * 0.11),
        height: height * 0.14,
      }));
    }
    return [
      { background: bank(color, alpha, 5, 0.2), top: 0, height },
      { background: bank(color, alpha * 0.8, 4, 0.6), top: height * 0.2, height: height * 0.8 },
    ];
  }, [mode, color, alpha, height]);
  const travel = width * OVERHANG;

  return (
    <View pointerEvents="none" style={[styles.mist, { height, bottom }]} {...HIDDEN}>
      {layers.map((layer, i) => (
        <Animated.View
          key={i}
          style={[
            styles.layer,
            { left: -travel, width: width + travel * 2, top: layer.top, height: layer.height, experimental_backgroundImage: layer.background },
            animate ? movement(mode, i, travel, cycleMs, paused) : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mist: { position: 'absolute', left: 0, right: 0, overflow: 'hidden' },
  layer: { position: 'absolute' },
});
