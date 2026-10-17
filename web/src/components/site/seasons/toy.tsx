"use client";

import * as React from "react";
import { toyReaction } from "@openmacro/core/season";
import { useLocale } from "@/components/site/locale-provider";
import type { ActiveSeason } from "@/components/site/seasonal-decor";
import { Burst } from "./visuals/burst";
import { DraggableToy } from "./visuals/draggable-toy";
import "./toy.css";

/** How long the toy's line stays up. */
const LINE_MS = 1800;

/**
 * The toy on a thread from the top of the window: the spider at Halloween,
 * a bell at Christmas. The same game as the app's: it can be picked up and
 * thrown (it swings back on its thread), a click drops it (or rings it),
 * every third click it says something, every tenth it throws a burst. The
 * physics is the app-agnostic `DraggableToy`; this wrapper adds the words.
 *
 * @param props.season The season on screen.
 * @param props.children The toy's artwork; the pack's emoji when omitted.
 * @return The toy.
 */
export function HangingToy({ season, children }: { season: ActiveSeason; children?: React.ReactNode }) {
  const { t } = useLocale();
  const taps = React.useRef(0);
  // The line, and the tap that said it, so a repeated line animates again.
  const [line, setLine] = React.useState<{ line: number; tap: number } | null>(null);
  const [burst, setBurst] = React.useState(0);

  React.useEffect(() => {
    if (line === null) return;
    const timer = setTimeout(() => setLine(null), LINE_MS);
    return () => clearTimeout(timer);
  }, [line]);

  const onTap = () => {
    taps.current += 1;
    const reaction = toyReaction(taps.current);
    if (reaction === "burst") setBurst((n) => n + 1);
    else if (reaction !== null) setLine({ line: reaction, tap: taps.current });
  };

  const { look } = season.pack;
  return (
    <DraggableToy
      className="season-toy"
      rest="clamp(3.5rem, 8vw, 6rem)"
      move={season.pack.toy.move}
      animate={season.motion}
      onTap={onTap}
      attached={
        <>
          {line !== null ? (
            <p key={line.tap} className="season-toy-line">
              {t(`season.${season.id}.toy.${line.line as 1 | 2 | 3}`)}
            </p>
          ) : null}
          {burst > 0 && season.motion ? (
            <div className="season-toy-burst">
              <Burst key={burst} particles={season.pack.particles} ring={look.burst.ring} gravity={look.burst.gravity} spin={look.burst.spin} />
            </div>
          ) : null}
        </>
      }
    >
      {children ?? <span className="season-toy-emoji">{season.pack.toy.emoji}</span>}
    </DraggableToy>
  );
}
