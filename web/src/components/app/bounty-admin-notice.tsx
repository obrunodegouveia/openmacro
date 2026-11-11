"use client";

import * as React from "react";

import { useAuth } from "@/components/site/auth-provider";
import { Button } from "@/components/ui/button";
import { BOUNTY, BOUNTY_ADMIN_COPY as c } from "@/lib/bounty";
import { getSupabase } from "@/lib/supabase";

interface Winner {
  userId: string;
  submittedAt: string;
  score: string;
  durationSeconds: number | null;
  leaves: number;
  lessonXp: number;
  lessons: number;
  firstLessonAt: string | null;
  lastLessonAt: string | null;
  address: string | null;
  paidAt: string | null;
  txid: string | null;
}

/**
 * Tells the organiser there is a bounty to pay.
 *
 * Asks `/api/admin/bounty`, which answers 404 to anyone who is not on the
 * treasury allow-list, so for every learner but one this renders nothing. For
 * the organiser it shows the first winner: the address to send 21,000 sats
 * to, the record to check first, and a box for the transaction ID afterwards.
 */
export function BountyAdminNotice({ showPaid = false }: { showPaid?: boolean }) {
  const { learner } = useAuth();
  const [winners, setWinners] = React.useState<Winner[] | null>(null);
  const [reload, setReload] = React.useState(0);
  const [txid, setTxid] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const bearer = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  React.useEffect(() => {
    if (!learner) return;
    let live = true;
    void (async () => {
      const token = await bearer();
      if (!token) return;
      const response = await fetch("/api/admin/bounty", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) return;
      const body = (await response.json()) as { winners: Winner[] };
      if (live) setWinners(body.winners);
    })().catch(() => undefined);
    return () => {
      live = false;
    };
  }, [learner, bearer, reload]);

  const winner = winners?.[0];
  if (!winner || (winner.paidAt && !showPaid)) return null;

  async function markPaid(event: React.FormEvent) {
    event.preventDefault();
    if (!winner) return;
    setError(null);
    setSaving(true);
    const token = await bearer();
    const response = await fetch("/api/admin/bounty", {
      method: "POST",
      headers: { authorization: `Bearer ${token ?? ""}`, "content-type": "application/json" },
      body: JSON.stringify({ action: "mark-paid", userId: winner.userId, txid }),
    }).catch(() => null);
    setSaving(false);
    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "network");
      return;
    }
    setTxid("");
    setReload((n) => n + 1);
  }

  const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "?");
  const minutes = winner.durationSeconds === null ? "?" : `${Math.round(winner.durationSeconds / 60)} min`;

  return (
    <div
      role="status"
      className="mb-8 rounded-2xl border-2 border-gold bg-gold/10 p-6 text-ink-muted"
    >
      <p className="font-display text-xl font-extrabold text-ink">
        {winner.paidAt ? c.paidTitle : winner.address ? c.toPay : c.waiting}
      </p>
      <p className="mt-3 text-sm">
        {c.passed} {winner.score} {c.took} {minutes} · {when(winner.submittedAt)} · {c.left}{" "}
        {winner.leaves} {c.times} · {winner.lessonXp.toLocaleString()} {c.xp} {winner.lessons} {c.lessons},{" "}
        {c.from} {when(winner.firstLessonAt)} {c.and} {when(winner.lastLessonAt)}
      </p>

      {winner.address ? (
        <div className="mt-4">
          <p className="font-bold text-ink">
            {BOUNTY.sats.toLocaleString()} {c.amount}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="break-all rounded-lg bg-veil/10 px-3 py-2 text-ink">{winner.address}</code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText(winner.address ?? "").then(() => setCopied(true));
              }}
            >
              {copied ? c.copied : c.copy}
            </Button>
          </div>
        </div>
      ) : null}

      {winner.paidAt && winner.txid ? (
        <a
          href={`${c.mempool}${winner.txid}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block font-bold text-mint-bright"
        >
          {c.viewTx}
        </a>
      ) : null}

      {winner.address && !winner.paidAt ? (
        <>
          <p className="mt-4 text-sm">{c.check}</p>
          <form onSubmit={markPaid} className="mt-4 flex flex-col gap-3">
            <label htmlFor="bounty-txid" className="text-sm font-bold text-ink">
              {c.txidLabel}
            </label>
            <input
              id="bounty-txid"
              value={txid}
              onChange={(event) => setTxid(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder={c.txidPlaceholder}
              className="h-11 rounded-xl border border-hairline bg-veil/5 px-4 font-mono text-sm text-ink"
            />
            <Button type="submit" variant="gold" disabled={saving || txid.trim() === ""} className="self-start">
              {saving ? c.saving : c.markPaid}
            </Button>
            {error ? (
              <p className="text-sm font-semibold text-coral">
                {c.failed} {error}
              </p>
            ) : null}
          </form>
        </>
      ) : null}
    </div>
  );
}
