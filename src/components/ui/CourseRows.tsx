/**
 * ============================================================================
 * Rows for the course: a module, a lesson
 * ============================================================================
 *
 * The old path drew every lesson as a 170-point card with the same weight
 * whether it was finished, next, or a month away, so a 25-lesson module was
 * eleven screens of identical boxes and "where am I?" had no visual answer.
 *
 * These rows are compact and say their state first:
 *
 *   ModuleRow  a progress ring around the module's number, the title, and
 *              "4/9 lessons · 72 min". The current module is marked.
 *   LessonRow  a timeline — a line runs down the left through a status dot
 *              (finished ✓, up next, not started) so the module reads as a
 *              path with a visible "you are here", not as a pile of cards.
 *
 * Both are plain Pressables with full accessibility labels, because the
 * visual state (a filled dot, a ring) means nothing to VoiceOver on its own.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ProgressRing } from '@/components/ui/ProgressRing';
import type { ModuleStatus } from '@/hooks/useCourse';
import { useLocale } from '@/providers/LocaleProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson } from '@openmacro/core/content/schema';

// ---------------------------------------------------------------------------

export function ModuleRow({
  status,
  current,
  onPress,
}: {
  status: ModuleStatus;
  current: boolean;
  onPress: () => void;
}) {
  const { t } = useLocale();
  const { module, number, done, total, minutes, finished } = status;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('course.moduleA11y', { number, title: module.title, done, total })}
      onPress={onPress}
      style={({ pressed }) => [
        styles.moduleRow,
        current && styles.moduleRowCurrent,
        pressed && styles.pressed,
      ]}
    >
      <ProgressRing
        progress={total ? done / total : 0}
        color={finished ? palette.gold : palette.mint}
      >
        {finished ? (
          <SymbolView
            // Decorative: the control around it carries the label.
            accessible={false}
            accessibilityElementsHidden
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={16}
            tintColor={palette.goldDark}
            weight="bold"
          />
        ) : (
          <Text style={styles.moduleNumber}>{number}</Text>
        )}
      </ProgressRing>

      <View style={styles.moduleBody}>
        {current ? <Text style={styles.currentTag}>{t('course.current')}</Text> : null}
        <Text style={styles.moduleTitle} numberOfLines={2}>
          {module.title}
        </Text>
        <Text style={styles.moduleMeta}>{t('course.moduleMeta', { done, total, minutes })}</Text>
      </View>

      <Chevron />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

export type LessonState = 'done' | 'next' | 'upcoming';

export function LessonRow({
  lesson,
  state,
  bestXp,
  first,
  last,
  onPress,
}: {
  lesson: Lesson;
  state: LessonState;
  bestXp: number;
  first: boolean;
  last: boolean;
  onPress: () => void;
}) {
  const { t } = useLocale();
  const status = t(`lesson.status.${state}`);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}. ${status}.`}
      accessibilityHint={lesson.subtitle}
      onPress={onPress}
      style={({ pressed }) => [styles.lessonRow, pressed && styles.pressed]}
    >
      {/* The timeline: a line through every row, broken at both ends. */}
      <View style={styles.rail}>
        <View style={[styles.railLine, first && styles.railHidden]} />
        <View
          style={[
            styles.dot,
            state === 'done' && styles.dotDone,
            state === 'next' && styles.dotNext,
          ]}
        >
          {state === 'done' ? (
            <SymbolView
              // Decorative: the control around it carries the label.
              accessible={false}
              accessibilityElementsHidden
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={13}
              tintColor={palette.surface}
              weight="heavy"
            />
          ) : (
            <Text style={styles.dotIcon}>{lesson.icon}</Text>
          )}
        </View>
        <View style={[styles.railLine, last && styles.railHidden]} />
      </View>

      <View style={[styles.lessonCard, state === 'next' && styles.lessonCardNext]}>
        {state === 'next' ? <Text style={styles.nextTag}>{status}</Text> : null}
        <Text style={styles.lessonTitle} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text style={styles.lessonMeta} numberOfLines={1}>
          {t('path.lesson.minutes', { count: lesson.estimatedMinutes })}
          {' · '}
          {t('path.lesson.steps', { count: lesson.challenges.length })}
          {state === 'done' && bestXp > 0 ? ` · ${t('path.lesson.best', { count: bestXp })}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

export function Chevron() {
  return (
    <SymbolView
      // Decorative: the control around it carries the label.
      accessible={false}
      accessibilityElementsHidden
      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
      size={14}
      tintColor={palette.inkFaint}
      weight="semibold"
    />
  );
}

const DOT = 36;

const styles = StyleSheet.create({
  pressed: { opacity: 0.6 },

  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  moduleRowCurrent: {
    borderColor: palette.mint,
    borderWidth: 2,
    backgroundColor: palette.mintSoft,
  },
  moduleNumber: {
    ...typography.caption,
    fontSize: 14,
    color: palette.ink,
    fontVariant: ['tabular-nums'],
  },
  moduleBody: { flex: 1, gap: 2 },
  currentTag: {
    ...typography.overline,
    fontSize: 10,
    color: palette.mintDark,
    textTransform: 'uppercase',
  },
  moduleTitle: { ...typography.bodyStrong, color: palette.ink },
  moduleMeta: { ...typography.caption, color: palette.inkMuted, fontVariant: ['tabular-nums'] },

  lessonRow: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.md },
  rail: { width: DOT, alignItems: 'center' },
  railLine: { flex: 1, width: 2, backgroundColor: palette.border },
  railHidden: { backgroundColor: 'transparent' },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
  },
  dotDone: { backgroundColor: palette.mint, borderColor: palette.mint },
  dotNext: { borderColor: palette.mint, borderWidth: 3 },
  dotIcon: { fontSize: 16 },
  lessonCard: {
    flex: 1,
    marginVertical: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 2,
  },
  lessonCardNext: { borderColor: palette.mint, borderWidth: 2 },
  nextTag: {
    ...typography.overline,
    fontSize: 10,
    color: palette.mintDark,
    textTransform: 'uppercase',
  },
  lessonTitle: { ...typography.bodyStrong, color: palette.ink },
  lessonMeta: { ...typography.caption, color: palette.inkMuted },
});
