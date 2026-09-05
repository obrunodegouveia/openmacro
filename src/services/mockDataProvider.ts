/**
 * ============================================================================
 * Mock data provider
 * ============================================================================
 *
 * An in-memory implementation of `LearningDataProvider`: progress lives for
 * one app session and is gone on reload. It exists for two reasons —
 *
 *   1. as the reference implementation of the interface, small enough to read
 *      in one sitting before you write your own (see `EXPO_PUBLIC_DATA_PROVIDER`)
 *   2. as a clean-slate mode for demos, screenshots and tests, where starting
 *      from zero every launch is the point
 *
 * For real persistence the app uses `asyncStorageDataProvider`, which is the
 * default. Both share their domain logic with `progressRules.ts`, so the two
 * can never drift on what a completed lesson is worth.
 *
 * The artificial latency is deliberate: it keeps loading states honest during
 * development, where a synchronous provider would let them rot unnoticed.
 */

import {
  applyLessonResult,
  localDateKey,
  seedSnapshot,
  type ProgressSnapshot,
} from '@openmacro/core/progress/rules';
import type { LearningDataProvider, LessonResult } from '@openmacro/core/progress/types';

/** Simulated round-trip, in ms. Set to 0 to make the UI feel instant. */
const LATENCY_MS = 180;

function delay<T>(value: T): Promise<T> {
  if (LATENCY_MS <= 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

let state: ProgressSnapshot = seedSnapshot();

export const mockDataProvider: LearningDataProvider = {
  async getProfile() {
    return delay({ ...state.profile });
  },

  async getAllProgress() {
    return delay({ ...state.progress });
  },

  async recordLessonResult(result: LessonResult) {
    state = applyLessonResult(state, result, localDateKey());
    return delay({ profile: { ...state.profile }, progress: { ...state.progress } });
  },

  async reset() {
    state = seedSnapshot();
    return delay(undefined);
  },
};
