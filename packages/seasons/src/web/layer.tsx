"use client";

/**
 * Any season on the web, drawn from its pack: the air (the tinted sky and
 * its sun behind the page, the particles in depth, the mist along the
 * bottom), the garland at the top of the layer, the toy on its thread, and
 * the flyers crossing now and then. The same pack the native renderer
 * draws, through the same kind of primitives, so a new season needs no
 * code here. A season may swap in its own artwork for a part (`art` on the
 * provider).
 *
 * This is the heavy part of the web renderer. Load it lazily (`React.lazy`
 * or `next/dynamic`) so a page with seasons off downloads none of it.
 */

import * as React from "react";

import { toyReaction } from "../presets/packs.ts";
import { useSeason, useSeasonContext, type ActiveSeason } from "./context.tsx";
import { BeachBall } from "./visuals/beach-ball.tsx";
import { Burst } from "./visuals/burst.tsx";
import { DraggableToy } from "./visuals/draggable-toy.tsx";
import { FairyLights } from "./visuals/fairy-lights.tsx";
import { Flyer } from "./visuals/flyer.tsx";
import { Mist } from "./visuals/mist.tsx";
import { ParticleField } from "./visuals/particle-field.tsx";
import { hash, useVisualsRuntime } from "./visuals/runtime.ts";
import { SkyGlow } from "./visuals/sky-glow.tsx";
import { Sun } from "./visuals/sun.tsx";

/** Swags across the window: two on a phone, three when wider. */
const SWAGS = { narrow: 2, wide: 3 } as const;

/** Where the window counts as wide, for the garland. */
const WIDE = "(min-width: 640px)";

/** The band, in viewport heights from the top of the layer, that flyers cross. */
const FLIGHT_BAND = { top: 3, depth: 12 } as const;

/** Flyers are drawn a little bigger than on a phone: the window is wider. */
const FLYER_SCALE = 1.35;

/** How long the toy's line stays up. */
const LINE_MS = 1800;

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
 * The air of a season, from its pack's `look`: the tinted sky behind the
 * top of the page and its sun, the particles in depth (the far ones behind
 * the page, the nearest faintly in front), and the mist along the bottom.
 *
 * The calm look and reduced motion keep the sky, the sun and the mist,
 * still, and leave the particles out. On a minimal page nothing moves and
 * nothing lies along the bottom.
 *
 * @param props.season The season on screen.
 * @param props.minimal Only the still sky.
 * @return The atmosphere.
 */
function Atmosphere({ season, minimal }: { season: ActiveSeason; minimal: boolean }) {
  const { look } = season.pack;
  const moving = season.motion && !minimal;
  useVisualsRuntime(moving);
  const back = look.motes.layers.filter((layer) => !layer.front);
  const front = look.motes.layers.filter((layer) => layer.front);
  const field = {
    colors: look.motes.colors,
    glow: look.motes.glow,
    direction: look.motes.direction,
    motion: look.motes.motion,
    wind: look.motes.wind,
  };

  return (
    <>
      <SkyGlow glows={look.sky.glows} height={look.sky.height} breatheMs={look.sky.breatheMs} animate={moving} depth={0.008} />
      {look.sun ? <Sun {...look.sun} band={look.sky.height} animate={moving} depth={0.012} /> : null}
      {look.mist && !minimal ? <Mist {...look.mist} animate={moving} /> : null}
      {moving ? (
        <>
          <ParticleField layers={back} placement="behind" {...field} />
          <ParticleField layers={front} placement="front" {...field} />
        </>
      ) : null}
    </>
  );
}

/**
 * The toy on a thread from the top of the layer: a spider, a bell, a bee, a
 * beach ball. It can be picked up and thrown (it swings back on its
 * thread), a click plays the pack's move, every third click it says
 * something, every tenth it throws a burst.
 *
 * @param props.season The season on screen.
 * @param props.children The toy's artwork; the pack's emoji when omitted.
 * @return The toy.
 */
function HangingToy({ season, children }: { season: ActiveSeason; children?: React.ReactNode }) {
  const { translate } = useSeasonContext();
  const taps = React.useRef(0);
  // The line, and the tap that said it, so a repeated line animates again.
  const [line, setLine] = React.useState<{ line: number; tap: number } | null>(null);
  const [burst, setBurst] = React.useState(0);

  React.useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const { look, strings } = season.pack;
  const onTap = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current, strings.toy.length);
    if (reaction === "burst") setBurst((n) => n + 1);
    else if (reaction !== null) setLine({ line: reaction, tap: taps.current });
  };

  return (
    <DraggableToy
      className="sv-hanging-toy"
      // Short on a phone, so it hangs in the margin above the first line of
      // the page rather than over it; longer as the window widens.
      rest="clamp(0.5rem, 9vw - 1.5rem, 6rem)"
      move={season.pack.toy.move}
      animate={season.motion}
      onTap={onTap}
      attached={
        <>
          {line !== null ? (
            <p key={line.tap} className="sv-toy-line">
              {translate(strings.toy[(line.line - 1) % strings.toy.length]!)}
            </p>
          ) : null}
          {burst > 0 && season.motion ? (
            <div className="sv-toy-burst">
              <Burst key={burst} particles={season.pack.particles} ring={look.burst.ring} gravity={look.burst.gravity} spin={look.burst.spin} />
            </div>
          ) : null}
        </>
      }
    >
      {children ?? (season.pack.toy.shape === "beach-ball" ? <BeachBall size="1.9rem" /> : <span className="sv-toy-emoji">{season.pack.toy.emoji}</span>)}
    </DraggableToy>
  );
}

/**
 * Everything that floats over and behind the page, for whichever season is
 * on. Mount once, inside the provider, on every page you want dressed.
 *
 * The calm look keeps the sky, the garland (still) and any corners, and
 * leaves out the flyers and a creepy toy (a spider, a bee); reduced motion
 * keeps the toy, still. A minimal page (a quiz, a checkout, a reading view)
 * gets only the still sky: snow falling across a question, or a toy
 * hanging over it, is a distraction, not a decoration.
 *
 * Its decorations sit in a fixed layer starting `--sv-layer-top` from the
 * top of the window (set it to your fixed header's height).
 *
 * @param props.minimal Only the still sky on this page.
 * @return The layer, or nothing on an ordinary day.
 */
export function SeasonLayer({ minimal = false }: { minimal?: boolean }) {
  const season = useSeason();
  const { art: allArt } = useSeasonContext();
  const swags = useWide() ? SWAGS.wide : SWAGS.narrow;
  if (!season) return null;
  const { flyer, look, toy } = season.pack;
  const art = allArt[season.id];
  const moving = season.motion && !minimal;
  const Corners = art?.corners;
  const ToyArt = art?.toy;
  const FlyerArt = art?.flyer;

  if (minimal) return <Atmosphere season={season} minimal />;

  return (
    <>
      <Atmosphere season={season} minimal={false} />
      <div className="sv-layer" aria-hidden>
        {Corners ? (
          <React.Suspense fallback={null}>
            <Corners />
          </React.Suspense>
        ) : null}
        {look.garland ? (
          <div className="sv-garland">
            <FairyLights
              colors={look.garland.colors}
              beads={look.garland.beads}
              // The pack counts across a phone's two swags.
              count={Math.round((look.garland.count * swags) / SWAGS.narrow)}
              swags={swags}
              sag={look.garland.sag}
              twinkleMs={look.garland.beatMs}
              wire={look.garland.wire ?? "var(--sv-ink-faint, currentColor)"}
              animate={moving}
            />
          </div>
        ) : null}
        {season.calm && toy.creepy ? null : (
          <HangingToy season={season}>
            {ToyArt ? (
              <React.Suspense fallback={<span className="sv-toy-emoji">{toy.emoji}</span>}>
                <ToyArt />
              </React.Suspense>
            ) : null}
          </HangingToy>
        )}
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
                  {FlyerArt ? (
                    <React.Suspense fallback={null}>
                      <FlyerArt />
                    </React.Suspense>
                  ) : (
                    <span className="sv-flyer-emoji" style={{ fontSize: `${Math.round(size)}px` }}>
                      {emoji}
                    </span>
                  )}
                </Flyer>
              );
            })
          : null}
      </div>
    </>
  );
}
