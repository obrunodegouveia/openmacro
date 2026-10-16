/**
 * ============================================================================
 * Haptic + sound feedback
 * ============================================================================
 *
 * A single façade so components never import `expo-haptics` or `react-native-audio-api`
 * directly. That keeps platform guards in one place and means a cue's sound and
 * vibration are chosen together, from one list, rather than drifting apart
 * across call sites.
 *
 * The clips in `assets/audio/` are generated, not sampled — see
 * `scripts/generate-sounds.mjs`. To change how something sounds, edit the
 * recipe there and re-run `npm run gen:sounds`.
 *
 * Why `react-native-audio-api` and not `expo-audio`: expo-audio plays through
 * AVPlayer on iOS and ExoPlayer on Android. Both are media players, built to
 * buffer a stream before they start, and on a device that buffering was heard
 * as roughly half a second between a tap and its sound — however carefully
 * the JavaScript side kept `play()` off any await. Web Audio does the opposite:
 * every clip is decoded into memory once, and a cue is a buffer source started
 * on the audio render thread, so it sounds within one hardware buffer of the
 * call. That is the latency budget sound effects need.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AudioContext, AudioManager, type AudioBuffer } from 'react-native-audio-api';

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
 * Switching packs drops the decoded clips of the old pack and, if they had
 * already been loaded, decodes the new pack straight away — so a switch never
 * leaves the first cue of the new pack waiting on a decode the old one had
 * already paid for.
 */
export function setSoundPack(next: SoundPack): void {
  if (next === pack) return;
  pack = next;
  const wasPreloaded = preloaded;
  dropClips();
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

/** The one audio graph every cue plays through. Created by `preloadSounds`. */
let context: AudioContext | null = null;

/** Each cue's clip of the current pack, decoded and ready to start. */
const clips = new Map<FeedbackCue, AudioBuffer>();

/** True once `preloadSounds` has run, so a pack switch knows to decode again. */
let preloaded = false;

/**
 * Bumped whenever the clips are dropped. A decode that finishes after a pack
 * switch belongs to the old pack and must not land in `clips`.
 */
let generation = 0;

/** True once the audio session has been configured. See `configureAudio`. */
let audioConfigured = false;

/**
 * Set the audio session before the first sound.
 *
 * `ambient` is the iOS category for sounds that accompany an interface: the
 * silent switch silences it, which is what a person flicking that switch is
 * asking for, and `mixWithOthers` means we duck nothing — someone doing a
 * lesson on a walk keeps their podcast, and the lesson video keeps its sound.
 * Android has no equivalent switch and needs no session.
 */
function configureAudio(): void {
  if (audioConfigured) return;
  audioConfigured = true;
  if (Platform.OS !== 'ios') return;
  try {
    AudioManager.setAudioSessionOptions({
      iosCategory: 'ambient',
      iosOptions: ['mixWithOthers'],
    });
  } catch {
    // An unavailable audio session is not a reason to fail a lesson.
  }
}

/** Drop the decoded clips, and any decode still in flight with them. */
function dropClips(): void {
  generation += 1;
  clips.clear();
  preloaded = false;
}

/**
 * Create the audio graph and decode every clip of the current pack, so no cue
 * pays a load cost the first time it fires.
 *
 * Decoding is asynchronous; a cue that fires before its clip is ready is
 * skipped rather than delayed, because a late sound is worse than none. In
 * practice the six clips decode in a few milliseconds at boot, long before
 * the first tap.
 *
 * Safe to call more than once, and safe to call with sound disabled — the
 * learner can switch it on mid-session and it should be instant then too.
 */
export function preloadSounds(): void {
  if (preloaded) return;
  try {
    configureAudio();
    context ??= new AudioContext();
    preloaded = true;
    const ctx = context;
    const run = generation;
    for (const cue of Object.keys(PACKS[pack]) as FeedbackCue[]) {
      void ctx
        .decodeAudioData(PACKS[pack][cue] as number)
        .then((buffer) => {
          if (run === generation) clips.set(cue, buffer);
        })
        .catch(() => {
          // A clip that will not decode just stays silent.
        });
    }
  } catch {
    // A device that cannot prepare audio simply plays none.
  }
}

/**
 * ---------------------------------------------------------------------------
 * Start timing
 * ---------------------------------------------------------------------------
 *
 * How long a cue takes from being fired to its buffer source being started.
 * That is a map lookup and three calls into the audio graph, so a median near
 * zero and a p95 well under a 60fps frame is what a device should report; a
 * number that grows means something is blocking the JavaScript thread around
 * the tap, not the audio engine.
 *
 * Self-limiting on purpose. It takes a bounded sample, prints one line, and
 * switches itself off — so a build that ships with it enabled costs a boolean
 * check per cue and one log per session, rather than becoming something that
 * has to be remembered and removed.
 */
const TIMING_SAMPLE_SIZE = 120;

let timingEnabled = false;
let timings: number[] = [];

export interface AudioTimingReport {
  samples: number;
  /** Milliseconds from a cue firing to its clip starting. */
  min: number;
  median: number;
  p95: number;
  max: number;
}

export function setAudioTimingEnabled(enabled: boolean): void {
  timingEnabled = enabled;
  if (!enabled) timings = [];
}

/** The measurement so far, or `null` before anything has been recorded. */
export function audioTimingReport(): AudioTimingReport | null {
  if (timings.length === 0) return null;
  const sorted = [...timings].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
  return {
    samples: sorted.length,
    min: sorted[0] ?? 0,
    median: at(0.5),
    p95: at(0.95),
    max: sorted[sorted.length - 1] ?? 0,
  };
}

/** Monotonic where available; `Date.now` is accurate enough as a fallback. */
function now(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function recordStart(startedAt: number): void {
  timings.push(now() - startedAt);
  if (timings.length < TIMING_SAMPLE_SIZE) return;

  const report = audioTimingReport();
  timingEnabled = false;
  if (!report) return;
  const ms = (value: number) => value.toFixed(2);
  console.log(
    `[OpenMacro] audio start over ${report.samples} cues — ` +
      `min ${ms(report.min)}ms, median ${ms(report.median)}ms, ` +
      `p95 ${ms(report.p95)}ms, max ${ms(report.max)}ms ` +
      `(one 60fps frame is 16.67ms)`,
  );
}

/**
 * Play a cue, now.
 *
 * A cue is a fresh buffer source over the clip decoded at boot, started at
 * once. Sources are single-use and cost almost nothing, so cues fired faster
 * than a clip lasts — a slider dragged across its notches — overlap instead
 * of cutting each other off, and there is no player to rewind, no position to
 * get wrong and nothing to wait for between `start()` and sound.
 */
function playCue(cue: FeedbackCue): void {
  if (!soundEnabled) return;

  try {
    const startedAt = now();
    const clip = clips.get(cue);
    if (!context || !clip) {
      // Not decoded yet: start the decode for next time, and stay silent now.
      preloadSounds();
      return;
    }
    // iOS suspends the graph after an interruption such as a phone call.
    if (context.state === 'suspended') void context.resume().catch(() => {});

    const source = context.createBufferSource();
    source.buffer = clip;
    source.connect(context.destination);
    source.start();
    if (timingEnabled) recordStart(startedAt);
  } catch {
    // Sound is cosmetic — a device that will not play it still teaches.
  }
}

/**
 * Release the audio graph and every decoded clip. Call when audio is switched
 * off for good; the app itself never needs this, since the graph lives as
 * long as the process.
 */
export function releaseSounds(): void {
  dropClips();
  const closing = context;
  context = null;
  if (closing) void closing.close().catch(() => {});
}

/** Fire-and-forget: emits the haptic and the sound for a cue. */
export function emitFeedback(cue: FeedbackCue): void {
  void vibrate(cue);
  playCue(cue);
}
