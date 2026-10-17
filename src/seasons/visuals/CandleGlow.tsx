/**
 * A candle's glow behind something lit from inside: a jack-o'-lantern, a
 * paper lantern, a window.
 *
 * A warm coloured `boxShadow` that flickers irregularly, the way a flame
 * does: several uneven dips and recoveries per cycle, smoothed, never a hard
 * on-off. The fastest change is far slower than 3 Hz, so it never strobes.
 * See `shared.ts` for the rules every visual here follows.
 */

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, playState, rgba } from './shared';

/** One flicker cycle, as keyframe percentage to brightness. Uneven on purpose. */
const FLICKER: Readonly<Record<number, number>> = { 0: 1, 18: 0.82, 30: 0.95, 46: 0.7, 58: 0.9, 74: 0.78, 88: 0.97, 100: 1 };

/** The keyframes, built once. */
const FLICKER_FRAMES = Object.fromEntries(
  Object.entries(FLICKER).map(([at, value]) => [`${at}%`, { opacity: value, transform: [{ scale: 0.94 + value * 0.06 }] }]),
);

/**
 * The glow, with what it lights drawn over it.
 *
 * @param props.color The flame's colour, `#rrggbb`.
 * @param props.size The glow's diameter, in points; about the lantern's size.
 * @param props.flickerMs One flicker cycle, in milliseconds.
 * @param props.offset Shifts this one's cycle, so a row of lanterns does not
 *     flicker in step.
 * @param props.animate Whether it flickers; still, it glows steadily.
 * @param props.paused Hold the flicker.
 * @param props.children What is lit.
 * @return The lit lantern.
 */
export function CandleGlow({
  color,
  size,
  flickerMs,
  offset = 0,
  animate,
  paused,
  children,
}: {
  color: string;
  size: number;
  flickerMs: number;
  offset?: number;
  animate: boolean;
  paused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size,
            backgroundColor: rgba(color, 0.25),
            boxShadow: `0 0 ${Math.round(size * 0.5)}px ${Math.round(size * 0.2)}px ${rgba(color, 0.55)}`,
          },
          animate
            ? {
                animationName: FLICKER_FRAMES,
                animationDuration: flickerMs,
                animationDelay: offset * flickerMs,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
                animationPlayState: playState(paused),
              }
            : null,
        ]}
        {...HIDDEN}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
});
