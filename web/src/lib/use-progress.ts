"use client";

import * as React from "react";
import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";
import {
  peekLocalProgress,
  readCloudProgress,
  readNoLocalProgress,
  subscribeToLocalProgress,
  syncLocalIntoAccount,
  type ProgressSnapshot,
} from "@/lib/progress";

export interface ProgressView {
  /** Null while loading, or when there is nothing to show. */
  snapshot: ProgressSnapshot | null;
  state: "loading" | "ready" | "failed";
  signedIn: boolean;
  /** False when this build has no account backend — hide all account UI. */
  enabled: boolean;
  /** True until the stored session has been restored. */
  restoring: boolean;
}

/**
 * ============================================================================
 * The learner's progress, wherever it happens to live
 * ============================================================================
 *
 * Signed out, it is this device's `localStorage`. Signed in, the device's copy
 * is folded into the account first and the merged result is what comes back,
 * so a page never shows a total that is lower than what the learner just did.
 *
 * Extracted from the dashboard because the course index needs exactly the same
 * answer. Two components fetching progress two different ways is how "finished"
 * ends up meaning something different on each page.
 */
export function useProgressSnapshot(): ProgressView {
  const { enabled, loading, learner } = useAuth();

  /**
   * The fetched progress, tagged with whose it is.
   *
   * Tagged rather than cleared on sign-out, so the "still loading" state can be
   * *derived* — `result === null` for the current learner — instead of being
   * set synchronously in the effect, which would cost a second render pass on
   * every load and is what `react-hooks/set-state-in-effect` protects against.
   */
  const [result, setResult] = React.useState<
    | { userId: string; status: "ready"; snapshot: ProgressSnapshot }
    | { userId: string; status: "failed" }
    | null
  >(null);

  /**
   * This device's progress, read through the store hook rather than an effect:
   * these pages are prerendered, so the server must render nothing while the
   * browser reads its own storage.
   */
  const localSnapshot = React.useSyncExternalStore(
    subscribeToLocalProgress,
    peekLocalProgress,
    readNoLocalProgress,
  );

  React.useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();
    if (!learner || !supabase) return;

    const userId = learner.id;
    // Signed in: fold anything played on this device into the account first,
    // so arriving here after signing in shows the merged total rather than
    // whatever the account happened to hold.
    syncLocalIntoAccount({ client: supabase, userId, displayName: learner.name })
      .catch(() => readCloudProgress(supabase, userId, learner.name))
      .then((snapshot) => {
        if (!cancelled) setResult({ userId, status: "ready", snapshot });
      })
      .catch(() => {
        if (!cancelled) setResult({ userId, status: "failed" });
      });

    return () => {
      cancelled = true;
    };
  }, [learner]);

  // A result belonging to a different learner — or to the signed-out store
  // after signing in — is not this view's.
  const current = result && learner && result.userId === learner.id ? result : null;

  return {
    // Signed out, the local store is the whole answer and needs no request.
    snapshot: learner
      ? current?.status === "ready"
        ? current.snapshot
        : null
      : localSnapshot,
    state: learner
      ? !current
        ? "loading"
        : current.status
      : localSnapshot
        ? "ready"
        : "loading",
    signedIn: Boolean(learner),
    enabled,
    restoring: loading,
  };
}
