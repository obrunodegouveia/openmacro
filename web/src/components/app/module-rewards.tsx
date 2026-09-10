"use client";

import * as React from "react";

import { getSupabase } from "@/lib/supabase";

/**
 * ============================================================================
 * Module rewards
 * ============================================================================
 *
 * One row per module: how far through it you are, and — once it is finished —
 * a button that pays you.
 *
 * Renders nothing at all when the signed-in account has no wallet bound to it.
 * Somebody who is simply learning should never see a reward they cannot have;
 * this is a private arrangement inside a public course, and it should look
 * like it does not exist unless it is yours.
 */

interface ModuleRow {
  moduleId: string;
  title: string;
  lessonCount: number;
  completedCount: number;
  complete: boolean;
  claimStatus: "UNCLAIMED" | "CLAIM_PENDING" | "PAID" | "FAILED";
  txHash: string | null;
  explorerUrl: string | null;
}

interface Rewards {
  reward: { label: string; amountEuros: string } | null;
  modules: ModuleRow[];
}

export function ModuleRewards() {
  const [data, setData] = React.useState<Rewards | null>(null);
  const [claiming, setClaiming] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const token = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data: session } = await supabase.auth.getSession();
    return session.session?.access_token ?? null;
  }, []);

  const fetchRewards = React.useCallback(async (): Promise<Rewards | null> => {
    const bearer = await token();
    if (!bearer) return null;
    try {
      const response = await fetch("/api/claim-reward", {
        headers: { authorization: `Bearer ${bearer}` },
        cache: "no-store",
      });
      if (!response.ok) return null;
      return (await response.json()) as Rewards;
    } catch {
      return null;
    }
  }, [token]);

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchRewards();
      if (!cancelled) setData(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchRewards]);

  async function claim(moduleId: string) {
    setClaiming(moduleId);
    setError(null);
    try {
      const bearer = await token();
      const response = await fetch("/api/claim-reward", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${bearer}` },
        // The only thing the browser gets to say. Who is paid, how much, and
        // to which address are all decided on the server.
        body: JSON.stringify({ moduleId }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) setError(result.error ?? "That did not work.");
      setData(await fetchRewards());
    } catch {
      setError("Could not reach the server.");
    } finally {
      setClaiming(null);
    }
  }

  // No wallet bound to this account: show nothing.
  if (!data?.reward) return null;
  // Hoisted so the narrowing survives into the callbacks below.
  const reward = data.reward;

  const unclaimed = data.modules.filter((m) => m.complete && m.claimStatus !== "PAID");
  const earned = data.modules.filter((m) => m.claimStatus === "PAID").length;

  return (
    <section className="mt-10 rounded-2xl border border-black/10 p-5 dark:border-white/15">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-medium">Rewards</h2>
        <p className="text-sm text-neutral-500">
          €{reward.amountEuros} a module · €{earned * Number(reward.amountEuros)} earned
        </p>
      </div>

      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
        Finish every lesson in a module and the reward is yours, paid in EURC straight to your
        Coinbase account.
      </p>

      {error ? (
        <p
          role="status"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      {unclaimed.length > 0 ? (
        <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {unclaimed.length} ready to claim
        </p>
      ) : null}

      <ul className="mt-4 divide-y divide-black/5 dark:divide-white/10">
        {data.modules.map((row) => (
          <li key={row.moduleId} className="flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{row.title}</p>
              <p className="text-xs text-neutral-500">
                {row.completedCount} of {row.lessonCount} lessons
              </p>
            </div>

            {row.claimStatus === "PAID" ? (
              row.explorerUrl ? (
                <a
                  href={row.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline underline-offset-4"
                >
                  Paid ↗
                </a>
              ) : (
                <span className="text-xs text-neutral-500">Paid</span>
              )
            ) : row.complete ? (
              <button
                type="button"
                disabled={claiming !== null || row.claimStatus === "CLAIM_PENDING"}
                onClick={() => void claim(row.moduleId)}
                className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
              >
                {claiming === row.moduleId || row.claimStatus === "CLAIM_PENDING"
                  ? "Sending…"
                  : `Claim €${reward.amountEuros}`}
              </button>
            ) : (
              <span className="text-xs text-neutral-400" aria-hidden="true">
                —
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
