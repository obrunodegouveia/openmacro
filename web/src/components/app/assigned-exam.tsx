"use client";

import * as React from "react";
import type { ChallengeAnswer } from "@openmacro/core/engine/answers";
import {
  EXAM_SPEED_BONUS,
  examPassed,
  assembleAssignedExam,
  assignedExamSubmission,
  examStartFromReply,
  examStudyLessonIds,
  examStudyPlan,
  examTimingFromReply,
  formatExamClock,
  questionSecondsLeft,
  type AssignedExam,
  type ExamTiming,
  type StudyPlan,
} from "@openmacro/core/engine/assignedExam";
import { gradeExam, type ExamResult } from "@openmacro/core/engine/exam";
import { lessonVideoKey } from "@openmacro/core/engine/videoProgress";

import { ChallengeView } from "@/components/challenges/challenge-view";
import { LocaleLink } from "@/components/site/locale-link";
import { LocaleProvider, useLocale } from "@/components/site/locale-provider";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { useAssignedExam } from "@/lib/use-assigned-exam";
import { useVideoProgress } from "@/lib/use-video-progress";
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
 *
 * The clock is the database's (`supabase/migrations/0010_exam_timer.sql`).
 * The one on screen counts on from the seconds the server reported at Start,
 * so a computer whose clock is wrong still shows the right time.
 *
 * Leaving counts: the tab being hidden mid-exam (another tab, another app,
 * a minimised window) is reported when the learner comes back
 * (`leave_assigned_exam`), and costs the speed bonus. The screen is kept
 * awake where the browser allows it, so a phone locking itself while the
 * learner thinks is not mistaken for leaving.
 *
 * A teacher can give each question a time limit (`seconds_per_question`,
 * migration 0012). The countdown is `questionSecondsLeft` from core, so this
 * screen and the app end a question at the same moment: the exam moves on
 * with the answer chosen so far, or with none, which counts as wrong.
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
  const watched = useVideoProgress(examStudyLessonIds(exam).map(lessonVideoKey));
  const plan = examStudyPlan(
    modules,
    exam,
    (lessonId) => snapshot.progress[lessonId]?.lastCompletedAt,
    (lessonId) => watched.get(lessonVideoKey(lessonId))?.share ?? null,
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
  const [clock, setClock] = React.useState<{ seconds: number; at: number } | null>(null);
  const [timing, setTiming] = React.useState<ExamTiming | null>(null);
  const [starting, setStarting] = React.useState(false);
  const [leaves, setLeaves] = React.useState(0);
  // When the current question appeared, for the limit per question.
  const [questionAt, setQuestionAt] = React.useState(0);
  const [timedOut, setTimedOut] = React.useState(false);
  const draftRef = React.useRef<ChallengeAnswer | null>(null);
  React.useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  // While the exam is in progress: keep the screen on, and count every time
  // the tab is hidden.
  const running = started && !result;
  React.useEffect(() => {
    if (!running) return;
    let lock: WakeLockSentinel | null = null;
    let live = true;
    const holdScreen = async () => {
      try {
        const next = (await navigator.wakeLock?.request("screen")) ?? null;
        if (live) lock = next;
        else void next?.release();
      } catch {
        // Not supported, or refused: the exam still runs.
      }
    };
    void holdScreen();
    let away = false;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        away = true;
        return;
      }
      if (!away) return;
      away = false;
      // A wake lock is released whenever the page is hidden.
      void holdScreen();
      setLeaves((count) => count + 1);
      void (async () => {
        try {
          const reply = await getSupabase()?.rpc("leave_assigned_exam", { p_exam: exam.id });
          // The server's count is the one the teacher sees.
          if (typeof reply?.data === "number") setLeaves(reply.data);
        } catch {
          // Offline: the count on screen still says it happened.
        }
      })();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      live = false;
      document.removeEventListener("visibilitychange", onVisibility);
      void lock?.release().catch(() => {});
    };
  }, [running, exam.id]);

  async function start() {
    setStarting(true);
    let seconds = 0;
    try {
      // Without the server's start there is no official time and no bonus,
      // but the learner can still take the exam.
      const supabase = getSupabase();
      const reply = supabase ? await supabase.rpc("start_assigned_exam", { p_exam: exam.id }) : null;
      if (reply && !reply.error) {
        const started = examStartFromReply(reply.data);
        seconds = started.seconds;
        setLeaves(started.leaves);
      }
    } catch {
      // Offline: the exam still runs.
    }
    setClock({ seconds, at: Date.now() });
    setQuestionAt(Date.now());
    setStarting(false);
    setStarted(true);
  }

  async function send(graded: ExamResult) {
    setSaving(true);
    setFailed(false);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("No account backend.");
      const { data, error } = await supabase.rpc(
        "submit_assigned_exam",
        assignedExamSubmission(exam.id, graded),
      );
      if (error) throw error;
      setTiming(examTimingFromReply(data));
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
        {timing?.seconds != null ? (
          <section className="grid gap-1">
            <p>{t("exam.result.time", { time: formatExamClock(timing.seconds) })}</p>
            <p className={timing.bonusXp > 0 ? "font-display text-lg font-extrabold" : "text-ink-muted"}>
              {timing.bonusXp > 0
                ? t("exam.result.bonus", { xp: timing.bonusXp })
                : t("exam.result.noBonus")}
            </p>
            {timing.leaves > 0 ? (
              <p className="text-ink-muted">{t("exam.result.leaves", { count: timing.leaves })}</p>
            ) : null}
          </section>
        ) : null}
        {exam.isFinal && saved ? (
          <p className="font-display text-lg font-extrabold">
            {examPassed(result.asked, result.correct)
              ? t("exam.result.finalPassed")
              : t("exam.result.finalFailed")}
          </p>
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
        {plan ? <StudyPlanView plan={plan} /> : null}
        <p className="text-ink-muted">{t("exam.intro.body", { count: paper.items.length })}</p>
        <p className="text-ink-muted">
          {t("exam.intro.clock", {
            share: `${Math.round(EXAM_SPEED_BONUS.minShare * 100)}%`,
            fast: EXAM_SPEED_BONUS.fastSecondsPerQuestion,
            steady: EXAM_SPEED_BONUS.steadySecondsPerQuestion,
            xp: EXAM_SPEED_BONUS.xpPerQuestion * paper.items.length,
          })}
        </p>
        <p className="text-ink-muted">{t("exam.intro.leave")}</p>
        {exam.secondsPerQuestion !== null ? (
          <p className="font-bold text-ink">
            {t("exam.intro.perQuestion", { seconds: exam.secondsPerQuestion })}
          </p>
        ) : null}
        {exam.isFinal ? (
          <p className="font-bold text-ink">{t("exam.intro.final")}</p>
        ) : null}
        <Button size="lg" onClick={() => void start()} disabled={starting}>
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

  // Moves on with `answer`, or with none when the time ran out unanswered.
  function advance(answer: ChallengeAnswer | null, outOfTime: boolean) {
    if (!item) return;
    const nextAnswers = answer ? { ...answers, [item.id]: answer } : answers;
    setAnswers(nextAnswers);
    setDraft(null);
    setTimedOut(outOfTime);
    if (!last) {
      setIndex(index + 1);
      setQuestionAt(Date.now());
      window.scrollTo({ top: 0 });
      return;
    }
    const graded = gradeExam(paper, nextAnswers, lookup, t);
    setResult(graded);
    void send(graded);
  }

  function next() {
    if (draft) advance(draft, false);
  }

  return (
    <Shell>
      <header className="flex items-center gap-4">
        <LocaleLink href="/dashboard" aria-label={t("exam.exit")} className="text-xl text-ink-faint">
          ✕
        </LocaleLink>
        <h1 className="grow font-display text-lg font-extrabold">
          {t("exam.question", { number: index + 1, total: paper.items.length })}
        </h1>
        {clock ? <Clock from={clock} label={t("exam.clock")} /> : null}
      </header>
      {exam.secondsPerQuestion !== null ? (
        <QuestionCountdown
          key={index}
          exam={exam}
          since={questionAt}
          label={t("exam.questionTime")}
          onTimeUp={() => advance(draftRef.current, true)}
        />
      ) : null}
      {timedOut ? (
        <p role="status" className="text-sm font-semibold">
          {t("exam.timeUp")}
        </p>
      ) : null}
      {leaves > 0 ? (
        <p role="status" className="text-sm font-semibold">
          {t("exam.left", { count: leaves })}
        </p>
      ) : null}
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

/**
 * The advice before a retake: what was missed, and which lessons to go back
 * to. Each lesson opens on click; its video, if it has one, plays there.
 */
function StudyPlanView({ plan }: { plan: StudyPlan }) {
  const { t } = useLocale();
  return (
    <section className="glass grid gap-4 rounded-card p-5 sm:p-7">
      <h2 className="font-display text-xl font-extrabold">{t("exam.study.title")}</h2>
      {plan.note ? (
        <div className="grid gap-2">
          <p>{t("exam.study.note")}</p>
          <p className="whitespace-pre-line font-semibold text-ink">{plan.note}</p>
        </div>
      ) : null}
      {plan.videos.length > 0 ? (
        <div className="grid gap-2">
          <p>{t("exam.study.videos")}</p>
          <ul className="grid gap-2">
            {plan.videos.map((video) => (
              <li key={video.lessonId}>
                <LocaleLink
                  href={`/learn/${video.lessonId}`}
                  className="grid gap-0.5 rounded-lg py-1 hover:opacity-80"
                >
                  <span className="font-display font-extrabold">
                    <span aria-hidden>{video.watched ? "✓ " : "▶ "}</span>
                    {video.title}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {video.moduleTitle} ·{" "}
                    {video.watched
                      ? t("exam.study.watched")
                      : video.share
                        ? t("exam.study.watchedShare", { share: Math.round(video.share * 100) })
                        : t("exam.study.watch")}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {plan.missed.length > 0 ? (
        <div className="grid gap-2">
          <p>{t("exam.study.missed")}</p>
          <ul className="grid gap-1">
            {plan.missed.map((item) => (
              <li key={item.itemId} className="text-ink-muted">
                <span aria-hidden>✗ </span>
                {item.prompt}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {plan.lessons.length > 0 ? (
        <div className="grid gap-2">
          <p>{t("exam.study.lessons")}</p>
          <ul className="grid gap-2">
            {plan.lessons.map((lesson) => (
              <li key={lesson.lessonId}>
                <LocaleLink
                  href={`/learn/${lesson.lessonId}`}
                  className="grid gap-0.5 rounded-lg py-1 hover:opacity-80"
                >
                  <span className="font-display font-extrabold">
                    {lesson.redone ? <span aria-hidden>✓ </span> : null}
                    {lesson.title}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {lesson.moduleTitle} ·{" "}
                    {lesson.redone
                      ? t("exam.study.redone")
                      : lesson.hasVideo
                        ? t("exam.study.video")
                        : t("exam.study.redo")}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted">
            {t("exam.study.progress", { done: plan.redoneCount, total: plan.lessons.length })}
          </p>
        </div>
      ) : null}
      <p>{t("exam.study.ready")}</p>
    </section>
  );
}

/**
 * The time left on one question. Remounted for each question (keyed by its
 * index), and checked against the wall clock every second, so a hidden tab
 * that throttles timers still ends the question on time when it comes back.
 */
function QuestionCountdown({
  exam,
  since,
  label,
  onTimeUp,
}: {
  exam: AssignedExam;
  since: number;
  label: string;
  onTimeUp: () => void;
}) {
  const [left, setLeft] = React.useState(() => questionSecondsLeft(exam, Date.now() - since));
  const timeUp = React.useRef(onTimeUp);
  React.useEffect(() => {
    timeUp.current = onTimeUp;
  }, [onTimeUp]);
  React.useEffect(() => {
    let done = false;
    const tick = () => {
      const next = questionSecondsLeft(exam, Date.now() - since);
      setLeft(next);
      if (next === 0 && !done) {
        done = true;
        timeUp.current();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [exam, since]);
  if (left === null || exam.secondsPerQuestion === null) return null;
  const share = left / exam.secondsPerQuestion;
  const time = formatExamClock(left);
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-veil/10"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={exam.secondsPerQuestion}
        aria-valuenow={left}
      >
        {share > 0.001 ? (
          <div
            className="h-full rounded-full bg-mint transition-[width] duration-1000 ease-linear"
            style={{ width: `${share * 100}%` }}
          />
        ) : null}
      </div>
      <span
        aria-label={`${label} ${time}`}
        className={`font-display text-lg font-extrabold tabular-nums ${left <= 10 ? "text-ink" : "text-ink-muted"}`}
      >
        {time}
      </span>
    </div>
  );
}

/** A running clock, counting on from what the server said at Start. */
function Clock({ from, label }: { from: { seconds: number; at: number }; label: string }) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = formatExamClock(from.seconds + (now - from.at) / 1000);
  return (
    <span aria-label={`${label} ${time}`} className="font-display text-lg font-extrabold tabular-nums text-ink-muted">
      {time}
    </span>
  );
}
