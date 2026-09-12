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
 * This exists because the same mistake kept happening while writing the
 * Portuguese: module 0 was written in post-1990 orthography, and later modules
 * drifted straight back to `directa`, `exactamente`, `tecto` — dozens of them
 * — purely because the convention lived in a docblock rather than in a check.
 * A rule a person has to remember across a week of writing is not a rule.
 */

/**
 * European Portuguese, 1990 Orthographic Agreement — the law in Portugal
 * since 2009, and what schools, the state and the press use.
 *
 * ---------------------------------------------------------------------------
 * WHY A LIST OF CHANGED WORDS RATHER THAN A PATTERN PLUS EXCEPTIONS
 * ---------------------------------------------------------------------------
 *
 * The first version matched any `ct`/`pt`/`cç`/`pç` before a vowel and kept a
 * list of words that legitimately contain one. That is the wrong way round,
 * and it showed within two modules: it cleared `facto` and `contacto` because
 * they were listed, then flagged `expectativas`, `impacto` and `abrupta` — all
 * perfectly correct — because they were not. That exception list can never be
 * finished, because it is the set of every Portuguese word where the consonant
 * is pronounced.
 *
 * The set of stems the reform actually changed is finite and documented, so
 * that is what is listed here. The failure mode inverts with it: this now
 * misses a pre-reform spelling nobody thought to add, rather than crying wolf
 * on correct prose. That is the better failure by a wide margin — a warning
 * that is often wrong gets ignored, and the real ones get ignored with it.
 */
const PT_PT_REFORMED = [
  ['activ', 'ativ'], // activo, activa, actividade
  ['actu', 'atu'], // actual, actualmente, actualizar, actuar
  // `^` means the stem must start the word. Without it, `acto` matches inside
  // `facto`, `contacto`, `impacto` and `compacto` — four correct words — and
  // helpfully suggests `fato`, `contato`, `impato`, `compato`.
  ['^acto', 'ato'],
  ['^actor', 'ator'],
  ['adopç', 'adoç'],
  ['adopt', 'adot'],
  ['afect', 'afet'],
  ['arquitect', 'arquitet'],
  ['aspect', 'aspet'],
  ['baptiz', 'batiz'],
  ['colecç', 'coleç'],
  ['colect', 'colet'],
  ['concepç', 'conceç'],
  ['correcç', 'correç'],
  ['correct', 'corret'],
  ['decepç', 'deceç'],
  ['detect', 'detet'],
  ['direcç', 'direç'],
  ['direct', 'diret'],
  ['efect', 'efet'],
  ['electr', 'eletr'],
  ['exact', 'exat'],
  ['excepç', 'exceç'],
  ['except', 'excet'],
  ['factor', 'fator'], // `facto` itself keeps its c — it is pronounced
  ['inspecç', 'inspeç'],
  // `ject` covers projecto, objecto, trajecto, injectar in one stem. No
  // Portuguese word keeps a pronounced c there.
  ['ject', 'jet'],
  // `cç` after a or e always drops the c; after i or u it is pronounced and
  // stays, which is why convicção, ficção, fricção and sucção survive the
  // reform and acção, fracção, objecção and injecção do not.
  ['acç', 'aç'],
  ['ecç', 'eç'],
  ['objectiv', 'objetiv'],
  ['optim', 'otim'],
  ['percepç', 'perceç'],
  ['perspectiv', 'perspetiv'],
  ['protecç', 'proteç'],
  ['protect', 'protet'],
  ['recepç', 'receç'],
  ['reflect', 'reflet'],
  ['respectiv', 'respetiv'],
  ['secç', 'seç'],
  ['sector', 'setor'],
  ['selecç', 'seleç'],
  ['select', 'selet'],
  ['subjectiv', 'subjetiv'],
  ['tecto', 'teto'],
  ['tract', 'trat'], // atractivo, tracção
  ['transacç', 'transaç'],
];

const anchored = PT_PT_REFORMED.filter(([from]) => from.startsWith('^'));
const floating = PT_PT_REFORMED.filter(([from]) => !from.startsWith('^'));

const PT_PT_PATTERN = new RegExp(
  [
    `\\b(?:${anchored.map(([from]) => from.slice(1)).join('|')})[a-zà-ÿ]*\\b`,
    `\\b[a-zà-ÿ]*(?:${floating.map(([from]) => from).join('|')})[a-zà-ÿ]*\\b`,
  ].join('|'),
  'gi',
);

/** `activo` → `ativo`, `Directamente` → `Diretamente`. */
function suggest(word) {
  const lower = word.toLowerCase();
  for (const [from, to] of PT_PT_REFORMED) {
    if (from.startsWith('^')) {
      const stem = from.slice(1);
      if (lower.startsWith(stem)) return to + word.slice(stem.length);
      continue;
    }
    const at = lower.indexOf(from);
    if (at !== -1) return word.slice(0, at) + to + word.slice(at + from.length);
  }
  return word;
}

export const CONVENTIONS = {
  'pt-PT': {
    name: '1990 Orthographic Agreement',
    /**
     * @param {string} value the translation
     * @param {string} [source] the English it was translated from
     * @returns {{word: string, suggestion: string}[]}
     *
     * A word that also appears in the English source is skipped: it is a term
     * carried across rather than a spelling decision.
     */
    check(value, source = '') {
      const carried = new Set(source.toLowerCase().match(/[a-zà-ÿ]+/g) ?? []);
      const found = [];
      for (const match of value.matchAll(PT_PT_PATTERN)) {
        const word = match[0];
        if (carried.has(word.toLowerCase())) continue;
        const suggestion = suggest(word);
        if (suggestion !== word) found.push({ word, suggestion });
      }
      return found;
    },
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
      if (found.length) {
        const seen = new Map();
        for (const { word, suggestion } of found) seen.set(word, suggestion);
        warnings.push({
          scope,
          key,
          words: [...seen].map(([word, suggestion]) => `${word} → ${suggestion}`),
        });
      }
    }
  }
  return warnings;
}

/**
 * Apply every reform substitution to a string.
 *
 * Used by `npm run i18n:fixspelling`, which rewrites the translation files in
 * place. Separated from the check so that the thing reporting a problem and
 * the thing fixing it cannot disagree about what the problem is.
 */
export function applyConventions(locale, value, source = '') {
  const convention = CONVENTIONS[locale];
  if (!convention) return value;
  let out = value;
  for (const { word, suggestion } of convention.check(value, source)) {
    out = out.split(word).join(suggestion);
  }
  return out;
}
