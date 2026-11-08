/**
 * An exam a teacher has assigned to this learner.
 *
 * The opposite of a lesson: no hearts, no re-queue, and no verdict until the
 * end, so nothing on screen teaches the answer to the next question. Leaving
 * half way saves nothing and starts the same paper again next time.
 *
 * The whole screen is in the language of the assignment, whatever the app is
 * set to. The website's twin is `web/src/components/app/assigned-exam.tsx`.
 *
 * The clock is the database's (`supabase/migrations/0010_exam_timer.sql`).
 * The one on screen counts on from the seconds the server reported at Start,
 * so a phone whose clock is wrong still shows the right time.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ChallengeView } from '@/components/challenges/ChallengeView';
import { ActionButton } from '@/components/ui/ActionButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { emitFeedback } from '@/feedback';
import { useAssignedExam } from '@/hooks/useAssignedExam';
import { ForcedLocale, useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { supabase } from '@/services/supabaseClient';
import { fontScale, palette, spacing, typography } from '@/theme/tokens';
import type { ChallengeAnswer } from '@openmacro/core/engine/answers';
import {
  EXAM_SPEED_BONUS,
  assembleAssignedExam,
  assignedExamSubmission,
  examTimingFromReply,
  formatExamClock,
  type AssignedExam,
  type ExamTiming,
} from '@openmacro/core/engine/assignedExam';
import { gradeExam, type ExamResult } from '@openmacro/core/engine/exam';

export default function ExamRoute() {
  const { exam, loading } = useAssignedExam();
  const { loading: progressLoading } = useProgress();
  // Held once found: handing the exam in makes the next read come back empty,
  // and that must not replace the results the learner is reading.
  const [held, setHeld] = useState<AssignedExam | null>(null);
  if (exam && !held) setHeld(exam);

  if (!held && (loading || progressLoading)) return null;
  if (!held) return <Nothing kind="none" />;

  return (
    <ForcedLocale locale={held.locale}>
      {progressLoading ? null : <ExamRunner exam={held} />}
    </ForcedLocale>
  );
}

function Nothing({ kind }: { kind: 'none' | 'empty' }) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  return (
    <View style={[styles.centred, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.doneTitle}>{t(`exam.${kind}.title`)}</Text>
      <Text style={styles.doneBody}>{t(`exam.${kind}.body`)}</Text>
      <ActionButton
        label={t('exam.close')}
        onPress={() => router.back()}
        tone="ghost"
        style={styles.endButton}
      />
    </View>
  );
}

function ExamRunner({ exam }: { exam: AssignedExam }) {
  const insets = useSafeAreaInsets();
  const { t, modules, lessonById } = useLocale();
  const { isLessonComplete } = useProgress();

  // Drawn once: finishing a lesson elsewhere must not change a paper in hand.
  const [paper] = useState(() => assembleAssignedExam(modules, isLessonComplete, exam).exam);
  const lookup = useCallback(
    (item: { lessonId: string; challengeId: string }) =>
      lessonById(item.lessonId)?.challenges.find((entry) => entry.id === item.challengeId),
    [lessonById],
  );

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ChallengeAnswer>>({});
  const [draft, setDraft] = useState<ChallengeAnswer | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [clock, setClock] = useState<{ seconds: number; at: number } | null>(null);
  const [timing, setTiming] = useState<ExamTiming | null>(null);
  const [starting, setStarting] = useState(false);

  const start = useCallback(async () => {
    setStarting(true);
    let seconds = 0;
    try {
      // Without the server's start there is no official time and no bonus,
      // but the learner can still take the exam.
      const reply = supabase ? await supabase.rpc('start_assigned_exam', { p_exam: exam.id }) : null;
      if (typeof reply?.data === 'number') seconds = reply.data;
    } catch {
      // Offline: the exam still runs.
    }
    setClock({ seconds, at: Date.now() });
    setStarting(false);
    setStarted(true);
  }, [exam.id]);

  const moduleTitles = useMemo(
    () => new Map(modules.map((module) => [module.id, module.title])),
    [modules],
  );

  const send = useCallback(
    async (graded: ExamResult) => {
      setSaving(true);
      setFailed(false);
      try {
        if (!supabase) throw new Error('No account backend.');
        const { data, error } = await supabase.rpc(
          'submit_assigned_exam',
          assignedExamSubmission(exam.id, graded),
        );
        if (error) throw error;
        setTiming(examTimingFromReply(data));
        setSaved(true);
      } catch {
        setFailed(true);
      } finally {
        setSaving(false);
      }
    },
    [exam.id],
  );

  const item = paper.items[index];
  const challenge = item ? lookup(item) : undefined;
  const last = index === paper.items.length - 1;

  const handleNext = useCallback(() => {
    if (!item || !draft) return;
    emitFeedback('advance');
    const nextAnswers = { ...answers, [item.id]: draft };
    setAnswers(nextAnswers);
    setDraft(null);
    if (!last) {
      setIndex(index + 1);
      return;
    }
    emitFeedback('complete');
    const graded = gradeExam(paper, nextAnswers, lookup, t);
    setResult(graded);
    void send(graded);
  }, [answers, draft, index, item, last, lookup, paper, send, t]);

  if (paper.items.length === 0) {
    return <Nothing kind="empty" />;
  }

  if (result) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.resultContent,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <Text maxFontSizeMultiplier={fontScale.title} style={styles.doneTitle}>
          {t('exam.result.title')}
        </Text>
        <Text style={styles.score}>
          {t('exam.result.score', { correct: result.correct, asked: result.asked })}
        </Text>
        <View style={styles.levels}>
          {result.byLevel
            .filter((level) => level.asked > 0)
            .map((level) => (
              <View key={level.level} style={styles.levelRow}>
                <Text style={styles.levelName}>{t(`level.${level.level}`)}</Text>
                <Text style={styles.levelScore}>
                  {t('exam.result.score', { correct: level.correct, asked: level.asked })}
                </Text>
              </View>
            ))}
        </View>
        {result.weakModules.length > 0 ? (
          <View style={styles.weak}>
            <Text style={styles.weakTitle}>{t('exam.result.weak')}</Text>
            {result.weakModules.map((id) => (
              <Text key={id} style={styles.weakItem}>
                {moduleTitles.get(id) ?? id}
              </Text>
            ))}
          </View>
        ) : null}
        {timing?.seconds != null ? (
          <View style={styles.timing}>
            <Text style={styles.levelName}>
              {t('exam.result.time', { time: formatExamClock(timing.seconds) })}
            </Text>
            <Text style={timing.bonusXp > 0 ? styles.bonus : styles.levelScore}>
              {timing.bonusXp > 0
                ? t('exam.result.bonus', { xp: timing.bonusXp })
                : t('exam.result.noBonus')}
            </Text>
          </View>
        ) : null}
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {saved ? t('exam.result.sent') : failed ? t('exam.result.failed') : t('exam.result.sending')}
        </Text>
        {failed ? (
          <ActionButton
            label={t('exam.result.retry')}
            onPress={() => void send(result)}
            disabled={saving}
            tone="primary"
            style={styles.endButton}
          />
        ) : null}
        <ActionButton
          label={t('exam.close')}
          onPress={() => router.back()}
          disabled={saving}
          tone="ghost"
          style={styles.endButton}
        />
      </ScrollView>
    );
  }

  if (!started) {
    return (
      <View style={[styles.centred, { paddingTop: insets.top + spacing.xl }]}>
        <Text maxFontSizeMultiplier={fontScale.title} style={styles.doneTitle}>
          {t('exam.intro.title')}
        </Text>
        <Text style={styles.doneBody}>{t('exam.intro.body', { count: paper.items.length })}</Text>
        <Text style={styles.doneBody}>
          {t('exam.intro.clock', {
            share: `${Math.round(EXAM_SPEED_BONUS.minShare * 100)}%`,
            fast: EXAM_SPEED_BONUS.fastSecondsPerQuestion,
            steady: EXAM_SPEED_BONUS.steadySecondsPerQuestion,
            xp: EXAM_SPEED_BONUS.xpPerQuestion * paper.items.length,
          })}
        </Text>
        <ActionButton
          label={t('exam.start')}
          onPress={() => void start()}
          disabled={starting}
          tone="primary"
          style={styles.endButton}
        />
        <ActionButton
          label={t('exam.later')}
          onPress={() => router.back()}
          tone="ghost"
          style={styles.endButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('exam.exit')}
            hitSlop={12}
            onPress={() => router.back()}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.close}>✕</Text>
          </Pressable>
          <Text maxFontSizeMultiplier={fontScale.title} style={styles.headerTitle}>
            {t('exam.question', { number: index + 1, total: paper.items.length })}
          </Text>
          {clock ? <Clock from={clock} label={t('exam.clock')} /> : null}
        </View>
        <ProgressBar progress={index / paper.items.length} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {challenge ? (
          <ChallengeView
            key={item?.id}
            challenge={challenge}
            onAnswerChange={setDraft}
            locked={false}
            result={null}
            transitionKey={item?.id ?? ''}
          />
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <ActionButton
          label={last ? t('exam.finish') : t('exam.next')}
          onPress={handleNext}
          disabled={!draft}
          tone={draft ? 'primary' : 'ghost'}
        />
      </View>
    </View>
  );
}

/** A running clock, counting on from what the server said at Start. */
function Clock({ from, label }: { from: { seconds: number; at: number }; label: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const time = formatExamClock(from.seconds + (now - from.at) / 1000);
  return (
    <Text
      accessibilityLabel={`${label} ${time}`}
      maxFontSizeMultiplier={fontScale.chrome}
      style={styles.clock}
    >
      {time}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  close: { ...typography.heading, color: palette.inkFaint },
  pressed: { opacity: 0.6 },
  headerTitle: { ...typography.title, color: palette.ink, flexShrink: 1, flexGrow: 1 },
  clock: { ...typography.heading, color: palette.inkMuted, fontVariant: ['tabular-nums'] },
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
  resultContent: { padding: spacing.xl, gap: spacing.md },
  endButton: { alignSelf: 'stretch' },
  doneTitle: { ...typography.display, color: palette.ink, textAlign: 'center' },
  doneBody: {
    ...typography.body,
    color: palette.inkMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  score: { ...typography.title, color: palette.ink, textAlign: 'center' },
  levels: { gap: spacing.sm },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  levelName: { ...typography.body, color: palette.ink, flexShrink: 1 },
  levelScore: { ...typography.body, color: palette.inkMuted },
  weak: { gap: spacing.xs },
  weakTitle: { ...typography.heading, color: palette.ink },
  weakItem: { ...typography.body, color: palette.inkMuted },
  timing: { gap: spacing.xs, alignItems: 'center' },
  bonus: { ...typography.heading, color: palette.ink },
  status: { ...typography.caption, color: palette.inkMuted, textAlign: 'center' },
});
