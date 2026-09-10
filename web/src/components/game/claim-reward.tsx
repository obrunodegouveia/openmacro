"use client";

import * as React from "react";

import { getSupabase } from "@/lib/supabase";

/**
 * ============================================================================
 * Claim card
 * ============================================================================
 *
 * Shown when a game finishes. One button, three outcomes, and no way to spend
 * the reward twice by pressing it twice.
 *
 * Everything about the payout is decided by the server: this component names a
 * session and a family member, never an address and never an amount. It could
 * not send money elsewhere if it tried, which is the point.
 */

type ClaimStatus = "UNCLAIMED" | "CLAIM_PENDING" | "PAID" | "FAILED";

interface ClaimState {
  status: ClaimStatus;
  txHash?: string | null;
  explorerUrl?: string | null;
  amountEurc?: string;
  error?: string;
}

export interface ClaimRewardProps {
  /** The finished session this reward is for. */
  gameSessionId: string;
  /** Which family member gets paid. */
  recipient: "wife" | "daughter";
  /** Display name, e.g. "Mum". Cosmetic only. */
  recipientName?: string;
  onClose?: () => void;
}

export function ClaimReward({
  gameSessionId,
  recipient,
  recipientName,
  onClose,
}: ClaimRewardProps) {
  const [state, setState] = React.useState<ClaimState>({ status: "UNCLAIMED" });
  const [busy, setBusy] = React.useState(false);

  /** The caller's own token. Without it the API cannot tell who is asking. */
  const accessToken = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  /**
   * Ask what already happened before offering to do it again.
   *
   * A player who reloads mid-payout must see the pending claim rather than a
   * fresh button — otherwise the obvious action is the one that looks like
   * double-spending, even though the server would refuse it.
   */
  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await accessToken();
      if (!token) return;
      try {
        const response = await fetch(
          `/api/claim-reward?gameSessionId=${encodeURIComponent(gameSessionId)}`,
          { headers: { authorization: `Bearer ${token}` } },
        );
        if (!response.ok) return;
        const data = (await response.json()) as ClaimState;
        if (!cancelled && data.status !== "UNCLAIMED") setState(data);
      } catch {
        // A failed status check is not worth showing: the button still works.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameSessionId, accessToken]);

  async function claim() {
    if (busy || state.status === "PAID") return;
    setBusy(true);
    setState((s) => ({ ...s, error: undefined }));

    try {
      const token = await accessToken();
      if (!token) {
        setState({ status: "UNCLAIMED", error: "Sign in first." });
        return;
      }

      const response = await fetch("/api/claim-reward", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ gameSessionId, recipient }),
      });
      const data = (await response.json()) as ClaimState;

      setState(
        response.ok
          ? { ...data, status: data.status ?? "PAID" }
          : { status: data.status ?? "FAILED", error: data.error ?? "That did not work." },
      );
    } catch {
      setState({ status: "FAILED", error: "Could not reach the server." });
    } finally {
      setBusy(false);
    }
  }

  const who = recipientName ?? (recipient === "wife" ? "Mum" : "you");
  const paid = state.status === "PAID";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-title"
      className="mx-auto w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-neutral-900"
    >
      <h2 id="claim-title" className="text-xl font-semibold tracking-tight">
        {paid ? "Reward sent" : "Game complete"}
      </h2>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        {paid
          ? `EURC is on its way to ${who} on Base.`
          : `Claim a EURC reward for ${who}, paid straight to their Coinbase account.`}
      </p>

      {/* Live region: a screen reader should hear the outcome, not just see it. */}
      <p aria-live="polite" className="sr-only">
        {busy ? "Sending reward" : paid ? "Reward sent" : (state.error ?? "")}
      </p>

      {state.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      {paid ? (
        <div className="mt-5 space-y-3">
          {state.amountEurc ? (
            <p className="text-2xl font-semibold tabular-nums">€{state.amountEurc}</p>
          ) : null}
          {state.explorerUrl ? (
            <a
              href={state.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium underline underline-offset-4"
            >
              View on BaseScan ↗
            </a>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Done
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void claim()}
          disabled={busy || state.status === "CLAIM_PENDING"}
          aria-busy={busy}
          className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
        >
          {busy || state.status === "CLAIM_PENDING" ? "Sending…" : "Claim EURC"}
        </button>
      )}
    </div>
  );
}
