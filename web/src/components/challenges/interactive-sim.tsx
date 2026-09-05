"use client";

import * as React from "react";
import { Check } from "lucide-react";
import {
  buildObjectiveSteps,
  evaluateReadouts,
  initialSliderValues,
  isObjectiveComplete,
  observationKey,
  type SimSliderValues,
} from "@openmacro/core/engine/simulation";
import { formatValue, snapToStep } from "@openmacro/core/format";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * A live model the learner drives with sliders.
 *
 * The point is the objective checklist, not the sliders: `requiredObservations`
 * forces the learner to actually park on 10% and on 20% before the answer can
 * be submitted. Without that this is a toy you can skip past; with it, the
 * comparison is the lesson.
 */
export function InteractiveSimView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"interactive_sim">) {
  const currency = challenge.currency ?? "USD";
  const [values, setValues] = React.useState<SimSliderValues>(() =>
    initialSliderValues(challenge),
  );
  /** Every slider position the learner has rested on this attempt. */
  const [observed, setObserved] = React.useState<ReadonlySet<string>>(
    () => new Set(Object.entries(initialSliderValues(challenge)).map(([k, v]) => observationKey(k, v))),
  );

  const readouts = React.useMemo(
    () => evaluateReadouts(challenge, values),
    [challenge, values],
  );

  const steps = React.useMemo(
    () =>
      buildObjectiveSteps(challenge.objective, observed, readouts, (value, sliderKey) => {
        const slider = challenge.sliders.find((s) => s.key === sliderKey);
        return formatValue(value, slider?.format ?? "number", currency);
      }),
    [challenge, observed, readouts, currency],
  );

  const complete = isObjectiveComplete(steps);

  React.useEffect(() => {
    onAnswerChange(
      complete
        ? { type: "interactive_sim", sliderValues: values, observed: [...observed] }
        : null,
    );
  }, [complete, values, observed, onAnswerChange]);

  function setSlider(key: string, raw: number) {
    if (locked) return;
    const slider = challenge.sliders.find((s) => s.key === key);
    if (!slider) return;
    const snapped = snapToStep(raw, slider.min, slider.step);
    setValues((current) => ({ ...current, [key]: snapped }));
    setObserved((current) => new Set(current).add(observationKey(key, snapped)));
  }

  const hero = challenge.readouts.find((readout) => readout.emphasis);
  const rest = challenge.readouts.filter((readout) => !readout.emphasis);

  return (
    <div className="flex flex-col gap-5">
      {challenge.narrative ? (
        <p className="text-sm leading-relaxed text-ink-muted">{challenge.narrative}</p>
      ) : null}

      {/* Readouts ------------------------------------------------------- */}
      <div className="rounded-2xl border border-hairline bg-white/[0.03] p-5">
        {hero ? (
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
              {hero.label}
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-mint-bright tabular-nums">
              {formatValue(readouts[hero.key] ?? 0, hero.format, currency)}
            </p>
            {hero.caption ? (
              <p className="mt-1 font-mono text-xs text-ink-faint">{hero.caption}</p>
            ) : null}
          </div>
        ) : null}

        {rest.length ? (
          <dl
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              hero && "mt-5 border-t border-hairline pt-5",
            )}
          >
            {rest.map((readout) => (
              <div key={readout.key}>
                <dt className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
                  {readout.label}
                </dt>
                <dd className="mt-0.5 font-display text-xl font-extrabold tabular-nums text-ink">
                  {formatValue(readouts[readout.key] ?? 0, readout.format, currency)}
                </dd>
                {readout.caption ? (
                  <p className="mt-0.5 font-mono text-[0.7rem] text-ink-faint">
                    {readout.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* Sliders -------------------------------------------------------- */}
      <div className="flex flex-col gap-5">
        {challenge.sliders.map((slider) => {
          const value = values[slider.key] ?? slider.defaultValue;
          return (
            <div key={slider.key}>
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor={`sim-${challenge.id}-${slider.key}`}
                  className="text-sm font-bold text-ink"
                >
                  {slider.label}
                </label>
                <span className="font-display text-base font-extrabold tabular-nums text-gold">
                  {formatValue(value, slider.format, currency)}
                </span>
              </div>
              <input
                id={`sim-${challenge.id}-${slider.key}`}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step || "any"}
                value={value}
                disabled={locked}
                onChange={(event) => setSlider(slider.key, Number(event.target.value))}
                className="mt-2 w-full accent-[var(--color-mint)] disabled:opacity-50"
              />
              {slider.hint ? (
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">{slider.hint}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Objective ------------------------------------------------------ */}
      <div className="rounded-2xl border border-hairline bg-white/[0.03] p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
          {challenge.objective.description}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center gap-2 text-sm font-semibold">
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md border",
                  step.done
                    ? "border-mint bg-mint text-abyss"
                    : "border-white/20 bg-white/5",
                )}
              >
                {step.done ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              <span className={step.done ? "text-mint-bright" : "text-ink-muted"}>
                {step.label}
              </span>
              <span className="sr-only">{step.done ? " — done" : " — not yet"}</span>
            </li>
          ))}
        </ul>
      </div>

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
