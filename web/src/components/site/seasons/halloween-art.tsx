"use client";

import type { ActiveSeason } from "@/components/site/seasonal-decor";
import { CandleGlow } from "./visuals/candle-glow";
import "./halloween.css";

/**
 * Halloween's own artwork on the site: SVG cobwebs in the top corners, an
 * SVG spider for the toy, SVG bats for the flyers and lit SVG pumpkins on
 * the footer. Optional by design: without this file Halloween would draw
 * its pack's emoji like every other season, through the same generic layer
 * (`layer.tsx`). The site has an SVG renderer and a wider window, so it
 * spends it here. Registered in `art.ts`, and fetched only while Halloween
 * is on.
 */

/**
 * The SVG path of a quarter cobweb with its hub in the top-left corner.
 *
 * Spokes fan out over 90 degrees and each ring sags between them towards the
 * hub, which is what makes it read as silk rather than as a grid.
 *
 * @param size The width and height of the square it fills.
 * @return An SVG path `d` attribute.
 */
function cobwebPath(size: number): string {
  const spokes = 7;
  const rings = [0.24, 0.42, 0.6, 0.78, 0.96];
  const angles = Array.from({ length: spokes }, (_, i) => (i / (spokes - 1)) * (Math.PI / 2));
  const point = (r: number, a: number) => [Math.cos(a) * r * size, Math.sin(a) * r * size] as const;

  let d = "";
  for (const a of angles) {
    const [x, y] = point(1.02, a);
    d += `M0 0L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  for (const r of rings) {
    angles.forEach((a, i) => {
      const [x, y] = point(r, a);
      if (i === 0) {
        d += `M${x.toFixed(1)} ${y.toFixed(1)}`;
        return;
      }
      const mid = (a + angles[i - 1]!) / 2;
      const [cx, cy] = point(r * 0.86, mid);
      d += `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    });
  }
  return d;
}

const WEB_PATH = cobwebPath(160);

/**
 * A cobweb strung across one top corner of the window.
 *
 * @param props.side Which corner.
 * @return The web.
 */
function Cobweb({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 164 164" className="season-cobweb" data-side={side} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
      <path d={WEB_PATH} />
    </svg>
  );
}

/**
 * Both cobwebs, for the layer's corners.
 *
 * @return The webs.
 */
export function Cobwebs() {
  return (
    <>
      <Cobweb side="left" />
      <Cobweb side="right" />
    </>
  );
}

/**
 * The spider, in SVG, for the hanging toy.
 *
 * @return The spider.
 */
export function SpiderArt() {
  return (
    <svg viewBox="0 0 48 44" width={40} height={36}>
      <g stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
        <path d="M18 20 Q8 12 3 16M18 23 Q7 21 2 26M19 26 Q9 30 5 37M20 28 Q14 36 12 42" />
        <path d="M30 20 Q40 12 45 16M30 23 Q41 21 46 26M29 26 Q39 30 43 37M28 28 Q34 36 36 42" />
      </g>
      <ellipse cx={24} cy={26} rx={8} ry={9} fill="currentColor" />
      <circle cx={24} cy={15} r={6} fill="currentColor" />
      <circle cx={21.6} cy={14.4} r={1.7} fill="#ff8a1f" />
      <circle cx={26.4} cy={14.4} r={1.7} fill="#ff8a1f" />
    </svg>
  );
}

/**
 * A bat's silhouette, wings spread, for the flyers.
 *
 * @return The bat.
 */
export function BatArt() {
  return (
    <svg viewBox="0 0 100 40" className="season-bat">
      <path
        fill="currentColor"
        d="M50 14L46 6L45 13C38 10 22 3 2 7C10 11 12 17 12 23C16 19 22 19 26 24C29 20 34 20 38 26C40 23 44 23 46 29L50 35L54 29C56 23 60 23 62 26C66 20 71 20 74 24C78 19 84 19 88 23C88 17 90 11 98 7C78 3 62 10 55 13L54 6Z"
      />
    </svg>
  );
}

/**
 * A jack-o'-lantern, its face lit from inside.
 *
 * @param props.size Its width in pixels.
 * @return The pumpkin.
 */
function Pumpkin({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 60" width={size} height={(size * 60) / 64} className="season-pumpkin">
      <path d="M31 10c0-5 2-8 6-9" stroke="#3f6b2a" strokeWidth={4} strokeLinecap="round" fill="none" />
      <ellipse cx={18} cy={35} rx={15} ry={21} fill="#e8700f" />
      <ellipse cx={46} cy={35} rx={15} ry={21} fill="#e8700f" />
      <ellipse cx={32} cy={35} rx={14} ry={23} fill="#ff8a1f" />
      <g className="season-pumpkin-face" fill="#ffd34d">
        <path d="M17 28l7-7 4 9z" />
        <path d="M47 28l-7-7-4 9z" />
        <path d="M14 39c6 8 30 8 36 0-3 1-5 1-7 0l-3 4-3-4c-3 1-7 1-10 0l-3 4-3-4c-2 1-4 1-7 0z" />
      </g>
    </svg>
  );
}

/** The footer's pumpkins, by size, left to right. */
const PUMPKINS = [44, 64, 38] as const;

/**
 * Three pumpkins sitting on the top edge of the footer, each lit by the
 * season's candle and flickering out of step with the others.
 *
 * @param props.season The season on screen, for its candle and whether it may flicker.
 * @return The pumpkins.
 */
export function HalloweenFooter({ season }: { season: ActiveSeason }) {
  const { candle } = season.pack.look;
  return (
    <div className="season-patch" aria-hidden>
      {PUMPKINS.map((size, i) =>
        candle ? (
          <CandleGlow key={i} color={candle.color} flickerMs={candle.flickerMs} offset={(i * 0.37) % 1} animate={season.motion}>
            <Pumpkin size={size} />
          </CandleGlow>
        ) : (
          <Pumpkin key={i} size={size} />
        ),
      )}
    </div>
  );
}
