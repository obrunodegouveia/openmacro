"use client";

import * as React from "react";
import { toyReaction } from "@openmacro/core/season";
import { useLocale } from "@/components/site/locale-provider";
import type { ActiveSeason } from "@/components/site/seasonal-decor";
import { Burst } from "./fx";
import "./toy.css";

/** How long the toy's line stays up. */
const LINE_MS = 1800;

/**
 * The toy on a thread from the top of the window: the spider at Halloween,
 * a bell at Christmas. The same game as the app's `HangingToy`: a click
 * drops it (or rings it), every third click it says something, every tenth
 * it throws a burst.
 *
 * It stays a `div` with a click handler, not a button, on purpose: it is an
 * ornament with no function, hidden from assistive technology, and a button
 * would be one more tab stop on every page that does nothing.
 *
 * @param props.season The season on screen.
 * @param props.children The toy's artwork; the pack's emoji when omitted.
 * @return The toy.
 */
export function HangingToy({ season, children }: { season: ActiveSeason; children?: React.ReactNode }) {
  const { t } = useLocale();
  const taps = React.useRef(0);
  const [moving, setMoving] = React.useState(false);
  // The line, and the tap that said it, so a repeated line animates again.
  const [line, setLine] = React.useState<{ line: number; tap: number } | null>(null);
  const [burst, setBurst] = React.useState(0);

  React.useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const onClick = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current);
    if (reaction === "burst") setBurst((n) => n + 1);
    else if (reaction !== null) setLine({ line: reaction, tap: taps.current });
    if (season.motion) setMoving(true);
  };

  return (
    <div className="season-toy" data-move={season.pack.toy.move} data-moving={moving || undefined}>
      <div
        className="season-toy-body"
        onClick={onClick}
        onAnimationEnd={(event) => {
          // Only the body's own drop or swing; the line's fade-in bubbles up too.
          if (event.target === event.currentTarget && event.animationName !== "season-toy-bob") setMoving(false);
        }}
      >
        {children ?? <span className="season-toy-emoji">{season.pack.toy.emoji}</span>}
        {line !== null ? (
          <p key={line.tap} className="season-toy-line">
            {t(`season.${season.id}.toy.${line.line as 1 | 2 | 3}`)}
          </p>
        ) : null}
        {burst > 0 && season.motion ? (
          <div className="season-toy-burst">
            <Burst key={burst} particles={season.pack.particles} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
