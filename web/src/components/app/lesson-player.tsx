"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Coins,
  Flame,
  Heart,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
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
import { recordLessonComplete } from "@/lib/progress";
import {
  clearCompletion,
  readCompletion,
  readNoCompletion,
  rememberCompletion,
  subscribeToCompletion,
} from "@/lib/handoff";
import { GoogleIcon } from "@/components/ui/icons";
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
 * This component owns only what is genuinely presentational: which view is on
 * screen, the feedback sheet, and saving the result for a signed-in learner.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
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

  return (
    <div>
      <SessionBar state={state} progress={progress} />

      <AnimatePresence mode="wait">
        <motion.div
          key={finished || failed ? "outcome" : `${state.stepSerial}:${challenge?.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {finished ? (
            <LessonComplete lesson={lesson} state={state} onRestart={() => dispatch({ kind: "restart" })} />
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

      {/* Advance ---------------------------------------------------------- */}
      {!finished && !failed ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-ink-faint">
            {state.feedback
              ? state.feedback.correct
                ? "Nice — keep going."
                : "We'll come back to this one."
              : answer
                ? "Ready when you are."
                : "Answer to continue."}
          </p>

          {state.feedback ? (
            <Button onClick={() => dispatch({ kind: "continue" })}>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={submit} disabled={!answer}>
              Check
            </Button>
          )}
        </div>
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

/** Progress, hearts, streak and XP — the persistent header of a run. */
function SessionBar({
  state,
  progress,
}: {
  state: ReturnType<typeof createSession>;
  progress: number;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div
        className="h-3 flex-1 overflow-hidden rounded-full bg-white/10"
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
        className="flex shrink-0 items-center gap-1"
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
          className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-gold"
          aria-label={`${state.combo} in a row`}
        >
          <Flame className="size-3.5" aria-hidden />
          {state.combo}
        </span>
      ) : null}

      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-gold">
        <Coins className="size-3.5" aria-hidden />
        {state.xpEarned} XP
      </span>
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
  const { enabled, learner, signingIn, signIn } = useAuth();
  const [saveState, setSaveState] = React.useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");

  /**
   * A run finished just before an OAuth redirect, if there is one.
   *
   * Read through `useSyncExternalStore` because this page is prerendered: the
   * server must render "nothing parked" while the browser reads its own
   * storage, with no hydration mismatch.
   */
  const parked = React.useSyncExternalStore(
    subscribeToCompletion,
    readCompletion,
    readNoCompletion,
  );

  /** The most this lesson could ever award, used to clamp a restored score. */
  const maxXp = React.useMemo(
    () => lesson.challenges.reduce((sum, challenge) => sum + (challenge.xp ?? 10), 0),
    [lesson],
  );

  const restoredXp =
    parked && parked.slug === lesson.id ? Math.min(parked.xp, maxXp) : null;
  const xpEarned = state.xpEarned || (restoredXp ?? 0);

  /** Saved once per completion; a re-render mid-write must not start a second. */
  const savedRef = React.useRef(false);
  React.useEffect(() => {
    const supabase = getSupabase();
    if (!learner || !supabase || savedRef.current || xpEarned <= 0) return;
    savedRef.current = true;

    setSaveState("saving");
    recordLessonComplete(supabase, learner.id, learner.name, lesson.id, xpEarned)
      .then(() => {
        clearCompletion();
        setSaveState("saved");
      })
      .catch(() => setSaveState("failed"));
  }, [learner, lesson.id, xpEarned]);

  function signInKeepingProgress() {
    rememberCompletion({ slug: lesson.id, xp: xpEarned, at: new Date().toISOString() });
    void signIn();
  }

  const perfect = state.missed.length === 0 && state.xpEarned > 0;

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
          <Link href="/learn">Back to lessons</Link>
        </Button>
        <Button variant="outline" onClick={() => { clearCompletion(); onRestart(); }}>
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
                    ? "Could not save this one — your XP is safe on this device."
                    : "Signed in."}
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink-muted">
                Sign in to keep this XP and start a streak.
              </p>
              <Button
                variant="outline"
                className="mt-3"
                disabled={signingIn}
                onClick={signInKeepingProgress}
              >
                <GoogleIcon className="size-4" aria-hidden />
                {signingIn ? "Opening Google" : "Continue with Google"}
              </Button>
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
