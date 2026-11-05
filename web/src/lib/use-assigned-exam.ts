"use client";

import * as React from "react";
import {
  ASSIGNED_EXAM_COLUMNS,
  assignedExamFromRow,
  type AssignedExam,
} from "@openmacro/core/engine/assignedExam";

import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";

/**
 * The exam a teacher has assigned to the signed-in learner, if any.
 *
 * Read under row-level security, so it can only ever return this learner's own
 * row. A failed read shows no exam: a learner who has no exam should never see
 * an error about one.
 */
export function useAssignedExam(): { exam: AssignedExam | null; loading: boolean } {
  const { learner, loading: restoring } = useAuth();
  const userId = learner?.id ?? null;
  const [found, setFound] = React.useState<{ userId: string; exam: AssignedExam | null } | null>(
    null,
  );

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !userId) return;
    let live = true;
    void (async () => {
      const { data } = await supabase
        .from("assigned_exams")
        .select(ASSIGNED_EXAM_COLUMNS)
        .is("submitted_at", null)
        .order("assigned_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (live) setFound({ userId, exam: data ? assignedExamFromRow(data) : null });
    })().catch(() => {
      if (live) setFound({ userId, exam: null });
    });
    return () => {
      live = false;
    };
  }, [userId]);

  if (restoring) return { exam: null, loading: true };
  if (!userId) return { exam: null, loading: false };
  const current = found?.userId === userId ? found : null;
  return { exam: current?.exam ?? null, loading: current === null };
}
