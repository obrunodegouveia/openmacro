"use client";

import * as React from "react";
import { hash, type Vars } from "./runtime";
import "./flyer.css";

/** The share of each cycle spent crossing; the rest it waits off screen. */
const DUTY = 0.3;

/**
 * Something crossing the window now and then: a bat, a sleigh. It flies a
 * lap on a rising and dipping path, banking into each swell, then waits off
 * screen. Winged flyers beat their wings by squashing their height (motion,
 * never a flash). See `runtime.ts` for the rules every visual here follows.
 *
 * @param props.top Its cruising height, as a CSS length.
 * @param props.width Its width, as a CSS length; the artwork fills it.
 * @param props.lapMs How long one crossing takes.
 * @param props.delay When the first lap starts, in milliseconds.
 * @param props.flapMs One wing beat, or none for a flyer without wings.
 * @param props.mirror Flip it, so it faces the way it flies.
 * @param props.depth How far it follows the pointer (see `runtime.ts`).
 * @param props.seed Varies the path, so two flyers never fly in formation.
 * @param props.children The artwork.
 * @return The flyer.
 */
export function Flyer({
  top,
  width,
  lapMs,
  delay,
  flapMs,
  mirror,
  depth = 0.02,
  seed,
  children,
}: {
  top: string;
  width: string;
  lapMs: number;
  delay: number;
  flapMs?: number;
  mirror?: boolean;
  depth?: number;
  seed: number;
  children: React.ReactNode;
}) {
  const style: Vars = {
    top,
    width,
    animationDuration: `${Math.round(lapMs / DUTY)}ms`,
    animationDelay: `${delay}ms`,
    "--sv-lift": `${(2 + hash(seed, 1) * 3).toFixed(1)}vh`,
    "--sv-flap": flapMs ? `${flapMs / 2}ms` : "0ms",
    "--sv-depth": depth,
  };
  return (
    <div className="sv-parallax sv-flyer-lane" style={{ "--sv-depth": depth } as Vars}>
      <div className="sv sv-flyer" data-mirror={mirror || undefined} data-flap={flapMs ? "" : undefined} style={style}>
        <div className="sv-flyer-art">{children}</div>
      </div>
    </div>
  );
}
