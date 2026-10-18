"use client";

import dynamic from "next/dynamic";
import type { WebSeasonArt } from "@openmacro/seasons/web/provider";
import type { SeasonId } from "@openmacro/core/season";

/**
 * Bespoke artwork a season draws on the site in place of its pack's emoji,
 * through the package's `art` hook. Entirely optional: a season with
 * nothing here is drawn from its pack and looks complete.
 *
 * Halloween uses the package's own SVG artwork (cobwebs, a spider, bats and
 * lit pumpkins). Each piece is its own lazily loaded component, so the
 * artwork is fetched only while Halloween is on.
 */

const halloween = () => import("@openmacro/seasons/web/art/halloween");

/** Each season's artwork, if it has any. */
export const SEASON_ART: Partial<Record<SeasonId, WebSeasonArt>> = {
  halloween: {
    corners: dynamic(() => halloween().then((m) => m.Cobwebs), { ssr: false }),
    toy: dynamic(() => halloween().then((m) => m.SpiderArt), { ssr: false }),
    flyer: dynamic(() => halloween().then((m) => m.BatArt), { ssr: false }),
    flyerWidth: "3rem",
    footer: dynamic(() => halloween().then((m) => m.HalloweenFooter), { ssr: false }),
  },
};
