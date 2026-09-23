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
import { LessonVideo } from '@/components/ui/LessonVideo';
import { ActionButton } from '@/components/ui/ActionButton';
import { FeedbackSheet } from '@/components/ui/FeedbackSheet';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ComboPill, HeartsIndicator, StreakBadge } from '@/components/ui/StatusPills';
import type { Lesson } from '@openmacro/core/content/schema';
import type { ChallengeAnswer } from '@openmacro/core/engine/answers';
import {
  createSession,
  currentChallenge,
  lessonSessionReducer,
  progressRatio,
} from '@openmacro/core/engine/lessonSession';
import { emitFeedback } from '@/feedback';
import { useContentUpdate } from '@/providers/ContentUpdateProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { recordLessonOutcome } from '@/services/reviewStore';
import { getModuleForLesson } from '@openmacro/core/content/registry';
import { useProgress } from '@/providers/ProgressProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export default function LessonRunnerRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { locale, lessonById } = useLocale();
  const lesson = lessonId ? lessonById(lessonId) : undefined;

  if (!lesson) {
    return <LessonNotFound lessonId={lessonId} />;
  }
  /**
   * Keyed on the lesson *and the language*.
   *
   * The session reducer copies the lesson into its own state at
   * `createSession`, so switching language mid-run would otherwise leave the
   * old language's questions on screen until the learner left and came back.
   * Remounting restarts the run, which is the honest outcome: the answers
   * given were to different words.
   */
  return <LessonRunner key={`${lesson.id}#${locale}`} lesson={lesson} />;
}

// ---------------------------------------------------------------------------

function LessonRunner({ lesson }: { lesson: Lesson }) {
  const insets = useSafeAreaInsets();
  const { profile, recordResult } = useProgress();
  const { setSafeToReload } = useContentUpdate();
  const { t } = useLocale();

  /**
   * Hold off any over-the-air update while a run is under way.
   *
   * Applying one restarts the JavaScript runtime, which would discard hearts,
   * XP, the combo and any answer in progress — and to the learner it would
   * look like the app crashed. The flag is cleared on unmount, so finishing,
   * failing or backing out all release it.
   */
  useEffect(() => {
    setSafeToReload(false);
    return () => setSafeToReload(true);
  }, [setSafeToReload]);

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

    /**
     * Hand the run to the review scheduler.
     *
     * `resolved` and `missed` have been computed on every run since the
     * runner was written and thrown away at this line — the app knew what you
     * got wrong and then forgot it. This is the seam where a course that
     * teaches once becomes one that comes back.
     *
     * Deliberately not part of `recordResult`: that crosses into
     * `LearningDataProvider` and can reach Supabase, and a log of every
     * question a person got wrong is the last thing that should leave the
     * device. See `services/reviewStore`.
     *
     * Failure here is silent on purpose. Losing a review schedule is a
     * degraded next session; an exception on this line would lose the run the
     * learner has just finished.
     */
    void recordLessonOutcome({
      lessonId: lesson.id,
      moduleId: getModuleForLesson(lesson.id)?.id ?? 'unknown',
      resolved: state.resolved,
      missed: state.missed,
    }).catch(() => {});
  }, [
    state.status,
    state.xpEarned,
    state.hearts,
    state.maxHearts,
    state.bestCombo,
    state.resolved,
    state.missed,
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
    // `t` rides along so the feedback sheet's generated copy — "Not quite",
    // "You matched 3 of 4 pairs" — is in the learner's language too.
    dispatch({ kind: 'submit', answer: draft, t });
  }, [draft, t]);

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
          accessibilityLabel={t('lesson.exit')}
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

      {/*
        Lessons built around a video play it inline, before the questions and
        only before the first answer. Once answering is under way it would be
        the largest thing on screen and the least useful.
      */}
      {lesson.video && state.stepSerial === 0 && !state.feedback ? (
        <View style={styles.videoWrap}>
          <LessonVideo
            url={lesson.video.url}
            title={lesson.title}
            minutes={lesson.video.minutes}
            source={lesson.video.source}
          />
        </View>
      ) : null}

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
            label={t('lesson.check')}
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
            state.feedback.correct
              ? t('lesson.continue')
              : state.hearts > 0
                ? t('lesson.gotIt')
                : t('lesson.outOfHearts')
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
  const { t, nextLesson: findNext } = useLocale();
  const nextLesson = findNext(lesson.id);

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
        <Text style={styles.endTitle}>
          {perfect ? t('complete.flawless') : t('complete.title')}
        </Text>
        <Text style={styles.endSubtitle}>{lesson.title}</Text>
      </Animated.View>

      <View style={styles.statRow}>
        <Stat label={t('complete.xpEarned')} value={`+${xpEarned}`} tone={palette.mintDark} />
        <Stat label={t('complete.bestCombo')} value={`${bestCombo}`} tone={palette.goldDark} />
      </View>

      {lesson.keyTakeaways?.length ? (
        <View style={styles.takeaways}>
          <Text style={styles.takeawaysHeading}>{t('complete.takeaways')}</Text>
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
          label={nextLesson ? t('complete.backToPath') : t('complete.finish')}
          onPress={onExit}
          tone="primary"
        />
        <ActionButton label={t('complete.again')} onPress={onRestart} tone="ghost" />
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
  const { t } = useLocale();

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
        <Text style={styles.endTitle}>{t('failed.title')}</Text>
        <Text style={styles.endSubtitle}>
          {t('failed.body', { lesson: lesson.title.toLowerCase() })}
        </Text>
      </Animated.View>

      <View style={styles.endActions}>
        <ActionButton label={t('failed.retry')} onPress={onRestart} tone="danger" />
        <ActionButton label={t('complete.backToPath')} onPress={onExit} tone="ghost" />
      </View>
    </View>
  );
}

function LessonNotFound({ lessonId }: { lessonId?: string }) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  return (
    <View style={[styles.screen, styles.endContent, { paddingTop: insets.top + spacing.xxxl }]}>
      <Text style={styles.endEmoji}>🤔</Text>
      <Text style={styles.endTitle}>{t('notFound.title')}</Text>
      <Text style={styles.endSubtitle}>{t('notFound.body', { id: lessonId ?? '—' })}</Text>
      <ActionButton
        label={t('complete.backToPath')}
        onPress={() => router.replace('/')}
        tone="ghost"
      />
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
  videoWrap: {
    paddingHorizontal: spacing.lg,
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
