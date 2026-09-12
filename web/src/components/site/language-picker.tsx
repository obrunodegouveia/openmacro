"use client";

/**
 * Choose the language the course is in.
 *
 * These are links, not buttons, and that is the whole design. Each language
 * has its own URL — `/learn` and `/pt/learn` — so switching is a navigation,
 * which means the choice can be linked to, shared, bookmarked, and followed by
 * a crawler. Setting client state instead would leave both languages sharing
 * one URL, which is exactly what made the Portuguese course invisible to
 * search engines for as long as it existed.
 *
 * `hrefLang` on each link says the same thing to a crawler that the `<link
 * rel="alternate">` pair in the document head does, from inside the page.
 *
 * Language names are never translated — a picker you cannot read is exactly
 * useless to the person who needs it.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_TAGS } from "@openmacro/core/i18n/locales";

import { useLocale } from "@/components/site/locale-provider";
import { cn } from "@/lib/utils";

/** Strips any locale prefix, leaving the shared route path. */
function basePath(pathname: string): string {
  const stripped = pathname.replace(/^\/pt(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

export function LanguagePicker({ className }: { className?: string }) {
  const { t, locale, available, names } = useLocale();
  const pathname = usePathname();

  if (available.length < 2) return null;

  const base = basePath(pathname ?? "/");

  return (
    <div
      aria-label={t("language.label")}
      className={cn(
        "flex items-center gap-1 rounded-lg border border-hairline p-1",
        className,
      )}
    >
      {available.map((candidate) => {
        const href = candidate === "en" ? base : `/pt${base === "/" ? "" : base}`;
        const current = candidate === locale;
        return (
          <Link
            key={candidate}
            href={href}
            hrefLang={LOCALE_TAGS[candidate]}
            aria-current={current ? "true" : undefined}
            aria-label={t("language.choose", { name: names[candidate] })}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-bold transition-colors",
              current ? "bg-mint/15 text-mint-bright" : "text-ink-faint hover:text-ink",
            )}
          >
            {names[candidate]}
          </Link>
        );
      })}
    </div>
  );
}
