"use client";

import * as React from "react";
import { Burst } from "./burst";
import { ParticleField, type FieldLayer } from "./particle-field";
import type { Vars } from "./runtime";
import "./welcome-stage.css";

/** The motes rising behind the card. */
const MOTES: readonly FieldLayer[] = [
  { count: 14, size: 3, crossMs: 9000, opacity: 0.45, sway: 12, parallax: 0 },
  { count: 8, size: 5, crossMs: 6500, opacity: 0.7, sway: 18, parallax: 0 },
];

/** When the burst goes off, as the card lands. */
const BURST_MS = 380;

/**
 * A full-window greeting, staged in layers: the scrim darkens, a glow
 * blooms behind where the card will be, motes rise through it, the card
 * springs in, its emoji pops, the title follows, and a burst with a ring of
 * light goes off behind it. Presentational only: the caller decides when it
 * shows and closes it on `onDismiss`. Without motion every layer simply
 * fades in. See `runtime.ts` for the rules every visual here follows.
 *
 * @param props.emoji The big emoji on the card.
 * @param props.title The greeting.
 * @param props.particles What the burst throws.
 * @param props.glow The glow, motes and ring, any CSS colour.
 * @param props.animate Whether anything moves.
 * @param props.onDismiss A click anywhere.
 * @param props.className Classes for the card (its colours and border).
 * @param props.titleClassName Classes for the title.
 * @param props.scrimClassName Classes for the scrim.
 * @return The stage.
 */
export function WelcomeStage({
  emoji,
  title,
  particles,
  glow,
  animate,
  onDismiss,
  className,
  titleClassName,
  scrimClassName,
}: {
  emoji: string;
  title: string;
  particles: readonly string[];
  glow: string;
  animate: boolean;
  onDismiss: () => void;
  className?: string;
  titleClassName?: string;
  scrimClassName?: string;
}) {
  const [burst, setBurst] = React.useState(false);
  React.useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setBurst(true), BURST_MS);
    return () => clearTimeout(timer);
  }, [animate]);

  return (
    <div
      role="status"
      onClick={onDismiss}
      className={`sv sv-welcome ${scrimClassName ?? ""}`}
      data-animate={animate || undefined}
      style={{ "--sv-glow": glow } as Vars}
    >
      <div className="sv-welcome-bloom" aria-hidden />
      {animate ? (
        <div className="sv-welcome-motes" aria-hidden>
          <ParticleField layers={MOTES} color={{ light: glow, dark: glow }} glow direction="rise" wind={12} placement="front" />
        </div>
      ) : null}
      <div className="sv-welcome-burst" aria-hidden>
        {burst ? <Burst particles={particles} ring={glow} reach={190} gravity={90} spin={140} /> : null}
      </div>
      <div className={`sv-welcome-card ${className ?? ""}`}>
        <p className="sv-welcome-emoji" aria-hidden>
          {emoji}
        </p>
        <p className={`sv-welcome-title ${titleClassName ?? ""}`}>{title}</p>
      </div>
    </div>
  );
}
