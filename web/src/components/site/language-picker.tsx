"use client";

/**
 * ============================================================================
 * Choose the language the site is in
 * ============================================================================
 *
 * These are links, not buttons, and that is the whole design. Each language has
 * its own URL — `/learn` and `/pt/learn` — so switching is a navigation, which
 * means the choice can be linked to, shared, bookmarked and followed by a
 * crawler. Setting client state instead would leave both languages sharing one
 * URL, which is exactly what made the Portuguese course invisible to search
 * engines for as long as it existed.
 *
 * `hrefLang` on each link tells a crawler from inside the page what the
 * `<link rel="alternate">` pair in the head says from outside it.
 *
 * ---------------------------------------------------------------------------
 * WHY A PLAIN <a> AND NOT next/link
 * ---------------------------------------------------------------------------
 *
 * Because a client-side navigation cannot change the language, and silently
 * half-changed it. `LocaleProvider` is handed its locale by the root layout,
 * and a root layout does not re-render on a soft navigation — while the
 * middleware *rewrites* `/pt/x` to `/x`, so both URLs are the same route as far
 * as the router is concerned. Tapping Português therefore swapped the URL to
 * `/pt` and left every client component holding the previous locale: the
 * headline stayed English, `<html lang>` stayed `en`, and the picker went on
 * highlighting English — a switcher that appears not to work, sitting next to
 * text that did not change.
 *
 * Opting out of the router fixes it at the root rather than patching the
 * symptom, and it is the more honest primitive anyway. Changing language
 * changes the document's language, every string in it, and its canonical URL.
 * That is a new document, not a transition within one, and it costs a single
 * request to get unambiguously right.
 *
 * Language names are never translated — a picker you cannot read is exactly
 * useless to the person who needs it.
 *
 * ---------------------------------------------------------------------------
 * WHY THERE ARE TWO LAYOUTS
 * ---------------------------------------------------------------------------
 *
 * This began as one compact control written for the desktop bar and dropped
 * into the mobile menu unchanged, where it failed three ways at once.
 *
 * It was unreachable. It shared a single non-wrapping flex row with the GitHub
 * button (`flex-1`) and the account chip (up to 10rem of name), so on a phone
 * it was pushed past the right edge — present in the DOM, impossible to tap.
 *
 * It was too small to hit. `text-xs` with `py-1` is a target around 24px tall,
 * against the 44px both Apple and Google ask for. A control you have to aim at
 * reads as broken when you miss it.
 *
 * And it left the menu open, because switching language was a soft navigation
 * that did not replace the document. That turned out to be the deeper of the two
 * problems and is dealt with above: the whole document reloads now, so the sheet
 * goes with it.
 *
 * So: `inline` for a horizontal bar with room, `block` for a full-width row in
 * a narrow menu. Same links, same semantics, different geometry.
 */

import { usePathname } from "next/navigation";
import { LOCALE_TAGS } from "@openmacro/core/i18n/locales";

import { useLocale } from "@/components/site/locale-provider";
import { localePath, stripLocale } from "@/lib/locale-path";
import { cn } from "@/lib/utils";

export function LanguagePicker({
  className,
  layout = "inline",
}: {
  className?: string;
  /** `block` fills its container and labels itself. For narrow menus. */
  layout?: "inline" | "block";
}) {
  const { t, locale, available, names } = useLocale();
  const pathname = usePathname();

  if (available.length < 2) return null;

  const base = stripLocale(pathname ?? "/");
  const block = layout === "block";

  const options = available.map((candidate) => {
    const current = candidate === locale;
    return (
      <a
        key={candidate}
        href={localePath(candidate, base)}
        hrefLang={LOCALE_TAGS[candidate]}
        aria-current={current ? "true" : undefined}
        aria-label={t("language.choose", { name: names[candidate] })}
        className={cn(
          "flex items-center justify-center rounded-md font-bold transition-colors",
          // 44px in the menu, 36px in the bar — matching the small buttons it
          // sits beside there.
          block ? "min-h-11 text-sm" : "min-h-9 px-3 text-xs",
          current
            ? "bg-mint/15 text-mint-bright"
            : "text-ink-faint hover:bg-white/5 hover:text-ink",
        )}
      >
        {names[candidate]}
      </a>
    );
  });

  if (!block) {
    return (
      <div
        aria-label={t("language.label")}
        className={cn("flex items-center gap-1 rounded-lg border border-hairline p-1", className)}
      >
        {options}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Named out loud here. In the bar the two language names are their own
          label; in a list of menu rows they need saying what they are. */}
      <span className="px-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-faint">
        {t("language.label")}
      </span>
      <div
        aria-label={t("language.label")}
        className="grid grid-cols-2 gap-1 rounded-lg border border-hairline p-1"
      >
        {options}
      </div>
    </div>
  );
}
