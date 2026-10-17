"use client";

import * as React from "react";
import type { LayerProps } from "@/components/site/seasonal-decor";
import { SEASON_ART } from "./art";
import { SeasonAtmosphere } from "./atmosphere";
import { HangingToy } from "./toy";
import { FairyLights } from "./visuals/fairy-lights";
import { Flyer } from "./visuals/flyer";
import { hash } from "./visuals/runtime";
import "./layer.css";

/**
 * Any season on the site, drawn from its pack: the air (`atmosphere.tsx`),
 * the garland under the header, the toy on its thread, and the flyers
 * crossing now and then. The same pack the app draws, through the same
 * app-agnostic visuals, so a new season needs no code here. A season may
 * swap in its own artwork for a part (`art.ts`); Halloween does.
 *
 * Loaded only while a season is on (see `seasonal-decor.tsx`).
 */

/** Swags across the window: two on a phone, as in the app, three when wider. */
const SWAGS = { narrow: 2, wide: 3 } as const;

/** Where the window counts as wide, for the garland. */
const WIDE = "(min-width: 640px)";

/** The band, in viewport heights under the header, that flyers cross. */
const FLIGHT_BAND = { top: 3, depth: 12 } as const;

/** Flyers are drawn a little bigger than in the app: the window is wider. */
const FLYER_SCALE = 1.35;

/**
 * Whether the window is wide, live.
 *
 * @return True at `WIDE` and up; false on the server.
 */
function useWide(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

/**
 * The layer.
 *
 * The calm look keeps the sky, the garland (still) and any corners, and
 * leaves out the flyers and a creepy toy (a spider, a bee); reduced motion
 * keeps the toy, still. Over a lesson there is only the still sky.
 *
 * @param props.season The season on screen.
 * @param props.sky Whether this page may be decorated beyond its sky (not a lesson).
 * @return The layer.
 */
export function SeasonLayer({ season, sky }: LayerProps) {
  const { flyer, look, toy } = season.pack;
  const art = SEASON_ART[season.id];
  const moving = season.motion && sky;
  const swags = useWide() ? SWAGS.wide : SWAGS.narrow;
  const Corners = art?.corners;
  const ToyArt = art?.toy;
  const FlyerArt = art?.flyer;

  // Over a lesson only the still sky: nothing hangs over a question, not
  // even a garland or the toy, as in the app (the toy lives on Today).
  if (!sky) return <SeasonAtmosphere season={season} sky={false} />;

  return (
    <>
      <SeasonAtmosphere season={season} sky={sky} />
      <div className="season-layer" aria-hidden>
        {Corners ? <Corners /> : null}
        {look.garland ? (
          <div className="season-garland">
            <FairyLights
              colors={look.garland.colors}
              beads={look.garland.beads}
              // The pack counts across a phone's two swags.
              count={Math.round((look.garland.count * swags) / SWAGS.narrow)}
              swags={swags}
              sag={look.garland.sag}
              twinkleMs={look.garland.beatMs}
              wire={look.garland.wire ?? "var(--color-ink-faint)"}
              animate={moving}
            />
          </div>
        ) : null}
        {season.calm && toy.creepy ? null : <HangingToy season={season}>{ToyArt ? <ToyArt /> : null}</HangingToy>}
        {moving && flyer
          ? Array.from({ length: flyer.count }, (_, i) => {
              const together = flyer.spacingMs !== undefined;
              const size = flyer.size * FLYER_SCALE * (i === 0 ? 1 : 0.7 + hash(i, 2) * 0.25);
              const emoji = typeof flyer.emoji === "string" ? flyer.emoji : flyer.emoji[i % flyer.emoji.length]!;
              return (
                <Flyer
                  key={i}
                  top={`${(FLIGHT_BAND.top + hash(i, 1) * FLIGHT_BAND.depth).toFixed(1)}vh`}
                  width={FlyerArt ? `calc(${art?.flyerWidth ?? "3rem"} * ${(size / (flyer.size * FLYER_SCALE)).toFixed(2)})` : "auto"}
                  lapMs={flyer.lapMs * (together ? 1 : 1 + hash(i, 3) * 0.35)}
                  restMs={flyer.restMs}
                  delay={together ? 2000 + i * flyer.spacingMs! : 1200 + i * 3200 + hash(i, 4) * 2400}
                  wobble={flyer.wobble}
                  waves={flyer.waves}
                  spin={flyer.spin}
                  flapMs={flyer.flapMs}
                  flapAxis={flyer.flapAxis}
                  mirror={flyer.mirror}
                  depth={0.02 + hash(i, 5) * 0.02}
                  seed={i}
                >
                  {FlyerArt ? <FlyerArt /> : <span className="season-flyer" style={{ fontSize: `${Math.round(size)}px` }}>{emoji}</span>}
                </Flyer>
              );
            })
          : null}
      </div>
    </>
  );
}
