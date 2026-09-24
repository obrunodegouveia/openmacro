# OpenMacro

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/v3/openmacro-lockup-dark.png">
  <img src="assets/brand/v3/openmacro-lockup-light.png" alt="OpenMacro" width="280">
</picture>

[Brand assets and usage](assets/brand/v3/README.md)

**Duolingo-style micro-learning for macroeconomics, monetary policy and
fractional-reserve banking.** Five minutes a day, aimed at teenagers and young
adults who were never taught where money actually comes from.

**▶ Play the course: <https://openmacro.org/learn>**

No account needed — every lesson runs in the browser. Signing in with Google
saves your XP and day streak across devices and nothing else; see
[docs/cloud-sync.md](docs/cloud-sync.md).

Open source, offline-first, and built so that writing a lesson is easier than
writing a blog post.

**What this is for:** understand money deeply enough to run your own financial
life on the best terms available to you — and deeply enough to sit in the chair
of the president of any central bank and do the job on the technical merits.
Those are the same knowledge checked at two scales. See
**[GOALS.md](GOALS.md)**.

---

## Where things run

| | |
|---|---|
| **openmacro.org** | The course on the web — Next.js, in `web/`. This is what learners play. |
| **iOS / Android** | The Expo app at the repository root. |
| **`packages/core`** | Lesson content, the schema and the grading engine. Shared by both, so a lesson is written once. |

The mobile app can still be run in a browser with `npm run web` for quick
component work, but that is a debugging convenience, not a deployment target —
the web course is the Next.js site.

**The two clients always present the same exercises.** Same challenges, same
order, same simulations, same videos, same explanations — a lesson started on
a phone and finished in a browser is the same lesson. Content lives once in
`packages/core`, so it cannot drift; rendering can, and keeping it from doing
so is a rule contributors are held to. See
[the parity rule](CONTRIBUTING.md#the-parity-rule). How the two *look* is free
to differ; what they *ask* is not.

## Status

Nineteen modules ship today — 122 lessons and 528 challenges across all five
challenge types, from what money is through to diagnosing a crisis while it
happens. The engine, schema, progress sync and contributor tooling are done.

| Level | Modules | Lessons | Challenges | What it covers |
|---|---:|---:|---:|---|
| Beginner | 5 | 48 | 224 | What money is, where it comes from, what GDP counts |
| Intermediate | 6 | 30 | 126 | Rates, curves, credit, the instruments and their markets |
| Advanced | 8 | 44 | 178 | Running the institution: policy levers, balance sheets, crisis machinery |

The full course in order is on
[openmacro.org/learn](https://openmacro.org/learn); the bar every lesson is
written against is in [GOALS.md](GOALS.md).

Content is still where help is most wanted: more lessons, more languages, and
review from people who teach this for a living.

Optional Google sign-in syncs progress across devices — see
[docs/cloud-sync.md](docs/cloud-sync.md). It is off unless configured, so a
fresh clone stays fully offline with no account UI at all.

Lessons are verified end to end on web, and the iOS app has shipped to
TestFlight. Google sign-in is built and its redirect is verified up to the
hand-off to Supabase, but no one has completed a real sign-in yet — see
[docs/cloud-sync.md](docs/cloud-sync.md#what-has-actually-been-tested) for the
exact line between tested and untested.

## Quick start

```bash
git clone <your-fork>
cd openmacro
npm install
cp .env.example .env
npm start            # then press i (iOS), a (Android) or w (web)
```

Requires **Node 22.18+** — `npm run lint:content` loads the lesson registry
through Node's built-in TypeScript type stripping, so it needs a runtime that
has it. No backend, no API keys, no account: everything runs from local files,
and the default `.env` leaves cloud sync switched off.

| Command                 | What it does                                       |
|-------------------------|----------------------------------------------------|
| `npm start`             | Expo dev server                                    |
| `npm run ios` / `android` / `web` | Launch on a specific platform            |
| `npm run typecheck`     | `tsc --noEmit`                                     |
| `npm run lint:content`  | Validate every lesson without launching the app    |
| `npm run preflight:store` | Check everything the stores will check, before building |
| `npm run build:store`   | Production build for both stores via EAS           |

## Releasing to the App Store and Google Play

The repository carries the whole release path: EAS build profiles
(`eas.json`), the App Store listing copy (`store.config.json`), a preflight
check for the things a compiler cannot see, and a GitHub workflow that builds,
submits and pushes metadata from a `v*` tag.

What it cannot carry is the accounts — an Apple Developer Program enrolment, a
Play Console account, and the keys that go with them.
**[docs/mobile-release.md](docs/mobile-release.md)** is the full runbook: the
one-time setup, the release sequence, and the traps that cost a review cycle
each.

## How it works

```
app/                                  Expo Router routes
  _layout.tsx                         Providers + stack
  index.tsx                           The learning path (home)
  lesson/[lessonId].tsx               The lesson runner

src/
  content/                            ← ALL LEARNING CONTENT LIVES HERE
    schema.ts                         The challenge/lesson type system
    formulas.ts                       Pure maths for interactive simulations
    registry.ts                       The list of shipped modules
    validate.ts                       Content linter (ids, formulas, objectives)
    lessons/                          One folder per module — start at its README
  engine/                             Pure, testable logic — no React
    lessonSession.ts                  Progression state machine (hearts, XP, re-queue)
    grading.ts                        Answer -> verdict + explanation
    simulation.ts                     Evaluates sim readouts and objectives
    answers.ts                        Answer shapes, one per challenge type
  components/
    challenges/                       One component per challenge type
    ui/                               ActionButton, ProgressBar, FeedbackSheet, …
  providers/
    AuthProvider.tsx                  Google sign-in; inert when unconfigured
    ProgressProvider.tsx              Picks the store, merges on first sign-in
  services/
    types.ts                          The LearningDataProvider seam
    progressRules.ts                  Pure XP + streak + merge rules, shared by all providers
    asyncStorageDataProvider.ts       On-device persistence (default)
    supabaseDataProvider.ts           The signed-in learner's account
    mockDataProvider.ts               In-memory reference implementation
supabase/migrations/                  Tables + row-level security
  feedback/                           Haptics + sound façade
  theme/tokens.ts                     Colour, spacing, radius, type
```

The layering rule: **content knows nothing about the engine, and the engine
knows nothing about React.** `src/engine/` is plain functions you could run in
Node. That is what makes the progression rules easy to reason about and the
challenge types cheap to add.

### The lesson runner

`src/engine/lessonSession.ts` is a pure reducer implementing the Duolingo loop:

- a challenge answered wrong is **re-queued to the end** — you cannot leave a
  lesson until you can actually do every step
- a re-queued challenge is worth **half XP** when finally solved
- **hearts** decrement on each miss; at zero the run fails and can be retried
- a **combo** counter rewards consecutive first-attempt correct answers
- the progress bar honestly slides *back* when the run gets longer

### Progress and streaks

XP, the day streak and per-lesson records persist on the device via
AsyncStorage (localStorage on web), under one versioned document. Storage is
treated as untrusted: corrupt or older-versioned data is discarded for a fresh
start rather than crashing.

Streak rules live in `src/services/progressRules.ts`, clock-free and pure so
the awkward cases stay testable. Dates are **local**, not UTC — a UTC date key
would advance or break a learner's streak at a time unrelated to their own
midnight. On load the stored profile is reconciled against today: practised
today keeps the streak lit, practised yesterday keeps it but unlit, anything
older resets it to zero.

### Accounts (optional)

With a Supabase project configured, learners can sign in with Google and their
progress moves to a row-level-security-scoped Postgres row instead of the
device. Local progress made before signing in is merged into the account once,
taking the best of each side. With no project configured the app never mentions
accounts.

Finishing a lesson never waits on the network: the result is committed locally
and pushed when a connection is available, so a signed-in learner on a train
keeps their streak. Setup, the data model and the known limits are in
[docs/cloud-sync.md](docs/cloud-sync.md).

### Challenge types

| Type              | Interaction                                          |
|-------------------|------------------------------------------------------|
| `multiple_choice` | Pick one, get a rebuttal aimed at your exact mistake  |
| `concept_match`   | Tap a term, tap its definition                        |
| `order_flow`      | Build a causal chain from shuffled events             |
| `interactive_sim` | Drive sliders, watch derived values, hit an objective |
| `t_account_flow`  | Place double-entry postings across balance sheets     |

Every type is implemented on both clients. Adding one means writing both
renderers — see [the parity rule](CONTRIBUTING.md#the-parity-rule).

## Contributing

**The single most valuable contribution is a lesson.** Start here:
[`packages/core/src/content/lessons/README.md`](packages/core/src/content/lessons/README.md) — it covers the
schema, the editorial standards, and the two lines you add to register a module.

Adding a module never requires touching the engine or the UI.

Other good first issues:

- **Run it on a device.** Everything so far was verified against the web build.
  Reanimated entering animations, `expo-haptics` and the slider all behave
  differently on native; a pass on an iOS and Android simulator, fixing what
  differs, would be genuinely valuable.
- **Sound.** `src/feedback/index.ts` has the cue plumbing wired end to end with
  `playCue()` stubbed. Install `expo-audio` and fill it in.
- **Tests.** `src/engine/` and `src/services/progressRules.ts` are pure and
  dependency-free — `grading.ts`, `lessonSession.ts`, `simulation.ts`,
  `content/formulas.ts` and the streak rules are all directly unit-testable.
  There is no test runner configured yet; wiring up `jest-expo` and covering
  the reducer and the streak edge cases would be a great contribution.
- **Exercise the OAuth flow.** The sign-in UI and provider are built and the
  gating is verified, but nobody has run the round trip against a live Supabase
  project and Google client yet.
- **New challenge types.** See the last section of the lessons README.

### Editorial line

OpenMacro explains **how the machinery works**, not what to think about it.
Where a model is a simplification — and the deposit multiplier very much is —
the lesson says so out loud. Readers of any political persuasion should finish
a lesson feeling informed rather than recruited. PRs that editorialise will be
asked to rewrite.

## Tech

Expo SDK 57 · React Native 0.86 · React 19 · TypeScript 7 (strict) · Expo Router ·
Reanimated 4 · AsyncStorage · Supabase (optional) ·
`@react-native-community/slider` · `expo-haptics`

### Why there are three TypeScripts

`npm run typecheck` runs **TypeScript 7**, the native compiler, installed as
`typescript-native` (an alias for `typescript@7`). It checks this repository in
about half a second where the JavaScript compiler took two and a half.

TypeScript 7 is a *checker*, not a library: it ships `bin/tsc` and a native
binary, and `require('typescript')` does not resolve to it at all. So the tools
that consume the compiler programmatically still need a JavaScript build, and
they keep the ones they already had:

| | Version | Used by |
|---|---|---|
| `typescript-native` | 7.0.2 | `npm run typecheck`, `typecheck:core`, and `web`'s typecheck |
| `typescript` (root) | 6.0.3 | Anything calling the compiler API; your editor's language service |
| `typescript` (`web/`) | 5.9.3 | `typescript-eslint`, whose peer range is `>=4.8.4 <6.1.0`, and Next's build-time checking |

This is why the typecheck scripts call the binary by path instead of plain
`tsc` — two installed packages both provide a `tsc` bin, and which one npm
links is not something to depend on.

Collapsing this back to one version becomes possible when `typescript-eslint`
widens its peer range past 7. Until then, deleting the alias does not simplify
anything; it just makes typechecking four times slower.

## Licence

MIT — see [LICENSE](LICENSE).
