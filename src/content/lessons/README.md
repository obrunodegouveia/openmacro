# Writing an OpenMacro lesson

A lesson is data. You do not need to touch the app, the engine, or any React
to add one — and you do not need to be a developer to be a contributor here.
If you can explain a central bank operation precisely, you can write a lesson.

## The shape

Every lesson matches the `Lesson` type in [`../schema.ts`](../schema.ts). Read
that file once: it is the contract, and it is commented for exactly this
purpose.

Author in whichever format suits you:

| Format | Checked by | Best for |
|---|---|---|
| `.json` | `npm run lint:content` | Contributors who want to avoid tooling |
| `.ts` (via `defineLesson`) | `npm run typecheck` | Autocomplete and inline type errors |

Both compile to the same thing. `rrp-floor-mechanics.json` and
`qe-primary-dealer.ts` are the worked examples.

## The five challenge types

- `multiple_choice` — one right answer, with a targeted rebuttal per distractor
- `concept_match` — pair terms with definitions
- `order_flow` — arrange events into a causal sequence
- `interactive_sim` — sliders driving derived readouts toward an objective
- `t_account_flow` — post double-entry shifts across balance sheets

## Writing a `t_account_flow`

This is the primitive the platform is built on, and the one with real rules:

1. **Every entity belongs to a tier.** `central_bank`, `commercial_bank`,
   `shadow_bank`, or `fiduciary_core`. The tier is what tells the learner
   whose liability the money is.
2. **Every expected shift must balance.** For each entity, the sum of asset
   deltas must equal the sum of liability deltas. An answer that does not
   balance cannot be solved — the validator rejects it.
3. **Every expected shift needs a matching `options` entry.** Otherwise the
   posting cannot be placed.
4. **Write distractors that are wrong for a reason.** The right amount on the
   wrong side; the right posting on the wrong entity; a plausible account that
   this particular operation does not touch. Give each one a `feedback` line
   naming the misconception. A puzzle whose wrong answers are obviously silly
   teaches nothing.
5. **Use `aggregateEffects` for the payoff.** After the learner posts the
   entries by hand, tell them what actually moved: did M0 expand? M2? Did
   collateral leave the market? This is where the lesson lands.

## Two rules for the prose

**`explanation` carries the lesson.** It is shown whether the learner was
right or wrong, and it is the difference between a quiz and a course. Write
one or two mechanical sentences about *why* the answer works — never just
restate that it was correct.

**Be precise about what is contested.** Where economists genuinely disagree,
or where an aggregate depends on a definitional choice, say so in the note.
Precision is the product.

## Before you open a PR

```bash
npm run lint:content   # every lesson in the course, .ts and .json alike
npm run typecheck      # types, which .ts lessons get for free
```

`lint:content` loads the real registry rather than scanning files, so a lesson
is only checked once it is actually wired up — if it validates, the app can run
it.

Register your module in [`src/content/registry.ts`](../registry.ts): one import
and one entry in `MODULES`. A maintainer will review the economics, not just
the syntax — expect questions about the mechanism, and push back if you think
we have it wrong.
