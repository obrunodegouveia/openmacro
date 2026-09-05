"use client";

import { motion } from "motion/react";
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

const MECHANISMS = [
  {
    icon: <Target className="size-5" aria-hidden />,
    tone: "azure" as const,
    title: "Proof of Competency",
    body: "Adaptive micro-tests and T-account scenarios with randomised parameters. The same operation comes back with different counterparties and amounts, so memorising an answer key gets you nowhere.",
  },
  {
    icon: <Coins className="size-5" aria-hidden />,
    tone: "gold" as const,
    title: "MacroXP & MintBucks",
    body: "Points earned only through verified mastery, daily analysis streaks and module completions. Non-inflationary by design: there is no way to buy them, farm them, or trade them.",
  },
  {
    icon: <Award className="size-5" aria-hidden />,
    tone: "mint" as const,
    title: "Tiered Credentials",
    body: "Cryptographic attestations for a demonstrated skill — “Open-Market Operations Specialist”, “Balance Sheet Mechanic: ECB Architecture”. Verifiable by anyone, issued only against a passed assessment.",
  },
  {
    icon: <Gift className="size-5" aria-hidden />,
    tone: "violet" as const,
    title: "Prize Pools & Bounties",
    body: "Sponsored by parents, educators and the community: books (Mehrling, Bagehot, Stigum), hardware, or family-set privileges. Sponsors fund and award them directly — never the platform.",
  },
];

const TONES = {
  azure: "border-azure/30 bg-azure/10 text-[#8ab0ff]",
  gold: "border-gold/30 bg-gold/10 text-gold",
  mint: "border-mint/30 bg-mint/10 text-mint-bright",
  violet: "border-violet/30 bg-violet/10 text-violet",
} as const;

export function Rewards() {
  return (
    <Section id="rewards">
      <SectionHeading
        overline="The incentive loop"
        title={
          <>
            The knowledge is free.
            <br className="hidden sm:block" /> The{" "}
            <span className="text-gradient">retention</span> is the product.
          </>
        }
        lede="Every central bank publishes its balance sheet. Almost nobody reads one twice. Rewards exist to fix that, and they are earned by demonstrating the mechanism — never by showing up."
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
                  {mechanism.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {mechanism.body}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* The line we will not cross ---------------------------------- */}
      <div className="mt-6 rounded-card border border-mint/25 bg-mint/[0.06] p-6">
        <h3 className="flex items-center gap-2 font-display text-base font-extrabold">
          <ShieldCheck className="size-5 text-mint-bright" aria-hidden />
          What points are not
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          MacroXP and MintBucks are a learning score. They are not currency, not
          a token you can buy or sell, and there is no exchange, wallet or
          cash-out path anywhere in the product. Prize pools are funded and
          awarded by the sponsor who created them — a parent, a school, a
          community — and OpenMacro never takes custody of the money. Nothing
          here is a wager, and nothing costs a learner anything to enter.
        </p>
      </div>
    </Section>
  );
}
