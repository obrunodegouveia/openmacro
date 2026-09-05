/**
 * ============================================================================
 * The lesson runner
 * ============================================================================
 *
 * A thin shell around `lessonSessionReducer`: it renders the current challenge,
 * collects a draft answer, submits it for grading, and shows the feedback
 * sheet. All progression rules (hearts, re-queueing, XP, combo) live in the
 * reducer — this file is about layout and effects only.
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

import { ChallengeView } from '@/components/challenges/ChallengeView';
import { ActionButton } from '@/components/ui/ActionButton';
import { FeedbackSheet } from '@/components/ui/FeedbackSheet';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ComboPill, HeartsIndicator, StreakBadge } from '@/components/ui/StatusPills';
import { getLessonById, getNextLesson } from '@openmacro/core/content/registry';
import type { Lesson } from '@openmacro/core/content/schema';
import type { ChallengeAnswer } from '@openmacro/core/engine/answers';
import {
  createSession,
  currentChallenge,
  lessonSessionReducer,
  progressRatio,
} from '@openmacro/core/engine/lessonSession';
import { emitFeedback } from '@/feedback';
import { useProgress } from '@/providers/ProgressProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export default function LessonRunnerRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;

  if (!lesson) {
    return <LessonNotFound lessonId={lessonId} />;
  }
  // Keyed on the lesson so navigating between lessons starts a fresh session.
  return <LessonRunner key={lesson.id} lesson={lesson} />;
}

// ---------------------------------------------------------------------------

function LessonRunner({ lesson }: { lesson: Lesson }) {
  const insets = useSafeAreaInsets();
  const { profile, recordResult } = useProgress();

  const [state, dispatch] = useReducer(lessonSessionReducer, lesson, createSession);
  const [draft, setDraft] = useState<ChallengeAnswer | null>(null);
  /** Measured height of the feedback sheet, so content can clear it. */
  const [sheetHeight, setSheetHeight] = useState(0);

  const challenge = currentChallenge(state);
  const locked = state.feedback !== null;

  // -- effects ------------------------------------------------------------

  /** Haptic + sound on each graded submission. */
  const lastGraded = useRef(0);
  useEffect(() => {
    if (state.submissionCount === lastGraded.current) return;
    lastGraded.current = state.submissionCount;
    if (state.feedback) {
      emitFeedback(state.feedback.correct ? 'correct' : 'incorrect');
    }
  }, [state.submissionCount, state.feedback]);

  /** Persist the run exactly once when it ends. */
  const recorded = useRef(false);
  useEffect(() => {
    if (state.status === 'in_progress' || recorded.current) return;
    recorded.current = true;
    emitFeedback(state.status === 'complete' ? 'complete' : 'fail');
    void recordResult({
      lessonId: lesson.id,
      xpEarned: state.status === 'complete' ? state.xpEarned : 0,
      heartsRemaining: state.hearts,
      maxHearts: state.maxHearts,
      bestCombo: state.bestCombo,
      completed: state.status === 'complete',
    });
  }, [
    state.status,
    state.xpEarned,
    state.hearts,
    state.maxHearts,
    state.bestCombo,
    lesson.id,
    recordResult,
  ]);

  // -- handlers -----------------------------------------------------------

  // Stable identity: `ChallengeView` is memoised and its children key their
  // effects on this callback.
  const handleAnswerChange = useCallback((answer: ChallengeAnswer | null) => {
    setDraft(answer);
  }, []);

  const handleCheck = useCallback(() => {
    if (!draft) return;
    dispatch({ kind: 'submit', answer: draft });
  }, [draft]);

  const handleContinue = useCallback(() => {
    emitFeedback('advance');
    setDraft(null);
    dispatch({ kind: 'continue' });
  }, []);

  const handleRestart = useCallback(() => {
    recorded.current = false;
    lastGraded.current = 0;
    setDraft(null);
    dispatch({ kind: 'restart' });
  }, []);

  const handleExit = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  // -- end states ---------------------------------------------------------

  if (state.status === 'complete') {
    return (
      <LessonComplete
        lesson={lesson}
        xpEarned={state.xpEarned}
        perfect={state.hearts === state.maxHearts}
        bestCombo={state.bestCombo}
        onExit={handleExit}
        onRestart={handleRestart}
      />
    );
  }

  if (state.status === 'failed') {
    return <LessonFailed lesson={lesson} onExit={handleExit} onRestart={handleRestart} />;
  }

  // -- in progress --------------------------------------------------------

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      {/* ---- header: exit, progress, streak, hearts -------------------- */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Exit lesson"
          hitSlop={12}
          onPress={handleExit}
        >
          <Text style={styles.close}>✕</Text>
        </Pressable>

        <View style={styles.progressWrap}>
          <ProgressBar progress={progressRatio(state)} />
        </View>

        <StreakBadge
          streak={profile?.dayStreak ?? 0}
          active={profile?.streakActiveToday ?? false}
        />
        <HeartsIndicator hearts={state.hearts} maxHearts={state.maxHearts} />
      </View>

      <ComboPill combo={state.combo} />

      {/* ---- the current challenge ------------------------------------- */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          // Clear the feedback sheet while it is up; some challenges render
          // their payoff (aggregate effects, revealed answers) at the bottom.
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

      {/* ---- footer: hidden while the feedback sheet is up ------------- */}
      {!locked ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}
        >
          <ActionButton
            label="Check"
            onPress={handleCheck}
            disabled={!draft}
            tone={draft ? 'primary' : 'ghost'}
            testID="check-answer"
          />
        </Animated.View>
      ) : null}

      {state.feedback ? (
        <FeedbackSheet
          correct={state.feedback.correct}
          title={state.feedback.title}
          explanation={state.feedback.explanation}
          detail={state.feedback.detail}
          continueLabel={
            state.feedback.correct ? 'Continue' : state.hearts > 0 ? 'Got it' : 'Out of hearts'
          }
          onContinue={handleContinue}
          onHeightChange={setSheetHeight}
        />
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// End screens
// ---------------------------------------------------------------------------

interface LessonCompleteProps {
  lesson: Lesson;
  xpEarned: number;
  perfect: boolean;
  bestCombo: number;
  onExit: () => void;
  onRestart: () => void;
}

function LessonComplete({
  lesson,
  xpEarned,
  perfect,
  bestCombo,
  onExit,
  onRestart,
}: LessonCompleteProps) {
  const insets = useSafeAreaInsets();
  const nextLesson = getNextLesson(lesson.id);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.endContent,
        { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.endHeader}>
        <Text style={styles.endEmoji}>{perfect ? '🏆' : '🎉'}</Text>
        <Text style={styles.endTitle}>{perfect ? 'Flawless run!' : 'Lesson complete'}</Text>
        <Text style={styles.endSubtitle}>{lesson.title}</Text>
      </Animated.View>

      <View style={styles.statRow}>
        <Stat label="XP earned" value={`+${xpEarned}`} tone={palette.mintDark} />
        <Stat label="Best combo" value={`${bestCombo}`} tone={palette.goldDark} />
      </View>

      {lesson.keyTakeaways?.length ? (
        <View style={styles.takeaways}>
          <Text style={styles.takeawaysHeading}>What you just learned</Text>
          {lesson.keyTakeaways.map((takeaway) => (
            <View key={takeaway} style={styles.takeawayRow}>
              <Text style={styles.takeawayBullet}>•</Text>
              <Text style={styles.takeawayText}>{takeaway}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.endActions}>
        <ActionButton
          label={nextLesson ? 'Back to path' : 'Finish'}
          onPress={onExit}
          tone="primary"
        />
        <ActionButton label="Practise again" onPress={onRestart} tone="ghost" />
      </View>
    </ScrollView>
  );
}

function LessonFailed({
  lesson,
  onExit,
  onRestart,
}: {
  lesson: Lesson;
  onExit: () => void;
  onRestart: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        styles.endContent,
        { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.endHeader}>
        <Text style={styles.endEmoji}>💔</Text>
        <Text style={styles.endTitle}>Out of hearts</Text>
        <Text style={styles.endSubtitle}>
          No shame in it — {lesson.title.toLowerCase()} trips up most people the first time.
        </Text>
      </Animated.View>

      <View style={styles.endActions}>
        <ActionButton label="Try again" onPress={onRestart} tone="danger" />
        <ActionButton label="Back to path" onPress={onExit} tone="ghost" />
      </View>
    </View>
  );
}

function LessonNotFound({ lessonId }: { lessonId?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, styles.endContent, { paddingTop: insets.top + spacing.xxxl }]}>
      <Text style={styles.endEmoji}>🤔</Text>
      <Text style={styles.endTitle}>Lesson not found</Text>
      <Text style={styles.endSubtitle}>
        No lesson is registered with the id “{lessonId ?? 'unknown'}”. Check
        src/content/registry.ts.
      </Text>
      <ActionButton label="Back to path" onPress={() => router.replace('/')} tone="ghost" />
    </View>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View style={[styles.stat, { borderColor: tone }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: tone }]}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  close: {
    ...typography.heading,
    color: palette.inkFaint,
  },
  progressWrap: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    // Generous tail so the last option is never trapped under the footer.
    paddingBottom: spacing.xxxl * 2,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.surface,
  },
  endContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  endHeader: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  endEmoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  endTitle: {
    ...typography.display,
    color: palette.ink,
    textAlign: 'center',
  },
  endSubtitle: {
    ...typography.body,
    color: palette.inkMuted,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.surface,
  },
  statLabel: {
    ...typography.overline,
    color: palette.inkFaint,
    textTransform: 'uppercase',
  },
  statValue: {
    ...typography.title,
  },
  takeaways: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  takeawaysHeading: {
    ...typography.overline,
    color: palette.mintDark,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  takeawayRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  takeawayBullet: {
    ...typography.body,
    color: palette.mint,
  },
  takeawayText: {
    ...typography.caption,
    color: palette.ink,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  endActions: {
    gap: spacing.md,
  },
});
