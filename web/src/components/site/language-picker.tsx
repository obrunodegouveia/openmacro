"use client";

/**
 * Choose the language the course is in.
 *
 * A client island inside the server-rendered footer. It renders with English
 * selected through hydration and re-renders once the provider's store reports
 * the real preference — one commit later, and correct from then on.
 *
 * Language names are never translated — a picker you cannot read is exactly
 * useless to the person who needs it.
 */

import { useLocale } from "@/components/site/locale-provider";
import { cn } from "@/lib/utils";

export function LanguagePicker() {
  const { t, locale, setLocale, available, names } = useLocale();

  if (available.length < 2) return null;

  return (
    <div
      role="radiogroup"
      aria-label={t("language.label")}
      className="flex items-center gap-1 rounded-lg border border-hairline p-1"
    >
      {available.map((candidate) => (
        <button
          key={candidate}
          type="button"
          role="radio"
          aria-checked={candidate === locale}
          aria-label={t("language.choose", { name: names[candidate] })}
          onClick={() => setLocale(candidate)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-bold transition-colors",
            candidate === locale
              ? "bg-mint/15 text-mint-bright"
              : "text-ink-faint hover:text-ink",
          )}
        >
          {names[candidate]}
        </button>
      ))}
    </div>
  );
}
