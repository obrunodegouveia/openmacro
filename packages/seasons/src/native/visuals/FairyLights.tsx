/**
 * A garland hung across the top of a screen, in swags: fairy lights, each
 * bulb glowing in its own colour and twinkling on its own beat, or beads
 * (blossoms, leaves) hung along a stem, each swaying on its own.
 *
 * Drawn with plain views: the wire is short rotated segments sampled along
 * the curve, each bulb a rounded view with a coloured `boxShadow` glow. The
 * twinkle is a slow opacity breath of the glow (never a flash; the shortest
 * beat is well under 3 Hz), staggered so the string shimmers rather than
 * blinks. See `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState, rgba } from './shared.ts';

/** How many swags the string hangs in across the width. */
const SWAGS = 2;

/** How many straight segments draw the wire. */
const SEGMENTS = 28;

/** The bulb's size, in points. */
const BULB = { width: 8, height: 11 } as const;

/** The quietest a bulb gets, mid-twinkle. */
const DIM = 0.5;

/** A bead's emoji size, in points. */
const BEAD = 17;

/** How far a bead swings either way, in degrees. */
const BEAD_SWING = 9;

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
 * @param props.beads Emoji hung instead of bulbs, in order along the string.
 * @param props.count How many bulbs or beads.
 * @param props.sag How far each swag dips, in points.
 * @param props.twinkleMs One twinkle (or a bead's sway), in milliseconds.
 * @param props.width The string's width.
 * @param props.wire The wire's colour.
 * @param props.animate Whether the bulbs twinkle and the beads sway; still, they hang steady.
 * @param props.paused Hold the twinkle.
 * @return The lights.
 */
export function FairyLights({
  colors,
  beads,
  count,
  sag,
  twinkleMs,
  width,
  wire,
  animate,
  paused,
}: {
  colors: readonly string[];
  beads?: readonly string[];
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
          color: colors[i % Math.max(1, colors.length)] ?? '#FFFFFF',
          bead: beads?.length ? beads[i % beads.length]! : null,
          // Hangs off the wire, tipped a little with it.
          angle: Math.atan(slope) * 0.6 + (hash(i, 1) - 0.5) * 0.3,
          duration: twinkleMs * (0.75 + hash(i, 2) * 0.5),
          delay: hash(i, 3) * twinkleMs,
        };
      }),
    [colors, beads, count, width, sag, twinkleMs],
  );

  return (
    <View pointerEvents="none" style={[styles.box, { width, height: sag + (beads?.length ? BEAD + 8 : BULB.height + 12) }]} {...HIDDEN}>
      {segments.map((s, i) => (
        <View
          key={i}
          style={[styles.wire, { left: s.left, top: s.top, width: s.length + 0.5, backgroundColor: wire, transform: [{ rotate: `${s.angle}rad` }] }]}
        />
      ))}
      {bulbs.map((b, i) =>
        b.bead ? (
          // A bead hangs from its stalk and sways like a flower in a breeze.
          <Animated.View
            key={i}
            style={[
              styles.beadAnchor,
              { left: b.x - BEAD / 2, top: b.y - 2, transform: [{ rotate: `${b.angle}rad` }] },
              animate
                ? {
                    animationName: {
                      from: { transform: [{ rotate: `${(b.angle * 180) / Math.PI - BEAD_SWING}deg` }] },
                      to: { transform: [{ rotate: `${(b.angle * 180) / Math.PI + BEAD_SWING}deg` }] },
                    },
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
            <Text allowFontScaling={false} style={styles.bead}>
              {b.bead}
            </Text>
          </Animated.View>
        ) : (
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
        ),
      )}
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
  beadAnchor: { position: 'absolute', width: BEAD, alignItems: 'center', transformOrigin: 'top' },
  bead: { fontSize: BEAD, lineHeight: BEAD + 3 },
  glint: { position: 'absolute', top: 2, left: 2, width: 2, height: 3, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
});
