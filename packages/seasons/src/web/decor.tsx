"use client";

/**
 * The web's smaller decorations, each drawn from the live season's pack
 * inside a `SeasonProvider`: the row of ornaments that ends a page, the
 * burst on a correct answer, whatever has settled on a card's edge, the
 * rain on a finished task, and the welcome by name. (The emoji swap and the
 * greeting, which draw no visuals, are in `text.tsx`.)
 *
 * Nothing here names a season; on an ordinary day each renders nothing (or
 * its ordinary children). Everything is `aria-hidden` and ignores the
 * pointer, except the greeting and the welcome, which are words.
 */

import * as React from "react";

import { useSeason, useSeasonContext } from "./context.tsx";
import { Burst } from "./visuals/burst.tsx";
import { CandleGlow } from "./visuals/candle-glow.tsx";
import { FrostRim } from "./visuals/frost-rim.tsx";
import { Scatter } from "./visuals/scatter.tsx";
import { SnowCap } from "./visuals/snow-cap.tsx";
import { WelcomeStage } from "./visuals/welcome-stage.tsx";

/**
 * The row of ornaments that ends a page: the pack's row, lit ones glowing
 * with the season's candle, or the season's own footer artwork. Place it
 * with your own class (on the top edge of a footer, say).
 *
 * @param props.className Places the row.
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonFooter({ className }: { className?: string }) {
  const season = useSeason();
  const { art } = useSeasonContext();
  if (!season) return null;
  const Art = art[season.id]?.footer;
  const { candle } = season.pack.look;
  return (
    <div className={`sv-footer ${className ?? ""}`} aria-hidden>
      {Art ? (
        <React.Suspense fallback={null}>
          <Art season={season} />
        </React.Suspense>
      ) : (
        season.pack.footer.map((ornament, i) => {
          const glyph = (
            <span key={i} className="sv-ornament" data-size={ornament.size} data-lift={ornament.lift || undefined}>
              {ornament.emoji}
            </span>
          );
          return candle && ornament.lit ? (
            <CandleGlow key={i} color={candle.color} flickerMs={candle.flickerMs} offset={(i * 0.37) % 1} animate={season.motion}>
              {glyph}
            </CandleGlow>
          ) : (
            glyph
          );
        })
      )}
    </div>
  );
}

/**
 * A burst of the season's particles over a soft ring of light, thrown up
 * once when it mounts: on a correct answer, a finished task, a switch
 * turned on. Place it inside a positioned container.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonBurst() {
  const season = useSeason();
  if (!season?.motion) return null;
  const { burst } = season.pack.look;
  return <Burst particles={season.pack.particles} ring={burst.ring} gravity={burst.gravity} spin={burst.spin} />;
}

/**
 * Whatever the season has settled on the top edge of a card: snow, frost,
 * fallen leaves. Place it inside the card, which must be positioned and not
 * clip; on one card per page at most.
 *
 * @return The edge, or nothing on an ordinary day or for a season without one.
 */
export function SeasonCardEdge() {
  const season = useSeason();
  const edge = season?.pack.look.edge;
  if (!season || !edge) return null;
  if (edge.kind === "frost") return <FrostRim color={edge.color} animate={season.motion} />;
  if (edge.kind === "scatter") return <Scatter emoji={edge.emoji} />;
  return <SnowCap color={edge.color} shade={season.pack.look.motes.colors[0]?.light ?? season.pack.palette.light.inkFaint} />;
}

/**
 * The season's particles drifting down the window behind the page, for a
 * finished task.
 *
 * @param props.count How many drops. Default 16.
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonRain({ count = 16 }: { count?: number }) {
  const season = useSeason();
  if (!season?.motion) return null;
  const { particles } = season.pack;
  return (
    <div className="sv-rain" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            // Spread evenly, nudged so the columns don't line up.
            left: `${((i + 0.5) / count) * 100 + (((i * 37) % 7) - 3)}%`,
            animationDelay: `${(i * 613) % 4000}ms`,
            animationDuration: `${5200 + ((i * 1337) % 3000)}ms`,
          }}
        >
          {particles[i % particles.length]}
        </span>
      ))}
    </div>
  );
}

/**
 * The seasonal welcome by name, staged in the season's own air. The package
 * draws it; the app decides when (usually once a day per signed-in user)
 * and whom to greet. Never in the calm look, which has no popups.
 *
 * @param props.name Who to greet, or `null` for nothing.
 * @param props.onDismiss A click anywhere, or the app's own timer, closes it.
 * @param props.classNames Your own classes for the scrim, the card and the
 *     title; without them it styles itself from the palette roles.
 * @return The welcome, or nothing.
 */
export function SeasonWelcome({
  name,
  onDismiss,
  classNames,
}: {
  name: string | null;
  onDismiss: () => void;
  classNames?: { readonly scrim?: string; readonly card?: string; readonly title?: string };
}) {
  const season = useSeason();
  const { translate } = useSeasonContext();
  if (!name || !season || season.calm) return null;
  const { motes } = season.pack.look;
  return (
    <WelcomeStage
      emoji={season.pack.welcome}
      title={translate(season.pack.strings.welcome, { name })}
      particles={season.pack.particles}
      glow={season.pack.look.burst.ring}
      // The season's own air rises through the stage: its colours, its
      // motion, and the shape of its nearest drawn particles.
      motes={{
        colors: motes.colors,
        motion: motes.motion,
        direction: motes.direction,
        shape: [...motes.layers].reverse().find((layer) => !layer.emoji)?.shape,
        glow: motes.glow,
      }}
      animate={season.motion}
      onDismiss={onDismiss}
      scrimClassName={classNames?.scrim}
      className={classNames?.card}
      titleClassName={classNames?.title}
    />
  );
}
