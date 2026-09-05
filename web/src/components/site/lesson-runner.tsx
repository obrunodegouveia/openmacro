"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Coins, PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultipleChoice } from "@/components/site/multiple-choice";
import { TAccountPuzzle } from "@/components/site/t-account-puzzle";
import { exerciseXp, type Exercise, type Lesson } from "@/lib/exercises";
import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";
import { recordLessonComplete } from "@/lib/progress";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * Lesson runner
 * ============================================================================
 *
 * Sequences a lesson's exercises: one on screen at a time, a progress bar, and
 * XP that only lands when a step is actually cleared.
 *
 * The runner deliberately owns no grading. Each exercise component grades
 * itself and reports upward through `onSolved`, which is what lets a step be
 * as simple as a multiple choice or as involved as a balance-sheet puzzle
 * without the runner knowing the difference.
 *
 * Progress during a lesson is in-memory; the *result* is written once, on
 * completion, for a signed-in learner. Writing per step would mean a row per
 * tap and a lesson abandoned halfway counting as progress — neither is what a
 * streak should mean.
 *
 * Signed out, everything still works and nothing is saved. That is deliberate:
 * the lessons are free and account-free, and the account only buys memory.
 */
export function LessonRunner({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = React.useState(0);
  const [solvedIds, setSolvedIds] = React.useState<string[]>([]);

  const total = lesson.exercises.length;
  const current = lesson.exercises[index];
  const finished = index >= total;

  const earnedXp = lesson.exercises
    .filter((exercise) => solvedIds.includes(exercise.id))
    .reduce((sum, exercise) => sum + exerciseXp(exercise), 0);

  /** Idempotent: an exercise may report success more than once. */
  function markSolved(exercise: Exercise) {
    setSolvedIds((current) =>
      current.includes(exercise.id) ? current : [...current, exercise.id],
    );
  }

  const currentSolved = current ? solvedIds.includes(current.id) : false;
  const progress = finished ? 1 : solvedIds.length / total;

  const { learner } = useAuth();
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved" | "failed">(
    "idle",
  );

  /**
   * Persists the result once, when the lesson finishes.
   *
   * Guarded by a ref rather than by `saveState` so a re-render mid-write
   * cannot start a second one; retrying is the learner's call via the button.
   */
  const savedRef = React.useRef(false);
  React.useEffect(() => {
    const supabase = getSupabase();
    if (!finished || !learner || !supabase || savedRef.current) return;
    savedRef.current = true;

    setSaveState("saving");
    recordLessonComplete(supabase, learner.id, learner.name, lesson.slug, earnedXp)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("failed"));
  }, [finished, learner, lesson.slug, earnedXp]);

  function restart() {
    setIndex(0);
    setSolvedIds([]);
    savedRef.current = false;
    setSaveState("idle");
  }

  return (
    <div>
      {/* Progress ------------------------------------------------------ */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Lesson progress"
        >
          <motion.div
            className="h-full rounded-full bg-mint"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />
        </div>
        <span className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-ink-faint">
          {finished ? total : Math.min(index + 1, total)} / {total}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-gold">
          <Coins className="size-3.5" aria-hidden />
          {earnedXp} XP
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          // Remounting on step change resets each exercise's own draft state.
          key={finished ? "complete" : current?.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {finished ? (
            <LessonComplete
              lesson={lesson}
              earnedXp={earnedXp}
              onRestart={restart}
              saveState={saveState}
            />
          ) : current ? (
            <ExerciseView exercise={current} onSolved={() => markSolved(current)} />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Advance ------------------------------------------------------- */}
      {!finished ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold text-ink-faint">
            {currentSolved
              ? "Solved — carry on when you're ready."
              : "Answer correctly to continue."}
          </p>
          <Button onClick={() => setIndex((i) => i + 1)} disabled={!currentSolved}>
            {index + 1 === total ? "Finish" : "Continue"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Renders one exercise.
 *
 * Adding a new exercise kind fails to compile here until it is handled, which
 * is the point — a silent blank step is far worse than a build error.
 */
function ExerciseView({
  exercise,
  onSolved,
}: {
  exercise: Exercise;
  onSolved: () => void;
}) {
  switch (exercise.kind) {
    case "multiple_choice":
      return <MultipleChoice exercise={exercise} onSolved={onSolved} />;
    case "t_account":
      return <TAccountPuzzle scenario={exercise.scenario} onSolved={onSolved} />;
    default: {
      const unhandled: never = exercise;
      throw new Error(`Unhandled exercise kind: ${JSON.stringify(unhandled)}`);
    }
  }
}

function LessonComplete({
  lesson,
  earnedXp,
  onRestart,
  saveState,
}: {
  lesson: Lesson;
  earnedXp: number;
  onRestart: () => void;
  saveState: "idle" | "saving" | "saved" | "failed";
}) {
  const { enabled, learner, signingIn, signIn } = useAuth();
  return (
    <div className="glass rounded-card p-7 text-center shadow-2xl shadow-black/50 sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-mint/30 bg-mint/10">
        <PartyPopper className="size-7 text-mint-bright" aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">
        Lesson complete
      </h2>
      <p className="mt-1 text-sm font-semibold text-ink-muted">{lesson.title}</p>

      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-extrabold text-gold">
        <Coins className="size-4" aria-hidden />+{earnedXp} XP
      </p>

      <ul className="mx-auto mt-7 max-w-xl space-y-3 text-left">
        {lesson.takeaways.map((takeaway) => (
          <li key={takeaway} className="flex gap-3">
            <Check className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
            <span className="text-sm leading-relaxed text-ink-muted">{takeaway}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/learn">Back to lessons</Link>
        </Button>
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Practise again
        </Button>
      </div>

      <SaveNote
        enabled={enabled}
        signedIn={Boolean(learner)}
        signingIn={signingIn}
        saveState={saveState}
        onSignIn={() => void signIn()}
      />
    </div>
  );
}

/**
 * The one line under the completion screen about whether this counted.
 *
 * Stated plainly rather than nagged: someone who does not want an account has
 * still just finished a lesson, and telling them off for it would be a poor
 * thank-you.
 */
function SaveNote({
  enabled,
  signedIn,
  signingIn,
  saveState,
  onSignIn,
}: {
  enabled: boolean;
  signedIn: boolean;
  signingIn: boolean;
  saveState: "idle" | "saving" | "saved" | "failed";
  onSignIn: () => void;
}) {
  if (!enabled) {
    return (
      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        Progress is not saved — this build has no account backend configured.
      </p>
    );
  }

  if (!signedIn) {
    return (
      <div className="mt-7 border-t border-hairline pt-6">
        <p className="text-sm font-semibold text-ink-muted">
          Sign in to keep this XP and start a streak.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          disabled={signingIn}
          onClick={onSignIn}
        >
          {signingIn ? "Opening Google…" : "Continue with Google"}
        </Button>
        <p className="mt-3 text-xs text-ink-faint">
          Optional. The lessons are free either way.
        </p>
      </div>
    );
  }

  const NOTE: Record<typeof saveState, string> = {
    idle: "Saving to your account…",
    saving: "Saving to your account…",
    saved: "Saved to your account.",
    failed: "Could not reach your account — this run was not saved.",
  };

  return (
    <p
      className={cn(
        "mt-6 text-xs leading-relaxed",
        saveState === "failed" ? "text-coral" : "text-ink-faint",
      )}
    >
      {NOTE[saveState]}
    </p>
  );
}
