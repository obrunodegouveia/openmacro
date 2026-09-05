"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { TIERS, type Tier } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

/**
 * The four balance-sheet tiers — the conceptual spine of the platform.
 *
 * Rendered as a stack from the base of the money hierarchy downward, because
 * that is the actual claim structure: each tier's money is the tier above's
 * liability. Selecting a tier opens its real balance sheet rather than a
 * paragraph about it.
 */

const ACCENT: Record<Tier["accent"], { ring: string; text: string; glow: string }> = {
  azure: { ring: "border-azure/50 bg-azure/10", text: "text-[#8ab0ff]", glow: "shadow-azure/20" },
  emerald: { ring: "border-mint/50 bg-mint/10", text: "text-mint-bright", glow: "shadow-mint/20" },
  violet: { ring: "border-violet/50 bg-violet/10", text: "text-violet", glow: "shadow-violet/20" },
  gold: { ring: "border-gold/50 bg-gold/10", text: "text-gold", glow: "shadow-gold/20" },
};

export function Tiers() {
  const [activeId, setActiveId] = React.useState<Tier["id"]>(TIERS[0]!.id);
  const active = TIERS.find((tier) => tier.id === activeId) ?? TIERS[0]!;

  return (
    <Section id="tiers">
      <SectionHeading
        overline="The model"
        title={
          <>
            Four balance sheets,
            <br className="hidden sm:block" /> one{" "}
            <span className="text-gradient">machine</span>.
          </>
        }
        lede="Money is somebody's liability at every level. OpenMacro teaches the whole hierarchy, not a cartoon of the top of it."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Tier stack ------------------------------------------------- */}
        <ol className="flex flex-col gap-3">
          {TIERS.map((tier, index) => {
            const selected = tier.id === active.id;
            const accent = ACCENT[tier.accent];
            return (
              <motion.li
                key={tier.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(tier.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                    selected
                      ? "border-mint/40 bg-white/[0.06]"
                      : "border-hairline bg-white/[0.02] hover:bg-white/[0.05]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-xl border-2 text-xl shadow-lg",
                      accent.ring,
                      accent.glow,
                    )}
                  >
                    {tier.icon}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[0.65rem] font-extrabold uppercase tracking-[0.14em]",
                        accent.text,
                      )}
                    >
                      Tier {tier.index}
                    </span>
                    <span className="block font-display text-sm font-extrabold text-ink">
                      {tier.name}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">
                      {tier.subject}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>

        {/* Selected tier's sheet -------------------------------------- */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="glass rounded-card p-6 sm:p-7"
        >
          <p
            className={cn(
              "text-xs font-extrabold uppercase tracking-[0.14em]",
              ACCENT[active.accent].text,
            )}
          >
            Tier {active.index} · {active.subject}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
            {active.name}
          </h3>
          <p className="mt-2 max-w-xl text-pretty leading-relaxed text-ink-muted">
            {active.premise}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Column title="Assets" hint="What it owns" items={active.assets} />
            <Column title="Liabilities" hint="What it owes" items={active.liabilities} />
          </div>

          <div className="mt-5 border-t border-hairline pt-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
              What you learn to operate
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {active.levers.map((lever) => (
                <li
                  key={lever}
                  className="rounded-lg border border-hairline bg-abyss/60 px-3 py-1.5 text-xs font-bold text-ink-muted"
                >
                  {lever}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function Column({
  title,
  hint,
  items,
}: {
  title: string;
  hint: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-abyss/60 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h4 className="font-display text-xs font-extrabold uppercase tracking-wider">
          {title}
        </h4>
        <span className="text-[0.65rem] font-semibold text-ink-faint">{hint}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-ink-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
