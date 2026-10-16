/**
 * Course — the map of everything.
 *
 * Replaces the nested accordions that used to be the Home tab. Three changes
 * do most of the work:
 *
 *   1. LEVELS ARE A SWITCH, NOT SECTIONS. Beginner | Intermediate | Advanced
 *      sits at the top and stays there while the list scrolls, so reaching
 *      Advanced is one tap instead of scrolling past every Beginner lesson.
 *      It opens on the learner's current level.
 *   2. A MODULE IS A ROW, NOT AN ACCORDION. Number in a progress ring, title,
 *      "4/9 lessons · 72 min". Tapping it opens the module's own page, with a
 *      native back swipe, rather than unfolding 25 lesson cards in place.
 *      Advanced's 22 modules now fit in about three screens.
 *   3. SEARCH. Modules and lessons, by title and description, accent- and
 *      case-insensitive — "cambio" finds "Câmbio". Typing replaces the list
 *      with results; clearing it brings the map back where it was.
 */

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { Chevron, ModuleRow } from '@/components/ui/CourseRows';
import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { TopScrim } from '@/components/ui/TopScrim';
import { emitFeedback } from '@/feedback';
import { useCourse, type ModuleStatus } from '@/hooks/useCourse';
import { openLesson, openModule } from '@/navigation/routes';
import { useLocale } from '@/providers/LocaleProvider';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';
import type { Lesson, ModuleLevel } from '@openmacro/core/content/schema';

/** Lower-case, without accents, so Portuguese matches however it is typed. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function CourseScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  const { groups, statuses, statusOf, currentLevel, next } = useCourse();

  const [picked, setPicked] = useState<ModuleLevel | null>(null);
  const level = picked ?? currentLevel ?? groups[0]?.level;
  const group = groups.find((entry) => entry.level === level);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (q.length < 2) return null;
    const modules = statuses.filter((status) =>
      fold(`${status.module.title} ${status.module.description}`).includes(q),
    );
    const lessons: { lesson: Lesson; status: ModuleStatus }[] = [];
    for (const status of statuses) {
      for (const lesson of status.module.lessons) {
        if (fold(`${lesson.title} ${lesson.subtitle}`).includes(q)) lessons.push({ lesson, status });
      }
    }
    return { modules, lessons: lessons.slice(0, 40) };
  }, [query, statuses]);

  const levelStatuses = group
    ? group.modules.map((module) => statusOf(module.id)).filter((s): s is ModuleStatus => !!s)
    : [];
  const levelDone = levelStatuses.filter((status) => status.finished).length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
        ]}
        scrollIndicatorInsets={{ bottom: TAB_BAR_SPACE }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // The title scrolls away; search and the level switch stay.
        stickyHeaderIndices={[1]}
      >
        <Text maxFontSizeMultiplier={fontScale.title} style={styles.title}>{t('course.title')}</Text>

        <View style={styles.sticky}>
          <View style={styles.search}>
            <SymbolView
              // Decorative: the control around it carries the label.
              accessible={false}
              accessibilityElementsHidden
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              size={16}
              tintColor={palette.inkMuted}
            />
            <TextInput
              maxFontSizeMultiplier={fontScale.chrome}
              value={query}
              onChangeText={setQuery}
              placeholder={t('course.search')}
              placeholderTextColor={palette.inkFaint}
              style={styles.searchInput}
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="never"
              accessibilityLabel={t('course.search')}
            />
            {query ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('course.searchClear')}
                hitSlop={10}
                onPress={() => setQuery('')}
              >
                <SymbolView
                  // Decorative: the control around it carries the label.
                  accessible={false}
                  accessibilityElementsHidden
                  name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
                  size={18}
                  tintColor={palette.inkFaint}
                />
              </Pressable>
            ) : null}
          </View>

          {results ? null : (
            <View style={styles.segments} accessibilityRole="tablist">
              {groups.map((entry) => {
                const selected = entry.level === level;
                return (
                  <Pressable
                    key={entry.level}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      if (!selected) emitFeedback('select');
                      setPicked(entry.level);
                    }}
                    style={[styles.segment, selected && styles.segmentSelected]}
                  >
                    <Text
                      maxFontSizeMultiplier={fontScale.chrome}
                      style={[styles.segmentText, selected && styles.segmentTextSelected]}
                    >
                      {t(`level.${entry.level}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {results ? (
          <SearchResults query={query.trim()} results={results} />
        ) : group ? (
          <View style={styles.list}>
            <View style={styles.levelIntro}>
              <Text style={styles.levelBlurb}>{t(`level.${group.level}.blurb`)}</Text>
              <Text style={styles.levelUnlocks}>{t(`level.${group.level}.unlocks`)}</Text>
              <Text style={styles.levelProgress}>
                {t('course.levelProgress', { done: levelDone, total: levelStatuses.length })}
              </Text>
            </View>
            {levelStatuses.map((status) => (
              <ModuleRow
                key={status.module.id}
                status={status}
                current={next?.status.module.id === status.module.id}
                onPress={() => openModule(status.module.id)}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
      <TopScrim />
    </View>
  );
}

function SearchResults({
  query,
  results,
}: {
  query: string;
  results: { modules: ModuleStatus[]; lessons: { lesson: Lesson; status: ModuleStatus }[] };
}) {
  const { t } = useLocale();
  const { next } = useCourse();

  if (results.modules.length === 0 && results.lessons.length === 0) {
    return <Text style={styles.empty}>{t('course.noResults', { query })}</Text>;
  }

  return (
    <View style={styles.list}>
      {results.modules.length > 0 ? (
        <Text style={styles.resultsHeading}>{t('course.results.modules')}</Text>
      ) : null}
      {results.modules.map((status) => (
        <ModuleRow
          key={status.module.id}
          status={status}
          current={next?.status.module.id === status.module.id}
          onPress={() => openModule(status.module.id)}
        />
      ))}
      {results.lessons.length > 0 ? (
        <Text style={styles.resultsHeading}>{t('course.results.lessons')}</Text>
      ) : null}
      {results.lessons.map(({ lesson, status }) => (
        <Pressable
          key={lesson.id}
          accessibilityRole="button"
          accessibilityLabel={t('path.lesson.open', { title: lesson.title })}
          onPress={() => openLesson(lesson.id)}
          style={({ pressed }) => [styles.lessonResult, pressed && styles.pressed]}
        >
          <Text style={styles.lessonResultIcon}>{lesson.icon}</Text>
          <View style={styles.lessonResultBody}>
            <Text style={styles.lessonResultTitle} numberOfLines={2}>
              {lesson.title}
            </Text>
            <Text style={styles.lessonResultModule} numberOfLines={1}>
              {t('path.module', { number: status.number })} · {status.module.title}
            </Text>
          </View>
          <Chevron />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  pressed: { opacity: 0.6 },
  title: { ...typography.display, color: palette.ink, paddingHorizontal: spacing.xs },

  sticky: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    // Opaque, so rows scrolling underneath do not show through.
    backgroundColor: palette.canvas,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: { flex: 1, ...typography.body, color: palette.ink, paddingVertical: 0 },
  segments: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: radius.md,
    backgroundColor: palette.border,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  segmentSelected: {
    backgroundColor: palette.surface,
    shadowColor: palette.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: { ...typography.caption, color: palette.inkMuted },
  segmentTextSelected: { color: palette.ink },

  list: { gap: spacing.sm },
  levelIntro: { gap: spacing.xs, paddingHorizontal: spacing.xs, marginBottom: spacing.sm },
  levelBlurb: { ...typography.bodyStrong, color: palette.ink },
  levelUnlocks: { ...typography.caption, color: palette.inkMuted, fontWeight: '500' },
  levelProgress: { ...typography.caption, color: palette.mintDark },

  resultsHeading: {
    ...typography.overline,
    color: palette.inkMuted,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  empty: { ...typography.body, color: palette.inkMuted, textAlign: 'center', marginTop: spacing.xxl },
  lessonResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  lessonResultIcon: { fontSize: 22 },
  lessonResultBody: { flex: 1, gap: 2 },
  lessonResultTitle: { ...typography.bodyStrong, color: palette.ink },
  lessonResultModule: { ...typography.caption, color: palette.inkMuted },
});
