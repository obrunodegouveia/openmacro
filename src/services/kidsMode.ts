/**
 * ============================================================================
 * Kids mode
 * ============================================================================
 *
 * One switch on this device: when it is on, a module with a kids path lists
 * only those lessons and each runs only its kids challenges (see
 * `@openmacro/core/engine/lessonMode`). Modules without a kids path ignore it.
 *
 * Per device, not per account, on purpose: it is a parent handing a phone to
 * a child, and the same account on the parent's own phone should stay as it
 * was. The website keeps the same choice in
 * web/src/components/app/kids-mode.ts.
 *
 * Same shape as `videoPreference.ts`: a module-level store hydrated at import,
 * so the module page and the lesson runner agree without a provider.
 */

import { useSyncExternalStore } from 'react';

import type { LessonMode } from '@openmacro/core/engine/lessonMode';
import { readVersioned, writeVersioned } from '@/services/localStore';

const STORAGE_KEY = 'openmacro.kidsMode.v1';
const STORAGE_VERSION = 1;

interface StoredChoice {
  kids: boolean;
}

function isStoredChoice(value: unknown): value is StoredChoice {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StoredChoice).kids === 'boolean'
  );
}

let kids = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

async function hydrate(): Promise<void> {
  const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isStoredChoice);
  if (stored && stored.kids !== kids) {
    kids = stored.kids;
    emit();
  }
}

// At import, so the module page does not draw the grown-up list first and
// then swap it for the kids one.
void hydrate();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return kids;
}

/** Turn kids mode on or off. Persisted; failure to persist is survivable. */
export function setKidsMode(next: boolean): void {
  if (next === kids) return;
  kids = next;
  emit();
  writeVersioned(STORAGE_KEY, STORAGE_VERSION, { kids: next }).catch(() => {});
}

/** `[on, setOn]`, shared by every screen. */
export function useKidsMode(): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [value, setKidsMode];
}

/** The learner's mode, for `lessonForMode`. */
export function useLessonMode(): LessonMode {
  return useKidsMode()[0] ? 'kids' : 'standard';
}
