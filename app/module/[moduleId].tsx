/**
 * A module's own page.
 *
 * Before this, a module was an accordion on the home scroll: opening one
 * unfolded its description, its video, a share card and every lesson in place,
 * so Module 1 alone pushed the rest of the course eleven screens down. Now a
 * module is somewhere you go and come back from — a native stack push with
 * the system back swipe — and the course map stays a short list.
 *
 * The page, top to bottom:
 *
 *   - where it sits (level, number) and its full title, which can run to two
 *     lines; the navigation bar carries only "Module 12", because iOS large
 *     titles truncate and these titles are long;
 *   - a progress ring and the module's size;
 *   - the module video, when there is one;
 *   - the lessons as a timeline with a visible "up next";
 *   - one pinned button that always does the obvious thing: continue, start,
 *     or replay from the top once everything is finished.
 *
 * Share moved to the navigation bar, where iOS puts it.
 *
 * It is also a deep link: openmacro://module/<id> opens straight here.
 */

import { useCallback } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ActionButton } from '@/components/ui/ActionButton';
import { LessonRow, type LessonState } from '@/components/ui/CourseRows';
import { LessonVideo } from '@/components/ui/LessonVideo';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useCourse } from '@/hooks/useCourse';
import { SeasonalCardCorner, SeasonalFooter } from '@/components/ui/SeasonalDecor';
import { openLesson } from '@/navigation/routes';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';
import { moduleUrl } from '@openmacro/core/content/links';

/** Room for the pinned button, so the last lesson is not hidden behind it. */
const FOOTER_SPACE = 112;

export default function ModuleScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const insets = useSafeAreaInsets();
  const { t, locale } = useLocale();
  const { progress, isLessonComplete } = useProgress();
  const { statusOf } = useCourse();
  const status = moduleId ? statusOf(moduleId) : undefined;

  const share = useCallback(async () => {
    if (!status) return;
    const url = moduleUrl(status.module.id, locale);
    try {
      await Share.share({
        message: t('path.module.shareMessage', { title: status.module.title, url }),
        url,
        title: status.module.title,
      });
    } catch {
      // Cancelled, or no share sheet on this platform.
    }
  }, [status, locale, t]);

  if (!status) {
    return (
      <View style={[styles.screen, styles.missing]}>
        <Stack.Screen options={{ title: '' }} />
        <Text style={styles.missingText}>{t('module.notFound')}</Text>
      </View>
    );
  }

  const { module, number, level, done, total, minutes, finished, nextLesson } = status;
  const target = nextLesson ?? module.lessons[0];
  const cta = finished
    ? t('module.replay')
    : done === 0
      ? t('module.start')
      : t('module.continue', { title: nextLesson?.title ?? '' });

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: t('path.module', { number }),
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('path.module.shareA11y', { title: module.title })}
              hitSlop={10}
              onPress={() => void share()}
            >
              <SymbolView
                // Decorative: the control around it carries the label.
                accessible={false}
                accessibilityElementsHidden
                name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                size={20}
                tintColor={palette.mintDark}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + FOOTER_SPACE },
        ]}
      >
        <View style={styles.head}>
          <Text style={styles.eyebrow}>
            {t('today.where', { level: t(`level.${level}`), number })}
          </Text>
          <Text maxFontSizeMultiplier={fontScale.title} style={styles.title}>{module.title}</Text>
          <Text style={styles.description}>{module.description}</Text>
        </View>

        <View style={styles.stats}>
          <SeasonalCardCorner />
          <ProgressRing
            progress={total ? done / total : 0}
            size={52}
            stroke={5}
            color={finished ? palette.gold : palette.mint}
          >
            <Text style={styles.ringText}>
              {done}/{total}
            </Text>
          </ProgressRing>
          <Text style={styles.statsText}>
            {t('module.stats', { count: total, minutes })}
          </Text>
        </View>

        {module.video ? (
          <LessonVideo
            url={module.video.url}
            title={module.title}
            minutes={module.video.minutes}
            source={module.video.source}
          />
        ) : null}

        <Text style={styles.sectionTitle}>{t('module.lessons')}</Text>
        <View>
          {module.lessons.map((lesson, index) => {
            const state: LessonState = isLessonComplete(lesson.id)
              ? 'done'
              : lesson.id === nextLesson?.id
                ? 'next'
                : 'upcoming';
            return (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                state={state}
                bestXp={progress[lesson.id]?.bestXp ?? 0}
                first={index === 0}
                last={index === module.lessons.length - 1}
                onPress={() => openLesson(lesson.id)}
              />
            );
          })}
        </View>
        <SeasonalFooter />
      </ScrollView>

      {target ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <ActionButton label={cta} onPress={() => openLesson(target.id)} tone="primary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg },
  missing: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  missingText: { ...typography.body, color: palette.inkMuted },

  head: { gap: spacing.sm },
  eyebrow: { ...typography.overline, color: palette.mintDark, textTransform: 'uppercase' },
  title: { ...typography.display, color: palette.ink },
  description: { ...typography.body, color: palette.inkMuted },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  ringText: { ...typography.caption, fontSize: 12, color: palette.ink, fontVariant: ['tabular-nums'] },
  statsText: { ...typography.bodyStrong, color: palette.ink, flex: 1 },

  sectionTitle: { ...typography.heading, color: palette.ink, marginBottom: -spacing.sm },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.canvas,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
});
