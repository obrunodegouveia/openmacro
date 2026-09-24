# Explainer videos

Video written as React components and rendered to MP4 with
[Remotion](https://remotion.dev), **out of the course's own content**.

```bash
npm run studio --workspace @openmacro/video     # preview and scrub
npm run render --workspace @openmacro/video -- spend-it-twice-en out/en.mp4
```

## Why it lives in this repository

Every figure on screen is computed by the same functions the app grades with.
`src/script.ts` calls `debt_snowball` and `nominal_growth_from_productivity`
from `@openmacro/core`; nothing is typed in by hand. Change a formula and the
film changes with it, which is the only way a lesson and its explainer stay in
step. An explainer made in an editor is a copy of an argument, and copies
drift — the same reasoning as the parity rule in `CONTRIBUTING.md`.

The design tokens in `src/theme.ts` mirror the app's palette so the film looks
like the product. They are restated rather than imported because `@/theme`
pulls React Native with it, which has no business in a video bundle.

## Adding a language

`COPY` in `src/script.ts` is keyed by locale and `Root.tsx` registers one
composition per language. Nothing else is language-aware: the numbers come
from the formulas and format themselves.

## Narration

There is none. The on-screen text is written to stand alone, because most
video of this kind is watched muted. If a voice is added, put where it came
from in the lesson's `video.source` — the schema asks for it, and a viewer is
owed the knowledge that a narrator is synthetic.

## Output

`out/` is gitignored. The renders are reproducible from this directory and a
couple of megabytes each; the source is the artefact worth keeping.

## A note on the toolchain

Remotion is free for individuals and small teams and has a paid company
licence above a threshold. Read their terms before this becomes load-bearing
for anything commercial — this repository is MIT and the videos it produces
are yours, but the renderer's licence is its own question.
