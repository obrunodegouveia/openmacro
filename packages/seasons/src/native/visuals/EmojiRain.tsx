/**
 * Emoji falling down the whole screen, over and over, in three depths: the
 * celebration on a finished lesson.
 *
 * Near drops are bigger, faster and fully opaque; far ones smaller, slower
 * and fainter. Each is a Reanimated CSS animation on the UI thread. See
 * `shared.ts` for the rules every visual here follows.
 */

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState } from './shared.ts';

/** The depths, far first: emoji size, one fall in milliseconds, opacity. */
const DEPTHS = [
  { size: 18, fallMs: 8200, opacity: 0.55 },
  { size: 24, fallMs: 6400, opacity: 0.8 },
  { size: 32, fallMs: 4800, opacity: 1 },
] as const;

/**
 * The rain. Place it last inside the screen's root view.
 *
 * @param props.emoji What falls, cycled through.
 * @param props.count How many drops in all.
 * @param props.width The screen's width.
 * @param props.height The screen's height.
 * @param props.paused Hold every drop where it is.
 * @return The rain.
 */
export function EmojiRain({ emoji, count, width, height, paused }: { emoji: readonly string[]; count: number; width: number; height: number; paused: boolean }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const depth = DEPTHS[i % DEPTHS.length]!;
        const sway = 10 + hash(i, 1) * 14;
        const spin = (hash(i, 2) - 0.5) * 480;
        const at = (t: number) => ({
          transform: [{ translateY: -60 + t * (height + 120) }, { translateX: Math.sin(t * Math.PI * 3) * sway }, { rotate: `${spin * t}deg` }],
        });
        return {
          // Even lanes, each nudged so the columns don't line up.
          x: ((i + 0.2 + hash(i, 3) * 0.6) / count) * width - depth.size / 2,
          depth,
          delay: hash(i, 4) * 4000,
          duration: depth.fallMs * (0.85 + hash(i, 5) * 0.3),
          frames: { '0%': at(0), '33%': at(1 / 3), '66%': at(2 / 3), '100%': at(1) },
          emoji: emoji[i % emoji.length]!,
        };
      }),
    [emoji, count, width, height],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {drops.map((drop, i) => (
        <Animated.Text
          key={i}
          allowFontScaling={false}
          style={[
            styles.drop,
            { left: drop.x, fontSize: drop.depth.size, opacity: drop.depth.opacity },
            {
              animationName: drop.frames,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
              animationFillMode: 'backwards',
              animationPlayState: playState(paused),
            },
          ]}
        >
          {drop.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Starts above the screen, so a drop waiting for its first fall is unseen.
  drop: { position: 'absolute', top: -60 },
});
