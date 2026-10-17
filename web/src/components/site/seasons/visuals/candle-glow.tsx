"use client";

import * as React from "react";
import type { Vars } from "./runtime";
import "./candle-glow.css";

/**
 * A candle's glow on something lit from inside, such as a jack-o'-lantern.
 * A warm coloured drop shadow that flickers irregularly, the way a flame
 * does: several uneven, smoothed dips per cycle, far slower than 3 Hz, so it
 * never strobes. See `runtime.ts` for the rules every visual here follows.
 *
 * @param props.color The flame's colour, any CSS colour.
 * @param props.flickerMs One flicker cycle, in milliseconds.
 * @param props.offset Shifts this one's cycle (0 to 1), so a row of
 *     lanterns does not flicker in step.
 * @param props.animate Whether it flickers; still, it glows steadily.
 * @param props.children What is lit.
 * @return The lit lantern.
 */
export function CandleGlow({
  color,
  flickerMs,
  offset = 0,
  animate,
  children,
}: {
  color: string;
  flickerMs: number;
  offset?: number;
  animate: boolean;
  children: React.ReactNode;
}) {
  const style: Vars = {
    "--sv-candle": color,
    animationDuration: `${flickerMs}ms`,
    animationDelay: `-${Math.round(offset * flickerMs)}ms`,
  };
  return (
    <span className="sv sv-candle" data-animate={animate || undefined} style={style}>
      {children}
    </span>
  );
}
