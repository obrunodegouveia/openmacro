# @openmacro/seasons

Seasonal themes for any React Native or React web app: spring blossom,
summer fireflies, autumn leaves, winter frost, Halloween and Christmas,
all year round, with a switch to turn them off from a server when one
misbehaves.

Install it, wrap the app in one provider, place one or two components, map
your colours. A season of your own (Carnival, Black Friday, Diwali, a
southern-hemisphere year) is one data object, never new component code.

Nothing in here knows about OpenMacro, which uses it exactly as described
below.

- [What you get](#what-you-get)
- [Install](#install)
- [Quick start: Expo / React Native](#quick-start-expo--react-native)
- [Quick start: Next.js (App Router)](#quick-start-nextjs-app-router)
- [Other React web apps](#other-react-web-apps)
- [Define your own season](#define-your-own-season)
- [Palette roles](#palette-roles)
- [Words and languages](#words-and-languages)
- [Artwork for a season](#artwork-for-a-season)
- [Seasonal music](#seasonal-music)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [The remote kill switch](#the-remote-kill-switch)
- [OTA safety: proving no native change](#ota-safety-proving-no-native-change)
- [API by entry point](#api-by-entry-point)
- [Building, testing, versioning](#building-testing-versioning)
- [Porting checklist](#porting-checklist)

## What you get

| Entry point | What | Needs |
|---|---|---|
| `@openmacro/seasons` | The engine: `decide`, `createSeasonController`, the remote config, `musicFor` | nothing |
| `@openmacro/seasons/presets` | Six seasons as data (`PRESET_PACKS`), calendars for both hemispheres, English and Portuguese strings, palette roles, `checkPack` | nothing |
| `@openmacro/seasons/native` | `SeasonProvider`, the decorations (`SeasonAtmosphere`, `SeasonToy`, `SeasonSky`, …) and the primitives underneath | react-native, reanimated 4, worklets, gesture-handler |
| `@openmacro/seasons/web` | `SeasonProvider`, `SeasonLayer` and the small decorations, the primitives, the boot script, `paletteCss` | react |
| `@openmacro/seasons/web/boot` | The server half: `createBootScript`, `paletteCss`, DOM helpers | nothing |
| `@openmacro/seasons/web/provider` | The provider, hooks, `SeasonGreeting`, `SeasonIcon`; no visuals | react |
| `@openmacro/seasons/web/styles.css` | Every style the web renderer draws with, one file | |
| `@openmacro/seasons/web/art/halloween` | Optional SVG artwork for Halloween (cobwebs, spider, bats, pumpkins) | react |
| `@openmacro/seasons/react` | `useSeasonDecision`, `useSeasonPreference` for any React | react |

Every peer is optional: the engine and the presets run on a server, in a
build script or in a test with nothing installed. `expo-haptics` is listed
as an optional peer for discoverability but never imported; haptics are a
callback (see `expoHaptics`).

## Install

Not on npm yet. Build it from this repository and install the folder or a
tarball:

```sh
npm run build:seasons                      # → packages/seasons/dist
npm install /path/to/openmacro/packages/seasons/dist
# or: (cd packages/seasons/dist && npm pack) and install the .tgz
```

Runnable examples: [`examples/expo`](examples/expo) and
[`examples/next`](examples/next) (each says `"@openmacro/seasons":
"file:../../dist"`, so build first).

## Quick start: Expo / React Native

Expo SDK 57 ships everything this needs in every binary
(`react-native-reanimated`, `react-native-worklets`,
`react-native-gesture-handler`), so seasons go out as an over-the-air
update. Wrap the app in `GestureHandlerRootView` if it is not already.

**1. A controller, created once, before the first frame.**

```ts
// seasons.ts
import { createSeasonController } from '@openmacro/seasons';
import { NORTHERN_CALENDAR } from '@openmacro/seasons/presets';

export const seasons = createSeasonController({
  calendar: NORTHERN_CALENDAR,              // or SOUTHERN_CALENDAR, or your own
  storage,                                  // optional: { get(key), set(key, value) }, synchronous
  remote: { url: 'https://example.com/seasons.json' }, // optional kill switch
  override: process.env.EXPO_PUBLIC_SEASON, // 'halloween', 'christmas:calm', 'none' for QA
});
```

Storage must be synchronous if you paint your palette from the season
(see step 4); `expo-file-system`'s `File` with `textSync()` works and adds
no native code. AsyncStorage answers after the first frame.

**2. One provider, at the root.**

```tsx
import * as Haptics from 'expo-haptics';
import { useIsFocused } from 'expo-router';
import { PRESET_PACKS, createTranslator } from '@openmacro/seasons/presets';
import { SeasonProvider, expoHaptics } from '@openmacro/seasons/native';

<SeasonProvider
  controller={seasons}
  packs={PRESET_PACKS}
  translate={createTranslator('en')}  // or your own t (see "Words and languages")
  feedback={expoHaptics(Haptics)}     // optional
  useFocused={useIsFocused}           // optional: loops pause on screens out of focus
>
  <Stack />
</SeasonProvider>
```

The provider also keeps the season current (midnight, returning to the
foreground, the remote config).

**3. Place the decorations.** Each renders nothing on an ordinary day.

```tsx
<View style={{ flex: 1 }}>
  <SeasonAtmosphere mist />          {/* first: sky, sun, far particles, mist */}
  <ScrollView>
    <SeasonGarland style={{ marginHorizontal: -16 }} />
    <SeasonGreeting />               {/* "🎃 Happy Halloween!" (read aloud) */}
    <Card style={{ overflow: 'visible' }}>
      <SeasonCardCorner />           {/* corner ornament + snow/frost/leaves on the edge */}
    </Card>
    <SeasonFooter />
  </ScrollView>
  <SeasonToy top={insets.top} left="66%" />  {/* last: the toy on a thread */}
</View>

// once, over the navigator (flyers, near particles):
<SeasonSky top={insets.top} />
```

Also: `SeasonScreenCorner`, `SeasonBurst` (a correct answer, a switch
turned on), `SeasonRain` (a finished task), `SeasonWelcome` (a greeting by
name; you decide when), `useSeasonEmoji('streak', '🔥')`,
`useSeasonSettings()` for an On/Calm/Off switch.

**4. Map the colours.** A season repaints by role; you say which of your
tokens each role is (see [Palette roles](#palette-roles)). If your
stylesheets read the palette when their modules load (the usual
`StyleSheet.create` pattern), paint from `seasons.boot.season`, which is
decided synchronously before any of them load, and offer a restart when
`useSeasonSettings().changedSinceLaunch` (OpenMacro reloads with
`Updates.reloadAsync()`). Decorations always follow the live decision.

Pass `chrome` to the provider if the package's own bits (the toy's thread
and speech bubble, the greeting pill, the welcome card) should use your
painted tokens rather than the season's roles.

## Quick start: Next.js (App Router)

**1. The boot script and the palette, inline in the root layout.** A static
or cached page cannot know the season when it is built: it is the
visitor's date, their choice and the last remote config their browser saw.
So a tiny inline script decides before first paint and sets `data-season`
on `<html>`; the palette CSS is keyed on it. No flash of the wrong colours.

```tsx
// app/layout.tsx (a server component)
import { createBootScript, paletteCss } from '@openmacro/seasons/web/boot';
import { NORTHERN_CALENDAR, PRESET_PACKS } from '@openmacro/seasons/presets';

const BOOT = createBootScript({ calendar: NORTHERN_CALENDAR });
const PALETTE = paletteCss(PRESET_PACKS, {
  map: (c, scheme) => ({ '--background': c.canvas, '--foreground': c.ink, '--primary': c.cool }),
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <style dangerouslySetInnerHTML={{ __html: PALETTE }} />
      </head>
      <body><Seasons>{children}</Seasons></body>
    </html>
  );
}
```

`createBootScript` serialises the engine's own `decide`, so the browser, the
runtime and a native app run one implementation. `?season=halloween`
(`:calm`, `none`) previews any season and sticks for the tab. With a
strict CSP, give the script a nonce or a hash.

**2. The provider, and the layer loaded lazily.** In a client component:

```tsx
'use client';
import dynamic from 'next/dynamic';
import { createSeasonController } from '@openmacro/seasons';
import { SeasonProvider } from '@openmacro/seasons/web/provider';
import { browserOverride, browserStorage } from '@openmacro/seasons/web/boot';

// The decorations and their CSS in one chunk, fetched only while a season is on.
const renderer = () => import('./renderer');   // './renderer.ts' below
const SeasonLayer = dynamic(() => renderer().then((m) => m.SeasonLayer), { ssr: false });

let controller = null;
const seasons = () =>
  typeof window === 'undefined' ? null :
  (controller ??= createSeasonController({ calendar: NORTHERN_CALENDAR, storage: browserStorage(), override: browserOverride() }));

export function Seasons({ children }) {
  return (
    <SeasonProvider controller={seasons()} packs={PRESET_PACKS}>
      {children}
      <SeasonLayer />            {/* <SeasonLayer minimal /> on pages that need focus */}
    </SeasonProvider>
  );
}
```

```ts
// renderer.ts
'use client';
import '@openmacro/seasons/web/styles.css';
export * from '@openmacro/seasons/web';
```

The provider keeps `<html>` dressed for the live decision (the visitor's
switch, the kill switch, midnight) and checks again when a tab comes back.
If you would rather load the CSS everywhere, import the stylesheet in the
root layout instead; it is 8 KB gzipped.

**3. The small ones.** `SeasonGreeting` and `SeasonIcon` come from
`/web/provider` (no visuals). `SeasonFooter`, `SeasonBurst`,
`SeasonCardEdge`, `SeasonRain` and `SeasonWelcome` from the lazy renderer,
behind a `useSeason()` check so nothing loads on an ordinary day:

```tsx
const Footer = dynamic(() => renderer().then((m) => m.SeasonFooter), { ssr: false });
export const SeasonalFooter = () => (useSeason() ? <Footer className="my-footer-edge" /> : null);
```

**4. Placement knobs, in your CSS:** `--sv-layer-top` (the height of a fixed
header the layer should start under), `--sv-toy-right`, `--sv-text-xs`. A
theme switch of your own: set `data-sv-scheme="dark"` on `<html>` and pass
`toggle: '.dark'` (or whatever selects your dark mode) to `paletteCss`.

**Lazy-loading a season's art:** see [Artwork for a season](#artwork-for-a-season).

## Other React web apps

Vite, Remix, Astro islands: the same three pieces. Put the boot script and
`paletteCss(...)` in your HTML `<head>` (generate them at build time with
the `web/boot` entry on Node), import `styles.css`, and mount
`SeasonProvider` and `SeasonLayer` (`React.lazy` works; the layer wraps art
in `Suspense`). The web entry renders on the server in plain React with no
bundler; this is checked on every build.

## Define your own season

A season is one `SeasonPack` and one calendar window. No component, no
CSS: both renderers draw any pack with the same parts.

```ts
import { PRESET_PACKS, NORTHERN_CALENDAR, createTranslator, checkPack, type SeasonPack } from '@openmacro/seasons/presets';
import type { SeasonWindow } from '@openmacro/seasons';

// Start from the nearest preset and change what makes it yours.
const carnival: SeasonPack = {
  ...PRESET_PACKS.summer,
  strings: { name: 'season.carnival.name', greeting: 'season.carnival.greeting', welcome: 'season.carnival.welcome', toy: ['season.carnival.toy.1', 'season.carnival.toy.2'] },
  particles: ['🎭', '🎉', '🪅', '🎊', '🥁', '🎺'],
  welcome: '🎭',
  toy: { emoji: '🪅', move: 'swing', creepy: false },
  flyer: { emoji: '🎊', count: 3, size: 22, lapMs: 8000, restMs: 12000, wobble: 20, waves: 2, spin: 360 },
  cardCorner: '🎭',
  screenCorner: '🎉',
  footer: [{ emoji: '🥁', size: 's' }, { emoji: '🎭', size: 'l' }, { emoji: '🎺', size: 'm', lift: true }],
  look: { ...PRESET_PACKS.summer.look, garland: { colors: ['#FF3B6B', '#FFC23D', '#2FBF71', '#3D7EFF'], count: 11, sag: 14, beatMs: 1800 } },
};

const calendar: SeasonWindow<string>[] = [
  ...NORTHERN_CALENDAR,
  // Carnival: the Friday before Shrove Tuesday (Easter − 51) to Ash Wednesday (Easter − 46).
  { id: 'carnival', from: { easter: -51 }, to: { easter: -46 }, priority: 1 },
  // Black Friday: the day after the fourth Thursday of November, to Cyber Monday.
  { id: 'black-friday', from: { month: 11, weekday: 4, nth: 4, offset: 1 }, to: { month: 11, weekday: 4, nth: 4, offset: 4 }, priority: 2 },
];

const blackFriday: SeasonPack = { ...PRESET_PACKS.autumn, /* strings, emoji, a palette of its own… */ };
const packs = { ...PRESET_PACKS, carnival, 'black-friday': blackFriday };
const translate = createTranslator('en', { 'season.carnival.name': 'Carnival', 'season.carnival.greeting': '🎭 Happy Carnival!', /* … */ });

checkPack(carnival); // [] — or every contrast and motion problem, in words
```

A toy with no good emoji can be drawn instead: `toy: { emoji: '🏐', shape:
'beach-ball', … }` draws a beach ball on both platforms (summer does). The
emoji stays as the fallback.

Date points are fixed days (`{ month, day }`), Easter-relative
(`{ easter: -47 }` is Shrove Tuesday), or the nth weekday of a month
(`{ month, weekday, nth }`, `nth: -1` for the last), each with an `offset`
in days. A window may wrap the new year. The highest `priority` wins the
days windows share, so a holiday sits inside a nature season.

Lunar holidays (Diwali, Eid, Lunar New Year) move by more than any rule
here can express: ship the window for this year in the calendar, and move
it each year with the remote config's `windows` (no release needed).

**Southern hemisphere:** `SOUTHERN_CALENDAR`, or `presetCalendar('south')`,
puts summer at Christmas and winter in July; `presetCalendar('south', {
holidays: false })` drops Halloween and Christmas. Pick by the user's
region; the calendar is plain data, so you can also build one per country.

## Palette roles

A pack's colours are written by role, for a light and a dark appearance.
Your app maps the roles onto its own tokens in one typed function; that is
the whole design-system integration.

| Role | Kind | Required | What it is |
|---|---|---|---|
| `canvas` | surface | yes | The page behind everything. |
| `surface` | surface | yes | Cards. |
| `raised` | surface | yes | Cards on cards, popovers, speech bubbles. |
| `well` | surface | yes | Sunken wells and insets. |
| `abyss` | surface | | The deepest shade, behind scrims. Dark only. |
| `hairline` | border | yes | Hairline borders. |
| `hairlineStrong` | border | yes | Stronger borders. |
| `ink` | text | yes | Body text and headings. |
| `inkMuted` | text | yes | Secondary text. |
| `inkFaint` | text | yes | The faintest text that still clears AA; threads and wires. |
| `accent` | fill | yes | The warm accent as a fill: a streak, points, a highlight. |
| `accentText` | text | yes | The warm accent as text. |
| `accentDeep` | fill | yes | A deeper warm fill, for pressed edges and bevels. |
| `accentSoft` | tint | yes | A pale warm wash, behind accent text (a greeting pill). |
| `cool` | fill | yes | The cool accent as a fill: primary actions, links. |
| `coolText` | text | yes | The cool accent as text. |
| `coolDeep` | fill | yes | A deeper cool fill, for a button's bevel. |
| `coolSoft` | tint | yes | A pale cool wash. |
| `link` | fill | | A third accent, where the cool one is too close to the text. |
| `correctText` | text | | Success green as text, deepened where the sky would wash it out. |
| `shadow` | tint | | The tint of drop shadows. Light only. |

Status colours ("correct" green, "wrong" red) are deliberately absent: they
mean the same thing all year.

```ts
// Native: your tokens, from the season painted at launch.
const season = seasons.boot.season;
const theme = season
  ? mapPalette(PRESET_PACKS[season].palette, (c) => ({ background: c.canvas, card: c.surface, text: c.ink, primary: c.cool, highlight: c.accent }))
  : ordinaryTheme;

// Web: the same mapping, as CSS variables keyed on data-season.
paletteCss(PRESET_PACKS, { map: (c, scheme) => ({ '--background': c.canvas, '--primary': c.cool }) });
```

`paletteCss` also writes every role as `--sv-<role>` (`--sv-ink`,
`--sv-accent-text`), which the web renderer's chrome reads and your CSS
may too. The list is `PALETTE_ROLES` in code.

## Words and languages

Packs hold keys, never text: `season.<id>.name`, `.greeting`, `.welcome`,
`.toy.1` to `.3`, plus a few for the chrome (`season.welcomeDismiss`,
`season.mode.auto` / `calm` / `off`, `season.settings.label` / `hint`,
`season.mode.calmHint`). English and European Portuguese are bundled
(`PRESET_STRINGS`).

- No i18n library: `createTranslator('pt-PT')`, `createTranslator('en', { 'season.summer.toy.2': '…' })`.
- Your own i18n: copy the keys into your catalogues and pass your `t` as
  `translate`. Type your packs as `SeasonPack<YourKey>` and the compiler
  refuses a season whose words are missing.

## Artwork for a season

Every pack draws with emoji, so it weighs nothing and needs no renderer.
Where you want more, the provider's `art` swaps a part for your component,
per season: on the web `corners`, `toy`, `flyer` (+ `flyerWidth`), `footer`;
on native `toy`, `flyer`, `footer`, `cardCorner`, `screenCorner`. A season
without art is complete.

The package ships Halloween's SVG artwork for the web as an example. Load
it lazily, so it is fetched only while Halloween is on:

```tsx
// Next.js
const halloween = () => import('@openmacro/seasons/web/art/halloween');
const art = {
  halloween: {
    corners: dynamic(() => halloween().then((m) => m.Cobwebs), { ssr: false }),
    toy: dynamic(() => halloween().then((m) => m.SpiderArt), { ssr: false }),
    flyer: dynamic(() => halloween().then((m) => m.BatArt), { ssr: false }),
    flyerWidth: '3rem',
    footer: dynamic(() => halloween().then((m) => m.HalloweenFooter), { ssr: false }),
  },
};
<SeasonProvider controller={…} packs={…} art={art}>

// Anywhere else: React.lazy(() => halloween().then((m) => ({ default: m.Cobwebs })))
// Or eagerly: import { halloweenArt } from '@openmacro/seasons/web/art/halloween'
```

On native, art must be plain views (or an SVG renderer you already ship):
adding a native module for a season would hold it back until the next
store build.

## Seasonal music

A pack may carry `music`: tracks with an `id`, a `title`, a `credit` and an
`asset` your app supplies (a `require()`d file, a URL). The package bundles
no audio and plays nothing; it only decides what should play:

```ts
import { musicFor } from '@openmacro/seasons';

const packs = { ...PRESET_PACKS, halloween: { ...PRESET_PACKS.halloween, music: [
  { id: 'marionette', title: 'Funeral March of a Marionette', credit: 'Charles Gounod', asset: require('./audio/marionette.m4a') },
  { id: 'mountain-king', title: 'In the Hall of the Mountain King', credit: 'Edvard Grieg', asset: require('./audio/mountain-king.m4a') },
] } };

musicFor(seasons.getSnapshot(), seasons.getPreference(), packs); // tracks, or null
```

The rule: a season's music plays only while that season is on, in the full
look, with the preference On. Calm, Off, a remote "calm everyone", an
ordinary day or a season without tracks all return `null`, which means
"play your app's default music". In React, `useSeasonMusic()` (native and
web) re-renders when the answer changes: switch playlists in an effect.

## Accessibility

- **Never covering content.** Decorations sit behind the page (sky, mist,
  far particles), in margins (garland, corners, toy), or cross only the band
  above the content (flyers). Only the toy takes a pointer; everything else
  ignores touches and clicks. The nearest particle layer, the only one in
  front, is capped at 0.75 opacity, one layer.
- **Screen readers.** Decorations are hidden (`aria-hidden`, and on native
  `accessibilityElementsHidden` / `importantForAccessibility`). The greeting
  and the welcome are words and are read; the welcome is a button with a
  hint (`season.welcomeDismiss`).
- **Reduce Motion** (`prefers-reduced-motion`, iOS/Android setting): nothing
  moves; still things stay (sky, sun, garland, corners, the toy, still),
  things that only make sense moving (flyers, rain, bursts) are not drawn.
- **Calm and Off.** Users choose On, Calm (colours and still ornaments, no
  motion, no popups, nothing marked `creepy` like the spider or the bee) or
  Off. `useSeasonSettings()` (native) and `useSeasonPreference` give you the
  switch's state; the strings are bundled. A remote `calm: true` calms
  everyone.
- **AA contrast.** `checkPack` holds every text role to 4.5:1 on every
  surface, in both appearances, and on the canvas under the sky (every glow
  at its brightest, the sun on top) and under the mist. Run it in CI over
  your own packs. If you map roles onto tokens, measure those too (OpenMacro
  does, in `scripts/check-seasons.mjs`, with the exported `contrast` and
  `atmosphereOver`).
- **No flashing.** Every twinkle, flicker, breath and shimmer is at least
  1 s per cycle (`MIN_CYCLE_MS`), far from 3 Hz; `checkPack` enforces it.

## Performance

- **Native:** every loop is a Reanimated CSS animation or a worklet on the
  UI thread; React renders nothing per frame. Loops pause when their screen
  loses focus (`useFocused`) or the app goes to the background. A field
  draws at most 40 particles (`MAX_PARTICLES`). No images, no SVG.
- **Web:** only `transform` and `opacity` animate, so everything composites
  without layout or paint. Animations hold while the tab is hidden. The
  pointer parallax writes two custom properties at most once a frame, and
  only with a fine pointer.
- **Bytes:** the stylesheet is 35 KB (8 KB gzipped). Load the renderer and
  the stylesheet lazily behind a `useSeason()` check and an ordinary day (or
  a user with seasons Off) downloads none of it; the always-loaded part is
  the provider and the presets' data. Measured on OpenMacro's home page:
  seasons Off cost +4.5 KB of uncompressed JS and no CSS; a season On adds
  one JS chunk and one CSS file.
- **First paint:** the boot script is a few KB and runs synchronously in
  `<head>`; the palette CSS is inline. Neither blocks on the network.

## The remote kill switch

Serve a JSON document and point the controller's `remote.url` at it:

```json
{ "version": 1, "enabled": false, "disabled": ["halloween"], "calm": true,
  "force": "winter", "windows": { "winter": { "from": { "month": 12, "day": 1 }, "to": { "month": 1, "day": 2 } } },
  "expires": "2027-01-03T00:00:00Z" }
```

Every field but `version` is optional; `{ "version": 1 }` changes nothing.
`enabled: false` turns every season off; `disabled` turns some off (a
disabled holiday gives way to the season beneath it); `calm` calms everyone;
`force` turns one on; `windows` moves one; `expires` makes sure none of it
outlives its reason. Validate it where you serve it with
`parseRemoteConfig(json, ids)`: a typo is rejected whole, never
half-applied. The controller caches the last good copy, refetches after
15 minutes (`maxAgeMs`) and never lets a failed fetch change what anyone
sees. It beats the user's own On, because it exists for the day a season
breaks something.

## OTA safety: proving no native change

Everything here is JavaScript on top of modules Expo already ships, so a
new season, a fixed palette or a whole new integration reaches users as an
EAS Update. Prove it for your app before you publish:

```sh
rm -rf ios android && npm ci
npx expo-updates fingerprint:generate --platform ios   # compare "hash" with your last build's
```

The hash must be unchanged. If it moved, something native changed (a new
dependency with native code, an `app.json` plugin): that needs a store
build, not an update. Don't import `expo-haptics` or an SVG renderer for a
season unless your binary already has them.

## API by entry point

**`@openmacro/seasons`**: `decide`, `createSeasonController` (`boot`,
`getSnapshot`, `subscribe`, `getPreference`, `setPreference`, `update`,
`refresh`, `start`), `parseRemoteConfig`, `fetchRemoteConfig`,
`EMPTY_REMOTE_CONFIG`, `isDatePoint`, `musicFor`; types `SeasonWindow`,
`DatePoint`, `SeasonDecision`, `SeasonLook`, `SeasonPreference`,
`RemoteSeasonConfig`, `SeasonTrack`.

**`/presets`**: `PRESET_PACKS`, `PRESET_IDS`, `NORTHERN_CALENDAR`,
`SOUTHERN_CALENDAR`, `presetCalendar`, `PRESET_STRINGS`,
`createTranslator`, `presetLocale`, `interpolate`, `presetStrings`,
`toyReaction`, `PALETTE_ROLES`, `TEXT_ROLES`, `SURFACE_ROLES`,
`mapPalette`, `checkPack`, `contrast`, `luminance`, `composite`,
`worstSky`, `atmosphereOver`, the optics constants (`GLOW_FALLOFF`,
`MAX_PARTICLES`, `MIN_CYCLE_MS`, …); types `SeasonPack`, `SeasonColors`,
`SeasonPalette`, `SeasonScene` and its parts.

**`/native`**: `SeasonProvider`, `useSeason`, `useSeasonEmoji`,
`useSeasonMusic`, `useSeasonSettings`, `useSeasonScheme`, `useAwake`,
`SeasonAtmosphere`, `SeasonSky`, `SeasonToy`, `SeasonGarland`,
`SeasonCardCorner`, `SeasonScreenCorner`, `SeasonFooter`, `SeasonGreeting`,
`SeasonIcon`, `SeasonBurst`, `SeasonRain`, `SeasonWelcome`,
`chromeFromPalette`, `expoHaptics`; primitives `SkyGlow`, `Sun`, `Mist`,
`ParticleField`, `FairyLights`, `DraggableToy`, `Flyer`, `Burst`,
`EmojiRain`, `CandleGlow`, `SnowCap`, `FrostRim`, `Scatter`,
`WelcomeStage`.

**`/web`**: everything in `/web/boot` and `/web/provider`, plus
`SeasonLayer`, `SeasonFooter`, `SeasonBurst`, `SeasonCardEdge`,
`SeasonRain`, `SeasonWelcome`, `startSeasonRuntime`; primitives `SkyGlow`,
`Sun`, `Mist`, `ParticleField`, `FairyLights`, `DraggableToy`, `Flyer`,
`Burst`, `CandleGlow`, `SnowCap`, `FrostRim`, `Scatter`, `WelcomeStage`,
`useVisualsRuntime`.

**`/web/boot`**: `createBootScript`, `paletteCss`, `roleVariable(s)`,
`applyDecision`, `browserStorage`, `browserOverride`, `storageKeys`,
`SEASON_ATTRIBUTE`, `LOOK_ATTRIBUTE`.

**`/web/provider`**: `SeasonProvider`, `useSeason`, `useSeasonEmoji`,
`useSeasonMusic`, `useReducedMotion`, `useSeasonContext`,
`startSeasonRuntime`, `SeasonGreeting`, `SeasonIcon`.

## Building, testing, versioning

```sh
npm test --workspace @openmacro/seasons   # Node's own runner, no build step
npm run typecheck:seasons
npm run build:seasons && npm run verify:seasons
```

The tests include running the serialised boot script in an empty `vm`
context, every preset through `checkPack`, both calendars over a common and
a leap year, and a portability check that no file in `src/` imports the
host app or a peer its entry point does not declare (the engine, the
presets and `web/boot` import nothing at all).

`verify:seasons` packs `dist/`, installs the tarball into an empty project
and, as that project: runs the engine, presets and `web/boot` on plain
Node with no React; renders the web entry and every primitive server-side
with `react-dom/server`; and type-checks a consumer of `presets`, `web`
and `native` with `nodenext` resolution. CI runs it on every change.

Versions follow semver; see CHANGELOG.md.

## Porting checklist

For a person or an agent adding seasons to another app. Do these in order;
each is small.

1. **Install** the built package (`npm run build:seasons`, then install
   `packages/seasons/dist` or its tarball). On Expo, check the app already
   has reanimated 4, worklets and gesture-handler; if not, adding them is a
   native change and needs a store build first.
2. **Fingerprint before.** Expo: note `npx expo-updates
   fingerprint:generate --platform ios`'s hash.
3. **Controller.** `createSeasonController({ calendar, storage, remote,
   override })` in its own module, created at import time. Pick
   `NORTHERN_CALENDAR`, `SOUTHERN_CALENDAR` or your own.
4. **Provider** at the root: `controller`, `packs` (`PRESET_PACKS` or
   yours), `translate`; on native `feedback` and `useFocused`; on the web
   `art` if any.
5. **Web only:** inline `createBootScript` and `paletteCss` in the root
   layout's `<head>`; import `styles.css` (lazily with the renderer, ideally);
   set `--sv-layer-top` if there is a fixed header.
6. **Place decorations:** native `SeasonAtmosphere` first and `SeasonToy`
   last in the home screen, `SeasonSky` once over the navigator; web
   `SeasonLayer` once (`minimal` on focused pages). Then whatever small ones
   fit: greeting, footer, card corner/edge, burst, rain, emoji swaps. Keep
   them off screens where the user needs to concentrate.
7. **Map colours:** one function from roles to your tokens (`mapPalette` /
   `paletteCss({ map })`). Native apps that bake the palette at launch paint
   from `controller.boot.season`.
8. **Words:** your `t`, or `createTranslator`. Add the keys to every
   catalogue you ship.
9. **Settings:** an On/Calm/Off switch from `useSeasonSettings()` (native)
   or `useSeasonDecision` + `useSeasonPreference`, shown only while
   `available` is set; the labels are bundled.
10. **Check:** `checkPack` over every pack in a test; your own tokens'
    contrast under `atmosphereOver`; screenshots with `?season=<id>` (web) or
    `EXPO_PUBLIC_SEASON=<id>` (native) for each season, light and dark,
    with Reduce Motion on.
11. **Fingerprint after:** the same hash. Then ship as an update.
