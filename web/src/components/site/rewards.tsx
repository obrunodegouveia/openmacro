"use client";

import { motion } from "motion/react";
import type { SiteKey } from "@openmacro/core/i18n/site";
import { useSiteText } from "@/lib/use-site-text";
import { Award, Coins, Gift, ShieldCheck, Target } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

/**
 * The incentive loop.
 *
 * The knowledge itself is free — it sits in central bank working papers, FRED
 * series and a handful of textbooks. What OpenMacro adds is curation,
 * verification and retention, so the reward system has to be built on *proof
 * of competency*, not on time spent in the app.
 */

const MECHANISMS: {
  icon: React.ReactNode;
  tone: "azure" | "mint" | "gold" | "violet";
  title: SiteKey;
  body: SiteKey;
}[] = [
  {
    icon: <Target className="size-5" aria-hidden />,
    tone: "azure" as const,
    title: "rewards.competency.title",
    body: "rewards.competency.body",
  },
  {
    icon: <Coins className="size-5" aria-hidden />,
    tone: "gold" as const,
    title: "rewards.points.title",
    body: "rewards.points.body",
  },
  {
    icon: <Award className="size-5" aria-hidden />,
    tone: "mint" as const,
    title: "rewards.credentials.title",
    body: "rewards.credentials.body",
  },
  {
    icon: <Gift className="size-5" aria-hidden />,
    tone: "violet" as const,
    title: "rewards.prizes.title",
    body: "rewards.prizes.body",
  },
];

const TONES = {
  azure: "border-azure/30 bg-azure/10 text-[#8ab0ff]",
  gold: "border-gold/30 bg-gold/10 text-gold",
  mint: "border-mint/30 bg-mint/10 text-mint-bright",
  violet: "border-violet/30 bg-violet/10 text-violet",
} as const;

export function Rewards() {
  const s = useSiteText();
  return (
    <Section id="rewards">
      <SectionHeading
        overline={s("rewards.overline")}
        title={
          <>
            {s("rewards.title.lead")}
            <br className="hidden sm:block" /> {s("rewards.title.mid")}{" "}
            <span className="text-gradient">{s("rewards.title.emphasis")}</span>{" "}
            {s("rewards.title.tail")}
          </>
        }
        lede={s("rewards.lede")}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {MECHANISMS.map((mechanism, index) => (
          <motion.div
            key={mechanism.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <Card className="h-full p-6">
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-10 place-items-center rounded-xl border ${TONES[mechanism.tone]}`}
                >
                  {mechanism.icon}
                </span>
                <h3 className="font-display text-lg font-extrabold tracking-tight">
                  {s(mechanism.title)}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {s(mechanism.body)}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* The line we will not cross ---------------------------------- */}
      <div className="mt-6 rounded-card border border-mint/25 bg-mint/[0.06] p-6">
        <h3 className="flex items-center gap-2 font-display text-base font-extrabold">
          <ShieldCheck className="size-5 text-mint-bright" aria-hidden />
          {s("rewards.notTitle")}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          {s("rewards.notBody")}
        </p>
      </div>
    </Section>
  );
}
