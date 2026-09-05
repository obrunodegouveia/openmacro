/**
 * ============================================================================
 * AsyncStorage data provider  (the default)
 * ============================================================================
 *
 * Persists learner progress on the device. Works unchanged on iOS, Android and
 * web (where AsyncStorage is backed by localStorage), needs no backend, and
 * keeps OpenMacro clone-and-run.
 *
 * Design notes for contributors:
 *
 *   - Everything is stored under ONE key as a single versioned document.
 *     Progress is small (a profile plus one row per lesson) and always read
 *     and written together, so multiple keys would buy nothing but the chance
 *     of a torn write.
 *   - Reads are cached in memory after the first hydrate. The UI asks for the
 *     profile and the progress map separately, and neither should cost a disk
 *     round-trip once the app is warm.
 *   - Storage is treated as untrusted. A corrupt, truncated or older-versioned
 *     document must never crash the app: we fall back to a fresh snapshot and
 *     say so in the log.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  applyLessonResult,
  localDateKey,
  reconcileSnapshot,
  seedSnapshot,
  type ProgressSnapshot,
} from '@openmacro/core/progress/rules';
import type { LearningDataProvider, LessonResult } from '@openmacro/core/progress/types';

const STORAGE_KEY = 'openmacro:progress';

/**
 * Bump when the persisted shape changes incompatibly. A document with any
 * other version is discarded rather than guessed at — see `parseStored`. If
 * you need to preserve data across a bump, add a migration here instead.
 */
const SCHEMA_VERSION = 1;

interface StoredDocument {
  version: number;
  snapshot: ProgressSnapshot;
}

/** In-memory cache; `null` until the first successful hydrate. */
let cache: ProgressSnapshot | null = null;

/**
 * Serialises writes. Two lessons finishing back to back would otherwise race:
 * both read, both apply to the same base, and the second write silently drops
 * the first one's XP.
 */
let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeChain.then(operation, operation);
  // Keep the chain alive even if one link rejects.
  writeChain = next.catch(() => undefined);
  return next;
}

/** Validates an unknown parsed value into a snapshot, or returns null. */
function parseStored(raw: string | null): ProgressSnapshot | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (__DEV__) console.warn('[OpenMacro] Stored progress is not valid JSON; starting fresh.');
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  const doc = parsed as Partial<StoredDocument>;

  if (doc.version !== SCHEMA_VERSION) {
    if (__DEV__) {
      console.warn(
        `[OpenMacro] Stored progress is schema v${String(doc.version)}, expected v${SCHEMA_VERSION}; starting fresh.`,
      );
    }
    return null;
  }

  const snapshot = doc.snapshot;
  if (
    typeof snapshot !== 'object' ||
    snapshot === null ||
    typeof snapshot.profile !== 'object' ||
    snapshot.profile === null ||
    typeof snapshot.profile.totalXp !== 'number' ||
    typeof snapshot.profile.lastActiveOn !== 'string'
  ) {
    if (__DEV__) console.warn('[OpenMacro] Stored progress is malformed; starting fresh.');
    return null;
  }

  return {
    profile: snapshot.profile,
    progress:
      typeof snapshot.progress === 'object' && snapshot.progress !== null ? snapshot.progress : {},
  };
}

/** Reads from disk once, then serves the cache. */
async function hydrate(): Promise<ProgressSnapshot> {
  if (cache) return cache;

  let stored: ProgressSnapshot | null = null;
  try {
    stored = parseStored(await AsyncStorage.getItem(STORAGE_KEY));
  } catch (cause) {
    // Storage itself is unavailable (private mode on web, a full disk, ...).
    // Run in memory rather than blocking the learner from studying.
    if (__DEV__) console.warn('[OpenMacro] Could not read progress from storage:', cause);
  }

  const today = localDateKey();
  cache = stored ? reconcileSnapshot(stored, today) : seedSnapshot(today);
  return cache;
}

async function persist(snapshot: ProgressSnapshot): Promise<void> {
  cache = snapshot;
  const document: StoredDocument = { version: SCHEMA_VERSION, snapshot };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(document));
  } catch (cause) {
    // A failed write must not lose the learner's session — the cache still
    // holds the new state, so the run they just finished still counts today.
    if (__DEV__) console.warn('[OpenMacro] Could not save progress:', cause);
    throw new Error('Your progress could not be saved to this device.');
  }
}

export const asyncStorageDataProvider: LearningDataProvider = {
  async getProfile() {
    const snapshot = await hydrate();
    return { ...snapshot.profile };
  },

  async getAllProgress() {
    const snapshot = await hydrate();
    return { ...snapshot.progress };
  },

  async recordLessonResult(result: LessonResult) {
    return enqueue(async () => {
      const today = localDateKey();
      // Reconcile first: the app may have been open across midnight.
      const current = reconcileSnapshot(await hydrate(), today);
      const next = applyLessonResult(current, result, today);
      await persist(next);
      return { profile: { ...next.profile }, progress: { ...next.progress } };
    });
  },

  async reset() {
    return enqueue(async () => {
      cache = null;
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (cause) {
        if (__DEV__) console.warn('[OpenMacro] Could not clear progress:', cause);
      }
    });
  },
};
