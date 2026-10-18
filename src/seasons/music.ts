/**
 * The app's seasonal music: which tracks each season brings, as files this
 * app bundles.
 *
 * `@openmacro/seasons` ships no audio; a pack's `music` carries an `asset`
 * the app supplies. Only the app has music (the website has none), and music
 * is not exercise content, so this lives here and not in
 * `@openmacro/core/season`, which the website shares.
 *
 * `SEASON_PACKS_WITH_MUSIC` is what `SeasonsProvider` hands the package, so
 * `useSeasonMusic()` agrees with the player; `src/feedback/music.ts` asks
 * `musicFor` with `SEASON_MUSIC` directly, without React.
 *
 * Both Halloween pieces are public domain, read off nineteenth-century
 * scores, and synthesised by `scripts/generate-music.mjs` (which explains the
 * sources). The Grieg plays a whole tone below the score, in A minor, so it
 * cannot clash with the C major feedback chimes.
 */

import type { AudioSource } from 'expo-audio';

import type { HasMusic, SeasonTrack } from '@openmacro/seasons';
import { SEASON_PACKS, type SeasonId, type SeasonPack } from '@openmacro/core/season';

/** A season's track, as this app's player takes it. */
export type AppTrack = SeasonTrack<AudioSource>;

/** Halloween: the two pieces alternate, one played through, then the other. */
const HALLOWEEN: readonly AppTrack[] = [
  {
    id: 'funeral-march',
    title: 'Funeral March of a Marionette',
    credit: 'Charles Gounod (1872), public domain; arrangement OpenMacro',
    asset: require('../../assets/audio/music/funeral-march.m4a'),
  },
  {
    id: 'mountain-king',
    title: 'In the Hall of the Mountain King',
    credit: 'Edvard Grieg (1875), public domain; arrangement OpenMacro, in A minor',
    asset: require('../../assets/audio/music/mountain-king.m4a'),
  },
];

/** Each season's music, by id. A season not listed plays the default (Korobeiniki). */
export const SEASON_MUSIC: Partial<Record<SeasonId, HasMusic<AudioSource>>> = {
  halloween: { music: HALLOWEEN },
};

/** The presets, with this app's music added, for `SeasonProvider`. */
export const SEASON_PACKS_WITH_MUSIC: Readonly<Record<SeasonId, SeasonPack>> = {
  ...SEASON_PACKS,
  halloween: { ...SEASON_PACKS.halloween, music: HALLOWEEN },
};
