/**
 * The answer content in the reader's language.
 *
 * Same shape as every other overlay here: per-field fallback to English, keyed
 * by a stable id, so a missing translation costs one answer rather than the
 * page. See `answers-pt.ts` for why these are written and not translated.
 */

import type { Locale } from '@openmacro/core/i18n/locales';

import type { Answer } from '@/lib/answers';
import { ANSWERS_PT } from '@/lib/answers-pt';

const OVERLAYS: Partial<Record<Locale, Record<string, { question?: string; answer?: string }>>> = {
  'pt-PT': ANSWERS_PT,
};

export function localisedAnswers(locale: Locale, answers: Answer[]): Answer[] {
  const overlay = OVERLAYS[locale];
  if (!overlay) return answers;
  return answers.map((entry) => {
    const copy = overlay[entry.id];
    if (!copy) return entry;
    return {
      ...entry,
      question: copy.question ?? entry.question,
      answer: copy.answer ?? entry.answer,
    };
  });
}
