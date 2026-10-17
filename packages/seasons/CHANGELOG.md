# Changelog

All notable changes to `@openmacro/seasons`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/): a change that makes an existing
caller fail to compile or behave differently is a major version.

## 1.0.0 — 2026-10-17

First release, extracted from OpenMacro's Halloween and Christmas themes.

- `decide`: one pure function weighing a QA override, a remote kill switch,
  the viewer's preference and the calendar, in that order.
- Calendar windows: fixed days, windows wrapping the new year, Easter-relative
  feasts, and the nth weekday of a month, each with an offset; priorities for
  a short season inside a longer one.
- Looks: `full`, `calm` and `off`.
- `createSeasonController`: storage, midnight rollover, remote refresh,
  subscriptions.
- Remote config with expiry, validated strictly by `parseRemoteConfig`.
- `./react`: `useSeasonDecision`, `useSeasonPreference`.
- `./web`: `createBootScript` (pre-paint, no flash of the wrong theme) and
  `applyDecision`.
- A build (`npm run build`) producing an installable `dist/`, verified by
  installing it into an empty project (`npm run verify:dist`).
