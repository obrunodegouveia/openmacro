/**
 * ============================================================================
 * The translated course
 * ============================================================================
 *
 * `content/registry.ts` holds the course in English. This holds the overlays,
 * and hands out a version of the registry with one applied.
 *
 * The split is what keeps the English content authorable. A contributor adding
 * a lesson writes one file and never thinks about languages; a translator adds
 * keys to a dictionary and never opens a lesson file. Neither can break the
 * other, and the only thing that can go stale is coverage — which
 * `npm run i18n:status` prints.
 *
 * ---------------------------------------------------------------------------
 * ON BUNDLE SIZE
 * ---------------------------------------------------------------------------
 *
 * Every locale's dictionaries are imported statically, so an English-only
 * learner still ships the Portuguese strings. At two languages and one
 * translated module that is a few kilobytes and not worth solving. It stops
 * being true somewhere around the fourth language or the fifth translated
 * module, and the fix at that point is a dynamic `import()` per locale behind
 * an async `loadContent(locale)` — which is why everything below goes through
 * one function rather than being read directly.
 */

import type { Course, Lesson, Module } from '../../content/schema';
import { COURSE, MODULES } from '../../content/registry';
import { OPTIONAL_MODULES } from '../../content/optional';
import { DEFAULT_LOCALE, type Locale } from '../locales';
import { collectKeys, coverage, localiseModule, type ContentDictionary } from '../localise';
import { ptPTContent } from './pt-PT';
import { esESContent } from './es-ES';

/**
 * One language's content overlay.
 *
 * Keyed by module id rather than by array position, so reordering `MODULES`
 * or dropping a module cannot silently shift a translation onto the wrong
 * course material.
 */
export interface ContentTranslation {
  /** `course.title`, `course.description`. */
  readonly course?: ContentDictionary;
  /** Module id → that module's dictionary. */
  readonly modules: Readonly<Record<string, ContentDictionary>>;
}

const EMPTY: ContentTranslation = { modules: {} };

const TRANSLATIONS: Record<Locale, ContentTranslation> = {
  en: EMPTY,
  'pt-PT': ptPTContent,
  'es-ES': esESContent,
};

/** The course's own translatable strings, as key → English. */
export function courseKeys(): Record<string, string> {
  return { 'course.title': COURSE.title, 'course.description': COURSE.description };
}

/** The course's overlay for a locale, exactly as stored. */
export function courseDictionary(locale: Locale): ContentDictionary {
  return (TRANSLATIONS[locale] ?? EMPTY).course ?? {};
}

/**
 * One module's overlay for a locale, exactly as stored.
 *
 * The counterpart of `uiCatalogue`: what has actually been translated, with no
 * English filled in. Used by `i18n:extract` to show a translator their own
 * previous work.
 */
export function contentDictionary(locale: Locale, moduleId: string): ContentDictionary {
  return (TRANSLATIONS[locale] ?? EMPTY).modules[moduleId] ?? {};
}

/**
 * The modules a learner may see.
 *
 * The public course, then any private module whose id is in `unlocked` (see
 * `content/optional.ts`). Nobody passes `unlocked` except the providers that
 * read the signed-in learner's grants, so every public page gets the public
 * course and nothing else.
 */
function visibleModules(unlocked: readonly string[]): readonly Module[] {
  if (unlocked.length === 0) return MODULES;
  const extra = OPTIONAL_MODULES.filter((module) => unlocked.includes(module.id));
  return extra.length === 0 ? MODULES : [...MODULES, ...extra];
}

/** Every module, with `locale`'s overlay applied where it has one. */
export function localisedModules(
  locale: Locale,
  unlocked: readonly string[] = [],
): readonly Module[] {
  const modules = visibleModules(unlocked);
  if (locale === DEFAULT_LOCALE) return modules;
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  return modules.map((module) => {
    const dictionary = translation.modules[module.id];
    return dictionary ? localiseModule(module, dictionary) : module;
  });
}

/** The course, with its own title and description translated too. */
export function localisedCourse(locale: Locale, unlocked: readonly string[] = []): Course {
  const modules = localisedModules(locale, unlocked);
  if (locale === DEFAULT_LOCALE) {
    return modules === MODULES ? COURSE : { ...COURSE, modules: [...modules] };
  }
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  return {
    ...COURSE,
    title: translation.course?.['course.title'] ?? COURSE.title,
    description: translation.course?.['course.description'] ?? COURSE.description,
    modules: [...modules],
  };
}

/** Flat, in path order — the localised twin of `ALL_LESSONS`. */
export function localisedLessons(
  locale: Locale,
  unlocked: readonly string[] = [],
): readonly Lesson[] {
  return localisedModules(locale, unlocked).flatMap((module) => module.lessons);
}

export function localisedLessonById(
  locale: Locale,
  lessonId: string,
  unlocked: readonly string[] = [],
): Lesson | undefined {
  return localisedLessons(locale, unlocked).find((lesson) => lesson.id === lessonId);
}

/**
 * The lesson after this one, in path order.
 *
 * Reimplemented against the localised list rather than calling the registry's
 * `getNextLesson`, which would hand back the English object and quietly undo
 * the translation on the completion screen.
 */
export function localisedNextLesson(
  locale: Locale,
  lessonId: string,
  unlocked: readonly string[] = [],
): Lesson | undefined {
  const lessons = localisedLessons(locale, unlocked);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] : undefined;
}

// ---------------------------------------------------------------------------
// Reporting — used by `npm run i18n:status`
// ---------------------------------------------------------------------------

export interface ModuleCoverage {
  readonly moduleId: string;
  readonly title: string;
  readonly translated: number;
  readonly total: number;
  readonly ratio: number;
}

/** Public and private modules alike: a granted learner reads both. */
export function contentCoverage(locale: Locale): ModuleCoverage[] {
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  return [...MODULES, ...OPTIONAL_MODULES].map((module) => {
    const dictionary = translation.modules[module.id] ?? {};
    const ratio = locale === DEFAULT_LOCALE ? 1 : coverage(module, dictionary);
    const total = Object.keys(collectKeys(module)).length;
    return {
      moduleId: module.id,
      title: module.title,
      translated: Math.round(ratio * total),
      total,
      ratio,
    };
  });
}
