"use client";

import * as React from "react";
import { useState, useSyncExternalStore } from "react";
import type { SeasonId } from "@openmacro/core/season";
import { documentSeason } from "@/lib/season";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/site/locale-provider";

/**
 * Seasonal decorations: what the site hangs up when a season is on.
 *
 * The palette has already changed before first paint (see `SEASON_SCRIPT`);
 * these arrive after hydration, which is fine for ornaments and means an
 * ordinary day ships no markup for them at all.
 *
 * Everything here is `aria-hidden` and ignores the pointer, except the
 * spider, which drops when clicked. Under reduced motion the global rule in
 * globals.css stops every animation, so the bats are not drawn at all rather
 * than parked mid-flight.
 */

/** `data-season` is set once, before hydration, and never changes after. */
const noSubscription = () => () => {};

/**
 * The season on this page, once the page is in the browser.
 *
 * The server snapshot is `null`, so prerendered HTML has no decorations and
 * hydration adds them without a mismatch.
 *
 * @return The season, or `null` on the server and on an ordinary day.
 */
export function useSeason(): SeasonId | null {
  return useSyncExternalStore(noSubscription, documentSeason, () => null);
}

/** The silk colour; set per theme as `--season-web` in globals.css. */
const SILK = "var(--season-web)";

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
    <svg
      viewBox="0 0 164 164"
      className="season-cobweb"
      data-side={side}
      fill="none"
      stroke={SILK}
      strokeWidth={1.3}
      strokeLinecap="round"
    >
      <path d={WEB_PATH} />
    </svg>
  );
}

/**
 * A spider on a thread from the right-hand cobweb. Clicking it drops it most
 * of the way down the window, and it climbs back up.
 *
 * It stays a `div` with a click handler, not a button, on purpose: it is an
 * ornament with no function, hidden from assistive technology, and a button
 * would be one more tab stop on every page that does nothing.
 *
 * @return The spider.
 */
function Spider() {
  const [dropping, setDropping] = useState(false);

  return (
    <div className="season-spider" data-dropping={dropping || undefined}>
      <div
        className="season-spider-body"
        onClick={() => setDropping(true)}
        onAnimationEnd={(event) => {
          if (event.animationName === "season-spider-drop") setDropping(false);
        }}
      >
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
      </div>
    </div>
  );
}

/**
 * One bat, crossing the window on a long loop with its wings flapping.
 *
 * @param props.index Which of the bats, for its lane and its start time.
 * @return The bat.
 */
function Bat({ index }: { index: number }) {
  return (
    <div className="season-bat" data-index={index}>
      <svg viewBox="0 0 100 40" className="season-bat-wings">
        <path
          fill="currentColor"
          d="M50 14L46 6L45 13C38 10 22 3 2 7C10 11 12 17 12 23C16 19 22 19 26 24C29 20 34 20 38 26C40 23 44 23 46 29L50 35L54 29C56 23 60 23 62 26C66 20 71 20 74 24C78 19 84 19 88 23C88 17 90 11 98 7C78 3 62 10 55 13L54 6Z"
        />
      </svg>
    </div>
  );
}

/**
 * Everything that floats over the page: two cobwebs, the spider and three
 * bats. Mounted once, in the root layout.
 *
 * @return The decorations, or nothing on an ordinary day.
 */
export function SeasonalDecor() {
  const season = useSeason();
  if (season !== "halloween") return null;

  return (
    <div className="season-layer" aria-hidden>
      <Cobweb side="left" />
      <Cobweb side="right" />
      <Spider />
      {[0, 1, 2].map((index) => (
        <Bat key={index} index={index} />
      ))}
    </div>
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

/**
 * Three pumpkins sitting on the top edge of the footer. Place it inside a
 * positioned container.
 *
 * @return The pumpkins, or nothing on an ordinary day.
 */
export function SeasonalPumpkins() {
  const season = useSeason();
  if (season !== "halloween") return null;

  return (
    <div className="season-patch" aria-hidden>
      <Pumpkin size={44} />
      <Pumpkin size={64} />
      <Pumpkin size={38} />
    </div>
  );
}

/** The emoji a season swaps in for the site's own icons, by role. */
const SEASON_EMOJI = {
  halloween: { streak: "🎃", complete: "🎃", perfect: "🧙" },
} as const;

/**
 * Shows a seasonal emoji in place of an ordinary icon: the streak flame
 * becomes a jack-o'-lantern for Halloween, the lesson-complete party popper a
 * pumpkin. The same swap as `seasonalEmoji` in the app.
 *
 * @param props.role Which icon this is.
 * @param props.className Classes for the emoji, sized like the icon.
 * @param props.children The ordinary icon, shown on an ordinary day.
 * @return The emoji in season, otherwise the icon.
 */
export function SeasonalIcon({
  role,
  className,
  children,
}: {
  role: keyof (typeof SEASON_EMOJI)["halloween"];
  className?: string;
  children: React.ReactNode;
}) {
  const season = useSeason();
  if (season !== "halloween") return <>{children}</>;
  return (
    <span className={cn("leading-none", className)} aria-hidden>
      {SEASON_EMOJI.halloween[role]}
    </span>
  );
}

/**
 * A small greeting pill, "🎃 Happy Halloween!". Text, so it is read aloud.
 *
 * @return The pill, or nothing on an ordinary day.
 */
export function SeasonalGreeting() {
  const season = useSeason();
  const { t } = useLocale();
  if (season !== "halloween") return null;
  return (
    <p className="mt-2 inline-flex w-fit items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-extrabold text-gold">
      {t("season.halloween.greeting")}
    </p>
  );
}

/** What a burst or a rain is made of. Same set as the app. */
const PARTICLES = ["🎃", "🦇", "👻", "🍬", "🎃", "🕷️", "🍭", "👻"];

/**
 * A burst of pumpkins, bats and ghosts, thrown up once when it mounts. Used
 * on a correct answer. Place it inside a positioned container.
 *
 * @return The burst, or nothing on an ordinary day.
 */
export function SeasonalBurst() {
  const season = useSeason();
  if (season !== "halloween") return null;
  return (
    <div className="season-burst" aria-hidden>
      {PARTICLES.map((emoji, index) => {
        // Fanned over the upper half-circle, alternating near and far.
        const angle = Math.PI * (0.12 + (0.76 * index) / (PARTICLES.length - 1));
        const reach = index % 2 === 0 ? 130 : 88;
        return (
          <span
            key={index}
            style={
              {
                "--dx": `${(-Math.cos(angle) * reach).toFixed(0)}px`,
                "--dy": `${(-Math.sin(angle) * reach).toFixed(0)}px`,
                "--rot": `${index % 2 ? 40 : -40}deg`,
                animationDelay: `${index * 25}ms`,
              } as React.CSSProperties
            }
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Pumpkins, sweets and ghosts drifting down the window, for a finished
 * lesson.
 *
 * @return The rain, or nothing on an ordinary day.
 */
export function SeasonalRain() {
  const season = useSeason();
  if (season !== "halloween") return null;
  return (
    <div className="season-rain" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          style={{
            // Spread evenly, nudged so the columns don't line up.
            left: `${((i + 0.5) / 16) * 100 + (((i * 37) % 7) - 3)}%`,
            animationDelay: `${(i * 613) % 4000}ms`,
            animationDuration: `${5200 + ((i * 1337) % 3000)}ms`,
          }}
        >
          {PARTICLES[i % PARTICLES.length]}
        </span>
      ))}
    </div>
  );
}
