/**
 * A field of ambient particles in depth: snow falling, embers rising.
 *
 * Each layer is one depth. Near particles are bigger, faster and more
 * opaque; far ones small, slow and faint, which reads as depth on a flat
 * screen. Every particle gets its own lane, size, speed, sway and start
 * from its index (`hash`), so the field looks scattered but never reshuffles.
 *
 * Every particle is a Reanimated CSS animation: declared once, run on the UI
 * thread, with no per-frame React work, and paused in place with
 * `animationPlayState`. See `shared.ts` for the rules every visual here
 * follows.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HIDDEN, hash, playState, rgba } from './shared';

/** One depth of the field. */
export interface ParticleLayer {
  /** How many particles. */
  readonly count: number;
  /** Diameter, in points. */
  readonly size: number;
  /** One crossing of the field, in milliseconds. */
  readonly crossMs: number;
  /** Peak opacity. */
  readonly opacity: number;
  /** Sideways sway, in points. */
  readonly sway: number;
}

/** The most particles one field draws, whatever it is asked for. */
export const MAX_PARTICLES = 40;

/** How far beyond the field's edges a particle starts and ends, in points. */
const OVERSCAN = 24;

/**
 * One particle crossing the field, over and over.
 *
 * @param props.x Its lane, from the left edge.
 * @param props.from Where each crossing starts, from the top.
 * @param props.to Where it ends.
 * @param props.drift The wind's push over one crossing.
 * @param props.sway How far it sways side to side.
 * @param props.duration One crossing.
 * @param props.delay When the first crossing starts.
 * @param props.opacity Its peak opacity.
 * @param props.paused Hold it where it is.
 * @param props.children What is drawn.
 * @return The particle.
 */
const Particle = memo(function Particle({
  x,
  from,
  to,
  drift,
  sway,
  duration,
  delay,
  opacity,
  paused,
  children,
}: {
  x: number;
  from: number;
  to: number;
  drift: number;
  sway: number;
  duration: number;
  delay: number;
  opacity: number;
  paused: boolean;
  children: React.ReactNode;
}) {
  // Fades in and out at the ends, so nothing pops at an edge, and sways on
  // a sine sampled at quarters while the wind carries it sideways.
  const keyframes = useMemo(() => {
    const at = (t: number) => ({
      transform: [{ translateY: from + (to - from) * t }, { translateX: drift * t + Math.sin(t * Math.PI * 2) * sway }],
    });
    return {
      '0%': { ...at(0), opacity: 0 },
      '12%': { opacity },
      '25%': at(0.25),
      '50%': at(0.5),
      '75%': at(0.75),
      '88%': { opacity },
      '100%': { ...at(1), opacity: 0 },
    };
  }, [from, to, drift, sway, opacity]);

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: x },
        {
          animationName: keyframes,
          animationDuration: duration,
          animationDelay: delay,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
          animationFillMode: 'backwards',
          animationPlayState: playState(paused),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

/**
 * The field. Place it inside an absolutely filled, untouchable container;
 * it fills its parent.
 *
 * @param props.layers The depths, far first.
 * @param props.color The particles' colour, `#rrggbb`.
 * @param props.glow Give each particle a soft halo in its own colour.
 * @param props.direction `fall` (top to bottom) or `rise`.
 * @param props.wind Sideways drift over one crossing, in points.
 * @param props.width The field's width.
 * @param props.height The field's height.
 * @param props.emoji Drawn instead of a dot for every `emojiEvery`-th
 *     particle of the nearest layer (the snowflake among the snow).
 * @param props.emojiEvery See `emoji`.
 * @param props.paused Hold every particle where it is.
 * @return The field.
 */
export function ParticleField({
  layers,
  color,
  glow,
  direction,
  wind,
  width,
  height,
  emoji,
  emojiEvery = 2,
  paused,
}: {
  layers: readonly ParticleLayer[];
  color: string;
  glow: boolean;
  direction: 'fall' | 'rise';
  wind: number;
  width: number;
  height: number;
  emoji?: string;
  emojiEvery?: number;
  paused: boolean;
}) {
  const particles = useMemo(() => {
    const out: { key: string; x: number; delay: number; duration: number; sway: number; size: number; opacity: number; emoji: boolean; depth: number }[] = [];
    layers.forEach((layer, depth) => {
      for (let i = 0; i < layer.count && out.length < MAX_PARTICLES; i += 1) {
        const n = depth * 100 + i;
        // Spread across the width in even lanes, each jittered within its own.
        const lane = (i + 0.2 + hash(n, 1) * 0.6) / layer.count;
        out.push({
          key: `${depth}-${i}`,
          x: lane * (width + OVERSCAN * 2) - OVERSCAN - wind / 2,
          duration: layer.crossMs * (0.85 + hash(n, 2) * 0.3),
          // Spread the first crossings over one full crossing, so the field
          // fills in gradually rather than all at once.
          delay: hash(n, 3) * layer.crossMs,
          sway: layer.sway * (0.6 + hash(n, 4) * 0.8),
          size: layer.size * (0.8 + hash(n, 5) * 0.4),
          opacity: layer.opacity * (0.75 + hash(n, 6) * 0.25),
          emoji: !!emoji && depth === layers.length - 1 && i % emojiEvery === 0,
          depth,
        });
      }
    });
    return out;
  }, [layers, width, wind, emoji, emojiEvery]);

  const top = -OVERSCAN;
  const bottom = height + OVERSCAN;
  const [from, to] = direction === 'fall' ? [top, bottom] : [bottom, top];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {particles.map((p) => (
        <Particle
          key={p.key}
          x={p.x}
          from={from}
          to={to}
          drift={wind}
          sway={p.sway}
          duration={p.duration}
          delay={p.delay}
          opacity={p.opacity}
          paused={paused}
        >
          {p.emoji ? (
            <Text allowFontScaling={false} style={{ fontSize: p.size * 2.2 }}>
              {emoji}
            </Text>
          ) : (
            <View
              style={{
                width: p.size,
                height: p.size,
                borderRadius: p.size,
                backgroundColor: color,
                boxShadow: glow ? `0 0 ${p.size * 2}px ${p.size / 2}px ${rgba(color, 0.55)}` : undefined,
              }}
            />
          )}
        </Particle>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute', top: 0 },
});
