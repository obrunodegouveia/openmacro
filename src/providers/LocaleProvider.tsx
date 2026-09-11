/**
 * ============================================================================
 * Which language the app is in
 * ============================================================================
 *
 * Three things live here, because they are the same question asked three ways:
 *
 *   `locale`     which language is in force
 *   `t`          an interface string in that language
 *   `modules`    the course content in that language
 *
 * Components take all three from `useLocale()` and never import `MODULES` or
 * `translate` directly. That is the point of the provider: there is exactly one
 * place that decides what language this session is in, so there is no way for
 * the path screen and the lesson runner to disagree.
 *
 * ---------------------------------------------------------------------------
 * HOW THE LANGUAGE IS CHOSEN
 * ---------------------------------------------------------------------------
 *
 * A saved choice beats the device. If the learner has never chosen, the
 * device's ordered language preferences are matched against what we ship, and
 * English is the answer when nothing matches.
 *
 * The first render is deliberately not blocked on reading storage. Waiting for
 * AsyncStorage before showing anything would add a blank frame to every cold
 * start for the sake of a preference most people never set; instead the device
 * language renders immediately and a saved choice, if there is one, arrives a
 * few milliseconds later. The visible consequence is that someone whose phone
 * is Portuguese but who chose English sees one frame of Portuguese, which is
 * a smaller cost than a slower launch for everybody.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getLocales } from 'expo-localization';

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_NAMES,
  LOCALES,
  createTranslator,
  resolveLocale,
  uiCoverage,
  type Locale,
  type Translator,
} from '@openmacro/core/i18n';
import {
  contentCoverage,
  localisedCourse,
  localisedLessonById,
  localisedModules,
  localisedNextLesson,
} from '@openmacro/core/i18n/content';
import type { Course, Lesson, Module } from '@openmacro/core/content/schema';
import { readVersioned, writeVersioned } from '@/services/localStore';

const STORAGE_KEY = 'openmacro.locale.v1';
const STORAGE_VERSION = 1;

interface StoredChoice {
  locale: Locale;
}

function isStoredChoice(value: unknown): value is StoredChoice {
  return (
    typeof value === 'object' &&
    value !== null &&
    isLocale((value as StoredChoice).locale)
  );
}

/**
 * The device's preferred languages, best first.
 *
 * `getLocales()` is documented to return at least one entry, but this runs at
 * module scope on every cold start on three platforms, and a crash here would
 * be a crash before the first frame. English is a fine answer to a broken
 * locale API.
 */
function deviceLocale(): Locale {
  try {
    return resolveLocale(getLocales().map((entry) => entry.languageTag));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export interface LocaleContextValue {
  /** The language in force. */
  locale: Locale;
  /** Translate an interface string. */
  t: Translator;
  /** Every language the app ships, for a picker. */
  available: readonly Locale[];
  /** What each language calls itself. */
  names: Readonly<Record<Locale, string>>;
  /** Choose a language, and remember the choice. */
  setLocale: (locale: Locale) => void;
  /**
   * True when this language's content is meaningfully incomplete, so the UI
   * can say so rather than letting mixed English and Portuguese look like a
   * bug. English is never partial by definition.
   */
  partial: boolean;

  // -- the course, in this language ----------------------------------------
  course: Course;
  modules: readonly Module[];
  lessonById: (lessonId: string) => Lesson | undefined;
  nextLesson: (lessonId: string) => Lesson | undefined;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(deviceLocale);

  // Load the saved choice, once, without blocking the first paint.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isStoredChoice);
      if (!cancelled && stored) setLocaleState(stored.locale);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // The language has already changed on screen. A failed write means the
    // choice is not remembered next launch — not that this launch should
    // refuse to switch — so the rejection is swallowed rather than left
    // unhandled.
    writeVersioned(STORAGE_KEY, STORAGE_VERSION, { locale: next }).catch(() => {});
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const modules = localisedModules(locale);
    const translated = contentCoverage(locale);
    const done = translated.reduce((sum, entry) => sum + entry.translated, 0);
    const all = translated.reduce((sum, entry) => sum + entry.total, 0);

    return {
      locale,
      t: createTranslator(locale),
      available: LOCALES,
      names: LOCALE_NAMES,
      setLocale,
      // Below 90% there is enough English mixed in to be worth explaining.
      partial: locale !== DEFAULT_LOCALE && (all === 0 || done / all < 0.9 || uiCoverage(locale) < 1),
      course: localisedCourse(locale),
      modules,
      lessonById: (lessonId) => localisedLessonById(locale, lessonId),
      nextLesson: (lessonId) => localisedNextLesson(locale, lessonId),
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('[OpenMacro] useLocale() must be used inside <LocaleProvider>.');
  }
  return value;
}

/** Shorthand for the common case of wanting only the translate function. */
export function useTranslate(): Translator {
  return useLocale().t;
}
