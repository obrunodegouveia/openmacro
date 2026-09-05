"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Clock,
  Coins,
  Flame,
  Heart,
  PartyPopper,
  RotateCcw,
  X,
} from "lucide-react";
import { MODULES } from "@openmacro/core/content";
import type { Lesson } from "@openmacro/core/content/schema";
import type { ChallengeAnswer } from "@openmacro/core/engine/answers";
import {
  createSession,
  currentChallenge,
  lessonSessionReducer,
  progressRatio,
} from "@openmacro/core/engine/lessonSession";
import { Button } from "@/components/ui/button";
import { ChallengeView } from "@/components/challenges/challenge-view";
import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";
import { recordCompletion } from "@/lib/progress";
import { GoogleSignIn } from "@/components/site/google-sign-in";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * Lesson player
 * ============================================================================
 *
 * Drives `lessonSessionReducer` from @openmacro/core — the same reducer the
 * mobile app runs. Hearts, the re-queue of missed challenges, half XP on a
 * retry and the combo counter are all decided there, so the two apps cannot
 * disagree about what a lesson result means.
 *
 * The player owns the whole screen rather than sitting inside the marketing
 * page. A lesson is a focused surface: one way out, one thing to read, one
 * action. The two things that must never scroll away are the state of the run
 * (progress, hearts, XP) and the button that advances it, so both are pinned —
 * top and bottom — and everything else moves between them.
 */
export function LessonPlayer({
  lesson,
  moduleTitle,
  xpAvailable,
}: {
  lesson: Lesson;
  moduleTitle?: string;
  xpAvailable: number;
}) {
  const [state, dispatch] = React.useReducer(
    lessonSessionReducer,
    lesson,
    createSession,
  );
  /**
   * The answer the challenge component is currently offering.
   *
   * Tagged with the step it belongs to rather than cleared by an effect: a
   * re-queued challenge must not inherit the answer that just failed, and
   * deriving that from `stepSerial` avoids a second render pass on every step.
   */
  const [draft, setDraft] = React.useState<{
    step: number;
    answer: ChallengeAnswer | null;
  }>({ step: 0, answer: null });

  const challenge = currentChallenge(state);
  const progress = progressRatio(state);
  const finished = state.status === "complete";
  const failed = state.status === "failed";
  const playing = !finished && !failed;

  const answer = draft.step === state.stepSerial ? draft.answer : null;

  const publish = React.useCallback(
    (next: ChallengeAnswer | null) => {
      setDraft({ step: state.stepSerial, answer: next });
    },
    [state.stepSerial],
  );

  function submit() {
    if (!answer) return;
    dispatch({ kind: "submit", answer });
  }

  /**
   * Once the run is under way, the title block goes.
   *
   * It is orientation for someone deciding whether to start, and clutter for
   * someone already answering — on a phone it is the difference between the
   * first option being on screen and being below the fold. Derived from the
   * session, so there is no state to keep in sync.
   */
  const started = state.stepSerial > 0 || Boolean(state.feedback) || !playing;

  return (
    <div className="flex min-h-svh flex-col">
      <SessionBar
        state={state}
        progress={progress}
        lessonTitle={lesson.title}
        showTitle={started && playing}
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28 pt-6 sm:px-8">
        {!started ? (
          <header className="mb-8">
            {moduleTitle ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-azure">
                {moduleTitle}
              </p>
            ) : null}
            <h1 className="mt-2 text-balance font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              <span aria-hidden className="mr-2">
                {lesson.icon}
              </span>
              {lesson.title}
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-ink-muted">
              {lesson.subtitle}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {lesson.estimatedMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="size-3.5" aria-hidden />
                {xpAvailable} XP available
              </span>
              <span>
                {lesson.challenges.length} challenge
                {lesson.challenges.length === 1 ? "" : "s"}
              </span>
            </p>
          </header>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={finished || failed ? "outcome" : `${state.stepSerial}:${challenge?.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {finished ? (
              <LessonComplete
                lesson={lesson}
                state={state}
                onRestart={() => dispatch({ kind: "restart" })}
              />
            ) : failed ? (
              <OutOfHearts lesson={lesson} onRestart={() => dispatch({ kind: "restart" })} />
            ) : challenge ? (
              <section className="glass rounded-card p-5 sm:p-7">
                <header className="mb-5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
                    {CHALLENGE_LABELS[challenge.type]}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                    {challenge.prompt}
                  </h2>
                </header>

                <ChallengeView
                  challenge={challenge}
                  onAnswerChange={publish}
                  locked={Boolean(state.feedback)}
                  result={state.feedback}
                />
              </section>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/*
        The verdict, for anyone not reading the screen. The graded feedback is
        rendered inside the challenge, which a screen reader will not revisit on
        its own — this announces it at the moment it appears.
      */}
      <p role="status" aria-live="polite" className="sr-only">
        {state.feedback
          ? `${state.feedback.correct ? "Correct." : "Not quite."} ${
              state.feedback.detail ?? state.feedback.explanation ?? ""
            }`
          : ""}
      </p>

      {playing ? (
        <ActionBar
          hint={
            state.feedback
              ? state.feedback.correct
                ? "Nice — keep going."
                : "We'll come back to this one."
              : answer
                ? "Ready when you are."
                : "Answer to continue."
          }
        >
          {state.feedback ? (
            <Button size="lg" onClick={() => dispatch({ kind: "continue" })}>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button size="lg" onClick={submit} disabled={!answer}>
              Check
            </Button>
          )}
        </ActionBar>
      ) : null}
    </div>
  );
}

const CHALLENGE_LABELS: Record<string, string> = {
  multiple_choice: "Pick the best answer",
  concept_match: "Match each pair",
  order_flow: "Put these in order",
  interactive_sim: "Run the model",
  t_account_flow: "Post the entries",
};

/**
 * The state of the run, pinned to the top.
 *
 * Carries the only way out of the lesson as well. A learner mid-lesson needs
 * exactly one exit, not a site nav offering six other destinations — leaving
 * should be a decision, not an accident.
 */
function SessionBar({
  state,
  progress,
  lessonTitle,
  showTitle,
}: {
  state: ReturnType<typeof createSession>;
  progress: number;
  lessonTitle: string;
  showTitle: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-3 sm:gap-4 sm:px-8">
        <Link
          href="/learn"
          aria-label="Leave this lesson"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
        >
          <X className="size-5" aria-hidden />
        </Link>

        <div
          className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Lesson progress"
        >
          {/* Hidden below a hair's width: a rounded fill at 0% still paints a
              visible stub, which reads as progress that has not happened. */}
          {progress > 0.001 ? (
            <motion.div
              className="h-full rounded-full bg-mint"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            />
          ) : null}
        </div>

        <p
          className="flex shrink-0 items-center gap-0.5"
          aria-label={`${state.hearts} of ${state.maxHearts} hearts remaining`}
        >
          {Array.from({ length: state.maxHearts }, (_, index) => (
            <Heart
              key={index}
              aria-hidden
              className={cn(
                "size-4",
                index < state.hearts ? "fill-coral text-coral" : "text-white/15",
              )}
            />
          ))}
        </p>

        {state.combo >= 2 ? (
          <span
            className="hidden shrink-0 items-center gap-1 text-xs font-extrabold text-gold sm:inline-flex"
            aria-label={`${state.combo} in a row`}
          >
            <Flame className="size-3.5" aria-hidden />
            {state.combo}
          </span>
        ) : null}

        <span
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-gold"
          aria-label={`${state.xpEarned} XP earned`}
        >
          <Coins className="size-3.5" aria-hidden />
          <span aria-hidden>{state.xpEarned} XP</span>
        </span>
      </div>

      {/* Once the title block above the challenge is gone, the lesson's name
          lives here so the learner never loses track of what they are in. */}
      {showTitle ? (
        <p className="mx-auto -mt-1 w-full max-w-3xl truncate px-5 pb-2 text-xs font-bold text-ink-faint sm:px-8">
          {lessonTitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The primary action, pinned to the bottom.
 *
 * On a phone the Check button used to sit at the end of the answers, below the
 * fold on any challenge with more than three options — the learner had to
 * scroll to find out they could submit. Here it is always under the thumb, and
 * the safe-area padding keeps it clear of the iOS home indicator.
 */
function ActionBar({
  hint,
  children,
}: {
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-hairline bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <p className="min-w-0 text-xs font-semibold text-ink-faint">{hint}</p>
        {children}
      </div>
    </div>
  );
}

/** Ran out of hearts. Not a punishment screen — a retry screen. */
function OutOfHearts({ lesson, onRestart }: { lesson: Lesson; onRestart: () => void }) {
  return (
    <div className="glass rounded-card p-7 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-coral/30 bg-coral/10">
        <Heart className="size-7 text-coral" aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        Out of hearts
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        Nothing is lost — hearts exist to make you slow down on the mechanism,
        not to lock you out. Run {lesson.title} again and the parts you already
        had will go quickly.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/learn">Back to lessons</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * The end of a run: XP, what it taught, and whether it was saved.
 *
 * Also the only place a signed-out learner is asked for an account, and it is
 * asked *after* the work rather than before it — the lesson is free either way,
 * and the account only buys memory of it.
 */
function LessonComplete({
  lesson,
  state,
  onRestart,
}: {
  lesson: Lesson;
  state: ReturnType<typeof createSession>;
  onRestart: () => void;
}) {
  const { enabled, learner } = useAuth();
  /** `local` means kept on this device — the signed-out case, not a failure. */
  const [saveState, setSaveState] = React.useState<
    "idle" | "local" | "saving" | "saved" | "failed"
  >("idle");

  const xpEarned = state.xpEarned;

  /**
   * Saves the run exactly once.
   *
   * Local always, account too when there is one. Guarded by a ref rather than
   * by `saveState` so a re-render mid-write cannot start a second save.
   */
  const savedRef = React.useRef(false);
  React.useEffect(() => {
    if (savedRef.current || xpEarned <= 0) return;
    savedRef.current = true;

    const supabase = getSupabase();
    const account =
      learner && supabase
        ? { client: supabase, userId: learner.id, displayName: learner.name }
        : undefined;

    setSaveState(account ? "saving" : "local");
    recordCompletion(
      {
        lessonId: lesson.id,
        xpEarned,
        heartsRemaining: state.hearts,
        maxHearts: state.maxHearts,
        bestCombo: state.bestCombo,
        completed: true,
      },
      account,
    )
      .then(() => setSaveState(account ? "saved" : "local"))
      .catch(() => setSaveState("failed"));
    // Runs once per completion; `learner` arriving later is handled by the
    // sign-in merge, which pushes whatever is in local storage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const perfect = state.missed.length === 0 && state.xpEarned > 0;
  const next = nextLessonAfter(lesson.id);

  return (
    <div className="glass rounded-card p-7 text-center shadow-2xl shadow-black/50 sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-mint/30 bg-mint/10">
        <PartyPopper className="size-7 text-mint-bright" aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        Lesson complete
      </h2>
      <p className="mt-1 text-sm font-semibold text-ink-muted">{lesson.title}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-extrabold text-gold">
          <Coins className="size-4" aria-hidden />+{xpEarned} XP
        </span>
        {perfect ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-1.5 text-sm font-extrabold text-mint-bright">
            <Flame className="size-4" aria-hidden />
            No mistakes
          </span>
        ) : null}
      </div>

      {lesson.keyTakeaways?.length ? (
        <ul className="mx-auto mt-7 max-w-xl space-y-3 text-left">
          {lesson.keyTakeaways.map((takeaway) => (
            <li key={takeaway} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
              <span className="text-sm leading-relaxed text-ink-muted">{takeaway}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          {/* The actual next lesson, not the index. Finishing one thing should
              offer the next thing — sending someone back to a list of thirty is
              where a session ends. */}
          <Link href={next ? `/learn/${next.id}` : "/learn"}>
            {next ? "Next lesson" : "Back to lessons"}
          </Link>
        </Button>
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Practise again
        </Button>
      </div>

      {enabled ? (
        <div className="mt-8 border-t border-hairline pt-6">
          {learner ? (
            <p className="text-xs font-semibold text-ink-faint">
              {saveState === "saving"
                ? "Saving to your account…"
                : saveState === "saved"
                  ? `Saved to ${learner.name}'s account.`
                  : saveState === "failed"
                    ? "Could not reach your account — this run is safe on this device and will sync next time."
                    : "Signed in."}
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink-muted">
                Saved on this device. Sign in to keep it across devices and
                start a streak.
              </p>
              {/*
                No `redirectTo`: signing in here happens in place, so the run
                stays on screen and the save effect above fires the moment a
                learner appears. The parked completion is still written first,
                because the fallback path is a full-page redirect.
              */}
              <div className="mt-3 flex justify-center">
                <GoogleSignIn />
              </div>
              <p className="mt-3 text-xs text-ink-faint">
                Optional. The lessons are free either way.
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** The lesson that follows this one in course order, if there is one. */
function nextLessonAfter(lessonId: string): Lesson | null {
  const all = MODULES.flatMap((module) => module.lessons);
  const index = all.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? (all[index + 1] ?? null) : null;
}
