"use client";

import * as React from "react";
import type { LayerProps } from "@/components/site/seasonal-decor";
import { HangingToy } from "./toy";
import "./layer.css";
import "./christmas.css";

/**
 * Christmas on the site: snow falling past the page, a sleigh crossing now
 * and then, and a bell on a thread that rings when clicked. The same pack the
 * app draws; the snow here is mostly soft dots, which read as snow at window
 * size better than a field of emoji, with the pack's own flake mixed in.
 *
 * Loaded only while Christmas is on (see `seasonal-decor.tsx`).
 */

/** How many soft dots fall, beside the pack's own flakes. */
const DOTS = 28;

/**
 * Snow: a fixed set of flakes, each on its own lane, size, speed and delay,
 * all chosen from its index so the server and every reload agree.
 *
 * @param props.flake The pack's flake emoji.
 * @param props.flakes How many of them fall.
 * @return The snow.
 */
function Snow({ flake, flakes }: { flake: string; flakes: number }) {
  const items = React.useMemo(
    () =>
      Array.from({ length: DOTS + flakes }, (_, i) => ({
        emoji: i >= DOTS,
        style: {
          left: `${((i * 61) % 100) + ((i * 7) % 3) * 0.3}%`,
          animationDelay: `-${(i * 1709) % 14000}ms`,
          animationDuration: `${11000 + ((i * 2311) % 9000)}ms`,
          "--size": `${4 + ((i * 5) % 5)}px`,
          "--sway": `${((i * 13) % 3) - 1}rem`,
        } as React.CSSProperties,
      })),
    [flakes],
  );
  return (
    <div className="season-snow">
      {items.map((item, i) =>
        item.emoji ? (
          <span key={i} className="season-flake" style={item.style}>
            {flake}
          </span>
        ) : (
          <span key={i} className="season-dot" style={item.style} />
        ),
      )}
    </div>
  );
}

/**
 * The Christmas layer. The calm look keeps the bell and leaves the snow and
 * the sleigh out.
 *
 * @param props.season The season on screen.
 * @param props.sky Whether snow and the sleigh may cross this page.
 * @return The layer.
 */
export function ChristmasLayer({ season, sky }: LayerProps) {
  const { flyer, ambient } = season.pack;
  return (
    <div className="season-layer" aria-hidden>
      {season.motion && sky && ambient ? <Snow flake={ambient.emoji} flakes={Math.min(ambient.count, 6)} /> : null}
      <HangingToy season={season} />
      {season.motion && sky
        ? Array.from({ length: flyer.count }, (_, index) => (
            <div key={index} className="season-flyer season-sleigh" data-index={index} data-mirror={flyer.mirror || undefined}>
              {flyer.emoji}
            </div>
          ))
        : null}
    </div>
  );
}
