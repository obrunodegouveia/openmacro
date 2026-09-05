/**
 * ============================================================================
 * Synced data provider — the signed-in store
 * ============================================================================
 *
 * Local-first. A finished lesson is written to a device-local mirror and the
 * UI updates immediately; pushing it to Postgres is a separate, retryable
 * step. A learner on a train finishes their lesson, keeps their streak, and
 * the result lands in their account when the signal comes back.
 *
 * The queue is a *state*, not a log
 * --------------------------------
 * Rather than recording each write as an operation to replay, the mirror is
 * simply marked dirty and the flush reconciles it with the cloud through the
 * same `mergeSnapshots` used at sign-in. That matters because the merge is
 * idempotent: replaying an operation log risks double-counting `completions`
 * if a push half-succeeds, whereas merging maxima can be retried forever with
 * the same result.
 *
 * The cost is the trade already documented on `mergeSnapshots`: two devices
 * used offline in parallel do not have their XP summed. For one device losing
 * signal — overwhelmingly the common case — the mirror already contains the
 * cloud baseline, so the maximum is exactly right.
 */

import {
  applyLessonResult,
  localDateKey,
  mergeSnapshots,
  reconcileSnapshot,
  seedSnapshot,
  type ProgressSnapshot,
} from '@/services/progressRules';
import {
  createTaskQueue,
  isProgressSnapshotLike,
  readVersioned,
  removeVersioned,
  writeVersioned,
} from '@/services/localStore';
import {
  readCloudSnapshot,
  writeCloudSnapshot,
  type CloudIdentity,
} from '@/services/supabaseDataProvider';
import type { LearningDataProvider, LessonResult } from '@/services/types';
import type { SupabaseClient } from '@supabase/supabase-js';

const MIRROR_VERSION = 1;

/** One mirror per account, so signing into a second account cannot read the first's. */
function mirrorKey(userId: string): string {
  return `openmacro:mirror:${userId}`;
}

interface Mirror {
  snapshot: ProgressSnapshot;
  /** True when the mirror holds work the cloud has not accepted yet. */
  dirty: boolean;
  /** Why the last push failed, for the UI. Null once it succeeds. */
  lastError: string | null;
}

function isMirror(value: unknown): value is Mirror {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { snapshot?: unknown; dirty?: unknown };
  return isProgressSnapshotLike(candidate.snapshot) && typeof candidate.dirty === 'boolean';
}

/** What the UI needs to know about sync state. */
export interface SyncState {
  /** True while unsynced work is sitting on this device. */
  pending: boolean;
  /** True while a push is in flight. */
  pushing: boolean;
  /** Last push failure, or null. Not shown while `pending` is false. */
  error: string | null;
}

export interface SyncedDataProvider extends LearningDataProvider {
  /** Attempts to push anything pending. Safe to call at any time. */
  flush(): Promise<void>;
  /** Current sync state. */
  getSyncState(): SyncState;
  /** Subscribes to sync state changes. Returns an unsubscribe function. */
  subscribe(listener: (state: SyncState) => void): () => void;
}

export function createSyncedDataProvider(
  client: SupabaseClient,
  identity: CloudIdentity,
): SyncedDataProvider {
  const key = mirrorKey(identity.userId);
  const enqueue = createTaskQueue();

  /** A blank snapshot that already knows whose account it belongs to. */
  function seedForIdentity(today: string): ProgressSnapshot {
    const seeded = seedSnapshot(today);
    return {
      ...seeded,
      profile: { ...seeded.profile, id: identity.userId, displayName: identity.displayName },
    };
  }

  let mirror: Mirror | null = null;
  let pushing = false;
  const listeners = new Set<(state: SyncState) => void>();

  function syncState(): SyncState {
    return {
      pending: mirror?.dirty ?? false,
      pushing,
      error: mirror?.lastError ?? null,
    };
  }

  function notify(): void {
    const state = syncState();
    for (const listener of listeners) listener(state);
  }

  async function persistMirror(next: Mirror): Promise<void> {
    mirror = next;
    // A failed mirror write is survivable — the in-memory copy still drives
    // this session, and the cloud is the real record — so never let it throw
    // out of a lesson completion.
    try {
      await writeVersioned(key, MIRROR_VERSION, next);
    } catch {
      /* already logged in localStore */
    }
    notify();
  }

  /**
   * Loads the mirror, preferring local state when it holds unsynced work.
   *
   * The order matters: if the device has pending progress we must not let a
   * cloud read overwrite it, or finishing a lesson offline and reopening the
   * app would quietly discard it.
   */
  async function hydrate(): Promise<Mirror> {
    if (mirror) return mirror;

    const stored = await readVersioned<Mirror>(key, MIRROR_VERSION, isMirror);
    const today = localDateKey();

    if (stored?.dirty) {
      mirror = { ...stored, snapshot: reconcileSnapshot(stored.snapshot, today) };
      return mirror;
    }

    try {
      const cloud = await readCloudSnapshot(client, identity);
      mirror = { snapshot: cloud, dirty: false, lastError: null };
    } catch (cause) {
      // Offline on a cold start: fall back to whatever the device last saw,
      // so a signed-in learner is not locked out of their own progress.
      mirror = stored
        ? { ...stored, snapshot: reconcileSnapshot(stored.snapshot, today) }
        : { snapshot: seedForIdentity(today), dirty: false, lastError: null };
      if (__DEV__) console.warn('[OpenMacro] Falling back to the local mirror:', cause);
    }
    return mirror;
  }

  async function push(): Promise<void> {
    const current = await hydrate();
    if (!current.dirty) return;

    pushing = true;
    notify();
    try {
      // Merge rather than overwrite: another device may have advanced while
      // this one was offline.
      const cloud = await readCloudSnapshot(client, identity);
      const merged = mergeSnapshots(current.snapshot, cloud);
      await writeCloudSnapshot(client, identity, merged);
      await persistMirror({
        snapshot: reconcileSnapshot(merged, localDateKey()),
        dirty: false,
        lastError: null,
      });
    } catch (cause) {
      await persistMirror({
        ...current,
        lastError: cause instanceof Error ? cause.message : 'Could not reach your account.',
      });
    } finally {
      pushing = false;
      notify();
    }
  }

  return {
    async getProfile() {
      return { ...(await hydrate()).snapshot.profile };
    },

    async getAllProgress() {
      return { ...(await hydrate()).snapshot.progress };
    },

    async recordLessonResult(result: LessonResult) {
      // Never fails from the learner's point of view: the local write is the
      // commit, and reaching the cloud is a retry away.
      const snapshot = await enqueue(async () => {
        const today = localDateKey();
        const current = await hydrate();
        const next = applyLessonResult(reconcileSnapshot(current.snapshot, today), result, today);
        await persistMirror({ snapshot: next, dirty: true, lastError: null });
        return next;
      });

      void enqueue(push);
      return { profile: { ...snapshot.profile }, progress: { ...snapshot.progress } };
    },

    async reset() {
      return enqueue(async () => {
        const progressError = (
          await client.from('lesson_progress').delete().eq('user_id', identity.userId)
        ).error;
        if (progressError) throw new Error(`Could not clear your progress: ${progressError.message}`);

        const profileError = (
          await client.from('profiles').delete().eq('user_id', identity.userId)
        ).error;
        if (profileError) throw new Error(`Could not clear your profile: ${profileError.message}`);

        await removeVersioned(key);
        mirror = null;
        notify();
      });
    },

    flush() {
      // Called on every foreground transition, so it has to be cheap when
      // there is nothing to do — and must never stack up retries behind a
      // push that is already in flight against an unreachable server.
      if (pushing) return Promise.resolve();
      if (mirror && !mirror.dirty) return Promise.resolve();
      return enqueue(push);
    },

    getSyncState: syncState,

    subscribe(listener) {
      listeners.add(listener);
      listener(syncState());
      return () => listeners.delete(listener);
    },
  };
}
