"use client";

import * as React from "react";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { seededShuffle } from "@openmacro/core/format";
import type { FlowEvent } from "@openmacro/core/content/schema";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * Put the steps of a mechanism into causal order.
 *
 * Move-up / move-down buttons rather than drag-and-drop, for the same reason
 * concept_match uses tapping: reordering has to work from a keyboard, and a
 * causal chain is short enough that two buttons are genuinely faster than
 * dragging anyway.
 */
export function OrderFlowView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"order_flow">) {
  const [order, setOrder] = React.useState<FlowEvent[]>(() =>
    // Shuffled, but never in the authored order — that would give the answer
    // away to anyone who reads the file.
    seededShuffle(challenge.events, challenge.id),
  );

  // The learner starts with a complete (if wrong) ordering, so an answer is
  // always submittable. Publish it once on mount and after every move.
  React.useEffect(() => {
    onAnswerChange({ type: "order_flow", order: order.map((event) => event.id) });
  }, [order, onAnswerChange]);

  function move(index: number, direction: -1 | 1) {
    if (locked) return;
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    setOrder((current) => {
      const next = [...current];
      const a = next[index] as FlowEvent;
      const b = next[target] as FlowEvent;
      next[index] = b;
      next[target] = a;
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
        Earliest cause at the top
      </p>

      <ol className="flex flex-col gap-2">
        {order.map((event, index) => {
          // After grading, a step is right only if it sits at its own index in
          // the authored sequence.
          const verdict = locked
            ? challenge.correctOrder[index] === event.id
              ? "right"
              : "wrong"
            : null;

          return (
            <li key={event.id}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                  verdict === "right"
                    ? "border-mint/60 bg-mint/10"
                    : verdict === "wrong"
                      ? "border-coral/60 bg-coral/10"
                      : "border-hairline bg-white/[0.03]",
                )}
              >
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/5 font-mono text-xs font-bold text-ink-muted"
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug text-ink">
                    {event.label}
                  </p>
                  {event.detail ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                      {event.detail}
                    </p>
                  ) : null}
                </div>

                {!locked ? (
                  <div className="flex shrink-0 flex-col">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move "${event.label}" earlier`}
                      className="rounded-md p-1 text-ink-muted hover:bg-white/10 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
                    >
                      <ChevronUp className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === order.length - 1}
                      aria-label={`Move "${event.label}" later`}
                      className="rounded-md p-1 text-ink-muted hover:bg-white/10 hover:text-ink disabled:pointer-events-none disabled:opacity-25"
                    >
                      <ChevronDown className="size-4" aria-hidden />
                    </button>
                  </div>
                ) : null}
              </div>

              {index < order.length - 1 ? (
                <ArrowDown
                  className="mx-auto my-1 size-3.5 text-ink-faint/60"
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {locked && result ? (
        <p
          className={cn(
            "rounded-xl border px-4 py-3 text-sm leading-relaxed",
            result.correct
              ? "border-mint/30 bg-mint/[0.07] text-mint-bright"
              : "border-coral/30 bg-coral/[0.07] text-ink-muted",
          )}
        >
          {result.detail ?? result.explanation}
        </p>
      ) : null}
    </div>
  );
}
