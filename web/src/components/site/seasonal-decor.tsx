"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { useSeasonDecision } from "@openmacro/seasons/react";
import { SEASON_PACKS, type SeasonId, type SeasonPack } from "@openmacro/core/season";
import { SEASON_ART } from "@/components/site/seasons/art";
import { seasonController, startSeasonRuntime } from "@/lib/season";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/site/locale-provider";

/**
 * Seasonal decorations: what the site hangs up when a season is on.
 *
 * Nothing in this file names a season. The palette has already changed
 * before first paint (see `SEASON_SCRIPT`); what is here reads the live
 * season and draws its pack, `SEASON_PACKS` in `@openmacro/core/season`, the
 * same data the app draws.
 *
 * Light by construction. This file is the only part every page loads, and it
 * holds no artwork: the layer that draws any season (`seasons/layer.tsx`),
 * a season's own artwork (`seasons/art.ts`) and the effects
 * (`seasons/fx.tsx`), with their CSS, are separate chunks fetched only while
 * a season is on, and each visual's CSS only when it is drawn. With the
 * seasons off nothing is downloaded, and prerendered HTML has no
 * decorations at all, so hydration adds them without a mismatch.
 *
 * Everything is `aria-hidden` and ignores the pointer, except the toy. The
 * calm look and reduced motion leave out whatever only makes sense moving.
 */

/** The season on screen right now, with everything needed to draw it. */
export interface ActiveSeason {
  readonly id: SeasonId;
  readonly pack: SeasonPack;
  /** The calm look: colours and still ornaments only. */
  readonly calm: boolean;
  /** Whether anything may move: the full look, and no reduced-motion request. */
  readonly motion: boolean;
}

/**
 * The season to decorate for, live.
 *
 * @return The season, or `null` on the server, during hydration, and on an
 *     ordinary day.
 */
export function useSeason(): ActiveSeason | null {
  const decision = useSeasonDecision(seasonController());
  const reduceMotion = useReducedMotion();
  return React.useMemo(() => {
    if (!decision.season) return null;
    const calm = decision.look === "calm";
    return { id: decision.season, pack: SEASON_PACKS[decision.season], calm, motion: !calm && !reduceMotion };
  }, [decision, reduceMotion]);
}

/** What a season's layer is given. */
export interface LayerProps {
  readonly season: ActiveSeason;
  /**
   * Whether the moving sky (flyers, snow) may cross this page. Not over a
   * lesson, as in the app: snow falling across a question is a distraction,
   * not a decoration.
   */
  readonly sky: boolean;
}

/** The layer that draws any season's pack, loaded only while a season is on. */
const Layer = dynamic(() => import("./seasons/layer").then((m) => m.SeasonLayer), { ssr: false });

const Burst = dynamic(() => import("./seasons/visuals/burst").then((m) => m.Burst), { ssr: false });
const SnowCap = dynamic(() => import("./seasons/visuals/snow-cap").then((m) => m.SnowCap), { ssr: false });
const FrostRim = dynamic(() => import("./seasons/visuals/frost-rim").then((m) => m.FrostRim), { ssr: false });
const Scatter = dynamic(() => import("./seasons/visuals/scatter").then((m) => m.Scatter), { ssr: false });
const CandleGlow = dynamic(() => import("./seasons/visuals/candle-glow").then((m) => m.CandleGlow), { ssr: false });
const Rain = dynamic(() => import("./seasons/fx").then((m) => m.Rain), { ssr: false });

/**
 * Everything that floats over the page, for whichever season is on, and the
 * runtime that keeps <html> dressed for the live decision. Mounted once, in
 * the root layout.
 *
 * @return The season's layer, or nothing on an ordinary day.
 */
export function SeasonalDecor() {
  const season = useSeason();
  const pathname = usePathname() ?? "";
  React.useEffect(() => startSeasonRuntime(), []);
  // An embedded video is someone else's page; it stays undressed.
  if (!season || /^(\/pt)?\/embed\//.test(pathname)) return null;
  return <Layer season={season} sky={!/^(\/pt)?\/learn\/[^/]+/.test(pathname)} />;
}

/**
 * The row of ornaments sitting on the top edge of the footer: the pack's
 * row, lit ones glowing with the season's candle, or the season's own
 * artwork (Halloween's SVG pumpkins). Place it inside a positioned
 * container.
 *
 * @return The row, or nothing on an ordinary day.
 */
export function SeasonalFooter() {
  const season = useSeason();
  if (!season) return null;
  const Art = SEASON_ART[season.id]?.footer;
  if (Art) return <Art season={season} />;
  const { candle } = season.pack.look;
  return (
    <div className="season-patch" aria-hidden>
      {season.pack.footer.map((ornament, i) => {
        const glyph = (
          <span key={i} className="season-ornament" data-size={ornament.size} data-lift={ornament.lift || undefined}>
            {ornament.emoji}
          </span>
        );
        return candle && ornament.lit ? (
          <CandleGlow key={i} color={candle.color} flickerMs={candle.flickerMs} offset={(i * 0.37) % 1} animate={season.motion}>
            {glyph}
          </CandleGlow>
        ) : (
          glyph
        );
      })}
    </div>
  );
}

/**
 * Shows the season's emoji in place of an ordinary icon: the streak flame
 * becomes a jack-o'-lantern or a tree, the lesson-complete party popper a
 * pumpkin or a present. The same swap as `useSeasonalEmoji` in the app.
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
  role: keyof SeasonPack["emoji"];
  className?: string;
  children: React.ReactNode;
}) {
  const season = useSeason();
  if (!season) return <>{children}</>;
  return (
    <span className={cn("leading-none", className)} aria-hidden>
      {season.pack.emoji[role]}
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
  if (!season) return null;
  return (
    <p className="mt-2 inline-flex w-fit items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-extrabold text-gold">
      {t(season.pack.strings.greeting)}
    </p>
  );
}

/**
 * A burst of the season's particles over a soft ring of light, thrown up
 * once when it mounts. Used on a correct answer. Place it inside a positioned container.
 *
 * @return The burst, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalBurst() {
  const season = useSeason();
  if (!season?.motion) return null;
  const { burst } = season.pack.look;
  return <Burst particles={season.pack.particles} ring={burst.ring} gravity={burst.gravity} spin={burst.spin} />;
}

/**
 * Whatever the season has settled on the top edge of a card: snow, frost,
 * fallen leaves. The app puts it on Today's hero card, the site on the
 * dashboard's "what next" card. Place it inside the card, which must be
 * positioned and not clip.
 *
 * @return The edge, or nothing on an ordinary day or for a season without one.
 */
export function SeasonalCardEdge() {
  const season = useSeason();
  const edge = season?.pack.look.edge;
  if (!season || !edge) return null;
  if (edge.kind === "frost") return <FrostRim color={edge.color} animate={season.motion} />;
  if (edge.kind === "scatter") return <Scatter emoji={edge.emoji} />;
  return <SnowCap color={edge.color} shade={season.pack.look.motes.colors[0]?.light ?? season.pack.palette.light.inkFaint} />;
}

/**
 * The season's particles drifting down the window, for a finished lesson.
 *
 * @return The rain, or nothing on an ordinary day or when nothing may move.
 */
export function SeasonalRain() {
  const season = useSeason();
  if (!season?.motion) return null;
  return <Rain particles={season.pack.particles} />;
}
