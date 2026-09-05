/**
 * ============================================================================
 * Content validation
 * ============================================================================
 *
 * TypeScript catches the shape of a lesson; this catches the things types
 * cannot: dangling ids, unregistered formulas, unreachable objectives,
 * duplicate keys, off-grid slider targets.
 *
 * Run over the whole registry by `npm run lint:content`, and automatically in
 * development when the app boots (see `app/_layout.tsx`) so a contributor sees
 * their mistake the moment they hot-reload.
 */

import { isKnownFormulaId } from '@/content/formulas';
import type { BalanceSheetShift, Challenge, Lesson, Module } from '@/content/schema';

/** Amounts are authored as plain numbers; tolerate float noise when summing. */
const AMOUNT_TOLERANCE = 0.005;

/** Identity of a posting, ignoring magnitude. Mirrors `src/engine/tAccounts.ts`. */
function slotKey(shift: BalanceSheetShift): string {
  return `${shift.entityId}::${shift.side}::${shift.account.trim().toLowerCase()}`;
}

export interface ContentIssue {
  /** Dotted path to the offending node, e.g. `lesson[x].challenge[y].options`. */
  path: string;
  message: string;
}

function duplicates(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

/** Is `value` reachable on a slider defined by min/max/step? */
function isOnSliderGrid(value: number, min: number, max: number, step: number): boolean {
  if (value < min - 1e-9 || value > max + 1e-9) return false;
  if (step <= 0) return true; // continuous slider
  const steps = (value - min) / step;
  return Math.abs(steps - Math.round(steps)) < 1e-6;
}

function validateChallenge(challenge: Challenge, path: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const at = (message: string) => issues.push({ path, message });

  if (!challenge.explanation.trim()) {
    at('`explanation` is empty — this is the text the learner actually learns from.');
  }

  switch (challenge.type) {
    case 'multiple_choice': {
      const ids = challenge.options.map((option) => option.id);
      if (challenge.options.length < 2) at('Needs at least 2 options.');
      for (const dupe of duplicates(ids)) at(`Duplicate option id "${dupe}".`);
      if (!ids.includes(challenge.correctOptionId)) {
        at(`correctOptionId "${challenge.correctOptionId}" matches no option.`);
      }
      break;
    }

    case 'concept_match': {
      if (challenge.pairs.length < 2) at('Needs at least 2 pairs.');
      if (challenge.pairs.length > 6) at('More than 6 pairs will not fit a phone screen.');
      for (const dupe of duplicates(challenge.pairs.map((pair) => pair.id))) {
        at(`Duplicate pair id "${dupe}".`);
      }
      for (const pair of challenge.pairs) {
        if (!pair.term.trim() || !pair.definition.trim()) {
          at(`Pair "${pair.id}" has an empty term or definition.`);
        }
      }
      break;
    }

    case 'order_flow': {
      const ids = challenge.events.map((event) => event.id);
      if (challenge.events.length < 2) at('Needs at least 2 events.');
      for (const dupe of duplicates(ids)) at(`Duplicate event id "${dupe}".`);
      if (challenge.correctOrder.length !== challenge.events.length) {
        at('correctOrder must list every event exactly once.');
      }
      for (const eventId of challenge.correctOrder) {
        if (!ids.includes(eventId)) at(`correctOrder references unknown event "${eventId}".`);
      }
      for (const dupe of duplicates(challenge.correctOrder)) {
        at(`correctOrder repeats event "${dupe}".`);
      }
      break;
    }

    case 't_account_flow': {
      const entityIds = challenge.entities.map((entity) => entity.id);

      if (challenge.entities.length < 2) {
        at('Needs at least 2 entities — the point is that one party\u2019s asset is another\u2019s liability.');
      }
      if (challenge.entities.length > 4) {
        at('More than 4 T-accounts will not fit a phone screen.');
      }
      for (const dupe of duplicates(entityIds)) at(`Duplicate entity id "${dupe}".`);
      for (const dupe of duplicates(challenge.options.map((option) => option.id))) {
        at(`Duplicate option id "${dupe}".`);
      }
      if (challenge.expectedShifts.length === 0) at('`expectedShifts` is empty.');

      // Every posting the learner is asked for must actually be offerable.
      const offered = new Set(challenge.options.map((option) => slotKey(option.shift)));
      for (const shift of challenge.expectedShifts) {
        if (!entityIds.includes(shift.entityId)) {
          at(`expectedShifts references unknown entity "${shift.entityId}".`);
          continue;
        }
        const key = slotKey(shift);
        if (!offered.has(key)) {
          at(
            `Expected posting "${shift.account}" (${shift.side}, ${shift.entityId}) is not offered ` +
              'as an option, so the learner can never place it.',
          );
          continue;
        }
        const option = challenge.options.find((entry) => slotKey(entry.shift) === key);
        if (option && Math.abs(option.shift.delta - shift.delta) > AMOUNT_TOLERANCE) {
          at(
            `Expected posting "${shift.account}" wants ${shift.delta} but the matching option ` +
              `offers ${option.shift.delta}, so the correct answer is unreachable.`,
          );
        }
      }

      for (const option of challenge.options) {
        if (!entityIds.includes(option.shift.entityId)) {
          at(`Option "${option.id}" posts to unknown entity "${option.shift.entityId}".`);
        }
        if (option.shift.delta === 0) at(`Option "${option.id}" has a zero delta.`);
      }

      // The rule that matters most: an unbalanced expected answer is a lesson
      // that can never be solved, however plausible each individual posting is.
      for (const entityId of entityIds) {
        let assets = 0;
        let liabilities = 0;
        for (const shift of challenge.expectedShifts) {
          if (shift.entityId !== entityId) continue;
          if (shift.side === 'asset') assets += shift.delta;
          else liabilities += shift.delta;
        }
        if (Math.abs(assets - liabilities) > AMOUNT_TOLERANCE) {
          at(
            `The expected answer leaves "${entityId}" unbalanced: assets move ${assets}, ` +
              `liabilities move ${liabilities}. Double entry means both sides move together.`,
          );
        }
      }

      // Distractors are what make the challenge a test rather than a sort.
      if (challenge.options.length <= challenge.expectedShifts.length) {
        at('Every option is a correct one — add distractors, or this is just sorting.');
      }
      break;
    }

    case 'interactive_sim': {
      const sliderKeys = challenge.sliders.map((slider) => slider.key);
      const readoutKeys = challenge.readouts.map((readout) => readout.key);

      if (challenge.sliders.length === 0) at('Needs at least one slider.');
      if (challenge.readouts.length === 0) at('Needs at least one readout.');
      for (const dupe of duplicates([...sliderKeys, ...readoutKeys, ...Object.keys(challenge.constants)])) {
        at(`Variable name "${dupe}" is declared more than once across constants/sliders/readouts.`);
      }
      if (challenge.readouts.filter((readout) => readout.emphasis).length > 1) {
        at('At most one readout may set `emphasis: true`.');
      }

      for (const slider of challenge.sliders) {
        if (slider.min >= slider.max) at(`Slider "${slider.key}" has min >= max.`);
        if (!isOnSliderGrid(slider.defaultValue, slider.min, slider.max, slider.step)) {
          at(`Slider "${slider.key}" defaultValue ${slider.defaultValue} is not reachable on its own grid.`);
        }
      }

      for (const readout of challenge.readouts) {
        if (!isKnownFormulaId(readout.formulaId)) {
          at(
            `Readout "${readout.key}" uses unregistered formulaId "${readout.formulaId}". ` +
              'Register it in src/content/formulas.ts.',
          );
        }
      }

      for (const requirement of challenge.objective.requiredObservations ?? []) {
        const slider = challenge.sliders.find((s) => s.key === requirement.sliderKey);
        if (!slider) {
          at(`Objective observes unknown slider "${requirement.sliderKey}".`);
          continue;
        }
        for (const value of requirement.values) {
          if (!isOnSliderGrid(value, slider.min, slider.max, slider.step)) {
            at(
              `Objective requires "${requirement.sliderKey}" = ${value}, which the slider cannot reach ` +
                `(min ${slider.min}, max ${slider.max}, step ${slider.step}).`,
            );
          }
        }
      }

      const target = challenge.objective.target;
      if (target && !readoutKeys.includes(target.readoutKey)) {
        at(`Objective targets unknown readout "${target.readoutKey}".`);
      }
      break;
    }

    default: {
      // A new challenge type with no rules here fails to compile.
      const unhandled: never = challenge;
      issues.push({
        path,
        message: `No validation rules for challenge ${JSON.stringify(unhandled)}.`,
      });
    }
  }

  return issues;
}

export function validateLesson(lesson: Lesson, path = `lesson:${lesson.id}`): ContentIssue[] {
  const issues: ContentIssue[] = [];

  if (lesson.challenges.length === 0) {
    issues.push({ path, message: 'Lesson has no challenges.' });
  }
  for (const dupe of duplicates(lesson.challenges.map((challenge) => challenge.id))) {
    issues.push({ path, message: `Duplicate challenge id "${dupe}".` });
  }
  if ((lesson.hearts ?? 3) < 1) {
    issues.push({ path, message: '`hearts` must be at least 1.' });
  }

  for (const challenge of lesson.challenges) {
    issues.push(...validateChallenge(challenge, `${path} > ${challenge.id} (${challenge.type})`));
  }

  return issues;
}

export function validateModules(modules: readonly Module[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const lessonIds: string[] = [];

  for (const module of modules) {
    if (module.lessons.length === 0) {
      issues.push({ path: `module:${module.id}`, message: 'Module has no lessons.' });
    }
    for (const lesson of module.lessons) {
      lessonIds.push(lesson.id);
      issues.push(...validateLesson(lesson, `module:${module.id} > lesson:${lesson.id}`));
    }
  }

  for (const dupe of duplicates(lessonIds)) {
    issues.push({ path: 'registry', message: `Lesson id "${dupe}" is used by more than one lesson.` });
  }

  return issues;
}
