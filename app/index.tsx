/**
 * The learning path — the app's home screen.
 *
 * Renders straight from `src/content/registry.ts`, so a contributor who adds a
 * module sees it appear here with zero changes to this file.
 */

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { AccountBar } from '@/components/ui/AccountBar';
import { StreakBadge } from '@/components/ui/StatusPills';
import { COURSE, MODULES } from '@openmacro/core/content/registry';
import { useProgress } from '@/providers/ProgressProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson } from '@openmacro/core/content/schema';

export default function LearningPathScreen() {
  const insets = useSafeAreaInsets();
  const { profile, progress, loading, error, isLessonComplete } = useProgress();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxxl },
      ]}
    >
      {/* ---- header ---------------------------------------------------- */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.brand}>OpenMacro</Text>
          <Text style={styles.tagline}>{COURSE.description}</Text>
        </View>
        <View style={styles.headerStats}>
          {loading ? (
            <ActivityIndicator color={palette.inkFaint} />
          ) : (
            <Fragment>
              <StreakBadge
                streak={profile?.dayStreak ?? 0}
                active={profile?.streakActiveToday ?? false}
              />
              <View style={styles.xpPill}>
                <Text style={styles.xpText}>{profile?.totalXp ?? 0} XP</Text>
              </View>
            </Fragment>
          )}
        </View>
      </View>

      <AccountBar />

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* ---- modules --------------------------------------------------- */}
      {MODULES.map((module, moduleIndex) => (
        <Animated.View
          key={module.id}
          entering={FadeInDown.delay(moduleIndex * 80).duration(280)}
          style={styles.module}
        >
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleEyebrow}>Module {moduleIndex + 1}</Text>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
          </View>

          {module.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              complete={isLessonComplete(lesson.id)}
              bestXp={progress[lesson.id]?.bestXp ?? 0}
            />
          ))}
        </Animated.View>
      ))}

      {/* ---- contributor call to action -------------------------------- */}
      <View style={styles.contributeCard}>
        <Text style={styles.contributeTitle}>More lessons coming</Text>
        <Text style={styles.contributeBody}>
          OpenMacro is open source. A lesson is a single TypeScript file — drop yours into{' '}
          <Text style={styles.code}>src/content/lessons/</Text>, register it in{' '}
          <Text style={styles.code}>src/content/registry.ts</Text> and it appears right here.
        </Text>
      </View>

      <ResetProgressButton />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

/**
 * Clears XP, streak and completion records.
 *
 * Progress now persists on the device, so there has to be a way back to zero —
 * for a learner who wants a clean run, and for contributors testing the first
 * session. Confirmation is a second tap rather than a dialog: `Alert.alert` is
 * a no-op on react-native-web, which would leave this destructive control
 * silently unconfirmed on one of our three platforms.
 */
function ResetProgressButton() {
  const { reset } = useProgress();
  const [armed, setArmed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  const handlePress = useCallback(() => {
    if (!armed) {
      setArmed(true);
      timeout.current = setTimeout(() => setArmed(false), 4000);
      return;
    }
    if (timeout.current) clearTimeout(timeout.current);
    setArmed(false);
    void reset();
  }, [armed, reset]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={armed ? 'Tap again to confirm resetting progress' : 'Reset progress'}
      hitSlop={8}
      onPress={handlePress}
      style={styles.reset}
    >
      <Text style={[styles.resetText, armed && styles.resetTextArmed]}>
        {armed ? 'Tap again to erase all progress' : 'Reset progress'}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

interface LessonCardProps {
  lesson: Lesson;
  complete: boolean;
  bestXp: number;
}

function LessonCard({ lesson, complete, bestXp }: LessonCardProps) {
  // Navigating imperatively rather than with <Link asChild>: the `asChild`
  // clone does not forward a function-form `style` to the child on web, which
  // silently strips the card's styling there.
  const open = () =>
    router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Start lesson: ${lesson.title}`}
      onPress={open}
      style={({ pressed }) => [styles.lessonCard, pressed && styles.lessonCardPressed]}
    >
      <View style={[styles.lessonIcon, complete && styles.lessonIconComplete]}>
        <Text style={styles.lessonIconText}>{lesson.icon}</Text>
      </View>

      <View style={styles.lessonBody}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle} numberOfLines={2}>
          {lesson.subtitle}
        </Text>
        <View style={styles.lessonMetaRow}>
          <Text style={styles.lessonMeta}>{lesson.estimatedMinutes} min</Text>
          <Text style={styles.lessonMetaDot}>·</Text>
          <Text style={styles.lessonMeta}>{lesson.challenges.length} steps</Text>
          {complete ? (
            <Fragment>
              <Text style={styles.lessonMetaDot}>·</Text>
              <Text style={[styles.lessonMeta, styles.lessonMetaDone]}>{bestXp} XP best</Text>
            </Fragment>
          ) : null}
        </View>
      </View>

      <Text style={styles.chevron}>{complete ? '↻' : '›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  brand: {
    ...typography.display,
    color: palette.ink,
  },
  tagline: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
  },
  headerStats: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  xpPill: {
    backgroundColor: palette.blueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  xpText: {
    ...typography.caption,
    color: palette.blueDark,
  },
  errorBanner: {
    backgroundColor: palette.coralSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: palette.coralDark,
  },
  module: {
    gap: spacing.md,
  },
  moduleHeader: {
    gap: spacing.xs,
  },
  moduleEyebrow: {
    ...typography.overline,
    color: palette.mintDark,
    textTransform: 'uppercase',
  },
  moduleTitle: {
    ...typography.title,
    color: palette.ink,
  },
  moduleDescription: {
    ...typography.body,
    color: palette.inkMuted,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  lessonCardPressed: {
    borderBottomWidth: 2,
    marginTop: 3,
    backgroundColor: palette.canvas,
  },
  lessonIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: palette.canvas,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconComplete: {
    backgroundColor: palette.mintSoft,
    borderColor: palette.mint,
  },
  lessonIconText: {
    fontSize: 24,
  },
  lessonBody: {
    flex: 1,
    gap: 2,
  },
  lessonTitle: {
    ...typography.heading,
    color: palette.ink,
  },
  lessonSubtitle: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  lessonMeta: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  lessonMetaDone: {
    color: palette.mintDark,
  },
  lessonMetaDot: {
    color: palette.inkFaint,
  },
  chevron: {
    ...typography.title,
    color: palette.inkFaint,
  },
  contributeCard: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  contributeTitle: {
    ...typography.heading,
    color: palette.ink,
  },
  contributeBody: {
    ...typography.caption,
    color: palette.inkMuted,
    fontWeight: '500',
    lineHeight: 20,
  },
  code: {
    fontFamily: 'Courier',
    color: palette.blueDark,
  },
  reset: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  resetText: {
    ...typography.caption,
    color: palette.inkFaint,
  },
  resetTextArmed: {
    color: palette.coralDark,
  },
});
