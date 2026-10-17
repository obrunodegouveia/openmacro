"use client";

import * as React from "react";
import { isAddress } from "viem";
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
  /** XP minted so far. */
  xp: number;
  /** XP over today's mint limit, minting on a later day. */
  xpPending: number;
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
  const [confirmed, setConfirmed] = React.useState(false);

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
        setConfirmed(false);
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

  // The same check the server makes (viem's isAddress, which also verifies
  // the checksum of a mixed-case address), so "valid" here means it will save.
  const addressValid = isAddress(draft.trim());
  const shortAddress = data.address
    ? `${data.address.slice(0, 6)}…${data.address.slice(-4)}`
    : null;

  return (
    <section aria-labelledby="earnings-title" className="grid gap-4">
      {/* ---- the card: balance and the one action -------------------------
          Shaped like a Wallet pass on purpose: one balance in euros and one
          button, with everything else underneath. */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-azure-deep via-azure to-[#5b8cff] p-5 text-white shadow-[0_20px_50px_-20px_rgba(61,126,255,0.6)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 id="earnings-title" className="text-sm font-bold text-white/85">
            {s("earnings.title")}
          </h2>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">{s("earnings.chip")}</span>
        </div>
        <p className="mt-3 font-display text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">
          {money(data.balance)}
        </p>
        <p className="mt-1 text-sm text-white/80">
          {canWithdraw
            ? s("earnings.ready")
            : !data.address
              ? s("earnings.needAddress")
              : s("earnings.minimum", { amount: money(data.minWithdrawal) })}
          {BigInt(data.withdrawn) > 0n
            ? ` · ${s("earnings.alreadyWithdrawn", { amount: money(data.withdrawn) })}`
            : ""}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {data.address ? (
            <button
              type="button"
              disabled={busy !== null || !canWithdraw || editing}
              onClick={() => void withdraw()}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-extrabold text-azure-deep transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {busy === "withdraw"
                ? s("earnings.sending")
                : s("earnings.withdraw", { amount: money(data.withdrawable) })}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-extrabold text-azure-deep transition-transform active:scale-[0.98]"
            >
              {s("earnings.setup")}
            </button>
          )}
          {shortAddress && !editing ? (
            <span className="text-sm text-white/85">
              {s("earnings.paysTo", { address: shortAddress })}{" "}
              <button
                type="button"
                onClick={() => {
                  setDraft(data.address ?? "");
                  setEditing(true);
                }}
                className="font-bold underline underline-offset-4"
              >
                {s("earnings.changeAddress")}
              </button>
            </span>
          ) : null}
        </div>
      </div>

      {message ? (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.tone === "ok"
              ? "border-mint/30 bg-mint/[0.07] text-mint-bright"
              : "border-coral/30 bg-coral/[0.07] text-coral"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {/* ---- guided payout setup ------------------------------------------ */}
      {editing ? (
        <form
          className="grid gap-4 rounded-card border border-hairline bg-veil/[0.03] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (addressValid && confirmed) void saveAddress();
          }}
        >
          <h3 className="font-display text-lg font-extrabold tracking-tight">
            {s("earnings.setupTitle")}
          </h3>
          <ol className="grid gap-3">
            {[s("earnings.step1"), s("earnings.step2"), s("earnings.step3")].map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-azure/20 text-sm font-extrabold text-azure">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-[0.95rem] leading-relaxed text-ink">{step}</span>
              </li>
            ))}
          </ol>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-ink-muted">{s("earnings.address")}</span>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="0x…"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              inputMode="text"
              aria-invalid={draft.trim() !== "" && !addressValid}
              aria-describedby="payout-address-hint"
              className="h-12 w-full rounded-xl border border-hairline bg-well/60 px-4 font-mono text-[0.95rem] text-ink outline-none focus:border-azure"
            />
            <span
              className={`text-sm ${
                draft.trim() === "" ? "text-ink-faint" : addressValid ? "text-mint-bright" : "text-coral"
              }`}
              id="payout-address-hint"
            >
              {draft.trim() === ""
                ? s("earnings.addressHint")
                : addressValid
                  ? s("earnings.addressValid")
                  : s("earnings.addressInvalid")}
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 size-4 accent-[var(--color-gold)]"
            />
            <span className="text-sm leading-relaxed text-ink">
              <span className="font-bold">{s("earnings.confirmBase")}</span>{" "}
              <span className="text-ink-muted">{s("earnings.networkWarning")}</span>
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy !== null || !addressValid || !confirmed}
              className="inline-flex h-11 items-center justify-center rounded-xl border-b-4 border-mint-deep bg-mint px-5 font-extrabold text-abyss disabled:opacity-50"
            >
              {s("earnings.saveAddress")}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setConfirmed(false);
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 font-bold text-ink-muted hover:bg-veil/5"
            >
              {s("earnings.cancel")}
            </button>
          </div>
        </form>
      ) : null}

      {/* ---- where it came from ------------------------------------------- */}
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-hairline bg-veil/[0.03] p-4">
          <dt className="text-sm font-bold text-ink-muted">{s("earnings.fromXp")}</dt>
          <dd className="mt-1 font-display text-xl font-extrabold tabular-nums">{money(data.earnedFromXp)}</dd>
          <dd className="mt-0.5 text-sm text-ink-muted">
            {s("earnings.xpCount", { xp: data.xp })}
            {data.xpPending > 0 ? ` · ${s("earnings.xpPending", { xp: data.xpPending })}` : null}
          </dd>
        </div>
        <div className="rounded-card border border-hairline bg-veil/[0.03] p-4">
          <dt className="text-sm font-bold text-ink-muted">{s("earnings.fromTime")}</dt>
          <dd className="mt-1 font-display text-xl font-extrabold tabular-nums">{money(data.earnedFromTime)}</dd>
          <dd className="mt-0.5 text-sm text-ink-muted">
            <span className="font-mono tabular-nums" aria-live="off">{clock(totalSeconds)}</span>
            {" · "}
            {s("earnings.today", { minutes: data.activeMinutesToday })}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-ink-faint">
        {s("earnings.rates", { xpCents: xpRateCents, hour: hourRate })}. {s("earnings.timeRule")}
      </p>

      {/* ---- history ------------------------------------------------------ */}
      {data.withdrawals.length > 0 ? (
        <ul className="divide-y divide-hairline rounded-card border border-hairline text-[0.95rem]">
          {data.withdrawals.map((w) => (
            <li key={w.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <span className="tabular-nums">
                {money(w.amount)}{" "}
                <span className="text-sm text-ink-faint">
                  {new Date(w.createdAt).toLocaleDateString(tag)}
                </span>
              </span>
              {w.explorerUrl ? (
                <a
                  href={w.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-azure underline underline-offset-4"
                >
                  {s("earnings.paidLink")}
                </a>
              ) : (
                <span className="text-sm text-ink-faint">{w.status}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
