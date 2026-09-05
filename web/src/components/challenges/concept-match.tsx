"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { seededShuffle } from "@openmacro/core/format";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * Match each term to its definition.
 *
 * Tap-to-pair rather than drag-and-drop. Dragging is fiddly with a mouse, worse
 * on a phone, and impossible from a keyboard; two taps work identically for
 * everyone and need no pointer events at all.
 *
 * Definitions are shuffled with a seed derived from the challenge id, so the
 * order looks arbitrary but never changes under the learner mid-attempt.
 */
export function ConceptMatchView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"concept_match">) {
  const definitions = React.useMemo(
    () => seededShuffle(challenge.pairs, challenge.id),
    [challenge.pairs, challenge.id],
  );

  /** termId -> definitionId */
  const [pairings, setPairings] = React.useState<Record<string, string>>({});
  const [activeTerm, setActiveTerm] = React.useState<string | null>(null);

  const definitionToTerm = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const [term, def] of Object.entries(pairings)) map[def] = term;
    return map;
  }, [pairings]);

  function publish(next: Record<string, string>) {
    setPairings(next);
    // Only a complete set is a submittable answer; a partial map stays null so
    // the runner keeps Check disabled.
    const complete = Object.keys(next).length === challenge.pairs.length;
    onAnswerChange(complete ? { type: "concept_match", pairings: next } : null);
  }

  function pickTerm(termId: string) {
    if (locked) return;
    // Tapping a matched term unpairs it, which is the only way back from a
    // mistake without a separate "clear" affordance.
    if (pairings[termId]) {
      const next = { ...pairings };
      delete next[termId];
      publish(next);
      setActiveTerm(termId);
      return;
    }
    setActiveTerm((current) => (current === termId ? null : termId));
  }

  function pickDefinition(definitionId: string) {
    if (locked || !activeTerm) return;
    const next = { ...pairings };
    // A definition can only serve one term: steal it from whoever holds it.
    const holder = definitionToTerm[definitionId];
    if (holder) delete next[holder];
    next[activeTerm] = definitionId;
    publish(next);
    setActiveTerm(null);
  }

  /** After grading, which pairings were actually right. */
  function verdictFor(termId: string): "right" | "wrong" | null {
    if (!locked) return null;
    return pairings[termId] === termId ? "right" : "wrong";
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
        {activeTerm && !locked
          ? "Now pick its definition"
          : "Pick a term, then its definition"}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Terms ------------------------------------------------------- */}
        <ul className="flex flex-col gap-2">
          {challenge.pairs.map((pair) => {
            const matched = pairings[pair.id];
            const verdict = verdictFor(pair.id);
            return (
              <li key={pair.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => pickTerm(pair.id)}
                  aria-pressed={activeTerm === pair.id}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
                    verdict === "right"
                      ? "border-mint/60 bg-mint/10 text-mint-bright"
                      : verdict === "wrong"
                        ? "border-coral/60 bg-coral/10 text-ink"
                        : activeTerm === pair.id
                          ? "border-mint bg-mint/15 text-ink"
                          : matched
                            ? "border-white/20 bg-white/[0.07] text-ink"
                            : "border-hairline bg-white/[0.03] text-ink-muted hover:text-ink",
                  )}
                >
                  {pair.term}
                  {matched ? (
                    <span className="mt-1 block truncate text-xs font-semibold text-ink-faint">
                      {challenge.pairs.find((p) => p.id === matched)?.definition}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Definitions -------------------------------------------------- */}
        <ul className="flex flex-col gap-2">
          {definitions.map((pair) => {
            const takenBy = definitionToTerm[pair.id];
            return (
              <li key={pair.id}>
                <button
                  type="button"
                  disabled={locked || !activeTerm}
                  onClick={() => pickDefinition(pair.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-sm leading-snug transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
                    "disabled:cursor-default",
                    takenBy
                      ? "border-white/20 bg-white/[0.07] text-ink-faint line-through"
                      : activeTerm
                        ? "border-mint/40 bg-white/[0.04] text-ink hover:border-mint hover:bg-mint/10"
                        : "border-hairline bg-white/[0.03] text-ink-muted",
                  )}
                >
                  {pair.definition}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {locked && result ? (
        <p
          className={cn(
            "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm leading-relaxed",
            result.correct
              ? "border-mint/30 bg-mint/[0.07] text-mint-bright"
              : "border-coral/30 bg-coral/[0.07] text-ink-muted",
          )}
        >
          {result.correct ? (
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
          ) : null}
          {result.detail ?? result.explanation}
        </p>
      ) : null}
    </div>
  );
}
