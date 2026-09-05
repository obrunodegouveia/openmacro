"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Coins, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MultipleChoiceExercise } from "@/lib/exercises";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * Multiple choice
 * ============================================================================
 *
 * The cheap exercise kind, and the one that carries the misconceptions. After
 * answering, the correct option is always revealed alongside the learner's
 * pick — seeing the right answer next to your wrong one is most of why the
 * format works — and a wrong pick gets the rebuttal written for that specific
 * option rather than a generic "incorrect".
 */
export function MultipleChoice({
  exercise,
  onSolved,
}: {
  exercise: MultipleChoiceExercise;
  /** Fired once, when the learner answers correctly. */
  onSolved?: () => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  const correct = checked && selectedId === exercise.correctOptionId;
  const chosen = exercise.options.find((option) => option.id === selectedId);

  function check() {
    if (!selectedId) return;
    setChecked(true);
    if (selectedId === exercise.correctOptionId) onSolved?.();
  }

  /** A wrong answer clears back to drafting so the next pick is a fresh try. */
  function retry() {
    setChecked(false);
    setSelectedId(null);
  }

  return (
    <div className="glass overflow-hidden rounded-card shadow-2xl shadow-black/50">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white/[0.03] px-5 py-4 sm:px-7">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
          {exercise.instructions ?? "Pick the best answer"}
        </p>
        <Badge tone="gold">
          <Coins className="size-3" aria-hidden />+{exercise.xp} XP
        </Badge>
      </div>

      <div className="p-5 sm:p-7">
        <h3 className="text-balance font-display text-xl font-extrabold leading-snug">
          {exercise.prompt}
        </h3>

        <div className="mt-6 space-y-3" role="radiogroup" aria-label={exercise.prompt}>
          {exercise.options.map((option) => {
            const isSelected = option.id === selectedId;
            const isRight = option.id === exercise.correctOptionId;
            const revealRight = checked && isRight;
            const revealWrong = checked && isSelected && !isRight;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={option.label}
                disabled={checked}
                onClick={() => setSelectedId(option.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border border-hairline bg-abyss/60 px-4 py-4 text-left transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
                  !checked && "hover:border-mint/50 hover:bg-white/[0.04]",
                  isSelected && !checked && "border-mint/70 bg-mint/10",
                  revealRight && "border-mint/70 bg-mint/10",
                  revealWrong && "border-coral/70 bg-coral/10",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg border border-hairline text-xs font-extrabold",
                    isSelected && !checked && "border-mint bg-mint text-abyss",
                    revealRight && "border-mint bg-mint text-abyss",
                    revealWrong && "border-coral bg-coral text-abyss",
                  )}
                  aria-hidden
                >
                  {revealRight ? (
                    <Check className="size-4" />
                  ) : revealWrong ? (
                    <X className="size-4" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold leading-relaxed",
                    revealRight && "text-mint-bright",
                    revealWrong && "text-coral",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {checked ? (
            <motion.div
              // AnimatePresence tracks children by key; without one the exit
              // never runs and stale feedback stays on screen after a retry.
              key="feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "mt-6 rounded-2xl border p-4",
                correct ? "border-mint/30 bg-mint/[0.07]" : "border-coral/30 bg-coral/[0.07]",
              )}
              aria-live="polite"
            >
              <p
                className={cn(
                  "font-display text-sm font-extrabold",
                  correct ? "text-mint-bright" : "text-coral",
                )}
              >
                {correct ? "Exactly right" : "Not quite"}
              </p>
              {!correct && chosen?.feedback ? (
                <p className="mt-1 text-sm font-semibold leading-relaxed text-coral/90">
                  {chosen.feedback}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {exercise.explanation}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-6 flex justify-end">
          {!checked ? (
            <Button onClick={check} disabled={!selectedId}>
              Check
            </Button>
          ) : !correct ? (
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
