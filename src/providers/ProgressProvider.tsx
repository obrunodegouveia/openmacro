/**
 * App-wide learner state: profile (XP, day streak) and per-lesson progress.
 *
 * Chooses where that state lives:
 *   - signed out, or no Supabase project configured -> the on-device store
 *   - signed in                                     -> the learner's account
 *
 * and, the first time someone signs in on a device, merges what they did while
 * anonymous into their account. See `mergeSnapshots` for why that merge takes
 * the best of each side rather than summing.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { localDataProvider } from '@/services';
import {
  hasLocalProgress,
  mergeSnapshots,
  type ProgressSnapshot,
} from '@/services/progressRules';
import { supabase } from '@/services/supabaseClient';
import { readCloudSnapshot, writeCloudSnapshot } from '@/services/supabaseDataProvider';
import {
  createSyncedDataProvider,
  type SyncState,
  type SyncedDataProvider,
} from '@/services/syncedDataProvider';
import type {
  LearnerProfile,
  LearningDataProvider,
  LessonProgress,
  LessonResult,
} from '@/services/types';

interface ProgressContextValue {
  profile: LearnerProfile | null;
  progress: Record<string, LessonProgress>;
  loading: boolean;
  /** Non-null when a provider failed — surfaced in the UI, never swallowed. */
  error: string | null;
  /** True while anonymous progress is being merged into a new account. */
  merging: boolean;
  /** Whether the numbers on screen are backed by an account or this device. */
  syncing: boolean;
  /** Cloud sync state while signed in; null when signed out. */
  sync: SyncState | null;
  recordResult: (result: LessonResult) => Promise<void>;
  reset: () => Promise<void>;
  isLessonComplete: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { identity, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sync, setSync] = useState<SyncState | null>(null);

  /**
   * The active store. Rebuilt whenever the signed-in user changes, so a cached
   * snapshot can never survive into a different account.
   */
  const provider = useMemo<LearningDataProvider | SyncedDataProvider>(() => {
    if (supabase && identity) return createSyncedDataProvider(supabase, identity);
    return localDataProvider;
  }, [identity]);

  const synced = isSynced(provider) ? provider : null;

  /** Accounts this device has already merged local progress into. */
  const mergedAccounts = useRef<Set<string>>(new Set());

  const load = useCallback(async (source: LearningDataProvider) => {
    setLoading(true);
    setError(null);
    try {
      const [nextProfile, nextProgress] = await Promise.all([
        source.getProfile(),
        source.getAllProgress(),
      ]);
      setProfile(nextProfile);
      setProgress(nextProgress);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to load your progress.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for the stored session to be restored, so a signed-in learner never
    // sees their local numbers flash up before their account loads.
    if (authLoading) return;

    let cancelled = false;

    async function activate() {
      if (supabase && identity && !mergedAccounts.current.has(identity.userId)) {
        mergedAccounts.current.add(identity.userId);
        try {
          const local = await readLocalSnapshot();
          if (hasLocalProgress(local)) {
            setMerging(true);
            const cloud = await readCloudSnapshot(supabase, identity);
            await writeCloudSnapshot(supabase, identity, mergeSnapshots(local, cloud));
          }
        } catch (cause) {
          // A failed merge must not lock the learner out of their account; they
          // still get their cloud progress, and the local copy is untouched.
          setError(
            cause instanceof Error
              ? `Signed in, but your offline progress could not be merged: ${cause.message}`
              : 'Signed in, but your offline progress could not be merged.',
          );
        } finally {
          if (!cancelled) setMerging(false);
        }
      }

      if (!cancelled) await load(provider);
    }

    void activate();
    return () => {
      cancelled = true;
    };
  }, [provider, identity, authLoading, load]);

  useEffect(() => {
    if (!synced) {
      setSync(null);
      return;
    }
    const unsubscribe = synced.subscribe(setSync);
    void synced.flush();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && synced.getSyncState().pending) void synced.flush();
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, [synced]);

  const recordResult = useCallback(
    async (result: LessonResult) => {
      try {
        const snapshot = await provider.recordLessonResult(result);
        setProfile(snapshot.profile);
        setProgress(snapshot.progress);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Failed to save your progress.');
      }
    },
    [provider],
  );

  const reset = useCallback(async () => {
    try {
      await provider.reset();
      await load(provider);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to reset your progress.');
    }
  }, [provider, load]);

  const isLessonComplete = useCallback(
    (lessonId: string) => (progress[lessonId]?.completions ?? 0) > 0,
    [progress],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      profile,
      progress,
      loading: loading || authLoading,
      error,
      merging,
      syncing: Boolean(supabase && identity),
      sync,
      recordResult,
      reset,
      isLessonComplete,
    }),
    [
      profile,
      progress,
      loading,
      authLoading,
      error,
      merging,
      identity,
      sync,
      recordResult,
      reset,
      isLessonComplete,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

/** Narrows a provider to the signed-in one, which carries the sync controls. */
function isSynced(provider: LearningDataProvider): provider is SyncedDataProvider {
  return 'flush' in provider && 'subscribe' in provider;
}

/** Reads the on-device store as a snapshot, for the sign-in merge. */
async function readLocalSnapshot(): Promise<ProgressSnapshot> {
  const [profile, progress] = await Promise.all([
    localDataProvider.getProfile(),
    localDataProvider.getAllProgress(),
  ]);
  return { profile, progress };
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside a <ProgressProvider>.');
  }
  return context;
}
