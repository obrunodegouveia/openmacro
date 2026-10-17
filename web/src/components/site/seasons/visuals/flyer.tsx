"use client";

import * as React from "react";
import { hash, type Vars } from "./runtime";
import "./flyer.css";

/**
 * Something crossing the window now and then: a bat, a sleigh, a butterfly,
 * a leaf on a gust. The same flight as the app's: a lap on a rising and
 * dipping path (`wobble` high, `waves` times across), banking into each
 * turn or, given a `spin`, turning over and over, then a wait off screen.
 * Winged flyers beat their wings by squashing their height or width (motion,
 * never a flash).
 *
 * Each flight's keyframes are written for it, sampled along the path, into
 * a `<style>` of its own: still a CSS animation, so it composites off the
 * main thread and holds with every other visual when the tab is hidden.
 * See `runtime.ts` for the rules every visual here follows.
 *
 * @param props.top Its cruising height, as a CSS length.
 * @param props.width Its width, as a CSS length; the artwork fills it.
 * @param props.lapMs How long one crossing takes.
 * @param props.restMs How long it waits off screen between crossings.
 * @param props.delay When the first lap starts, in milliseconds.
 * @param props.wobble How far the path rises and dips, in CSS pixels.
 * @param props.waves How many rises and dips over one crossing.
 * @param props.spin How far it turns over one crossing, in degrees; none banks gently.
 * @param props.flapMs One wing beat, or none for a flyer without wings.
 * @param props.flapAxis `y` squashes the height (a bat), `x` the width (a butterfly).
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
  restMs,
  delay,
  wobble = 18,
  waves = 2,
  spin,
  flapMs,
  flapAxis = "y",
  mirror,
  depth = 0.02,
  seed,
  children,
}: {
  top: string;
  width: string;
  lapMs: number;
  restMs: number;
  delay: number;
  wobble?: number;
  waves?: number;
  spin?: number;
  flapMs?: number;
  flapAxis?: "x" | "y";
  mirror?: boolean;
  depth?: number;
  seed: number;
  children: React.ReactNode;
}) {
  const name = `sv-fly-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const keyframes = React.useMemo(() => {
    const end = (lapMs / (lapMs + restMs)) * 100;
    const lift = wobble * (0.7 + hash(seed, 1) * 0.6);
    const phase = hash(seed, 2) * Math.PI;
    const sign = hash(seed, 3) < 0.5 ? -1 : 1;
    const steps = Math.max(8, Math.ceil(waves * 4));
    const frames: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const dy = Math.sin(t * Math.PI * 2 * waves + phase) * lift - Math.sin(t * Math.PI) * lift * 0.6;
      const slope = Math.cos(t * Math.PI * 2 * waves + phase);
      const turn = spin ? spin * t * sign : slope * 8;
      const opacity = i === 0 || i === steps ? 0 : 0.92;
      frames.push(`${(t * end).toFixed(2)}% { transform: translate(${(-12 + 124 * t).toFixed(2)}vw, ${dy.toFixed(1)}px) rotate(${turn.toFixed(1)}deg); opacity: ${opacity}; }`);
    }
    frames.push(`100% { transform: translate(112vw, 0) rotate(${spin ?? 0}deg); opacity: 0; }`);
    return `@keyframes ${name} { ${frames.join(" ")} }`;
  }, [name, lapMs, restMs, wobble, waves, spin, seed]);

  const style: Vars = {
    top,
    width,
    animationName: name,
    animationDuration: `${Math.round(lapMs + restMs)}ms`,
    animationDelay: `${delay}ms`,
    "--sv-flap": flapMs ? `${flapMs / 2}ms` : "0ms",
  };
  return (
    <div className="sv-parallax sv-flyer-lane" style={{ "--sv-depth": depth } as Vars}>
      <style>{keyframes}</style>
      <div className="sv sv-flyer" data-mirror={mirror || undefined} data-flap={flapMs ? flapAxis : undefined} style={style}>
        <div className="sv-flyer-art">{children}</div>
      </div>
    </div>
  );
}
