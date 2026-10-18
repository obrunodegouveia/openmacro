# Changelog

All notable changes to `@openmacro/seasons`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/): a change that makes an existing
caller fail to compile or behave differently is a major version.

## 2.0.0 — 2026-10-18

The whole seasonal kit, not only the engine: another app now gets all six
seasons by installing the package, wrapping itself in one provider, placing
a component or two and mapping its colours.

### Breaking

- `@openmacro/seasons/web` is now the React web renderer and imports
  `react`. Code that only needs the boot script and the DOM helpers (a
  server, a build script, plain Node) imports `@openmacro/seasons/web/boot`
  instead; it exports everything `./web` did in 1.x, plus `paletteCss`.
- `SEASON_ATTRIBUTE` and `LOOK_ATTRIBUTE` are unchanged but now live in
  `web/boot` (re-exported from `./web`).

### Added

- `./presets`: the six seasons as data (`PRESET_PACKS`: spring, summer,
  autumn, winter, Halloween, Christmas), `NORTHERN_CALENDAR`,
  `SOUTHERN_CALENDAR` and `presetCalendar`, English and European Portuguese
  strings with `createTranslator`, the palette roles (`PALETTE_ROLES`,
  `mapPalette`), `checkPack` (AA contrast under the sky and mist, motion
  limits, glow bounds, particle caps) and the WCAG helpers, `toyReaction`.
  The `SeasonPack` type and its parts (`SeasonScene` for the look).
- `./native`: `SeasonProvider`, `useSeason`, `useSeasonEmoji`,
  `useSeasonSettings`, and the decorations `SeasonAtmosphere`, `SeasonSky`,
  `SeasonToy`, `SeasonGarland`, `SeasonCardCorner`, `SeasonScreenCorner`,
  `SeasonFooter`, `SeasonGreeting`, `SeasonIcon`, `SeasonBurst`,
  `SeasonRain`, `SeasonWelcome`; the React Native primitives underneath;
  `expoHaptics`. Optional peers: react-native, reanimated, worklets,
  gesture-handler, expo-haptics (never imported).
- `./web`: `SeasonProvider` (which also keeps `<html>` dressed for the live
  decision), `SeasonLayer`, `SeasonFooter`, `SeasonGreeting`, `SeasonIcon`,
  `SeasonBurst`, `SeasonCardEdge`, `SeasonRain`, `SeasonWelcome`; the React
  primitives; `paletteCss`, which writes every season's palette as CSS
  variables (the roles as `--sv-*`, plus the app's own mapping).
  `./web/styles.css`, `./web/provider` (no visuals) and
  `./web/art/halloween` (optional SVG artwork).
- A per-season `art` hook on both providers: swap the toy, the flyers, the
  corners or the footer for your own components, lazily.
- Seasonal music: an optional `music` list on a pack (tracks with an
  app-supplied asset), `musicFor` (the season's tracks only while it is on,
  in the full look, with the preference On; otherwise `null` for the app's
  default music) and `useSeasonMusic` on both renderers. No playback.
- `data-sv-scheme` on `<html>` overrides `prefers-color-scheme` for the web
  visuals, for apps with their own theme switch.
- `verify:dist` now also renders the web entry with `react-dom/server`
  and type-checks consumers of `presets`, `web` and `native`; the
  portability test covers every entry point and which peers each may use.
- Runnable examples for Expo and Next.js, and the README as a porting guide.

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
