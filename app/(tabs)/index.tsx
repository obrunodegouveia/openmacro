/**
 * The learning path — the Home tab.
 *
 * Renders straight from `src/content/registry.ts`, so a contributor who adds a
 * module sees it appear here with zero changes to this file.
 *
 * Account, language and the progress summary used to sit at the head and foot
 * of this scroll because there was nowhere else to put them. There is now, and
 * this screen is only the course.
 */

import { Fragment } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { UpdateBanner } from '@/components/ui/UpdateBanner';
import { StreakBadge } from '@/components/ui/StatusPills';
import { interpolate } from '@/i18n/interpolate';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson } from '@openmacro/core/content/schema';

export default function LearningPathScreen() {
  const insets = useSafeAreaInsets();
  const { profile, progress, loading, error, isLessonComplete } = useProgress();
  // The course arrives already translated; nothing below knows which language
  // it is in, which is what keeps the screen free of `locale ===` branches.
  const { t, course, modules } = useLocale();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
      ]}
    >
      {/* ---- header ---------------------------------------------------- */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Image
            source={require('../../assets/brand/v3/openmacro-lockup-light.png')}
            style={styles.brandLockup}
            resizeMode="contain"
            accessible
            accessibilityRole="image"
            accessibilityLabel="OpenMacro"
          />
          <Text style={styles.tagline}>{course.description}</Text>
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
                <Text style={styles.xpText}>{t('path.xp', { count: profile?.totalXp ?? 0 })}</Text>
              </View>
            </Fragment>
          )}
        </View>
      </View>

      <UpdateBanner />

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* ---- modules --------------------------------------------------- */}
      {modules.map((module, moduleIndex) => (
        <Animated.View
          key={module.id}
          entering={FadeInDown.delay(moduleIndex * 80).duration(280)}
          style={styles.module}
        >
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleEyebrow}>
              {t('path.module', { number: moduleIndex + 1 })}
            </Text>
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
        <Text style={styles.contributeTitle}>{t('path.contribute.title')}</Text>
        <Text style={styles.contributeBody}>
          {interpolate(t('path.contribute.body'), {
            lessons: <Text style={styles.code}>src/content/lessons/</Text>,
            registry: <Text style={styles.code}>src/content/registry.ts</Text>,
          })}
        </Text>
      </View>

    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

interface LessonCardProps {
  lesson: Lesson;
  complete: boolean;
  bestXp: number;
}

function LessonCard({ lesson, complete, bestXp }: LessonCardProps) {
  const { t } = useLocale();
  // Navigating imperatively rather than with <Link asChild>: the `asChild`
  // clone does not forward a function-form `style` to the child on web, which
  // silently strips the card's styling there.
  const open = () =>
    router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('path.lesson.open', { title: lesson.title })}
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
          <Text style={styles.lessonMeta}>
            {t('path.lesson.minutes', { count: lesson.estimatedMinutes })}
          </Text>
          <Text style={styles.lessonMetaDot}>·</Text>
          <Text style={styles.lessonMeta}>
            {t('path.lesson.steps', { count: lesson.challenges.length })}
          </Text>
          {complete ? (
            <Fragment>
              <Text style={styles.lessonMetaDot}>·</Text>
              <Text style={[styles.lessonMeta, styles.lessonMetaDone]}>
                {t('path.lesson.best', { count: bestXp })}
              </Text>
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
  brandLockup: {
    width: '100%',
    maxWidth: 212,
    height: 40,
    alignSelf: 'flex-start',
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
