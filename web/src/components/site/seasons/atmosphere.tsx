"use client";

import type { ActiveSeason } from "@/components/site/seasonal-decor";
import { Fog } from "./visuals/fog";
import { ParticleField } from "./visuals/particle-field";
import { useVisualsRuntime } from "./visuals/runtime";
import { SkyGlow } from "./visuals/sky-glow";

/**
 * The air of a season on the site, from its pack's `look`: the tinted sky
 * behind the top of the page, the particles in depth (the far ones behind
 * the page, the nearest faintly in front), and the season's fog along the
 * bottom if it has one. Shared by every season's layer; the drawing is the
 * app-agnostic primitives in `./visuals`.
 *
 * The calm look and reduced motion keep the sky, still, and the fog, still,
 * and leave the particles out. Over a lesson nothing moves at all.
 *
 * @param props.season The season on screen.
 * @param props.sky Whether things may move over this page (not a lesson).
 * @return The atmosphere.
 */
export function SeasonAtmosphere({ season, sky }: { season: ActiveSeason; sky: boolean }) {
  const { look, ambient } = season.pack;
  const moving = season.motion && sky;
  useVisualsRuntime(moving);
  const back = look.motes.layers.filter((layer) => !layer.front);
  const front = look.motes.layers.filter((layer) => layer.front);

  return (
    <>
      <SkyGlow glows={look.sky.glows} height={look.sky.height} breatheMs={look.sky.breatheMs} animate={moving} depth={0.008} />
      {look.fog && sky ? <Fog color={look.fog.color} alpha={look.fog.alpha} driftMs={look.fog.driftMs} animate={moving} /> : null}
      {moving ? (
        <>
          <ParticleField layers={back} color={look.motes.color} glow={look.motes.glow} direction={look.motes.direction} wind={look.motes.wind} placement="behind" />
          <ParticleField
            layers={front}
            color={look.motes.color}
            glow={look.motes.glow}
            direction={look.motes.direction}
            wind={look.motes.wind}
            placement="front"
            emoji={ambient?.emoji}
          />
        </>
      ) : null}
    </>
  );
}
