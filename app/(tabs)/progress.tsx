/**
 * Progress — what the learner has actually done.
 *
 * The course map answers "what is there?". This answers "how far am I?", which
 * used to be squeezed into two pills in the path header and could never be
 * more than that without pushing the first lesson below the fold.
 *
 * Everything here is derived, never stored. Completion, XP and the per-module
 * bars all come from the same `progress` record the runner writes, so there is
 * no second source of truth to drift — a module added to the registry appears
 * with a bar on the next launch and nothing here has to know about it.
 */

import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StreakBadge } from '@/components/ui/StatusPills';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { useReview } from '@/hooks/useReview';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { t, modules } = useLocale();
  const { profile, progress, loading, isLessonComplete } = useProgress();
  const { summary } = useReview();

  const lessons = modules.flatMap((module) => module.lessons);
  const done = lessons.filter((lesson) => isLessonComplete(lesson.id)).length;

  /**
   * `weakestModules` comes back as ids, because the scheduler has no business
   * knowing what a module is called. Resolved here, against the course in the
   * language being read; an id that no longer matches a module is dropped
   * rather than printed raw.
   */
  const weakest = (summary?.weakestModules ?? [])
    .slice(0, 3)
    .map((id) => modules.find((module) => module.id === id)?.title)
    .filter((title): title is string => Boolean(title));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
      ]}
      // The tab bar is Liquid Glass on iOS 26 and the content is meant to pass
      // beneath it — inset the scroll indicator so it does not sit under the
      // bar, and let the content itself run under.
      scrollIndicatorInsets={{ bottom: TAB_BAR_SPACE }}
    >
      <Text style={styles.title}>{t('progress.title')}</Text>

      {loading ? (
        <ActivityIndicator color={palette.inkFaint} style={styles.loading} />
      ) : (
        <>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile?.totalXp ?? 0}</Text>
              <Text style={styles.statLabel}>{t('progress.stat.xp')}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{done}</Text>
              <Text style={styles.statLabel}>
                {t('progress.stat.lessons', { total: lessons.length })}
              </Text>
            </View>
            <View style={styles.stat}>
              <StreakBadge
                streak={profile?.dayStreak ?? 0}
                active={profile?.streakActiveToday ?? false}
              />
              <Text style={styles.statLabel}>{t('progress.stat.streak')}</Text>
            </View>
          </View>

          <ProgressBar progress={lessons.length ? done / lessons.length : 0} height={12} />

          {/* ---- memory ------------------------------------------------
            The other half of "how far am I?". Everything above counts what
            was finished; this counts what is still held. A course can be
            100% complete and mostly forgotten, and until this panel existed
            the app had no way to say so.

            Hidden entirely before the first lesson: an empty state that says
            "0 tracked" to someone who has not started is noise dressed as
            information.
          */}
          {summary && summary.tracked > 0 ? (
            <View style={styles.memory}>
              <Text style={styles.sectionTitle}>{t('progress.memory.title')}</Text>
              <Text style={styles.sectionBlurb}>{t('progress.memory.blurb')}</Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{summary.tracked}</Text>
                  <Text style={styles.statLabel}>{t('progress.memory.tracked')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{summary.dueThisWeek}</Text>
                  <Text style={styles.statLabel}>{t('progress.memory.week')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{summary.lapsed}</Text>
                  <Text style={styles.statLabel}>{t('progress.memory.lapsed')}</Text>
                </View>
              </View>
              {weakest.length > 0 ? (
                <View style={styles.weakest}>
                  <Text style={styles.weakestLabel}>{t('progress.memory.weakest')}</Text>
                  {weakest.map((title) => (
                    <Text key={title} style={styles.weakestItem} numberOfLines={1}>
                      {title}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          {modules.map((module, index) => {
            const total = module.lessons.length;
            const complete = module.lessons.filter((lesson) =>
              isLessonComplete(lesson.id),
            ).length;
            const earned = module.lessons.reduce(
              (sum, lesson) => sum + (progress[lesson.id]?.bestXp ?? 0),
              0,
            );
            return (
              <Animated.View
                key={module.id}
                entering={FadeInDown.delay(index * 60).duration(240)}
                style={styles.module}
              >
                <View style={styles.moduleHead}>
                  <Text style={styles.moduleTitle} numberOfLines={2}>
                    {module.title}
                  </Text>
                  <Text style={styles.moduleCount}>
                    {t('progress.module.count', { done: complete, total })}
                  </Text>
                </View>
                <ProgressBar
                  progress={total ? complete / total : 0}
                  height={8}
                  fillColor={complete === total && total > 0 ? palette.gold : palette.mint}
                />
                {earned > 0 ? (
                  <Text style={styles.moduleXp}>{t('path.xp', { count: earned })}</Text>
                ) : null}
              </Animated.View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  title: { ...typography.display, color: palette.ink },
  loading: { marginTop: spacing.xxl },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  statValue: { ...typography.title, color: palette.ink },
  statLabel: { ...typography.caption, color: palette.inkMuted, textAlign: 'center' },
  memory: { gap: spacing.sm },
  sectionTitle: { ...typography.heading, color: palette.ink },
  sectionBlurb: { ...typography.caption, color: palette.inkMuted },
  weakest: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  weakestLabel: {
    ...typography.overline,
    color: palette.inkMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  weakestItem: { ...typography.body, color: palette.ink },
  module: { gap: spacing.sm },
  moduleHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  moduleTitle: { ...typography.bodyStrong, color: palette.ink, flex: 1 },
  moduleCount: { ...typography.caption, color: palette.inkMuted },
  moduleXp: { ...typography.caption, color: palette.inkFaint },
});
