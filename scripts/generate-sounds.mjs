#!/usr/bin/env node
/**
 * ============================================================================
 * Feedback sound generator — `npm run gen:sounds`
 * ============================================================================
 *
 * Synthesises the six feedback cues in `src/feedback` as 16-bit mono WAV files
 * under `assets/audio/`. The generated files are committed; this script exists
 * so they can be *changed* — tweak a frequency here and regenerate, rather than
 * hunting for a replacement clip that sounds almost right.
 *
 * Why synthesise rather than download:
 *
 *   - Licensing. OpenMacro is MIT and its lessons are public. A sound pack with
 *     an attribution clause, or worse an unclear provenance, is a liability in
 *     a repository people are invited to fork.
 *   - Size. Every cue is under 40 KB and they are all bundled into the app.
 *   - Consistency. One synthesiser means one timbre family, so the six cues
 *     sound like they belong to the same app rather than six sample packs.
 *
 * The design follows what a language app does: pitch carries the verdict.
 * Rising intervals mean yes, falling intervals mean no, and nothing is harsh —
 * these fire hundreds of times per session and an abrasive buzzer is the
 * fastest way to get the sound switched off for good.
 *
 * Requires Node 22.18+, like the rest of the tooling here.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'audio');

const SAMPLE_RATE = 44100;

/** Equal temperament, A4 = 440 Hz. Named so the recipes below read musically. */
const NOTE = {
  D4: 293.66, F4: 349.23, A4: 440.0,
  Bb3: 233.08, Eb4: 311.13,
  C5: 523.25, E5: 659.25, G5: 783.99, B5: 987.77,
  C6: 1046.5, E6: 1318.51, G6: 1567.98,
};

/**
 * One struck-bell voice: a fundamental plus two quieter partials, under an
 * exponential decay. Real bells have inharmonic partials; a plain 2f/3f stack
 * is close enough at this length and stays consonant when notes overlap.
 *
 * @param {Float64Array} buf destination, mixed into (not overwritten)
 * @param {number} startSec when the strike begins
 * @param {number} freq fundamental in Hz
 * @param {number} durSec how long the tail runs
 * @param {number} gain peak amplitude, 0..1
 * @param {number} decay larger = shorter tail
 */
function bell(buf, startSec, freq, durSec, gain, decay = 9) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  const attack = Math.floor(0.004 * SAMPLE_RATE); // 4 ms — no click, still crisp

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const t = i / SAMPLE_RATE;
    const env = (i < attack ? i / attack : 1) * Math.exp(-decay * t);
    const w =
      Math.sin(2 * Math.PI * freq * t) +
      0.32 * Math.sin(2 * Math.PI * freq * 2 * t) +
      0.12 * Math.sin(2 * Math.PI * freq * 3 * t);
    buf[n] += (w / 1.44) * env * gain;
  }
}

/**
 * A pitch sweep. Used for movement cues, where a glide reads as "going
 * somewhere" in a way two discrete notes do not.
 */
function sweep(buf, startSec, fromHz, toHz, durSec, gain) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  const attack = Math.floor(0.004 * SAMPLE_RATE);
  let phase = 0;

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const p = i / len;
    const freq = fromHz + (toHz - fromHz) * p;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    // Fade both ends so a sweep never clicks on release.
    const env = (i < attack ? i / attack : 1) * (1 - p) ** 1.6;
    buf[n] += Math.sin(phase) * env * gain;
  }
}

/**
 * A soft, slightly buzzy voice for the "no" cues: odd harmonics only, which
 * reads as blunt rather than bright. Kept low and short so it corrects without
 * scolding.
 */
function buzz(buf, startSec, freq, durSec, gain) {
  const start = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  const attack = Math.floor(0.006 * SAMPLE_RATE);

  for (let i = 0; i < len; i++) {
    const n = start + i;
    if (n >= buf.length) break;
    const t = i / SAMPLE_RATE;
    const env = (i < attack ? i / attack : 1) * Math.exp(-7 * t);
    const w =
      Math.sin(2 * Math.PI * freq * t) +
      0.4 * Math.sin(2 * Math.PI * freq * 3 * t) +
      0.16 * Math.sin(2 * Math.PI * freq * 5 * t);
    buf[n] += (w / 1.56) * env * gain;
  }
}

/** Float samples in −1..1 to a 16-bit PCM mono WAV, with headroom and clipping. */
function toWav(samples) {
  // Normalise to a consistent peak so no cue is jarringly louder than another.
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const scale = peak > 0 ? 0.89 / peak : 1;

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
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format: PCM
  header.writeUInt16LE(1, 22); // channels: mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

const silence = (sec) => new Float64Array(Math.ceil(sec * SAMPLE_RATE));

/**
 * The six cues. Each returns a filled buffer.
 *
 * Durations are deliberately short: `select` fires on every tap, so anything
 * with a tail would overlap itself into mush.
 */
const CUES = {
  /** Tapping an option. Barely there — felt more than heard. */
  select() {
    const buf = silence(0.09);
    bell(buf, 0, NOTE.B5, 0.08, 0.45, 26);
    return buf;
  },

  /** Graded correct. A rising major third, the "yes" of the set. */
  correct() {
    const buf = silence(0.42);
    bell(buf, 0, NOTE.B5, 0.22, 0.7, 11);
    bell(buf, 0.075, NOTE.E6, 0.34, 0.85, 8);
    return buf;
  },

  /** Graded incorrect. Falling, low, over quickly. Never a klaxon. */
  incorrect() {
    const buf = silence(0.36);
    buzz(buf, 0, NOTE.Eb4, 0.18, 0.6);
    buzz(buf, 0.085, NOTE.Bb3, 0.26, 0.55);
    return buf;
  },

  /** Moving to the next challenge. A short upward glide: forward motion. */
  advance() {
    const buf = silence(0.16);
    sweep(buf, 0, 520, 940, 0.12, 0.32);
    return buf;
  },

  /** Lesson finished. A full major arpeggio — the only cue allowed to sing. */
  complete() {
    const buf = silence(1.15);
    bell(buf, 0.0, NOTE.C5, 0.3, 0.6, 10);
    bell(buf, 0.11, NOTE.E5, 0.3, 0.65, 10);
    bell(buf, 0.22, NOTE.G5, 0.34, 0.7, 9);
    bell(buf, 0.33, NOTE.C6, 0.7, 0.85, 4.5);
    bell(buf, 0.33, NOTE.E6, 0.7, 0.4, 4.5); // adds shimmer to the final note
    return buf;
  },

  /** Out of hearts. Falling minor, unhurried — disappointed, not punitive. */
  fail() {
    const buf = silence(0.85);
    bell(buf, 0.0, NOTE.A4, 0.3, 0.6, 8);
    bell(buf, 0.15, NOTE.F4, 0.3, 0.58, 8);
    bell(buf, 0.3, NOTE.D4, 0.55, 0.62, 5);
    return buf;
  },
};

mkdirSync(OUT_DIR, { recursive: true });

console.log('\nOpenMacro feedback sounds\n');
let total = 0;
for (const [name, make] of Object.entries(CUES)) {
  const wav = toWav(make());
  const path = join(OUT_DIR, `${name}.wav`);
  writeFileSync(path, wav);
  total += wav.length;
  const seconds = ((wav.length - 44) / 2 / SAMPLE_RATE).toFixed(2);
  console.log(`  ${name.padEnd(10)} ${String(Math.round(wav.length / 1024)).padStart(3)} KB  ${seconds}s`);
}
console.log(`\n  ${Object.keys(CUES).length} cues, ${Math.round(total / 1024)} KB total\n`);
