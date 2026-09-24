<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The website and the app ship the same exercises

This is one of two clients. The other is the Expo app at the repository root,
and both must always present **the same exercises**: the same challenges, in
the same order, with the same simulations, videos and explanations.

Content comes from `packages/core` and is written once, so it cannot drift on
its own. Rendering can. Before changing anything in `web/src/components/app/`,
check whether the app has the matching behaviour — and if you add support for
a schema field here, add it there too.

`module.video` was rendered here and ignored by the app for months, so
module-level videos were invisible to mobile learners. Nothing failed, because
a client silently ignores fields it does not handle.

Layout, navigation and chrome may differ between the two. What is asked, what
counts as correct, and what the learner is told afterwards may not.

Full reasoning: `CONTRIBUTING.md` → "The parity rule".
