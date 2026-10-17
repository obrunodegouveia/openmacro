"use client";

import type * as React from "react";
import dynamic from "next/dynamic";
import type { SeasonId } from "@openmacro/core/season";
import type { ActiveSeason } from "@/components/site/seasonal-decor";

/**
 * Bespoke artwork a season may draw on the site in place of its pack's
 * emoji: SVG, mostly, where the site has a renderer the app does not.
 *
 * Entirely optional. A season with nothing here is drawn from its pack by
 * the generic layer (`layer.tsx`), and looks complete; this is where the
 * site may spend a little extra on a season it wants to make a fuss of.
 * Each piece is its own lazily loaded component, so the artwork is fetched
 * only while its season is on.
 */
export interface SeasonArt {
  /** Strung across the top corners of the window. */
  readonly corners?: React.ComponentType;
  /** Drawn as the toy instead of its emoji. */
  readonly toy?: React.ComponentType;
  /** Drawn as each flyer instead of its emoji, filling the flyer's width. */
  readonly flyer?: React.ComponentType;
  /** Width of one flyer when drawn with `flyer`, as a CSS length. */
  readonly flyerWidth?: string;
  /** Set on the footer's top edge instead of the pack's row. */
  readonly footer?: React.ComponentType<{ season: ActiveSeason }>;
}

const halloween = () => import("./halloween-art");

/** Each season's artwork, if it has any. */
export const SEASON_ART: Partial<Record<SeasonId, SeasonArt>> = {
  halloween: {
    corners: dynamic(() => halloween().then((m) => m.Cobwebs), { ssr: false }),
    toy: dynamic(() => halloween().then((m) => m.SpiderArt), { ssr: false }),
    flyer: dynamic(() => halloween().then((m) => m.BatArt), { ssr: false }),
    flyerWidth: "3rem",
    footer: dynamic(() => halloween().then((m) => m.HalloweenFooter), { ssr: false }),
  },
};
