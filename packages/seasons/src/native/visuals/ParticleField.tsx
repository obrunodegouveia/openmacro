/**
 * A field of ambient particles in depth: snow drifting, petals tumbling,
 * leaves fluttering, fireflies pulsing, ice crystals glinting.
 *
 * Each layer is one depth. Near particles are bigger, faster and more
 * opaque; far ones small, slow and faint, which reads as depth on a flat
 * screen. Every particle gets its own lane, size, speed, sway, start and
 * beat from its index (`hash`), so the field looks scattered but never
 * reshuffles.
 *
 * The motion character is two animations per particle: the *path* (across
 * the screen, with the wind) on an outer view, and the *gesture* (the
 * tumble, the pendulum swing, the glow) on an inner one, each on its own
 * clock, so they never line up into a visible loop. Both are Reanimated CSS
 * animations: declared once, run on the UI thread, with no per-frame React
 * work, and held in place with `animationPlayState`. See `shared.ts` for
 * the rules every visual here follows.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { MAX_PARTICLES } from '../../presets/optics.ts';
import type { MoteMotion, MoteShape } from '../../presets/types.ts';
import { HIDDEN, hash, playState, rgba } from './shared.ts';

export { MAX_PARTICLES };
export type { MoteMotion, MoteShape };

/** One depth of the field. */
export interface ParticleLayer {
  /** How many particles. */
  readonly count: number;
  /** Size, in points; an emoji is drawn at about twice this. */
  readonly size: number;
  /** One crossing of the field, in milliseconds. */
  readonly crossMs: number;
  /** Peak opacity. */
  readonly opacity: number;
  /** Sideways sway, in points. */
  readonly sway: number;
  /** The drawn shape; a dot by default. */
  readonly shape?: MoteShape;
  /** Emoji drawn instead, one per particle in turn. */
  readonly emoji?: readonly string[];
}

/** How far beyond the field's edges a particle starts and ends, in points. */
const OVERSCAN = 24;

/**
 * Each gesture's beat, in milliseconds: the shortest and the longest, a
 * particle picking its own in between. None is near 3 Hz.
 */
const BEAT = {
  tumble: [2600, 4800],
  flutter: [1500, 2600],
  pulse: [1600, 3200],
  glint: [5000, 9000],
} as const;

/** One particle, with everything it needs worked out. */
interface Mote {
  readonly key: string;
  readonly seed: number;
  readonly x: number;
  readonly delay: number;
  readonly duration: number;
  readonly sway: number;
  readonly size: number;
  readonly opacity: number;
  readonly color: string;
  readonly shape: MoteShape;
  readonly emoji: string | null;
  /** The gesture's beat and how far into it the particle starts, for every motion but `drift`. */
  readonly beat: number;
  readonly beatDelay: number;
  /** Which way it turns, 1 or -1. */
  readonly turn: number;
}

/**
 * The path a particle takes across the field, as keyframes: down (or up)
 * with the wind, fading in and out at the ends so nothing pops at an edge.
 * `drift` sways on a sine along the way; `pulse` wanders on two crossed
 * sines; the other motions sway in their gesture and wander only a little.
 *
 * @param motion The motion character.
 * @param from Where each crossing starts, from the top.
 * @param to Where it ends.
 * @param drift The wind's push over one crossing.
 * @param sway How far it sways.
 * @param opacity Its peak opacity.
 * @param seed Varies a wandering path.
 * @return The keyframes.
 */
function pathFrames(motion: MoteMotion, from: number, to: number, drift: number, sway: number, opacity: number, seed: number) {
  const steps = motion === 'pulse' ? 8 : 4;
  const phase = hash(seed, 9) * Math.PI * 2;
  const offset = (t: number) => {
    if (motion === 'drift') return Math.sin(t * Math.PI * 2) * sway;
    if (motion === 'pulse') return Math.sin(t * Math.PI * 3 + phase) * sway + Math.sin(t * Math.PI * 7 + phase * 2) * sway * 0.35;
    return Math.sin(t * Math.PI * 2 + phase) * sway * 0.4;
  };
  const frames: Record<string, object> = {};
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    frames[`${(t * 100).toFixed(1)}%`] = {
      transform: [{ translateY: from + (to - from) * t }, { translateX: drift * t + offset(t) }],
      ...(i === 0 || i === steps ? { opacity: 0 } : null),
    };
  }
  frames['12%'] = { opacity };
  frames['88%'] = { opacity };
  return frames;
}

/**
 * The gesture a particle makes on its own clock, as an animation style, or
 * none for `drift`.
 *
 * @param motion The motion character.
 * @param mote The particle.
 * @param paused Hold it.
 * @return The style.
 */
function gesture(motion: MoteMotion, mote: Mote, paused: boolean): ViewStyle | null {
  const clock = {
    animationDuration: mote.beat,
    animationDelay: -mote.beatDelay,
    animationIterationCount: 'infinite' as const,
    animationPlayState: playState(paused),
  };
  switch (motion) {
    case 'tumble': {
      // End over end: turning in the plane while its face flips through
      // edge-on, which is what makes a petal read as a petal.
      const spin = 360 * mote.turn;
      return {
        ...clock,
        animationName: {
          from: { transform: [{ perspective: 300 }, { rotateZ: '0deg' }, { rotateY: '0deg' }, { rotateX: '0deg' }] },
          to: { transform: [{ perspective: 300 }, { rotateZ: `${spin}deg` }, { rotateY: `${spin}deg` }, { rotateX: `${spin / 2}deg` }] },
        },
        animationTimingFunction: 'linear',
      } as ViewStyle;
    }
    case 'flutter': {
      // A pendulum: out to one side tipped into the swing, dipping through
      // the middle where it falls fastest, and back.
      const s = mote.sway;
      const tilt = 38 * mote.turn;
      return {
        ...clock,
        animationName: {
          '0%': { transform: [{ translateX: -s }, { translateY: 0 }, { rotate: `${-tilt}deg` }] },
          '50%': { transform: [{ translateX: 0 }, { translateY: s * 0.35 }, { rotate: '0deg' }] },
          '100%': { transform: [{ translateX: s }, { translateY: 0 }, { rotate: `${tilt}deg` }] },
        },
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
      } as ViewStyle;
    }
    case 'pulse':
      // Glowing up and fading, smoothly, about once every few seconds.
      return {
        ...clock,
        animationName: {
          from: { opacity: 0.15, transform: [{ scale: 0.7 }] },
          to: { opacity: 1, transform: [{ scale: 1.1 }] },
        },
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
      } as ViewStyle;
    case 'glint':
      // Turning slowly, and once a turn catching the light.
      return {
        ...clock,
        animationName: {
          '0%': { opacity: 0.55, transform: [{ rotate: '0deg' }, { scale: 1 }] },
          '44%': { opacity: 0.55, transform: [{ rotate: `${80 * mote.turn}deg` }, { scale: 1 }] },
          '50%': { opacity: 1, transform: [{ rotate: `${90 * mote.turn}deg` }, { scale: 1.35 }] },
          '56%': { opacity: 0.55, transform: [{ rotate: `${100 * mote.turn}deg` }, { scale: 1 }] },
          '100%': { opacity: 0.55, transform: [{ rotate: `${180 * mote.turn}deg` }, { scale: 1 }] },
        },
        animationTimingFunction: 'linear',
      } as ViewStyle;
    default:
      return null;
  }
}

/**
 * How a particle is drawn.
 *
 * @param props.mote The particle.
 * @param props.glow A soft halo in its own colour.
 * @return The artwork.
 */
function Artwork({ mote, glow }: { mote: Mote; glow: boolean }) {
  const { size, color } = mote;
  if (mote.emoji) {
    return (
      <Text allowFontScaling={false} style={{ fontSize: size * 2.2 }}>
        {mote.emoji}
      </Text>
    );
  }
  const halo = glow ? `0 0 ${size * 2}px ${size / 2}px ${rgba(color, 0.55)}` : undefined;
  switch (mote.shape) {
    case 'petal':
      // Rounded, with one pointed end where it left the flower.
      return (
        <View
          style={{
            width: size,
            height: size * 1.3,
            backgroundColor: color,
            borderTopLeftRadius: size,
            borderTopRightRadius: size * 0.12,
            borderBottomLeftRadius: size,
            borderBottomRightRadius: size,
            boxShadow: halo,
          }}
        />
      );
    case 'leaf':
      // Pointed at both ends, with a paler vein down the middle.
      return (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderTopLeftRadius: size,
            borderBottomRightRadius: size,
            borderTopRightRadius: size * 0.1,
            borderBottomLeftRadius: size * 0.1,
            transform: [{ rotate: '45deg' }],
            boxShadow: halo,
          }}
        >
          <View style={[styles.vein, { width: size * 1.2, left: -size * 0.1, top: size / 2 - 0.5, transform: [{ rotate: '-45deg' }] }]} />
        </View>
      );
    case 'spark':
      return (
        <Text
          allowFontScaling={false}
          style={{ fontSize: size * 1.6, lineHeight: size * 1.8, color, textShadowColor: rgba(color, 0.8), textShadowRadius: size }}
        >
          ✦
        </Text>
      );
    default:
      return <View style={{ width: size, height: size, borderRadius: size, backgroundColor: color, boxShadow: halo }} />;
  }
}

/**
 * One particle crossing the field, over and over.
 *
 * @param props.mote The particle.
 * @param props.motion The motion character.
 * @param props.from Where each crossing starts, from the top.
 * @param props.to Where it ends.
 * @param props.drift The wind's push over one crossing.
 * @param props.glow A soft halo.
 * @param props.paused Hold it where it is.
 * @return The particle.
 */
const Particle = memo(function Particle({
  mote,
  motion,
  from,
  to,
  drift,
  glow,
  paused,
}: {
  mote: Mote;
  motion: MoteMotion;
  from: number;
  to: number;
  drift: number;
  glow: boolean;
  paused: boolean;
}) {
  const path = useMemo(
    () => pathFrames(motion, from, to, drift, mote.sway, mote.opacity, mote.seed),
    [motion, from, to, drift, mote.sway, mote.opacity, mote.seed],
  );
  const inner = gesture(motion, mote, paused);

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: mote.x },
        {
          animationName: path,
          animationDuration: mote.duration,
          animationDelay: mote.delay,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
          animationFillMode: 'backwards',
          animationPlayState: playState(paused),
        },
      ]}
    >
      {inner ? (
        <Animated.View style={inner}>
          <Artwork mote={mote} glow={glow} />
        </Animated.View>
      ) : (
        <Artwork mote={mote} glow={glow} />
      )}
    </Animated.View>
  );
});

/**
 * The field. Place it inside an absolutely filled, untouchable container;
 * it fills its parent.
 *
 * @param props.layers The depths, far first.
 * @param props.colors The particles' colours, `#rrggbb`, one per particle in turn.
 * @param props.glow Give each particle a soft halo in its own colour.
 * @param props.direction `fall` (top to bottom) or `rise`.
 * @param props.motion The motion character: `drift`, `tumble`, `flutter`, `pulse` or `glint`.
 * @param props.wind Sideways drift over one crossing, in points.
 * @param props.width The field's width.
 * @param props.height The field's height.
 * @param props.paused Hold every particle where it is.
 * @return The field.
 */
export function ParticleField({
  layers,
  colors,
  glow,
  direction,
  motion = 'drift',
  wind,
  width,
  height,
  paused,
}: {
  layers: readonly ParticleLayer[];
  colors: readonly string[];
  glow: boolean;
  direction: 'fall' | 'rise';
  motion?: MoteMotion;
  wind: number;
  width: number;
  height: number;
  paused: boolean;
}) {
  const motes = useMemo(() => {
    const out: Mote[] = [];
    layers.forEach((layer, depth) => {
      for (let i = 0; i < layer.count && out.length < MAX_PARTICLES; i += 1) {
        const n = depth * 100 + i;
        // Spread across the width in even lanes, each jittered within its own.
        const lane = (i + 0.2 + hash(n, 1) * 0.6) / layer.count;
        const [shortest, longest] = motion === 'drift' ? [0, 0] : BEAT[motion];
        const beat = shortest + hash(n, 7) * (longest - shortest);
        out.push({
          key: `${depth}-${i}`,
          seed: n,
          x: lane * (width + OVERSCAN * 2) - OVERSCAN - wind / 2,
          duration: layer.crossMs * (0.85 + hash(n, 2) * 0.3),
          // Spread the first crossings over one full crossing, so the field
          // fills in gradually rather than all at once.
          delay: hash(n, 3) * layer.crossMs,
          sway: layer.sway * (0.6 + hash(n, 4) * 0.8),
          size: layer.size * (0.8 + hash(n, 5) * 0.4),
          opacity: layer.opacity * (0.75 + hash(n, 6) * 0.25),
          color: colors[(i + depth) % Math.max(1, colors.length)] ?? '#FFFFFF',
          shape: layer.shape ?? 'dot',
          emoji: layer.emoji?.length ? layer.emoji[i % layer.emoji.length]! : null,
          beat,
          beatDelay: hash(n, 8) * beat,
          turn: hash(n, 10) < 0.5 ? -1 : 1,
        });
      }
    });
    return out;
  }, [layers, colors, motion, width, wind]);

  const top = -OVERSCAN;
  const bottom = height + OVERSCAN;
  const [from, to] = direction === 'fall' ? [top, bottom] : [bottom, top];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} {...HIDDEN}>
      {motes.map((mote) => (
        <Particle key={mote.key} mote={mote} motion={motion} from={from} to={to} drift={wind} glow={glow} paused={paused} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute', top: 0 },
  vein: { position: 'absolute', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.35)' },
});
