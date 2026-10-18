"use client";

import { lazy, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { createSeasonController, type SeasonController } from "@openmacro/seasons";
import { SeasonProvider, type WebSeasonArt } from "@openmacro/seasons/web/provider";
import { browserOverride, browserStorage } from "@openmacro/seasons/web/boot";
import { CALENDAR, PACKS } from "./seasons";

/**
 * The decorations and their stylesheet, in one chunk fetched only while a
 * season is on.
 */
const renderer = () => import("./renderer");
const SeasonLayer = dynamic(() => renderer().then((m) => m.SeasonLayer), { ssr: false });

/** Halloween's SVG artwork, fetched only in October. */
const halloween = () => import("@openmacro/seasons/web/art/halloween");
const ART: Partial<Record<keyof typeof PACKS, WebSeasonArt>> = {
  halloween: {
    corners: lazy(() => halloween().then((m) => ({ default: m.Cobwebs }))),
    toy: lazy(() => halloween().then((m) => ({ default: m.SpiderArt }))),
    flyer: lazy(() => halloween().then((m) => ({ default: m.BatArt }))),
    flyerWidth: "3rem",
  },
};

let controller: SeasonController<keyof typeof PACKS> | null = null;

/**
 * The browser's controller, created on first use; `null` on the server.
 *
 * @return The controller.
 */
function seasons() {
  if (typeof window === "undefined") return null;
  controller ??= createSeasonController({ calendar: CALENDAR, storage: browserStorage(), override: browserOverride() });
  return controller;
}

/**
 * The provider, and the layer over every page.
 *
 * @param props.children The page.
 * @return The app.
 */
export function Seasons({ children }: { children: ReactNode }) {
  return (
    <SeasonProvider controller={seasons()} packs={PACKS} art={ART}>
      {children}
      <SeasonLayer />
    </SeasonProvider>
  );
}
