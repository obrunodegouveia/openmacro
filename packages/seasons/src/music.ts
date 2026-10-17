/**
 * Seasonal music: which tracks to play, decided by one pure function.
 *
 * The package never plays audio and never bundles any. A season's tracks
 * (`SeasonPack.music`) carry an `asset` the app supplies: a `require()`d
 * file, a URL, whatever its player takes. The app's player asks `musicFor`
 * what to play, and plays the app's own default music when it says `null`.
 *
 * The rule: a season's music plays only while that season is on *and* the
 * viewer's preference is On (`auto`) *and* the look is full. Calm and Off
 * are quiet in the seasonal sense: they get the default music, never the
 * season's. So does a remote "calm everyone", and a season with no tracks.
 */

import type { SeasonDecision, SeasonPreference } from './types.ts';

/**
 * One piece of seasonal music.
 *
 * @typeParam Asset What the app's player takes: a module id, a URL, a file.
 */
export interface SeasonTrack<Asset = unknown> {
  /** Stable, for remembering where a playlist was. */
  readonly id: string;
  /** What it is: "Funeral March of a Marionette". */
  readonly title: string;
  /** Who made it and under what licence, for a credits screen. */
  readonly credit: string;
  /** The audio, supplied by the app. */
  readonly asset: Asset;
}

/** Anything with an optional list of tracks: a `SeasonPack`, or a plain map entry. */
export interface HasMusic<Asset = unknown> {
  readonly music?: readonly SeasonTrack<Asset>[];
}

/**
 * The seasonal tracks to play now, or `null` for the app's default music.
 *
 * @param decision The live decision (`useSeasonDecision`, `getSnapshot()`).
 * @param preference The viewer's preference (`getPreference()`).
 * @param seasons Each season's music, by id: the app's packs, or a map of
 *     `{ music }` for apps that keep audio apart from the packs.
 * @return The season's tracks, in order, or `null`.
 */
export function musicFor<Id extends string, Asset>(
  decision: Pick<SeasonDecision<Id>, 'season' | 'look'>,
  preference: SeasonPreference,
  seasons: Partial<Readonly<Record<Id, HasMusic<Asset> | undefined>>>,
): readonly SeasonTrack<Asset>[] | null {
  if (!decision.season || decision.look !== 'full' || preference !== 'auto') return null;
  const tracks = seasons[decision.season]?.music;
  return tracks && tracks.length ? tracks : null;
}
