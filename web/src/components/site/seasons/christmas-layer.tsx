"use client";

import * as React from "react";
import type { LayerProps } from "@/components/site/seasonal-decor";
import { SeasonAtmosphere } from "./atmosphere";
import { HangingToy } from "./toy";
import { FairyLights } from "./visuals/fairy-lights";
import { Flyer } from "./visuals/flyer";
import "./layer.css";

/**
 * Christmas on the site: an aurora in the sky, snow falling in three depths
 * (the far flakes behind the page, the near ones faintly in front), fairy
 * lights strung under the header, a sleigh crossing now and then, and a
 * bell on a thread that rings when clicked and swings when thrown. The same
 * pack the app draws, through the same app-agnostic visuals.
 *
 * Loaded only while Christmas is on (see `seasonal-decor.tsx`).
 */

/** Swags across the window: two on a phone, as in the app, three when wider. */
const SWAGS = { narrow: 2, wide: 3 } as const;

/** Where the window counts as wide, for the lights. */
const WIDE = "(min-width: 640px)";

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
 * The Christmas layer. The calm look keeps the sky, the lights (steady) and
 * the bell, and leaves the snow and the sleigh out.
 *
 * @param props.season The season on screen.
 * @param props.sky Whether things may move over this page.
 * @return The layer.
 */
export function ChristmasLayer({ season, sky }: LayerProps) {
  const { flyer, look } = season.pack;
  const moving = season.motion && sky;
  const swags = useWide() ? SWAGS.wide : SWAGS.narrow;
  return (
    <>
      <SeasonAtmosphere season={season} sky={sky} />
      <div className="season-layer" aria-hidden>
        {look.lights ? (
          <div className="season-lights">
            <FairyLights
              colors={look.lights.colors}
              // The pack counts bulbs across a phone's two swags.
              count={Math.round((look.lights.count * swags) / SWAGS.narrow)}
              swags={swags}
              sag={look.lights.sag}
              twinkleMs={look.lights.twinkleMs}
              wire="var(--color-ink-faint)"
              animate={moving}
            />
          </div>
        ) : null}
        <HangingToy season={season} />
        {moving
          ? Array.from({ length: flyer.count }, (_, index) => (
              <Flyer key={index} top="9vh" width="auto" lapMs={9000} delay={4000} mirror={flyer.mirror} depth={0.03} seed={index}>
                <span className="season-sleigh">{flyer.emoji}</span>
              </Flyer>
            ))
          : null}
      </div>
    </>
  );
}
