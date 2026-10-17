/**
 * Frost along the top edge of a card: a thin, pale rim that thickens in
 * places, crystals set along it, and now and then one of them catching the
 * light.
 *
 * Plain views and a glyph; the glints are slow (one every few seconds per
 * crystal, never in step), so nothing flashes. Place it inside the card,
 * which must not clip; it sits over the card's top edge and never takes a
 * touch. See `shared.ts` for the rules every visual here follows.
 */

import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState, rgba } from './shared';

/** The crystals along the rim, as [left %, size in points]. */
const CRYSTALS: readonly (readonly [number, number])[] = [
  [6, 9],
  [19, 6],
  [33, 11],
  [47, 7],
  [58, 10],
  [72, 6],
  [86, 12],
  [95, 7],
];

/** Where the rim thickens, as [left %, width %]. */
const THICK: readonly (readonly [number, number])[] = [
  [4, 18],
  [30, 14],
  [55, 20],
  [82, 14],
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
    <View pointerEvents="none" style={[styles.rim, { left: inset * 0.5, right: inset * 0.5 }]} {...HIDDEN}>
      <View style={[styles.line, { experimental_backgroundImage: `linear-gradient(to bottom, ${rgba(color, 0.85)}, ${rgba(color, 0.25)})` }]} />
      {THICK.map(([left, width], i) => (
        <View
          key={`t${i}`}
          style={[
            styles.thick,
            { left: `${left}%`, width: `${width}%`, experimental_backgroundImage: `linear-gradient(to bottom, ${rgba(color, 0.7)}, ${rgba(color, 0)})` },
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
  rim: { position: 'absolute', top: -2, height: 8 },
  line: { position: 'absolute', left: 0, right: 0, top: 0, height: 3, borderRadius: 2 },
  thick: { position: 'absolute', top: 0, height: 7, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  crystal: { position: 'absolute' },
});
