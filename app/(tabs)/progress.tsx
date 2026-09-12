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
import { palette, radius, spacing, typography } from '@/theme/tokens';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { t, modules } = useLocale();
  const { profile, progress, loading, isLessonComplete } = useProgress();

  const lessons = modules.flatMap((module) => module.lessons);
  const done = lessons.filter((lesson) => isLessonComplete(lesson.id)).length;

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
