/**
 * The exam a teacher has assigned to the signed-in learner, if any.
 *
 * Read under row-level security, so it can only ever return this learner's own
 * row. A failed read shows no exam and is asked again the next time the screen
 * is focused: a learner who has no exam should never see an error about one.
 */

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  ASSIGNED_EXAM_COLUMNS,
  assignedExamFromRow,
  type AssignedExam,
} from '@openmacro/core/engine/assignedExam';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/services/supabaseClient';

export function useAssignedExam(): { exam: AssignedExam | null; loading: boolean } {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const [found, setFound] = useState<{ userId: string | null; exam: AssignedExam | null } | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      let live = true;
      void (async () => {
        let exam: AssignedExam | null = null;
        if (supabase && userId) {
          const { data } = await supabase
            .from('assigned_exams')
            .select(ASSIGNED_EXAM_COLUMNS)
            .is('submitted_at', null)
            .order('assigned_at', { ascending: true })
            .limit(1)
            .maybeSingle();
          exam = data ? assignedExamFromRow(data) : null;
        }
        if (live) setFound({ userId, exam });
      })().catch(() => {
        if (live) setFound({ userId, exam: null });
      });
      return () => {
        live = false;
      };
    }, [userId]),
  );

  const current = found?.userId === userId ? found : null;
  return { exam: current?.exam ?? null, loading: current === null };
}
