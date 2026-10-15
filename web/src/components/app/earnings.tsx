"use client";

import * as React from "react";
import { LOCALE_TAGS } from "@openmacro/core/i18n/locales";

import { useLocale } from "@/components/site/locale-provider";
import { isActiveNow, startActivityTracking } from "@/lib/activity";
import { getSupabase } from "@/lib/supabase";
import { useSiteText } from "@/lib/use-site-text";

/**
 * ============================================================================
 * Earnings
 * ============================================================================
 *
 * The dashboard panel for an 'earnings' recipient: the balance in euros, what
 * it was earned from (XP and active time), a live timer, the payout address,
 * and a button that withdraws the balance.
 *
 * Renders nothing for anybody else, like ModuleRewards: a private arrangement
 * inside a public course should look like it does not exist unless it is yours.
 *
 * Every number is computed by /api/earnings. The only thing this component
 * adds is the seconds ticking between refreshes, so the timer feels live; the
 * next refresh replaces them with what the server actually recorded.
 */

interface Withdrawal {
  id: string;
  amount: string;
  status: string;
  explorerUrl: string | null;
  createdAt: string;
}

interface Earnings {
  label: string;
  address: string | null;
  xp: number;
  maxXp: number;
  activeMinutes: number;
  activeMinutesToday: number;
  xpRateEuros: string;
  hourRateEuros: string;
  earnedFromXp: string;
  earnedFromTime: string;
  withdrawn: string;
  balance: string;
  withdrawable: string;
  minWithdrawal: string;
  withdrawals: Withdrawal[];
}

const REFRESH_EVERY_MS = 60 * 1000;

async function bearer(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Base units (6 decimals) to a number of euros — for display only. */
function toEuros(baseUnits: string): number {
  return Number(BigInt(baseUnits)) / 1_000_000;
}

function clock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function EarningsPanel() {
  const s = useSiteText();
  const { locale } = useLocale();
  const tag = LOCALE_TAGS[locale];

  const [data, setData] = React.useState<Earnings | null>(null);
  const [localSeconds, setLocalSeconds] = React.useState(0);
  const [busy, setBusy] = React.useState<"withdraw" | "address" | null>(null);
  const [message, setMessage] = React.useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const money = React.useCallback(
    (baseUnits: string, digits = 2) =>
      new Intl.NumberFormat(tag, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(toEuros(baseUnits)),
    [tag],
  );

  const fetchEarnings = React.useCallback(async (): Promise<Earnings | null> => {
    const token = await bearer();
    if (!token) return null;
    try {
      const response = await fetch("/api/earnings", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) return null;
      return ((await response.json()) as { earnings: Earnings | null }).earnings;
    } catch {
      return null;
    }
  }, []);

  // Load, then refresh every minute. Each refresh resets the local seconds,
  // because the server's minute count now includes them.
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await fetchEarnings();
      if (cancelled) return;
      setData(result);
      setLocalSeconds(0);
    }
    void load();
    const timer = setInterval(() => void load(), REFRESH_EVERY_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [fetchEarnings]);

  // Tick once a second while the learner is active, so the timer moves.
  const enrolled = data !== null;
  React.useEffect(() => {
    if (!enrolled) return;
    startActivityTracking();
    const timer = setInterval(() => {
      if (isActiveNow()) setLocalSeconds((n) => n + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [enrolled]);

  async function post(payload: Record<string, unknown>) {
    const token = await bearer();
    const response = await fetch("/api/earnings", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return {
      ok: response.ok,
      body: (await response.json()) as { error?: string; amountEurc?: string },
    };
  }

  async function saveAddress() {
    setBusy("address");
    setMessage(null);
    try {
      const { ok, body } = await post({ action: "set-address", address: draft });
      if (ok) {
        setEditing(false);
        setMessage({ tone: "ok", text: s("earnings.addressSaved") });
      } else {
        setMessage({ tone: "bad", text: body.error ?? s("earnings.failed") });
      }
      setData(await fetchEarnings());
    } catch {
      setMessage({ tone: "bad", text: s("earnings.offline") });
    } finally {
      setBusy(null);
    }
  }

  async function withdraw() {
    setBusy("withdraw");
    setMessage(null);
    try {
      const { ok, body } = await post({ action: "withdraw" });
      setMessage(
        ok
          ? { tone: "ok", text: s("earnings.withdrawn", { amount: body.amountEurc ?? "" }) }
          : { tone: "bad", text: body.error ?? s("earnings.failed") },
      );
      setData(await fetchEarnings());
    } catch {
      setMessage({ tone: "bad", text: s("earnings.offline") });
    } finally {
      setBusy(null);
    }
  }

  if (!data) return null;

  const totalSeconds = data.activeMinutes * 60 + localSeconds;
  const canWithdraw =
    data.address !== null && BigInt(data.withdrawable) >= BigInt(data.minWithdrawal);
  const hourRate = new Intl.NumberFormat(tag, { style: "currency", currency: "EUR" }).format(
    Number(data.hourRateEuros),
  );
  const xpRateCents = new Intl.NumberFormat(tag, { maximumFractionDigits: 4 }).format(
    Number(data.xpRateEuros) * 100,
  );

  return (
    <section className="mt-10 rounded-2xl border border-black/10 p-5 dark:border-white/15">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-medium">{s("earnings.title")}</h2>
        <p className="text-sm text-neutral-500">
          {s("earnings.rates", { xpCents: xpRateCents, hour: hourRate })}
        </p>
      </div>

      {/* ---- balance ---------------------------------------------------- */}
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {s("earnings.balance")}
      </p>
      <p className="mt-1 text-4xl font-semibold tabular-nums">{money(data.balance)}</p>
      {BigInt(data.withdrawn) > 0n ? (
        <p className="mt-1 text-xs text-neutral-500">
          {s("earnings.alreadyWithdrawn", { amount: money(data.withdrawn) })}
        </p>
      ) : null}

      {/* ---- how it was earned ------------------------------------------ */}
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {s("earnings.fromXp")}
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{money(data.earnedFromXp)}</dd>
          <dd className="mt-1 text-xs text-neutral-500">
            {s("earnings.xpCount", { xp: data.xp, max: data.maxXp })}
          </dd>
        </div>
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {s("earnings.fromTime")}
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{money(data.earnedFromTime)}</dd>
          <dd className="mt-1 font-mono text-sm tabular-nums" aria-live="off">
            {clock(totalSeconds)}
          </dd>
          <dd className="mt-1 text-xs text-neutral-500">
            {s("earnings.today", { minutes: data.activeMinutesToday })}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-neutral-500">{s("earnings.timeRule")}</p>

      {message ? (
        <p
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            message.tone === "ok"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {/* ---- address ---------------------------------------------------- */}
      <div className="mt-6">
        <p className="text-sm font-medium">{s("earnings.address")}</p>
        {editing || !data.address ? (
          <form
            className="mt-2 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              void saveAddress();
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="0x…"
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 font-mono text-sm dark:border-white/20"
            />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {s("earnings.networkWarning")}
            </p>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy !== null || draft.trim() === ""}
                className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
              >
                {s("earnings.saveAddress")}
              </button>
              {data.address ? (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-xs dark:border-white/20"
                >
                  {s("earnings.cancel")}
                </button>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <code className="break-all font-mono text-xs text-neutral-600 dark:text-neutral-300">
              {data.address}
            </code>
            <button
              type="button"
              onClick={() => {
                setDraft(data.address ?? "");
                setEditing(true);
              }}
              className="text-xs underline underline-offset-4"
            >
              {s("earnings.changeAddress")}
            </button>
          </div>
        )}
      </div>

      {/* ---- withdraw --------------------------------------------------- */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy !== null || !canWithdraw}
          onClick={() => void withdraw()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy === "withdraw"
            ? s("earnings.sending")
            : s("earnings.withdraw", { amount: money(data.withdrawable) })}
        </button>
        {!data.address ? (
          <span className="text-xs text-neutral-500">{s("earnings.needAddress")}</span>
        ) : !canWithdraw ? (
          <span className="text-xs text-neutral-500">
            {s("earnings.minimum", { amount: money(data.minWithdrawal) })}
          </span>
        ) : null}
      </div>

      {/* ---- history ---------------------------------------------------- */}
      {data.withdrawals.length > 0 ? (
        <ul className="mt-6 divide-y divide-black/5 text-sm dark:divide-white/10">
          {data.withdrawals.map((w) => (
            <li key={w.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
              <span className="tabular-nums">
                {money(w.amount)}{" "}
                <span className="text-xs text-neutral-500">
                  {new Date(w.createdAt).toLocaleDateString(tag)}
                </span>
              </span>
              {w.explorerUrl ? (
                <a
                  href={w.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline underline-offset-4"
                >
                  {s("earnings.paidLink")}
                </a>
              ) : (
                <span className="text-xs text-neutral-500">{w.status}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
