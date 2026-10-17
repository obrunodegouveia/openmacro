# Seasons

All year round the app and the site wear the season: spring, summer, autumn
and winter, with Halloween and Christmas on top when they come round. This
is how that works, how to switch a season off in a hurry, and how to add the
next one.

## The calendar

In the learner's local time, both ends inclusive (`SEASONS` in
`packages/core/src/season.ts`). The nature seasons follow the northern
hemisphere's astronomical seasons, rounded to fixed days, and between them
cover every day of the year (`check:seasons` proves there are no gaps). The
holidays have `priority: 1`, so they win the days they share.

| Season | From | To | Notes |
|---|---|---|---|
| Spring | 20 March | 20 June | |
| Summer | 21 June | 22 September | |
| Autumn | 23 September | 20 December | Halloween and the start of Advent sit inside it |
| Winter | 21 December | 19 March | Wraps the new year; Christmas covers its first days |
| Halloween | 1 October | 1 November | Priority 1, over autumn |
| Christmas | 1 December | 26 December | Priority 1, over the end of autumn and the start of winter |

Switch a holiday off remotely and the nature season beneath it shows
instead: with Halloween disabled, October is autumn.

A season changes how things **look**. It never touches content, grading or
progress, so the parity rule (CONTRIBUTING.md) holds by construction.

## The layers

| Layer | Where | Knows about |
|---|---|---|
| **Engine** | `packages/seasons` (`@openmacro/seasons`) | Calendars, preferences, remote config. Nothing about OpenMacro; reusable in any app. |
| **Catalogue** | `packages/core/src/season.ts` | Which seasons, when, and everything each one is (a *pack*: palette, sky, particles, details, toy, strings). Shared by both clients. |
| **Visuals** | `src/seasons/visuals` (app: React Native, Reanimated, Gesture Handler); `web/src/components/site/seasons/visuals` (site: React and CSS) | App-agnostic primitives: plain props in, pixels out. No OpenMacro imports, so they can move into `packages/seasons` or another app as they are. |
| **Wrappers** | `src/components/ui/Seasonal*.tsx`, `src/theme/palette.ts` (app); `web/src/components/site/seasonal-*.tsx`, `web/src/components/site/seasons/*.tsx`, `web/src/lib/season*.ts` (site) | Read the live season, its pack, the theme and the strings, and hand plain values to the visuals. Nothing here names a season, except the site's optional artwork (`seasons/art.ts`). |

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
   footer on the site. Kept on the device. Turning it on throws a burst of
   the season out of the switch; on the site the page cross-fades into it.
4. **The calendar**, as moved by any remote `windows`, or a remote `force`.

The same function runs everywhere: in the app, in the site's runtime, and in
the site's inline pre-paint script, which is `decide` itself serialised with
`toString()`, not a copy. There is no second implementation to drift.

### Calm

The calm look keeps the colours and the still ornaments (the sky, the sun,
corners, the garland, the footer row, emoji swaps, the greeting) and drops
everything that moves, every popup, and anything marked `creepy` (the
spider, the bee). Flyers only ever appear in the full look, so calm has no
bats or butterflies either. Reduce Motion gets the same stillness
automatically, without losing the toy.

## One season, one object

A season is one plain `SeasonPack`, and both clients draw any pack with the
same components:

| Part | What it is | Drawn by |
|---|---|---|
| `strings` | Keys of its name, greeting, welcome and toy lines | the wrappers |
| `palette` | Its colours by role (`canvas`, `ink`, `accent`, `cool`…), light and dark | `seasonal` (app), `seasonStyles` (site) |
| `look.sky` | A few soft radial glows behind the top of each tab, breathing | `SkyGlow` |
| `look.sun` | A warm core and slowly turning rays | `Sun` |
| `look.motes` | Particles in depth, each layer a size, speed, sway and shape or emoji, with one motion character: `drift` (snow), `tumble` (petals), `flutter` (leaves), `pulse` (fireflies), `glint` (ice) | `ParticleField` |
| `look.garland` | Lights or emoji beads strung along the top of Today | `FairyLights` |
| `look.edge` | Snow, frost or fallen leaves on the hero card's top edge | `SnowCap`, `FrostRim`, `Scatter` |
| `look.mist` | Fog drifting, mist breathing or heat shimmering along the bottom of Today | `Mist` |
| `look.candle` | A flicker inside the footer's lit ornaments | `CandleGlow` |
| `look.burst` | The ring, gravity and spin of the burst on a correct answer | `Burst` |
| `toy` | The thing on a thread at the top of Today: `drop`, `swing`, `bounce` or `buzz` | `DraggableToy` |
| `flyer` | What crosses the top now and then: its path's wobble and waves, spin, wing beat, a gust's spacing | `Flyer` |
| `emoji`, `particles`, `welcome`, corners, `footer` | Emoji swaps, the burst and rain, the welcome, the ornaments | the wrappers |

Each season has its own signature: blossom garland, tumbling petals and
butterflies in spring; a turning sun, heat shimmer and fireflies in summer;
fluttering leaves, a gust and leaves settled on the hero card in autumn;
glinting ice, icicled frost and breathing mist in winter; fog, embers,
candlelit pumpkins and bats at Halloween; fairy lights, snow and a sleigh at
Christmas.

The site may draw a part with its own artwork instead (`seasons/art.ts`):
Halloween's SVG cobwebs, spider, bats and pumpkins. That is optional; a
season without it is complete.

## Switching a season off, now

The remote config is served from `https://openmacro.org/api/seasons`, read
from the `SEASONS_CONFIG` environment variable on the Cloud Run service. No
build, no release, no app update:

```sh
# Everything off
gcloud run services update openmacro-web --region <region> \
  --update-env-vars '^|^SEASONS_CONFIG={"version":1,"enabled":false}'

# Just one season off (a holiday falls back to the season beneath it)
gcloud run services update openmacro-web --region <region> \
  --update-env-vars '^|^SEASONS_CONFIG={"version":1,"disabled":["summer"]}'

# Back to the calendar
gcloud run services update openmacro-web --region <region> \
  --remove-env-vars SEASONS_CONFIG
```

(`^|^` changes gcloud's list separator, so the commas in the JSON survive.)

| Field | Effect |
|---|---|
| `"version": 1` | Required. Anything else is ignored. |
| `"enabled": false` | Every season off, for everyone. |
| `"disabled": ["halloween"]` | Those seasons off. A disabled holiday gives way to the nature season it sits inside. |
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
   with an `offset` in days. A window may wrap the new year. Give a holiday
   `priority: 1` to sit inside a nature season.
2. Strings: `season.<id>.name`, `.greeting`, `.welcome` and `.toy.1` to `.3` in
   every catalogue under `packages/core/src/i18n/ui/`.
3. `npm run check:seasons`. It fails if a catalogue misses a string, any text
   falls under WCAG AA on either client (on the canvas, the surfaces, under
   the sky and sun at their brightest, and under the mist), a glow runs past
   its band, anything twinkles, flickers or breathes faster than once a
   second, the particles exceed their cap, or the calendar leaves a day
   uncovered. The type checker covers the rest.

That is all: no component, no CSS, no palette file. Both clients draw the new
pack at once, with the same primitives.

Preview it any day with `?season=<id>` (or `?season=<id>:calm`) on the site,
or `EXPO_PUBLIC_SEASON=<id>` in a development build.

The app is light only (`userInterfaceStyle` in `app.json`), so its seasons are
seen in their light palette; the site follows the system in both.
