/**
 * The exam a teacher has assigned to the signed-in learner, if any.
 *
 * Read under row-level security, so it can only ever return this learner's own
 * row. A failed read shows no exam and is asked again the next time the screen
 * is focused: a learner who has no exam should never see an error about one.
 *
 * The bounty exam comes back in the app's language (`assignedExamFromRow`).
 */

import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  ASSIGNED_EXAM_COLUMNS,
  assignedExamFromRow,
  type AssignedExam,
} from '@openmacro/core/engine/assignedExam';
import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { supabase } from '@/services/supabaseClient';

type ExamRow = Parameters<typeof assignedExamFromRow>[0];

export function useAssignedExam(): { exam: AssignedExam | null; loading: boolean } {
  const { session } = useAuth();
  const { locale, t } = useLocale();
  const userId = session?.user.id ?? null;
  const [found, setFound] = useState<{ userId: string | null; row: ExamRow | null } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let live = true;
      void (async () => {
        let row: ExamRow | null = null;
        if (supabase && userId) {
          const { data } = await supabase
            .from('assigned_exams')
            .select(ASSIGNED_EXAM_COLUMNS)
            .is('submitted_at', null)
            .order('assigned_at', { ascending: true })
            .limit(1)
            .maybeSingle();
          row = data ?? null;
        }
        if (live) setFound({ userId, row });
      })().catch(() => {
        if (live) setFound({ userId, row: null });
      });
      return () => {
        live = false;
      };
    }, [userId]),
  );

  const current = found?.userId === userId ? found : null;
  const row = current?.row ?? null;
  const exam = useMemo(() => (row ? assignedExamFromRow(row, { locale, t }) : null), [row, locale, t]);
  return { exam, loading: current === null };
}
