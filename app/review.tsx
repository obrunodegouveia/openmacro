/**
 * The review session.
 *
 * Runs the challenges the scheduler says are due, drawn from wherever in the
 * course they came from. It reuses `lessonSessionReducer` by handing it a
 * lesson assembled on the spot, so grading, the feedback sheet and the
 * re-queue-on-a-miss behaviour are the ones the learner already knows rather
 * than a second implementation that drifts.
 *
 * Two things it deliberately does not share with a lesson:
 *
 *   - **No hearts.** A lesson uses them to stop you leaving before you can do
 *     it. A review queue is the opposite situation: these are things you
 *     already learned and are losing, and being thrown out of the session for
 *     missing three is a punishment for the thing the session exists to fix.
 *   - **No XP, no completion.** Nothing here writes a `LessonResult`. Review
 *     is not a lesson you finished, and counting it as one would inflate the
 *     record of what someone has actually done.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';

import { ChallengeView } from '@/components/challenges/ChallengeView';
import { ActionButton } from '@/components/ui/ActionButton';
import { FeedbackSheet } from '@/components/ui/FeedbackSheet';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Lesson } from '@openmacro/core/content/schema';
import type { ChallengeAnswer } from '@openmacro/core/engine/answers';
import { createSession, lessonSessionReducer, progressRatio } from '@openmacro/core/engine/lessonSession';
import { emitFeedback } from '@/feedback';
import { useLocale } from '@/providers/LocaleProvider';
import { reviewChallenges, useReview, type DueChallenge } from '@/hooks/useReview';
import { gradesFor, recordReviewGrades } from '@/services/reviewStore';
import { palette, spacing, typography } from '@/theme/tokens';

/**
 * Hearts a review session runs with — enough that the limit never arrives.
 *
 * `Infinity` would be the honest value, but the reducer subtracts from this
 * and stores it, and a number that stops being a number is a worse thing to
 * hand it than one nobody reaches: the queue is capped at twenty items, so
 * this is fifty times a session where every single answer is wrong.
 */
const REVIEW_HEARTS = 999;

export default function ReviewRoute() {
  const { locale } = useLocale();
  const { loading, due, refresh } = useReview();

  if (loading) return null;

  // Keyed on the language for the same reason the lesson runner is: the
  // reducer copies the questions into its own state, so a mid-run switch
  // would otherwise leave the previous language's words on screen.
  return <ReviewGate key={`review#${locale}`} due={due} onFinished={refresh} />;
}

/**
 * Holds the queue still for the length of the session.
 *
 * Finishing a session writes the new schedule and re-reads it, at which point
 * nothing is due any more — every item was just pushed into the future, which
 * is the whole point. A screen rendering straight off the live queue would
 * take that as its cue to replace the summary the learner is reading with
 * "nothing due", so the set is captured once and kept.
 */
function ReviewGate({
  due,
  onFinished,
}: {
  due: readonly DueChallenge[];
  onFinished: () => Promise<void>;
}) {
  const [queue] = useState(due);
  if (queue.length === 0) return <NothingDue />;
  return <ReviewSession due={queue} onFinished={onFinished} />;
}

function ReviewSession({
  due,
  onFinished,
}: {
  due: readonly DueChallenge[];
  onFinished: () => Promise<void>;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();

  const challenges = useMemo(() => reviewChallenges(due), [due]);

  const lesson = useMemo<Lesson>(
    () => ({
      id: '__review__',
      title: t('review.title'),
      subtitle: t('review.blurb'),
      icon: '🔁',
      difficulty: 'core',
      estimatedMinutes: Math.max(1, Math.round(due.length / 2)),
      hearts: REVIEW_HEARTS,
      challenges,
      keyTakeaways: [],
    }),
    [challenges, due.length, t],
  );

  const [state, dispatch] = useReducer(lessonSessionReducer, lesson, createSession);
  const [draft, setDraft] = useState<ChallengeAnswer | null>(null);
  const [sheetHeight, setSheetHeight] = useState(0);

  const recorded = useRef(false);
  useEffect(() => {
    if (state.status === 'in_progress' || recorded.current) return;
    recorded.current = true;
    emitFeedback('complete');

    /**
     * Same three-way mapping a lesson uses — first time is `known`, solved
     * only after a miss is `struggled`, never solved is `missed`. Without
     * hearts the third is nearly unreachable here, which is the intent: a
     * review session is meant to be finished.
     */
    const grades = gradesFor({ resolved: state.resolved, missed: state.missed });

    void recordReviewGrades(grades)
      .then(onFinished)
      .catch(() => {});
  }, [state.status, state.resolved, state.missed, onFinished]);

  const handleAnswerChange = useCallback((answer: ChallengeAnswer | null) => setDraft(answer), []);
  const handleCheck = useCallback(() => {
    if (draft) dispatch({ kind: 'submit', answer: draft, t });
  }, [draft, t]);
  const handleContinue = useCallback(() => {
    emitFeedback('advance');
    setDraft(null);
    dispatch({ kind: 'continue' });
  }, []);

  if (state.status !== 'in_progress') {
    return (
      <View style={[styles.centred, { paddingTop: insets.top + spacing.xl }]}>
        <Text style={styles.doneIcon}>🔁</Text>
        <Text style={styles.doneTitle}>{t('review.done.title')}</Text>
        <Text style={styles.doneBody}>{t('review.done.body', { count: due.length })}</Text>
        <ActionButton label={t('review.done.close')} onPress={() => router.back()} tone="primary" />
      </View>
    );
  }

  const challenge = lesson.challenges.find((entry) => entry.id === state.queue[0]);
  const locked = state.feedback !== null;
  const from = challenge ? due.find((entry) => entry.itemId === challenge.id) : undefined;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>{t('review.title')}</Text>
        <ProgressBar progress={progressRatio(state)} />
        {/* Where this question came from. Out of its lesson a challenge can
            read as a non sequitur, and the answer often depends on knowing
            which world it belongs to. */}
        {from ? <Text style={styles.from}>{t('review.from', { lesson: from.lessonTitle })}</Text> : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          locked ? { paddingBottom: sheetHeight + spacing.xl } : null,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {challenge ? (
          <ChallengeView
            challenge={challenge}
            onAnswerChange={handleAnswerChange}
            locked={locked}
            result={state.feedback}
            transitionKey={`${challenge.id}#${state.stepSerial}`}
          />
        ) : null}
      </ScrollView>

      {!locked ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
        >
          <ActionButton
            label={t('lesson.check')}
            onPress={handleCheck}
            disabled={!draft}
            tone={draft ? 'primary' : 'ghost'}
          />
        </Animated.View>
      ) : null}

      {state.feedback ? (
        <FeedbackSheet
          correct={state.feedback.correct}
          title={state.feedback.title}
          explanation={state.feedback.explanation}
          detail={state.feedback.detail}
          continueLabel={state.feedback.correct ? t('lesson.continue') : t('lesson.gotIt')}
          onContinue={handleContinue}
          onHeightChange={setSheetHeight}
        />
      ) : null}
    </View>
  );
}

function NothingDue() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  return (
    <View style={[styles.centred, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.doneIcon}>✅</Text>
      <Text style={styles.doneTitle}>{t('review.empty')}</Text>
      <Text style={styles.doneBody}>{t('review.empty.blurb')}</Text>
      <ActionButton label={t('review.done.close')} onPress={() => router.back()} tone="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  headerTitle: { ...typography.title, color: palette.ink },
  from: { ...typography.caption, color: palette.inkFaint },
  content: { padding: spacing.lg, gap: spacing.lg },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: palette.canvas,
  },
  doneIcon: { fontSize: 48 },
  doneTitle: { ...typography.display, color: palette.ink, textAlign: 'center' },
  doneBody: {
    ...typography.body,
    color: palette.inkMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
