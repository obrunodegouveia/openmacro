"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { MODULES } from "@openmacro/core/content";
import { GoogleSignIn } from "@/components/site/google-sign-in";
import { Button } from "@/components/ui/button";
import { CentralBankBalanceSheet } from "@/components/site/balance-sheet";
import { useAuth } from "@/components/site/auth-provider";

/**
 * Hero.
 *
 * The headline is the Largest Contentful Paint element, so it carries no
 * entrance animation and no `opacity: 0` starting state — it is painted with
 * the first frame of static HTML. Everything around it fades in through CSS
 * (`.rise`), which also runs at paint time rather than waiting for hydration.
 *
 * Framer Motion is reserved for the balance-sheet widget, which is below the
 * fold on a phone and genuinely interactive.
 */
/** Read from the course itself, so the headline number cannot go stale. */
const LESSON_COUNT = MODULES.reduce((sum, module) => sum + module.lessons.length, 0);

/**
 * The single call to action.
 *
 * Signing in is the front door: it is what starts a streak and what makes
 * progress survive closing the tab. But the site's whole promise — and its
 * COPPA notice — is that no account is required to learn, so the way past it
 * stays one line below rather than disappearing.
 *
 * Degrades to a plain link when the build has no account backend, which is the
 * default for a fork.
 */
function StartCta() {
  const { enabled, learner } = useAuth();

  const browse = (
    <p className="mt-4 text-sm text-ink-faint">
      Or{" "}
      <Link
        href="/learn"
        className="text-ink-muted underline underline-offset-4 hover:text-mint-bright"
      >
        browse all {LESSON_COUNT} lessons
      </Link>{" "}
      — no account needed.
    </p>
  );

  if (!enabled) {
    return (
      <div>
        <Button asChild size="lg">
          <Link href="/learn">
            Start learning
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }

  if (learner) {
    return (
      <div>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Continue learning
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
        {browse}
      </div>
    );
  }

  return (
    <div>
      <GoogleSignIn
        redirectTo="/dashboard"
        label="Sign in to start learning"
      />
      {browse}
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3.5 py-1.5 text-xs font-bold text-mint-bright">
              <Sparkles className="size-3.5" aria-hidden />
              Open source · MIT licensed · Built with educators
            </span>
          </div>

          {/* LCP element — no animation, painted immediately. */}
          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Understand the <span className="text-gradient">Machine</span> Behind
            Money.
          </h1>

          <p className="rise rise-1 mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-muted">
            The open-source, gamified platform teaching macroeconomics, central
            banking, and credit creation — one balance sheet entry at a time.
          </p>

          <div className="rise rise-2 mt-9">
            <StartCta />
          </div>

          <dl className="rise rise-3 mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-hairline pt-7">
            {[
              { value: "4", label: "Balance sheet tiers" },
              { value: String(LESSON_COUNT), label: "Lessons live" },
              { value: "100%", label: "Free, forever" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold text-ink">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-ink-faint">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <CentralBankBalanceSheet />
        </motion.div>
      </div>
    </section>
  );
}
