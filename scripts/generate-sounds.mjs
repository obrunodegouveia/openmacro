#!/usr/bin/env node
/**
 * ============================================================================
 * Feedback sound generator — `npm run gen:sounds`
 * ============================================================================
 *
 * Synthesises the six feedback cues in `src/feedback` as 16-bit mono WAV files
 * under `assets/audio/`. The generated files are committed; this script exists
 * so they can be *changed* — tweak a note here and regenerate, rather than
 * hunting for a replacement clip that sounds almost right.
 *
 * Synthesised rather than sampled because OpenMacro is MIT and people are
 * invited to fork it: a sound pack with an attribution clause, or unclear
 * provenance, is a liability. These are original work under the same licence
 * as the rest of the repository.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE SOUND LIKE A SET
 * ---------------------------------------------------------------------------
 *
 * Four rules, and breaking any one of them is what makes app audio feel random
 * even when each individual sound is fine:
 *
 * 1. ONE KEY. Everything is built from C. Success is C major, failure is C
 *    minor — the same tonic, so they are relatives rather than strangers. The
 *    first version of this file had four unrelated keys (E, E flat, C, D
 *    minor), which is exactly what "a bit random" sounds like.
 *
 * 2. ONE PULSE. Every note starts on a 1/16 grid at 150 BPM (100 ms). Notes
 *    landing on a shared grid read as deliberate; arbitrary offsets read as
 *    sloppy, even at this length where nobody could name the tempo.
 *
 * 3. ONE VOICE. A single `voice()` for all six cues, varying only in
 *    brightness and decay. Three different synthesis functions meant three
 *    different instruments playing in three different rooms.
 *
 * 4. ONE GAIN STAGE. The whole set is normalised together, against the loudest
 *    cue, so the relative dynamics written below survive into the files. The
 *    previous version normalised each file to its own peak, which flattened a
 *    quiet tap and a lesson fanfare to the same level and then tried to undo
 *    it with volume multipliers in the app.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'audio');

const SAMPLE_RATE = 44100;

/** 150 BPM. `S` is a sixteenth — the grid every note onset is a multiple of. */
const S = 60 / 150 / 4; // 0.1 s

/**
 * Equal temperament around a tonic of C. Only the degrees these cues use.
 * Major degrees carry the "yes" cues, minor ones the "no" cues.
 */
const N = {
  C4: 261.63, Eb4: 311.13, G4: 392.0,
  C5: 523.25, Eb5: 622.25, E5: 659.25, G5: 783.99,
  C6: 1046.5, E6: 1318.51,
};

/**
 * The one voice: a struck tone with a fixed harmonic series, shaped by
 * `brightness` (how much of the upper partials survive) and `decay` (how fast
 * the tail goes). Everything else is held constant so the six cues share a
 * character.
 *
 * @param {Float64Array} buf destination, mixed into
 * @param {number} at onset in seconds — always a multiple of `S`
 * @param {number} freq fundamental in Hz
 * @param {number} dur tail length in seconds
 * @param {number} gain relative level, 0..1, preserved across the whole set
 * @param {number} decay larger = shorter
 * @param {number} brightness 0 = fundamental only, 1 = full harmonic stack
 */
function voice(buf, at, freq, dur, gain, decay, brightness) {
  const start = Math.floor(at * SAMPLE_RATE);
  const len = Math.floor(dur * SAMPLE_RATE);
  const attack = Math.floor(0.004 * SAMPLE_RATE); // 4 ms: no click, still crisp

  // Partial amplitudes at full brightness. Scaled by `brightness` so a dark
  // cue is the same instrument played softly, not a different one.
  const partials = [
    [1, 1.0],
    [2, 0.34 * brightness],
    [3, 0.16 * brightness],
    [4, 0.07 * brightness],
  ];
  const norm = partials.reduce((sum, [, a]) => sum + a, 0);

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const t = i / SAMPLE_RATE;
    const env = (i < attack ? i / attack : 1) * Math.exp(-decay * t);
    let w = 0;
    for (const [mult, amp] of partials) w += amp * Math.sin(2 * Math.PI * freq * mult * t);
    buf[n] += (w / norm) * env * gain;
  }
}

const silence = (sec) => new Float64Array(Math.ceil(sec * SAMPLE_RATE));

/**
 * The six cues.
 *
 * `gain` values are relative and meaningful: `select` fires on every tap and
 * must sit under the interface, `complete` happens once a lesson and is
 * allowed to be the loudest thing in the app. These proportions survive into
 * the files because the set is normalised together.
 */
const CUES = {
  /** Tapping an option. One note on the dominant — unresolved, so it asks for
   *  nothing and can repeat endlessly without fatiguing. */
  select() {
    const buf = silence(0.1);
    voice(buf, 0, N.G5, 0.09, 0.2, 30, 0.35);
    return buf;
  },

  /** Moving to the next challenge. The tonic an octave up: settled, forward. */
  advance() {
    const buf = silence(0.16);
    voice(buf, 0, N.C6, 0.14, 0.26, 22, 0.5);
    return buf;
  },

  /** Graded correct. A rising fourth onto the tonic — the sound of resolving. */
  correct() {
    const buf = silence(0.5);
    voice(buf, 0 * S, N.G5, 0.2, 0.62, 12, 0.8);
    voice(buf, 1 * S, N.C6, 0.38, 0.78, 7, 0.9);
    return buf;
  },

  /** Graded incorrect. A falling minor third, borrowed from C minor: related
   *  to the success cues, clearly not one of them. Dark and brief. */
  incorrect() {
    const buf = silence(0.46);
    voice(buf, 0 * S, N.Eb5, 0.18, 0.5, 13, 0.35);
    voice(buf, 1 * S, N.C5, 0.32, 0.55, 9, 0.28);
    return buf;
  },

  /** Lesson finished. The C major arpeggio, on the grid, with the final tonic
   *  held and doubled a third above for shimmer. The loudest cue in the app. */
  complete() {
    const buf = silence(1.2);
    voice(buf, 0 * S, N.C5, 0.26, 0.62, 11, 0.75);
    voice(buf, 1 * S, N.E5, 0.26, 0.68, 11, 0.8);
    voice(buf, 2 * S, N.G5, 0.3, 0.74, 10, 0.85);
    voice(buf, 3 * S, N.C6, 0.8, 1.0, 4, 0.95);
    voice(buf, 3 * S, N.E6, 0.8, 0.3, 4, 0.7);
    return buf;
  },

  /** Out of hearts. The C minor triad falling, on a slower 1/8 grid so it
   *  lands heavier than anything else without being louder. */
  fail() {
    const buf = silence(1.0);
    voice(buf, 0 * S, N.G4, 0.3, 0.6, 8, 0.4);
    voice(buf, 2 * S, N.Eb4, 0.3, 0.62, 8, 0.35);
    voice(buf, 4 * S, N.C4, 0.6, 0.66, 4.5, 0.3);
    return buf;
  },
};

/** Float samples to a 16-bit PCM mono WAV. Scaling is applied by the caller. */
function toWav(samples, scale) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i] * scale));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

mkdirSync(OUT_DIR, { recursive: true });

// Render everything first, so one gain stage can serve the whole set.
const rendered = Object.entries(CUES).map(([name, make]) => [name, make()]);

let setPeak = 0;
for (const [, buf] of rendered) for (const s of buf) setPeak = Math.max(setPeak, Math.abs(s));
const scale = setPeak > 0 ? 0.89 / setPeak : 1;

console.log('\nOpenMacro feedback sounds — C major / C minor, 150 BPM\n');
let total = 0;
for (const [name, buf] of rendered) {
  const wav = toWav(buf, scale);
  writeFileSync(join(OUT_DIR, `${name}.wav`), wav);
  total += wav.length;

  let peak = 0;
  for (const s of buf) peak = Math.max(peak, Math.abs(s));
  const seconds = ((wav.length - 44) / 2 / SAMPLE_RATE).toFixed(2);
  const relative = ((peak / setPeak) * 100).toFixed(0);
  console.log(
    `  ${name.padEnd(10)} ${String(Math.round(wav.length / 1024)).padStart(3)} KB  ` +
      `${seconds}s  ${relative.padStart(3)}% of set peak`,
  );
}
console.log(`\n  ${rendered.length} cues, ${Math.round(total / 1024)} KB total\n`);
