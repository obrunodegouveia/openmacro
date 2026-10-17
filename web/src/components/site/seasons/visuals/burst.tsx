"use client";

import { hash, type Vars } from "./runtime";
import "./burst.css";

/**
 * A burst: particles thrown up out of a point, falling away under gravity,
 * spinning and fading, over a soft ring of light that expands behind them.
 * Played once, when it mounts. Particles alternate between a near and a far
 * depth, and each varies its angle, reach, spin and timing by index. Place
 * it inside a positioned container. See `runtime.ts` for the rules every
 * visual here follows.
 *
 * @param props.particles What is thrown, one emoji each.
 * @param props.ring The ring's colour, any CSS colour, or none for no ring.
 * @param props.gravity How far a particle falls by the end, in CSS pixels.
 * @param props.spin How far a particle turns by the end, in degrees.
 * @param props.reach How far the near particles fly, in CSS pixels.
 * @return The burst.
 */
export function Burst({
  particles,
  ring,
  gravity = 60,
  spin = 90,
  reach = 130,
}: {
  particles: readonly string[];
  ring?: string;
  gravity?: number;
  spin?: number;
  reach?: number;
}) {
  return (
    <div className="sv sv-burst" aria-hidden>
      {ring ? <span className="sv-burst-ring" style={{ "--sv-ring": ring, "--sv-ring-size": `${reach * 1.4}px` } as Vars} /> : null}
      {particles.map((emoji, index) => {
        const near = index % 2 === 0;
        // Fanned over the upper half-circle, each nudged off its slot.
        const angle = Math.PI * (0.1 + (0.8 * (index + (hash(index, 1) - 0.5) * 0.6)) / Math.max(1, particles.length - 1));
        const distance = reach * (near ? 1 : 0.68) * (0.85 + hash(index, 2) * 0.3);
        return (
          <span
            key={index}
            data-near={near || undefined}
            style={
              {
                "--dx": `${(-Math.cos(angle) * distance).toFixed(0)}px`,
                "--dy": `${(-Math.sin(angle) * distance).toFixed(0)}px`,
                "--g": `${gravity}px`,
                "--rot": `${(spin * (hash(index, 3) - 0.5) * 2).toFixed(0)}deg`,
                "--s": near ? 1 : 0.72,
                animationDelay: `${Math.round(index * 22 + hash(index, 4) * 40)}ms`,
              } as Vars
            }
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
