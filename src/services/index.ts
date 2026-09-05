/**
 * Local store selection.
 *
 * `EXPO_PUBLIC_DATA_PROVIDER` picks where progress lives on this device while
 * the learner is signed out. Cloud sync is a separate axis handled by
 * `ProgressProvider`: when Supabase is configured and someone is signed in, it
 * switches to `supabaseDataProvider` and merges this local store into their
 * account once.
 *
 * CONTRIBUTORS: register new local stores here.
 */

import { env } from '@/config/env';
import { asyncStorageDataProvider } from '@/services/asyncStorageDataProvider';
import { mockDataProvider } from '@/services/mockDataProvider';
import type { LearningDataProvider } from '@openmacro/core/progress/types';

const PROVIDERS: Record<typeof env.dataProvider, LearningDataProvider> = {
  local: asyncStorageDataProvider,
  mock: mockDataProvider,
};

/** The signed-out, on-device store. */
export const localDataProvider: LearningDataProvider = PROVIDERS[env.dataProvider];

/** @deprecated Prefer `localDataProvider`; kept so older imports keep working. */
export const dataProvider = localDataProvider;

export type {
  LearnerProfile,
  LearningDataProvider,
  LessonProgress,
  LessonResult,
} from '@openmacro/core/progress/types';
