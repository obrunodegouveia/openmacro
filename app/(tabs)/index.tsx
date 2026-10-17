/**
 * Today — the Home tab.
 *
 * This screen used to be the whole course: three collapsible levels holding
 * thirty-odd collapsible modules holding 180 lesson cards. A new learner met
 * Module 1's twenty-five cards and had to scroll eleven screens to discover
 * Module 2 existed; a returning one had to remember where they were.
 *
 * Now it answers one question — what do I do next? — and gets out of the way:
 *
 *   1. one large card for the next lesson, with where it sits and how far
 *      through its module the learner is, and a single button to start it;
 *   2. review, when something is due;
 *   3. the rest of the current module as a strip, for the learner who wants
 *      to see what is coming;
 *   4. a way into the full course map, which now lives in its own tab.
 *
 * Everything is derived from progress by `useCourse`, so the card here, the
 * "You are here" marker on the Course tab and the module page all agree.
 */

import { Fragment } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ActionButton } from '@/components/ui/ActionButton';
import { SignedOutWarning } from '@/components/ui/SignedOutWarning';
import { EurcLink } from '@/components/ui/EurcLink';
import { Chevron } from '@/components/ui/CourseRows';
import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SeasonalAtmosphere, SeasonalCardCorner, SeasonalFooter, SeasonalGreeting, SeasonalLights, SeasonalOverlay } from '@/components/ui/SeasonalDecor';
import { StreakBadge } from '@/components/ui/StatusPills';
import { TopScrim } from '@/components/ui/TopScrim';
import { UpdateBanner } from '@/components/ui/UpdateBanner';
import { emitFeedback } from '@/feedback';
import { useCourse } from '@/hooks/useCourse';
import { openLesson, openModule } from '@/navigation/routes';
import { useReview } from '@/hooks/useReview';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson } from '@openmacro/core/content/schema';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const { profile, loading, error, isLessonComplete } = useProgress();
  const { t, course } = useLocale();
  const { due: reviewDue } = useReview();
  const { next, statuses } = useCourse();
  const reduceMotion = useReducedMotion();
  // The lockup is an image, so it cannot follow a dynamic colour by itself.
  const scheme = useColorScheme();

  const started = (profile?.totalXp ?? 0) > 0;
  const enter = (index: number) =>
    reduceMotion ? undefined : FadeInDown.delay(index * 70).duration(260);

  // The rest of the current module, starting at the next lesson.
  const upNext: Lesson[] = next
    ? next.status.module.lessons
        .slice(next.status.module.lessons.indexOf(next.lesson) + 1)
        .filter((lesson) => !isLessonComplete(lesson.id))
        .slice(0, 6)
    : [];

  return (
    <View style={styles.screen}>
      {/* Behind everything: the season's sky, and on Today its fog. */}
      <SeasonalAtmosphere fog />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
        ]}
        scrollIndicatorInsets={{ bottom: TAB_BAR_SPACE }}
      >
        <SeasonalLights />

        {/* ---- header -------------------------------------------------- */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Image
              source={
                scheme === 'dark'
                  ? require('../../assets/brand/v3/openmacro-lockup-dark.png')
                  : require('../../assets/brand/v3/openmacro-lockup-light.png')
              }
              style={styles.brandLockup}
              resizeMode="contain"
              accessible
              accessibilityRole="image"
              accessibilityLabel="OpenMacro"
            />
            <Text maxFontSizeMultiplier={fontScale.title} style={styles.tagline}>{course.description}</Text>
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
                  <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.xpText}>{t('path.xp', { count: profile?.totalXp ?? 0 })}</Text>
                </View>
              </Fragment>
            )}
          </View>
        </View>

        <SeasonalGreeting />

        {/* Only for accounts with an active EURC wallet; see EurcLink. */}
        <EurcLink />

        <UpdateBanner />

        <SignedOutWarning />

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ---- the next lesson ------------------------------------------ */}
        {next ? (
          <Animated.View entering={enter(0)} style={styles.hero}>
            <SeasonalCardCorner />
            <View style={styles.heroTop}>
              <View style={styles.heroWhere}>
                <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroEyebrow}>
                  {started ? t('today.eyebrowContinue') : t('today.eyebrowStart')}
                </Text>
                <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroContext} numberOfLines={1}>
                  {t('today.where', {
                    level: t(`level.${next.status.level}`),
                    number: next.status.number,
                  })}
                </Text>
                <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroModule} numberOfLines={3}>
                  {next.status.module.title}
                </Text>
              </View>
              <ProgressRing
                progress={next.status.total ? next.status.done / next.status.total : 0}
                size={56}
                stroke={5}
              >
                <Text maxFontSizeMultiplier={fontScale.chrome} style={styles.heroRingText}>
                  {next.status.done}/{next.status.total}
                </Text>
              </ProgressRing>
            </View>

            <View style={styles.heroLesson}>
              <View style={styles.heroIcon}>
                <Text allowFontScaling={false} style={styles.heroIconText}>{next.lesson.icon}</Text>
              </View>
              <View style={styles.heroLessonBody}>
                <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroLessonTitle}>{next.lesson.title}</Text>
                <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroLessonMeta}>
                  {t('path.lesson.minutes', { count: next.lesson.estimatedMinutes })}
                  {' · '}
                  {t('path.lesson.steps', { count: next.lesson.challenges.length })}
                </Text>
              </View>
            </View>

            <ActionButton
              label={started ? t('today.continue') : t('today.start')}
              onPress={() => openLesson(next.lesson.id)}
              tone="primary"
            />

            <Pressable
              accessibilityRole="button"
              onPress={() => openModule(next.status.module.id)}
              hitSlop={8}
              style={({ pressed }) => [styles.heroLink, pressed && styles.pressed]}
            >
              <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroLinkText}>{t('today.openModule')}</Text>
              <Chevron />
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={enter(0)} style={styles.hero}>
            <SeasonalCardCorner />
            <Text style={styles.doneEmoji}>🏆</Text>
            <Text style={styles.heroModule}>{t('today.allDone')}</Text>
            <Text maxFontSizeMultiplier={fontScale.title} style={styles.heroLessonMeta}>{t('today.allDoneBody')}</Text>
          </Animated.View>
        )}

        {/* ---- review --------------------------------------------------- */}
        {reviewDue.length > 0 ? (
          <Animated.View entering={enter(1)}>
            <Pressable
              onPress={() => router.push('/review')}
              accessibilityRole="button"
              accessibilityLabel={t('review.start')}
              style={({ pressed }) => [styles.review, pressed && styles.pressed]}
            >
              <View style={styles.reviewIcon}>
                <SymbolView
                  // Decorative: the control around it carries the label.
                  accessible={false}
                  accessibilityElementsHidden
                  name={{ ios: 'arrow.triangle.2.circlepath', android: 'autorenew', web: 'autorenew' }}
                  size={20}
                  tintColor={palette.blueDark}
                  weight="semibold"
                />
              </View>
              <View style={styles.reviewBody}>
                <Text style={styles.reviewEyebrow}>{t('review.title')}</Text>
                <Text style={styles.reviewTitle}>{t('review.due', { count: reviewDue.length })}</Text>
              </View>
              <Chevron />
            </Pressable>
          </Animated.View>
        ) : null}

        {/* ---- what comes after ----------------------------------------- */}
        {upNext.length > 0 ? (
          <Animated.View entering={enter(2)} style={styles.section}>
            <Text maxFontSizeMultiplier={fontScale.title} style={styles.sectionTitle}>{t('today.upNext')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.strip}
              style={styles.stripScroll}
            >
              {upNext.map((lesson) => (
                <Pressable
                  key={lesson.id}
                  accessibilityRole="button"
                  accessibilityLabel={t('path.lesson.open', { title: lesson.title })}
                  onPress={() => openLesson(lesson.id)}
                  style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
                >
                  <Text allowFontScaling={false} style={styles.tileIcon}>{lesson.icon}</Text>
                  <Text style={styles.tileTitle} numberOfLines={4}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.tileMeta}>
                    {t('path.lesson.minutes', { count: lesson.estimatedMinutes })}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        ) : null}

        {/* ---- the map -------------------------------------------------- */}
        <Animated.View entering={enter(3)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('today.browse', { count: statuses.length })}
            onPress={() => {
              emitFeedback('select');
              router.navigate('/course');
            }}
            style={({ pressed }) => [styles.browse, pressed && styles.pressed]}
          >
            <SymbolView
              // Decorative: the control around it carries the label.
              accessible={false}
              accessibilityElementsHidden
              name={{ ios: 'map', android: 'map', web: 'map' }}
              size={20}
              tintColor={palette.mintDark}
            />
            <Text maxFontSizeMultiplier={fontScale.title} style={styles.browseText}>{t('today.browse', { count: statuses.length })}</Text>
            <Chevron />
          </Pressable>
        </Animated.View>

        <SeasonalFooter />
      </ScrollView>
      <TopScrim />
      <SeasonalOverlay top={insets.top} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  // The same side padding as Course and Profile, so switching tabs does not
  // shift the content sideways.
  content: { paddingHorizontal: spacing.lg, gap: spacing.xl },
  pressed: { opacity: 0.6 },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  headerText: { flex: 1, gap: spacing.xs },
  brandLockup: { width: '100%', maxWidth: 212, height: 40, alignSelf: 'flex-start' },
  tagline: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
  headerStats: { alignItems: 'flex-end', gap: spacing.sm },
  xpPill: {
    backgroundColor: palette.blueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  xpText: { ...typography.caption, color: palette.blueDark },
  errorBanner: { backgroundColor: palette.coralSoft, borderRadius: radius.md, padding: spacing.md },
  errorText: { ...typography.caption, color: palette.coralDark },

  hero: {
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroWhere: { flex: 1, gap: 2 },
  heroEyebrow: {
    ...typography.overline,
    color: palette.mintDark,
    textTransform: 'uppercase',
  },
  heroContext: { ...typography.caption, color: palette.inkMuted },
  heroModule: { ...typography.heading, color: palette.ink },
  heroRingText: { ...typography.caption, fontSize: typography.overline.fontSize, lineHeight: typography.overline.lineHeight, color: palette.ink, fontVariant: ['tabular-nums'] },
  heroLesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.mintSoft,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  heroIconText: { fontSize: 24 },
  heroLessonBody: { flex: 1, gap: 2 },
  heroLessonTitle: { ...typography.bodyStrong, color: palette.ink },
  heroLessonMeta: { ...typography.caption, color: palette.inkMuted },
  heroLink: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  heroLinkText: { ...typography.caption, color: palette.mintDark },
  doneEmoji: { fontSize: 40 },

  review: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.blueSoft,
    borderWidth: 1,
    borderColor: palette.blue,
  },
  reviewIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
  },
  reviewBody: { flex: 1, gap: 2 },
  reviewEyebrow: { ...typography.overline, color: palette.blueDark, textTransform: 'uppercase' },
  reviewTitle: { ...typography.bodyStrong, color: palette.ink },

  section: { gap: spacing.md },
  sectionTitle: { ...typography.heading, color: palette.ink },
  // The strip runs to the screen edges, past the content padding.
  stripScroll: { marginHorizontal: -spacing.lg },
  strip: { paddingHorizontal: spacing.lg, gap: spacing.md },
  tile: {
    width: 200,
    minHeight: 150,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  tileIcon: { fontSize: 24 },
  tileTitle: { ...typography.bodyStrong, color: palette.ink, flex: 1 },
  tileMeta: { ...typography.caption, color: palette.inkMuted },

  browse: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  browseText: { ...typography.bodyStrong, color: palette.ink, flex: 1 },
});
