"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { formatCurrency } from "@/lib/format";

/**
 * The floating hero visual: a live central bank balance sheet.
 *
 * It cycles between two policy states — "tightening" and "easing" — and both
 * sides of the sheet grow together, which is the whole pedagogical point: a
 * central bank buying bonds creates the reserves it pays with, so assets and
 * liabilities expand in lockstep and the sheet always balances.
 *
 * Values are illustrative (billions), chosen to be legible rather than to
 * mirror any particular institution.
 */

interface Position {
  label: string;
  /** Balance in the tightening state, in billions. */
  base: number;
  /** Balance after the easing programme, in billions. */
  eased: number;
  color: string;
}

const ASSETS: Position[] = [
  { label: "Government bonds", base: 2100, eased: 3400, color: "var(--color-azure)" },
  { label: "Loans to banks", base: 480, eased: 760, color: "#5b8dff" },
  { label: "FX & gold", base: 320, eased: 320, color: "var(--color-gold)" },
];

const LIABILITIES: Position[] = [
  { label: "Bank reserves", base: 1650, eased: 3110, color: "var(--color-mint)" },
  { label: "Currency in circulation", base: 980, eased: 1090, color: "var(--color-mint-bright)" },
  { label: "Capital & other", base: 270, eased: 280, color: "var(--color-violet)" },
];

const CYCLE_MS = 3800;

export function CentralBankBalanceSheet() {
  const reduceMotion = useReducedMotion();
  const [easing, setEasing] = React.useState(false);

  // Auto-cycle so the visual tells its story without requiring interaction.
  // Held still for anyone who has asked for reduced motion.
  React.useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setEasing((value) => !value), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const value = (position: Position) => (easing ? position.eased : position.base);
  const total = (positions: Position[]) =>
    positions.reduce((sum, position) => sum + value(position), 0);

  const assetTotal = total(ASSETS);
  const liabilityTotal = total(LIABILITIES);
  const scale = Math.max(assetTotal, liabilityTotal);

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="glass grid-lines relative w-full rounded-card p-5 shadow-2xl shadow-black/50 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
            Central bank balance sheet
          </p>
          <p className="font-display text-lg font-extrabold">
            {easing ? "Easing: buying bonds" : "Tightening: holding steady"}
          </p>
        </div>
        <motion.span
          key={String(easing)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
            easing
              ? "border-mint/40 bg-mint/15 text-mint-bright"
              : "border-hairline bg-white/5 text-ink-muted"
          }`}
        >
          {easing ? "QE on" : "QE off"}
        </motion.span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Column
          title="Assets"
          hint="What it owns"
          positions={ASSETS}
          valueOf={value}
          scale={scale}
          total={assetTotal}
        />
        <Column
          title="Liabilities"
          hint="What it owes"
          positions={LIABILITIES}
          valueOf={value}
          scale={scale}
          total={liabilityTotal}
        />
      </div>

      <p className="mt-5 border-t border-hairline pt-4 text-xs leading-relaxed text-ink-faint">
        Both sides move together. The reserves the bank pays with are created on
        the spot — the sheet always balances.
      </p>
    </motion.div>
  );
}

function Column({
  title,
  hint,
  positions,
  valueOf,
  scale,
  total,
}: {
  title: string;
  hint: string;
  positions: Position[];
  valueOf: (position: Position) => number;
  scale: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-abyss/50 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        {/* A label inside a decorative widget, not a document section — using
            a heading here breaks the h1 -> h3 order on the page. */}
        <p className="font-display text-sm font-extrabold uppercase tracking-wider">
          {title}
        </p>
        <span className="text-[0.7rem] font-semibold text-ink-faint">{hint}</span>
      </div>

      <ul className="flex flex-col gap-3">
        {positions.map((position) => {
          const amount = valueOf(position);
          return (
            <li key={position.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-ink-muted">
                  {position.label}
                </span>
                <span className="tabular font-mono text-xs font-bold text-ink">
                  {formatCurrency(amount)}B
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: position.color }}
                  animate={{ width: `${(amount / scale) * 100}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-3">
        <span className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-faint">
          Total
        </span>
        <span className="tabular font-mono text-sm font-extrabold text-ink">
          {formatCurrency(total)}B
        </span>
      </div>
    </div>
  );
}
