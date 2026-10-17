"use client";

import * as React from "react";
import "./fx.css";

/**
 * The rain every season shares, drawn from the season's particles, for a
 * finished lesson. Loaded on demand by `seasonal-decor.tsx`; the gates
 * (season on, motion allowed) live there. The burst is `visuals/burst.tsx`.
 */

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
