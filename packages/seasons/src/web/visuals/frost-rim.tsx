"use client";

import { hash, type ByScheme, type Vars } from "./runtime.ts";

/** The crystals along the rim, as [left %, size in px]. The same as native's. */
const CRYSTALS: readonly (readonly [number, number])[] = [
  [5, 12],
  [17, 8],
  [31, 14],
  [45, 9],
  [57, 13],
  [70, 8],
  [84, 15],
  [95, 9],
];

/** The icicles hanging from the rim, as [left %, width, length], in CSS pixels. */
const ICICLES: readonly (readonly [number, number, number])[] = [
  [8, 4, 10],
  [14, 3, 6],
  [23, 5, 14],
  [36, 3, 7],
  [44, 4, 11],
  [53, 3, 6],
  [63, 5, 13],
  [74, 3, 8],
  [81, 4, 12],
  [91, 3, 7],
];

/** One crystal's glint cycle, in milliseconds, before each varies it. */
const GLINT_MS = 5200;

/**
 * Frost along the top edge of a card: a thin, pale rim with short icicles
 * hanging from it, crystals set along it, and now and then one of them catching the
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
      {ICICLES.map(([left, width, length], i) => (
        <span key={`i${i}`} data-part="icicle" style={{ left: `${left}%`, width, height: length }} />
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
