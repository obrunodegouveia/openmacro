"use client";

/**
 * Kids mode, remembered in this browser.
 *
 * With it on, a module with a kids path lists only those lessons and each
 * runs only its kids challenges (`@openmacro/core/engine/lessonMode`). The app
 * keeps the same choice in src/services/kidsMode.ts.
 *
 * Same shape as `video-preference.ts`: an external store whose server
 * snapshot is always off, so the prerendered page hydrates quietly and the
 * stored choice lands in an effect straight after.
 */

import * as React from "react";
import type { LessonMode } from "@openmacro/core/engine/lessonMode";

const STORAGE_KEY = "openmacro.kidsMode.v1";

let kids = false;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => kids;
// Never read storage here: this runs on the server too.
const getServerSnapshot = () => false;

export function setKidsMode(next: boolean) {
  hydrated = true;
  if (next === kids) return;
  kids = next;
  emit();
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Private mode, blocked storage: it holds for this visit only.
  }
}

/** `[on, setOn]`, shared by every component on the page. */
export function useKidsMode(): [boolean, (next: boolean) => void] {
  const value = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  React.useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (stored === "1" && !kids) {
      kids = true;
      emit();
    }
  }, []);

  return [value, setKidsMode];
}

/** The learner's mode, for `lessonForMode`. */
export function useLessonMode(): LessonMode {
  return useKidsMode()[0] ? "kids" : "standard";
}
