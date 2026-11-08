"use client";

/**
 * The Bitcoin mode switch, in the footer's settings.
 * See `bitcoin-mode.ts`; the app draws the same card in BitcoinModeToggle.tsx.
 */

import { BITCOIN_MODE_MODULES, OPTIONAL_MODULES } from "@openmacro/core/content/optional";

import { useLocale } from "@/components/site/locale-provider";
import { useBitcoinMode } from "@/components/app/bitcoin-mode";
import { cn } from "@/lib/utils";

/** Lessons Bitcoin mode adds, for the hint. */
const LESSONS = OPTIONAL_MODULES.filter((module) => BITCOIN_MODE_MODULES.includes(module.id)).reduce(
  (sum, module) => sum + module.lessons.length,
  0,
);

export function BitcoinModeSwitch() {
  const { t } = useLocale();
  const [on, setOn] = useBitcoinMode();

  return (
    <div
      className={cn(
        "flex max-w-2xl items-center gap-4 rounded-2xl border p-4 transition-colors",
        on ? "border-mint/50 bg-mint/[0.06]" : "border-hairline bg-veil/[0.03]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-[72px] shrink-0 place-items-center rounded-full border font-display text-4xl font-extrabold text-ink",
          on ? "border-mint" : "border-hairline",
        )}
      >
        ₿
      </span>
      <span className="min-w-0 flex-1">
        <span id="bitcoin-mode-label" className="block font-display text-sm font-extrabold text-ink">
          {t("bitcoin.label")}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
          {t("bitcoin.hint", { count: LESSONS })}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="bitcoin-mode-label"
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
