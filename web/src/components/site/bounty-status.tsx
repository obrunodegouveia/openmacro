"use client";

import * as React from "react";

import { useAuth } from "@/components/site/auth-provider";
import { GoogleSignIn } from "@/components/site/google-sign-in";
import { LocaleLink } from "@/components/site/locale-link";
import { useLocale } from "@/components/site/locale-provider";
import { Button } from "@/components/ui/button";
import { isBitcoinMainnetAddress } from "@/lib/btc-address";
import { getSupabase } from "@/lib/supabase";
import { BOUNTY, bountyCopy } from "@/lib/bounty";

interface Status {
  xp: number;
  lessonsDone: number;
  exam: { submitted: boolean; asked: number | null; correct: number | null } | null;
  payout: { address: string; paidAt: string | null; txid: string | null } | null;
}

/**
 * Where the signed-in learner stands in the bounty: their XP and lessons against the bar, their exam, and, once they
 * have passed, the form for the address the prize is sent to.
 *
 * Everything is read under row-level security, so it only ever shows the
 * learner's own rows. The address goes through submit_bounty_address
 * (migration 0014), which refuses anyone who has not passed.
 */
export function BountyStatus() {
  const { locale } = useLocale();
  const c = bountyCopy(locale);
  const { enabled, loading, learner } = useAuth();
  const [status, setStatus] = React.useState<Status | null>(null);
  const [reload, setReload] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !learner) return;
    let live = true;
    void (async () => {
      const [{ data: lessons }, { data: exam }, { data: payout }] = await Promise.all([
        supabase.from("lesson_progress").select("lesson_id, best_xp"),
        supabase
          .from("assigned_exams")
          .select("submitted_at, asked, correct")
          .eq("bounty", true)
          .maybeSingle(),
        supabase.from("bounty_payouts").select("btc_address, paid_at, txid").maybeSingle(),
      ]);
      if (!live) return;
      const rows = (lessons ?? []) as { lesson_id: string; best_xp: number }[];
      const focus = new Set<string>(BOUNTY.lessons);
      setStatus({
        xp: rows.reduce((sum, row) => sum + (row.best_xp ?? 0), 0),
        lessonsDone: rows.filter((row) => focus.has(row.lesson_id) && row.best_xp > 0).length,
        exam: exam
          ? { submitted: Boolean(exam.submitted_at), asked: exam.asked, correct: exam.correct }
          : null,
        payout: payout
          ? { address: payout.btc_address, paidAt: payout.paid_at, txid: payout.txid }
          : null,
      });
    })().catch(() => {
      if (live) setStatus(null);
    });
    return () => {
      live = false;
    };
  }, [learner, reload]);

  if (!enabled) return null;
  if (loading) return <Panel>{c.loading}</Panel>;
  if (!learner) {
    return (
      <Panel>
        <p className="mb-4">{c.signIn}</p>
        <GoogleSignIn />
      </Panel>
    );
  }
  if (!status) return <Panel>{c.loading}</Panel>;

  const passed =
    status.exam?.submitted === true &&
    status.exam.asked !== null &&
    status.exam.correct !== null &&
    status.exam.asked > 0 &&
    status.exam.correct >= Math.ceil(status.exam.asked * 0.7);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (!(await isBitcoinMainnetAddress(address))) {
      setMessage({ ok: false, text: c.badAddress });
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.rpc("submit_bounty_address", { p_address: address.trim() });
    setSaving(false);
    if (error) {
      setMessage({ ok: false, text: error.message });
      return;
    }
    setMessage({ ok: true, text: c.saved });
    setAddress("");
    setReload((n) => n + 1);
  }

  return (
    <Panel>
        <ul className="space-y-2">
          <li>
            <strong className="text-ink">{c.xpLabel}</strong> {status.xp.toLocaleString(locale)} /{" "}
            {BOUNTY.xp.toLocaleString(locale)}
          </li>
          <li>
            <strong className="text-ink">{c.lessonsLabel}</strong> {status.lessonsDone} / {BOUNTY.lessons.length}
          </li>
          <li>
            <strong className="text-ink">{c.examLabel}</strong>{" "}
            {!status.exam
              ? c.examNotYet
              : !status.exam.submitted
                ? c.examReady
                : `${status.exam.correct} / ${status.exam.asked} · ${passed ? c.passed : c.failed}`}
          </li>
        </ul>

      {status.exam && !status.exam.submitted ? (
        <LocaleLink href="/dashboard/exam" className="mt-4 inline-block font-bold text-mint-bright">
          {c.goToExam}
        </LocaleLink>
      ) : null}

      {passed ? (
        <div className="mt-6 border-t border-hairline pt-6">
          {status.payout?.paidAt ? (
            <p>
              {c.paid} <code className="break-all">{status.payout.txid}</code>
            </p>
          ) : (
            <>
              {status.payout ? (
                <p className="mb-3">
                  {c.current} <code className="break-all text-ink">{status.payout.address}</code>
                </p>
              ) : null}
              <form onSubmit={save} className="flex flex-col gap-3">
                <label htmlFor="btc-address" className="font-bold text-ink">
                  {c.addressLabel}
                </label>
                <input
                  id="btc-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={c.placeholder}
                  className="h-11 rounded-xl border border-hairline bg-veil/5 px-4 font-mono text-sm text-ink"
                />
                <p className="text-sm text-ink-faint">{c.addressHint}</p>
                <Button type="submit" disabled={saving || address.trim() === ""} className="self-start">
                  {saving ? c.saving : c.save}
                </Button>
              </form>
            </>
          )}
        </div>
      ) : null}

      {message ? (
        <p role="status" className={`mt-4 font-semibold ${message.ok ? "text-mint-bright" : "text-coral"}`}>
          {message.text}
        </p>
      ) : null}
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hairline bg-veil/5 p-6 text-ink-muted">{children}</div>
  );
}
