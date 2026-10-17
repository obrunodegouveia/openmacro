"use client";

import { rgba, type ByScheme, type Vars } from "./runtime";
import "./fog.css";

/**
 * Low fog lying along the bottom of the window: two banks of soft puffs
 * drifting slowly past each other. Fixed behind the page, so it shows only
 * between cards and never dims text. See `runtime.ts` for the rules every
 * visual here follows.
 */

/**
 * One bank's gradients: a row of soft puffs along the bottom.
 *
 * @param color The fog, `#rrggbb`.
 * @param alpha Its densest opacity.
 * @param puffs How many puffs.
 * @param shift Moves the puffs along, so two banks do not line up.
 * @return A list of `radial-gradient()`s.
 */
function bank(color: string, alpha: number, puffs: number, shift: number): string {
  return Array.from({ length: puffs }, (_, i) => {
    const x = Math.round(((i + shift) / puffs) * 100);
    const y = 70 + ((i * 37) % 3) * 10;
    return `radial-gradient(ellipse ${Math.round(140 / puffs)}% 80% at ${x}% ${y}%, ${rgba(color, alpha)} 0%, ${rgba(color, alpha * 0.4)} 50%, ${rgba(color, 0)} 100%)`;
  }).join(", ");
}

/**
 * The fog.
 *
 * @param props.color The fog's colour, by appearance, `#rrggbb`.
 * @param props.alpha Its densest opacity, by appearance.
 * @param props.driftMs One drift across and back.
 * @param props.height How high it reaches, as a CSS length.
 * @param props.animate Whether it drifts.
 * @return The fog.
 */
export function Fog({
  color,
  alpha,
  driftMs,
  height = "34vh",
  animate,
}: {
  color: ByScheme<string>;
  alpha: ByScheme<number>;
  driftMs: number;
  height?: string;
  animate: boolean;
}) {
  const style: Vars = {
    "--sv-fog-a-dark": bank(color.dark, alpha.dark, 6, 0.2),
    "--sv-fog-a-light": bank(color.light, alpha.light, 6, 0.2),
    "--sv-fog-b-dark": bank(color.dark, alpha.dark * 0.8, 5, 0.6),
    "--sv-fog-b-light": bank(color.light, alpha.light * 0.8, 5, 0.6),
    "--sv-fog-drift": `${driftMs}ms`,
    "--sv-fog-height": height,
  };
  return (
    <div className="sv sv-fog" data-animate={animate || undefined} style={style} aria-hidden>
      <span data-bank="a" />
      <span data-bank="b" />
    </div>
  );
}
