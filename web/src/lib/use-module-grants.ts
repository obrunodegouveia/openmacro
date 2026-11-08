"use client";

import * as React from "react";
import { MODULE_GRANT_COLUMNS, unlockedFromRows } from "@openmacro/core/content/optional";

import { useAuth } from "@/components/site/auth-provider";
import { getSupabase } from "@/lib/supabase";

const NONE: readonly string[] = [];

/**
 * The private modules the signed-in learner has been granted.
 *
 * Read under row-level security, so it can only return this learner's own
 * grants. A failed read grants nothing. The app's twin is
 * `src/hooks/useModuleGrants.ts`.
 */
export function useModuleGrants(): { unlocked: readonly string[]; loading: boolean } {
  const { learner, loading: restoring } = useAuth();
  const userId = learner?.id ?? null;
  const [found, setFound] = React.useState<{ userId: string; unlocked: readonly string[] } | null>(
    null,
  );

  React.useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !userId) return;
    let live = true;
    void (async () => {
      const { data, error } = await supabase.from("module_grants").select(MODULE_GRANT_COLUMNS);
      if (live) setFound({ userId, unlocked: error ? NONE : unlockedFromRows(data) });
    })().catch(() => {
      if (live) setFound({ userId, unlocked: NONE });
    });
    return () => {
      live = false;
    };
  }, [userId]);

  if (restoring) return { unlocked: NONE, loading: true };
  if (!userId || !getSupabase()) return { unlocked: NONE, loading: false };
  const current = found?.userId === userId ? found : null;
  return { unlocked: current?.unlocked ?? NONE, loading: current === null };
}
