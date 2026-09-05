/**
 * Pure evaluation layer for `interactive_sim` challenges.
 *
 * Kept free of React so it can be unit-tested and reused (e.g. by a future
 * web playground) without a renderer.
 */

import { getFormula, type FormulaInputs } from '@/content/formulas';
import type {
  Comparator,
  InteractiveSimChallenge,
  SimObjective,
} from '@/content/schema';

const DEFAULT_TOLERANCE = 0.001;

/** Slider values keyed by `SimSlider.key`. */
export type SimSliderValues = Readonly<Record<string, number>>;

/** Computed readout values keyed by `SimReadout.key`. */
export type SimReadoutValues = Readonly<Record<string, number>>;

/** Every slider's `defaultValue`, used to seed the widget. */
export function initialSliderValues(challenge: InteractiveSimChallenge): SimSliderValues {
  const values: Record<string, number> = {};
  for (const slider of challenge.sliders) {
    values[slider.key] = slider.defaultValue;
  }
  return values;
}

/**
 * Evaluates every readout top-to-bottom. Each formula sees the constants, the
 * live slider values, and any readout computed before it — so readouts can be
 * chained without re-deriving intermediate results.
 */
export function evaluateReadouts(
  challenge: InteractiveSimChallenge,
  sliderValues: SimSliderValues,
): SimReadoutValues {
  const scope: Record<string, number> = { ...challenge.constants, ...sliderValues };
  const results: Record<string, number> = {};

  for (const readout of challenge.readouts) {
    const formula = getFormula(readout.formulaId);
    if (!formula) {
      // A missing formula is a content bug, not a runtime crash. Surface it
      // loudly in development and degrade to 0 in production.
      if (__DEV__) {
        console.warn(
          `[OpenMacro] Unknown formulaId "${readout.formulaId}" on readout "${readout.key}".`,
        );
      }
      results[readout.key] = 0;
      scope[readout.key] = 0;
      continue;
    }
    const value = formula(scope as FormulaInputs);
    results[readout.key] = value;
    scope[readout.key] = value;
  }

  return results;
}

function compare(actual: number, comparator: Comparator, expected: number, tolerance: number): boolean {
  switch (comparator) {
    case 'eq':
      return Math.abs(actual - expected) <= tolerance;
    case 'gte':
      return actual >= expected - tolerance;
    case 'lte':
      return actual <= expected + tolerance;
    case 'gt':
      return actual > expected + tolerance;
    case 'lt':
      return actual < expected - tolerance;
  }
}

/** One line of the objective checklist shown next to the sim. */
export interface ObjectiveStep {
  id: string;
  label: string;
  done: boolean;
}

/**
 * Builds the objective checklist.
 *
 * `observed` is the set of slider values the learner has actually rested on
 * during this attempt — see `SimObjective.requiredObservations`. Encoded as
 * `"<sliderKey>:<value>"` so the caller can keep it in a flat Set.
 */
export function observationKey(sliderKey: string, value: number): string {
  return `${sliderKey}:${value}`;
}

export function buildObjectiveSteps(
  objective: SimObjective,
  observed: ReadonlySet<string>,
  readouts: SimReadoutValues,
  formatValue: (value: number, sliderKey: string) => string,
): ObjectiveStep[] {
  const steps: ObjectiveStep[] = [];

  for (const requirement of objective.requiredObservations ?? []) {
    for (const value of requirement.values) {
      const key = observationKey(requirement.sliderKey, value);
      steps.push({
        id: key,
        label: `Try ${formatValue(value, requirement.sliderKey)}`,
        done: observed.has(key),
      });
    }
  }

  if (objective.target) {
    const { readoutKey, comparator, value, tolerance } = objective.target;
    const actual = readouts[readoutKey] ?? 0;
    steps.push({
      id: `target:${readoutKey}`,
      label: objective.description,
      done: compare(actual, comparator, value, tolerance ?? DEFAULT_TOLERANCE),
    });
  }

  return steps;
}

/** True when every objective step is satisfied. */
export function isObjectiveComplete(steps: readonly ObjectiveStep[]): boolean {
  return steps.every((step) => step.done);
}
