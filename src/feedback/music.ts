/**
 * ============================================================================
 * Background music
 * ============================================================================
 *
 * A quiet loop while the app is in the foreground. Most of the year it is
 * "Korobeiniki" (see `scripts/generate-music.mjs` for why that tune and why
 * it is safe to ship). A season can bring its own tracks instead: at
 * Halloween, Gounod's "Funeral March of a Marionette" and Grieg's "In the
 * Hall of the Mountain King" (`src/seasons/music.ts`).
 *
 * Which plays is decided by `musicFor` from `@openmacro/seasons`, asked
 * straight from the season controller, so this module stays free of React:
 * a season's tracks only while that season is on, in the full look, with
 * the learner's season switch On; Korobeiniki otherwise (Calm, Off, a remote
 * "calm everyone", an ordinary day). When the answer changes, the player
 * switches to the new playlist's first track at once.
 *
 * One track loops on itself, seamlessly (each file is cut to loop). Several
 * alternate: each plays through once, then the next, round and round.
 *
 * It shares the feedback cues' audio session (`configureAudio` in
 * `./index.ts`): the silent switch silences it, and it mixes with whatever
 * else is playing rather than stopping a podcast. It pauses when the app
 * leaves the foreground and resumes when it comes back.
 *
 * On by default; the learner turns it off in Profile, and that choice is kept
 * on the device. Music is app-only and not exercise content: the website has
 * none.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, type AudioPlayer, type AudioSource, type AudioStatus } from 'expo-audio';
import { AppState, type AppStateStatus } from 'react-native';

import { musicFor } from '@openmacro/seasons';

import { seasons } from '@/seasons/controller';
import { SEASON_MUSIC } from '@/seasons/music';

import { configureAudio } from './index';

/** Where the on/off choice is kept. */
const STORAGE_KEY = 'openmacro.music.enabled';

/**
 * Quiet on purpose: music under a lesson, not over it. The feedback cues are
 * normalised to full scale, so at this level a correct-answer chime still
 * stands clearly above the loop. Every track is mastered to the same
 * loudness, so one level suits them all.
 */
const VOLUME = 0.28;

/** What the player needs of a track. */
interface Track {
  readonly id: string;
  readonly asset: AudioSource;
}

/** The music for the rest of the year. */
const KOROBEINIKI: Track = { id: 'korobeiniki', asset: require('../../assets/audio/music/korobeiniki.m4a') };

/** The default playlist: Korobeiniki, on its own, looping. */
const DEFAULT_PLAYLIST: readonly Track[] = [KOROBEINIKI];

let player: AudioPlayer | null = null;
let enabled = true;
let foreground = AppState.currentState === 'active';
let playlist: readonly Track[] = DEFAULT_PLAYLIST;
let index = 0;
const listeners = new Set<(on: boolean) => void>();

/**
 * The playlist the season calls for right now.
 *
 * @return The season's tracks, or the default playlist. The same array for
 *     as long as the answer is the same, so it can be compared by identity.
 */
function seasonPlaylist(): readonly Track[] {
  return musicFor(seasons.getSnapshot(), seasons.getPreference(), SEASON_MUSIC) ?? DEFAULT_PLAYLIST;
}

/**
 * The track the playlist is on.
 *
 * @return The track.
 */
function currentTrack(): Track {
  return playlist[index] ?? KOROBEINIKI;
}

/**
 * Loads the current track into the player: a lone track loops on itself,
 * a track in a playlist plays once and hands over (see `onStatus`).
 *
 * @param target The player.
 */
function loadCurrent(target: AudioPlayer): void {
  target.replace(currentTrack().asset);
  target.loop = playlist.length === 1;
  target.volume = VOLUME;
}

/**
 * Moves on to the next track when one in a playlist has played through.
 *
 * @param status The player's status.
 */
function onStatus(status: AudioStatus): void {
  if (!status.didJustFinish || playlist.length < 2 || !player) return;
  index = (index + 1) % playlist.length;
  try {
    loadCurrent(player);
  } catch {
    // Nothing more to play; the next season change or launch tries again.
  }
  sync();
}

/** Starts or stops the music to match the switch and the app's state. */
function sync(): void {
  try {
    if (enabled && foreground) {
      if (!player) {
        configureAudio();
        player = createAudioPlayer(currentTrack().asset, {
          keepAudioSessionActive: true,
        });
        player.loop = playlist.length === 1;
        player.volume = VOLUME;
        player.addListener('playbackStatusUpdate', onStatus);
      }
      player.play();
    } else {
      player?.pause();
    }
  } catch {
    // A device that cannot play audio simply has no music.
  }
}

/**
 * Follows the season: when the playlist it calls for changes (Halloween
 * begins or ends, the learner moves the season switch to Calm or Off), the
 * new playlist starts from its first track. A player not yet created picks
 * it up when it is.
 */
function followSeason(): void {
  const next = seasonPlaylist();
  if (next === playlist) return;
  playlist = next;
  index = 0;
  if (player) {
    try {
      loadCurrent(player);
    } catch {
      // Keeps whatever was loaded.
    }
  }
  sync();
}

/**
 * Reads the saved choice and starts the music if it is on. Call once, at boot.
 *
 * @return Resolves once the choice has been read.
 */
export async function startMusic(): Promise<void> {
  try {
    enabled = (await AsyncStorage.getItem(STORAGE_KEY)) !== 'off';
  } catch {
    enabled = true;
  }
  AppState.addEventListener('change', (state: AppStateStatus) => {
    foreground = state === 'active';
    sync();
  });
  playlist = seasonPlaylist();
  index = 0;
  seasons.subscribe(followSeason);
  listeners.forEach((listener) => listener(enabled));
  sync();
}

/**
 * Turns the music on or off, now and on later launches.
 *
 * @param on Whether music should play.
 */
export function setMusicEnabled(on: boolean): void {
  enabled = on;
  void AsyncStorage.setItem(STORAGE_KEY, on ? 'on' : 'off').catch(() => {});
  listeners.forEach((listener) => listener(on));
  sync();
}

/**
 * Whether music is on, for a settings switch.
 *
 * @return The current choice.
 */
export function isMusicEnabled(): boolean {
  return enabled;
}

/**
 * Stops the music and releases its player, for just before the JavaScript
 * runtime is restarted to apply an update.
 *
 * The player is a native object and outlives the runtime that made it: left
 * alone, it went on playing through `Updates.reloadAsync()` while the new
 * runtime started a player of its own, so two tunes played at once until the
 * app was killed. This is the only chance to release it, because the new
 * runtime has no handle on the old player.
 */
export function stopMusicForReload(): void {
  const current = player;
  player = null;
  if (!current) return;
  try {
    current.pause();
    current.remove();
  } catch {
    // Already gone.
  }
}

/**
 * Starts the music again after a reload that did not happen, so a failed
 * `reloadAsync` does not leave the app silent.
 */
export function resumeMusicAfterFailedReload(): void {
  sync();
}

/**
 * Follows the on/off choice, for a settings switch that must update when the
 * saved value arrives after it has rendered.
 *
 * @param listener Called with the new value.
 * @return Unsubscribes.
 */
export function subscribeMusic(listener: (on: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
