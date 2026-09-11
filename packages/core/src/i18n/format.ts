/**
 * ============================================================================
 * ICU MessageFormat — the subset that matters
 * ============================================================================
 *
 * Why this exists rather than a plain `{name}` substitution: **plural rules
 * are not a formatting detail, they are the reason a translation layer is not
 * a `Map<string, string>`.**
 *
 * English and Portuguese both have two plural forms, so a naive
 * `${n} ${n === 1 ? 'step' : 'steps'}` survives both and looks fine — right up
 * until the fifth language. CLDR gives Polish four categories (one, few, many,
 * other), Arabic six, and Irish five. A translator for those languages cannot
 * express the sentence at all if the string is picked by a ternary in
 * TypeScript, and the usual result is a permanently slightly-wrong app.
 *
 * The syntax is standard ICU, so it is what every translator and every
 * translation-management tool already understands:
 *
 *   '{count, plural, one {# step} other {# steps}}'
 *   '{count, plural, =0 {no lessons} one {# lesson} other {# lessons}}'
 *   '{amount, number} XP'
 *
 * `#` is the number, formatted for the locale. Categories come from
 * `Intl.PluralRules`, so adding Polish is adding a catalogue — no code here
 * changes, and no code here knows what Polish is.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT A LIBRARY
 * ---------------------------------------------------------------------------
 *
 * `@formatjs/intl-messageformat` is the reference implementation and it is
 * good. It is also ~20 kB parsed, ships its own parser, and would be the
 * single heaviest dependency in `packages/core` — which is otherwise pure
 * data and pure functions and is imported by three consumers with three
 * different bundlers.
 *
 * What is implemented here is `plural`, `select` and `number`, which is every
 * construct the catalogues use. What is deliberately *not* implemented is
 * `selectordinal`, `date`, `time`, and skeleton arguments (`{n, number,
 * ::.00}`). If a catalogue ever needs one of those, the honest move is to
 * take the dependency rather than to grow this file — and `formatArgument`
 * below leaves unknown argument types as plain substitution rather than
 * throwing, so that day arrives as a cosmetic bug and not as a blank screen.
 */

/**
 * Hermes ships a partial `Intl`. `NumberFormat` has been there for a long
 * time; `PluralRules` has not always been, and a missing constructor at module
 * scope would be a crash before the first frame rather than a wrong plural.
 *
 * Probed once, then cached — constructing either of these is expensive enough
 * that doing it per render of a list of thirty lessons is measurable.
 */
const HAS_PLURAL_RULES = (() => {
  try {
    return typeof Intl !== 'undefined' && typeof Intl.PluralRules === 'function';
  } catch {
    return false;
  }
})();

const HAS_NUMBER_FORMAT = (() => {
  try {
    return typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function';
  } catch {
    return false;
  }
})();

const pluralRulesCache = new Map<string, Intl.PluralRules | null>();
const numberFormatCache = new Map<string, Intl.NumberFormat | null>();

function pluralRules(tag: string): Intl.PluralRules | null {
  if (!HAS_PLURAL_RULES) return null;
  if (!pluralRulesCache.has(tag)) {
    try {
      pluralRulesCache.set(tag, new Intl.PluralRules(tag));
    } catch {
      pluralRulesCache.set(tag, null);
    }
  }
  return pluralRulesCache.get(tag) ?? null;
}

function numberFormat(tag: string): Intl.NumberFormat | null {
  if (!HAS_NUMBER_FORMAT) return null;
  if (!numberFormatCache.has(tag)) {
    try {
      numberFormatCache.set(tag, new Intl.NumberFormat(tag));
    } catch {
      numberFormatCache.set(tag, null);
    }
  }
  return numberFormatCache.get(tag) ?? null;
}

function formatNumber(tag: string, value: number): string {
  return numberFormat(tag)?.format(value) ?? String(value);
}

/**
 * The plural category for a number.
 *
 * Falls back to English's rule when `Intl.PluralRules` is missing, which is
 * wrong for most of the world's languages and right for the two this app
 * ships — a deliberate choice to degrade rather than fail. The `select` on a
 * real `Intl` is the path that actually runs everywhere we ship.
 */
function pluralCategory(tag: string, value: number): string {
  return pluralRules(tag)?.select(value) ?? (value === 1 ? 'one' : 'other');
}

export type MessageValues = Readonly<Record<string, string | number>>;

/**
 * Every argument name a message refers to.
 *
 * Walks the message with the same balanced-brace logic `formatMessage` uses,
 * rather than with a regex, and that is the whole point: a regex that looks
 * for `{identifier` cannot tell an argument from a plural option body, so
 * `{count, plural, one {Falta # objetivo}}` reads as an argument called
 * "Falta". Sharing the traversal means the checker and the formatter cannot
 * disagree about what an argument is.
 *
 * Used by `validateCatalogue` to catch a translation that has invented a
 * placeholder name — the single most common thing to go wrong when messages
 * are edited outside the codebase.
 */
export function messageArguments(template: string): Set<string> {
  const names = new Set<string>();
  collectArguments(template, names);
  return names;
}

function collectArguments(template: string, into: Set<string>): void {
  let cursor = 0;
  while (cursor < template.length) {
    const open = template.indexOf('{', cursor);
    if (open === -1) return;
    const close = matchBrace(template, open);
    if (close === -1) return;

    const body = template.slice(open + 1, close);
    const comma = body.indexOf(',');
    const name = (comma === -1 ? body : body.slice(0, comma)).trim();

    // An argument name is a bare identifier. Anything else is an option body
    // that happens to start at a brace, and its own arguments are collected
    // by recursing rather than by matching it here.
    if (/^[A-Za-z_]\w*$/.test(name)) into.add(name);

    if (comma !== -1) {
      const rest = body.slice(comma + 1).trim();
      if (rest.startsWith('plural') || rest.startsWith('select')) {
        for (const option of Object.values(parseOptions(rest.slice(6).replace(/^\s*,/, '')))) {
          collectArguments(option, into);
        }
      }
    }

    cursor = close + 1;
  }
}

/** Index of the `}` closing the `{` at `open`, or -1 if unbalanced. */
function matchBrace(source: string, open: number): number {
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

/** `one {# step} other {# steps}` → `{ one: '# step', other: '# steps' }`. */
function parseOptions(source: string): Record<string, string> {
  const options: Record<string, string> = {};
  let index = 0;
  while (index < source.length) {
    while (index < source.length && /\s/.test(source[index] as string)) index += 1;
    const start = index;
    while (index < source.length && source[index] !== '{') index += 1;
    const key = source.slice(start, index).trim();
    if (!key || source[index] !== '{') break;
    const close = matchBrace(source, index);
    if (close === -1) break;
    options[key] = source.slice(index + 1, close);
    index = close + 1;
  }
  return options;
}

/**
 * Format one ICU message.
 *
 * An argument with no matching value is left on screen exactly as written —
 * `{name}` — rather than blanked. A missing name that reads `{name}` is a bug
 * report somebody files; a missing name that reads as nothing is a mystery
 * nobody notices until a user does.
 */
export function formatMessage(
  template: string,
  tag: string,
  values?: MessageValues,
): string {
  if (!template.includes('{')) return template;

  let out = '';
  let cursor = 0;

  while (cursor < template.length) {
    const open = template.indexOf('{', cursor);
    if (open === -1) {
      out += template.slice(cursor);
      break;
    }
    out += template.slice(cursor, open);

    const close = matchBrace(template, open);
    if (close === -1) {
      // Unbalanced braces in a catalogue. Emit the rest verbatim rather than
      // looping or throwing — a visibly broken string is a fixable string.
      out += template.slice(open);
      break;
    }

    out += formatArgument(template.slice(open + 1, close), tag, values);
    cursor = close + 1;
  }

  return out;
}

function formatArgument(body: string, tag: string, values?: MessageValues): string {
  const comma = body.indexOf(',');
  const name = (comma === -1 ? body : body.slice(0, comma)).trim();

  if (!values || !(name in values)) return `{${body}}`;
  const value = values[name] as string | number;

  // `{name}` — plain substitution, the overwhelmingly common case.
  if (comma === -1) return String(value);

  const rest = body.slice(comma + 1).trim();

  if (rest === 'number') {
    return typeof value === 'number' ? formatNumber(tag, value) : String(value);
  }

  if (rest.startsWith('plural') || rest.startsWith('select')) {
    const isPlural = rest.startsWith('plural');
    const options = parseOptions(rest.slice(isPlural ? 6 : 6).replace(/^\s*,/, ''));

    let chosen: string | undefined;
    if (isPlural) {
      const numeric = Number(value);
      // Exact matches win over categories, which is what lets a catalogue say
      // "no lessons" for zero in a language whose plural rules have no `zero`.
      chosen = options[`=${numeric}`] ?? options[pluralCategory(tag, numeric)] ?? options.other;
      if (chosen === undefined) return formatNumber(tag, numeric);
      chosen = chosen.split('#').join(formatNumber(tag, numeric));
    } else {
      chosen = options[String(value)] ?? options.other;
      if (chosen === undefined) return String(value);
    }

    // Recurse: an option body may contain further arguments.
    return formatMessage(chosen, tag, values);
  }

  // An argument type this file does not implement — `date`, `selectordinal`,
  // a skeleton. Substituting the raw value keeps the sentence readable.
  return String(value);
}
