"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, Coins, Minus, RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCompactCurrency, formatDelta } from "@/lib/format";
import {
  evaluate,
  openingTotal,
  type BalanceSheetSide,
  type EntryChip,
  type Placement,
  type TAccountEntity,
  type TAccountScenario,
} from "@/lib/t-accounts";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * T-account micro-puzzle — the playable teaser
 * ============================================================================
 *
 * The pedagogical primitive of the whole platform: instead of reading that
 * "QE expands the balance sheet", the visitor posts the entries themselves and
 * finds out whether the sheets balance.
 *
 * Interaction is tap-to-place rather than drag-and-drop. Pick an entry, then
 * pick a side. It costs one extra tap on a desktop and it buys a puzzle that
 * works on a phone, works with a keyboard, and works with a screen reader —
 * for an education product aimed at kids, that is not a trade worth losing.
 */

const SIDES: BalanceSheetSide[] = ["asset", "liability"];

const SIDE_LABEL: Record<BalanceSheetSide, string> = {
  asset: "Assets",
  liability: "Liabilities",
};

const SIDE_HINT: Record<BalanceSheetSide, string> = {
  asset: "What it owns",
  liability: "What it owes",
};

/** Past-tense labels. Written out rather than suffixed — "unchangeded". */
const DIRECTION_LABEL = {
  expand: "expanded",
  contract: "contracted",
  unchanged: "unchanged",
} as const;

type Status = "drafting" | "wrong" | "solved";

export function TAccountPuzzle({
  scenario,
  onSolved,
}: {
  scenario: TAccountScenario;
  /**
   * Fired when the sheets balance and every posting is right.
   *
   * Optional so the standalone teaser on the home page is unchanged — only a
   * lesson needs to know that a step was cleared.
   */
  onSolved?: () => void;
}) {
  const [placements, setPlacements] = React.useState<Record<string, Placement>>({});
  const [selectedChipId, setSelectedChipId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("drafting");

  const verdict = evaluate(scenario, placements);
  const trayChips = scenario.chips.filter((chip) => !placements[chip.id]);

  /** Places the selected chip, or clears the selection if none is active. */
  function placeInto(entityId: string, side: BalanceSheetSide) {
    if (!selectedChipId) return;
    setPlacements((current) => ({ ...current, [selectedChipId]: { entityId, side } }));
    setSelectedChipId(null);
    setStatus("drafting");
  }

  function returnToTray(chipId: string) {
    setPlacements((current) => ({ ...current, [chipId]: null }));
    setStatus("drafting");
  }

  function check() {
    setStatus(verdict.correct ? "solved" : "wrong");
    if (verdict.correct) onSolved?.();
  }

  function reset() {
    setPlacements({});
    setSelectedChipId(null);
    setStatus("drafting");
  }

  const placedCount = Object.values(placements).filter(Boolean).length;

  return (
    <div className="glass overflow-hidden rounded-card shadow-2xl shadow-black/50">
      {/* Header ------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white/[0.03] px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-lg">
            🏛️
          </span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-tight sm:text-base">
              {scenario.title}
            </p>
            <p className="text-xs font-semibold text-ink-faint">{scenario.moduleLabel}</p>
          </div>
        </div>
        <Badge tone="gold">
          <Coins className="size-3" aria-hidden />+{scenario.xp} XP
        </Badge>
      </div>

      <div className="p-5 sm:p-7">
        <h3 className="text-balance font-display text-xl font-extrabold leading-snug">
          {scenario.prompt}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {scenario.scenario}
        </p>

        {/* Entry tray ------------------------------------------------- */}
        <div className="mt-6 rounded-2xl border border-hairline bg-abyss/60 p-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-faint">
              Entries to post
            </p>
            <p className="text-xs font-semibold text-ink-faint">
              {selectedChipId
                ? "Now choose a sheet and a side →"
                : `${placedCount} of ${scenario.chips.length} placed`}
            </p>
          </div>

          {trayChips.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {trayChips.map((chip) => (
                <li key={chip.id}>
                  <ChipButton
                    chip={chip}
                    selected={selectedChipId === chip.id}
                    onClick={() =>
                      setSelectedChipId((current) => (current === chip.id ? null : chip.id))
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-semibold text-ink-muted">
              Every entry is placed. Check your work.
            </p>
          )}

          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            {scenario.instructions}
          </p>
        </div>

        {/* Balance sheets --------------------------------------------- */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {scenario.entities.map((entity) => (
            <TAccount
              key={entity.id}
              entity={entity}
              scenario={scenario}
              placements={placements}
              selectedChipId={selectedChipId}
              balance={verdict.balances.find((item) => item.entityId === entity.id)}
              onPlace={placeInto}
              onRemove={returnToTray}
            />
          ))}
        </div>

        {/* Controls --------------------------------------------------- */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={check} disabled={placedCount === 0} size="lg">
            <Check className="size-4" aria-hidden />
            Check entries
          </Button>
          {placedCount > 0 ? (
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="size-4" aria-hidden />
              Start over
            </Button>
          ) : null}
        </div>
      </div>

      {/* Feedback sheet ------------------------------------------------ */}
      <AnimatePresence>
        {status !== "drafting" ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "overflow-hidden border-t",
              status === "solved"
                ? "border-mint/30 bg-mint/[0.09]"
                : "border-coral/30 bg-coral/[0.07]",
            )}
          >
            <div className="px-5 py-5 sm:px-7">
              {status === "solved" ? (
                <SolvedPanel scenario={scenario} onReset={reset} />
              ) : (
                <WrongPanel hint={verdict.hint} />
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ChipButton({
  chip,
  selected,
  onClick,
}: {
  chip: EntryChip;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition-all",
        selected
          ? "border-mint bg-mint/20 text-ink ring-2 ring-mint/40"
          : "border-hairline bg-white/5 text-ink-muted hover:border-mint/40 hover:text-ink",
      )}
    >
      <span
        className={cn(
          "tabular font-mono",
          chip.delta >= 0 ? "text-mint-bright" : "text-coral",
        )}
      >
        {formatDelta(chip.delta)}
      </span>
      <span>{chip.account}</span>
    </button>
  );
}

function TAccount({
  entity,
  scenario,
  placements,
  selectedChipId,
  balance,
  onPlace,
  onRemove,
}: {
  entity: TAccountEntity;
  scenario: TAccountScenario;
  placements: Record<string, Placement>;
  selectedChipId: string | null;
  balance?: { assetDelta: number; liabilityDelta: number; balanced: boolean };
  onPlace: (entityId: string, side: BalanceSheetSide) => void;
  onRemove: (chipId: string) => void;
}) {
  const touched = (balance?.assetDelta ?? 0) !== 0 || (balance?.liabilityDelta ?? 0) !== 0;

  return (
    <div className="rounded-2xl border border-hairline bg-abyss/50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-extrabold">{entity.label}</h4>
          {entity.role ? (
            <p className="text-[0.7rem] font-semibold text-ink-faint">{entity.role}</p>
          ) : null}
        </div>
        {touched ? (
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider",
              balance?.balanced
                ? "border-mint/40 bg-mint/10 text-mint-bright"
                : "border-coral/40 bg-coral/10 text-coral",
            )}
          >
            {balance?.balanced ? "Balanced" : "Off balance"}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SIDES.map((side) => (
          <SideColumn
            key={side}
            side={side}
            entity={entity}
            scenario={scenario}
            placements={placements}
            armed={selectedChipId !== null}
            onPlace={() => onPlace(entity.id, side)}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

function SideColumn({
  side,
  entity,
  scenario,
  placements,
  armed,
  onPlace,
  onRemove,
}: {
  side: BalanceSheetSide;
  entity: TAccountEntity;
  scenario: TAccountScenario;
  placements: Record<string, Placement>;
  armed: boolean;
  onPlace: () => void;
  onRemove: (chipId: string) => void;
}) {
  const opening = openingTotal(entity, side);
  const openingLines = (entity.openingLines ?? []).filter((line) => line.side === side);

  const placedHere = scenario.chips.filter((chip) => {
    const placement = placements[chip.id];
    return placement?.entityId === entity.id && placement.side === side;
  });

  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        armed
          ? "border-dashed border-mint/50 bg-mint/[0.06]"
          : "border-hairline bg-white/[0.02]",
      )}
    >
      <div className="mb-2">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-ink">
          {SIDE_LABEL[side]}
        </p>
        <p className="text-[0.65rem] font-semibold text-ink-faint">{SIDE_HINT[side]}</p>
      </div>

      {/* Opening balances, dimmed: context, not the puzzle. */}
      <ul className="flex flex-col gap-1 border-b border-hairline pb-2">
        {openingLines.map((line) => (
          <li key={line.account} className="flex items-baseline justify-between gap-2">
            <span className="text-[0.7rem] text-ink-faint">{line.account}</span>
            <span className="tabular font-mono text-[0.7rem] text-ink-faint">
              {formatCompactCurrency(line.amount)}
            </span>
          </li>
        ))}
        {openingLines.length === 0 ? (
          <li className="text-[0.7rem] text-ink-faint">—</li>
        ) : null}
      </ul>

      {/* Postings the learner has placed here. */}
      <ul className="mt-2 flex flex-col gap-1.5">
        {placedHere.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              onClick={() => onRemove(chip.id)}
              className="group flex w-full items-baseline justify-between gap-2 rounded-lg border border-mint/30 bg-mint/10 px-2 py-1.5 text-left transition-colors hover:border-coral/40 hover:bg-coral/10"
              title="Remove this entry"
            >
              <span className="text-[0.7rem] font-bold text-ink">{chip.account}</span>
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "tabular font-mono text-[0.7rem] font-bold",
                    chip.delta >= 0 ? "text-mint-bright" : "text-coral",
                  )}
                >
                  {formatDelta(chip.delta)}
                </span>
                <Undo2
                  className="size-3 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onPlace}
        disabled={!armed}
        className={cn(
          "mt-2 w-full rounded-lg border border-dashed px-2 py-2 text-[0.7rem] font-bold transition-colors",
          armed
            ? "border-mint/60 text-mint-bright hover:bg-mint/15"
            : "border-hairline/60 text-ink-faint",
        )}
      >
        {armed ? `Place here` : `Opening ${formatCompactCurrency(opening)}`}
      </button>
    </div>
  );
}

function WrongPanel({ hint }: { hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-coral/20 text-coral">
        <Minus className="size-5" strokeWidth={3} aria-hidden />
      </span>
      <div>
        <p className="font-display font-extrabold text-coral">Not balanced yet.</p>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {hint ?? "Check that every sheet moves on both sides by the same amount."}
        </p>
      </div>
    </div>
  );
}

function SolvedPanel({
  scenario,
  onReset,
}: {
  scenario: TAccountScenario;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 14 }}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-abyss"
        >
          <Check className="size-5" strokeWidth={4} aria-hidden />
        </motion.span>

        <div className="max-w-2xl">
          <p className="font-display font-extrabold text-mint-bright">
            Both sheets balance. That is the operation.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {scenario.explanation}
          </p>

          {/* Instant analysis — the payoff. */}
          <dl className="mt-4 grid gap-2 sm:grid-cols-3">
            {scenario.aggregateEffects.map((effect) => (
              <div
                key={effect.aggregate}
                className="rounded-xl border border-hairline bg-abyss/60 p-3"
              >
                <dt className="flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-ink-faint">
                  {effect.direction === "expand" ? (
                    <ArrowUp className="size-3 text-mint" aria-hidden />
                  ) : effect.direction === "contract" ? (
                    <ArrowDown className="size-3 text-coral" aria-hidden />
                  ) : (
                    <Minus className="size-3 text-ink-faint" aria-hidden />
                  )}
                  {effect.aggregate} {DIRECTION_LABEL[effect.direction]}
                </dt>
                <dd className="mt-1 text-[0.72rem] leading-relaxed text-ink-muted">
                  {effect.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="size-4" aria-hidden />
        Again
      </Button>
    </div>
  );
}
