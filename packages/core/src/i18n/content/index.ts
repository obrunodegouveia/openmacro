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
import { DEFAULT_LOCALE, type Locale } from '../locales';
import { collectKeys, coverage, localiseModule, type ContentDictionary } from '../localise';
import { ptPTContent } from './pt-PT';

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
};

/** Every module, with `locale`'s overlay applied where it has one. */
export function localisedModules(locale: Locale): readonly Module[] {
  if (locale === DEFAULT_LOCALE) return MODULES;
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  return MODULES.map((module) => {
    const dictionary = translation.modules[module.id];
    return dictionary ? localiseModule(module, dictionary) : module;
  });
}

/** The course, with its own title and description translated too. */
export function localisedCourse(locale: Locale): Course {
  if (locale === DEFAULT_LOCALE) return COURSE;
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  const modules = localisedModules(locale);
  return {
    ...COURSE,
    title: translation.course?.['course.title'] ?? COURSE.title,
    description: translation.course?.['course.description'] ?? COURSE.description,
    modules: [...modules],
  };
}

/** Flat, in path order — the localised twin of `ALL_LESSONS`. */
export function localisedLessons(locale: Locale): readonly Lesson[] {
  return localisedModules(locale).flatMap((module) => module.lessons);
}

export function localisedLessonById(locale: Locale, lessonId: string): Lesson | undefined {
  return localisedLessons(locale).find((lesson) => lesson.id === lessonId);
}

/**
 * The lesson after this one, in path order.
 *
 * Reimplemented against the localised list rather than calling the registry's
 * `getNextLesson`, which would hand back the English object and quietly undo
 * the translation on the completion screen.
 */
export function localisedNextLesson(locale: Locale, lessonId: string): Lesson | undefined {
  const lessons = localisedLessons(locale);
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

export function contentCoverage(locale: Locale): ModuleCoverage[] {
  const translation = TRANSLATIONS[locale] ?? EMPTY;
  return MODULES.map((module) => {
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
