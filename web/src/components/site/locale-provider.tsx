"use client";

/**
 * ============================================================================
 * Which language the site is in
 * ============================================================================
 *
 * The web twin of the app's `LocaleProvider`, sharing its catalogues and its
 * content overlays from `@openmacro/core/i18n` — which is the entire reason
 * those live in the shared package. "Sign out" is translated once.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS CLIENT-SIDE, AND WHAT THAT COSTS
 * ---------------------------------------------------------------------------
 *
 * Every lesson page is statically prerendered in English at build time, and
 * that English HTML is what a crawler sees. The reader's language is applied
 * after hydration.
 *
 * That is the right trade for the learner-facing app — it is behind a choice,
 * it is interactive, and nobody is finding a lesson player through search in a
 * language the page does not claim to be in. It is *not* the right answer for
 * the marketing pages, and they are deliberately left alone: a genuinely
 * multilingual site needs a `/pt/...` URL per page so that each language has
 * its own crawlable address and `hreflang` pair. That is a routing decision
 * with consequences for the sitemap, the canonical tags and every internal
 * link, and it should be made deliberately rather than arriving as a side
 * effect of adding a language toggle.
 *
 * So: the course speaks Portuguese, the sales pitch does not yet. The gap is
 * visible, on purpose, rather than papered over.
 */

import * as React from "react";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_NAMES,
  LOCALE_TAGS,
  createTranslator,
  isLocale,
  resolveLocale,
  uiCoverage,
  type Locale,
  type Translator,
} from "@openmacro/core/i18n";
import {
  contentCoverage,
  localisedCourse,
  localisedLessonById,
  localisedModules,
  localisedNextLesson,
} from "@openmacro/core/i18n/content";
import type { Course, Lesson, Module } from "@openmacro/core/content/schema";

const STORAGE_KEY = "openmacro.locale";

interface LocaleContextValue {
  locale: Locale;
  t: Translator;
  available: readonly Locale[];
  names: Readonly<Record<Locale, string>>;
  setLocale: (locale: Locale) => void;
  partial: boolean;
  course: Course;
  modules: readonly Module[];
  lessonById: (lessonId: string) => Lesson | undefined;
  nextLesson: (lessonId: string) => Lesson | undefined;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/**
 * ---------------------------------------------------------------------------
 * The chosen language, as an external store
 * ---------------------------------------------------------------------------
 *
 * `localStorage` and `navigator.languages` do not exist during prerender, so
 * the language cannot simply be initial state: reading it during render would
 * make the markup differ from the prerendered HTML and React would throw the
 * whole tree away with a hydration error.
 *
 * `useSyncExternalStore` is the API for exactly this. It renders
 * `getServerSnapshot` on the server and through hydration, then switches to
 * `getSnapshot` — one extra render, no mismatch, and no `setState` inside an
 * effect causing a cascade. The alternative (`useState` plus a mount effect)
 * works but is the pattern React 19's lint rule exists to discourage.
 */
const listeners = new Set<() => void>();
let resolved: Locale | null = null;

function readPreference(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Private mode, or storage disabled. The device preference still works.
  }
  try {
    return resolveLocale(navigator.languages ?? [navigator.language]);
  } catch {
    return DEFAULT_LOCALE;
  }
}

/** Cached: `useSyncExternalStore` requires a snapshot that is stable between
 *  changes, and re-reading storage on every render would also be wasteful. */
function getSnapshot(): Locale {
  if (resolved === null) resolved = readPreference();
  return resolved;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function publish(next: Locale): void {
  resolved = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice applies to this visit and is simply not remembered.
  }
  for (const listener of listeners) listener();
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // `<html lang>` is server-rendered as "en" and corrected here. Screen
  // readers pick their pronunciation from it, so leaving Portuguese prose
  // labelled English is an accessibility defect and not a cosmetic one.
  React.useEffect(() => {
    document.documentElement.lang = LOCALE_TAGS[locale];
  }, [locale]);

  const value = React.useMemo<LocaleContextValue>(() => {
    const translated = contentCoverage(locale);
    const done = translated.reduce((sum, entry) => sum + entry.translated, 0);
    const all = translated.reduce((sum, entry) => sum + entry.total, 0);

    return {
      locale,
      t: createTranslator(locale),
      available: LOCALES,
      names: LOCALE_NAMES,
      setLocale: publish,
      partial:
        locale !== DEFAULT_LOCALE &&
        (all === 0 || done / all < 0.9 || uiCoverage(locale) < 1),
      course: localisedCourse(locale),
      modules: localisedModules(locale),
      lessonById: (lessonId) => localisedLessonById(locale, lessonId),
      nextLesson: (lessonId) => localisedNextLesson(locale, lessonId),
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = React.useContext(LocaleContext);
  if (!value) {
    throw new Error("[OpenMacro] useLocale() must be used inside <LocaleProvider>.");
  }
  return value;
}
