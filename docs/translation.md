# Translating OpenMacro

The course ships in English and European Portuguese. Adding a language is
adding catalogues — no code changes, and nothing in the app or the website
knows what languages exist.

```
npm run i18n:status                      # where every language is
npm run i18n:status -- --strict          # what CI runs
npm run i18n:extract -- start-here       # one module's strings, as JSON
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

Both apps read the course through the same three functions, and neither
imports `MODULES` directly:

| | mobile | web |
|---|---|---|
| provider | `src/providers/LocaleProvider.tsx` | `web/src/components/site/locale-provider.tsx` |
| hook | `useLocale()` | `useLocale()` |
| language detection | `expo-localization` | `navigator.languages` |
| remembered in | AsyncStorage | localStorage |

---

## Adding a language

1. Add the tag to `LOCALES` in `locales.ts`, with its name in `LOCALE_NAMES`.
   Use a region-qualified tag (`pt-PT`, not `pt`) whenever a second regional
   variant is plausible — adding `pt-BR` later should not be a rename of every
   file.
2. Copy `ui/en.ts` to `ui/<tag>.ts` and translate it. Type it as
   `UiDictionary`, not `typeof en`, so a partial catalogue compiles.
3. Register it in the `CATALOGUES` map in `index.ts` and the `TRANSLATIONS`
   map in `content/index.ts`.
4. `npm run i18n:status` now reports it.

The language picker, the fallback behaviour and the "still being translated"
notice all follow from those four steps. Nothing else needs touching.

### Ordering the work

Translate **every module's title and description first** — 34 strings that
make the whole learning path read in the new language — and only then whole
modules. The alternative ordering leaves the home screen entirely in English
for months while one module is perfect.

`content/pt-PT/headings.ts` is that file for Portuguese; copy its shape.

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

**No translation-management integration.** `i18n:extract` produces JSON, which
is what Crowdin, Lokalise and inlang all ingest, but nothing is wired up.
