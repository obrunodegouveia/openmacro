/**
 * ============================================================================
 * The glossary, in the reader's language
 * ============================================================================
 *
 * An overlay keyed by slug, not a catalogue of keys. Each entry is a small
 * document — a definition, three paragraphs, a mechanism stated as balance
 * sheet movements, the misreading it carries — and splitting one into a dozen
 * scattered keys would make it impossible to translate or review as the single
 * argument it is. The course content is overlaid the same way and for the same
 * reason.
 *
 * Fallback is per field, so a half-translated entry shows Portuguese where it
 * has it and English where it does not, rather than reverting wholesale.
 *
 * WHAT IS DELIBERATELY NOT TRANSLATED. `slug` is a published URL and never
 * changes. `related` is a list of slugs. `sources` are the titles of specific
 * documents — "Bank of England — Money creation in the modern economy" is the
 * name of a paper a reader may go and find, and translating it would make it
 * unfindable.
 */

import type { GlossaryEntry } from '@/lib/glossary';
import { GLOSSARY } from '@/lib/glossary';
import type { Locale } from '@openmacro/core/i18n/locales';

import { GLOSSARY_PT } from '@/lib/glossary-pt';

/** The fields that carry prose. Everything else identifies or cites. */
export type TranslatableEntry = Partial<
  Pick<GlossaryEntry, 'term' | 'aliases' | 'definition' | 'explanation' | 'misreading'>
> & {
  /** Same length and order as the English `mechanics`. */
  mechanics?: { label: string; detail: string }[];
};

const OVERLAYS: Partial<Record<Locale, Record<string, TranslatableEntry>>> = {
  'pt-PT': GLOSSARY_PT,
};

function merge(entry: GlossaryEntry, overlay: TranslatableEntry | undefined): GlossaryEntry {
  if (!overlay) return entry;
  return {
    ...entry,
    term: overlay.term ?? entry.term,
    aliases: overlay.aliases ?? entry.aliases,
    definition: overlay.definition ?? entry.definition,
    explanation: overlay.explanation ?? entry.explanation,
    misreading: overlay.misreading ?? entry.misreading,
    // Positional: a translated mechanics list must line up with the English
    // one, because the entries are paired by index and nothing else.
    mechanics: overlay.mechanics ?? entry.mechanics,
  };
}

export function localisedGlossary(locale: Locale): GlossaryEntry[] {
  const overlay = OVERLAYS[locale];
  if (!overlay) return GLOSSARY;
  return GLOSSARY.map((entry) => merge(entry, overlay[entry.slug]));
}

export function localisedTerm(locale: Locale, slug: string): GlossaryEntry | undefined {
  const entry = GLOSSARY.find((candidate) => candidate.slug === slug);
  if (!entry) return undefined;
  return merge(entry, OVERLAYS[locale]?.[slug]);
}

/** 0..1 — how much of the glossary a locale actually carries. */
export function glossaryCoverage(locale: Locale): number {
  const overlay = OVERLAYS[locale];
  if (!overlay) return locale === 'en' ? 1 : 0;
  return GLOSSARY.filter((entry) => overlay[entry.slug]?.definition).length / GLOSSARY.length;
}
