import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decide } from '../src/engine.ts';
import type { DecideInput, SeasonWindow } from '../src/types.ts';

type Id = 'halloween' | 'christmas' | 'carnival' | 'thanksgiving' | 'leap' | 'birthday';

const CALENDAR: SeasonWindow<Id>[] = [
  { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
  { id: 'christmas', from: { month: 12, day: 20 }, to: { month: 1, day: 6 } },
];

/** A local date and time, the way a viewer's clock would read it. */
function at(year: number, month: number, day: number, hour = 12, minute = 0): number {
  return new Date(year, month - 1, day, hour, minute).getTime();
}

function season(now: number, extra: Partial<DecideInput<Id>> = {}, calendar = CALENDAR) {
  return decide({ now, calendar, ...extra }).season;
}

describe('the calendar', () => {
  it('includes both ends of a window', () => {
    assert.equal(season(at(2026, 9, 30)), null);
    assert.equal(season(at(2026, 10, 1)), 'halloween');
    assert.equal(season(at(2026, 10, 31)), 'halloween');
    assert.equal(season(at(2026, 11, 1)), 'halloween');
    assert.equal(season(at(2026, 11, 2)), null);
  });

  it('turns on at local midnight, not in UTC', () => {
    assert.equal(season(at(2026, 9, 30, 23, 59)), null);
    assert.equal(season(at(2026, 10, 1, 0, 0)), 'halloween');
    assert.equal(season(at(2026, 11, 1, 23, 59)), 'halloween');
  });

  it('wraps a window across the new year, on both sides of it', () => {
    assert.equal(season(at(2026, 12, 19)), null);
    assert.equal(season(at(2026, 12, 20)), 'christmas');
    assert.equal(season(at(2026, 12, 31)), 'christmas');
    assert.equal(season(at(2027, 1, 1)), 'christmas');
    assert.equal(season(at(2027, 1, 6)), 'christmas');
    assert.equal(season(at(2027, 1, 7)), null);
  });

  it('finds Easter for any year, and the feasts that hang off it', () => {
    const easter: SeasonWindow<Id>[] = [{ id: 'carnival', from: { easter: 0 }, to: { easter: 0 } }];
    // Known Western Easter Sundays, including the extremes of its range.
    for (const [year, month, day] of [
      [2024, 3, 31],
      [2025, 4, 20],
      [2026, 4, 5],
      [2027, 3, 28],
      [2038, 4, 25],
      [2285, 3, 22],
    ] as const) {
      assert.equal(season(at(year, month, day), {}, easter), 'carnival', `${year}`);
      assert.equal(season(at(year, month, day) + 86400000, {}, easter), null, `${year} + 1`);
    }
    // Carnival Tuesday is 47 days before Easter: 17 February 2026.
    const carnival: SeasonWindow<Id>[] = [{ id: 'carnival', from: { easter: -47 }, to: { easter: -47 } }];
    assert.equal(season(at(2026, 2, 17), {}, carnival), 'carnival');
    assert.equal(season(at(2026, 2, 16), {}, carnival), null);
  });

  it('finds the nth and the last weekday of a month', () => {
    const thanksgiving: SeasonWindow<Id>[] = [
      { id: 'thanksgiving', from: { month: 11, weekday: 4, nth: 4 }, to: { month: 11, weekday: 4, nth: 4, offset: 1 } },
    ];
    assert.equal(season(at(2026, 11, 25), {}, thanksgiving), null);
    assert.equal(season(at(2026, 11, 26), {}, thanksgiving), 'thanksgiving');
    assert.equal(season(at(2026, 11, 27), {}, thanksgiving), 'thanksgiving');
    assert.equal(season(at(2026, 11, 28), {}, thanksgiving), null);

    const lastMonday: SeasonWindow<Id>[] = [{ id: 'thanksgiving', from: { month: 5, weekday: 1, nth: -1 }, to: { month: 5, weekday: 1, nth: -1 } }];
    assert.equal(season(at(2026, 5, 25), {}, lastMonday), 'thanksgiving');
    assert.equal(season(at(2026, 5, 18), {}, lastMonday), null);
  });

  it('skips a day the year does not have rather than moving it', () => {
    const leap: SeasonWindow<Id>[] = [{ id: 'leap', from: { month: 2, day: 29 }, to: { month: 2, day: 29 } }];
    assert.equal(season(at(2028, 2, 29), {}, leap), 'leap');
    assert.equal(season(at(2027, 3, 1), {}, leap), null);
    assert.equal(season(at(2027, 2, 28), {}, leap), null);
  });

  it('lets a higher priority sit inside a longer season, and gives a tie to the first', () => {
    const nested: SeasonWindow<Id>[] = [
      { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 } },
      { id: 'birthday', from: { month: 10, day: 15 }, to: { month: 10, day: 15 }, priority: 1 },
      { id: 'leap', from: { month: 10, day: 1 }, to: { month: 10, day: 31 } },
    ];
    assert.equal(season(at(2026, 10, 14), {}, nested), 'halloween');
    assert.equal(season(at(2026, 10, 15), {}, nested), 'birthday');
  });
});

describe('the override', () => {
  it('forces a season, a calm one, or none, ahead of everything else', () => {
    const july = at(2026, 7, 1);
    assert.deepEqual(decide({ now: july, calendar: CALENDAR, override: 'Christmas ' }), {
      season: 'christmas',
      look: 'full',
      available: 'christmas',
      reason: 'override',
    });
    assert.equal(decide({ now: july, calendar: CALENDAR, override: 'christmas:calm' }).look, 'calm');
    assert.equal(season(at(2026, 10, 10), { override: 'none' }), null);
    assert.equal(season(july, { override: 'halloween', preference: 'off', remote: { version: 1, enabled: false } }), 'halloween');
  });

  it('ignores an id that is not on the calendar', () => {
    assert.equal(season(at(2026, 10, 10), { override: 'easter' }), 'halloween');
    assert.equal(season(at(2026, 10, 10), { override: '' }), 'halloween');
  });
});

describe('the remote config', () => {
  const october = at(2026, 10, 10);

  it('switches every season off, or one', () => {
    assert.deepEqual(decide({ now: october, calendar: CALENDAR, remote: { version: 1, enabled: false } }), {
      season: null,
      look: 'full',
      available: null,
      reason: 'remote-off',
    });
    assert.equal(season(october, { remote: { version: 1, disabled: ['halloween'] } }), null);
    assert.equal(season(october, { remote: { version: 1, disabled: ['christmas'] } }), 'halloween');
  });

  it('lets a disabled holiday give way to the longer season it sits inside', () => {
    const year: SeasonWindow<Id>[] = [
      { id: 'leap', from: { month: 9, day: 23 }, to: { month: 12, day: 20 } },
      { id: 'halloween', from: { month: 10, day: 1 }, to: { month: 11, day: 1 }, priority: 1 },
    ];
    assert.equal(season(october, {}, year), 'halloween');
    assert.equal(season(october, { remote: { version: 1, disabled: ['halloween'] } }, year), 'leap');
    // Both off: off, not "nothing scheduled".
    assert.equal(decide({ now: october, calendar: year, remote: { version: 1, disabled: ['halloween', 'leap'] } }).reason, 'remote-off');
    // A forced season that is disabled stays off.
    assert.equal(season(october, { remote: { version: 1, force: 'halloween', disabled: ['halloween'] } }, year), null);
  });

  it('beats the viewer saying "on", but not the viewer saying "off"', () => {
    assert.equal(season(october, { preference: 'auto', remote: { version: 1, enabled: false } }), null);
    assert.equal(season(at(2026, 7, 1), { preference: 'off', remote: { version: 1, force: 'christmas' } }), null);
  });

  it('forces a season, moves a window, or calms everyone', () => {
    assert.equal(decide({ now: at(2026, 7, 1), calendar: CALENDAR, remote: { version: 1, force: 'christmas' } }).reason, 'remote-force');
    const moved = { version: 1, windows: { christmas: { from: { month: 11, day: 25 }, to: { month: 12, day: 26 } } } } as const;
    assert.equal(season(at(2026, 11, 25), { remote: moved }), 'christmas');
    assert.equal(season(at(2026, 12, 27), { remote: moved }), null);
    assert.equal(decide({ now: october, calendar: CALENDAR, remote: { version: 1, calm: true } }).look, 'calm');
  });

  it('is ignored once it expires, or when its expiry cannot be read', () => {
    const kill = { version: 1, enabled: false } as const;
    assert.equal(season(october, { remote: { ...kill, expires: '2026-10-11T00:00:00Z' } }), null);
    assert.equal(season(october, { remote: { ...kill, expires: '2026-10-09T00:00:00Z' } }), 'halloween');
    assert.equal(season(october, { remote: { ...kill, expires: 'next tuesday' } }), 'halloween');
  });

  it('is ignored when it is a version this engine does not know', () => {
    assert.equal(season(october, { remote: { version: 2, enabled: false } as never }), 'halloween');
  });
});

describe('the viewer', () => {
  const october = at(2026, 10, 10);

  it('can turn a season off and still be offered it back', () => {
    assert.deepEqual(decide({ now: october, calendar: CALENDAR, preference: 'off' }), {
      season: null,
      look: 'full',
      available: 'halloween',
      reason: 'preference-off',
    });
  });

  it('can ask for the calm look', () => {
    assert.equal(decide({ now: october, calendar: CALENDAR, preference: 'calm' }).look, 'calm');
  });

  it('is offered nothing on an ordinary day', () => {
    assert.deepEqual(decide({ now: at(2026, 7, 1), calendar: CALENDAR, preference: 'off' }), {
      season: null,
      look: 'full',
      available: null,
      reason: 'none',
    });
  });
});

describe('malformed input', () => {
  it('never throws, and counts as absent', () => {
    const october = at(2026, 10, 10);
    const garbage = [null, 7, 'x', [], { version: 1, windows: 'x' }, { version: 1, disabled: 'halloween' }, { version: 1, windows: { halloween: null } }];
    for (const remote of garbage) {
      assert.equal(season(october, { remote: remote as never }), 'halloween', JSON.stringify(remote));
    }
    for (const preference of ['ON', 7, null, undefined]) {
      assert.equal(season(october, { preference: preference as never }), 'halloween');
    }
    const broken = [
      { id: 'leap', from: { month: 13, day: 1 }, to: { month: 1, day: 1 } },
      { id: 'leap', from: { month: 10 }, to: null },
      { id: 'leap', from: { month: 10, weekday: 9, nth: 1 }, to: { month: 10, weekday: 1, nth: 0 } },
      { id: 'leap', from: { month: 10, weekday: 1, nth: 5 }, to: { month: 10, weekday: 1, nth: 5 } },
    ] as unknown as SeasonWindow<Id>[];
    assert.equal(season(october, {}, broken), null);
  });
});
