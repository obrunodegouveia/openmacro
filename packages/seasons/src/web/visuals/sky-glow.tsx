"use client";

import { GLOW_FALLOFF } from "../../presets/optics.ts";
import { rgba, type ByScheme, type Vars } from "./runtime.ts";

/**
 * A tinted sky behind the top of the page: a few soft radial glows, stacked,
 * breathing slowly brighter and back while their centres drift a little.
 *
 * The drift is a registered custom property (`@property --sv-sky-drift`)
 * animated inside the gradients themselves, so the light moves, not the box.
 * Fixed behind the page, like a page's own background, so it tints only the
 * gaps between cards and never sits over text. See `runtime.ts` for the
 * rules every visual here follows.
 */

/** One glow. Positions and radii are fractions of the band. */
export interface SkyGlowSpot {
  /** `#rrggbb`, by appearance. */
  readonly color: ByScheme<string>;
  readonly x: number;
  readonly y: number;
  readonly rx: number;
  readonly ry: number;
  /** Peak opacity, by appearance. */
  readonly alpha: ByScheme<number>;
}

/** How a glow fades from its centre to its edge: the same curve as the native `SkyGlow`, and as `checkPack` measures. */
const FALLOFF = GLOW_FALLOFF;

/**
 * The gradients for one appearance. Each centre is offset by the animated
 * drift, alternately left and right, so neighbours slide past each other.
 *
 * @param glows The glows.
 * @param scheme Which appearance's opacities to use.
 * @return A list of `radial-gradient()`s.
 */
function gradients(glows: readonly SkyGlowSpot[], scheme: keyof ByScheme<number>): string {
  return glows
    .map((glow, i) => {
      const a = glow.alpha[scheme];
      const color = glow.color[scheme];
      const sign = i % 2 ? "-" : "+";
      return (
        `radial-gradient(ellipse ${Math.round(glow.rx * 100)}% ${Math.round(glow.ry * 100)}% at ` +
        `calc(${Math.round(glow.x * 100)}% ${sign} var(--sv-sky-drift)) ${Math.round(glow.y * 100)}%, ` +
        FALLOFF.map(([at, k]) => `${rgba(color, a * k)} ${at * 100}%`).join(", ") + ")"
      );
    })
    .join(", ");
}

/**
 * The sky.
 *
 * @param props.glows The glows.
 * @param props.height How much of the window's height the band covers, 0 to 1.
 * @param props.breatheMs One breath, in milliseconds.
 * @param props.animate Whether it breathes and drifts; still, it holds its brightest.
 * @param props.depth How far it follows the pointer (see `runtime.ts`).
 * @return The sky.
 */
export function SkyGlow({
  glows,
  height,
  breatheMs,
  animate,
  depth = 0,
}: {
  glows: readonly SkyGlowSpot[];
  height: number;
  breatheMs: number;
  animate: boolean;
  depth?: number;
}) {
  const style: Vars = {
    "--sv-sky-dark": gradients(glows, "dark"),
    "--sv-sky-light": gradients(glows, "light"),
    "--sv-sky-height": `${Math.round(height * 100)}vh`,
    "--sv-sky-breathe": `${breatheMs}ms`,
    "--sv-depth": depth,
  };
  return <div className="sv sv-sky sv-parallax" data-animate={animate || undefined} style={style} aria-hidden />;
}
