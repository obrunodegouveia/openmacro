import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decide } from '../src/engine.ts';
import {
  NORTHERN_CALENDAR,
  PALETTE_ROLES,
  PRESET_IDS,
  PRESET_PACKS,
  PRESET_STRINGS,
  SOUTHERN_CALENDAR,
  checkPack,
  contrast,
  createTranslator,
  mapPalette,
  presetCalendar,
  presetLocale,
  toyReaction,
  type SeasonPack,
} from '../src/presets/index.ts';

describe('presets', () => {
  it('every preset passes checkPack', () => {
    for (const id of PRESET_IDS) assert.deepEqual(checkPack(PRESET_PACKS[id]), [], id);
  });

  it('checkPack catches unreadable text and a strobe', () => {
    const base = PRESET_PACKS.winter as SeasonPack;
    const broken: SeasonPack = {
      ...base,
      palette: { ...base.palette, light: { ...base.palette.light, inkFaint: '#C0C0C0' } },
      look: { ...base.look, mist: base.look.mist && { ...base.look.mist, cycleMs: 200 } },
    };
    const problems = checkPack(broken);
    assert.ok(problems.some((p) => p.includes('inkFaint')), problems.join('\n'));
    assert.ok(problems.some((p) => p.includes('mist cycles every 200ms')), problems.join('\n'));
  });

  it('both calendars cover every day of a common and a leap year', () => {
    for (const calendar of [NORTHERN_CALENDAR, SOUTHERN_CALENDAR]) {
      for (const year of [2027, 2028]) {
        for (let day = new Date(year, 0, 1); day.getFullYear() === year; day.setDate(day.getDate() + 1)) {
          assert.ok(decide({ now: day.getTime(), calendar }).season, day.toDateString());
        }
      }
    }
  });

  it('the southern year is half a year round, with the holidays on their days', () => {
    const at = (month: number, day: number) => decide({ now: new Date(2027, month - 1, day).getTime(), calendar: SOUTHERN_CALENDAR }).season;
    assert.equal(at(1, 15), 'summer');
    assert.equal(at(7, 15), 'winter');
    assert.equal(at(10, 15), 'halloween');
    assert.equal(at(12, 24), 'christmas');
    assert.equal(at(11, 15), 'spring');
    const bare = presetCalendar('south', { holidays: false });
    assert.equal(decide({ now: new Date(2027, 9, 15).getTime(), calendar: bare }).season, 'spring');
  });

  it('bundles every key in every language', () => {
    for (const [locale, dictionary] of Object.entries(PRESET_STRINGS)) {
      for (const id of PRESET_IDS) {
        const { strings } = PRESET_PACKS[id];
        for (const key of [strings.name, strings.greeting, strings.welcome, ...strings.toy]) {
          assert.equal(typeof (dictionary as Record<string, string>)[key], 'string', `${locale} ${key}`);
        }
      }
    }
  });

  it('translates, interpolates, overrides and falls back', () => {
    const pt = createTranslator('pt');
    assert.equal(pt('season.christmas.name'), 'Natal');
    assert.equal(pt('season.halloween.welcome', { name: 'Maria' }), 'Feliz Halloween, Maria!');
    assert.equal(presetLocale('pt-BR'), 'pt-PT');
    assert.equal(presetLocale('de-DE'), 'en');
    const custom = createTranslator('en', { 'season.carnival.name': 'Carnival', 'season.summer.toy.1': 'Boop' });
    assert.equal(custom('season.carnival.name'), 'Carnival');
    assert.equal(custom('season.summer.toy.1'), 'Boop');
    assert.equal(custom('nope'), 'nope');
    assert.equal(createTranslator({ hi: 'Olá {who}' })('hi', { who: 'tu' }), 'Olá tu');
  });

  it('maps a palette by role, for both appearances', () => {
    const tokens = mapPalette(PRESET_PACKS.autumn.palette, (c, scheme) => ({ bg: c.canvas, text: c.ink, scheme }));
    assert.equal(tokens.light.bg, PRESET_PACKS.autumn.palette.light.canvas);
    assert.equal(tokens.dark.scheme, 'dark');
    assert.ok(PALETTE_ROLES.every((info) => info.role in PRESET_PACKS.spring.palette.light || !info.required));
    assert.ok(contrast('#000000', '#ffffff') > 20.9);
  });

  it('the toy speaks every third tap and bursts every tenth', () => {
    assert.deepEqual([1, 2, 3, 6, 9, 10, 12].map((n) => toyReaction(n)), [null, null, 1, 2, 3, 'burst', 1]);
  });
});
