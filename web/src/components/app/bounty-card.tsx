"use client";

import { ArrowRight } from "lucide-react";

import { useLocale } from "@/components/site/locale-provider";
import { localePath } from "@/lib/locale-path";

/**
 * Tells every learner on the dashboard about the 21,000 sats bounty and
 * links to its rules. Same words as the app's Today card
 * (src/components/ui/BountyCard.tsx); remove both together when the bounty
 * ends.
 */
export function BountyCard() {
  const { locale, t } = useLocale();

  return (
    <a
      href={localePath(locale, "/bounty")}
      className="mb-8 flex items-center gap-4 rounded-card border border-[#F7931A]/60 bg-[#F7931A]/[0.06] p-5 hover:border-[#F7931A]"
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F7931A] text-xl font-extrabold text-white"
      >
        ₿
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold uppercase tracking-wider text-ink-faint">
          {t("bounty.card.eyebrow")}
        </span>
        <span className="block font-display text-lg font-extrabold tracking-tight">
          {t("bounty.card.title")}
        </span>
        <span className="mt-1 block text-sm text-ink-muted">{t("bounty.card.body")}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-ink-muted" aria-hidden />
    </a>
  );
}
