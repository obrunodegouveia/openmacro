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

import { Fragment, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { router } from 'expo-router';

import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { UpdateBanner } from '@/components/ui/UpdateBanner';
import { StreakBadge } from '@/components/ui/StatusPills';
import { interpolate } from '@/i18n/interpolate';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { useReview } from '@/hooks/useReview';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson, ModuleLevel } from '@openmacro/core/content/schema';
import { currentLevel, groupByLevel } from '@openmacro/core/content/levels';

export default function LearningPathScreen() {
  const insets = useSafeAreaInsets();
  const { profile, progress, loading, error, isLessonComplete } = useProgress();
  // The course arrives already translated; nothing below knows which language
  // it is in, which is what keeps the screen free of `locale ===` branches.
  const { t, course, modules } = useLocale();
  const { due: reviewDue } = useReview();

  const groups = useMemo(() => groupByLevel(modules), [modules]);

  /**
   * The lesson to carry on with.
   *
   * With the path collapsed, the screen opens on three headings and no
   * obvious way back in — a learner mid-course has to remember where they
   * were and expand their way to it. The website has had a resume card since
   * it grew a course map; the app never did, and collapsing made its absence
   * the first thing you meet.
   */
  const resume = useMemo(() => {
    for (const module of modules) {
      const lesson = module.lessons.find((entry) => !isLessonComplete(entry.id));
      if (lesson) return lesson;
    }
    return undefined;
  }, [modules, isLessonComplete]);

  /**
   * The level the learner is actually in — the first with an unfinished
   * lesson, or the last one if they have finished everything.
   *
   * Collapsing every level would open the app on three headings and no course,
   * so exactly one starts open, and it is the one they would have had to
   * scroll to find.
   */
  const openByDefault = useMemo(
    () => currentLevel(groups, isLessonComplete),
    [groups, isLessonComplete],
  );

  /**
   * Honour the OS "reduce motion" setting.
   *
   * The website gets this for free from a `prefers-reduced-motion` rule in
   * `globals.css`; the app had nothing, so every expand animated regardless
   * of what the learner had asked the system for. Someone who turns that on
   * usually means it.
   */
  const reduceMotion = useReducedMotion();

  const [collapsed, setCollapsed] = useState<readonly ModuleLevel[]>([]);
  const [touched, setTouched] = useState(false);

  /**
   * The module holding the next unfinished lesson — open by default, for the
   * same reason exactly one level is.
   */
  const openModuleId = useMemo(() => {
    const next = modules.find((module) =>
      module.lessons.some((lesson) => !isLessonComplete(lesson.id)),
    );
    return next?.id ?? modules[modules.length - 1]?.id;
  }, [modules, isLessonComplete]);

  const [closedModules, setClosedModules] = useState<readonly string[]>([]);
  const [moduleTouched, setModuleTouched] = useState(false);

  const isModuleOpen = (moduleId: string) =>
    moduleTouched ? !closedModules.includes(moduleId) : moduleId === openModuleId;

  const toggleModule = (moduleId: string) => {
    if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const open = isModuleOpen(moduleId);
    setClosedModules((current) => {
      const base = moduleTouched
        ? current
        : modules.map((module) => module.id).filter((id) => id !== openModuleId);
      return open ? [...base, moduleId] : base.filter((id) => id !== moduleId);
    });
    setModuleTouched(true);
  };

  /**
   * Until the learner touches a header, openness follows their progress; after
   * that it follows them. Deriving it rather than seeding state in an effect
   * means the first paint is already correct — no flash of three open levels
   * collapsing a frame later.
   */
  const isOpen = (level: ModuleLevel) =>
    touched ? !collapsed.includes(level) : level === openByDefault;

  const toggle = (level: ModuleLevel) => {
    if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const open = isOpen(level);
    setCollapsed((current) => {
      const base = touched
        ? current
        : groups.map((group) => group.level).filter((level) => level !== openByDefault);
      return open ? [...base, level] : base.filter((entry) => entry !== level);
    });
    setTouched(true);
  };

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

      {/* ---- carry on ---------------------------------------------------
        Only once there is something to carry on *from*: on a first run this
        would point at the first lesson of the course, which is already the
        next thing on screen.
      */}
      {resume && (profile?.totalXp ?? 0) > 0 ? (
        <Pressable
          onPress={() =>
            router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: resume.id } })
          }
          accessibilityRole="button"
          accessibilityLabel={t('path.lesson.open', { title: resume.title })}
          style={({ pressed }) => [styles.resume, pressed && styles.lessonCardPressed]}
        >
          <View style={styles.resumeIcon}>
            <Text style={styles.lessonIconText}>{resume.icon}</Text>
          </View>
          <View style={styles.lessonBody}>
            <Text style={styles.resumeEyebrow}>{t('map.resume')}</Text>
            <Text style={styles.lessonTitle}>{resume.title}</Text>
          </View>
        </Pressable>
      ) : null}

      {/* ---- what is slipping -------------------------------------------
        Sits under the resume card because it is the second thing to do, not
        the first: the course moves forwards, and review is what keeps the
        ground behind you from giving way. Absent entirely when the schedule
        has nothing due, rather than shown as an empty state — a permanent
        "0 to review" is a nag, not information.
      */}
      {reviewDue.length > 0 ? (
        <Pressable
          onPress={() => router.push('/review')}
          accessibilityRole="button"
          accessibilityLabel={t('review.start')}
          style={({ pressed }) => [styles.review, pressed && styles.lessonCardPressed]}
        >
          <View style={styles.reviewIcon}>
            <Text style={styles.lessonIconText}>🔁</Text>
          </View>
          <View style={styles.lessonBody}>
            <Text style={styles.reviewEyebrow}>{t('review.title')}</Text>
            <Text style={styles.lessonTitle}>{t('review.due', { count: reviewDue.length })}</Text>
          </View>
        </Pressable>
      ) : null}

      {/* ---- modules ----------------------------------------------------
        One collapsible section per level. The path is 32 modules long, so a
        flat list meant scrolling past two levels to reach the one you are in;
        grouping is what makes the last third reachable.
      */}
      {groups.map((group) => {
        const open = isOpen(group.level);
        const levelDone = group.modules.filter((module) =>
          module.lessons.every((lesson) => isLessonComplete(lesson.id)),
        ).length;
        return (
          <View key={group.level} style={styles.level}>
            <Pressable
              onPress={() => toggle(group.level)}
              style={({ pressed }) => [styles.levelHeader, pressed && styles.levelHeaderPressed]}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={t(`level.${group.level}`)}
              accessibilityHint={t(`level.${group.level}.unlocks`)}
            >
              <View style={styles.levelTitleRow}>
                <Text style={styles.levelTitle}>{t(`level.${group.level}`)}</Text>
                <Text style={styles.levelCount}>
                  {t('level.count', { count: group.modules.length })}
                </Text>
                {/* Collapsed, the screen otherwise says nothing about how far
                    anyone has got — the count is the size of the level, not
                    the learner's place in it. */}
                {/* Grouped so the pair sits together on the right whether or
                    not the progress figure is there — an `auto` margin on the
                    figure alone leaves the chevron beside the pill the moment
                    a learner has finished nothing yet. */}
                <View style={styles.levelTrailing}>
                  {levelDone > 0 ? (
                    <Text style={styles.levelProgress}>
                      {t('path.module.progress', {
                        done: levelDone,
                        total: group.modules.length,
                      })}
                    </Text>
                  ) : null}
                  {/* A glyph, not a word: the lint rule that requires t() for
                      user-visible text exempts strings with no two consecutive
                      letters, and a chevron needs no translation. */}
                  <Text style={styles.levelChevron}>{open ? '⌃' : '⌄'}</Text>
                </View>
              </View>
              <Text style={styles.levelBlurb}>{t(`level.${group.level}.blurb`)}</Text>
              <Text style={styles.levelUnlocks}>{t(`level.${group.level}.unlocks`)}</Text>
            </Pressable>

            {open
              ? group.modules.map((module, indexInLevel) => {
                  const moduleOpen = isModuleOpen(module.id);
                  const done = module.lessons.filter((lesson) =>
                    isLessonComplete(lesson.id),
                  ).length;
                  const finished = done === module.lessons.length;

                  return (
                    <Animated.View
                      key={module.id}
                      entering={
                        reduceMotion
                          ? undefined
                          : FadeInDown.delay(indexInLevel * 60).duration(240)
                      }
                      style={styles.module}
                    >
                      <Pressable
                        onPress={() => toggleModule(module.id)}
                        style={({ pressed }) => [
                          styles.moduleHeader,
                          pressed && styles.levelHeaderPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ expanded: moduleOpen }}
                        accessibilityLabel={module.title}
                        accessibilityHint={module.description}
                      >
                        <View style={styles.moduleTopRow}>
                          <Text style={styles.moduleEyebrow}>
                            {t('path.module', { number: group.offset + indexInLevel + 1 })}
                          </Text>
                          {/* The collapsed row has to carry what the learner
                              came to find out, or collapsing hides exactly the
                              thing that makes the list scannable. */}
                          <Text style={[styles.moduleProgress, finished && styles.moduleProgressDone]}>
                            {finished
                              ? t('path.module.done')
                              : t('path.module.progress', {
                                  done,
                                  total: module.lessons.length,
                                })}
                          </Text>
                          <Text style={styles.levelChevron}>{moduleOpen ? '⌃' : '⌄'}</Text>
                        </View>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text
                          style={styles.moduleDescription}
                          numberOfLines={moduleOpen ? undefined : 2}
                        >
                          {module.description}
                        </Text>
                      </Pressable>

                      {moduleOpen
                        ? module.lessons.map((lesson) => (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              complete={isLessonComplete(lesson.id)}
                              bestXp={progress[lesson.id]?.bestXp ?? 0}
                            />
                          ))
                        : null}
                    </Animated.View>
                  );
                })
              : null}
          </View>
        );
      })}

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
  level: { marginBottom: spacing.lg },
  moduleTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  moduleProgress: {
    ...typography.caption,
    color: palette.inkFaint,
    marginLeft: 'auto',
    fontVariant: ['tabular-nums'],
  },
  moduleProgressDone: { color: palette.mint },
  levelHeaderPressed: { opacity: 0.7 },
  levelChevron: {
    fontSize: 22,
    lineHeight: 22,
    color: palette.inkMuted,
    fontWeight: '700',
  },
  levelProgress: {
    ...typography.caption,
    color: palette.inkFaint,
    fontVariant: ['tabular-nums'],
  },
  levelTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: 'auto',
  },
  levelUnlocks: {
    ...typography.caption,
    color: palette.inkMuted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  levelHeader: {
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: spacing.xl,
    marginTop: spacing.lg,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelTitle: {
    ...typography.display,
    color: palette.ink,
  },
  levelCount: {
    ...typography.caption,
    color: palette.mintDark,
    backgroundColor: palette.mintSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  levelBlurb: {
    ...typography.body,
    color: palette.inkMuted,
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
  /**
   * The resume card, deliberately the one mint-filled thing on the screen.
   * Everything else here is a container; this is the action.
   */
  resume: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.mintSoft,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: palette.mint,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  /** The review card. Blue, so it reads as the other action, not a second
      copy of the mint one. */
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.blueSoft,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: palette.blue,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  reviewIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.blue,
  },
  reviewEyebrow: {
    ...typography.caption,
    color: palette.blueDark,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  resumeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.mint,
  },
  resumeEyebrow: {
    ...typography.caption,
    color: palette.mintDark,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
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
