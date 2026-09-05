/**
 * `order_flow` — arrange events into a causal sequence.
 *
 * Tap a card in the pool to append it to the sequence; tap it in the sequence
 * to send it back. Same reasoning as concept match: taps beat drags on a
 * phone, and they are accessible for free.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { seededShuffle } from '@openmacro/core/format';

export function OrderFlowView({
  challenge,
  onAnswerChange,
  locked,
}: ChallengeComponentProps<'order_flow'>) {
  const [order, setOrder] = useState<string[]>([]);

  const pool = useMemo(
    () => seededShuffle(challenge.events, challenge.id),
    [challenge],
  );

  const remaining = useMemo(
    () => pool.filter((event) => !order.includes(event.id)),
    [pool, order],
  );

  useEffect(() => {
    const complete = order.length === challenge.events.length;
    onAnswerChange(complete ? { type: 'order_flow', order } : null);
  }, [order, challenge.events.length, onAnswerChange]);

  const append = useCallback(
    (eventId: string) => {
      if (locked) return;
      emitFeedback('select');
      setOrder((current) => (current.includes(eventId) ? current : [...current, eventId]));
    },
    [locked],
  );

  const remove = useCallback(
    (eventId: string) => {
      if (locked) return;
      emitFeedback('select');
      setOrder((current) => current.filter((id) => id !== eventId));
    },
    [locked],
  );

  const eventById = useCallback(
    (eventId: string) => challenge.events.find((event) => event.id === eventId),
    [challenge],
  );

  return (
    <View style={styles.container}>
      {/* ---- the sequence the learner is building ---------------------- */}
      <View style={styles.sequence}>
        {order.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap events below to build the chain</Text>
          </View>
        ) : null}

        {order.map((eventId, index) => {
          const event = eventById(eventId);
          if (!event) return null;
          const isRight = locked && challenge.correctOrder[index] === eventId;
          const isWrong = locked && challenge.correctOrder[index] !== eventId;

          return (
            <Animated.View
              key={eventId}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              layout={LinearTransition.duration(200)}
            >
              {/* Connector line between consecutive steps. */}
              {index > 0 ? <View style={styles.connector} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Step ${index + 1}: ${event.label}. Tap to remove.`}
                onPress={() => remove(eventId)}
                disabled={locked}
                style={[
                  styles.card,
                  styles.cardPlaced,
                  isRight && styles.cardCorrect,
                  isWrong && styles.cardWrong,
                ]}
              >
                <View
                  style={[
                    styles.stepBadge,
                    isRight && { backgroundColor: palette.mintDark },
                    isWrong && { backgroundColor: palette.coralDark },
                  ]}
                >
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardLabel}>{event.label}</Text>
                  {event.detail ? <Text style={styles.cardDetail}>{event.detail}</Text> : null}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {/* ---- the pool of unused events --------------------------------- */}
      {remaining.length > 0 ? (
        <View style={styles.pool}>
          <Text style={styles.poolHeading}>Remaining</Text>
          {remaining.map((event) => (
            <Animated.View
              key={event.id}
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(120)}
              layout={LinearTransition.duration(200)}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${event.label}. Tap to add to the sequence.`}
                onPress={() => append(event.id)}
                disabled={locked}
                style={[styles.card, styles.cardPool]}
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardLabel}>{event.label}</Text>
                  {event.detail ? <Text style={styles.cardDetail}>{event.detail}</Text> : null}
                </View>
                <Text style={styles.addGlyph}>+</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  sequence: {
    gap: spacing.sm,
  },
  placeholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  connector: {
    width: 2,
    height: spacing.md,
    backgroundColor: palette.borderStrong,
    marginLeft: 27,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderColor: palette.border,
  },
  cardPlaced: {
    borderColor: palette.blue,
    backgroundColor: palette.blueSoft,
  },
  cardPool: {
    borderColor: palette.border,
  },
  cardCorrect: {
    borderColor: palette.mint,
    backgroundColor: palette.mintSoft,
  },
  cardWrong: {
    borderColor: palette.coral,
    backgroundColor: palette.coralSoft,
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  cardDetail: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: palette.blueDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    ...typography.caption,
    color: '#FFFFFF',
  },
  pool: {
    gap: spacing.sm,
  },
  poolHeading: {
    ...typography.overline,
    color: palette.inkFaint,
    marginBottom: spacing.xs,
  },
  addGlyph: {
    ...typography.heading,
    color: palette.inkFaint,
    paddingHorizontal: spacing.sm,
  },
});
