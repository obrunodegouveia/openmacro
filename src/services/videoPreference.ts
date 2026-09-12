/**
 * ============================================================================
 * Whether videos are collapsed
 * ============================================================================
 *
 * One preference, shared by every video card and remembered across sessions.
 *
 * It is deliberately not per-video state. A toggle that reset on the next
 * lesson would collapse the thing in front of you and then hand you the same
 * problem twenty-four lessons in a row — the Khan Academy module alone has a
 * video on every one of them. Somebody who has decided they do not want the
 * player taking half the screen has decided it once, not once per lesson.
 *
 * A module-level store rather than context, because the cards that need to
 * agree are not under a common provider — one renders in the lesson runner,
 * others on the course map — and `useSyncExternalStore` keeps them in step
 * without threading a provider through both trees.
 *
 * Reads are best-effort. Storage can be unavailable, and the honest fallback
 * is the default: videos visible, exactly as before this existed.
 */

import { useSyncExternalStore } from 'react';

import { readVersioned, writeVersioned } from '@/services/localStore';

const STORAGE_KEY = 'openmacro.videoCollapsed.v1';
const STORAGE_VERSION = 1;

interface StoredChoice {
  collapsed: boolean;
}

function isStoredChoice(value: unknown): value is StoredChoice {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StoredChoice).collapsed === 'boolean'
  );
}

let collapsed = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

async function hydrate(): Promise<void> {
  const stored = await readVersioned(STORAGE_KEY, STORAGE_VERSION, isStoredChoice);
  if (stored && stored.collapsed !== collapsed) {
    collapsed = stored.collapsed;
    emit();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Start reading at import rather than when the first card mounts. Storage is
// async, so a read that begins on mount means the first frame is drawn from
// the default — the full-height player appears and is then yanked away. This
// module is pulled in by the lesson screen, which the router evaluates long
// before anyone reaches a lesson with a video, so by then the answer is in.
void hydrate();

function getSnapshot(): boolean {
  return collapsed;
}

/** Collapse or expand every video card. Persisted; failure to persist is survivable. */
export function setVideosCollapsed(next: boolean): void {
  if (next === collapsed) return;
  collapsed = next;
  emit();
  writeVersioned(STORAGE_KEY, STORAGE_VERSION, { collapsed: next }).catch(() => {});
}

/** `[collapsed, setCollapsed]`, shared by every card on screen. */
export function useVideosCollapsed(): [boolean, (next: boolean) => void] {
  // The third argument matters for the web export, which renders this tree
  // without a server pass; returning the same snapshot keeps the two in step.
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [value, setVideosCollapsed];
}
