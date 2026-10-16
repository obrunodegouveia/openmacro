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

  /*
   * Number keys pick an option directly on a keyboard, the way the option's
   * position reads. Ignored while typing in a field, once graded, and with a
   * modifier held so browser shortcuts keep working.
   */
  React.useEffect(() => {
    function onDigit(event: KeyboardEvent) {
      if (locked || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const index = Number(event.key) - 1;
      if (!Number.isInteger(index) || index < 0 || index >= challenge.options.length) return;
      event.preventDefault();
      buttons.current[index]?.focus();
      choose(challenge.options[index].id);
    }
    window.addEventListener("keydown", onDigit);
    return () => window.removeEventListener("keydown", onDigit);
  });

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
                    ? "border-mint/50 bg-veil/[0.06]"
                    : locked
                      ? "border-hairline bg-veil/[0.03]"
                      : "border-hairline bg-veil/[0.03] hover:border-veil/20 hover:bg-veil/[0.06]",
              locked && !isCorrect && !isWrongPick && "opacity-60",
            )}
          >
            <span
              aria-hidden
              className={cn(
                // Round, because one answer is picked: a square reads as "tick all that apply".
                "grid size-6 shrink-0 place-items-center rounded-full border-2",
                isCorrect
                  ? "border-mint bg-mint text-abyss"
                  : isWrongPick
                    ? "border-coral bg-coral text-abyss"
                    : isSelected
                      ? "border-mint"
                      : "border-veil/25",
              )}
            >
              {isCorrect ? (
                <Check className="size-4" strokeWidth={3} />
              ) : isWrongPick ? (
                <X className="size-4" strokeWidth={3} />
              ) : isSelected ? (
                <span className="size-2.5 rounded-full bg-mint" />
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

    </div>
  );
}
