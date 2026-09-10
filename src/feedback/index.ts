/**
 * ============================================================================
 * Haptic + sound feedback
 * ============================================================================
 *
 * A single façade so components never import `expo-haptics` or `expo-audio`
 * directly. That keeps platform guards in one place and means a cue's sound and
 * vibration are chosen together, from one list, rather than drifting apart
 * across call sites.
 *
 * The clips in `assets/audio/` are generated, not sampled — see
 * `scripts/generate-sounds.mjs`. To change how something sounds, edit the
 * recipe there and re-run `npm run gen:sounds`.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** Semantic events the app can emit. Add new cues here, not at call sites. */
export type FeedbackCue =
  | 'select'      // tapping an option / dragging a slider notch
  | 'correct'     // answer graded correct
  | 'incorrect'   // answer graded incorrect
  | 'advance'     // moving to the next challenge
  | 'complete'    // lesson finished
  | 'fail';       // ran out of hearts

/** Haptics are a no-op on web; guard once rather than at every call site. */
const HAPTICS_SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'android';

let hapticsEnabled = true;
let soundEnabled = true;

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

async function vibrate(cue: FeedbackCue): Promise<void> {
  if (!hapticsEnabled || !HAPTICS_SUPPORTED) return;
  try {
    switch (cue) {
      case 'select':
        await Haptics.selectionAsync();
        break;
      case 'correct':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'incorrect':
      case 'fail':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'advance':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'complete':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch {
    // Haptics are cosmetic — never let a missing motor break a lesson.
  }
}

/**
 * The clips, required statically so Metro bundles them.
 *
 * `require` rather than `import` is deliberate: Metro resolves these to asset
 * modules at bundle time, and the static form is what lets it do that. A
 * computed path here would ship an app with no sounds and no error.
 */
const CLIPS = {
  select: require('../../assets/audio/select.wav'),
  correct: require('../../assets/audio/correct.wav'),
  incorrect: require('../../assets/audio/incorrect.wav'),
  advance: require('../../assets/audio/advance.wav'),
  complete: require('../../assets/audio/complete.wav'),
  fail: require('../../assets/audio/fail.wav'),
} as const satisfies Record<FeedbackCue, unknown>;

/**
 * Per-cue volume. The generator normalises every file to the same peak, which
 * is right for consistency and wrong for balance: `select` fires on every
 * single tap and would dominate a lesson at the same level as `complete`.
 */
const VOLUME: Record<FeedbackCue, number> = {
  select: 0.28,
  correct: 0.75,
  incorrect: 0.6,
  advance: 0.35,
  complete: 0.85,
  fail: 0.7,
};

/**
 * One player per cue, created on first use and kept.
 *
 * Creating a player per playback leaks native resources, and re-creating one
 * for a cue that fires on every tap is far too slow — `select` has to be
 * instant or it feels laggy rather than responsive.
 */
const players = new Map<FeedbackCue, AudioPlayer>();

/** True once the audio session has been configured. See `configureAudio`. */
let audioConfigured = false;

/**
 * Set the audio session before the first sound.
 *
 * Two choices worth stating. `playsInSilentMode: false` means the silent
 * switch silences us, which is what a person flicking that switch is asking
 * for. `interruptionMode: 'mixWithOthers'` means we duck nothing — someone
 * doing a lesson on a walk keeps their podcast.
 */
function configureAudio(): void {
  if (audioConfigured) return;
  audioConfigured = true;
  void setAudioModeAsync({
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
  }).catch(() => {
    // An unavailable audio session is not a reason to fail a lesson.
  });
}

function playCue(cue: FeedbackCue): void {
  if (!soundEnabled) return;

  try {
    configureAudio();

    let player = players.get(cue);
    if (!player) {
      player = createAudioPlayer(CLIPS[cue]);
      player.volume = VOLUME[cue];
      players.set(cue, player);
    }

    // Rewind first: a cue re-fired before its tail finishes must restart, not
    // be ignored, or fast tapping goes silent.
    player.seekTo(0);
    player.play();
  } catch {
    // Sound is cosmetic — a device that will not play it still teaches.
  }
}

/**
 * Release every player. Call when audio is switched off for good; the app
 * itself never needs this, since the players live as long as the process.
 */
export function releaseSounds(): void {
  for (const player of players.values()) {
    try {
      player.remove();
    } catch {
      // Already gone.
    }
  }
  players.clear();
}

/** Fire-and-forget: emits the haptic and the (stubbed) sound for a cue. */
export function emitFeedback(cue: FeedbackCue): void {
  void vibrate(cue);
  playCue(cue);
}
