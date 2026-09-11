# Translating OpenMacro

The course ships in English and European Portuguese. Adding a language is
adding catalogues — no code changes, and nothing in the app or the website
knows what languages exist.

```
npm run i18n:status                      # where every language is
npm run i18n:status -- --strict          # what CI runs
npm run i18n:extract -- pt-PT            # hand work out to a translator
npm run i18n:import  -- pt-PT            # take it back, validated
```

---

## The shape of it

English is the source. A translation is an **overlay**: a flat map of key to
string that replaces individual fields. Anything the overlay does not mention
renders in English — per key, not per language.

That property is the whole design. A language can ship at 5% and improve, a
contributor can add a lesson without waiting for translators, and a bad
translation can be deleted rather than fixed.

```
packages/core/src/i18n/
  locales.ts            the list of languages, and device matching
  format.ts             ICU MessageFormat — plurals, numbers
  index.ts              translate(), createTranslator(), validateCatalogue()
  ui/en.ts              interface strings — the source of truth
  ui/pt-PT.ts           interface strings — European Portuguese
  localise.ts           applying an overlay to a module
  content/
    index.ts            the localised registry
    pt-PT/
      headings.ts       every module's title and description
      start-here.ts     one module, in full
```

### Matching a device language

`resolveLocale` implements RFC 4647 *lookup*: take the requested tag and keep
cutting subtags off the end until something matches. `pt-BR` asks for
Brazilian Portuguese, does not get it, and falls back to `pt-PT`.

The one rule worth knowing is that **a script subtag vetoes a fallback**.
`zh-Hant-TW` and `zh-Hans-CN` share the base language `zh` and are mutually
unreadable, so a base-language match would hand Traditional readers a
Simplified catalogue and call it a success — worse than serving English, which
is at least obviously not their language. Same trap for `sr-Cyrl` / `sr-Latn`.

`lookupLocale(available, preferred, fallback)` is exported separately from
`resolveLocale` so this can be tested against languages the app does not ship.

Both apps read the course through the same three functions, and neither
imports `MODULES` directly:

| | mobile | web |
|---|---|---|
| provider | `src/providers/LocaleProvider.tsx` | `web/src/components/site/locale-provider.tsx` |
| hook | `useLocale()` | `useLocale()` |
| language detection | `expo-localization` | `navigator.languages` |
| remembered in | AsyncStorage | localStorage |

---

## The round trip

```bash
npm run i18n:extract -- pt-PT            # everything
npm run i18n:extract -- pt-PT euribor    # one module
npm run i18n:extract -- pt-PT ui         # just the interface
```

Writes `translations/<locale>/<scope>.json` — one file per scope, each unit
carrying the English, the current translation and its state:

```json
"account.signOut": {
  "source": "Sign out",
  "target": "Terminar sessão",
  "state": "translated"
}
```

| state | meaning |
|---|---|
| `new` | no translation yet |
| `translated` | translated, and the English has not moved since |
| `stale` | translated, but **the English has been edited since** |

`stale` is the one worth having. A silently outdated translation is the worst
state this system reaches: fluent, confident, wrong, and counted as done.
`npm run i18n:status` reports stale counts; `--strict` does not fail on them,
because the fix is a translator's judgement rather than a build error.

Hand the files to a translator, or upload them — Crowdin, Lokalise and Weblate
all ingest this shape. Then:

```bash
npm run i18n:import -- pt-PT
```

Import is where bad data enters, so it is where validation lives. Every unit
is checked for balanced braces and for arguments the English does not provide
(`{nome}` for `{name}`), and **a failing unit is rejected rather than
written** — the report names it, everything else lands, and the key falls back
to English until it is fixed. Importing a file with three bad strings costs
three strings, not the file.

`translations/` is gitignored. It is a workspace, not source.

## Adding a language

1. Add the tag to `LOCALES` in `locales.ts`, with its name in `LOCALE_NAMES`
   and `LOCALE_TAGS`. Use a region- or script-qualified tag whenever a second
   variant is plausible — `pt-PT` not `pt`, `zh-Hant` not `zh`.
2. Register it in `CATALOGUES` in `index.ts` and `TRANSLATIONS` in
   `content/index.ts`.
3. `npm run i18n:extract -- <tag>` — every file comes out with empty targets.
4. Translate, then `npm run i18n:import -- <tag>`. The catalogue files and the
   content index are generated for you.

The language picker, the fallback behaviour and the "still being translated"
notice all follow. Nothing else needs touching.

### Generated files, and what survives

`i18n:import` rewrites everything **below** this marker in a catalogue file:

```
// ─── generated below · `npm run i18n:import` rewrites from here ───────────
```

Everything above it is preserved forever. That is where translator notes
belong — the conventions a language has settled on (`tu` not `você`, the 1990
spelling reform, which words keep their silent consonant) are worth more to
the next person than the strings are. `ui/pt-PT.ts` and
`content/pt-PT/start-here.ts` carry those notes.

A file that exists with **no** marker makes the import **fail**, with an
instruction to add one. The first version of this silently replaced such a
file's header, which cost the European Portuguese notes on its first real run:
nothing errored, the prose was simply gone. A tool whose purpose is preserving
work should not be able to destroy it quietly.

`content/<locale>/index.ts` is the exception — fully generated, with a
do-not-edit banner. Its import list *is* the generated part, so a preserved
region there would freeze the one thing that has to change.

### Ordering the work

Translate the **`course` scope and every module's title and description
first** — 36 strings that make the whole learning path read in the new
language. Only then whole modules. The alternative ordering leaves the home
screen entirely in English for months while one module is perfect.

---

## Writing messages

Interface strings use **ICU MessageFormat**, which is what translators and
translation-management tools already speak:

```ts
'path.lesson.steps': '{count, plural, one {# step} other {# steps}}',
'path.xp':           '{count, number} XP',
'map.finished':      '{done, number} of {total, number} finished',
```

`#` is the number, formatted for the locale. Categories come from
`Intl.PluralRules`, so Polish gets its four forms and Arabic its six without a
line of code changing.

**Never pick a plural with a ternary in a component.** It works for English
and Portuguese, which have two forms each, and it makes the sentence
inexpressible in most other languages. `format.ts` documents the reasoning at
length.

Each language's plural rules are selected from *its own* template, so English
needing no plural (`{count, number} day streak` — "day" never inflects) does
not stop Portuguese from needing one (`sequência de # dia` / `# dias`).

### Keys

Keys are namespaced by where they appear and are deliberately **not** the
English text. `account.signOut` survives a copy edit; a key of `"Sign out"`
breaks every translation the day somebody prefers "Log out".

`UiKey` is derived from `typeof en`, so a typo in a key is a compile error and
an unknown key cannot be translated.

---

## Translating content

```bash
npm run i18n:extract -- euribor > euribor.json
```

That is every translatable string in the module, keyed by **id** — lesson id,
challenge id, option id — never by position. A translation keyed on position
silently attaches itself to the wrong option the moment somebody reorders
them, and the result is a plausible sentence under the wrong answer: the worst
possible failure for teaching material, because nothing looks broken.

Translate the values, save as `content/<tag>/<module>.ts` typed as
`ContentDictionary`, and add it to that language's `modules` map.

**What is never translated**: lesson ids, challenge ids, option ids, formula
ids, icons, tags, numbers. Those are structure. A translated id breaks
grading, progress and the content validator at once.

**What is translated but should not be converted**: amounts and dates. €2,400
stays €2,400. Changing the figure only makes the translation diverge from the
English the day somebody edits one of them.

---

## What CI enforces

`npm run i18n:status -- --strict` fails on exactly two things:

- a **message naming an argument the English source does not provide** — a
  translator typing `{nome}` for `{name}`;
- **unbalanced braces**.

Both render as visible nonsense and neither is a type error, which is why they
are checked rather than typed.

`npm run lint` fails on a **user-visible string written into JSX** instead of
coming from `t()` — the other half of the guarantee. `i18n:status` proves the
catalogue is complete; the lint rule proves the app actually reads it. Without
it the interface can rot back to English while coverage still reports 100%,
because a hard-coded string never became a key to be counted.

The rule is `tools/eslint/no-untranslated-text.js`, and it is narrow on
purpose. It reports JSX text children and strings in props a human reads
(`accessibilityLabel`, `accessibilityHint`, `label`, `placeholder`, `title`,
`alt`, …), and only when the string contains two consecutive letters — so
`·`, `✕`, `↻` and emoji need no exemption. It tells `t('lesson.check')` from
`"Check"` structurally rather than by naming `t`: a string that is an argument
to any call is skipped, as is one being compared (`direction === 'expand'`).

`react/jsx-no-literals` is the obvious alternative and does not survive
contact with React Native — it flags `accessibilityRole="button"`,
`keyboardType="email-address"` and `tone="primary"`, and a rule that is wrong
that often gets switched off.

Untranslated content never fails the build. A rule that blocks a new lesson
until every language has caught up is a rule that stops lessons being written.

---

## Known gaps

These are deliberate, and each is a decision somebody should make rather than
a thing that was forgotten.

**The website has no per-locale URLs.** Every page is one address serving
English HTML, with the reader's language applied after hydration. That is fine
for the lesson player — it is behind a choice and nobody finds it through
search — and wrong for the marketing pages, which stay English-only. Genuine
multilingual SEO needs `/pt/...` routing with `hreflang` pairs, which changes
the sitemap, the canonical tags and every internal link. It should be chosen
deliberately, not arrive as a side effect of a language toggle.

**All locales are bundled.** An English-only learner still ships the
Portuguese strings. At two languages and one translated module that is a few
kilobytes. Past the fourth language, `content/index.ts` should move to a
dynamic `import()` per locale behind an async `loadContent(locale)` — which is
why everything already goes through one function rather than reading the maps
directly.

**No right-to-left support.** `expo-localization` reports `textDirection` and
nothing reads it. Adding Arabic or Hebrew means auditing every `flexDirection`
and every `marginLeft` first.

**No direct TMS sync.** The round-trip is files: extract, hand over, import.
Crowdin, Lokalise and Weblate all ingest and emit this shape, but nothing
pushes or pulls automatically — somebody moves the files. That is a small,
well-understood gap, and it is now a convenience rather than a blocker.

**No message extraction from source.** Catalogues are hand-authored; nothing
scans components to discover a new string. The lint rule below is the
compensating control — it fails the build on a string that never became a key
— which catches the same problem from the other end.

**The lint rule covers the app, not the website.** `web/`'s marketing pages
are deliberately English-only, so the same rule there would be hundreds of
findings describing the intended state of the world. Extending it to
`web/src/components/app/` and `web/src/components/challenges/`, which *are*
fully translated, is a worthwhile follow-up.
