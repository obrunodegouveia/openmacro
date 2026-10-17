# Seasons

For a few weeks a year the app and the site dress up: Halloween in October,
Christmas in December. This is how that works, how to switch a season off in
a hurry, and how to add the next one.

A season changes how things **look**. It never touches content, grading or
progress, so the parity rule (CONTRIBUTING.md) holds by construction.

## The three layers

| Layer | Where | Knows about |
|---|---|---|
| **Engine** | `packages/seasons` (`@openmacro/seasons`) | Calendars, preferences, remote config. Nothing about OpenMacro; reusable in any app. |
| **Catalogue** | `packages/core/src/season.ts` | Which seasons, when, and what each one hangs up (a *pack*). Shared by both clients. |
| **Clients** | `src/seasons`, `src/components/ui/Seasonal*.tsx` (app); `web/src/lib/season*.ts`, `web/src/components/site/seasonal-*.tsx`, `web/src/components/site/seasons/` (site) | How a pack is drawn, and the palette. |

## How a season is decided

One pure function, `decide`, weighs four inputs and the first that applies
wins:

1. **A QA override**: `?season=christmas` on the site (remembered for the tab),
   `EXPO_PUBLIC_SEASON=christmas` in an app build. `christmas:calm` forces the
   calm look; `none` forces the ordinary one.
2. **The remote kill switch**: `enabled: false`, or the season listed in
   `disabled`. It beats a learner's own "On", because it exists for the day a
   season breaks something.
3. **The learner's choice**: On, Calm or Off. In Profile in the app, in the
   footer on the site. Kept on the device.
4. **The calendar**, as moved by any remote `windows`, or a remote `force`.

The same function runs everywhere: in the app, in the site's runtime, and in
the site's inline pre-paint script, which is `decide` itself serialised with
`toString()`, not a copy. There is no second implementation to drift.

### Calm

The calm look keeps the colours and the still ornaments (corners, footer row,
emoji swaps, the greeting) and drops everything that moves, every popup, and
anything marked `creepy` (the spider). Reduce Motion gets the same stillness
automatically, without losing the spider.

## Switching a season off, now

The remote config is served from `https://openmacro.org/api/seasons`, read
from the `SEASONS_CONFIG` environment variable on the Cloud Run service. No
build, no release, no app update:

```sh
# Everything off
gcloud run services update openmacro-web --region <region> \
  --update-env-vars '^|^SEASONS_CONFIG={"version":1,"enabled":false}'

# Back to the calendar
gcloud run services update openmacro-web --region <region> \
  --remove-env-vars SEASONS_CONFIG
```

(`^|^` changes gcloud's list separator, so the commas in the JSON survive.)

| Field | Effect |
|---|---|
| `"version": 1` | Required. Anything else is ignored. |
| `"enabled": false` | Every season off, for everyone. |
| `"disabled": ["halloween"]` | Those seasons off. |
| `"calm": true` | Everyone gets the calm look: the fix for a misbehaving animation. |
| `"force": "christmas"` | That season on for everyone, whatever the date. |
| `"windows": { "christmas": { "from": {...}, "to": {...} } }` | Moves a season. Date points as in `SEASONS`. |
| `"expires": "2026-12-31T23:00:00Z"` | Ignore this config after then, so nothing outlives its reason. |

A config with a typo is never served: the route logs why and answers
`{"version":1}`, which changes nothing.

**How fast it lands.** The response is cached for 5 minutes. The site
refetches every 15 minutes and whenever a tab comes back into view, and
repaints at once. The app refetches at launch, every 15 minutes, and on
returning to the foreground; decorations change at once, and the colours on
the next launch (the palette is baked into the app's stylesheets, see below).

## Why the app's colours wait for a restart

React Native stylesheets are created when their modules load, and every one
of them reads the palette then. So the season the app *paints* is decided
before the first frame (`seasons.boot`), from a small JSON file read
synchronously with `expo-file-system`. AsyncStorage would answer too late.
Decorations follow the live decision instead. When a learner changes the
setting and the colours are now stale, Profile says so and offers **Restart
now**, which reloads the bundle.

`expo-file-system` ships inside `expo` itself, so all of this is JavaScript:
the native fingerprint is unchanged, and seasons go out as an EAS Update.

## Adding a season

1. In `packages/core/src/season.ts`: add the id to `SeasonId`, a window to
   `SEASONS` and a pack to `SEASON_PACKS`. Windows can be fixed days
   (`{ month: 12, day: 1 }`), relative to Easter (`{ easter: -47 }` is
   Carnival), or the nth weekday (`{ month: 11, weekday: 4, nth: 4 }`), each
   with an `offset` in days. A window may wrap the new year. Give a short
   season `priority: 1` to sit inside a longer one.
2. Strings: `season.<id>.name`, `.greeting`, `.welcome` and `.toy.1` to `.3` in
   every catalogue under `packages/core/src/i18n/ui/`.
3. Palettes: `seasonal.<id>` in `src/theme/palette.ts`, and
   `:root[data-season="<id>"]` (dark, then a light block in the light media
   query that sets every same token) in `web/src/app/globals.css`. Keep mint
   and coral alone: they mean correct and wrong all year.
4. The site's artwork: a `seasons/<id>-layer.tsx` and its CSS, registered in
   `LAYERS` in `seasonal-decor.tsx`. It loads only while the season is on.
5. `npm run check:seasons`. It fails if either client lacks a palette, a light
   block misses a token, a catalogue misses a string, or any text falls under
   WCAG AA. The type checker covers the rest.

Preview it any day with `?season=<id>` or `EXPO_PUBLIC_SEASON=<id>`.
