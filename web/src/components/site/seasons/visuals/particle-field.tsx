"use client";

import * as React from "react";
import { hash, type ByScheme, type Vars } from "./runtime";
import "./particle-field.css";

/**
 * A field of ambient particles in depth: snow falling, embers rising.
 *
 * Each layer is one depth: near particles bigger, faster and more opaque,
 * far ones small, slow and faint, and each layer follows the pointer by its
 * own parallax, so the field has depth you can feel with a mouse. Every
 * particle's lane, size, speed, sway and start come from its index, so the
 * server and every reload agree. Only `transform` and `opacity` animate, so
 * it composites without layout or paint. See `runtime.ts` for the rules
 * every visual here follows.
 */

/** One depth of the field. */
export interface FieldLayer {
  readonly count: number;
  /** Diameter, in CSS pixels. */
  readonly size: number;
  /** One crossing of the window, in milliseconds. */
  readonly crossMs: number;
  readonly opacity: number;
  /** Sideways sway, in CSS pixels. */
  readonly sway: number;
  /** How far it follows the pointer, as a fraction of the window. */
  readonly parallax: number;
}

/** The most particles one field draws, whatever it is asked for. */
export const MAX_FIELD = 48;

/**
 * The field.
 *
 * @param props.layers The depths, far first.
 * @param props.color The particles' colour, by appearance, any CSS colour.
 * @param props.glow A soft halo around each particle, in its own colour.
 * @param props.direction `fall` or `rise`.
 * @param props.wind Sideways drift over one crossing, in CSS pixels.
 * @param props.placement `behind` the page, or in `front` of it (faint, near layers only).
 * @param props.emoji Drawn instead of a dot for every other particle of the
 *     nearest layer (the snowflake among the snow).
 * @return The field.
 */
export function ParticleField({
  layers,
  color,
  glow,
  direction,
  wind,
  placement,
  emoji,
}: {
  layers: readonly FieldLayer[];
  color: ByScheme<string>;
  glow: boolean;
  direction: "fall" | "rise";
  wind: number;
  placement: "behind" | "front";
  emoji?: string;
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
          return {
            emoji: !!emoji && depth === layers.length - 1 && i % 2 === 0,
            style: {
              left: `${(((i + 0.2 + hash(n, 1) * 0.6) / count) * 100).toFixed(2)}%`,
              animationDuration: `${Math.round(duration)}ms`,
              // Negative, so the field is already full on the first frame.
              animationDelay: `-${Math.round(hash(n, 3) * duration)}ms`,
              "--sv-size": `${(layer.size * (0.8 + hash(n, 5) * 0.4)).toFixed(1)}px`,
              "--sv-sway": `${(layer.sway * (0.6 + hash(n, 4) * 0.8)).toFixed(1)}px`,
              "--sv-op": (layer.opacity * (0.75 + hash(n, 6) * 0.25)).toFixed(2),
            } as Vars,
          };
        }),
      };
    });
  }, [layers, emoji]);

  const style: Vars = { "--sv-mote-dark": color.dark, "--sv-mote-light": color.light, "--sv-wind": `${wind}px` };
  return (
    <div className="sv sv-field" data-placement={placement} data-direction={direction} data-glow={glow || undefined} style={style} aria-hidden>
      {depths.map(({ layer, particles }, depth) => (
        <div key={depth} className="sv-depth sv-parallax" style={{ "--sv-depth": layer.parallax } as Vars}>
          {particles.map((p, i) =>
            p.emoji ? (
              <span key={i} className="sv-mote" data-emoji style={p.style}>
                {emoji}
              </span>
            ) : (
              <span key={i} className="sv-mote" style={p.style} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}
