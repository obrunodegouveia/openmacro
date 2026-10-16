"use client";

import * as React from "react";
import { useSiteText } from "@/lib/use-site-text";

import { getSupabase } from "@/lib/supabase";

/**
 * ============================================================================
 * Treasury console
 * ============================================================================
 *
 * Everything on this page is fetched from `/api/admin/rewards`, which decides
 * for itself whether the caller is an admin. This component does no gating:
 * hiding a button is presentation, not security, and the API refuses a
 * non-admin regardless of what the browser chooses to render.
 *
 * A non-admin who reaches this page sees the same thing as a stranger — a
 * "not found", because the API answers 404 rather than 403 so the endpoint's
 * existence is not confirmed.
 */

interface Recipient {
  id: string;
  key: string;
  label: string;
  address: string | null;
  status: "pending" | "active" | "disabled";
  scheme: "module" | "earnings";
  amountEuros: string | null;
  xpRateEuros: string | null;
  hourRateEuros: string | null;
  claimantEmail: string | null;
  note: string | null;
  activatedAt: string | null;
}

interface Claim {
  id: string;
  recipient_key: string;
  claim_key: string;
  amount_base_units: string;
  status: string;
  tx_hash: string | null;
  paid_to_address: string | null;
  failure_reason: string | null;
  broadcast_nonce: number | null;
  created_at: string;
  explorerUrl: string | null;
}

interface AdminEvent {
  actor_email: string;
  action: string;
  detail: Record<string, unknown>;
  created_at: string;
}

interface Overview {
  admin: { email: string };
  treasury: { address: string; eurc: string; eth: string } | { error: string };
  recipients: Recipient[];
  claims: Claim[];
  events: AdminEvent[];
}

/** EURC base units to euros, for display. 6 decimals, no float involved. */
function euros(baseUnits: string): string {
  const padded = baseUnits.padStart(7, "0");
  const whole = padded.slice(0, -6);
  const frac = padded.slice(-6).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

function short(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function Treasury() {
  const s = useSiteText();
  const [data, setData] = React.useState<Overview | null>(null);
  const [state, setState] = React.useState<"loading" | "ready" | "denied" | "error">("loading");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [confirming, setConfirming] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  const token = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data: session } = await supabase.auth.getSession();
    return session.session?.access_token ?? null;
  }, []);

  /**
   * Fetches, and returns what it found. Deliberately sets no state: keeping IO
   * and state separate is what lets the effect below apply a result only if it
   * is still wanted, and keeps `setState` out of an effect body.
   */
  const fetchOverview = React.useCallback(async (): Promise<
    { state: "ready"; data: Overview } | { state: "denied" | "error" }
  > => {
    const bearer = await token();
    if (!bearer) return { state: "denied" };
    try {
      const response = await fetch("/api/admin/rewards", {
        headers: { authorization: `Bearer ${bearer}` },
        cache: "no-store",
      });
      if (response.status === 404) return { state: "denied" };
      if (!response.ok) return { state: "error" };
      return { state: "ready", data: (await response.json()) as Overview };
    } catch {
      return { state: "error" };
    }
  }, [token]);

  const load = React.useCallback(async () => {
    const result = await fetchOverview();
    if (result.state === "ready") setData(result.data);
    setState(result.state);
  }, [fetchOverview]);

  React.useEffect(() => {
    // Guarded so a result arriving after unmount, or after a newer request, is
    // dropped rather than applied.
    let cancelled = false;
    void (async () => {
      const result = await fetchOverview();
      if (cancelled) return;
      if (result.state === "ready") setData(result.data);
      setState(result.state);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchOverview]);

  /** Run an admin action. Resolves to the error text, or null on success. */
  async function act(
    action: string,
    payload: Record<string, unknown>,
    label: string,
  ): Promise<string | null> {
    setBusy(label);
    setMessage(null);
    try {
      const bearer = await token();
      const response = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${bearer}` },
        body: JSON.stringify({ action, ...payload }),
      });
      const result = (await response.json()) as { error?: string; explorerUrl?: string };
      setMessage(
        response.ok
          ? { tone: "ok", text: result.explorerUrl ? `Sent — ${result.explorerUrl}` : "Done." }
          : { tone: "bad", text: result.error ?? "That did not work." },
      );
      if (response.ok) {
        await load();
        return null;
      }
      return result.error ?? "That did not work.";
    } catch {
      setMessage({ tone: "bad", text: "Could not reach the server." });
      return "Could not reach the server.";
    } finally {
      setBusy(null);
    }
  }

  if (state === "loading") return <p className="text-sm text-ink-faint">{s("treasury.loading")}</p>;
  if (state === "denied") {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{s("treasury.notFound")}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {s("treasury.denied")}
        </p>
      </div>
    );
  }
  if (state === "error" || !data) {
    return <p className="text-sm text-coral">{s("treasury.loadError")}</p>;
  }

  const stuck = data.claims.filter((c) => c.status === "CLAIM_PENDING");

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{s("treasury.title")}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {s("treasury.signedInAs", { email: data.admin.email })}
        </p>
      </header>

      {message ? (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm break-all ${
            message.tone === "ok"
              ? "bg-mint/10 text-mint-bright"
              : "bg-coral/10 text-coral"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {/* ---- funds ------------------------------------------------------ */}
      <section>
        <h2 className="text-lg font-medium">{s("treasury.funds")}</h2>
        {"error" in data.treasury ? (
          <p className="mt-2 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
            {data.treasury.error}
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label={s("treasury.eurc")} value={`€${data.treasury.eurc}`} />
              <Stat label={s("treasury.eth")} value={data.treasury.eth} />
            </div>

            <div className="rounded-xl border border-hairline p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                {s("treasury.topUp")}
              </p>
              <p className="mt-1 font-mono text-sm break-all">{data.treasury.address}</p>
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(
                  "error" in data.treasury ? "" : data.treasury.address,
                )}
                className="mt-2 text-xs underline underline-offset-4"
              >
                {s("treasury.copy")}
              </button>
              {/*
                The single most expensive mistake available on this page, so it
                is stated where the address is copied rather than in a doc.
              */}
              <p className="mt-3 text-xs text-gold">
                {s("treasury.networkWarning.lead")} <strong>Base</strong>
                {s("treasury.networkWarning.tail")}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ---- stuck claims ----------------------------------------------- */}
      {stuck.length > 0 ? (
        <section>
          <h2 className="text-lg font-medium text-gold">
            {s("treasury.attention")}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {s("treasury.attentionBody")}
          </p>
          <ul className="mt-3 space-y-3">
            {stuck.map((claim) => (
              <li
                key={claim.id}
                className="rounded-xl border border-gold/40 p-4 text-sm"
              >
                <p>
                  <strong>{claim.recipient_key}</strong> · €{euros(claim.amount_base_units)} · {s("treasury.nonce")}{" "}
                  <span className="font-mono">{claim.broadcast_nonce ?? "—"}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => {
                      const hash = window.prompt("Transaction hash that paid this claim:");
                      if (hash) void act("resolve-claim", { id: claim.id, outcome: "paid", txHash: hash.trim() }, claim.id);
                    }}
                    className="rounded-lg border border-hairline px-3 py-1.5 text-xs"
                  >
                    {s("treasury.wasPaid")}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void act("resolve-claim", { id: claim.id, outcome: "failed" }, claim.id)}
                    className="rounded-lg border border-hairline px-3 py-1.5 text-xs"
                  >
                    {s("treasury.neverSent")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---- recipients -------------------------------------------------- */}
      <section>
        <h2 className="text-lg font-medium">{s("treasury.recipients")}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {s("treasury.recipientsBody.lead")} <em>{s("treasury.recipientsBody.pending")}</em>{" "}
          {s("treasury.recipientsBody.tail")}
        </p>

        <ul className="mt-4 space-y-3">
          {data.recipients.map((r) => (
            <li key={r.id} className="rounded-xl border border-hairline p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {r.label}{" "}
                  <span className="font-mono text-xs text-ink-faint">{r.key}</span>
                </p>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 font-mono text-xs text-ink-faint break-all" title={r.address ?? ""}>
                {r.address ? short(r.address) : s("treasury.noAddress")}
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                {r.scheme === "earnings"
                  ? s("treasury.scheme.earnings", {
                      xp: r.xpRateEuros ?? "0.002",
                      hour: r.hourRateEuros ?? "0.20",
                    })
                  : r.amountEuros
                    ? s("treasury.perModule", { amount: r.amountEuros })
                    : s("treasury.defaultAmount")}
                {r.note ? ` · ${r.note}` : ""}
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                {r.claimantEmail
                  ? s("treasury.claimedBy", { email: r.claimantEmail })
                  : s("treasury.unbound")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy !== null || r.status === "disabled" || !r.address}
                  onClick={() => void act("test-send", { id: r.id, amountEuros: "1.00" }, r.id)}
                  className="rounded-lg border border-hairline px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  {busy === r.id ? s("treasury.sending") : s("treasury.testSend")}
                </button>
                {r.status !== "active" ? (
                  <button
                    type="button"
                    disabled={busy !== null}
                    // Confirmed in the page: a browser dialog is easy to wave
                    // through, and this is the step that makes an address payable.
                    onClick={() => setConfirming(r.id)}
                    className="rounded-lg bg-mint px-3 py-1.5 text-xs text-abyss disabled:opacity-50"
                  >
                    {s("treasury.activate")}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void act("set-status", { id: r.id, status: "disabled" }, r.id)}
                    className="rounded-lg border border-hairline px-3 py-1.5 text-xs disabled:opacity-50"
                  >
                    {s("treasury.disable")}
                  </button>
                )}
              </div>

              {confirming === r.id ? (
                <div
                  role="alertdialog"
                  aria-label={s("treasury.activate")}
                  className="mt-3 grid gap-3 rounded-xl border border-gold/40 bg-gold/[0.07] p-3"
                >
                  <p className="text-sm text-ink">
                    {s("treasury.confirmActivate", {
                      name: r.label,
                      where: r.address ?? s("treasury.ownAddress"),
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      autoFocus
                      disabled={busy !== null}
                      onClick={() => {
                        setConfirming(null);
                        void act("set-status", { id: r.id, status: "active" }, r.id);
                      }}
                      className="rounded-lg bg-mint px-3 py-1.5 text-sm font-bold text-abyss disabled:opacity-50"
                    >
                      {s("treasury.activate")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="rounded-lg border border-hairline px-3 py-1.5 text-sm"
                    >
                      {s("treasury.cancel")}
                    </button>
                  </div>
                </div>
              ) : null}

              {r.scheme === "earnings" ? (
                <RatesEditor
                  recipient={r}
                  busy={busy !== null}
                  onSave={(rates) => act("set-rates", { id: r.id, ...rates }, r.id)}
                />
              ) : null}
            </li>
          ))}
          {data.recipients.length === 0 ? (
            <li className="text-sm text-ink-faint">{s("treasury.nobody")}</li>
          ) : null}
        </ul>

        <AddRecipient
          busy={busy !== null}
          onAdd={(payload) => act("add-recipient", payload, "add")}
        />
      </section>

      {/* ---- claims ------------------------------------------------------ */}
      <section>
        <h2 className="text-lg font-medium">{s("treasury.payouts")}</h2>
        <ul className="mt-3 divide-y divide-hairline text-sm">
          {data.claims.map((claim) => (
            <li key={claim.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
              <span>
                {claim.recipient_key} · €{euros(claim.amount_base_units)}{" "}
                <span className="text-xs text-ink-faint">{claim.claim_key}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-ink-faint">{claim.status}</span>
                {claim.explorerUrl ? (
                  <a
                    href={claim.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-4"
                  >
                    {s("treasury.baseScan")}
                  </a>
                ) : null}
              </span>
            </li>
          ))}
          {data.claims.length === 0 ? (
            <li className="py-2 text-ink-faint">{s("treasury.noPayouts")}</li>
          ) : null}
        </ul>
      </section>

      {/* ---- audit ------------------------------------------------------- */}
      <section>
        <h2 className="text-lg font-medium">{s("treasury.adminLog")}</h2>
        <ul className="mt-3 space-y-1 font-mono text-xs text-ink-faint">
          {data.events.map((event, i) => (
            <li key={i}>
              {new Date(event.created_at).toLocaleString()} · {event.action} ·{" "}
              {event.actor_email}
            </li>
          ))}
          {data.events.length === 0 ? <li>{s("treasury.noLog")}</li> : null}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Recipient["status"] }) {
  const tone =
    status === "active"
      ? "bg-mint/15 text-mint-bright"
      : status === "pending"
        ? "bg-gold/15 text-gold"
        : "bg-veil/10 text-ink-muted";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{status}</span>;
}

function AddRecipient({
  busy,
  onAdd,
}: {
  busy: boolean;
  /** Resolves to the server's error text, or null once the recipient is saved. */
  onAdd: (payload: Record<string, unknown>) => Promise<string | null>;
}) {
  const s = useSiteText();
  const [open, setOpen] = React.useState(false);
  const empty = {
    key: "", label: "", address: "", amountEuros: "", claimantEmail: "", note: "",
    scheme: "module" as "module" | "earnings",
  };
  const [form, setForm] = React.useState(empty);
  const [error, setError] = React.useState<string | null>(null);
  const earnings = form.scheme === "earnings";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-hairline px-3 py-2 text-sm"
      >
        {s("treasury.addRecipient")}
      </button>
    );
  }

  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-hairline p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        // An earnings recipient has no per-module amount; do not send a stale one.
        const failure = await onAdd(earnings ? { ...form, amountEuros: "" } : form);
        // Keep what was typed when the server says no, so it can be corrected.
        if (failure) {
          setError(failure);
          return;
        }
        setOpen(false);
        setForm(empty);
      }}
    >
      {/* First, because it decides which of the fields below are required. */}
      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input
          type="checkbox"
          checked={earnings}
          onChange={(event) =>
            setForm((f) => ({ ...f, scheme: event.target.checked ? "earnings" : "module" }))
          }
          className="mt-0.5"
        />
        <span>{s("treasury.field.earnings")}</span>
      </label>

      <Field label={s("treasury.field.key")} value={form.key} placeholder={s("treasury.field.keyPlaceholder")}
        hint={s("treasury.field.keyHint")} required pattern="[a-z][a-z0-9_\-]{1,30}"
        onChange={(v) => setForm((f) => ({ ...f, key: v.toLowerCase() }))} />
      <Field label={s("treasury.field.name")} value={form.label} placeholder={s("treasury.field.namePlaceholder")}
        required onChange={(v) => setForm((f) => ({ ...f, label: v }))} />
      <Field label={s("treasury.field.claimant")} value={form.claimantEmail} placeholder={s("treasury.field.claimantPlaceholder")}
        type="email" required={earnings}
        onChange={(v) => setForm((f) => ({ ...f, claimantEmail: v }))} />
      <Field
        label={earnings ? s("treasury.field.addressOptional") : s("treasury.field.address")}
        value={form.address} placeholder="0x…" mono required={!earnings} pattern="0x[0-9a-fA-F]{40}"
        onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
      {earnings ? null : (
        <Field label={s("treasury.field.amount")} value={form.amountEuros} placeholder="1.00"
          onChange={(v) => setForm((f) => ({ ...f, amountEuros: v }))} />
      )}
      <Field label={s("treasury.field.note")} value={form.note} placeholder=""
        onChange={(v) => setForm((f) => ({ ...f, note: v }))} />

      <p className="text-xs text-ink-faint">
        {s("treasury.addedPending")}
      </p>

      {error ? (
        <p role="alert" className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-mint px-3 py-2 text-sm text-abyss disabled:opacity-50"
        >
          {s("treasury.add")}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="rounded-lg border border-hairline px-3 py-2 text-sm"
        >
          {s("treasury.cancel")}
        </button>
      </div>
    </form>
  );
}

/**
 * Change one earnings recipient's euros per XP and per active hour.
 *
 * Collapsed to a button until opened. An empty field restores the default.
 *
 * @param recipient  The earnings recipient whose rates are shown and edited.
 * @param busy       True while any admin action is in flight.
 * @param onSave     Resolves to the server's error text, or null once saved.
 */
function RatesEditor({
  recipient,
  busy,
  onSave,
}: {
  recipient: Recipient;
  busy: boolean;
  onSave: (rates: { xpRateEuros: string; hourRateEuros: string }) => Promise<string | null>;
}) {
  const s = useSiteText();
  const [open, setOpen] = React.useState(false);
  const [xp, setXp] = React.useState(recipient.xpRateEuros ?? "");
  const [hour, setHour] = React.useState(recipient.hourRateEuros ?? "");
  const [error, setError] = React.useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          // Start from what is saved, not from an earlier abandoned edit.
          setXp(recipient.xpRateEuros ?? "");
          setHour(recipient.hourRateEuros ?? "");
          setError(null);
          setOpen(true);
        }}
        className="mt-2 text-xs underline underline-offset-2 text-ink-muted disabled:opacity-50"
      >
        {s("treasury.rates.edit")}
      </button>
    );
  }

  return (
    <form
      className="mt-3 space-y-3 rounded-lg border border-hairline p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const failure = await onSave({ xpRateEuros: xp.trim(), hourRateEuros: hour.trim() });
        if (failure) {
          setError(failure);
          return;
        }
        setOpen(false);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={s("treasury.rates.xp")} value={xp} placeholder="0.002" mono
          pattern="\d+([.,]\d{1,6})?" onChange={setXp} />
        <Field label={s("treasury.rates.hour")} value={hour} placeholder="0.20" mono
          pattern="\d+([.,]\d{1,6})?" onChange={setHour} />
      </div>
      <p className="text-xs text-ink-faint">{s("treasury.rates.note")}</p>

      {error ? (
        <p role="alert" className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-mint px-3 py-1.5 text-xs text-abyss disabled:opacity-50"
        >
          {s("treasury.rates.save")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-hairline px-3 py-1.5 text-xs"
        >
          {s("treasury.cancel")}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  placeholder,
  mono,
  hint,
  required,
  pattern,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  mono?: boolean;
  /** One line under the input explaining what it accepts. */
  hint?: string;
  required?: boolean;
  /** HTML pattern; the browser blocks submit and points at the field. */
  pattern?: string;
  type?: "text" | "email";
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-lg border border-hairline bg-transparent px-3 py-2 text-sm ${
          mono ? "font-mono" : ""
        }`}
      />
      {hint ? <span className="mt-1 block text-xs text-ink-faint">{hint}</span> : null}
    </label>
  );
}
