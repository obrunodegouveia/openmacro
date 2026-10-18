"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useSeasonDecision, useSeasonPreference } from "@openmacro/seasons/react";
import type { SeasonPreference } from "@openmacro/seasons";
import { useLocale } from "@/components/site/locale-provider";
import { seasonController } from "@/lib/season";
import { cn } from "@/lib/utils";
import { SeasonalBurst } from "@/components/site/seasonal-decor";

const OPTIONS: readonly SeasonPreference[] = ["auto", "calm", "off"];

/**
 * Applies a change of look as a cross-fade of the whole page, where the
 * browser has the View Transitions API and motion is welcome: the palette,
 * the sky and the ornaments dissolve into the new look together instead of
 * snapping. Elsewhere, and under reduced motion, it simply changes.
 *
 * The change runs inside `flushSync`, so React has painted the new look by
 * the time the browser takes its "after" snapshot.
 *
 * @param change The change.
 */
function withTransition(change: () => void): void {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still || typeof document.startViewTransition !== "function") {
    change();
    return;
  }
  document.documentElement.setAttribute("data-season-switching", "");
  const transition = document.startViewTransition(() => flushSync(change));
  void transition.finished.finally(() => document.documentElement.removeAttribute("data-season-switching"));
}

/**
 * The seasonal look switch, in the footer of every page: On, Calm or Off.
 * The same choice as the app's Profile switch (`SeasonToggle`), kept in this
 * browser.
 *
 * Only there while a season is on the calendar; turned off, it stays, so a
 * visitor can turn it back on. The site repaints at once, colours included,
 * because its palette is CSS keyed on an attribute, and cross-fades into it
 * where the browser can (`withTransition`). Turning the season on throws a
 * burst of it out of the switch, as in the app.
 *
 * @return The switch, or nothing on an ordinary day and during prerendering.
 */
export function SeasonSettings() {
  const { t } = useLocale();
  const seasons = seasonController();
  const decision = useSeasonDecision(seasons);
  const preference = useSeasonPreference(seasons);
  // Counts each time the season is turned on, so every one gets a burst.
  const [cheer, setCheer] = React.useState(0);
  if (!seasons || !decision.available) return null;

  const choose = (option: SeasonPreference) => {
    if (option === "auto" && preference !== "auto") setCheer((n) => n + 1);
    withTransition(() => seasons.setPreference(option));
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        role="radiogroup"
        aria-label={t("season.settings.label")}
        title={t("season.settings.hint", { season: t(`season.${decision.available}.name`) })}
        className="relative inline-flex items-center gap-1 rounded-full border border-hairline p-1"
      >
        <span className="px-2 text-xs font-extrabold text-ink-faint">{t("season.settings.label")}</span>
        {OPTIONS.map((option) => {
          const selected = option === preference;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(option)}
              className={cn(
                "relative min-h-9 rounded-full px-3 text-xs font-bold transition-colors",
                selected ? "bg-veil/10 text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {t(`season.mode.${option}`)}
              {option === "auto" && cheer > 0 ? (
                <span className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
                  <SeasonalBurst key={cheer} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {preference === "calm" ? <p className="px-2 text-xs text-ink-faint">{t("season.mode.calmHint")}</p> : null}
    </div>
  );
}
