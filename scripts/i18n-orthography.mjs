/**
 * ============================================================================
 * Per-language spelling conventions
 * ============================================================================
 *
 * Warnings, never rejections. A translation that trips one of these is
 * readable and correct-ish; it is just inconsistent with what the rest of the
 * language's catalogue has settled on, and inconsistency across 4,000 strings
 * is what makes a translation feel machine-made.
 *
 * This exists because the same mistake happened twice in a row while writing
 * the Portuguese: module 0 was written in post-1990 orthography, and module 1
 * drifted back to `directa`, `exactamente`, `adoptada` — 24 of them — purely
 * because the convention lived in a docblock rather than in a check. A rule a
 * person has to remember across a week of writing is not a rule.
 */

/**
 * European Portuguese, 1990 Orthographic Agreement — the law in Portugal
 * since 2009, and what schools, the state and the press use.
 *
 * Silent consonants go. The trap is the words where European Portuguese still
 * *pronounces* the consonant and therefore keeps it: `facto`, `contacto`,
 * `convicção`, `pacto`, `compacto`, `intelecto`. Those are listed as
 * exceptions rather than left to a regex, because a find-and-replace over
 * `ct` mangles every one of them.
 */
const PT_PT_KEEPS = new Set([
  'facto',
  'factos',
  'contacto',
  'contactos',
  'contactar',
  'contactando',
  'convicção',
  'convicções',
  'pacto',
  'pactos',
  'compacto',
  'compacta',
  'intelecto',
  'carácter',
  'caracteres',
  'ficção',
  'ficções',
  'fricção',
  'sucção',
  'adepto',
  'apto',
  'inepto',
  'rapto',
  'erupção',
  'corrupção',
  'interrupção',
  'opção',
  'opções',
]);

/**
 * The clusters the reform drops, when not in the exception list.
 *
 * The consonant must be followed by a vowel — that is the whole shape of the
 * rule (`activo`, `directa`, `adopção`, `óptimo`). Without that constraint the
 * pattern also matches every word ending in the cluster, which is how
 * "TypeScript" got reported as a Portuguese spelling error.
 */
const PT_PT_PATTERN = /\b[A-Za-zÀ-ÿ]*(?:ct|cç|pt|pç)[aeiouáéíóúâêôãõ][A-Za-zÀ-ÿ]*\b/gi;

export const CONVENTIONS = {
  'pt-PT': {
    name: '1990 Orthographic Agreement',
    /**
     * @param {string} value the translation
     * @param {string} [source] the English it was translated from
     * @returns {string[]} words that look pre-reform
     *
     * A word that also appears in the English source is skipped: it is a term
     * carried across rather than a spelling decision, and flagging
     * "TypeScript" as a Portuguese error trains people to ignore the warning.
     */
    check(value, source = '') {
      const carried = new Set(source.toLowerCase().match(/[a-zà-ÿ]+/g) ?? []);
      const found = [];
      for (const match of value.matchAll(PT_PT_PATTERN)) {
        const word = match[0];
        const lower = word.toLowerCase();
        if (!PT_PT_KEEPS.has(lower) && !carried.has(lower)) found.push(word);
      }
      return found;
    },
    hint: 'post-1990 spelling drops the silent consonant (ativo, objetivo, diretamente, exatamente); facto, contacto and convicção keep theirs',
  },
};

/** Every convention warning for one locale's translations. */
export function conventionWarnings(locale, units) {
  const convention = CONVENTIONS[locale];
  if (!convention) return [];
  const warnings = [];
  for (const [scope, entries] of Object.entries(units)) {
    for (const [key, { target, source }] of Object.entries(entries)) {
      const found = convention.check(target, source ?? '');
      if (found.length) warnings.push({ scope, key, words: [...new Set(found)] });
    }
  }
  return warnings;
}
