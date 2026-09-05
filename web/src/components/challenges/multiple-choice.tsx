"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * One right answer out of three or four.
 *
 * A radio group rather than a list of buttons: arrow keys move between the
 * options, which is what a screen reader user expects from "pick one", and it
 * costs nothing to get right.
 */
export function MultipleChoiceView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"multiple_choice">) {
  const [selected, setSelected] = React.useState<string | null>(null);

  function choose(optionId: string) {
    if (locked) return;
    setSelected(optionId);
    onAnswerChange({ type: "multiple_choice", optionId });
  }

  return (
    <div
      role="radiogroup"
      aria-label={challenge.prompt}
      className="flex flex-col gap-3"
    >
      {challenge.options.map((option) => {
        const isSelected = selected === option.id;
        // After grading, show the truth: mark the right answer even when the
        // learner did not pick it, so a wrong guess still teaches something.
        const isCorrect = locked && option.id === challenge.correctOptionId;
        const isWrongPick = locked && isSelected && !isCorrect;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={locked}
            onClick={() => choose(option.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
              isCorrect
                ? "border-mint/60 bg-mint/10"
                : isWrongPick
                  ? "border-coral/60 bg-coral/10"
                  : isSelected
                    ? "border-mint/50 bg-white/[0.06]"
                    : "border-hairline bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]",
              locked && !isCorrect && !isWrongPick && "opacity-60",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-lg border",
                isCorrect
                  ? "border-mint bg-mint text-abyss"
                  : isWrongPick
                    ? "border-coral bg-coral text-abyss"
                    : isSelected
                      ? "border-mint bg-mint text-abyss"
                      : "border-white/20 bg-white/5",
              )}
            >
              {isCorrect ? (
                <Check className="size-4" strokeWidth={3} />
              ) : isWrongPick ? (
                <X className="size-4" strokeWidth={3} />
              ) : null}
            </span>
            <span
              className={cn(
                "text-[0.95rem] font-semibold leading-snug",
                isCorrect ? "text-mint-bright" : "text-ink",
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}

      {/*
        The targeted rebuttal for the option actually picked. The engine already
        puts this in `result.detail`; rendering it beside the option it belongs
        to is what makes it land.
      */}
      {locked && result && !result.correct ? (
        <p className="rounded-xl border border-coral/30 bg-coral/[0.07] px-4 py-3 text-sm leading-relaxed text-ink-muted">
          {result.detail ?? result.explanation}
        </p>
      ) : null}
    </div>
  );
}
