"use client";

import * as React from "react";
import { Burst } from "./burst.tsx";
import { ParticleField, type FieldLayer, type MoteMotion, type MoteShape } from "./particle-field.tsx";
import type { ByScheme, Vars } from "./runtime.ts";

/** The motes rising behind the card. */
const MOTES: readonly FieldLayer[] = [
  { count: 14, size: 3, crossMs: 9000, opacity: 0.45, sway: 12, parallax: 0 },
  { count: 8, size: 5, crossMs: 6500, opacity: 0.7, sway: 18, parallax: 0 },
];

/**
 * The season's own air for the stage: its particles' colours, shape and
 * motion, so spring welcomes you with tumbling petals and winter with
 * glinting crystals. Without it, plain motes rise in the glow colour.
 */
export interface WelcomeMotes {
  readonly colors: readonly ByScheme<string>[];
  readonly motion: MoteMotion;
  readonly direction: "fall" | "rise";
  readonly shape?: MoteShape;
  readonly glow: boolean;
}

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
 * @param props.motes The season's air, see `WelcomeMotes`.
 * @param props.animate Whether anything moves.
 * @param props.onDismiss A click anywhere.
 * @param props.className Classes for the card (its colours and border).
 * @param props.titleClassName Classes for the title.
 * @param props.scrimClassName Classes for the scrim.
 *     With none of the three, the stage styles itself from the palette-role
 *     variables (`--sv-surface`, `--sv-accent`, …).
 * @return The stage.
 */
export function WelcomeStage({
  emoji,
  title,
  particles,
  glow,
  motes,
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
  motes?: WelcomeMotes;
  animate: boolean;
  onDismiss: () => void;
  className?: string;
  titleClassName?: string;
  scrimClassName?: string;
}) {
  const [burst, setBurst] = React.useState(false);
  const layers = React.useMemo(() => MOTES.map((layer) => ({ ...layer, shape: motes?.shape })), [motes?.shape]);
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
      data-default={className === undefined && titleClassName === undefined && scrimClassName === undefined ? "" : undefined}
      data-animate={animate || undefined}
      style={{ "--sv-glow": glow } as Vars}
    >
      <div className="sv-welcome-bloom" aria-hidden />
      {animate ? (
        <div className="sv-welcome-motes" aria-hidden>
          <ParticleField
            layers={layers}
            colors={motes?.colors ?? [{ light: glow, dark: glow }]}
            glow={motes?.glow ?? true}
            motion={motes?.motion}
            direction={motes?.direction ?? "rise"}
            wind={12}
            placement="front"
          />
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
