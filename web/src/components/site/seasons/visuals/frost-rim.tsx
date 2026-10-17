"use client";

import { hash, type ByScheme, type Vars } from "./runtime";
import "./frost-rim.css";

/** The crystals along the rim, as [left %, size in px]. The same as the app's. */
const CRYSTALS: readonly (readonly [number, number])[] = [
  [6, 9],
  [19, 6],
  [33, 11],
  [47, 7],
  [58, 10],
  [72, 6],
  [86, 12],
  [95, 7],
];

/** Where the rim thickens, as [left %, width %]. */
const THICK: readonly (readonly [number, number])[] = [
  [4, 18],
  [30, 14],
  [55, 20],
  [82, 14],
];

/** One crystal's glint cycle, in milliseconds, before each varies it. */
const GLINT_MS = 5200;

/**
 * Frost along the top edge of a card: a thin, pale rim that thickens in
 * places, crystals set along it, and now and then one of them catching the
 * light, slowly, never in step. Place it inside the card, which must be
 * positioned and must not clip. See `runtime.ts` for the rules every visual
 * here follows.
 *
 * @param props.color The frost, by appearance, `#rrggbb`.
 * @param props.animate Whether the crystals glint.
 * @return The rim.
 */
export function FrostRim({ color, animate }: { color: ByScheme<string>; animate: boolean }) {
  const style: Vars = { "--sv-frost-dark": color.dark, "--sv-frost-light": color.light };
  return (
    <div className="sv sv-frost" data-animate={animate || undefined} style={style} aria-hidden>
      <span data-part="line" />
      {THICK.map(([left, width], i) => (
        <span key={`t${i}`} data-part="thick" style={{ left: `${left}%`, width: `${width}%` }} />
      ))}
      {CRYSTALS.map(([left, size], i) => (
        <span
          key={i}
          data-part="crystal"
          style={
            {
              left: `${left}%`,
              "--sv-c": `${size}px`,
              animationDuration: `${Math.round(GLINT_MS * (0.8 + hash(i, 1) * 0.6))}ms`,
              animationDelay: `-${Math.round(hash(i, 2) * GLINT_MS)}ms`,
            } as Vars
          }
        />
      ))}
    </div>
  );
}
