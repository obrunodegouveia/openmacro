"use client";

import * as React from "react";

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
  address: string;
  status: "pending" | "active" | "disabled";
  amountEuros: string | null;
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
  const [data, setData] = React.useState<Overview | null>(null);
  const [state, setState] = React.useState<"loading" | "ready" | "denied" | "error">("loading");
  const [busy, setBusy] = React.useState<string | null>(null);
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

  async function act(action: string, payload: Record<string, unknown>, label: string) {
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
      if (response.ok) await load();
    } catch {
      setMessage({ tone: "bad", text: "Could not reach the server." });
    } finally {
      setBusy(null);
    }
  }

  if (state === "loading") return <p className="text-sm text-neutral-500">Loading…</p>;
  if (state === "denied") {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          There is nothing here for this account.
        </p>
      </div>
    );
  }
  if (state === "error" || !data) {
    return <p className="text-sm text-red-600">Could not load the treasury.</p>;
  }

  const stuck = data.claims.filter((c) => c.status === "CLAIM_PENDING");

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Treasury</h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Signed in as {data.admin.email}
        </p>
      </header>

      {message ? (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm break-all ${
            message.tone === "ok"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {/* ---- funds ------------------------------------------------------ */}
      <section>
        <h2 className="text-lg font-medium">Funds</h2>
        {"error" in data.treasury ? (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {data.treasury.error}
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="EURC" value={`€${data.treasury.eurc}`} />
              <Stat label="ETH (gas)" value={data.treasury.eth} />
            </div>

            <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Top up this address
              </p>
              <p className="mt-1 font-mono text-sm break-all">{data.treasury.address}</p>
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(
                  "error" in data.treasury ? "" : data.treasury.address,
                )}
                className="mt-2 text-xs underline underline-offset-4"
              >
                Copy
              </button>
              {/*
                The single most expensive mistake available on this page, so it
                is stated where the address is copied rather than in a doc.
              */}
              <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
                Send EURC and ETH on <strong>Base</strong> only. The same address on another
                network will not arrive and cannot be recovered.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ---- stuck claims ----------------------------------------------- */}
      {stuck.length > 0 ? (
        <section>
          <h2 className="text-lg font-medium text-amber-700 dark:text-amber-400">
            Needs attention
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            These stopped between broadcasting and recording. Look up the nonce on the treasury
            address in BaseScan: if a transaction exists the money moved, if not it did not.
            Do not retry the payment — a pending transaction can still be mined.
          </p>
          <ul className="mt-3 space-y-3">
            {stuck.map((claim) => (
              <li
                key={claim.id}
                className="rounded-xl border border-amber-300 p-4 text-sm dark:border-amber-800"
              >
                <p>
                  <strong>{claim.recipient_key}</strong> · €{euros(claim.amount_base_units)} · nonce{" "}
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
                    className="rounded-lg border border-black/15 px-3 py-1.5 text-xs dark:border-white/20"
                  >
                    It was paid
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void act("resolve-claim", { id: claim.id, outcome: "failed" }, claim.id)}
                    className="rounded-lg border border-black/15 px-3 py-1.5 text-xs dark:border-white/20"
                  >
                    It never sent
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---- recipients -------------------------------------------------- */}
      <section>
        <h2 className="text-lg font-medium">Who can be paid</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          A new address starts <em>pending</em> and cannot receive a game reward. Send a test,
          confirm it arrived in their Coinbase account, then activate it.
        </p>

        <ul className="mt-4 space-y-3">
          {data.recipients.map((r) => (
            <li key={r.id} className="rounded-xl border border-black/10 p-4 dark:border-white/15">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {r.label}{" "}
                  <span className="font-mono text-xs text-neutral-500">{r.key}</span>
                </p>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 font-mono text-xs text-neutral-500 break-all" title={r.address}>
                {short(r.address)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {r.amountEuros ? `€${r.amountEuros} per module` : "default amount"}
                {r.note ? ` · ${r.note}` : ""}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {r.claimantEmail
                  ? `claimed by ${r.claimantEmail}`
                  : "no account bound — nobody can earn into this wallet"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy !== null || r.status === "disabled"}
                  onClick={() => void act("test-send", { id: r.id, amountEuros: "1.00" }, r.id)}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-xs disabled:opacity-50 dark:border-white/20"
                >
                  {busy === r.id ? "Sending…" : "Send €1 test"}
                </button>
                {r.status !== "active" ? (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => {
                      if (window.confirm(`Make ${r.label} payable at ${r.address}?`)) {
                        void act("set-status", { id: r.id, status: "active" }, r.id);
                      }
                    }}
                    className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void act("set-status", { id: r.id, status: "disabled" }, r.id)}
                    className="rounded-lg border border-black/15 px-3 py-1.5 text-xs disabled:opacity-50 dark:border-white/20"
                  >
                    Disable
                  </button>
                )}
              </div>
            </li>
          ))}
          {data.recipients.length === 0 ? (
            <li className="text-sm text-neutral-500">Nobody yet.</li>
          ) : null}
        </ul>

        <AddRecipient
          busy={busy !== null}
          onAdd={(payload) => void act("add-recipient", payload, "add")}
        />
      </section>

      {/* ---- claims ------------------------------------------------------ */}
      <section>
        <h2 className="text-lg font-medium">Recent payouts</h2>
        <ul className="mt-3 divide-y divide-black/5 text-sm dark:divide-white/10">
          {data.claims.map((claim) => (
            <li key={claim.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
              <span>
                {claim.recipient_key} · €{euros(claim.amount_base_units)}{" "}
                <span className="text-xs text-neutral-500">{claim.claim_key}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">{claim.status}</span>
                {claim.explorerUrl ? (
                  <a
                    href={claim.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-4"
                  >
                    BaseScan ↗
                  </a>
                ) : null}
              </span>
            </li>
          ))}
          {data.claims.length === 0 ? (
            <li className="py-2 text-neutral-500">No payouts yet.</li>
          ) : null}
        </ul>
      </section>

      {/* ---- audit ------------------------------------------------------- */}
      <section>
        <h2 className="text-lg font-medium">Admin log</h2>
        <ul className="mt-3 space-y-1 font-mono text-xs text-neutral-500">
          {data.events.map((event, i) => (
            <li key={i}>
              {new Date(event.created_at).toLocaleString()} · {event.action} ·{" "}
              {event.actor_email}
            </li>
          ))}
          {data.events.length === 0 ? <li>Nothing recorded yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: Recipient["status"] }) {
  const tone =
    status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
      : status === "pending"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
        : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{status}</span>;
}

function AddRecipient({
  busy,
  onAdd,
}: {
  busy: boolean;
  onAdd: (payload: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    key: "", label: "", address: "", amountEuros: "", claimantEmail: "", note: "",
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20"
      >
        Add a recipient
      </button>
    );
  }

  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/15"
      onSubmit={(event) => {
        event.preventDefault();
        onAdd(form);
        setOpen(false);
        setForm({ key: "", label: "", address: "", amountEuros: "", claimantEmail: "", note: "" });
      }}
    >
      <Field label="Key (used by the game)" value={form.key} placeholder="daughter"
        onChange={(v) => setForm((f) => ({ ...f, key: v }))} />
      <Field label="Name" value={form.label} placeholder="Sofia"
        onChange={(v) => setForm((f) => ({ ...f, label: v }))} />
      <Field label="Coinbase deposit address on Base" value={form.address} placeholder="0x…" mono
        onChange={(v) => setForm((f) => ({ ...f, address: v }))} />
      <Field label="Reward per module in euros (optional)" value={form.amountEuros} placeholder="1.00"
        onChange={(v) => setForm((f) => ({ ...f, amountEuros: v }))} />
      <Field label="Account that claims into it" value={form.claimantEmail} placeholder="her@email.com"
        onChange={(v) => setForm((f) => ({ ...f, claimantEmail: v }))} />
      <Field label="Note (optional)" value={form.note} placeholder=""
        onChange={(v) => setForm((f) => ({ ...f, note: v }))} />

      <p className="text-xs text-neutral-500">
        Added as pending. It cannot receive a reward until you send a test and activate it.
      </p>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20"
        >
          Cancel
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
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  mono?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20 ${
          mono ? "font-mono" : ""
        }`}
      />
    </label>
  );
}
