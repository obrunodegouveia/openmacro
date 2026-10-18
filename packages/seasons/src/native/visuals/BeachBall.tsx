/**
 * A beach ball, drawn with plain views and React Native's own gradients:
 * there is no beach-ball emoji. The geometry is `BEACH_BALL` in the presets,
 * shared with the web's `BeachBall`, so both draw the same ball. See
 * `shared.ts` for the rules every visual here follows.
 */

import { StyleSheet, View } from 'react-native';

import { BEACH_BALL } from '../../presets/drawings.ts';
import { HIDDEN } from './shared.ts';

/**
 * The ball.
 *
 * @param props.size Its diameter, in points.
 * @return The ball.
 */
export function BeachBall({ size }: { size: number }) {
  const { colors, cap } = BEACH_BALL;
  // A disc of the ball's size, squashed sideways into an ellipse (a lune's outline).
  const lune = (width: number, color: string) => (
    <View style={[styles.disc, { width: size, height: size, borderRadius: size / 2, backgroundColor: color, transform: [{ scaleX: width }] }]} />
  );
  return (
    <View
      pointerEvents="none"
      style={[styles.ball, { width: size, height: size, borderRadius: size / 2, transform: [{ rotate: `${BEACH_BALL.tilt}deg` }], borderColor: BEACH_BALL.rim }]}
      {...HIDDEN}
    >
      <View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: `linear-gradient(to right, ${colors.left} 50%, ${colors.right} 50%)` }]} />
      {lune(BEACH_BALL.whiteWidth, colors.white)}
      {lune(BEACH_BALL.frontWidth, colors.front)}
      <View
        style={[
          styles.disc,
          {
            width: size * cap.width,
            height: size * cap.width,
            borderRadius: (size * cap.width) / 2,
            left: (size * (1 - cap.width)) / 2,
            top: -(size * cap.width) / 2,
            backgroundColor: colors.cap,
            transform: [{ scaleY: cap.height / cap.width }],
          },
        ]}
      />
      <View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: BEACH_BALL.highlight }]} />
      <View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: BEACH_BALL.shade }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  ball: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  disc: { position: 'absolute', top: 0, left: 0 },
});
