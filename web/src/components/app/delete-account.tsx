"use client";

import * as React from "react";

import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";

/**
 * Delete this account, from the website.
 *
 * The App Store requirement is about the app, but the account is the same
 * account and it can be created here too — offering deletion in only one of
 * the two places would be an odd thing to explain to someone who signed up on
 * their laptop.
 *
 * Shares the endpoint with the app deliberately. Deletion logic written twice
 * eventually behaves differently in the two places, and the difference is
 * discovered by the person who wanted their data gone.
 */
export function DeleteAccount() {
  const { learner, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!learner) return null;

  async function remove() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
      const token = data.session?.access_token;
      if (!token) {
        setError("Your session expired. Sign in again.");
        return;
      }

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ confirmEmail: email.trim() }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "That did not work.");
        return;
      }
      await signOut();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 text-xs font-bold text-ink-faint underline underline-offset-4"
      >
        Delete account
      </button>
    );
  }

  return (
    <section className="mt-8 rounded-card border border-hairline p-5">
      <h2 className="font-display text-lg font-extrabold">Delete this account</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Your XP, streak and lesson history are erased and cannot be recovered. The course keeps
        working without an account.
      </p>

      <label className="mt-4 block">
        <span className="text-xs font-bold text-ink-faint">
          Type {learner.email ?? "your email"} to confirm
        </span>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="off"
          className="mt-1 w-full rounded-lg border border-hairline bg-transparent px-3 py-2 text-sm"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setEmail("");
            setError(null);
          }}
          className="rounded-lg border border-hairline px-4 py-2 text-sm font-bold"
        >
          Keep it
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="rounded-lg bg-coral px-4 py-2 text-sm font-bold text-abyss disabled:opacity-60"
        >
          {busy ? "Deleting…" : "Delete for good"}
        </button>
      </div>
    </section>
  );
}
