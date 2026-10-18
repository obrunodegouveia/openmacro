/**
 * Proves the built package works in a project that is not this one.
 *
 * Packs `dist/` into a tarball and installs it into an empty temporary
 * project, then, as that project:
 *
 * 1. runs the engine, the presets and the web's server half on plain Node,
 *    with no React installed at all;
 * 2. renders the web entry server-side with `react-dom/server`: the
 *    provider, the layer, the small decorations and every primitive, fed
 *    with the presets, in plain React with no bundler and no CSS loader;
 * 3. type-checks a consumer of `presets`, `web` and `native` with Node's
 *    own module resolution (`nodenext`), as another app's tsc would.
 *
 * The peers (React, React DOM, React Native and friends) are linked in from
 * this repository's node_modules rather than downloaded, so the check runs
 * offline and in seconds; the package itself comes only from the tarball.
 * Run `npm run build` first.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The nearest folder above `from` holding a `node_modules/<name>`.
 *
 * @param from Where to start.
 * @param name A path inside node_modules.
 * @return The absolute path found.
 */
function findModule(from, name) {
  for (let dir = from; ; dir = dirname(dir)) {
    const candidate = join(dir, 'node_modules', name);
    if (existsSync(candidate)) return candidate;
    if (dirname(dir) === dir) throw new Error(`${name} not found; run npm ci at the repository root`);
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tsc = join(findModule(root, 'typescript-native'), 'bin', 'tsc');
const work = mkdtempSync(join(tmpdir(), 'seasons-consumer-'));
const run = (cmd, args, cwd = work) => execFileSync(cmd, args, { cwd, stdio: 'pipe', encoding: 'utf8' });

/** The peers a consumer brings, linked from this repository. */
const PEERS = ['react', 'react-dom', 'scheduler', '@types/react', '@types/react-dom', 'react-native', 'react-native-reanimated', 'react-native-gesture-handler', 'react-native-worklets', 'csstype'];

/**
 * Links the peers into the consumer's node_modules.
 *
 * @param names Which.
 */
function linkPeers(names) {
  for (const name of names) {
    const target = join(work, 'node_modules', name);
    mkdirSync(dirname(target), { recursive: true });
    if (!existsSync(target)) symlinkSync(findModule(root, name), target, 'dir');
  }
}

try {
  const tarball = run('npm', ['pack', '--silent', '--pack-destination', work], join(root, 'dist')).trim().split('\n').pop();
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }));
  run('npm', ['install', '--silent', '--no-audit', '--no-fund', '--legacy-peer-deps', join(work, tarball)]);

  // 1. Plain Node, no React anywhere: the engine, the presets, the server half.
  writeFileSync(join(work, 'run.mjs'), `
    import { decide, musicFor, parseRemoteConfig } from '@openmacro/seasons';
    import { NORTHERN_CALENDAR, PRESET_IDS, PRESET_PACKS, SOUTHERN_CALENDAR, checkPack, createTranslator } from '@openmacro/seasons/presets';
    import { createBootScript, paletteCss } from '@openmacro/seasons/web/boot';
    const calendar = [{ id: 'winter', from: { month: 12, day: 15 }, to: { month: 1, day: 6 } }];
    if (decide({ calendar, now: new Date(2026, 11, 20) }).season !== 'winter') throw new Error('expected winter');
    if (decide({ calendar: SOUTHERN_CALENDAR, now: new Date(2027, 0, 15).getTime() }).season !== 'summer') throw new Error('expected a southern summer');
    if (decide({ calendar: NORTHERN_CALENDAR, now: new Date(2027, 9, 15).getTime() }).season !== 'halloween') throw new Error('expected halloween');
    for (const id of PRESET_IDS) if (checkPack(PRESET_PACKS[id]).length) throw new Error(id + ' fails checkPack');
    if (createTranslator('pt-PT')('season.christmas.name') !== 'Natal') throw new Error('no Portuguese');
    if (!createBootScript({ calendar: NORTHERN_CALENDAR }).includes('data-season')) throw new Error('boot script missing');
    if (!paletteCss(PRESET_PACKS).includes('--sv-ink')) throw new Error('palette css missing');
    if (musicFor({ season: 'winter', look: 'full' }, 'auto', { winter: { music: [{ id: 'a', title: 'A', credit: 'B', asset: 1 }] } })?.length !== 1) throw new Error('music');
    parseRemoteConfig({ version: 1, calm: true }, PRESET_IDS);
    console.log('node ok');
  `);
  console.log(run(process.execPath, ['run.mjs']).trim());

  linkPeers(PEERS);

  // 2. The web entry, rendered on the server in plain React.
  writeFileSync(join(work, 'ssr.mjs'), `
    import { createElement as h } from 'react';
    import { renderToString } from 'react-dom/server';
    import { createSeasonController } from '@openmacro/seasons';
    import { NORTHERN_CALENDAR, PRESET_IDS, PRESET_PACKS } from '@openmacro/seasons/presets';
    import * as web from '@openmacro/seasons/web';
    import { halloweenArt } from '@openmacro/seasons/web/art/halloween';
    const controller = createSeasonController({ calendar: NORTHERN_CALENDAR, override: 'christmas' });
    // The composition, as an app mounts it: on the server it renders no decorations, and must not crash.
    const app = renderToString(
      h(web.SeasonProvider, { controller, packs: PRESET_PACKS, art: { halloween: halloweenArt } },
        h('main', null, h(web.SeasonGreeting), h(web.SeasonIcon, { role: 'streak' }, '🔥'), h(web.SeasonCardEdge), h(web.SeasonFooter), h(web.SeasonBurst), h(web.SeasonRain), h(web.SeasonWelcome, { name: 'Maria', onDismiss() {} })),
        h(web.SeasonLayer)),
    );
    if (!app.includes('🔥')) throw new Error('the ordinary icon is missing on the server');
    // Every primitive, drawn from every preset.
    let html = '';
    for (const id of PRESET_IDS) {
      const { look, particles, toy, flyer, footer } = PRESET_PACKS[id];
      html += renderToString(h('div', null,
        h(web.SkyGlow, { glows: look.sky.glows, height: look.sky.height, breatheMs: look.sky.breatheMs, animate: true }),
        look.sun ? h(web.Sun, { ...look.sun, band: look.sky.height, animate: true }) : null,
        look.mist ? h(web.Mist, { ...look.mist, animate: true }) : null,
        h(web.ParticleField, { layers: look.motes.layers, placement: 'behind', colors: look.motes.colors, glow: look.motes.glow, direction: look.motes.direction, motion: look.motes.motion, wind: look.motes.wind }),
        look.garland ? h(web.FairyLights, { colors: look.garland.colors, beads: look.garland.beads, count: look.garland.count, swags: 2, sag: look.garland.sag, twinkleMs: look.garland.beatMs, wire: '#888888', animate: true }) : null,
        h(web.DraggableToy, { rest: '1rem', move: toy.move, animate: true }, toy.emoji),
        flyer ? h(web.Flyer, { top: '5vh', width: 'auto', lapMs: flyer.lapMs, restMs: flyer.restMs, delay: 0, wobble: flyer.wobble, waves: flyer.waves, seed: 1 }, 'x') : null,
        h(web.Burst, { particles, ring: look.burst.ring, gravity: look.burst.gravity, spin: look.burst.spin }),
        h(web.CandleGlow, { color: '#ff8a1f', flickerMs: 2000, offset: 0, animate: true }, footer[0].emoji),
        h(web.SnowCap, { color: { light: '#ffffff', dark: '#eeeeee' }, shade: '#888888' }),
        h(web.FrostRim, { color: { light: '#7fb0de', dark: '#ddebff' }, animate: true }),
        h(web.Scatter, { emoji: ['🍂'] }),
        h(web.WelcomeStage, { emoji: '🎅', title: 'Hi', particles, glow: look.burst.ring, animate: true, onDismiss() {} }),
      ));
    }
    if (!html.includes('sv-sky') || !html.includes('sv-toy')) throw new Error('primitives rendered nothing');
    console.log('ssr ok (' + Math.round(html.length / 1024) + ' KB of HTML from six seasons)');
  `);
  console.log(run(process.execPath, ['ssr.mjs']).trim());

  // 3. Type-checks as a TypeScript consumer would see it, every entry point.
  writeFileSync(join(work, 'consumer.ts'), `
    import { createSeasonController, musicFor, type SeasonWindow, type SeasonTrack } from '@openmacro/seasons';
    import type { SeasonDecision } from '@openmacro/seasons/types';
    import { PRESET_PACKS, SOUTHERN_CALENDAR, createTranslator, mapPalette, type PresetId, type SeasonPack } from '@openmacro/seasons/presets';
    import { paletteCss } from '@openmacro/seasons/web/boot';
    import { SeasonProvider as WebProvider, SeasonLayer, SeasonFooter, useSeason as useWebSeason } from '@openmacro/seasons/web';
    import { SeasonProvider as NativeProvider, SeasonAtmosphere, SeasonToy, SeasonSky, expoHaptics, useSeasonMusic, type SeasonChrome } from '@openmacro/seasons/native';
    import { createElement as h } from 'react';

    // A season of your own: one object, no component code.
    type Id = PresetId | 'carnival';
    const carnival: SeasonPack = { ...PRESET_PACKS.summer, strings: { name: 'season.carnival.name', greeting: 'season.carnival.greeting', welcome: 'season.carnival.welcome', toy: ['season.carnival.toy.1'] } };
    const packs: Record<Id, SeasonPack> = { ...PRESET_PACKS, carnival };
    const calendar: SeasonWindow<Id>[] = [...SOUTHERN_CALENDAR, { id: 'carnival', from: { easter: -52 }, to: { easter: -47 }, priority: 2 }];
    const store = new Map<string, string>();
    const c = createSeasonController({ calendar, storage: { get: (k) => store.get(k) ?? null, set: (k, v) => { store.set(k, v); } } });
    const d: SeasonDecision<Id> = c.getSnapshot();
    export const look: string = d.look;
    export const t = createTranslator('en', { 'season.carnival.name': 'Carnival' });
    export const tokens = mapPalette(packs.carnival.palette, (colors) => ({ bg: colors.canvas, fg: colors.ink }));
    export const css: string = paletteCss(packs, { map: (colors) => ({ '--bg': colors.canvas }) });
    export const music: readonly SeasonTrack<number>[] | null = musicFor(d, 'auto', { carnival: { music: [{ id: 'samba', title: 'Samba', credit: 'You', asset: 1 }] } });
    export const web = h(WebProvider<Id, string>, { controller: c, packs, translate: t }, h(SeasonLayer, { minimal: false }), h(SeasonFooter, { className: 'x' }));
    export function WebUser() { return useWebSeason<Id>()?.id ?? null; }
    const chrome = (): SeasonChrome => ({ thread: '#888', bubble: { background: '#fff', border: '#ddd', text: '#000' }, greeting: { background: '#fee', text: '#a00' }, welcome: { scrim: '#000b', surface: '#fff', border: '#fa0', title: '#a50' } });
    export const native = h(NativeProvider<Id, string>, { controller: c, packs, translate: t, chrome, feedback: () => {} }, h(SeasonAtmosphere, { mist: true }), h(SeasonToy, { top: 47 }), h(SeasonSky, { top: 47 }));
    export function NativeUser() { return useSeasonMusic<number>()?.length ?? 0; }
    export const haptics = expoHaptics;
  `);
  writeFileSync(join(work, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { target: 'ES2022', module: 'nodenext', moduleResolution: 'nodenext', strict: true, noEmit: true, skipLibCheck: true, lib: ['ES2022', 'DOM'], types: [], jsx: 'react-jsx' },
    files: ['consumer.ts'],
  }));
  run(process.execPath, [tsc, '-p', join(work, 'tsconfig.json')]);
  // The package's own declarations, checked in full (the peers' are not ours to check).
  writeFileSync(join(work, 'tsconfig.ours.json'), JSON.stringify({
    compilerOptions: { target: 'ES2022', module: 'nodenext', moduleResolution: 'nodenext', strict: true, noEmit: true, skipLibCheck: false, lib: ['ES2022', 'DOM'], types: [] },
    files: ['node_modules/@openmacro/seasons/index.d.ts', 'node_modules/@openmacro/seasons/presets/index.d.ts', 'node_modules/@openmacro/seasons/web/boot.d.ts'],
  }));
  run(process.execPath, [tsc, '-p', join(work, 'tsconfig.ours.json')]);
  console.log('types ok (presets, web, native, nodenext)');
} catch (error) {
  console.error(error.stdout ?? '', error.stderr ?? '', error.message);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
