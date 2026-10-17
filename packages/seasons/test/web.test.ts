import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import vm from 'node:vm';

import { decide } from '../src/engine.ts';
import type { SeasonWindow } from '../src/types.ts';
import { applyDecision, createBootScript } from '../src/web/boot.ts';

const CALENDAR: SeasonWindow<'halloween' | 'christmas'>[] = [
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
  { id: 'christmas', from: { month: 12, day: 1 }, to: { month: 12, day: 26 } },
];

function storage(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial };
  return { data, getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v) };
}

/**
 * Runs the boot script in a fresh context holding nothing but what a browser
 * would give it, on a given date.
 */
function boot(options: { now: number; search?: string; local?: Record<string, string>; session?: Record<string, string> }) {
  const attributes: Record<string, string> = {};
  const session = storage(options.session);
  const RealDate = Date;
  class FixedDate extends RealDate {
    constructor(...args: [] | [number]) {
      super(...((args.length ? args : [options.now]) as [number]));
    }
    static override now() {
      return options.now;
    }
  }
  const context = {
    Date: FixedDate,
    location: { search: options.search ?? '' },
    URLSearchParams,
    sessionStorage: session,
    localStorage: storage(options.local),
    document: { documentElement: { setAttribute: (k: string, v: string) => void (attributes[k] = v) } },
  };
  vm.runInNewContext(createBootScript({ calendar: CALENDAR }), context);
  return { attributes, session: session.data };
}

const OCTOBER = new Date(2026, 9, 10, 12).getTime();

describe('decide, serialised', () => {
  it('runs on its own, with nothing from the module around it', () => {
    // An empty context: if `decide` reached for an import, a helper or a
    // closure, this throws ReferenceError.
    const isolated = vm.runInNewContext(`(${decide.toString()})`) as typeof decide;
    for (const now of [OCTOBER, new Date(2026, 6, 1).getTime(), new Date(2026, 11, 25).getTime()]) {
      assert.deepEqual({ ...isolated({ now, calendar: CALENDAR }) }, decide({ now, calendar: CALENDAR }));
    }
  });
});

describe('createBootScript', () => {
  it('sets the season and the look on <html> before first paint', () => {
    assert.deepEqual(boot({ now: OCTOBER }).attributes, { 'data-season': 'halloween', 'data-season-look': 'full' });
    assert.deepEqual(boot({ now: new Date(2026, 6, 1).getTime() }).attributes, {});
  });

  it('reads the viewer’s preference and the cached remote config', () => {
    assert.deepEqual(boot({ now: OCTOBER, local: { 'seasons.preference': 'off' } }).attributes, {});
    assert.equal(boot({ now: OCTOBER, local: { 'seasons.preference': 'calm' } }).attributes['data-season-look'], 'calm');
    const killed = JSON.stringify({ config: { version: 1, enabled: false }, fetchedAt: 1 });
    assert.deepEqual(boot({ now: OCTOBER, local: { 'seasons.remote': killed } }).attributes, {});
  });

  it('obeys ?season= and remembers it for the tab', () => {
    const first = boot({ now: OCTOBER, search: '?season=christmas:calm' });
    assert.deepEqual(first.attributes, { 'data-season': 'christmas', 'data-season-look': 'calm' });
    assert.equal(first.session['seasons.override'], 'christmas:calm');
    assert.equal(boot({ now: OCTOBER, session: first.session }).attributes['data-season'], 'christmas');
    assert.deepEqual(boot({ now: OCTOBER, search: '?season=none' }).attributes, {});
  });

  it('survives corrupt storage, and storage that throws', () => {
    assert.equal(boot({ now: OCTOBER, local: { 'seasons.remote': '{not json' } }).attributes['data-season'], 'halloween');
    const throwing = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
    const attributes: Record<string, string> = {};
    vm.runInNewContext(createBootScript({ calendar: CALENDAR }), {
      Date,
      location: { search: '' },
      URLSearchParams,
      sessionStorage: throwing,
      localStorage: throwing,
      document: { documentElement: { setAttribute: (k: string, v: string) => void (attributes[k] = v) } },
    });
    // On whatever today is: it must simply not throw, and decide alone.
    assert.equal(attributes['data-season'] ?? null, decide({ now: Date.now(), calendar: CALENDAR }).season);
  });
});

describe('applyDecision', () => {
  it('sets and clears the attributes', () => {
    const attributes = new Map<string, string>();
    const element = {
      setAttribute: (k: string, v: string) => attributes.set(k, v),
      removeAttribute: (k: string) => attributes.delete(k),
    } as unknown as Element;
    applyDecision(element, { season: 'halloween', look: 'calm', available: 'halloween', reason: 'calendar' });
    assert.equal(attributes.get('data-season-look'), 'calm');
    applyDecision(element, { season: null, look: 'full', available: 'halloween', reason: 'preference-off' });
    assert.equal(attributes.size, 0);
  });
});

describe('paletteCss', () => {
  it('writes every role in both appearances, and the app’s own variables', async () => {
    const { paletteCss } = await import('../src/web/palette.ts');
    const { PRESET_PACKS } = await import('../src/presets/index.ts');
    const css = paletteCss({ winter: PRESET_PACKS.winter }, { map: (c) => ({ '--brand-bg': c.canvas }) });
    const [base, media] = css.split('@media (prefers-color-scheme: dark)') as [string, string];
    assert.match(base, /:root\[data-season="winter"\] \{/);
    assert.match(base, new RegExp(`--sv-ink: ${PRESET_PACKS.winter.palette.light.ink}`));
    assert.match(media, new RegExp(`--sv-ink: ${PRESET_PACKS.winter.palette.dark.ink}`));
    assert.match(media, new RegExp(`--brand-bg: ${PRESET_PACKS.winter.palette.dark.canvas}`));
    // A role one appearance leaves out never leaks into the other; abyss stands in as well.
    assert.doesNotMatch(css, /--sv-shadow/);
    assert.match(base, new RegExp(`--sv-abyss: ${PRESET_PACKS.winter.palette.light.well}`));
    const vars = (block: string) => [...block.matchAll(/(--[\w-]+):/g)].map((m) => m[1]).sort();
    assert.deepEqual(vars(base), vars(media));
  });

  it('follows a class toggle instead of the media query', async () => {
    const { paletteCss } = await import('../src/web/palette.ts');
    const { PRESET_PACKS } = await import('../src/presets/index.ts');
    const css = paletteCss({ spring: PRESET_PACKS.spring }, { toggle: '.dark', extra: (_id, selector) => `${selector} .x {}` });
    assert.match(css, /:root\[data-season="spring"\]\.dark \{/);
    assert.doesNotMatch(css, /@media/);
    assert.match(css, /:root\[data-season="spring"\] \.x \{\}/);
  });
});
