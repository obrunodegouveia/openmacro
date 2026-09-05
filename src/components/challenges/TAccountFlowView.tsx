/**
 * `t_account_flow` — post double-entry shifts across balance sheets.
 *
 * The learner is given a scenario and a pool of candidate postings, correct
 * ones mixed with distractors, and taps them onto the T-accounts. Tapping a
 * posted entry takes it back off.
 *
 * Tap rather than drag, for the same reasons as the other challenge types: it
 * is reliable on a small screen and accessible without extra work. The chip
 * already names its entity and side, so dragging would add ceremony without
 * adding meaning.
 *
 * All grading lives in `src/engine/tAccounts.ts`; this file only renders.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import type {
  BalanceSheetShift,
  BalanceSheetSide,
  MonetaryTier,
  TAccountEntity,
  TAccountEntryOption,
} from '@openmacro/core/content/schema';
import { entityBalance, openingTotal } from '@openmacro/core/engine/tAccounts';
import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { formatCompactCurrency, formatSignedCompactCurrency, seededShuffle } from '@openmacro/core/format';

const TIER_LABELS: Readonly<Record<MonetaryTier, string>> = {
  central_bank: 'Central bank',
  commercial_bank: 'Commercial bank',
  shadow_bank: 'Shadow bank',
  fiduciary_core: 'Fiduciary core',
};

const TIER_COLORS: Readonly<Record<MonetaryTier, string>> = {
  central_bank: palette.blueDark,
  commercial_bank: palette.mintDark,
  shadow_bank: palette.goldDark,
  fiduciary_core: palette.inkMuted,
};

/** Same slot identity the engine uses, for post-grading colouring. */
function slotKey(shift: BalanceSheetShift): string {
  return `${shift.entityId}::${shift.side}::${shift.account.trim().toLowerCase()}`;
}

export function TAccountFlowView({
  challenge,
  onAnswerChange,
  locked,
  result,
}: ChallengeComponentProps<'t_account_flow'>) {
  /** Option ids the learner has posted, in placement order. */
  const [placed, setPlaced] = useState<string[]>([]);

  const currency = challenge.currency ?? 'USD';

  const options = useMemo(
    () => seededShuffle(challenge.options, challenge.id),
    [challenge],
  );

  const optionById = useCallback(
    (id: string): TAccountEntryOption | undefined =>
      challenge.options.find((option) => option.id === id),
    [challenge],
  );

  const shifts = useMemo(
    () =>
      placed
        .map((id) => optionById(id)?.shift)
        .filter((shift): shift is BalanceSheetShift => Boolean(shift)),
    [placed, optionById],
  );

  useEffect(() => {
    onAnswerChange(placed.length > 0 ? { type: 't_account_flow', shifts } : null);
  }, [placed.length, shifts, onAnswerChange]);

  /** Expected postings keyed by slot, for marking chips once graded. */
  const expectedBySlot = useMemo(() => {
    const map = new Map<string, number>();
    for (const shift of challenge.expectedShifts) map.set(slotKey(shift), shift.delta);
    return map;
  }, [challenge]);

  const isShiftCorrect = useCallback(
    (shift: BalanceSheetShift) => {
      const want = expectedBySlot.get(slotKey(shift));
      return want !== undefined && Math.abs(want - shift.delta) <= 0.005;
    },
    [expectedBySlot],
  );

  const place = useCallback(
    (id: string) => {
      if (locked) return;
      emitFeedback('select');
      setPlaced((current) => (current.includes(id) ? current : [...current, id]));
    },
    [locked],
  );

  const remove = useCallback(
    (id: string) => {
      if (locked) return;
      emitFeedback('select');
      setPlaced((current) => current.filter((entry) => entry !== id));
    },
    [locked],
  );

  const unplaced = options.filter((option) => !placed.includes(option.id));

  return (
    <View style={styles.container}>
      {challenge.scenario ? <Text style={styles.scenario}>{challenge.scenario}</Text> : null}

      {/* ---- the balance sheets ---------------------------------------- */}
      {challenge.entities.map((entity) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          currency={currency}
          shifts={shifts}
          placedOptions={placed
            .map((id) => optionById(id))
            .filter((option): option is TAccountEntryOption => Boolean(option))
            .filter((option) => option.shift.entityId === entity.id)}
          locked={locked}
          isShiftCorrect={isShiftCorrect}
          onRemove={remove}
        />
      ))}

      {/* ---- the entries still to post --------------------------------- */}
      {unplaced.length > 0 ? (
        <View style={styles.pool}>
          <Text style={styles.poolHeading}>Entries to post</Text>
          {unplaced.map((option) => (
            <Animated.View
              key={option.id}
              entering={FadeIn.duration(180)}
              layout={LinearTransition.duration(200)}
            >
              <Pressable
                accessibilityRole="button"
                // Two chips can share an account name on different sheets, so
                // the entity has to be in the label or they are indistinguishable
                // to a screen reader.
                accessibilityLabel={`Post ${formatSignedCompactCurrency(option.shift.delta, currency)} to ${option.shift.account} on ${entityLabel(challenge.entities, option.shift.entityId)}'s ${option.shift.side === 'asset' ? 'assets' : 'liabilities'}`}
                onPress={() => place(option.id)}
                disabled={locked}
                style={styles.poolChip}
              >
                <View style={styles.poolChipBody}>
                  <Text style={styles.poolChipAccount}>{option.shift.account}</Text>
                  <Text style={styles.poolChipMeta}>
                    {entityLabel(challenge.entities, option.shift.entityId)} ·{' '}
                    {option.shift.side === 'asset' ? 'Assets' : 'Liabilities'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.poolChipDelta,
                    option.shift.delta < 0 ? styles.deltaDown : styles.deltaUp,
                  ]}
                >
                  {formatSignedCompactCurrency(option.shift.delta, currency)}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}

      {/* ---- the payoff: what actually moved --------------------------- */}
      {locked && result?.correct && challenge.aggregateEffects?.length ? (
        <Animated.View entering={FadeIn.duration(240)} style={styles.aggregates}>
          <Text style={styles.aggregatesHeading}>What moved</Text>
          {challenge.aggregateEffects.map((effect) => (
            <View key={effect.aggregate} style={styles.aggregateRow}>
              <View style={[styles.aggregateBadge, aggregateStyle(effect.direction)]}>
                <Text style={styles.aggregateBadgeText}>{effect.aggregate}</Text>
              </View>
              <View style={styles.aggregateBody}>
                <Text style={styles.aggregateDirection}>
                  {effect.direction === 'expand'
                    ? 'Expands'
                    : effect.direction === 'contract'
                      ? 'Contracts'
                      : 'Unchanged'}
                </Text>
                <Text style={styles.aggregateNote}>{effect.note}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------

function entityLabel(entities: readonly TAccountEntity[], entityId: string): string {
  return entities.find((entity) => entity.id === entityId)?.label ?? entityId;
}

interface EntityCardProps {
  entity: TAccountEntity;
  currency: string;
  shifts: readonly BalanceSheetShift[];
  placedOptions: readonly TAccountEntryOption[];
  locked: boolean;
  isShiftCorrect: (shift: BalanceSheetShift) => boolean;
  onRemove: (optionId: string) => void;
}

function EntityCard({
  entity,
  currency,
  shifts,
  placedOptions,
  locked,
  isShiftCorrect,
  onRemove,
}: EntityCardProps) {
  const balance = entityBalance(entity.id, shifts);
  const touched = placedOptions.length > 0;

  const renderSide = (side: BalanceSheetSide) => {
    const opening = (entity.openingLines ?? []).filter((line) => line.side === side);
    const posted = placedOptions.filter((option) => option.shift.side === side);

    return (
      <View style={styles.column}>
        <Text style={styles.columnHeading}>{side === 'asset' ? 'Assets' : 'Liabilities'}</Text>

        {opening.map((line) => (
          <View key={`${line.account}-${line.amount}`} style={styles.openingLine}>
            <Text style={styles.openingAccount} numberOfLines={2}>
              {line.account}
            </Text>
            <Text style={styles.openingAmount}>
              {formatCompactCurrency(line.amount, currency)}
            </Text>
          </View>
        ))}

        {opening.length === 0 && posted.length === 0 ? (
          <Text style={styles.emptySide}>—</Text>
        ) : null}

        {posted.map((option) => {
          const correct = locked && isShiftCorrect(option.shift);
          const wrong = locked && !correct;
          return (
            <Animated.View
              key={option.id}
              entering={FadeIn.duration(180)}
              layout={LinearTransition.duration(200)}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${option.shift.account} posting`}
                onPress={() => onRemove(option.id)}
                disabled={locked}
                style={[
                  styles.postedLine,
                  correct && styles.postedCorrect,
                  wrong && styles.postedWrong,
                ]}
              >
                <Text style={styles.postedAccount} numberOfLines={2}>
                  {option.shift.account}
                </Text>
                <Text
                  style={[
                    styles.postedDelta,
                    option.shift.delta < 0 ? styles.deltaDown : styles.deltaUp,
                  ]}
                >
                  {formatSignedCompactCurrency(option.shift.delta, currency)}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Running total for this side, once anything has been posted. */}
        {touched ? (
          <Text style={styles.sideTotal}>
            {formatSignedCompactCurrency(
              side === 'asset' ? balance.assetDelta : balance.liabilityDelta,
              currency,
            )}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.entityCard}>
      <View style={styles.entityHeader}>
        <View style={styles.entityIdentity}>
          <Text style={styles.entityLabel}>{entity.label}</Text>
          {entity.role ? <Text style={styles.entityRole}>{entity.role}</Text> : null}
        </View>
        <View style={[styles.tierBadge, { borderColor: TIER_COLORS[entity.tier] }]}>
          <Text style={[styles.tierText, { color: TIER_COLORS[entity.tier] }]}>
            {TIER_LABELS[entity.tier]}
          </Text>
        </View>
      </View>

      <View style={styles.sides}>
        {renderSide('asset')}
        <View style={styles.divider} />
        {renderSide('liability')}
      </View>

      {/* The double-entry constraint, stated plainly while they work. */}
      {touched ? (
        <View style={[styles.balanceBar, balance.balanced ? styles.balanceOk : styles.balanceOff]}>
          <Text style={[styles.balanceText, balance.balanced ? styles.balanceTextOk : styles.balanceTextOff]}>
            {balance.balanced
              ? 'Balanced'
              : `Off by ${formatCompactCurrency(Math.abs(balance.assetDelta - balance.liabilityDelta), currency)}`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function aggregateStyle(direction: 'expand' | 'contract' | 'unchanged') {
  if (direction === 'expand') return { backgroundColor: palette.mintDark };
  if (direction === 'contract') return { backgroundColor: palette.coralDark };
  return { backgroundColor: palette.inkFaint };
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  scenario: {
    ...typography.body,
    color: palette.inkMuted,
  },
  entityCard: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  entityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  entityIdentity: {
    flex: 1,
    gap: 1,
  },
  entityLabel: {
    ...typography.heading,
    color: palette.ink,
  },
  entityRole: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
  },
  tierBadge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tierText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sides: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  divider: {
    width: 1,
    backgroundColor: palette.border,
  },
  column: {
    flex: 1,
    gap: spacing.xs,
  },
  columnHeading: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  openingLine: {
    gap: 0,
  },
  openingAccount: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '600',
  },
  openingAmount: {
    ...typography.caption,
    color: palette.ink,
    fontVariant: ['tabular-nums'],
  },
  emptySide: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  postedLine: {
    borderWidth: 2,
    borderColor: palette.blue,
    backgroundColor: palette.blueSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  postedCorrect: {
    borderColor: palette.mint,
    backgroundColor: palette.mintSoft,
  },
  postedWrong: {
    borderColor: palette.coral,
    backgroundColor: palette.coralSoft,
  },
  postedAccount: {
    ...typography.caption,
    color: palette.ink,
    fontWeight: '700',
  },
  postedDelta: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
  },
  deltaUp: {
    color: palette.mintDark,
  },
  deltaDown: {
    color: palette.coralDark,
  },
  sideTotal: {
    ...typography.caption,
    color: palette.inkMuted,
    fontVariant: ['tabular-nums'],
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
  },
  balanceBar: {
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  balanceOk: {
    backgroundColor: palette.mintSoft,
  },
  balanceOff: {
    backgroundColor: palette.coralSoft,
  },
  balanceText: {
    ...typography.caption,
  },
  balanceTextOk: {
    color: palette.mintDark,
  },
  balanceTextOff: {
    color: palette.coralDark,
  },
  pool: {
    gap: spacing.sm,
  },
  poolHeading: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  poolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  poolChipBody: {
    flex: 1,
    gap: 1,
  },
  poolChipAccount: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  poolChipMeta: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
  },
  poolChipDelta: {
    ...typography.bodyStrong,
    fontVariant: ['tabular-nums'],
  },
  aggregates: {
    backgroundColor: palette.canvas,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  aggregatesHeading: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  aggregateRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  aggregateBadge: {
    minWidth: 46,
    borderRadius: radius.sm,
    paddingVertical: 3,
    alignItems: 'center',
  },
  aggregateBadgeText: {
    ...typography.caption,
    color: '#FFFFFF',
  },
  aggregateBody: {
    flex: 1,
    gap: 1,
  },
  aggregateDirection: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  aggregateNote: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
    lineHeight: 19,
  },
});
