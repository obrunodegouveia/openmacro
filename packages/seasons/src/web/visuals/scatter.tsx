"use client";

import { hash } from "./runtime.ts";

/** Where each one lands along the edge, in %, left to right. The same as native's. */
const SPOTS = [9, 31, 58, 80] as const;

/**
 * A few things resting along the top edge of a card: fallen leaves, petals,
 * shells, each at its own tilt, as if they had landed there. Still by
 * nature. Place it inside the card, which must be positioned and must not
 * clip. See `runtime.ts` for the rules every visual here follows.
 *
 * @param props.emoji What rests there, one per spot in turn.
 * @return The scatter.
 */
export function Scatter({ emoji }: { emoji: readonly string[] }) {
  return (
    <div className="sv sv-scatter" aria-hidden>
      {SPOTS.slice(0, Math.max(1, emoji.length)).map((left, i) => (
        <span
          key={i}
          style={{
            left: `${left}%`,
            top: `${-(0.55 + hash(i, 1) * 0.15) * 1.15}rem`,
            fontSize: `${(1.15 * (0.85 + hash(i, 2) * 0.3)).toFixed(2)}rem`,
            rotate: `${Math.round((hash(i, 3) - 0.5) * 120)}deg`,
          }}
        >
          {emoji[i % emoji.length]}
        </span>
      ))}
    </div>
  );
}
