"use client";

import { RAY_STRENGTH, SUN_REACH } from "../../presets/optics.ts";
import { rgba, type ByScheme, type Vars } from "./runtime.ts";

/**
 * A sun high in the sky behind the page: a warm core with a crown of soft
 * rays turning slowly around it, long and short in turn, and the core
 * breathing a little warmer and back. The same sun as native's.
 *
 * The rays are one `repeating-conic-gradient`, masked to fade out with
 * distance; the core is a radial gradient. Fixed behind the page, like the
 * sky, so it tints only the gaps between cards. See `runtime.ts` for the
 * rules every visual here follows.
 */

/** How far the rays reach, as a multiple of the core's radius. */
const REACH = SUN_REACH;

/**
 * The sun.
 *
 * @param props.color Its colour, by appearance, `#rrggbb`.
 * @param props.alpha The core's peak opacity, by appearance.
 * @param props.x Its centre across the sky band, 0 to 1.
 * @param props.y Its centre down the sky band, 0 to 1.
 * @param props.radius The core's radius, as a fraction of the window's width.
 * @param props.rays How many rays.
 * @param props.turnMs One full turn of the rays, in milliseconds.
 * @param props.band The sky band's height, as a fraction of the window's height.
 * @param props.animate Whether the rays turn and the core breathes.
 * @param props.depth How far it follows the pointer (see `runtime.ts`).
 * @return The sun.
 */
export function Sun({
  color,
  alpha,
  x,
  y,
  radius,
  rays,
  turnMs,
  band,
  animate,
  depth = 0,
}: {
  color: ByScheme<string>;
  alpha: ByScheme<number>;
  x: number;
  y: number;
  radius: number;
  rays: number;
  turnMs: number;
  band: number;
  animate: boolean;
  depth?: number;
}) {
  // On a wide window the sun would grow huge; it is capped at a phone's worth.
  const r = `min(${(radius * 100).toFixed(1)}vw, ${Math.round(radius * 430)}px)`;
  const step = 360 / rays;
  const crown = (scheme: keyof ByScheme<string>) => {
    const ray = rgba(color[scheme], alpha[scheme] * RAY_STRENGTH);
    const short = rgba(color[scheme], alpha[scheme] * 0.32);
    // A long ray, a gap, a short ray, a gap: each a soft wedge.
    return `repeating-conic-gradient(from 0deg, ${ray} 0deg, transparent ${step * 0.18}deg, transparent ${step * 0.5}deg, ${short} ${step * 0.5}deg, transparent ${step * 0.68}deg, transparent ${step}deg)`;
  };
  const core = (scheme: keyof ByScheme<string>) => {
    const c = color[scheme];
    const a = alpha[scheme];
    return `radial-gradient(circle, ${rgba(c, a)} 0%, ${rgba(c, a * 0.7)} 35%, ${rgba(c, a * 0.25)} 65%, ${rgba(c, 0)} 100%)`;
  };
  const style: Vars = {
    left: `${(x * 100).toFixed(1)}vw`,
    top: `${(y * band * 100).toFixed(1)}vh`,
    "--sv-sun-r": r,
    "--sv-sun-reach": REACH,
    "--sv-sun-turn": `${turnMs}ms`,
    "--sv-sun-rays-dark": crown("dark"),
    "--sv-sun-rays-light": crown("light"),
    "--sv-sun-core-dark": core("dark"),
    "--sv-sun-core-light": core("light"),
    "--sv-depth": depth,
  };
  return (
    <div className="sv sv-sun sv-parallax" data-animate={animate || undefined} style={style} aria-hidden>
      <span data-part="rays" />
      <span data-part="core" />
    </div>
  );
}
