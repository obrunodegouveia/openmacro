"use client";

import type { ActiveSeason } from "@/components/site/seasonal-decor";
import { Mist } from "./visuals/mist";
import { ParticleField } from "./visuals/particle-field";
import { useVisualsRuntime } from "./visuals/runtime";
import { SkyGlow } from "./visuals/sky-glow";
import { Sun } from "./visuals/sun";

/**
 * The air of a season on the site, from its pack's `look`: the tinted sky
 * behind the top of the page and its sun, the particles in depth (the far
 * ones behind the page, the nearest faintly in front), and the season's
 * mist along the bottom if it has one. The drawing is the app-agnostic
 * primitives in `./visuals`.
 *
 * The calm look and reduced motion keep the sky, the sun and the mist,
 * still, and leave the particles out. Over a lesson nothing moves, and
 * nothing lies along the bottom.
 *
 * @param props.season The season on screen.
 * @param props.sky Whether things may move over this page (not a lesson).
 * @return The atmosphere.
 */
export function SeasonAtmosphere({ season, sky }: { season: ActiveSeason; sky: boolean }) {
  const { look } = season.pack;
  const moving = season.motion && sky;
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
      {look.mist && sky ? <Mist {...look.mist} animate={moving} /> : null}
      {moving ? (
        <>
          <ParticleField layers={back} placement="behind" {...field} />
          <ParticleField layers={front} placement="front" {...field} />
        </>
      ) : null}
    </>
  );
}
