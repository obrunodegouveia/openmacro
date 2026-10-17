"use client";

import { rgba, type ByScheme, type Vars } from "./runtime";
import "./mist.css";

/**
 * Something low along the bottom of the window, behind the page, in one of
 * three moods, as in the app:
 *
 * - `drift`: two banks of fog sliding slowly past each other.
 * - `breathe`: two banks of mist swelling and rising a little, then
 *   settling, out of step, like breath on a cold day.
 * - `shimmer`: thin bands of warm air wavering over hot ground.
 *
 * Fixed behind the page, so it shows only between cards and never dims
 * text. See `runtime.ts` for the rules every visual here follows.
 */

/** How many bands of warm air shimmer. */
const BANDS = 4;

/**
 * One bank's gradients: a row of soft puffs along the bottom.
 *
 * @param color The mist, `#rrggbb`.
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
 * One band of warm air: a row of thin, soft lenses, denser in places, so its
 * waver reads as heat rising off the ground rather than as a stripe. Soft at
 * every edge, so a band never shows a line.
 *
 * @param color The air, `#rrggbb`.
 * @param alpha Its densest opacity.
 * @param shift Moves the dense places along, so the bands do not line up.
 * @return A list of `radial-gradient()`s.
 */
function ripple(color: string, alpha: number, shift: number): string {
  const lenses = 7;
  return Array.from({ length: lenses }, (_, i) => {
    const x = Math.round(((i + 0.5 + (shift % 1)) / lenses) * 100);
    const strength = 0.4 + 0.6 * Math.abs(Math.sin((i + shift) * 1.7));
    return `radial-gradient(ellipse ${Math.round(120 / lenses)}% 50% at ${x}% 50%, ${rgba(color, alpha * strength)} 0%, ${rgba(color, alpha * strength * 0.35)} 45%, ${rgba(color, 0)} 100%)`;
  }).join(", ");
}

/**
 * The layers for one appearance: two banks, or the shimmer's bands.
 *
 * @param mode The mood.
 * @param color The colour.
 * @param alpha The densest opacity.
 * @return One background per layer.
 */
function layers(mode: "drift" | "breathe" | "shimmer", color: string, alpha: number): string[] {
  if (mode === "shimmer") return Array.from({ length: BANDS }, (_, i) => ripple(color, alpha * (1 - i * 0.18), i * 1.3));
  return [bank(color, alpha, 6, 0.2), bank(color, alpha * 0.8, 5, 0.6)];
}

/**
 * One layer's beat and its start, by mood: the same numbers as the app's.
 *
 * @param mode The mood.
 * @param i Which layer.
 * @param cycleMs One full cycle.
 * @return The layer's animation duration and delay, as custom properties.
 */
function timing(mode: "drift" | "breathe" | "shimmer", i: number, cycleMs: number): Vars {
  const [ms, delay] =
    mode === "drift"
      ? [(cycleMs / 2) * (i ? 1.3 : 1), 0]
      : mode === "breathe"
        ? [(cycleMs / 2) * (1 + i * 0.17), i * (cycleMs / 3)]
        : [(cycleMs / 2) * (1 + ((i * 0.29) % 0.5)), i * (cycleMs / 5)];
  return { "--sv-mist-ms": `${Math.round(ms)}ms`, "--sv-mist-delay": `-${Math.round(delay)}ms` };
}

/**
 * The mist.
 *
 * @param props.mode `drift`, `breathe` or `shimmer`.
 * @param props.color Its colour, by appearance, `#rrggbb`.
 * @param props.alpha Its densest opacity, by appearance.
 * @param props.cycleMs One full cycle: across and back, one breath, one waver.
 * @param props.height How high it reaches, as a CSS length.
 * @param props.animate Whether it moves.
 * @return The mist.
 */
export function Mist({
  mode,
  color,
  alpha,
  cycleMs,
  height = "34vh",
  animate,
}: {
  mode: "drift" | "breathe" | "shimmer";
  color: ByScheme<string>;
  alpha: ByScheme<number>;
  cycleMs: number;
  height?: string;
  animate: boolean;
}) {
  const dark = layers(mode, color.dark, alpha.dark);
  const light = layers(mode, color.light, alpha.light);
  const style: Vars = { "--sv-mist-height": height };
  return (
    <div className="sv sv-mist" data-mode={mode} data-animate={animate || undefined} style={style} aria-hidden>
      {dark.map((background, i) => (
        <span
          key={i}
          data-layer={i}
          style={{ "--sv-mist-dark": background, "--sv-mist-light": light[i], "--sv-i": i, ...timing(mode, i, cycleMs) } as Vars}
        />
      ))}
    </div>
  );
}
