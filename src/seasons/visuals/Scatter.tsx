/**
 * A few things resting along the top edge of a card: fallen leaves, petals,
 * shells. Still by nature, each at its own tilt, as if they had landed there.
 *
 * Emoji only. Place it inside the card, which must not clip; it sits over
 * the card's top edge and never takes a touch. See `shared.ts` for the rules
 * every visual here follows.
 */

import { StyleSheet, Text, View } from 'react-native';

import { HIDDEN, hash } from './shared';

/** Where each one lands along the edge, in %, left to right; as many as are given, up to these. */
const SPOTS = [9, 31, 58, 80] as const;

/**
 * The scatter.
 *
 * @param props.emoji What rests there, one per spot in turn.
 * @param props.size Their size, in points.
 * @return The scatter.
 */
export function Scatter({ emoji, size = 18 }: { emoji: readonly string[]; size?: number }) {
  return (
    <View pointerEvents="none" style={styles.edge} {...HIDDEN}>
      {SPOTS.slice(0, Math.max(1, emoji.length)).map((left, i) => (
        <Text
          key={i}
          allowFontScaling={false}
          style={[
            styles.item,
            {
              left: `${left}%`,
              top: -size * (0.55 + hash(i, 1) * 0.15),
              fontSize: size * (0.85 + hash(i, 2) * 0.3),
              transform: [{ rotate: `${Math.round((hash(i, 3) - 0.5) * 120)}deg` }],
            },
          ]}
        >
          {emoji[i % emoji.length]}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  edge: { position: 'absolute', top: 0, left: 0, right: 0, height: 0 },
  item: { position: 'absolute' },
});
