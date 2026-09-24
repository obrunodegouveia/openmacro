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

## The timeline

`src/scenes.ts` holds it, and both the composition and the narration generator
read from there. They used to carry separate copies of the same seven numbers,
which is precisely how audio drifts out of sync with picture.

## Adding a language

`COPY` in `src/script.ts` is keyed by locale and `Root.tsx` registers one
composition per language. Nothing else is language-aware: the numbers come
from the formulas and format themselves.

## Narration

Generated locally with macOS `say` — Samantha for English, **Joana** for
Portuguese, which is a genuine `pt_PT` voice rather than a Brazilian one. No
API key, no account, works offline.

```bash
node narration.mjs   # regenerate, then copy into public/narration/
```

It is plainly synthetic and a recorded human voice would be better. If one is
ever swapped in, say where it came from in the lesson's `video.source` — the
schema asks for it, and a viewer is owed the knowledge that a narrator is not.

One clip per scene rather than one long take, pinned to its `Sequence`. A
single file slides against the picture the moment any scene length changes.

`narration.mjs` measures every clip against its scene and demands half a
second of headroom, because `say` is not perfectly repeatable: a line that
exactly fills its scene one run clips the next. Portuguese is the binding
constraint throughout, running about twenty per cent longer than the English —
both scene lengths that grew did so for Joana, not Samantha.

## Output

`out/` is gitignored. The renders are reproducible from this directory and a
couple of megabytes each; the source is the artefact worth keeping.

## A note on the toolchain

Remotion is free for individuals and small teams and has a paid company
licence above a threshold. Read their terms before this becomes load-bearing
for anything commercial — this repository is MIT and the videos it produces
are yours, but the renderer's licence is its own question.
