"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * One right answer out of three or four.
 *
 * A real radio group, not a list of buttons wearing `role="radio"`. The
 * distinction matters: the group holds a single tab stop, and the arrow keys
 * move between options and pick as they go — which is what the role promises a
 * screen reader, and what a keyboard user gets from every native radio on the
 * web. `role` alone buys none of that; it has to be implemented.
 *
 * After grading the options stay focusable and are marked `aria-disabled`
 * rather than `disabled`. A disabled control is removed from the tab order
 * entirely, which would take the graded answers — the part worth reading —
 * away from exactly the people who need to review them.
 */
export function MultipleChoiceView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"multiple_choice">) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([]);

  function choose(optionId: string) {
    if (locked) return;
    setSelected(optionId);
    onAnswerChange({ type: "multiple_choice", optionId });
  }

  /**
   * Arrow keys move the selection, Home/End jump to the ends, and the group
   * wraps. Once graded, they still move focus so the answers can be read back,
   * but they no longer change the choice.
   */
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const count = challenge.options.length;
    const current = Math.max(
      0,
      challenge.options.findIndex((option) => option.id === selected),
    );

    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (current + 1) % count;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (current - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    buttons.current[next]?.focus();
    if (!locked) choose(challenge.options[next].id);
  }

  // Exactly one tab stop into the group, landing on the current choice.
  const activeIndex = Math.max(
    0,
    challenge.options.findIndex((option) => option.id === selected),
  );

  return (
    <div
      role="radiogroup"
      aria-label={challenge.prompt}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-3"
    >
      {challenge.options.map((option, index) => {
        const isSelected = selected === option.id;
        // After grading, show the truth: mark the right answer even when the
        // learner did not pick it, so a wrong guess still teaches something.
        const isCorrect = locked && option.id === challenge.correctOptionId;
        const isWrongPick = locked && isSelected && !isCorrect;

        return (
          <button
            key={option.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={locked || undefined}
            tabIndex={index === activeIndex ? 0 : -1}
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
                    : locked
                      ? "border-hairline bg-white/[0.03]"
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
