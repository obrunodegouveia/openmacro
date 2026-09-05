"use client";

import * as React from "react";
import { getLessonById } from "@openmacro/core/content";
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
const DEMO_CHALLENGE = (() => {
  const lesson = getLessonById("qe-primary-dealer");
  return lesson?.challenges.find(
    (challenge): challenge is TAccountFlowChallenge =>
      challenge.type === "t_account_flow",
  );
})();

export function Demo() {
  const [answer, setAnswer] = React.useState<ChallengeAnswer | null>(null);
  const [result, setResult] = React.useState<GradeResult | null>(null);

  if (!DEMO_CHALLENGE) return null;

  return (
    <Section id="demo" className="scroll-mt-20">
      <SectionHeading
        overline="Playable teaser"
        title={
          <>
            Don&rsquo;t read about QE.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">Post the entries.</span>
          </>
        }
        lede="This is a real lesson step, graded by the same engine the app uses: place each entry on the right sheet and the right side, then find out what actually moved. No sign-up, no download."
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
                ? "That is the operation."
                : "Not quite — try the full lesson."
              : "Place every entry, then check."}
          </p>
          {result ? (
            <Button variant="outline" onClick={() => { setResult(null); setAnswer(null); }}>
              Reset
            </Button>
          ) : (
            <Button
              disabled={!answer}
              onClick={() => answer && setResult(gradeChallenge(DEMO_CHALLENGE, answer))}
            >
              Check entries
            </Button>
          )}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-ink-faint">
        Simplified in one respect: the dealer&rsquo;s own sheet is left off screen to
        keep two T-accounts on a phone. In the app the dealer appears as a third
        entity, and the same operation is replayed with randomised counterparties
        and amounts so the answer cannot be memorised.
      </p>
    </Section>
  );
}
