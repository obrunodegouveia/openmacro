/**
 * Keeps the home-screen widget current, without rendering anything.
 *
 * The widget runs in its own process and cannot read the app's state, so the
 * app hands it a finished snapshot: the streak, the next lesson and every
 * string already in the learner's language. It is rebuilt whenever any of
 * those change, which covers finishing a lesson and switching language.
 *
 * Derived from `useCourse`, the same source as Today, so the widget never
 * disagrees with the screen it opens.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useCourse } from '@/hooks/useCourse';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import StreakWidget from '@/widgets/StreakWidget';

export function WidgetSync(): null {
  const { profile } = useProgress();
  const { t, locale } = useLocale();
  const { next } = useCourse();

  const streak = profile?.dayStreak ?? 0;
  const keptToday = profile?.streakActiveToday ?? false;
  const lessonId = next?.lesson.id;
  const lessonTitle = next?.lesson.title;
  const moduleNumber = next?.status.number;
  const done = next?.status.done;
  const total = next?.status.total;

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    try {
      StreakWidget.updateSnapshot({
        streak,
        keptToday,
        streakLabel: t('widget.streak', { count: streak }),
        nextLabel: lessonTitle ? t('widget.next') : t('widget.allDoneTitle'),
        lessonTitle: lessonTitle ?? t('widget.allDone'),
        detail:
          moduleNumber !== undefined
            ? t('widget.detail', { number: moduleNumber, done: done ?? 0, total: total ?? 0 })
            : '',
        url: lessonId ? `openmacro://lesson/${lessonId}` : 'openmacro://',
      });
    } catch {
      // No widget extension in this build, or none placed: nothing to update.
    }
  }, [streak, keptToday, lessonId, lessonTitle, moduleNumber, done, total, locale, t]);

  return null;
}
