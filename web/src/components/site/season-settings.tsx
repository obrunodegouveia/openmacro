"use client";

import { useSeasonDecision, useSeasonPreference } from "@openmacro/seasons/react";
import type { SeasonPreference } from "@openmacro/seasons";
import { useLocale } from "@/components/site/locale-provider";
import { seasonController } from "@/lib/season";
import { cn } from "@/lib/utils";

const OPTIONS: readonly SeasonPreference[] = ["auto", "calm", "off"];

/**
 * The seasonal look switch, in the footer of every page: On, Calm or Off.
 * The same choice as the app's Profile switch (`SeasonToggle`), kept in this
 * browser.
 *
 * Only there while a season is on the calendar; turned off, it stays, so a
 * visitor can turn it back on. The site repaints at once, colours included,
 * because its palette is CSS keyed on an attribute.
 *
 * @return The switch, or nothing on an ordinary day and during prerendering.
 */
export function SeasonSettings() {
  const { t } = useLocale();
  const seasons = seasonController();
  const decision = useSeasonDecision(seasons);
  const preference = useSeasonPreference(seasons);
  if (!seasons || !decision.available) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        role="radiogroup"
        aria-label={t("season.settings.label")}
        title={t("season.settings.hint", { season: t(`season.${decision.available}.name`) })}
        className="inline-flex items-center gap-1 rounded-full border border-hairline p-1"
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
              onClick={() => seasons.setPreference(option)}
              className={cn(
                "min-h-9 rounded-full px-3 text-xs font-bold transition-colors",
                selected ? "bg-veil/10 text-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {t(`season.mode.${option}`)}
            </button>
          );
        })}
      </div>
      {preference === "calm" ? <p className="px-2 text-xs text-ink-faint">{t("season.mode.calmHint")}</p> : null}
    </div>
  );
}
