/**
 * ============================================================================
 * Background music
 * ============================================================================
 *
 * One optional loop, "Korobeiniki" (see `scripts/generate-music.mjs` for why
 * that tune and why it is safe to ship), playing quietly while the app is in
 * the foreground.
 *
 * It shares the feedback cues' audio session (`configureAudio` in
 * `./index.ts`): the silent switch silences it, and it mixes with whatever
 * else is playing rather than stopping a podcast. It pauses when the app
 * leaves the foreground and resumes when it comes back.
 *
 * On by default; the learner turns it off in Profile, and that choice is kept
 * on the device.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { AppState, type AppStateStatus } from 'react-native';

import { configureAudio } from './index';

/** Where the on/off choice is kept. */
const STORAGE_KEY = 'openmacro.music.enabled';

/**
 * Quiet on purpose: music under a lesson, not over it. The feedback cues are
 * normalised to full scale, so at this level a correct-answer chime still
 * stands clearly above the loop.
 */
const VOLUME = 0.28;

let player: AudioPlayer | null = null;
let enabled = true;
let foreground = AppState.currentState === 'active';
const listeners = new Set<(on: boolean) => void>();

/** Starts or stops the loop to match the switch and the app's state. */
function sync(): void {
  try {
    if (enabled && foreground) {
      if (!player) {
        configureAudio();
        player = createAudioPlayer(require('../../assets/audio/music/korobeiniki.m4a'), {
          keepAudioSessionActive: true,
        });
        player.loop = true;
        player.volume = VOLUME;
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
