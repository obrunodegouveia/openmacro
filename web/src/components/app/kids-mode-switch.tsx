"use client";

/**
 * The kids mode switch, shown in a module that has a kids path.
 * See `kids-mode.ts`; the app draws the same card in KidsModeToggle.tsx.
 */

import { useLocale } from "@/components/site/locale-provider";
import { CharacterAvatar } from "@/components/challenges/character-avatar";
import { useKidsMode } from "@/components/app/kids-mode";
import { cn } from "@/lib/utils";

export function KidsModeSwitch({ lessons }: { lessons: number }) {
  const { t } = useLocale();
  const [on, setOn] = useKidsMode();

  return (
    <div
      className={cn(
        "mt-4 flex max-w-2xl items-center gap-4 rounded-2xl border p-4 transition-colors",
        on ? "border-mint/50 bg-mint/[0.06]" : "border-hairline bg-veil/[0.03]",
      )}
    >
      <CharacterAvatar character="olivia" expression={on ? "excited" : "happy"} size={72} />
      <span className="min-w-0 flex-1">
        <span id="kids-mode-label" className="block font-display text-sm font-extrabold text-ink">
          {t("kids.label")}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
          {t("kids.hint", { count: lessons })}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="kids-mode-label"
        onClick={() => setOn(!on)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
          on ? "border-mint bg-mint" : "border-hairline bg-veil/10",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0.5 size-[1.375rem] rounded-full bg-white shadow transition-transform",
            on && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
