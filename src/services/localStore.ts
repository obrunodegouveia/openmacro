/**
 * ============================================================================
 * Versioned local storage
 * ============================================================================
 *
 * Shared plumbing for everything OpenMacro keeps on the device: the signed-out
 * progress store and the signed-in mirror both write one versioned JSON
 * document under one key.
 *
 * Storage is treated as untrusted throughout. A corrupt, truncated or
 * older-versioned document must never crash the app or, worse, be half-read
 * into a plausible-looking wrong state — every read either returns a value
 * that passed validation, or `null`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Envelope<T> {
  version: number;
  data: T;
}

/**
 * Reads and validates a document.
 *
 * `validate` is the type guard that decides whether the parsed payload is
 * usable. Returning `null` from a read is always safe: callers fall back to a
 * fresh value.
 */
export async function readVersioned<T>(
  key: string,
  version: number,
  validate: (value: unknown) => value is T,
): Promise<T | null> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(key);
  } catch (cause) {
    // Storage unavailable — private browsing, a full disk, a locked keystore.
    // Run in memory rather than block the learner from studying.
    if (__DEV__) console.warn(`[OpenMacro] Could not read "${key}":`, cause);
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (__DEV__) console.warn(`[OpenMacro] "${key}" is not valid JSON; starting fresh.`);
    return null;
  }

  if (typeof parsed !== 'object' || parsed === null) return null;
  const envelope = parsed as Partial<Envelope<unknown>>;

  if (envelope.version !== version) {
    if (__DEV__) {
      console.warn(
        `[OpenMacro] "${key}" is schema v${String(envelope.version)}, expected v${version}; starting fresh.`,
      );
    }
    return null;
  }

  if (!validate(envelope.data)) {
    if (__DEV__) console.warn(`[OpenMacro] "${key}" is malformed; starting fresh.`);
    return null;
  }

  return envelope.data;
}

/**
 * Writes a document.
 *
 * Throws on failure so callers can decide what it means — for the signed-out
 * store a failed write loses the session's progress and is worth surfacing;
 * for the signed-in mirror it is survivable, because the cloud is the record.
 */
export async function writeVersioned<T>(key: string, version: number, data: T): Promise<void> {
  const envelope: Envelope<T> = { version, data };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(envelope));
  } catch (cause) {
    if (__DEV__) console.warn(`[OpenMacro] Could not save "${key}":`, cause);
    throw new Error('Your progress could not be saved to this device.');
  }
}

/** Removes a document. Never throws: clearing is always best-effort. */
export async function removeVersioned(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (cause) {
    if (__DEV__) console.warn(`[OpenMacro] Could not clear "${key}":`, cause);
  }
}

/**
 * Serialises async work into a chain.
 *
 * Two lessons finishing back to back would otherwise race: both read, both
 * apply to the same base snapshot, and the second write silently drops the
 * first one's XP.
 */
export function createTaskQueue(): <T>(operation: () => Promise<T>) => Promise<T> {
  let chain: Promise<unknown> = Promise.resolve();
  return <T>(operation: () => Promise<T>): Promise<T> => {
    const next = chain.then(operation, operation);
    // Keep the chain alive even if one link rejects.
    chain = next.catch(() => undefined);
    return next;
  };
}

/** Shared shape-check for a persisted `ProgressSnapshot`. */
export function isProgressSnapshotLike(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { profile?: unknown; progress?: unknown };
  if (typeof candidate.profile !== 'object' || candidate.profile === null) return false;
  const profile = candidate.profile as { totalXp?: unknown; lastActiveOn?: unknown };
  return typeof profile.totalXp === 'number' && typeof profile.lastActiveOn === 'string';
}
