"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SeasonGreeting, SeasonIcon, useSeason as usePackageSeason, type ActiveSeason as PackageSeason } from "@openmacro/seasons/web/provider";
import type { SeasonId } from "@openmacro/core/season";
import type { UiKey } from "@openmacro/core/i18n";

/**
 * Seasonal decorations: where the site hangs them.
 *
 * The drawing is `@openmacro/seasons/web`, given OpenMacro's words and
 * artwork by `SeasonsProvider` (`seasons/provider.tsx`). This file only
 * places it on OpenMacro's pages: which pages are dressed, where the footer
 * row sits, the classes of the greeting and the icons. Nothing here names a
 * season.
 *
 * Light by construction. This file is part of every page, so it holds no
 * visuals: the renderer's decorations are one chunk fetched only while a
 * season is on (and Halloween's artwork another), so with the seasons off
 * nothing is downloaded. Prerendered HTML has no decorations at all, so
 * hydration adds them without a mismatch. The package's stylesheet comes
 * with that chunk (`seasons/renderer.ts`).
 */

/** The season on screen right now, with everything needed to draw it. */
export type ActiveSeason = PackageSeason<SeasonId, UiKey>;

/**
 * The season to decorate for, live.
 *
 * @return The season, or `null` on the server, during hydration, and on an
 *     ordinary day.
 */
export function useSeason(): ActiveSeason | null {
  return usePackageSeason<SeasonId, UiKey>();
}

/** The renderer's decorations, loaded only while a season is on. */
const renderer = () => import("./seasons/renderer");
const Layer = dynamic(() => renderer().then((m) => m.SeasonLayer), { ssr: false });
const Footer = dynamic(() => renderer().then((m) => m.SeasonFooter), { ssr: false });
const Burst = dynamic(() => renderer().then((m) => m.SeasonBurst), { ssr: false });
const CardEdge = dynamic(() => renderer().then((m) => m.SeasonCardEdge), { ssr: false });
const Rain = dynamic(() => renderer().then((m) => m.SeasonRain), { ssr: false });

/**
 * Everything that floats over and behind the page, for whichever season is
 * on. Mounted once, in the root layout.
 *
 * An embedded video is someone else's page, so it stays undressed. Over a
 * lesson only the still sky: snow falling across a question, or a toy
 * hanging over it, is a distraction, as in the app.
 *
 * @return The season's layer, or nothing on an ordinary day.
 */
export function SeasonalDecor() {
  const season = useSeason();
  const pathname = usePathname() ?? "";
  if (!season || /^(\/pt)?\/embed\//.test(pathname)) return null;
  return <Layer minimal={/^(\/pt)?\/learn\/[^/]+/.test(pathname)} />;
}

/**
 * The row of ornaments sitting on the top edge of the footer (`.season-patch`
 * in globals.css places it). Place it inside a positioned container.
 *
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonalFooter() {
  return useSeason() ? <Footer className="season-patch" /> : null;
}

/**
 * Shows the season's emoji in place of an ordinary icon, as the app's
 * `useSeasonalEmoji` does.
 *
 * @param props.role Which icon this is.
 * @param props.className Classes for the emoji, sized like the icon.
 * @param props.children The ordinary icon, shown on an ordinary day.
 * @return The emoji in season, otherwise the icon.
 */
export function SeasonalIcon(props: { role: "streak" | "complete" | "perfect"; className?: string; children: React.ReactNode }) {
  return <SeasonIcon {...props} />;
}

/**
 * A small greeting pill, "🎃 Happy Halloween!", in the site's gold.
 *
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonalGreeting() {
  return <SeasonGreeting className="mt-2 inline-flex w-fit items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-extrabold text-gold" />;
}

/**
 * A burst of the season's particles, on a correct answer. Place it inside a
 * positioned container.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalBurst() {
  return useSeason()?.motion ? <Burst /> : null;
}

/**
 * Whatever the season has settled on the top edge of the dashboard's "what
 * next" card, as the app does on Today's hero card. Place it inside the
 * card, which must be positioned and not clip.
 *
 * @return The edge, or nothing on an ordinary day or for a season without one.
 */
export function SeasonalCardEdge() {
  return useSeason()?.pack.look.edge ? <CardEdge /> : null;
}

/**
 * The season's particles drifting down the window, for a finished lesson.
 *
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalRain() {
  return useSeason()?.motion ? <Rain /> : null;
}
