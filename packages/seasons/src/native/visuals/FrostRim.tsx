/**
 * Frost along the top edge of a card: a thin, pale rim with short icicles
 * hanging from it, crystals set along it, and now and then one of them
 * catching the light.
 *
 * Plain views and a glyph; the glints are slow (one every few seconds per
 * crystal, never in step), so nothing flashes. Place it inside the card,
 * which must not clip; it sits over the card's top edge and never takes a
 * touch. See `shared.ts` for the rules every visual here follows.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState, rgba } from './shared.ts';

/** The crystals along the rim, as [left %, size in points]. */
const CRYSTALS: readonly (readonly [number, number])[] = [
  [5, 12],
  [17, 8],
  [31, 14],
  [45, 9],
  [57, 13],
  [70, 8],
  [84, 15],
  [95, 9],
];

/** The icicles hanging from the rim, as [left %, width, length], in points. */
const ICICLES: readonly (readonly [number, number, number])[] = [
  [8, 4, 10],
  [14, 3, 6],
  [23, 5, 14],
  [36, 3, 7],
  [44, 4, 11],
  [53, 3, 6],
  [63, 5, 13],
  [74, 3, 8],
  [81, 4, 12],
  [91, 3, 7],
];

/** One crystal's glint cycle, in milliseconds, before each varies it. */
const GLINT_MS = 5200;

/**
 * The frost.
 *
 * @param props.color The frost, `#rrggbb`.
 * @param props.inset How far in from the card's corners it stops, usually its corner radius.
 * @param props.animate Whether the crystals glint; still, they hold their shine.
 * @param props.paused Hold the glints.
 * @return The rim.
 */
export function FrostRim({ color, inset, animate, paused }: { color: string; inset: number; animate: boolean; paused: boolean }) {
  return (
    <View pointerEvents="none" style={[styles.rim, { left: inset * 0.85, right: inset * 0.85 }]} {...HIDDEN}>
      <View style={[styles.line, { experimental_backgroundImage: `linear-gradient(to bottom, ${rgba(color, 0.85)}, ${rgba(color, 0.25)})` }]} />
      {ICICLES.map(([left, width, length], i) => (
        <View
          key={`i${i}`}
          style={[
            styles.icicle,
            // A thin triangle, pointing down: a border trick, as views have no clip path.
            {
              left: `${left}%`,
              borderLeftWidth: width / 2,
              borderRightWidth: width / 2,
              borderTopWidth: length,
              borderTopColor: rgba(color, 0.7),
            },
          ]}
        />
      ))}
      {CRYSTALS.map(([left, size], i) => (
        <Animated.View
          key={i}
          style={[
            styles.crystal,
            { left: `${left}%`, marginLeft: -size / 2, top: 1 - size / 2 },
            animate
              ? {
                  animationName: {
                    '0%': { opacity: 0.6, transform: [{ scale: 1 }, { rotate: '0deg' }] },
                    '45%': { opacity: 0.6, transform: [{ scale: 1 }, { rotate: '0deg' }] },
                    '52%': { opacity: 1, transform: [{ scale: 1.35 }, { rotate: '45deg' }] },
                    '60%': { opacity: 0.6, transform: [{ scale: 1 }, { rotate: '90deg' }] },
                    '100%': { opacity: 0.6, transform: [{ scale: 1 }, { rotate: '90deg' }] },
                  },
                  animationDuration: GLINT_MS * (0.8 + hash(i, 1) * 0.6),
                  animationDelay: -hash(i, 2) * GLINT_MS,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'ease-in-out',
                  animationPlayState: playState(paused),
                }
              : { opacity: 0.8 },
          ]}
        >
          <Text allowFontScaling={false} style={{ fontSize: size, lineHeight: size + 2, color, textShadowColor: rgba(color, 0.9), textShadowRadius: size / 2 }}>
            ✦
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rim: { position: 'absolute', top: -2, height: 12 },
  line: { position: 'absolute', left: 0, right: 0, top: 0, height: 4, borderRadius: 2 },
  icicle: { position: 'absolute', top: 2, width: 0, height: 0, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  crystal: { position: 'absolute' },
});
