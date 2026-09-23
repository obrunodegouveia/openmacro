/**
 * ============================================================================
 * The review queue, for the screens that show it
 * ============================================================================
 *
 * Loads the stored schedule, works out what is due, and resolves each due item
 * back to the challenge it refers to in the language the learner is reading.
 *
 * The resolution step is the one with a trap in it. Review items are stored by
 * `lessonId#challengeId` and nothing else — no text, no options, no answer.
 * That is deliberate: content changes, a distractor gets rewritten, a whole
 * lesson is replaced, and a queue holding its own copy of the question would
 * quietly keep asking one the course no longer contains. Storing the reference
 * and resolving it late means the schedule survives an edit, and an item whose
 * challenge has genuinely gone is dropped rather than shown.
 */

import { useCallback, useEffect, useState } from 'react';

import { summarise, type ReviewItem, type ReviewSummary } from '@openmacro/core/progress/review';
import {
  resolveDue,
  reviewChallenges,
  type DueChallenge,
} from '@openmacro/core/progress/reviewSession';
import { useLocale } from '@/providers/LocaleProvider';
import { loadReviewItems } from '@/services/reviewStore';

export interface ReviewQueue {
  loading: boolean;
  items: readonly ReviewItem[];
  due: readonly DueChallenge[];
  summary: ReviewSummary | null;
  /** Re-read the store — call after finishing a session. */
  refresh: () => Promise<void>;
}

export function useReview(limit = 20): ReviewQueue {
  const { lessonById } = useLocale();
  const [items, setItems] = useState<readonly ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setItems(await loadReviewItems());
    } catch {
      // A schedule that cannot be read is an empty queue, never a crash.
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const due = resolveDue(items, lessonById, { limit });

  return {
    loading,
    items,
    due,
    summary: items.length > 0 ? summarise(items) : null,
    refresh,
  };
}

export { reviewChallenges, type DueChallenge };
