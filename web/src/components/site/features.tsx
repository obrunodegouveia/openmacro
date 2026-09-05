"use client";

import { motion } from "motion/react";
import {
  GitPullRequest,
  Landmark,
  ShieldCheck,
  Wallet,
  X,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";

/**
 * Features & philosophy. Three claims, each argued rather than asserted:
 * what OpenMacro is not, how it is built, and who it is built with.
 */

const viewport = { once: true, margin: "-80px" } as const;

export function Features() {
  return (
    <Section id="philosophy">
      <SectionHeading
        overline="Features & philosophy"
        title={
          <>
            Personal finance teaches you to budget.
            <br className="hidden sm:block" /> We teach you{" "}
            <span className="text-gradient">the machine</span>.
          </>
        }
        lede="Three convictions shape every lesson we ship."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full p-7">
            <Header
              icon={<Wallet className="size-5" aria-hidden />}
              tone="coral"
              title="Not Another Budgeting App"
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
              Knowing to skip the daily coffee will not tell you why rent
              outran your raise. And &ldquo;money basics&rdquo; courses stop
              exactly where it gets interesting — at the point where you would
              have to open a central bank&rsquo;s balance sheet.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Compare
                tone="muted"
                heading="Budgeting apps ask"
                items={[
                  "Where did my money go?",
                  "Can I afford this?",
                  "How much should I save?",
                ]}
              />
              <Compare
                tone="mint"
                heading="OpenMacro asks"
                items={[
                  "Whose liability is this money?",
                  "What settles when a payment clears?",
                  "Which line on the Fed\u2019s sheet just moved?",
                ]}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Card className="h-full p-7">
            <Header
              icon={<GitPullRequest className="size-5" aria-hidden />}
              tone="mint"
              title="100% Open Source"
            />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Lessons are plain JSON — no React, no build step. An economist
              can write a T-account scenario in a text editor and open a pull
              request from the GitHub web UI.
            </p>
            <ol className="mt-6 flex flex-col gap-3">
              {[
                "Fork the repo",
                "Drop a lesson file into src/content/lessons",
                "CI checks every sheet actually balances",
                "A maintainer reviews the economics",
              ].map((step, index) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-mint/30 bg-mint/10 font-mono text-xs font-bold text-mint-bright">
                    {index + 1}
                  </span>
                  <span className="text-ink-muted">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="lg:col-span-3"
        >
          <Card className="p-7">
            <Header
              icon={<Landmark className="size-5" aria-hidden />}
              tone="gold"
              title="Parent & Educator Led"
            />
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Built with the people who will actually sit next to the learner.
              Classroom and kitchen-table tools are first-class features, not an
              enterprise upsell.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                {
                  title: "Custom tracks",
                  body: "Reorder modules, hide what you have not covered yet, and pin a lesson as this week's homework.",
                },
                {
                  title: "Sponsored prize pools",
                  body: "Fund a bounty for your class or your kid — books, hardware, or privileges. You set the goal and award it directly.",
                },
                {
                  title: "Non-custodial ledger",
                  body: "The reward ledger lives on the learner\u2019s device. No wallet, no real money, nothing to cash out.",
                  icon: <ShieldCheck className="size-4 text-mint-bright" aria-hidden />,
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-hairline bg-abyss/50 p-5"
                >
                  <h4 className="flex items-center gap-2 font-display text-sm font-extrabold">
                    {feature.icon}
                    {feature.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}

function Header({
  icon,
  title,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "mint" | "gold" | "coral";
}) {
  const tones = {
    mint: "border-mint/30 bg-mint/10 text-mint-bright",
    gold: "border-gold/30 bg-gold/10 text-gold",
    coral: "border-coral/30 bg-coral/10 text-coral",
  } as const;

  return (
    <div className="flex items-center gap-3">
      <span className={`grid size-10 place-items-center rounded-xl border ${tones[tone]}`}>
        {icon}
      </span>
      <h3 className="font-display text-xl font-extrabold tracking-tight">
        {title}
      </h3>
    </div>
  );
}

function Compare({
  heading,
  items,
  tone,
}: {
  heading: string;
  items: string[];
  tone: "muted" | "mint";
}) {
  const isMint = tone === "mint";
  return (
    <div
      className={`rounded-2xl border p-5 ${
        isMint ? "border-mint/25 bg-mint/[0.06]" : "border-hairline bg-abyss/50"
      }`}
    >
      <p
        className={`text-xs font-extrabold uppercase tracking-wider ${
          isMint ? "text-mint-bright" : "text-ink-faint"
        }`}
      >
        {heading}
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
            {isMint ? (
              <Check className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
