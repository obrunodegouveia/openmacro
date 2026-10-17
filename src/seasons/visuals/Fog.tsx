/**
 * Low fog lying along the bottom of a screen, two banks drifting slowly past
 * each other in opposite directions.
 *
 * Each bank is a row of soft radial gradients, wider than the screen, so its
 * drift never shows an edge. Place it behind the content (before the scroll
 * view), where it shows only through the gaps between cards and never dims
 * text. See `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, playState, rgba } from './shared';

/** How much wider than the screen each bank is, so its drift never shows an edge. */
const OVERHANG = 0.3;

/**
 * One bank's gradient: a row of soft puffs along the bottom.
 *
 * @param color The fog, `#rrggbb`.
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
 * The fog.
 *
 * @param props.color The fog, `#rrggbb`.
 * @param props.alpha Its densest opacity.
 * @param props.height How high it reaches, in points.
 * @param props.bottom How far above the bottom edge it lies (a tab bar's height).
 * @param props.width The screen's width.
 * @param props.driftMs One drift across and back.
 * @param props.animate Whether it drifts; still, it lies where it is.
 * @param props.paused Hold the drift.
 * @return The fog.
 */
export function Fog({
  color,
  alpha,
  height,
  bottom,
  width,
  driftMs,
  animate,
  paused,
}: {
  color: string;
  alpha: number;
  height: number;
  bottom: number;
  width: number;
  driftMs: number;
  animate: boolean;
  paused: boolean;
}) {
  const banks = useMemo(() => [bank(color, alpha, 5, 0.2), bank(color, alpha * 0.8, 4, 0.6)], [color, alpha]);
  const travel = width * OVERHANG;

  return (
    <View pointerEvents="none" style={[styles.fog, { height, bottom }]} {...HIDDEN}>
      {banks.map((background, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bank,
            { left: -travel, width: width + travel * 2, experimental_backgroundImage: background, top: i * height * 0.2 },
            animate
              ? {
                  animationName: {
                    from: { transform: [{ translateX: i ? travel : -travel }] },
                    to: { transform: [{ translateX: i ? -travel : travel }] },
                  },
                  animationDuration: (driftMs / 2) * (i ? 1.3 : 1),
                  animationDirection: 'alternate',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                  animationPlayState: playState(paused),
                }
              : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fog: { position: 'absolute', left: 0, right: 0, overflow: 'hidden' },
  bank: { position: 'absolute', bottom: 0 },
});
