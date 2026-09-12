/**
 * ============================================================================
 * The syllabus and the four-tier model, in the reader's language
 * ============================================================================
 *
 * Two different problems, solved two different ways.
 *
 * A track's `title` is the module's title. It was restated here, which is the
 * same duplication `lessonCount` was already fixed for — and the comment
 * explaining that fix applies word for word to the text: a number that goes
 * stale the moment a lesson ships is no worse than a title that goes stale the
 * moment a module is renamed. The title is now read from the content registry,
 * which means it is also translated already, for free, by the course
 * catalogue.
 *
 * `promise` and `concepts` are not duplicates. A promise says what a learner
 * will be able to *do*, where the module description says what the module
 * covers; the concepts are the instruments named as chips. Both are genuine
 * copy and are overlaid per locale, keyed by track id.
 *
 * The tiers are overlaid the same way. Their asset and liability lines are the
 * model's vocabulary — "Banknotes in circulation", "Reverse repos" — and a
 * Portuguese reader meeting them in English on the page that introduces the
 * hierarchy is exactly the reader this was written for.
 */

import { MODULES } from '@openmacro/core/content';
import { localisedModules } from '@openmacro/core/i18n/content';
import type { Locale } from '@openmacro/core/i18n/locales';

import { SYLLABUS, TIERS, type Tier, type Track } from '@/lib/curriculum';
import { CURRICULUM_PT } from '@/lib/curriculum-pt';

export interface TrackCopy {
  promise?: string;
  concepts?: string[];
}

export interface TierCopy {
  name?: string;
  subject?: string;
  premise?: string;
  assets?: string[];
  liabilities?: string[];
  levers?: string[];
}

export interface CurriculumOverlay {
  tracks: Record<string, TrackCopy>;
  tiers: Record<string, TierCopy>;
}

const OVERLAYS: Partial<Record<Locale, CurriculumOverlay>> = {
  'pt-PT': CURRICULUM_PT,
};

export function localisedSyllabus(locale: Locale): Track[] {
  const overlay = OVERLAYS[locale]?.tracks;
  const modules = locale === 'en' ? MODULES : localisedModules(locale);
  return SYLLABUS.map((track) => {
    const copy = overlay?.[track.id];
    return {
      ...track,
      // From the registry, never restated: one source for the name of a module.
      title: modules.find((module) => module.id === track.id)?.title ?? track.title,
      promise: copy?.promise ?? track.promise,
      concepts: copy?.concepts ?? track.concepts,
    };
  });
}

export function localisedTiers(locale: Locale): Tier[] {
  const overlay = OVERLAYS[locale]?.tiers;
  if (!overlay) return TIERS;
  return TIERS.map((tier) => {
    const copy = overlay[tier.id];
    if (!copy) return tier;
    return {
      ...tier,
      name: copy.name ?? tier.name,
      subject: copy.subject ?? tier.subject,
      premise: copy.premise ?? tier.premise,
      assets: copy.assets ?? tier.assets,
      liabilities: copy.liabilities ?? tier.liabilities,
      levers: copy.levers ?? tier.levers,
    };
  });
}
