"use client";

import type { ByScheme, Vars } from "./runtime.ts";

/** The lumps along the drift, as [left %, width %, height in px]. */
const LUMPS: readonly (readonly [number, number, number])[] = [
  [1, 22, 12],
  [14, 30, 16],
  [36, 22, 11],
  [52, 28, 15],
  [72, 20, 12],
  [84, 15, 13],
];

/** The drips over the edge, as [left %, length in px]. */
const DRIPS: readonly (readonly [number, number])[] = [
  [24, 7],
  [61, 5],
  [86, 6],
];

/**
 * Snow settled along the top edge of a card: a soft drift with a few lumps
 * and a drip or two over the edge. Still by nature. Place it inside the
 * card, which must be positioned and must not clip. See `runtime.ts` for
 * the rules every visual here follows.
 *
 * @param props.color The snow, by appearance, any CSS colour.
 * @param props.shade Its shadow, any CSS colour, which gives it form on a pale card.
 * @return The cap.
 */
export function SnowCap({ color, shade }: { color: ByScheme<string>; shade: string }) {
  const style: Vars = { "--sv-snow-dark": color.dark, "--sv-snow-light": color.light, "--sv-snow-shade": shade };
  return (
    <div className="sv sv-snowcap" style={style} aria-hidden>
      {LUMPS.map(([left, width, height], i) => (
        <span key={i} data-part="lump" style={{ left: `${left}%`, width: `${width}%`, height }} />
      ))}
      <span data-part="base" />
      {DRIPS.map(([left, length], i) => (
        <span key={`d${i}`} data-part="drip" style={{ left: `${left}%`, height: length + 6 }} />
      ))}
    </div>
  );
}
