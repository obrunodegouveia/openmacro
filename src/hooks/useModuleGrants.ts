/**
 * The private modules the signed-in learner has been granted.
 *
 * Read under row-level security, so it can only return this learner's own
 * grants. The last answer is kept on the device per learner, so a granted
 * module stays on the path offline instead of vanishing with the signal. A
 * signed-out learner has no grants, whatever was stored.
 *
 * The website's twin is `web/src/lib/use-module-grants.ts`.
 */

import { useEffect, useState } from 'react';

import { MODULE_GRANT_COLUMNS, unlockedFromRows } from '@openmacro/core/content/private';
import { useAuth } from '@/providers/AuthProvider';
import { readVersioned, writeVersioned } from '@/services/localStore';
import { supabase } from '@/services/supabaseClient';

const STORAGE_VERSION = 1;
const storageKey = (userId: string) => `openmacro.moduleGrants.${userId}.v1`;

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

const NONE: readonly string[] = [];

export function useModuleGrants(): readonly string[] {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const [found, setFound] = useState<{ userId: string; unlocked: readonly string[] } | null>(null);

  useEffect(() => {
    if (!userId) return;
    let live = true;
    void (async () => {
      const stored = await readVersioned(storageKey(userId), STORAGE_VERSION, isStringList);
      if (live && stored) setFound({ userId, unlocked: unlockedFromRows(stored.map((id) => ({ module_id: id }))) });
      if (!supabase) return;
      const { data, error } = await supabase.from('module_grants').select(MODULE_GRANT_COLUMNS);
      // A failed read keeps whatever was stored: offline is not a revocation.
      if (error) return;
      const unlocked = unlockedFromRows(data);
      if (live) setFound({ userId, unlocked });
      await writeVersioned(storageKey(userId), STORAGE_VERSION, unlocked);
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [userId]);

  return userId && found?.userId === userId ? found.unlocked : NONE;
}
