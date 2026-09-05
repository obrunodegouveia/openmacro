/**
 * ============================================================================
 * Haptic + sound feedback
 * ============================================================================
 *
 * A single façade so components never import `expo-haptics` directly. That
 * keeps platform guards in one place and gives contributors one obvious seam
 * for wiring real audio.
 *
 * SOUND: intentionally stubbed. To enable audio, install `expo-audio` and
 * fill in `playCue` below — every call site is already in place.
 *
 *   npx expo install expo-audio
 *
 * Then load the clips once (module scope) and play them in `playCue`.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

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
 * STUB — wire real audio here.
 *
 * ```ts
 * import { createAudioPlayer } from 'expo-audio';
 * const players: Record<FeedbackCue, AudioPlayer | undefined> = {
 *   correct: createAudioPlayer(require('../../assets/audio/correct.mp3')),
 *   // ...
 * };
 * ```
 */
function playCue(cue: FeedbackCue): void {
  if (!soundEnabled) return;
  if (__DEV__) {
    // Visible in the Metro logs so contributors can see the hook firing.
    console.log(`[OpenMacro:sound] ${cue}`);
  }
}

/** Fire-and-forget: emits the haptic and the (stubbed) sound for a cue. */
export function emitFeedback(cue: FeedbackCue): void {
  void vibrate(cue);
  playCue(cue);
}
