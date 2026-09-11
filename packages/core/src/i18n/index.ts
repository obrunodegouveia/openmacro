/**
 * The i18n surface both apps import.
 *
 * Keeping the catalogues in `packages/core` rather than in either app is what
 * stops "Sign out" being translated twice, differently, and drifting.
 */
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  LOCALE_TAGS,
  isLocale,
  resolveLocale,
  type Locale,
} from './locales';

export {
  collectKeys,
  localiseModule,
  coverage,
  type ContentDictionary,
} from './localise';

export { en, type UiKey, type UiDictionary } from './ui/en';
export { ptPT } from './ui/pt-PT';

import { en, type UiDictionary, type UiKey } from './ui/en';
import { ptPT } from './ui/pt-PT';
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from './locales';
import { formatMessage, messageArguments, type MessageValues } from './format';

const CATALOGUES: Record<Locale, UiDictionary> = {
  en,
  'pt-PT': ptPT,
};

export type TranslationValues = MessageValues;

/**
 * Translate one interface string.
 *
 * Falls back to English per *key*, not per language, so a half-translated
 * locale shows Portuguese where it has it and English where it does not,
 * rather than reverting wholesale the moment one string is missing.
 *
 * Values are substituted with ICU MessageFormat — `{name}`, `{n, number}` and
 * `{n, plural, one {…} other {…}}`. See `format.ts` for why the plural form
 * is not a ternary in a component.
 *
 * Note which locale's rules apply: the *template's*, not the requested one.
 * A key that has fallen back to English is an English sentence, and selecting
 * its plural form with Portuguese rules would eventually pick a form the
 * English string does not define.
 */
export function translate(locale: Locale, key: UiKey, values?: TranslationValues): string {
  const catalogue = CATALOGUES[locale] ?? CATALOGUES[DEFAULT_LOCALE];
  const translated = catalogue[key];
  const template = translated ?? en[key];
  const tag = LOCALE_TAGS[translated !== undefined ? locale : DEFAULT_LOCALE];
  if (!values) return template;
  return formatMessage(template, tag, values);
}

/**
 * A translate function with the locale already bound.
 *
 * The engine takes one of these rather than a `Locale`, which keeps
 * `packages/core/src/engine` free of any opinion about how languages are
 * chosen, stored or loaded — it is handed a function that turns a key into a
 * sentence, and that is the whole of its involvement.
 */
export type Translator = (key: UiKey, values?: TranslationValues) => string;

export function createTranslator(locale: Locale): Translator {
  return (key, values) => translate(locale, key, values);
}

/** The English translator, for callers with no locale of their own. */
export const englishTranslator: Translator = createTranslator(DEFAULT_LOCALE);

/**
 * Pick one of a numbered family of keys (`grade.correct.1` … `.4`) from a seed.
 *
 * Deterministic, so the feedback sheet varies its phrasing across a lesson
 * without becoming impossible to snapshot-test. `count` is the number of
 * variants English defines; a translation with fewer distinct phrases just
 * repeats itself, which is a smaller problem than a missing string.
 */
export function pickVariant(
  t: Translator,
  prefix: 'grade.correct' | 'grade.incorrect',
  count: number,
  seed: string,
): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  const index = (hash % count) + 1;
  return t(`${prefix}.${index}` as UiKey);
}

/**
 * A locale's interface catalogue, exactly as stored.
 *
 * Unlike `translate`, this does not fall back to English — an absent key reads
 * as absent. The round-trip tooling needs to tell "translated as the same word"
 * from "not translated", and `translate` deliberately cannot.
 */
export function uiCatalogue(locale: Locale): UiDictionary {
  return CATALOGUES[locale] ?? {};
}

/** How complete a locale's interface catalogue is, 0 to 1. */
export function uiCoverage(locale: Locale): number {
  const keys = Object.keys(en) as UiKey[];
  const catalogue = CATALOGUES[locale] ?? {};
  return keys.filter((key) => typeof catalogue[key] === 'string').length / keys.length;
}

/**
 * Structural faults in a locale's catalogue.
 *
 * A translator works in a spreadsheet, and the two mistakes that spreadsheet
 * makes are typing `{nome}` for `{name}` and dropping a `}`. Neither is a
 * type error — the catalogue is `Partial<Record<UiKey, string>>` and a string
 * is a string — and neither shows up until the sentence renders, with a
 * visible `{nome}` in it or, worse, half a sentence.
 *
 * So it is checked instead: every argument a translation names must be one
 * the English source also names, and braces must balance. Run by
 * `npm run i18n:status --strict` in CI.
 */
export interface CatalogueProblem {
  readonly key: UiKey;
  readonly problem: string;
}

export function validateCatalogue(locale: Locale): CatalogueProblem[] {
  const catalogue = CATALOGUES[locale] ?? {};
  const problems: CatalogueProblem[] = [];

  for (const key of Object.keys(en) as UiKey[]) {
    const translated = catalogue[key];
    if (translated === undefined) continue;

    let depth = 0;
    for (const char of translated) {
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      if (depth < 0) break;
    }
    if (depth !== 0) {
      problems.push({ key, problem: 'unbalanced braces' });
      continue;
    }

    const source = messageArguments(en[key]);
    for (const name of messageArguments(translated)) {
      if (!source.has(name)) {
        problems.push({
          key,
          problem: `uses {${name}}, which the English source does not provide`,
        });
      }
    }
  }

  return problems;
}

/** The interface keys a locale has not translated yet, in catalogue order. */
export function missingUiKeys(locale: Locale): UiKey[] {
  const catalogue = CATALOGUES[locale] ?? {};
  return (Object.keys(en) as UiKey[]).filter((key) => typeof catalogue[key] !== 'string');
}
