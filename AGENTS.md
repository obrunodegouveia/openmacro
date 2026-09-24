# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# The app and the website ship the same exercises

There are two clients — the Expo app at the repository root and the Next.js
site in `web/` — and they must always present **the same exercises**: the same
challenges, in the same order, with the same simulations, videos and
explanations. A learner who starts a lesson on a phone and finishes it in a
browser must not be able to tell which one they are on, except by how it looks.

Content is written once in `packages/core` and both clients read the same
registry, so the *content* cannot drift. The *rendering* can, and that is where
this goes wrong:

- Do not fix a challenge type in one client only.
- Do not gate a challenge, a lesson or a video on the platform.
- A new field on the schema is a change to **two** renderers. Adding one
  without the other creates content that exists for half the audience and
  fails nowhere, because a client ignores fields it does not know about.
- Grading, hearts, re-queueing and objectives belong in
  `packages/core/src/engine`. A client that reimplements a rule will drift.

This has actually happened: `module.video` was rendered by the website and
ignored by the app, so module-level videos were invisible on mobile for months
without a single error. Nothing catches this automatically yet.

**So when you change one client, open the other and look.** Layout,
navigation and animation may differ. What is asked, what counts as correct,
and what the learner is told afterwards may not.

Full reasoning: `CONTRIBUTING.md` → "The parity rule".
