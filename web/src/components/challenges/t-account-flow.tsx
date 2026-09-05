"use client";

import * as React from "react";
import { Minus, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import type {
  BalanceSheetSide,
  BalanceSheetShift,
  TAccountEntity,
} from "@openmacro/core/content/schema";
import { entityBalance, openingTotal } from "@openmacro/core/engine/tAccounts";
import { formatCompactCurrency, formatSignedCompactCurrency } from "@openmacro/core/format";
import type { ChallengeComponentProps } from "./types";
import { cn } from "@/lib/utils";

/**
 * Post a monetary operation by hand across two or three balance sheets.
 *
 * The interaction is pick-an-entry then pick-a-destination, for the same
 * reason the other types avoid dragging: it has to work from a keyboard, and
 * "which sheet, which side" is the actual question being asked — dragging adds
 * dexterity to a test of understanding.
 *
 * The BALANCED / OFF BALANCE badge updates live. That is deliberate feedback:
 * double entry is the one rule that is always checkable without knowing the
 * right answer, so the learner can catch half their own mistakes before
 * submitting.
 */
export function TAccountFlowView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<"t_account_flow">) {
  const currency = challenge.currency ?? "USD";
  const [placed, setPlaced] = React.useState<readonly string[]>([]);
  const [activeOption, setActiveOption] = React.useState<string | null>(null);

  const shifts = React.useMemo(
    () =>
      placed
        .map((id) => challenge.options.find((option) => option.id === id)?.shift)
        .filter((shift): shift is BalanceSheetShift => Boolean(shift)),
    [placed, challenge.options],
  );

  React.useEffect(() => {
    // Any non-empty set of postings is submittable — judging whether it is the
    // *right* set is the engine's job, not this component's.
    onAnswerChange(placed.length ? { type: "t_account_flow", shifts } : null);
  }, [placed, shifts, onAnswerChange]);

  const remaining = challenge.options.filter((option) => !placed.includes(option.id));

  function place(entityId: string, side: BalanceSheetSide) {
    if (locked || !activeOption) return;
    const option = challenge.options.find((o) => o.id === activeOption);
    // A chip only lands where it actually belongs. Letting it drop anywhere
    // would make the puzzle about guessing placement rather than about which
    // postings the operation requires.
    if (!option || option.shift.entityId !== entityId || option.shift.side !== side) {
      setActiveOption(null);
      return;
    }
    setPlaced((current) => [...current, option.id]);
    setActiveOption(null);
  }

  return (
    <div className="flex flex-col gap-5">
      {challenge.scenario ? (
        <p className="text-sm leading-relaxed text-ink-muted">{challenge.scenario}</p>
      ) : null}

      {/* Entries to post ------------------------------------------------ */}
      <div className="rounded-2xl border border-hairline bg-white/[0.03] p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
            Entries to post
          </p>
          <p className="text-xs font-bold text-ink-faint">
            {placed.length} of {challenge.options.length} placed
          </p>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2">
          {remaining.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                disabled={locked}
                aria-pressed={activeOption === option.id}
                onClick={() =>
                  setActiveOption((current) => (current === option.id ? null : option.id))
                }
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-bright",
                  activeOption === option.id
                    ? "border-mint bg-mint/15"
                    : "border-hairline bg-white/5 hover:border-white/25",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    option.shift.delta >= 0 ? "text-mint-bright" : "text-coral",
                  )}
                >
                  {formatSignedCompactCurrency(option.shift.delta, currency)}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {option.shift.account}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          {activeOption
            ? "Now choose whose sheet it lands on, and which side."
            : "Pick an entry, then choose whose sheet it lands on and which side. Every sheet must balance."}
        </p>
      </div>

      {/* Balance sheets -------------------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        {challenge.entities.map((entity) => (
          <EntitySheet
            key={entity.id}
            entity={entity}
            currency={currency}
            shifts={shifts}
            armed={Boolean(activeOption) && !locked}
            locked={locked}
            onDrop={place}
            onRemove={(optionId) =>
              setPlaced((current) => current.filter((id) => id !== optionId))
            }
            placedOptions={challenge.options.filter((o) => placed.includes(o.id))}
          />
        ))}
      </div>

      {!locked && placed.length ? (
        <div>
          <button
            type="button"
            onClick={() => {
              setPlaced([]);
              setActiveOption(null);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted hover:text-ink"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Start over
          </button>
        </div>
      ) : null}

      {/* Verdict + what actually moved ----------------------------------- */}
      {locked && result ? (
        <div
          className={cn(
            "rounded-xl border px-4 py-3",
            result.correct
              ? "border-mint/30 bg-mint/[0.07]"
              : "border-coral/30 bg-coral/[0.07]",
          )}
        >
          <p className="text-sm leading-relaxed text-ink-muted">
            {result.detail ?? result.explanation}
          </p>

          {result.correct && challenge.aggregateEffects?.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {challenge.aggregateEffects.map((effect) => (
                <li
                  key={effect.aggregate}
                  className="rounded-lg border border-hairline bg-white/[0.04] p-3"
                >
                  <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
                    <AggregateIcon direction={effect.direction} />
                    <span
                      className={
                        effect.direction === "expand"
                          ? "text-mint-bright"
                          : effect.direction === "contract"
                            ? "text-coral"
                            : "text-ink-faint"
                      }
                    >
                      {effect.aggregate} {effect.direction}ed
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    {effect.note}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AggregateIcon({ direction }: { direction: "expand" | "contract" | "unchanged" }) {
  const className = "size-3.5";
  if (direction === "expand") return <TrendingUp className={className} aria-hidden />;
  if (direction === "contract") return <TrendingDown className={className} aria-hidden />;
  return <Minus className={className} aria-hidden />;
}

/** One entity's T-account: assets on the left, liabilities on the right. */
function EntitySheet({
  entity,
  currency,
  shifts,
  armed,
  locked,
  onDrop,
  onRemove,
  placedOptions,
}: {
  entity: TAccountEntity;
  currency: string;
  shifts: readonly BalanceSheetShift[];
  armed: boolean;
  locked: boolean;
  onDrop: (entityId: string, side: BalanceSheetSide) => void;
  onRemove: (optionId: string) => void;
  placedOptions: readonly { id: string; shift: BalanceSheetShift }[];
}) {
  const balance = entityBalance(entity.id, shifts);
  const touched = balance.assetDelta !== 0 || balance.liabilityDelta !== 0;

  return (
    <section className="rounded-2xl border border-hairline bg-white/[0.02] p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-extrabold tracking-tight">
            {entity.label}
          </h3>
          {entity.role ? (
            <p className="text-xs text-ink-faint">{entity.role}</p>
          ) : null}
        </div>
        {touched ? (
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider",
              balance.balanced
                ? "border-mint/40 bg-mint/10 text-mint-bright"
                : "border-coral/40 bg-coral/10 text-coral",
            )}
          >
            {balance.balanced ? "Balanced" : "Off balance"}
          </span>
        ) : null}
      </header>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {(["asset", "liability"] as const).map((side) => (
          <SheetColumn
            key={side}
            entity={entity}
            side={side}
            currency={currency}
            armed={armed}
            locked={locked}
            onDrop={onDrop}
            onRemove={onRemove}
            postings={placedOptions.filter(
              (o) => o.shift.entityId === entity.id && o.shift.side === side,
            )}
          />
        ))}
      </div>
    </section>
  );
}

function SheetColumn({
  entity,
  side,
  currency,
  armed,
  locked,
  onDrop,
  onRemove,
  postings,
}: {
  entity: TAccountEntity;
  side: BalanceSheetSide;
  currency: string;
  armed: boolean;
  locked: boolean;
  onDrop: (entityId: string, side: BalanceSheetSide) => void;
  onRemove: (optionId: string) => void;
  postings: readonly { id: string; shift: BalanceSheetShift }[];
}) {
  const opening = openingTotal(entity, side);
  const openingLines = (entity.openingLines ?? []).filter((line) => line.side === side);
  // `${side}s` produced "liabilitys" in every one of these labels, which is
  // what a screen reader actually said out loud.
  const sideNoun = side === "asset" ? "assets" : "liabilities";

  return (
    <div className="rounded-xl border border-hairline bg-white/[0.03] p-3">
      <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
        {side === "asset" ? "Assets" : "Liabilities"}
      </p>
      <p className="text-[0.65rem] text-ink-faint">
        {side === "asset" ? "What it owns" : "What it owes"}
      </p>

      {openingLines.length ? (
        <ul className="mt-2 flex flex-col gap-1 border-b border-hairline pb-2">
          {openingLines.map((line) => (
            <li
              key={line.account}
              className="flex items-baseline justify-between gap-2 text-[0.7rem] text-ink-faint"
            >
              <span className="min-w-0 truncate">{line.account}</span>
              <span className="shrink-0 font-mono">
                {formatCompactCurrency(line.amount, currency)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="mt-2 flex flex-col gap-1.5">
        {postings.map((posting) => (
          <li key={posting.id}>
            <button
              type="button"
              disabled={locked}
              onClick={() => onRemove(posting.id)}
              aria-label={`Remove ${posting.shift.account} from ${entity.label} ${sideNoun}`}
              className="flex w-full items-baseline justify-between gap-2 rounded-lg border border-mint/40 bg-mint/10 px-2 py-1.5 text-left disabled:cursor-default"
            >
              <span className="min-w-0 truncate text-[0.7rem] font-bold text-ink">
                {posting.shift.account}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono text-[0.7rem] font-bold",
                  posting.shift.delta >= 0 ? "text-mint-bright" : "text-coral",
                )}
              >
                {formatSignedCompactCurrency(posting.shift.delta, currency)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={!armed}
        onClick={() => onDrop(entity.id, side)}
        aria-label={`Place the selected entry on ${entity.label}'s ${sideNoun}`}
        className={cn(
          "mt-2 w-full rounded-lg border border-dashed px-2 py-2 text-[0.7rem] font-bold transition-colors",
          armed
            ? "border-mint/60 bg-mint/5 text-mint-bright hover:bg-mint/15"
            : "border-white/10 text-ink-faint",
        )}
      >
        {armed ? "Place here" : `Opening ${formatCompactCurrency(opening, currency)}`}
      </button>
    </div>
  );
}
