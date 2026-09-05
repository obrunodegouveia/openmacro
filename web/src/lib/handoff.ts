"use client";

/**
 * ============================================================================
 * Sign-in handoff
 * ============================================================================
 *
 * OAuth is a full-page redirect. The browser leaves the site entirely, and by
 * the time it comes back the lesson runner has remounted with empty state — so
 * the one button that offers to *keep* a finished lesson is also the one action
 * guaranteed to lose it, unless the result is parked somewhere first.
 *
 * This is that somewhere: the finished lesson goes into `sessionStorage` on the
 * way out and is picked up on the way back in.
 *
 * Two deliberate choices:
 *
 *   - `sessionStorage`, not `localStorage`. The handoff belongs to one tab's
 *     round trip. Surviving a browser restart would only mean resurrecting a
 *     completion screen someone walked away from days ago.
 *   - the XP is stored, but the reader clamps it to the most the lesson could
 *     possibly award. It cannot be recomputed from scratch on the way back —
 *     the engine halves XP for a challenge answered on the second attempt, so
 *     the score depends on how the run went, not just which challenges were
 *     cleared. Clamping is what stops a hand-edited entry inventing a score.
 */

const KEY = "openmacro:pending-completion";

/** Beyond this, a parked completion is a leftover rather than a handoff. */
const MAX_AGE_MS = 60 * 60 * 1000;

export interface PendingCompletion {
  /** Lesson id, matching `Lesson.id` in the shared content package. */
  slug: string;
  /** XP earned on the run. Clamped by the reader — see the note above. */
  xp: number;
  /** ISO timestamp, used only to expire stale entries. */
  at: string;
}

function storage(): Storage | null {
  // Absent during prerender; throws outright when site data is blocked.
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Parks a finished lesson before leaving the page. Failure is not fatal. */
export function rememberCompletion(pending: PendingCompletion): void {
  try {
    storage()?.setItem(KEY, JSON.stringify(pending));
  } catch {
    // Storage full or blocked: the learner loses the XP but not the lesson.
  }
}

/**
 * The last value read, kept so repeated reads of unchanged storage return the
 * *same object*.
 *
 * `useSyncExternalStore` compares snapshots by identity and re-renders whenever
 * they differ, so a function that parsed fresh JSON on every call would render
 * forever. Caching on the raw string makes the snapshot stable.
 */
let cachedRaw: string | null = null;
let cachedValue: PendingCompletion | null = null;

function parse(raw: string): PendingCompletion | null {
  try {
    const value = JSON.parse(raw) as Partial<PendingCompletion>;
    const fresh =
      typeof value.at === "string" &&
      Date.now() - new Date(value.at).getTime() < MAX_AGE_MS;

    if (
      typeof value.slug !== "string" ||
      !fresh ||
      typeof value.xp !== "number" ||
      !Number.isFinite(value.xp) ||
      value.xp < 0
    ) {
      return null;
    }
    return { slug: value.slug, xp: value.xp, at: value.at as string };
  } catch {
    return null;
  }
}

/**
 * Returns whatever completion is parked, if it is still current.
 *
 * Anything malformed, stale, or from another lesson reads as nothing — a bad
 * entry must never strand someone on the completion screen of a lesson they
 * have not done. Callers check the slug themselves.
 */
export function readCompletion(): PendingCompletion | null {
  const store = storage();
  if (!store) return null;

  let raw: string | null;
  try {
    raw = store.getItem(KEY);
  } catch {
    return null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = raw ? parse(raw) : null;
  }
  return cachedValue;
}

/** What the server sees: there is no browser storage during prerender. */
export function readNoCompletion(): null {
  return null;
}

/**
 * Subscription required by `useSyncExternalStore`.
 *
 * Deliberately inert. The only writer is this tab, through actions that
 * already re-render — nothing else can change the value mid-page, so there is
 * no event worth listening for.
 */
export function subscribeToCompletion(): () => void {
  return () => {};
}

/** Drops the parked completion, once it has been saved or superseded. */
export function clearCompletion(): void {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing to do: an unreadable store is also an unwritable one.
  }
}
