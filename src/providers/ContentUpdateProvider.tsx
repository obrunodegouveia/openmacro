/**
 * ============================================================================
 * Over-the-air content updates
 * ============================================================================
 *
 * New lessons arrive without a store release. This decides *when* a learner is
 * moved onto them, which is the part that is easy to get wrong.
 *
 * Three rules, and the reasons matter more than the code:
 *
 * 1. NEVER RELOAD MID-LESSON. `Updates.reloadAsync()` restarts the JavaScript
 *    runtime. Doing that during a lesson discards the session — hearts, XP,
 *    combo, the answer half-typed — and the learner is given no reason for it.
 *    So the app only ever applies an update while nobody is mid-run, and the
 *    lesson runner reports whether it is safe.
 *
 * 2. NEVER BLOCK LAUNCH. `fallbackToCacheTimeout: 0` means the app starts on
 *    the bundle it already has and fetches in the background. An app that
 *    waits on the network before its first frame is slower for everyone in
 *    order to be fresher for a few.
 *
 * 3. OFFER, DO NOT IMPOSE. When an update is ready the learner is told and
 *    chooses. The one exception is a cold start, where applying it silently
 *    costs nothing because there is no state to lose.
 *
 * Inert in development and in Expo Go, where `expo-updates` is not running and
 * every call would throw.
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
import * as Updates from 'expo-updates';

interface ContentUpdateValue {
  /** A newer bundle is downloaded and waiting to be applied. */
  ready: boolean;
  /** True while the update is being applied, so the UI can disable its button. */
  applying: boolean;
  /**
   * Apply it. No-op unless an update is ready and nothing is mid-lesson —
   * callers do not have to check, which is what stops the rule being forgotten.
   */
  apply: () => Promise<void>;
  /**
   * Called by the lesson runner. While false, an update is never applied
   * automatically and `apply` refuses.
   */
  setSafeToReload: (safe: boolean) => void;
}

const ContentUpdateContext = createContext<ContentUpdateValue | null>(null);

/** `Updates.isEnabled` is false in dev and Expo Go; every call would throw. */
const ENABLED = Updates.isEnabled;

export function ContentUpdateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [applying, setApplying] = useState(false);

  /**
   * A ref, not state: the lesson runner sets it on every mount and unmount,
   * and re-rendering this provider — and therefore the whole app — on those
   * transitions would be a real cost for a value nothing renders.
   */
  const safeToReload = useRef(true);
  const setSafeToReload = useCallback((safe: boolean) => {
    safeToReload.current = safe;
  }, []);

  const apply = useCallback(async () => {
    if (!ENABLED || !ready || applying || !safeToReload.current) return;
    setApplying(true);
    try {
      await Updates.reloadAsync();
    } catch {
      // A failed reload leaves the current bundle running, which is fine.
      setApplying(false);
    }
  }, [ready, applying]);

  /**
   * Check on launch, and again whenever the app comes back to the foreground.
   *
   * The foreground check is what makes content feel live: a learner who opens
   * the app every morning would otherwise only ever see yesterday's lessons,
   * because a cold start is rare on a phone that never really closes anything.
   */
  useEffect(() => {
    if (!ENABLED) return;
    let cancelled = false;

    async function check() {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (cancelled || !result.isAvailable) return;
        await Updates.fetchUpdateAsync();
        if (cancelled) return;

        /**
         * Downloaded during a lesson: hold it. `ready` stays true, so the
         * learner is offered it the moment they are back on the path.
         */
        setReady(true);
      } catch {
        // No network, no update server, a malformed manifest — all of them
        // mean the app carries on with the bundle it has.
      }
    }

    void check();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void check();
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  const value = useMemo<ContentUpdateValue>(
    () => ({ ready, applying, apply, setSafeToReload }),
    [ready, applying, apply, setSafeToReload],
  );

  return (
    <ContentUpdateContext.Provider value={value}>{children}</ContentUpdateContext.Provider>
  );
}

export function useContentUpdate(): ContentUpdateValue {
  const context = useContext(ContentUpdateContext);
  if (!context) {
    throw new Error('useContentUpdate must be used inside ContentUpdateProvider');
  }
  return context;
}
