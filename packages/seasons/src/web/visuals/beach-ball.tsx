"use client";

import type * as React from "react";
import { BEACH_BALL } from "../../presets/drawings.ts";

/**
 * A beach ball, drawn with divs and CSS gradients: there is no beach-ball
 * emoji. The geometry is `BEACH_BALL` in the presets, shared with the
 * native `BeachBall`, so both draw the same ball.
 *
 * @param props.size Its diameter, as a CSS length.
 * @return The ball.
 */
export function BeachBall({ size }: { size: string }) {
  const { colors, cap } = BEACH_BALL;
  const disc: React.CSSProperties = { position: "absolute", inset: 0, borderRadius: "50%" };
  return (
    <span
      className="sv-ball"
      aria-hidden
      style={{
        position: "relative",
        display: "block",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        rotate: `${BEACH_BALL.tilt}deg`,
        boxShadow: `inset 0 0 0 0.5px ${BEACH_BALL.rim}`,
        background: `linear-gradient(to right, ${colors.left} 50%, ${colors.right} 50%)`,
      }}
    >
      <span style={{ ...disc, background: colors.white, scale: `${BEACH_BALL.whiteWidth} 1` }} />
      <span style={{ ...disc, background: colors.front, scale: `${BEACH_BALL.frontWidth} 1` }} />
      <span
        style={{
          position: "absolute",
          left: `${((1 - cap.width) / 2) * 100}%`,
          width: `${cap.width * 100}%`,
          top: `${(-cap.height / 2) * 100}%`,
          height: `${cap.height * 100}%`,
          borderRadius: "50%",
          background: colors.cap,
        }}
      />
      <span style={{ ...disc, background: `${BEACH_BALL.highlight}, ${BEACH_BALL.shade}` }} />
    </span>
  );
}
