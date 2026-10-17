"use client";

import * as React from "react";
import { hash, type ByScheme, type Vars } from "./runtime.ts";

/**
 * A garland hung across the top of the window in swags: fairy lights, each
 * bulb glowing in its own colour and twinkling on its own beat, or beads
 * (blossoms, leaves) hung along a stem, each swaying on its own.
 *
 * The wire is one SVG path stretched to the width (its stroke kept at one
 * pixel whatever the stretch); the bulbs are HTML, placed on the same curve
 * by percentage, so they never stretch with it. The twinkle is a slow
 * breath of each bulb's glow, staggered so the string shimmers rather than
 * blinks, and nothing changes faster than 3 Hz. See `runtime.ts` for the
 * rules every visual here follows.
 */

/**
 * How far down the wire hangs at a point across the width, as a fraction of
 * the sag: zero at each hook, one at the bottom of each swag.
 *
 * @param x Across the width, 0 to 1.
 * @param swags How many swags across the width.
 * @return The drop there, 0 to 1.
 */
function dropAt(x: number, swags: number): number {
  return Math.abs(Math.sin(x * Math.PI * swags));
}

/**
 * The lights.
 *
 * @param props.colors Bulb colours in order along the string, any CSS colour.
 * @param props.beads Emoji hung instead of bulbs, in order along the string.
 * @param props.count How many bulbs or beads.
 * @param props.swags How many swags across the width.
 * @param props.sag How far each swag dips, in CSS pixels.
 * @param props.twinkleMs One twinkle (or a bead's sway), in milliseconds.
 * @param props.wire The wire's and sockets' colour, any CSS colour, or one by appearance.
 * @param props.animate Whether the bulbs twinkle and the beads sway; still, they hang steady.
 * @return The lights.
 */
export function FairyLights({
  colors,
  beads,
  count,
  swags,
  sag,
  twinkleMs,
  wire: wireColor,
  animate,
}: {
  colors: readonly string[];
  beads?: readonly string[];
  count: number;
  swags: number;
  sag: number;
  twinkleMs: number;
  wire: string | ByScheme<string>;
  animate: boolean;
}) {
  const wire = React.useMemo(() => {
    const steps = 96;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const x = i / steps;
      return `${i ? "L" : "M"}${(x * 1000).toFixed(1)} ${(dropAt(x, swags) * 100).toFixed(1)}`;
    }).join("");
  }, [swags]);

  const bulbs = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const x = (i + 0.5) / count;
        // Tipped with the wire's slope, and a little at random.
        const slope = Math.cos(x * Math.PI * swags) * Math.sign(Math.sin(x * Math.PI * swags) || 1);
        return {
          left: `${(x * 100).toFixed(2)}%`,
          top: `${(dropAt(x, swags) * sag).toFixed(1)}px`,
          "--sv-bulb": colors[i % Math.max(1, colors.length)] ?? "#ffffff",
          "--sv-tilt": `${(slope * 14 + (hash(i, 1) - 0.5) * 16).toFixed(1)}deg`,
          animationDuration: `${Math.round(twinkleMs * (0.75 + hash(i, 2) * 0.5))}ms`,
          animationDelay: `-${Math.round(hash(i, 3) * twinkleMs)}ms`,
        } as Vars;
      }),
    [colors, count, swags, sag, twinkleMs],
  );
  const wireVars: Vars =
    typeof wireColor === "string"
      ? { "--sv-wire-dark": wireColor, "--sv-wire-light": wireColor }
      : { "--sv-wire-dark": wireColor.dark, "--sv-wire-light": wireColor.light };

  return (
    <div
      className="sv sv-lights"
      data-animate={animate || undefined}
      data-beads={beads?.length ? "" : undefined}
      style={{ "--sv-sag": `${sag}px`, ...wireVars } as Vars}
      aria-hidden
    >
      <svg className="sv-lights-wire" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <path d={wire} fill="none" stroke="currentColor" strokeWidth={beads?.length ? 2 : 1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((style, i) =>
        beads?.length ? (
          // A bead hangs from its stalk and sways like a flower in a breeze.
          <span key={i} className="sv-bead" style={style}>
            {beads[i % beads.length]}
          </span>
        ) : (
          <span key={i} className="sv-bulb" style={style} />
        ),
      )}
    </div>
  );
}
