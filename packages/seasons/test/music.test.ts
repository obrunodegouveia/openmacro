import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { musicFor, type SeasonTrack } from '../src/music.ts';

const march: SeasonTrack<string> = { id: 'marionette', title: 'Funeral March of a Marionette', credit: 'Gounod', asset: 'march.mp3' };
const hall: SeasonTrack<string> = { id: 'mountain-king', title: 'In the Hall of the Mountain King', credit: 'Grieg', asset: 'hall.mp3' };
const seasons = { halloween: { music: [march, hall] }, winter: { music: [] }, autumn: {} };

describe('musicFor', () => {
  it('plays a season’s tracks while it is on, in the full look, with the preference On', () => {
    assert.deepEqual(musicFor({ season: 'halloween', look: 'full' }, 'auto', seasons), [march, hall]);
  });

  it('is quiet in the seasonal sense when Calm or Off', () => {
    assert.equal(musicFor({ season: 'halloween', look: 'calm' }, 'calm', seasons), null);
    assert.equal(musicFor({ season: null, look: 'full' }, 'off', seasons), null);
    // A QA override can show a season to someone who chose Off: still no seasonal music.
    assert.equal(musicFor({ season: 'halloween', look: 'full' }, 'off', seasons), null);
  });

  it('falls back to the default music for a remote calm, an ordinary day, or a season without tracks', () => {
    assert.equal(musicFor({ season: 'halloween', look: 'calm' }, 'auto', seasons), null);
    assert.equal(musicFor({ season: null, look: 'full' }, 'auto', seasons), null);
    assert.equal(musicFor({ season: 'winter', look: 'full' }, 'auto', seasons), null);
    assert.equal(musicFor({ season: 'autumn', look: 'full' }, 'auto', seasons), null);
    assert.equal(musicFor<string, string>({ season: 'spring', look: 'full' }, 'auto', seasons), null);
  });
});
