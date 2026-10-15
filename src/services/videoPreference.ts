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

// ---------------------------------------------------------------------------
// Subtitles
// ---------------------------------------------------------------------------
//
// The same choice the website keeps in web/src/components/app/video-preference.ts,
// with the same values and the same meaning of 'auto': Portuguese subtitles
// when the app is in Portuguese, none in English. The resolved value is handed
// to the /embed page, whose player picks the actual track.

export type CaptionPreference = 'auto' | 'pt' | 'en' | 'off';

const CAPTIONS_KEY = 'openmacro.videoCaptions.v1';
const CAPTIONS_VERSION = 1;
const CAPTION_VALUES: readonly CaptionPreference[] = ['auto', 'pt', 'en', 'off'];

interface StoredCaptions {
  captions: CaptionPreference;
}

function isStoredCaptions(value: unknown): value is StoredCaptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    CAPTION_VALUES.includes((value as StoredCaptions).captions)
  );
}

let captions: CaptionPreference = 'auto';
const captionListeners = new Set<() => void>();

function emitCaptions(): void {
  for (const listener of captionListeners) listener();
}

async function hydrateCaptions(): Promise<void> {
  const stored = await readVersioned(CAPTIONS_KEY, CAPTIONS_VERSION, isStoredCaptions);
  if (stored && stored.captions !== captions) {
    captions = stored.captions;
    emitCaptions();
  }
}

// At import, for the same reason as the collapsed preference above.
void hydrateCaptions();

function subscribeCaptions(listener: () => void): () => void {
  captionListeners.add(listener);
  return () => {
    captionListeners.delete(listener);
  };
}

function getCaptions(): CaptionPreference {
  return captions;
}

/** Choose subtitles for every video. Persisted; failure to persist is survivable. */
export function setVideoCaptions(next: CaptionPreference): void {
  if (next === captions) return;
  captions = next;
  emitCaptions();
  writeVersioned(CAPTIONS_KEY, CAPTIONS_VERSION, { captions: next }).catch(() => {});
}

/** `[preference, setPreference]`, shared by every card on screen. */
export function useVideoCaptions(): [CaptionPreference, (next: CaptionPreference) => void] {
  const value = useSyncExternalStore(subscribeCaptions, getCaptions, getCaptions);
  return [value, setVideoCaptions];
}

/** What 'auto' means in a given app language. */
export function resolveCaptions(preference: CaptionPreference, locale: string): 'pt' | 'en' | 'off' {
  if (preference !== 'auto') return preference;
  return locale.startsWith('pt') ? 'pt' : 'off';
}

/** The next choice when the learner taps the subtitles control. */
export function nextCaptions(preference: CaptionPreference): CaptionPreference {
  return CAPTION_VALUES[(CAPTION_VALUES.indexOf(preference) + 1) % CAPTION_VALUES.length] ?? 'auto';
}
