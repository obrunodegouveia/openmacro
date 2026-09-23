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

/**
 * Choose which clips the cues play.
 *
 * Switching packs tears down the existing players, because a player is bound
 * to the clip it was built with. They are rebuilt on the next cue, or right
 * now if `preloadSounds` has already run — so a switch never leaves the first
 * cue of the new pack paying a decode cost the old one had already paid.
 */
export function setSoundPack(next: SoundPack): void {
  if (next === pack) return;
  pack = next;
  const wasPreloaded = voices.size > 0;
  releaseSounds();
  if (wasPreloaded) preloadSounds();
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
const PACKS = {
  /** Tuned tones in C. The default. */
  classic: {
    select: require('../../assets/audio/select.wav'),
    correct: require('../../assets/audio/correct.wav'),
    incorrect: require('../../assets/audio/incorrect.wav'),
    advance: require('../../assets/audio/advance.wav'),
    complete: require('../../assets/audio/complete.wav'),
    fail: require('../../assets/audio/fail.wav'),
  },
  /**
   * Bent pitches and cartoon drops — the same six cues with a game's
   * character. Synthesised from the same oscillator as `classic`, for the
   * reason set out at length in `scripts/generate-sounds.mjs`: the sounds it
   * evokes are all clips somebody owns, and this repository is MIT and
   * expects to be forked.
   */
  arcade: {
    select: require('../../assets/audio/arcade/select.wav'),
    correct: require('../../assets/audio/arcade/correct.wav'),
    incorrect: require('../../assets/audio/arcade/incorrect.wav'),
    advance: require('../../assets/audio/arcade/advance.wav'),
    complete: require('../../assets/audio/arcade/complete.wav'),
    fail: require('../../assets/audio/arcade/fail.wav'),
  },
} as const satisfies Record<string, Record<FeedbackCue, unknown>>;

/** Which set of clips the cues play. */
export type SoundPack = keyof typeof PACKS;

export const SOUND_PACKS = Object.keys(PACKS) as readonly SoundPack[];

/** Narrow an untrusted string — an env var — to a pack, falling back safely. */
export function toSoundPack(value: string | undefined): SoundPack {
  return (SOUND_PACKS as readonly string[]).includes(value ?? '')
    ? (value as SoundPack)
    : 'classic';
}

let pack: SoundPack = 'classic';

/**
 * There is deliberately no per-cue volume table here.
 *
 * Balance belongs in the files: `scripts/generate-sounds.mjs` normalises the
 * whole set against its loudest cue, so `select` sits at 15% of `complete` by
 * construction. Correcting levels at playback instead means the mix lives in
 * two places and the WAVs lie about how loud they are.
 */

interface Voice {
  player: AudioPlayer;
  /**
   * Incremented on every fire. A rewind that resolves after a newer fire has
   * already started is stale and must not play — this is how that is known.
   */
  generation: number;
}

/** One voice per cue. Created once — see `preloadSounds`. */
const voices = new Map<FeedbackCue, Voice>();

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

/** Get the voice for a cue, creating it if `preloadSounds` has not run. */
function voiceFor(cue: FeedbackCue): Voice {
  const existing = voices.get(cue);
  if (existing) return existing;
  const voice: Voice = { player: createAudioPlayer(PACKS[pack][cue]), generation: 0 };
  voices.set(cue, voice);
  return voice;
}

/**
 * Create every player up front, so no cue pays a load cost the first time it
 * fires.
 *
 * This is why sounds felt late rather than wrong: a lazily-created player has
 * to decode its clip before the first `play()`, so the first correct answer of
 * a session arrived after the animation it was meant to accompany, and only
 * the first. Building them at boot costs a few milliseconds once and makes
 * every cue land on time.
 *
 * Safe to call more than once, and safe to call with sound disabled — the
 * learner can switch it on mid-session and it should be instant then too.
 */
export function preloadSounds(): void {
  try {
    configureAudio();
    for (const cue of Object.keys(PACKS[pack]) as FeedbackCue[]) voiceFor(cue);
  } catch {
    // A device that cannot prepare audio simply plays none.
  }
}

/**
 * Play a cue, restarting it if it is already sounding.
 *
 * The bug this replaces: `seekTo` is asynchronous and `play` is not, so firing
 * them back to back does not rewind-then-play. It starts playback from
 * wherever the player happens to be and lands the rewind some time afterwards.
 * What that sounds like depends on where the player was — at the end of the
 * previous clip, playback from the end is nothing and the cue is silently
 * dropped; part-way through, the previous fire keeps sounding and then jumps
 * back to the start mid-note. Both are heard as the sound being out of step
 * with the screen, and both depend on timing, which is why it came and went.
 * Dragging a slider is the worst case: `select` fires on every notch, far
 * faster than any clip finishes.
 *
 * So `play` is only ever called on the next line after a rewind has actually
 * resolved. The generation counter handles the other half: when cues arrive
 * faster than the rewinds resolve, every superseded one drops out rather than
 * stacking up into a burst of overlapping copies.
 *
 * This costs a microtask and a native seek on every fire, and buys a rule that
 * holds under any interleaving: playback never begins from an unknown
 * position. A preferable trade, on a clip already decoded in memory, to a
 * faster path whose correctness depends on events arriving in an order this
 * code cannot guarantee.
 */
function playCue(cue: FeedbackCue): void {
  if (!soundEnabled) return;

  try {
    configureAudio();
    const voice = voiceFor(cue);
    const generation = (voice.generation += 1);

    voice.player.pause();
    void voice.player
      .seekTo(0)
      .then(() => {
        // Superseded by a later fire, or sound was switched off while waiting.
        if (voice.generation !== generation || !soundEnabled) return;
        voice.player.play();
      })
      .catch(() => {});
  } catch {
    // Sound is cosmetic — a device that will not play it still teaches.
  }
}

/**
 * Release every player. Call when audio is switched off for good; the app
 * itself never needs this, since the players live as long as the process.
 */
export function releaseSounds(): void {
  for (const voice of voices.values()) {
    try {
      voice.player.remove();
    } catch {
      // Already gone.
    }
  }
  voices.clear();
}

/** Fire-and-forget: emits the haptic and the (stubbed) sound for a cue. */
export function emitFeedback(cue: FeedbackCue): void {
  void vibrate(cue);
  playCue(cue);
}
