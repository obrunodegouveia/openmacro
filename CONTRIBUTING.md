# Contributing to OpenMacro

Welcome. This is the orientation document: what OpenMacro is, why it matters
enough to be taught like a language, how the repository is put together, and
where a newcomer can do the most good in an afternoon. The [README](README.md) is the deeper reference; this is the map.

---

## What this project is

**Duolingo-style micro-learning for macroeconomics, monetary policy and
fractional-reserve banking.** Five minutes a day, aimed at children, teenagers
and young adults who were never taught where money actually comes from — and at
the parents and teachers who want to be the ones to tell them.

The course is playable at **<https://openmacro.org/learn>** with no account. An
iOS and Android app ships the same course. Everything is MIT-licensed.

Two things are worth internalising before you write any code:

**Content is data, not code.** A lesson is a plain serialisable object matching
a schema. Adding one touches no React, no engine, no UI. This is the single
most important design decision in the repository, and it is why the most
valuable contribution here is a lesson rather than a patch.

**The editorial line is mechanical, not political.** OpenMacro explains *how
the machinery works*, not what to think about it. Where a model is a
simplification — and the deposit multiplier very much is — the lesson says so
out loud. A reader of any political persuasion should finish a lesson feeling
informed rather than recruited. PRs that editorialise will be asked to rewrite.

## What we are actually building

The goal of the project in one place is [GOALS.md](GOALS.md): understand money
deeply enough to run your own financial life on the best terms available to
you, and deeply enough to run a central bank. What follows is how that goal
shapes the work.

The course is the means. These five things are the project, and a
contribution is good to the extent that it serves them.

**Make it a game, not a textbook with a progress bar.** A twelve-year-old
should want the next lesson. The loop is already Duolingo's — hearts that
decrement on a miss, XP, a combo counter for consecutive first-attempt
answers, a day streak, and a wrong answer re-queued to the end of the run at
half XP so you cannot leave a lesson until you can actually do every step.
Treat that as the floor. The T-account challenge exists because somebody asked
what posting double-entry by hand would feel like as a puzzle, and it turned
out to be the best thing in the course. Bring that kind of idea. If a mechanic
would make a child laugh, argue with a sibling about the answer, or drag a
parent over to look — propose it.

**Build for the adult sitting next to the child.** Parents, guardians and
teachers are a first-class audience, not an afterthought:
[`/teach`](https://openmacro.org/teach) lays out what to introduce at what age
and how to explain inflation or bank money creation to a child, and it answers
the privacy question plainly, because an adult deciding whether to put a child
in front of a product should not have to dig for it. No account is needed, and
nothing is tracked. Anything that helps an educator run this in a classroom, or
a parent run it at the kitchen table — a printable, a lesson plan, a two-player
mode, a way to follow a child's progress without surveilling them — is squarely
in scope.

**Pay the learner in the thing the course explains.** Finishing a module pays
**€1 in EURC**, Circle's euro stablecoin, on Base, straight to the learner's
own Coinbase account. There is something honest about a course on money that
settles in money, and about a child watching a stablecoin transfer arrive and
knowing exactly which ledger entries just moved. It is capped by construction —
one claim per learner per module, so the maximum anyone can ever earn is
`modules × the reward`, and no bug or cheat raises it. See
[docs/rewards.md](docs/rewards.md).

**The goal is a community that understands this deeply — starting with your
own family.** Not familiarity, not vibes: the reward recipients in
`docs/rewards.md` are literally family members with Coinbase accounts, because
that is where this began and where it should spread. Teach your kids, your
siblings, your parents. The measure of success is not downloads; it is the
number of people who can explain, over dinner, where the money in their account
came from and whose liability it is.

**The bar: a proficient student could run a central bank.** That is the exam we
write against. Someone who finishes this course should be able to read the Fed's
and the ECB's balance sheets line by line, know which lever moves which rate and
why, understand what a peg costs to defend and when it breaks, and diagnose a
crisis while it is happening rather than in hindsight. If a lesson would not
survive contact with somebody who does this for a living, it is not finished. A
lesson that teaches a vocabulary word instead of a mechanism is not finished
either.

## Why this belongs next to English

A child in Lisbon learns English without anyone having to justify it. English
is the language the rest of the world is conducted in, so not having it is a
ceiling on everything else — the job, the university, the internet, the room
where the decision gets made. Nobody argues the point.

Money is the other language you are conducted in. The difference is that you
are already a participant, fluent or not, every day, for your whole life. You
hold it, borrow it, earn it, lose it to inflation and hand it to institutions
whose liabilities it actually is — and the system does not pause to check
whether you followed any of that.

**And this illiteracy is invisible, which is what makes it expensive.** A
person who does not speak English knows they do not speak English, and can
route around it. A person signing a thirty-year mortgage at a variable rate has
no comparable signal. Nothing at the table tells them they are taking a
position on the future path of ECB policy. They sign, because everyone signs.

So take the central-bank bar above and point it at a household instead of a
nation. It is the same knowledge:

- What a rate decision in Frankfurt does to a mortgage payment in Porto, and
  why fixed versus variable is a question about the next decade rather than
  about this month's instalment. That is what `euribor` and
  `buying-property-portugal` exist to make obvious.
- Why a savings account can feel safe and lose you money every year, and what
  "safe" even means when your deposit is a commercial bank's liability.
- What your income, your debts and your savings are each denominated in — and
  what happens when those are not the same currency.
- Why a peg that has held for years can break in a week, and what the days
  before it look like from the inside.
- Which headlines are mechanically load-bearing and which are noise dressed up
  as urgency.

**The honest version of the wealth claim.** This course will never tell anyone
what to buy, and anyone who promises returns is selling something — the
editorial rule above forbids it and always will. What understanding actually
does is quieter and larger: it removes a class of avoidable, expensive errors
from the biggest decisions a household ever makes, and it does that repeatedly
over the decades in which those decisions compound. The person who was not
panicked into selling, not talked into a product they could not read, not
surprised by their own rate reset, and not quietly taxed by inflation they
never priced in, ends up in a materially different place from the person who
was — with no forecasting talent involved, only comprehension. Wealth built
that way is a by-product of not being the counterparty everyone else is
trading against.

**And the English analogy holds all the way down to fluency.** Five hundred
memorised words do not get you through a conversation, because a real
conversation contains a sentence you have never heard. "Inflation means prices
go up" is a memorised word; it does not survive a phone call with a bank. This
is why the course drills mechanisms and makes people post entries by hand
rather than recognise definitions — fluency is precisely the ability to handle
the case nobody prepared you for, which is the only case that ever costs you
anything.

One last thing English gets right that money does not: it is taught from the
age of six, to everyone, for free, before anyone can argue about whether that
particular child will need it. That is the standard this project is trying to
meet, and it is why the course is MIT-licensed, playable with no account, and
works with the network off.

## Where the course stands today

| | |
|---|---|
| Content | 17 modules · 112 lessons · 488 challenges across 5 challenge types |
| Languages | English (source) and European Portuguese — interface and website at 100%, course content at 88% |
| Web | Next.js 16 on Cloud Run, the thing learners actually play |
| Mobile | Expo SDK 57 / React Native 0.86, built and submitted through EAS |
| Tests | **None.** There is no test runner configured. See "Good first contributions" |

`npm run lint:content` and `npm run i18n:status` print the live versions of the
first two rows; the numbers above will drift.

## The three places code lives

This is one npm workspace with three deliverables, and knowing which one you
are in saves a lot of confusion:

| Directory | What it is |
|---|---|
| **`packages/core`** | The course itself: content, schema, grading engine, progress rules, i18n. Imported by both clients, so a lesson is written once. |
| **`web/`** | `openmacro.org` — Next.js 16, App Router, Tailwind v4, deployed to Cloud Run. The web course, the marketing site, the glossary and the dashboard. |
| **repository root** | The Expo app (`app/` routes, `src/` providers, components, services, theme). |

`packages/core` must keep compiling without DOM *or* React Native globals —
the website, the mobile app and the content validator all import it, and CI
enforces this with `npm run typecheck:core`. Do not reach for `window`,
`document` or anything from `react-native` inside it.

The mobile app can be run in a browser with `npm run web`, but that is a
debugging convenience, not a deployment target.

### The layering rule

**Content knows nothing about the engine, and the engine knows nothing about
React.** `packages/core/src/engine/` is plain functions you could run in Node:

```
packages/core/src/
  content/
    schema.ts       The challenge/lesson type system — the contract
    registry.ts     The list of shipped modules; order here is the curriculum
    formulas.ts     Pure maths behind interactive simulations
    validate.ts     The content linter
    lessons/        One folder per module — start at its README
  engine/
    lessonSession.ts  Progression state machine (hearts, XP, re-queue)
    grading.ts        Answer -> verdict + explanation
    simulation.ts     Evaluates sim readouts and objectives
    tAccounts.ts      Double-entry balance checking
  progress/rules.ts   Pure XP + streak + merge rules, clock-free
  i18n/               Locale catalogues and the overlay machinery
```

That separation is what makes the progression rules easy to reason about and
new challenge types cheap to add.

### The parity rule

**The app and the website must always present the same exercises.** A learner
who does a lesson on the train and finishes it at a desk must meet the same
challenges, in the same order, with the same simulations, the same videos and
the same explanations. Not "roughly the same" — the same.

This is not an aspiration; it is the reason `packages/core` exists. Content is
written once and both clients read the same `MODULES` registry, so nothing has
to be kept in step by hand. The rule exists because that structural guarantee
covers the *content* and not the *rendering*, and the gap between those two is
where parity actually goes wrong.

What that looks like in practice:

- **Never fix a challenge type in one client only.** If `interactive_sim`
  clamps a slider differently on the web, both are wrong until both agree.
- **Never gate content on a platform.** No `Platform.OS ===` deciding which
  challenges to show, and no lesson that renders on one and not the other.
- **A new field in the schema is a change to two renderers**, not one. The
  schema is a contract; adding to it without implementing it on both sides
  creates content that silently exists for half the audience.
- **The engine decides, the client draws.** Grading, re-queueing, hearts and
  objectives live in `packages/core/src/engine`. A client that reimplements a
  rule will eventually disagree with the other one.

This has been broken, which is why it is written down. `module.video` was in
the schema and rendered by the website from the day the course map was built;
the app only ever read `lesson.video`. A module-level video was therefore
visible to web learners and invisible in the app — for months, silently,
because nothing fails when a client quietly ignores a field it does not know
about. It was found by attaching a video and looking at both clients.

Presentation may differ, and should. The app is a full-screen runner with a
tab bar; the website is a page with a URL you can share. Layout, navigation,
animation and chrome are free to diverge. **What is asked, what counts as
correct, and what the learner is told afterwards are not.**

When you change either client, open the other one and look.

## Setup

Requires **Node 22.18 or newer** — `npm run lint:content` loads the real lesson
registry through Node's built-in TypeScript type stripping, so it needs a
runtime that has it.

```bash
git clone https://github.com/obrunodegouveia/openmacro.git
cd openmacro
npm install            # installs the root app, packages/core and web/
cp .env.example .env

npm start              # Expo dev server — press i, a or w
npm run dev --workspace web   # the website on http://localhost:3000
```

No backend, no API keys, no account. The default `.env` leaves cloud sync
switched off, and with it off the app never mentions accounts at all. Every
value in `.env.example` is public by construction — Expo inlines
`EXPO_PUBLIC_*` into the shipped bundle, so nothing secret ever belongs there.

### The commands worth knowing

| Command | What it does |
|---|---|
| `npm run lint:content` | Validates every lesson in the registry. Run this before every content PR |
| `npm run audit:content` | Quality pass: duplicates, dead ids, guessable options. Warnings are advisory |
| `npm run typecheck` | The mobile app |
| `npm run typecheck:core` | The shared package's platform surface |
| `npm run lint` | ESLint, including the untranslated-string rule |
| `npm run i18n:status` | Translation coverage per language and module |
| `npm start` / `ios` / `android` / `web` | Expo dev server |

## The highest-value contribution: a lesson

Read
**[`packages/core/src/content/lessons/README.md`](packages/core/src/content/lessons/README.md)**
— it is the authoring guide, and it assumes no familiarity with the codebase.
You do not need to be a developer. If you can explain a central bank operation
precisely, you can write a lesson.

The short version:

1. Author in `.json` (checked by `npm run lint:content`) or `.ts` via
   `defineLesson` (which additionally gets you autocomplete and inline type
   errors). Both compile to the same thing.
2. Create `packages/core/src/content/lessons/module-XX-your-topic/index.ts`
   exporting a `defineModule({ ... })`.
3. Add one import and one entry to `MODULES` in
   [`registry.ts`](packages/core/src/content/registry.ts). Order in that array
   *is* the curriculum, on both clients.
4. Run `npm run lint:content` and `npm run typecheck`.

The five challenge types:

| Type | Interaction |
|---|---|
| `multiple_choice` | Pick one, get a rebuttal aimed at your exact mistake |
| `concept_match` | Tap a term, tap its definition |
| `order_flow` | Drag shuffled events into a causal chain |
| `interactive_sim` | Drive sliders, watch derived values, hit an objective |
| `t_account_flow` | Post double-entry shifts across balance sheets |

`t_account_flow` is the primitive the platform is built on and the one with
real rules — every expected shift must balance per entity, or the validator
rejects the lesson. The lessons README covers all of them.

Two rules for the prose, because they are what separate a course from a quiz:
**`explanation` carries the lesson** (it is shown whether the learner was right
or wrong — write about *why* the answer works, never just restate that it was
correct), and **be precise about what is contested**. Where economists
genuinely disagree, say so. Precision is the product.

Expect a review of the economics, not just the syntax. Push back if you think
we have the mechanism wrong.

## Translating

The course ships in English and European Portuguese, and a translation is an
**overlay**: a flat map of key to string that replaces individual fields.
Anything the overlay does not mention renders in English — per key, not per
language. A language can therefore ship at 5% and improve.

```bash
npm run i18n:status                 # where every language is
npm run i18n:extract -- pt-PT       # hand work out to a translator
npm run i18n:import  -- pt-PT       # take it back, validated
```

Adding a language is adding catalogues under `translations/`. No code changes.
Full guide: [docs/translation.md](docs/translation.md).

One rule to know while writing UI: user-visible strings go through the i18n
layer. A string typed straight into JSX is invisible to the typechecker and
invisible to `i18n:status`, so a custom ESLint rule
(`tools/eslint/no-untranslated-text.js`) fails CI on it.

## Good first contributions

- **Tests.** There is no test runner configured, and the most testable code in
  the repository is sitting uncovered: `engine/grading.ts`,
  `engine/lessonSession.ts`, `engine/simulation.ts`, `content/formulas.ts` and
  `progress/rules.ts` are pure, dependency-free and full of edge cases —
  especially the streak rules. Wiring up a runner and covering the reducer
  would be a genuinely valuable first PR.
- **Run it on a device.** Most verification so far has been against the web
  build. Reanimated entering animations, `expo-haptics` and the slider all
  behave differently on native; a pass on an iOS and Android simulator, fixing
  what differs, is wanted.
- **Content review.** `npm run audit:content` currently reports a few hundred
  advisory warnings — distractors without feedback, correct options that are
  conspicuously the longest and so guessable without reading. Each one is a
  small, self-contained editorial fix.
- **More Portuguese.** Content sits at 88%; `banking-and-money` is the module
  furthest behind.
- **Make it more fun.** The most open-ended invitation here, and the one with
  the least prior art to respect. Better celebrations, a sound or animation
  that lands, module-completion moments worth screenshotting, mascots,
  leaderboards among friends, a two-player mode a parent and child can play
  against each other, anything that makes a streak feel worth defending.
  Bring the idea to an issue first if it needs new data on the lesson schema;
  everything else, just show us.
- **Something for educators and parents.** Classroom-shaped things: a lesson
  plan, a printable worksheet generated from a module, a projector mode, a way
  for a teacher or parent to see where a learner is stuck without collecting
  data about them. `/teach` on the website is the entry point to extend.
- **A new challenge type.** Four files: the variant in
  [`schema.ts`](packages/core/src/content/schema.ts), its answer shape and
  grading in `packages/core/src/engine/`, a validator rule, and a component in
  `src/components/challenges/` plus `web/src/components/challenges/`.

## Conventions

**Branches** follow `type/short-slug` — `feat/i18n-round-trip`,
`chore/lint-untranslated-strings`, `docs/contributing-guide`. Branch from
`main` and open a PR back to it.

**Commits** are `type(scope): subject`, subject in lowercase, describing the
change in plain language rather than in file names:

```
feat(content): a lesson on why created money is a liability
fix(web): the Portuguese site sent every reader back to English
i18n(pt-PT): the drag strings, and a first pass at module 16
```

Everything — code, comments, docblocks, commit messages, PR descriptions — is
written in English.

**Before opening a PR**, run what CI runs:

```bash
npm run typecheck && npm run typecheck:core
npm run lint:content && npm run audit:content
npm run lint
npm run i18n:status -- --strict
npm run typecheck --workspace web && npm run lint --workspace web && npm run build --workspace web
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs all of it on
every push to `main` and every pull request, with read-only permissions and
first-party actions only. `audit:content` and `i18n:status --strict` fail on
errors but not on style warnings or on untranslated strings — a rule that
blocks a new lesson until every language has caught up is a rule that stops
lessons being written.

## What needs accounts, and therefore a maintainer

These paths are fully wired in the repository but cannot run from a fork,
because they need credentials that belong to a person rather than a codebase.
Read them for context; do not expect to exercise them.

| Area | Document |
|---|---|
| Google sign-in and cross-device progress (Supabase) | [docs/cloud-sync.md](docs/cloud-sync.md) |
| App Store and Google Play releases (EAS, ASC, Play Console) | [docs/mobile-release.md](docs/mobile-release.md) |
| EURC rewards on Base for finishing a module | [docs/rewards.md](docs/rewards.md) |
| Website deployment (Cloud Run, `openmacro.org`) | [web/README.md](web/README.md) |

Merging to `main` publishes an over-the-air content update to the `preview`
channel automatically. Production is always a deliberate act — an OTA update
faces no store review, so nothing stands between a mistake and a learner except
the checks above.

## Licence

MIT — see [LICENSE](LICENSE). By contributing you agree your work ships under
it.
