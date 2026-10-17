"use client";

import * as React from "react";
import { hash, type ByScheme, type Vars } from "./runtime";
import "./particle-field.css";

/**
 * A field of ambient particles in depth: snow drifting, petals tumbling,
 * leaves fluttering, fireflies pulsing, ice crystals glinting.
 *
 * Each layer is one depth: near particles bigger, faster and more opaque,
 * far ones small, slow and faint, and each layer follows the pointer by its
 * own parallax, so the field has depth you can feel with a mouse. Every
 * particle's lane, size, speed, sway, start and beat come from its index, so
 * the server and every reload agree.
 *
 * The motion character is two animations per particle, as in the app: the
 * *path* across the window on the particle, and the *gesture* (the tumble,
 * the pendulum swing, the glow) on its artwork, each on its own clock. Only
 * `transform` and `opacity` animate, so it composites without layout or
 * paint. See `runtime.ts` for the rules every visual here follows.
 */

/** What a drawn particle looks like. */
export type MoteShape = "dot" | "petal" | "leaf" | "spark";

/** How the particles move, beyond crossing the window. */
export type MoteMotion = "drift" | "tumble" | "flutter" | "pulse" | "glint";

/** One depth of the field. */
export interface FieldLayer {
  readonly count: number;
  /** Size, in CSS pixels; an emoji is drawn at about twice this. */
  readonly size: number;
  /** One crossing of the window, in milliseconds. */
  readonly crossMs: number;
  readonly opacity: number;
  /** Sideways sway, in CSS pixels. */
  readonly sway: number;
  /** How far it follows the pointer, as a fraction of the window. */
  readonly parallax: number;
  /** The drawn shape; a dot by default. */
  readonly shape?: MoteShape;
  /** Emoji drawn instead, one per particle in turn. */
  readonly emoji?: readonly string[];
}

/** The most particles one field draws, whatever it is asked for. */
export const MAX_FIELD = 40;

/** Each gesture's beat, shortest and longest, in milliseconds; none near 3 Hz. The same as the app's. */
const BEAT: Record<Exclude<MoteMotion, "drift">, readonly [number, number]> = {
  tumble: [2600, 4800],
  flutter: [1500, 2600],
  pulse: [1600, 3200],
  glint: [5000, 9000],
};

/**
 * The field.
 *
 * @param props.layers The depths, far first.
 * @param props.colors The particles' colours, by appearance, one per particle in turn.
 * @param props.glow A soft halo around each particle, in its own colour.
 * @param props.direction `fall` or `rise`.
 * @param props.motion The motion character.
 * @param props.wind Sideways drift over one crossing, in CSS pixels.
 * @param props.placement `behind` the page, or in `front` of it (faint, near layers only).
 * @return The field.
 */
export function ParticleField({
  layers,
  colors,
  glow,
  direction,
  motion = "drift",
  wind,
  placement,
}: {
  layers: readonly FieldLayer[];
  colors: readonly ByScheme<string>[];
  glow: boolean;
  direction: "fall" | "rise";
  motion?: MoteMotion;
  wind: number;
  placement: "behind" | "front";
}) {
  const depths = React.useMemo(() => {
    // The cap, shared out far layer first.
    const before = layers.map((_, depth) => layers.slice(0, depth).reduce((sum, layer) => sum + layer.count, 0));
    return layers.map((layer, depth) => {
      const count = Math.max(0, Math.min(layer.count, MAX_FIELD - before[depth]!));
      return {
        layer,
        particles: Array.from({ length: count }, (_, i) => {
          const n = depth * 100 + i;
          const duration = layer.crossMs * (0.85 + hash(n, 2) * 0.3);
          const sway = layer.sway * (0.6 + hash(n, 4) * 0.8);
          const [shortest, longest] = motion === "drift" ? [0, 0] : BEAT[motion];
          const beat = shortest + hash(n, 7) * (longest - shortest);
          const color = colors[(i + depth) % Math.max(1, colors.length)] ?? { light: "#ffffff", dark: "#ffffff" };
          return {
            emoji: layer.emoji?.length ? layer.emoji[i % layer.emoji.length]! : null,
            style: {
              left: `${(((i + 0.2 + hash(n, 1) * 0.6) / count) * 100).toFixed(2)}%`,
              animationDuration: `${Math.round(duration)}ms`,
              // Negative, so the field is already full on the first frame.
              animationDelay: `-${Math.round(hash(n, 3) * duration)}ms`,
              "--sv-size": `${(layer.size * (0.8 + hash(n, 5) * 0.4)).toFixed(1)}px`,
              "--sv-sway": `${sway.toFixed(1)}px`,
              // The path sways in full only when it drifts; otherwise the gesture carries the sway.
              "--sv-path-sway": `${(motion === "drift" || motion === "pulse" ? sway : sway * 0.4).toFixed(1)}px`,
              "--sv-op": (layer.opacity * (0.75 + hash(n, 6) * 0.25)).toFixed(2),
              "--sv-beat": `${Math.round(beat)}ms`,
              "--sv-beat-delay": `-${Math.round(hash(n, 8) * beat)}ms`,
              "--sv-turn": hash(n, 10) < 0.5 ? -1 : 1,
              "--sv-mote-dark": color.dark,
              "--sv-mote-light": color.light,
            } as Vars,
          };
        }),
      };
    });
  }, [layers, colors, motion]);

  const style: Vars = { "--sv-wind": `${wind}px` };
  return (
    <div className="sv sv-field" data-placement={placement} data-direction={direction} data-motion={motion} data-glow={glow || undefined} style={style} aria-hidden>
      {depths.map(({ layer, particles }, depth) => (
        <div key={depth} className="sv-depth sv-parallax" style={{ "--sv-depth": layer.parallax } as Vars}>
          {particles.map((p, i) => (
            <span key={i} className="sv-mote" style={p.style}>
              {p.emoji ? (
                <span className="sv-mote-art" data-emoji>
                  {p.emoji}
                </span>
              ) : (
                <span className="sv-mote-art" data-shape={layer.shape ?? "dot"} />
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
