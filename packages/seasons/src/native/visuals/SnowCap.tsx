/**
 * Snow settled along the top edge of a card: a soft drift, thicker in
 * places, with a few lumps and a drip or two over the edge.
 *
 * Plain rounded views, still by nature. Place it inside the card, which
 * must not clip; it sits over the card's top edge and never takes a touch.
 * See `shared.ts` for the rules every visual here follows.
 */

import { StyleSheet, View } from 'react-native';

import { HIDDEN, rgba } from './shared.ts';

/** The lumps along the drift, as [left %, width %, height in points]. */
const LUMPS: readonly (readonly [number, number, number])[] = [
  [2, 22, 13],
  [16, 30, 16],
  [38, 18, 11],
  [50, 26, 15],
  [70, 20, 12],
  [82, 16, 14],
];

/** The drips over the edge, as [left %, length in points]. */
const DRIPS: readonly (readonly [number, number])[] = [
  [24, 7],
  [61, 5],
  [86, 6],
];

/**
 * The snow cap.
 *
 * @param props.color The snow, `#rrggbb`.
 * @param props.shade Its shadow, `#rrggbb`, which gives the drift its form
 *     on a pale card.
 * @param props.inset How far in from the card's corners the drift stops,
 *     usually its corner radius.
 * @return The cap.
 */
export function SnowCap({ color, shade, inset }: { color: string; shade: string; inset: number }) {
  const shadow = `0 2px 3px ${rgba(shade, 0.22)}`;
  return (
    <View pointerEvents="none" style={[styles.cap, { left: inset * 0.6, right: inset * 0.6 }]} {...HIDDEN}>
      {/* The lumps first, so the base's shadow falls only below the drift. */}
      {LUMPS.map(([left, width, height], i) => (
        <View
          key={i}
          style={[
            styles.lump,
            { left: `${left}%`, width: `${width}%`, height, bottom: 4, backgroundColor: color },
          ]}
        />
      ))}
      <View style={[styles.base, { backgroundColor: color, boxShadow: shadow }]} />
      {DRIPS.map(([left, length], i) => (
        <View key={`d${i}`} style={[styles.drip, { left: `${left}%`, height: length + 6, backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cap: { position: 'absolute', top: -10, height: 18 },
  base: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, borderRadius: 6 },
  lump: { position: 'absolute', borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  drip: { position: 'absolute', top: 10, width: 5, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
});
