"use client";

/**
 * The seasonal pieces that are only words and emoji: no visuals, no CSS
 * beyond a default class, so they can sit in the always-loaded part of an
 * app next to the provider.
 */

import type * as React from "react";

import { useSeason, useSeasonContext } from "./context.tsx";

/**
 * Shows the season's emoji in place of an ordinary icon: the streak flame
 * becomes a jack-o'-lantern or a tree, a party popper a pumpkin or a
 * present. For the swap as a string, use `useSeasonEmoji`.
 *
 * @param props.role Which icon this is.
 * @param props.className Classes for the emoji, sized like the icon.
 * @param props.children The ordinary icon, shown on an ordinary day.
 * @return The emoji in season, otherwise the icon.
 */
export function SeasonIcon({ role, className, children }: { role: "streak" | "complete" | "perfect"; className?: string; children: React.ReactNode }) {
  const season = useSeason();
  if (!season) return <>{children}</>;
  return (
    <span className={className} style={{ lineHeight: 1 }} aria-hidden>
      {season.pack.emoji[role]}
    </span>
  );
}

/**
 * A small greeting pill, "🎃 Happy Halloween!". Text, so it is read aloud.
 *
 * @param props.className Replaces the default look (`sv-greeting`).
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonGreeting({ className = "sv-greeting" }: { className?: string }) {
  const season = useSeason();
  const { translate } = useSeasonContext();
  if (!season) return null;
  return <p className={className}>{translate(season.pack.strings.greeting)}</p>;
}

