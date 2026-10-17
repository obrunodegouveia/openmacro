/**
 * A string of fairy lights hung across the top of a screen, in swags, each
 * bulb glowing in its own colour and twinkling on its own beat.
 *
 * Drawn with plain views: the wire is short rotated segments sampled along
 * the curve, each bulb a rounded view with a coloured `boxShadow` glow. The
 * twinkle is a slow opacity breath of the glow (never a flash; the shortest
 * beat is well under 3 Hz), staggered so the string shimmers rather than
 * blinks. See `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState, rgba } from './shared';

/** How many swags the string hangs in across the width. */
const SWAGS = 2;

/** How many straight segments draw the wire. */
const SEGMENTS = 28;

/** The bulb's size, in points. */
const BULB = { width: 8, height: 11 } as const;

/** The quietest a bulb gets, mid-twinkle. */
const DIM = 0.5;

/**
 * Where the wire is at a point across the width.
 *
 * @param x From the left edge.
 * @param width The string's width.
 * @param sag How far each swag dips.
 * @return The wire's height there, from the top, and its slope.
 */
function wireAt(x: number, width: number, sag: number): { y: number; slope: number } {
  const phase = (x / width) * Math.PI * SWAGS;
  return { y: Math.abs(Math.sin(phase)) * sag, slope: (Math.cos(phase) * Math.sign(Math.sin(phase) || 1) * sag * Math.PI * SWAGS) / width };
}

/**
 * The lights. Place them in a box as wide as the screen; they draw in the
 * top `sag + 20` points of it.
 *
 * @param props.colors Bulb colours, in order along the string, `#rrggbb`.
 * @param props.count How many bulbs.
 * @param props.sag How far each swag dips, in points.
 * @param props.twinkleMs One twinkle, in milliseconds.
 * @param props.width The string's width.
 * @param props.wire The wire's colour.
 * @param props.animate Whether the bulbs twinkle; still, they glow steadily.
 * @param props.paused Hold the twinkle.
 * @return The lights.
 */
export function FairyLights({
  colors,
  count,
  sag,
  twinkleMs,
  width,
  wire,
  animate,
  paused,
}: {
  colors: readonly string[];
  count: number;
  sag: number;
  twinkleMs: number;
  width: number;
  wire: ColorValue;
  animate: boolean;
  paused: boolean;
}) {
  const segments = useMemo(
    () =>
      Array.from({ length: SEGMENTS }, (_, i) => {
        const x0 = (i / SEGMENTS) * width;
        const x1 = ((i + 1) / SEGMENTS) * width;
        const y0 = wireAt(x0, width, sag).y;
        const y1 = wireAt(x1, width, sag).y;
        const length = Math.hypot(x1 - x0, y1 - y0);
        return { left: (x0 + x1) / 2 - length / 2, top: (y0 + y1) / 2, length, angle: Math.atan2(y1 - y0, x1 - x0) };
      }),
    [width, sag],
  );

  const bulbs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const x = ((i + 0.5) / count) * width;
        const { y, slope } = wireAt(x, width, sag);
        return {
          x,
          y,
          color: colors[i % colors.length]!,
          // Hangs off the wire, tipped a little with it.
          angle: Math.atan(slope) * 0.6 + (hash(i, 1) - 0.5) * 0.3,
          duration: twinkleMs * (0.75 + hash(i, 2) * 0.5),
          delay: hash(i, 3) * twinkleMs,
        };
      }),
    [colors, count, width, sag, twinkleMs],
  );

  return (
    <View pointerEvents="none" style={[styles.box, { width, height: sag + BULB.height + 12 }]} {...HIDDEN}>
      {segments.map((s, i) => (
        <View
          key={i}
          style={[styles.wire, { left: s.left, top: s.top, width: s.length + 0.5, backgroundColor: wire, transform: [{ rotate: `${s.angle}rad` }] }]}
        />
      ))}
      {bulbs.map((b, i) => (
        <View key={i} style={[styles.bulbAnchor, { left: b.x - BULB.width / 2, top: b.y, transform: [{ rotate: `${b.angle}rad` }] }]}>
          <View style={[styles.socket, { backgroundColor: wire }]} />
          <Animated.View
            style={[
              styles.bulb,
              {
                backgroundColor: b.color,
                boxShadow: `0 0 10px 2px ${rgba(b.color, 0.75)}`,
              },
              animate
                ? {
                    animationName: { from: { opacity: 1 }, to: { opacity: DIM } },
                    animationDuration: b.duration / 2,
                    animationDelay: b.delay,
                    animationDirection: 'alternate',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'ease-in-out',
                    animationPlayState: playState(paused),
                  }
                : null,
            ]}
          >
            {/* The glint that makes it glass. */}
            <View style={styles.glint} />
          </Animated.View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'relative' },
  wire: { position: 'absolute', height: 1.5, borderRadius: 1 },
  bulbAnchor: { position: 'absolute', width: BULB.width, alignItems: 'center', transformOrigin: 'top' },
  socket: { width: 4, height: 3, borderRadius: 1 },
  bulb: {
    width: BULB.width,
    height: BULB.height,
    borderTopLeftRadius: BULB.width / 2,
    borderTopRightRadius: BULB.width / 2,
    borderBottomLeftRadius: BULB.width,
    borderBottomRightRadius: BULB.width,
  },
  glint: { position: 'absolute', top: 2, left: 2, width: 2, height: 3, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
});
