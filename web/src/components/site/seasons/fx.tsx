"use client";

import * as React from "react";
import "./fx.css";

/**
 * The two effects every season shares, a burst and a rain, drawn from the
 * season's particles. Loaded on demand by `seasonal-decor.tsx`; the gates
 * (season on, motion allowed) live there.
 */

/**
 * Particles thrown up out of a point once, falling away. Place it inside a
 * positioned container.
 *
 * @param props.particles What is thrown.
 * @return The burst.
 */
export function Burst({ particles }: { particles: readonly string[] }) {
  return (
    <div className="season-burst" aria-hidden>
      {particles.map((emoji, index) => {
        // Fanned over the upper half-circle, alternating near and far.
        const angle = Math.PI * (0.12 + (0.76 * index) / (particles.length - 1));
        const reach = index % 2 === 0 ? 130 : 88;
        return (
          <span
            key={index}
            style={
              {
                "--dx": `${(-Math.cos(angle) * reach).toFixed(0)}px`,
                "--dy": `${(-Math.sin(angle) * reach).toFixed(0)}px`,
                "--rot": `${index % 2 ? 40 : -40}deg`,
                animationDelay: `${index * 25}ms`,
              } as React.CSSProperties
            }
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Particles drifting down the whole window, behind the page.
 *
 * @param props.particles What falls.
 * @return The rain.
 */
export function Rain({ particles }: { particles: readonly string[] }) {
  return (
    <div className="season-rain" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          style={{
            // Spread evenly, nudged so the columns don't line up.
            left: `${((i + 0.5) / 16) * 100 + (((i * 37) % 7) - 3)}%`,
            animationDelay: `${(i * 613) % 4000}ms`,
            animationDuration: `${5200 + ((i * 1337) % 3000)}ms`,
          }}
        >
          {particles[i % particles.length]}
        </span>
      ))}
    </div>
  );
}
