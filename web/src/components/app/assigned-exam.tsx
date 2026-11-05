"use client";

import * as React from "react";
import type { ChallengeAnswer } from "@openmacro/core/engine/answers";
import {
  assembleAssignedExam,
  assignedExamSubmission,
  type AssignedExam,
} from "@openmacro/core/engine/assignedExam";
import { gradeExam, type ExamResult } from "@openmacro/core/engine/exam";

import { ChallengeView } from "@/components/challenges/challenge-view";
import { LocaleLink } from "@/components/site/locale-link";
import { LocaleProvider, useLocale } from "@/components/site/locale-provider";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { useAssignedExam } from "@/lib/use-assigned-exam";
import { useProgressSnapshot } from "@/lib/use-progress";
import type { ProgressSnapshot } from "@/lib/progress";

/**
 * ============================================================================
 * An exam a teacher has assigned to this learner
 * ============================================================================
 *
 * The opposite of a lesson: no hearts, no re-queue, and no verdict until the
 * end, so nothing on screen teaches the answer to the next question. Leaving
 * half way saves nothing and starts the same paper again next time.
 *
 * The whole screen is in the language of the assignment, whatever the site is
 * set to. The app's twin is `app/exam.tsx`.
 */
export function AssignedExamScreen() {
  const { exam, loading } = useAssignedExam();
  const { snapshot, state, restoring } = useProgressSnapshot();
  // Held once found: handing the exam in makes the next read come back empty,
  // and that must not replace the results the learner is reading.
  const [held, setHeld] = React.useState<AssignedExam | null>(null);
  if (exam && !held) setHeld(exam);

  if (!held && (loading || restoring)) return null;
  if (!held) return <Nothing kind="none" />;
  if (state === "loading" || restoring || !snapshot) return null;

  return (
    <LocaleProvider initialLocale={held.locale}>
      <ExamRunner exam={held} snapshot={snapshot} />
    </LocaleProvider>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      {children}
    </main>
  );
}

function Nothing({ kind }: { kind: "none" | "empty" }) {
  const { t } = useLocale();
  return (
    <Shell>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">{t(`exam.${kind}.title`)}</h1>
      <p className="text-ink-muted">{t(`exam.${kind}.body`)}</p>
      <Button variant="outline" asChild>
        <LocaleLink href="/dashboard">{t("exam.close")}</LocaleLink>
      </Button>
    </Shell>
  );
}

function ExamRunner({ exam, snapshot }: { exam: AssignedExam; snapshot: ProgressSnapshot }) {
  const { t, modules, lessonById } = useLocale();

  // Drawn once: finishing a lesson elsewhere must not change a paper in hand.
  const [paper] = React.useState(
    () =>
      assembleAssignedExam(
        modules,
        (lessonId) => (snapshot.progress[lessonId]?.completions ?? 0) > 0,
        exam,
      ).exam,
  );
  const lookup = (item: { lessonId: string; challengeId: string }) =>
    lessonById(item.lessonId)?.challenges.find((entry) => entry.id === item.challengeId);

  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, ChallengeAnswer>>({});
  const [draft, setDraft] = React.useState<ChallengeAnswer | null>(null);
  const [result, setResult] = React.useState<ExamResult | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  async function send(graded: ExamResult) {
    setSaving(true);
    setFailed(false);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("No account backend.");
      const { error } = await supabase.rpc(
        "submit_assigned_exam",
        assignedExamSubmission(exam.id, graded),
      );
      if (error) throw error;
      setSaved(true);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  if (paper.items.length === 0) {
    return <Nothing kind="empty" />;
  }

  if (result) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {t("exam.result.title")}
        </h1>
        <p className="font-display text-xl font-extrabold">
          {t("exam.result.score", { correct: result.correct, asked: result.asked })}
        </p>
        <ul className="grid gap-2">
          {result.byLevel
            .filter((level) => level.asked > 0)
            .map((level) => (
              <li key={level.level} className="flex justify-between gap-4">
                <span>{t(`level.${level.level}`)}</span>
                <span className="text-ink-muted">
                  {t("exam.result.score", { correct: level.correct, asked: level.asked })}
                </span>
              </li>
            ))}
        </ul>
        {result.weakModules.length > 0 ? (
          <section className="grid gap-1">
            <h2 className="font-display text-lg font-extrabold">{t("exam.result.weak")}</h2>
            {result.weakModules.map((id) => (
              <p key={id} className="text-ink-muted">
                {modules.find((module) => module.id === id)?.title ?? id}
              </p>
            ))}
          </section>
        ) : null}
        <p role="status" className="text-sm text-ink-muted">
          {saved
            ? t("exam.result.sent")
            : failed
              ? t("exam.result.failed")
              : t("exam.result.sending")}
        </p>
        {failed ? (
          <Button onClick={() => void send(result)} disabled={saving}>
            {t("exam.result.retry")}
          </Button>
        ) : null}
        <Button variant="outline" asChild>
          <LocaleLink href="/dashboard">{t("exam.close")}</LocaleLink>
        </Button>
      </Shell>
    );
  }

  if (!started) {
    return (
      <Shell>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {t("exam.intro.title")}
        </h1>
        <p className="text-ink-muted">{t("exam.intro.body", { count: paper.items.length })}</p>
        <Button size="lg" onClick={() => setStarted(true)}>
          {t("exam.start")}
        </Button>
        <Button variant="ghost" asChild>
          <LocaleLink href="/dashboard">{t("exam.later")}</LocaleLink>
        </Button>
      </Shell>
    );
  }

  const item = paper.items[index];
  const challenge = item ? lookup(item) : undefined;
  const last = index === paper.items.length - 1;

  function next() {
    if (!item || !draft) return;
    const nextAnswers = { ...answers, [item.id]: draft };
    setAnswers(nextAnswers);
    setDraft(null);
    if (!last) {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const graded = gradeExam(paper, nextAnswers, lookup, t);
    setResult(graded);
    void send(graded);
  }

  return (
    <Shell>
      <header className="flex items-center gap-4">
        <LocaleLink href="/dashboard" aria-label={t("exam.exit")} className="text-xl text-ink-faint">
          ✕
        </LocaleLink>
        <h1 className="font-display text-lg font-extrabold">
          {t("exam.question", { number: index + 1, total: paper.items.length })}
        </h1>
      </header>
      {challenge ? (
        <section className="glass rounded-card p-5 sm:p-7">
          <h2 className="mb-5 font-display text-xl font-extrabold leading-snug tracking-tight">
            {challenge.prompt}
          </h2>
          <ChallengeView
            key={item?.id}
            challenge={challenge}
            onAnswerChange={setDraft}
            locked={false}
            result={null}
          />
        </section>
      ) : null}
      <Button size="lg" onClick={next} disabled={!draft}>
        {last ? t("exam.finish") : t("exam.next")}
      </Button>
    </Shell>
  );
}
