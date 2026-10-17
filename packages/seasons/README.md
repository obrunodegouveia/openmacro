# @openmacro/seasons

Seasonal themes for any app: Halloween in October, snow in December, and a
switch to turn it all off from a server when it misbehaves. Zero runtime
dependencies, framework-free at the core, with React hooks and a pre-paint
boot script for the web.

Nothing in here knows about OpenMacro. Copy the folder into another project
and it works.

## What it does

- **Calendars that match real holidays.** Fixed days, windows that wrap the
  new year, Easter-relative feasts (computed for any year), and "the fourth
  Thursday of November". All in the viewer's local time.
- **One decision function**, `decide`, that weighs a QA override, a remote
  kill switch, the viewer's own preference and the calendar, in that order.
- **Three looks**: full, calm (colours and still ornaments, no motion, no
  popups), and off.
- **Remote control without a release**: switch every season off, calm
  everyone, force a season, move a window, all with an expiry, validated
  strictly so a typo is rejected rather than half-applied.
- **No flash of the wrong theme on the web.** `createBootScript` serialises
  `decide` itself into an inline script, so the static page is dressed
  before first paint by the same code that runs everywhere else.
- **Offline-safe.** The remote config is cached; a failed fetch keeps what was
  there. Storage is distrusted and revalidated on every read.

## Use

```ts
import { createSeasonController } from '@openmacro/seasons';

const seasons = createSeasonController({
  calendar: [
    { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
    { id: 'winter', from: { month: 12, day: 15 }, to: { month: 1, day: 6 } },
    { id: 'carnival', from: { easter: -52 }, to: { easter: -47 } },
  ],
  storage, // { get(key), set(key, value) }, synchronous
  remote: { url: 'https://example.com/seasons.json' },
  override: process.env.SEASON, // 'winter', 'winter:calm', 'none'
});

seasons.boot;          // decided once, before the first frame
seasons.getSnapshot(); // live: { season, look, available, reason }
seasons.setPreference('calm');
const stop = seasons.start(); // midnight rollover + remote refresh
```

React (DOM or Native):

```tsx
import { useSeasonDecision, useSeasonPreference } from '@openmacro/seasons/react';

const { season, look } = useSeasonDecision(seasons);
```

Web, in the root layout on the server:

```tsx
import { createBootScript } from '@openmacro/seasons/web';

<script dangerouslySetInnerHTML={{ __html: createBootScript({ calendar }) }} />
```

Then style with `:root[data-season="winter"]` and
`[data-season-look="calm"]`, and call `applyDecision(document.documentElement,
seasons.getSnapshot())` on change to repaint live.

## The remote config

```json
{ "version": 1, "enabled": false, "disabled": ["halloween"], "calm": true,
  "force": "winter", "windows": { "winter": { "from": { "month": 12, "day": 1 }, "to": { "month": 1, "day": 2 } } },
  "expires": "2027-01-03T00:00:00Z" }
```

Every field is optional except `version`. Validate it where it is served
with `parseRemoteConfig(json, ids)`.

## Seasons inside seasons

Windows may overlap. Give the shorter one a higher `priority` and it wins
the days they share: a year of four nature seasons with Halloween
(`priority: 1`) inside autumn shows Halloween in October and autumn either
side of it. Switch a nested season off remotely (`"disabled": ["halloween"]`)
and the one beneath it shows instead; only when every window that applies
is disabled is the answer "off". A calendar without overlaps behaves exactly
as it always did.

## Tests

```sh
npm test --workspace @openmacro/seasons
```

Runs on Node's own test runner with type stripping, no build step. The suite
includes running the serialised boot script in an empty `vm` context, so a
change that makes `decide` depend on anything outside itself fails here
rather than in a visitor's browser.
