"use client";

import * as React from "react";
import { useSiteText } from "@/lib/use-site-text";
import { useLocale } from "@/components/site/locale-provider";
import { localisedLessonById } from "@openmacro/core/i18n/content";
import type { Locale } from "@openmacro/core/i18n/locales";
import type { TAccountFlowChallenge } from "@openmacro/core/content/schema";
import { gradeChallenge, type GradeResult } from "@openmacro/core/engine/grading";
import type { ChallengeAnswer } from "@openmacro/core/engine/answers";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { TAccountFlowView } from "@/components/challenges/t-account-flow";

/**
 * The playable teaser on the home page.
 *
 * Pulls a real challenge out of the shared content package rather than keeping
 * a marketing copy of one. When the lesson is edited, this changes with it —
 * the previous version was a hand-maintained duplicate that could quietly
 * drift away from the thing it was advertising.
 */
/**
 * The teaser is a real lesson step, so it has to be the *translated* one —
 * a Portuguese landing page that grades you in English is worse than no
 * teaser at all.
 */
function demoChallenge(locale: Locale): TAccountFlowChallenge | undefined {
  const lesson = localisedLessonById(locale, "qe-primary-dealer");
  return lesson?.challenges.find(
    (challenge): challenge is TAccountFlowChallenge =>
      challenge.type === "t_account_flow",
  );
}

export function Demo() {
  const s = useSiteText();
  const { locale } = useLocale();
  const DEMO_CHALLENGE = React.useMemo(() => demoChallenge(locale), [locale]);
  const [answer, setAnswer] = React.useState<ChallengeAnswer | null>(null);
  const [result, setResult] = React.useState<GradeResult | null>(null);

  if (!DEMO_CHALLENGE) return null;

  return (
    <Section id="demo" className="scroll-mt-20">
      <SectionHeading
        overline={s("demo.overline")}
        title={
          <>
            {s("demo.title.lead")}
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">{s("demo.title.emphasis")}</span>
          </>
        }
        lede={s("demo.lede")}
      />

      <div className="mt-12 glass rounded-card p-5 sm:p-7">
        <h3 className="mb-5 font-display text-xl font-extrabold leading-snug tracking-tight">
          {DEMO_CHALLENGE.prompt}
        </h3>

        <TAccountFlowView
          challenge={DEMO_CHALLENGE}
          onAnswerChange={setAnswer}
          locked={Boolean(result)}
          result={result}
        />

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-ink-faint">
            {result
              ? result.correct
                ? s("demo.correct")
                : s("demo.wrong")
              : s("demo.prompt")}
          </p>
          {result ? (
            <Button variant="outline" onClick={() => { setResult(null); setAnswer(null); }}>
              {s("demo.reset")}
            </Button>
          ) : (
            <Button
              disabled={!answer}
              onClick={() => answer && setResult(gradeChallenge(DEMO_CHALLENGE, answer))}
            >
              {s("demo.check")}
            </Button>
          )}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-ink-faint">
        {s("demo.note")}
      </p>
    </Section>
  );
}
