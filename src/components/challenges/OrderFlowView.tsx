/**
 * `order_flow` — arrange events into a causal sequence.
 *
 * Press and hold a card, then drag it up or down; the rest of the chain opens
 * a gap and closes behind it. Every event starts on the board in a shuffled
 * order, so there is always a complete answer to submit and the learner is
 * rearranging a sequence rather than assembling one.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A DRAG AND NOT A SET OF TAPS
 * ---------------------------------------------------------------------------
 *
 * It used to be taps: a pool at the bottom, tap to append, tap a placed card
 * to send it back. That reads fine in a code review and fails in the hand.
 * Once the last card left the pool there was no way to *reorder* anything —
 * the only route from a wrong sequence to a right one was to dismantle the
 * chain and rebuild it, so the interaction punished you hardest exactly when
 * you had almost got it right. Meanwhile every challenge in the course told
 * the learner, in writing, to drag the steps into order.
 *
 * A long press starts the drag, because these cards live inside a vertical
 * ScrollView and a bare pan would fight it for every gesture. Holding still
 * for a moment is the contract iOS uses for reordering everywhere else, and
 * it leaves a flick free to scroll the page.
 *
 * ---------------------------------------------------------------------------
 * WHY NOTHING IS REORDERED UNTIL THE FINGER LIFTS
 * ---------------------------------------------------------------------------
 *
 * The obvious implementation swaps two entries in the array the moment the
 * dragged card passes its neighbour. It does not work, and the way it fails is
 * worth recording: reordering the array re-renders the list, React moves the
 * underlying views, and the view that moves is the one under the finger — so
 * the platform cancels the gesture it was in the middle of delivering. The
 * card swapped once and then went dead, every time, which reads as a laggy
 * drag rather than as a cancelled one.
 *
 * So the committed order is left alone for the whole gesture. `fromIndex` and
 * `toIndex` describe an intent; each card derives a translation from them and
 * slides itself out of the way. The array is spliced once, on release, while
 * the cards are already sitting where the new array says they belong — which
 * is why the commit is invisible.
 *
 * Dragging is not reachable with VoiceOver, so each card also carries
 * `accessibilityActions` for moving up and down. That is the accessible path
 * the tap version gave away for free, kept deliberately this time.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { ChallengeComponentProps } from '@/components/challenges/types';
import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { seededShuffle } from '@openmacro/core/format';
import type { FlowEvent } from '@openmacro/core/content/schema';

/** Vertical gap between cards; the drag maths needs it as a number. */
const ROW_GAP = spacing.sm;

/** How long a finger must rest before the card comes loose. */
const PICKUP_DELAY_MS = 180;

/** How long the card takes to settle into its slot after release. */
const DROP_MS = 150;

/** Top edge of slot `index`, in the sequence's own coordinates. */
function slotTop(heights: number[], index: number, gap: number): number {
  'worklet';
  let y = 0;
  for (let i = 0; i < index; i += 1) y += (heights[i] ?? 0) + gap;
  return y;
}

/**
 * Which slot a dragged card would land in, given how far it has travelled.
 *
 * The answer cannot be read off the layout you can see. Lift a card out and
 * the list closes up behind it, so the positions the card is being judged
 * against are the closed ones, not the ones on screen.
 *
 * Within that closed list there are exactly n places the card could be
 * inserted, each with a known top edge, and the card belongs in whichever is
 * nearest its own top edge. Nearest-insertion-point is worth preferring over
 * the two rules that look more obvious:
 *
 *   • comparing the dragged card's centre against its neighbours' centres
 *     breaks whenever the card is taller than the one below it — at rest it
 *     already reads as being past its neighbour, so a card picked up and put
 *     down again moves a slot on its own;
 *
 *   • comparing top edges instead fixes that and introduces the opposite
 *     fault, since the next insertion point sits exactly at the card's own
 *     resting top, so a single pixel of travel reorders the list.
 *
 * Nearest has neither failure. At rest the distance to the card's own slot is
 * zero, and the margin to either neighbour is half a card — which is also what
 * makes the drag feel like it snaps rather than twitches.
 */
function slotUnder(heights: number[], gap: number, from: number, translation: number): number {
  'worklet';
  const top = slotTop(heights, from, gap) + translation;

  let best = 0;
  let bestDistance = Infinity;
  let y = 0;
  let slot = 0;

  for (let i = 0; i < heights.length; i += 1) {
    if (i === from) continue;
    const distance = Math.abs(top - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = slot;
    }
    y += (heights[i] ?? 0) + gap;
    slot += 1;
  }

  // The last insertion point: after every remaining card.
  if (Math.abs(top - y) < bestDistance) best = slot;

  return best;
}

/**
 * How far the card must travel from where it started to sit exactly in slot
 * `to` of the reordered list.
 *
 * Moving up, the card lands on the target slot's existing top edge. Moving
 * down it does not: everything it passed has slid up by a different amount
 * than the card itself is tall, leaving it `h(to) - h(from)` lower than the
 * old top of that slot. Getting this wrong is invisible with uniform cards and
 * shows up as a jump at the end of the drag as soon as they differ.
 */
function settleOffset(heights: number[], gap: number, from: number, to: number): number {
  'worklet';
  const top = slotTop(heights, to, gap);
  const adjusted = to > from ? top + (heights[to] ?? 0) - (heights[from] ?? 0) : top;
  return adjusted - slotTop(heights, from, gap);
}

export function OrderFlowView({
  challenge,
  onAnswerChange,
  locked,
}: ChallengeComponentProps<'order_flow'>) {
  const { t } = useLocale();

  const [order, setOrder] = useState<FlowEvent[]>(() =>
    // Seeded so a learner who retries gets the same starting scramble, and
    // never the authored order — which would hand the answer to anyone who
    // had read the lesson file.
    seededShuffle(challenge.events, challenge.id),
  );

  /**
   * Measured row heights.
   *
   * Two copies on purpose: the gesture runs on the UI thread and cannot read
   * React state, while `onLayout` runs on the JS thread and cannot write a
   * shared value's contents in place. They are written together.
   */
  const heightsRef = useRef<number[]>([]);
  const heights = useSharedValue<number[]>([]);

  /** Slot the airborne card came from, or -1 when nothing is airborne. */
  const fromIndex = useSharedValue(-1);
  /** Slot it would land in if released now. */
  const toIndex = useSharedValue(-1);
  /** Finger-following offset of the airborne card. */
  const dragY = useSharedValue(0);

  const onRowLayout = useCallback(
    (index: number, height: number) => {
      if (heightsRef.current[index] === height) return;
      heightsRef.current[index] = height;
      heights.value = [...heightsRef.current];
    },
    [heights],
  );

  // The answer is always complete, so publish on mount and after every move.
  useEffect(() => {
    onAnswerChange({ type: 'order_flow', order: order.map((event) => event.id) });
  }, [order, onAnswerChange]);

  /**
   * Move one card to a new slot — the only thing that touches the array, and
   * it runs exactly once per gesture, after the finger has lifted.
   */
  const commit = useCallback((from: number, to: number) => {
    if (from !== to) {
      setOrder((current) => {
        const next = [...current];
        const [moved] = next.splice(from, 1);
        if (moved) next.splice(to, 0, moved);
        return next;
      });
      // Heights belong to slots, not to cards, so they travel with the move —
      // and the UI thread needs the new table straight away. `onLayout` will
      // not supply it: a reorder shuffles the same heights between the same
      // slots, so most rows re-measure to the number they already had and
      // report nothing. Leaving the shared copy stale made every drag after
      // the first one aim at the previous layout and land a slot short.
      const h = heightsRef.current;
      const [carried] = h.splice(from, 1);
      if (carried !== undefined) h.splice(to, 0, carried);
      heights.value = [...h];
      emitFeedback('select');
    }
    fromIndex.value = -1;
    toIndex.value = -1;
    dragY.value = 0;
  }, [fromIndex, toIndex, dragY, heights]);

  /** Keyboard and VoiceOver route to the same reorder the drag performs. */
  const moveBy = useCallback(
    (index: number, direction: -1 | 1) => {
      if (locked) return;
      const target = index + direction;
      if (target < 0 || target >= order.length) return;
      commit(index, target);
    },
    [locked, order.length, commit],
  );

  const correctness = useMemo(() => {
    if (!locked) return null;
    return order.map((event, index) => challenge.correctOrder[index] === event.id);
  }, [locked, order, challenge.correctOrder]);

  return (
    <View style={styles.container}>
      {!locked ? <Text style={styles.hint}>{t('challenge.order.dragHint')}</Text> : null}

      <View style={styles.sequence}>
        {order.map((event, index) => (
          <DraggableRow
            key={event.id}
            event={event}
            index={index}
            count={order.length}
            locked={locked}
            verdict={correctness ? (correctness[index] ?? null) : null}
            heights={heights}
            fromIndex={fromIndex}
            toIndex={toIndex}
            dragY={dragY}
            onCommit={commit}
            onMoveBy={moveBy}
            onLayoutHeight={onRowLayout}
          />
        ))}
      </View>
    </View>
  );
}

interface DraggableRowProps {
  event: FlowEvent;
  index: number;
  count: number;
  locked: boolean;
  verdict: boolean | null;
  heights: SharedValue<number[]>;
  fromIndex: SharedValue<number>;
  toIndex: SharedValue<number>;
  dragY: SharedValue<number>;
  onCommit: (from: number, to: number) => void;
  onMoveBy: (index: number, direction: -1 | 1) => void;
  onLayoutHeight: (index: number, height: number) => void;
}

function DraggableRow({
  event,
  index,
  count,
  locked,
  verdict,
  heights,
  fromIndex,
  toIndex,
  dragY,
  onCommit,
  onMoveBy,
  onLayoutHeight,
}: DraggableRowProps) {
  const { t } = useLocale();

  const pickUp = useCallback(() => {
    emitFeedback('select');
  }, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!locked)
        .activateAfterLongPress(PICKUP_DELAY_MS)
        .onStart(() => {
          fromIndex.value = index;
          toIndex.value = index;
          dragY.value = 0;
          runOnJS(pickUp)();
        })
        .onUpdate((e) => {
          dragY.value = e.translationY;
          toIndex.value = slotUnder(heights.value, ROW_GAP, index, e.translationY);
        })
        .onEnd(() => {
          // Slide the last few pixels into the slot, then commit underneath —
          // by the time the array changes the card is already there.
          const from = index;
          const to = toIndex.value;
          const settled = settleOffset(heights.value, ROW_GAP, from, to);
          dragY.value = withTiming(settled, { duration: DROP_MS }, (done) => {
            if (done) runOnJS(onCommit)(from, to);
          });
        })
        .onFinalize((_e, success) => {
          // A cancelled gesture never reaches onEnd; put the card back.
          if (!success && fromIndex.value === index) {
            dragY.value = withTiming(0, { duration: DROP_MS });
            fromIndex.value = -1;
            toIndex.value = -1;
          }
        }),
    [locked, index, heights, fromIndex, toIndex, dragY, onCommit, pickUp],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const from = fromIndex.value;
    if (from === -1) {
      return { transform: [{ translateY: 0 }, { scale: 1 }], zIndex: 0, shadowOpacity: 0 };
    }

    // The card in the air follows the finger and floats above the rest.
    if (index === from) {
      return {
        transform: [{ translateY: dragY.value }, { scale: 1.03 }],
        zIndex: 10,
        shadowOpacity: 0.18,
      };
    }

    // Everyone between the old slot and the new one steps aside by exactly
    // the height of the card passing through — which is why rows of different
    // heights still close up cleanly.
    const to = toIndex.value;
    const gapLeft = (heights.value[from] ?? 0) + ROW_GAP;
    let shift = 0;
    if (from < index && index <= to) shift = -gapLeft;
    else if (to <= index && index < from) shift = gapLeft;

    return {
      transform: [{ translateY: withTiming(shift, { duration: 160 }) }, { scale: 1 }],
      zIndex: 0,
      shadowOpacity: 0,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.row, animatedStyle]}
        onLayout={(e) => onLayoutHeight(index, e.nativeEvent.layout.height)}
        accessibilityRole="button"
        accessibilityLabel={t('challenge.order.position', {
          number: index + 1,
          total: count,
          label: event.label,
        })}
        accessibilityHint={locked ? undefined : t('challenge.order.dragHint')}
        accessibilityActions={
          locked
            ? undefined
            : [
                { name: 'moveUp', label: t('challenge.order.moveUp') },
                { name: 'moveDown', label: t('challenge.order.moveDown') },
              ]
        }
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === 'moveUp') onMoveBy(index, -1);
          if (e.nativeEvent.actionName === 'moveDown') onMoveBy(index, 1);
        }}
      >
        <View
          style={[
            styles.card,
            verdict === true && styles.cardCorrect,
            verdict === false && styles.cardWrong,
          ]}
        >
          <View
            style={[
              styles.stepBadge,
              verdict === true && { backgroundColor: palette.mintDark },
              verdict === false && { backgroundColor: palette.coralDark },
            ]}
          >
            <Text style={styles.stepBadgeText}>{index + 1}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardLabel}>{event.label}</Text>
            {event.detail ? <Text style={styles.cardDetail}>{event.detail}</Text> : null}
          </View>
          {!locked ? <GripGlyph /> : null}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

/** Six dots — the standard "this row moves" affordance. */
function GripGlyph() {
  return (
    <View style={styles.grip}>
      {[0, 1, 2].map((rowIndex) => (
        <View key={rowIndex} style={styles.gripRow}>
          <View style={styles.gripDot} />
          <View style={styles.gripDot} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  sequence: {
    gap: ROW_GAP,
  },
  row: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
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
    backgroundColor: palette.blueSoft,
    borderColor: palette.blue,
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
  grip: {
    gap: 3,
    paddingLeft: spacing.xs,
  },
  gripRow: {
    flexDirection: 'row',
    gap: 3,
  },
  gripDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.inkFaint,
  },
});
