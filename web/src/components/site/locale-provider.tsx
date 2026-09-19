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
 * WHY THIS EXISTS AT ALL, GIVEN THE URL ALREADY SAYS
 * ---------------------------------------------------------------------------
 *
 * It used to be the only answer: the language lived in `localStorage`, every
 * URL served English HTML, and the reader's choice was applied after
 * hydration. `middleware.ts` replaced that — `/pt/...` is now a real address
 * per page, with its own `hreflang` pair and its own entry in the sitemap, and
 * `initialLocale` is handed down from the server so the HTML a crawler fetches
 * is already Portuguese.
 *
 * What is left for this provider is everything a client island needs: the
 * translator, the localised course, and the language the picker highlights.
 * The URL still wins whenever it says anything, so the stored preference only
 * decides for a tree mounted outside the routed layout.
 *
 * The one thing to remember when adding to the site: an internal link must go
 * through `<LocaleLink>`, or it will send a Portuguese reader to the English
 * page. That was true of all forty of them until it was fixed.
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

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  /** From the URL, via middleware. Authoritative when present. */
  initialLocale?: Locale;
}) {
  const stored = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // The URL wins whenever it says something. /pt/learn is Portuguese for
  // everyone who opens it — a crawler, a shared link, someone whose stored
  // preference says otherwise — which is the property that makes the page
  // indexable as Portuguese at all. The stored preference is the fallback for
  // any tree mounted outside the routed layout.
  const locale = initialLocale ?? stored;

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
