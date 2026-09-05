import * as React from "react";
import { cn } from "@/lib/utils";

const TONES = {
  mint: "border-mint/30 bg-mint/10 text-mint-bright",
  gold: "border-gold/30 bg-gold/10 text-gold",
  azure: "border-azure/30 bg-azure/10 text-[#8ab0ff]",
  violet: "border-violet/30 bg-violet/10 text-violet",
  neutral: "border-hairline bg-white/5 text-ink-muted",
} as const;

export type BadgeTone = keyof typeof TONES;

/** Small pill used for statuses, module tags and the licence chip. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
