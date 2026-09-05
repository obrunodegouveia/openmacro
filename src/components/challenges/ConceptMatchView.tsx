/**
 * `concept_match` — pair each term with its definition.
 *
 * Interaction: tap a term (it highlights), then tap a definition to link them.
 * Tapping either half of an existing link breaks it. Deliberately tap-based
 * rather than drag-based — dragging is fiddly on small screens and hostile to
 * screen readers.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { seededShuffle } from '@openmacro/core/format';

/** Link colours cycle so simultaneous pairs stay visually distinct. */
const LINK_COLORS = [palette.blue, palette.gold, palette.mint, palette.coral, '#9B5DE5'] as const;

export function ConceptMatchView({
  challenge,
  onAnswerChange,
  locked,
}: ChallengeComponentProps<'concept_match'>) {
  /** term pair id -> definition pair id */
  const [pairings, setPairings] = useState<Record<string, string>>({});
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const terms = useMemo(
    () => seededShuffle(challenge.pairs, `${challenge.id}:terms`),
    [challenge],
  );
  const definitions = useMemo(
    () => seededShuffle(challenge.pairs, `${challenge.id}:definitions`),
    [challenge],
  );

  /** definition id -> term id, for rendering the right-hand column. */
  const reverse = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [termId, definitionId] of Object.entries(pairings)) {
      map[definitionId] = termId;
    }
    return map;
  }, [pairings]);

  useEffect(() => {
    const complete = Object.keys(pairings).length === challenge.pairs.length;
    onAnswerChange(complete ? { type: 'concept_match', pairings } : null);
  }, [pairings, challenge.pairs.length, onAnswerChange]);

  const colorForTerm = useCallback(
    (termId: string) => {
      const index = terms.findIndex((pair) => pair.id === termId);
      return LINK_COLORS[index % LINK_COLORS.length] as string;
    },
    [terms],
  );

  const handleTermPress = useCallback(
    (termId: string) => {
      if (locked) return;
      emitFeedback('select');
      // Tapping a linked term unlinks it and picks it up again.
      if (pairings[termId]) {
        setPairings((current) => {
          const next = { ...current };
          delete next[termId];
          return next;
        });
        setActiveTerm(termId);
        return;
      }
      setActiveTerm((current) => (current === termId ? null : termId));
    },
    [locked, pairings],
  );

  const handleDefinitionPress = useCallback(
    (definitionId: string) => {
      if (locked) return;
      emitFeedback('select');

      const linkedTerm = reverse[definitionId];
      // Tapping a linked definition unlinks it.
      if (linkedTerm) {
        setPairings((current) => {
          const next = { ...current };
          delete next[linkedTerm];
          return next;
        });
        return;
      }
      if (!activeTerm) return;
      setPairings((current) => ({ ...current, [activeTerm]: definitionId }));
      setActiveTerm(null);
    },
    [locked, reverse, activeTerm],
  );

  return (
    <View style={styles.columns}>
      {/* ---------------------------------------------------------------- */}
      <View style={styles.column}>
        <Text style={styles.columnHeading}>Term</Text>
        {terms.map((pair) => {
          const linked = pairings[pair.id];
          const isActive = activeTerm === pair.id;
          const isRight = locked && linked === pair.id;
          const isWrong = locked && linked !== undefined && linked !== pair.id;
          const accent = colorForTerm(pair.id);

          return (
            <Animated.View key={pair.id} entering={FadeIn.duration(200)} layout={LinearTransition.duration(180)}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive || Boolean(linked), disabled: locked }}
                accessibilityHint="Tap, then tap a definition to link them"
                onPress={() => handleTermPress(pair.id)}
                disabled={locked}
                style={[
                  styles.card,
                  isActive && { borderColor: accent, backgroundColor: palette.canvas },
                  linked && { borderColor: accent },
                  isRight && styles.cardCorrect,
                  isWrong && styles.cardWrong,
                ]}
              >
                {linked ? <View style={[styles.dot, { backgroundColor: accent }]} /> : null}
                <Text style={styles.cardText}>{pair.term}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* ---------------------------------------------------------------- */}
      <View style={styles.column}>
        <Text style={styles.columnHeading}>Means</Text>
        {definitions.map((pair) => {
          const linkedTerm = reverse[pair.id];
          const isRight = locked && linkedTerm === pair.id;
          const isWrong = locked && linkedTerm !== undefined && linkedTerm !== pair.id;
          const accent = linkedTerm ? colorForTerm(linkedTerm) : undefined;

          return (
            <Animated.View key={pair.id} entering={FadeIn.duration(200)} layout={LinearTransition.duration(180)}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: Boolean(linkedTerm), disabled: locked }}
                onPress={() => handleDefinitionPress(pair.id)}
                disabled={locked}
                style={[
                  styles.card,
                  accent ? { borderColor: accent } : null,
                  activeTerm && !linkedTerm ? styles.cardAwaiting : null,
                  isRight && styles.cardCorrect,
                  isWrong && styles.cardWrong,
                ]}
              >
                {accent ? <View style={[styles.dot, { backgroundColor: accent }]} /> : null}
                <Text style={styles.cardTextSmall}>{pair.definition}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
  columnHeading: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  card: {
    minHeight: 62,
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  /** Subtle cue that the app is waiting for a definition tap. */
  cardAwaiting: {
    borderStyle: 'dashed',
    borderColor: palette.borderStrong,
  },
  cardCorrect: {
    borderColor: palette.mint,
    backgroundColor: palette.mintSoft,
  },
  cardWrong: {
    borderColor: palette.coral,
    backgroundColor: palette.coralSoft,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  cardText: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  cardTextSmall: {
    ...typography.caption,
    color: palette.ink,
    lineHeight: 19,
  },
});
