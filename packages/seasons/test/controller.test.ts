import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createSeasonController, type SeasonStorage } from '../src/controller.ts';
import { fetchRemoteConfig, parseRemoteConfig } from '../src/remote.ts';
import type { SeasonWindow } from '../src/types.ts';

const CALENDAR: SeasonWindow<'halloween' | 'christmas'>[] = [
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
  { id: 'christmas', from: { month: 12, day: 1 }, to: { month: 12, day: 26 } },
];
const IDS = ['halloween', 'christmas'];
const OCTOBER = new Date(2026, 9, 10, 12).getTime();

function memoryStorage(initial: Record<string, string> = {}): SeasonStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return { data, get: (key) => data[key] ?? null, set: (key, value) => void (data[key] = value) };
}

/** A fetch that answers with a body, and counts its calls. */
function stubFetch(body: unknown, status = 200) {
  const calls: string[] = [];
  const fn = (async (url: string) => {
    calls.push(url);
    return new Response(JSON.stringify(body), { status });
  }) as unknown as typeof fetch;
  return { fn, calls };
}

describe('parseRemoteConfig', () => {
  it('accepts the empty config and a full one', () => {
    assert.deepEqual(parseRemoteConfig({ version: 1 }, IDS), { ok: true, config: { version: 1 } });
    const full = {
      version: 1,
      enabled: true,
      disabled: ['halloween'],
      calm: false,
      force: null,
      windows: { christmas: { from: { month: 11, weekday: 4, nth: 4, offset: 1 }, to: { easter: 0 } } },
      expires: '2026-12-31T00:00:00Z',
    };
    assert.equal(parseRemoteConfig(full, IDS).ok, true);
  });

  it('rejects a typo whole, and says what is wrong', () => {
    const result = parseRemoteConfig({ version: 1, disabled: ['halloweeen'], enabeld: false }, IDS);
    assert.equal(result.ok, false);
    assert.deepEqual(!result.ok && result.errors, [
      'unknown field "enabeld"',
      '"disabled" names an unknown season: "halloweeen"',
    ]);
    for (const bad of [null, [], 'x', { version: 2 }, { version: 1, windows: { christmas: { from: { month: 13, day: 1 }, to: { month: 1, day: 1 } } } }, { version: 1, expires: 'soon' }]) {
      assert.equal(parseRemoteConfig(bad, IDS).ok, false, JSON.stringify(bad));
    }
  });
});

describe('fetchRemoteConfig', () => {
  it('returns null rather than throwing on any failure', async () => {
    const source = (fetch: typeof globalThis.fetch) => ({ url: 'https://example.test/seasons', fetch });
    assert.equal(await fetchRemoteConfig(source(stubFetch({ version: 1 }, 500).fn), IDS), null);
    assert.equal(await fetchRemoteConfig(source(stubFetch({ version: 1, disabled: ['nope'] }).fn), IDS), null);
    assert.equal(await fetchRemoteConfig(source((async () => { throw new Error('offline'); }) as never), IDS), null);
    assert.deepEqual(await fetchRemoteConfig(source(stubFetch({ version: 1, calm: true }).fn), IDS), { version: 1, calm: true });
  });

  it('gives up after its timeout', async () => {
    const hang = ((_: string, init: RequestInit) =>
      new Promise((_resolve, reject) => init.signal?.addEventListener('abort', () => reject(new Error('aborted'))))) as never;
    const started = Date.now();
    assert.equal(await fetchRemoteConfig({ url: 'x', fetch: hang, timeoutMs: 30 }, IDS), null);
    assert.ok(Date.now() - started < 1000);
  });
});

describe('createSeasonController', () => {
  it('remembers the viewer’s choice and applies it at once', () => {
    const storage = memoryStorage();
    const controller = createSeasonController({ calendar: CALENDAR, storage, now: () => OCTOBER });
    let calls = 0;
    controller.subscribe(() => calls++);
    assert.equal(controller.getSnapshot().season, 'halloween');

    controller.setPreference('off');
    assert.equal(controller.getSnapshot().season, null);
    assert.equal(controller.getSnapshot().available, 'halloween');
    assert.equal(storage.data['seasons.preference'], 'off');
    assert.equal(calls, 1);
    // The boot decision is what the app painted with, and does not move.
    assert.equal(controller.boot.season, 'halloween');

    const relaunched = createSeasonController({ calendar: CALENDAR, storage, now: () => OCTOBER });
    assert.equal(relaunched.getPreference(), 'off');
    assert.equal(relaunched.boot.season, null);
  });

  it('keeps the same snapshot object until something changes', () => {
    const controller = createSeasonController({ calendar: CALENDAR, now: () => OCTOBER });
    const first = controller.getSnapshot();
    controller.update();
    controller.setPreference('auto');
    assert.equal(controller.getSnapshot(), first);
  });

  it('notices the day changing', () => {
    let now = new Date(2026, 8, 30, 23, 59).getTime();
    const controller = createSeasonController({ calendar: CALENDAR, now: () => now });
    assert.equal(controller.getSnapshot().season, null);
    now += 2 * 60_000;
    controller.update();
    assert.equal(controller.getSnapshot().season, 'halloween');
  });

  it('applies a remote kill switch, caches it, and reuses the cache while fresh', async () => {
    const storage = memoryStorage();
    let now = OCTOBER;
    const remote = stubFetch({ version: 1, enabled: false });
    const options = { calendar: CALENDAR, storage, now: () => now, remote: { url: 'https://example.test/s', fetch: remote.fn } };
    const controller = createSeasonController(options);

    await controller.refresh();
    assert.equal(controller.getSnapshot().reason, 'remote-off');
    await controller.refresh();
    assert.equal(remote.calls.length, 1, 'a fresh cache is not refetched');

    // The next launch paints from the cache before any request is made.
    const relaunched = createSeasonController(options);
    assert.equal(relaunched.boot.reason, 'remote-off');

    now += 16 * 60_000;
    await relaunched.refresh();
    assert.equal(remote.calls.length, 2, 'a stale cache is refetched');
  });

  it('shares one request between callers', async () => {
    const remote = stubFetch({ version: 1 });
    const controller = createSeasonController({ calendar: CALENDAR, now: () => OCTOBER, remote: { url: 'x', fetch: remote.fn } });
    await Promise.all([controller.refresh(), controller.refresh(), controller.refresh({ force: true })]);
    assert.equal(remote.calls.length, 1);
  });

  it('keeps what it had when the network fails', async () => {
    const storage = memoryStorage({
      'seasons.remote': JSON.stringify({ config: { version: 1, calm: true }, fetchedAt: 0 }),
    });
    const controller = createSeasonController({ calendar: CALENDAR, storage, now: () => OCTOBER, remote: { url: 'x', fetch: stubFetch({}, 503).fn } });
    await controller.refresh();
    assert.equal(controller.getSnapshot().look, 'calm');
  });

  it('distrusts storage: a corrupt or outdated cache is dropped, a throwing store ignored', () => {
    for (const raw of ['{', '{"config":{"version":1,"force":"easter"},"fetchedAt":1}', '{"config":{"version":1}}']) {
      const controller = createSeasonController({ calendar: CALENDAR, storage: memoryStorage({ 'seasons.remote': raw }), now: () => OCTOBER });
      assert.equal(controller.getSnapshot().reason, 'calendar', raw);
    }
    const broken: SeasonStorage = {
      get: () => {
        throw new Error('locked');
      },
      set: () => {
        throw new Error('full');
      },
    };
    const controller = createSeasonController({ calendar: CALENDAR, storage: broken, now: () => OCTOBER });
    controller.setPreference('calm');
    assert.equal(controller.getSnapshot().look, 'calm');
  });

  it('uses its own key prefix', () => {
    const storage = memoryStorage();
    createSeasonController({ calendar: CALENDAR, storage, now: () => OCTOBER, keyPrefix: 'acme.seasons' }).setPreference('off');
    assert.deepEqual(Object.keys(storage.data), ['acme.seasons.preference']);
  });
});
