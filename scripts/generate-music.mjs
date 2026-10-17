#!/usr/bin/env node
/**
 * ============================================================================
 * Background music generator — `npm run gen:music`
 * ============================================================================
 *
 * Synthesises the app's optional background loop, `assets/audio/music/
 * korobeiniki.m4a`: a short chiptune arrangement of "Korobeiniki".
 *
 * ---------------------------------------------------------------------------
 * WHY THIS TUNE IS SAFE TO SHIP
 * ---------------------------------------------------------------------------
 *
 * "Korobeiniki" is a Russian folk song from the 1860s (Nekrasov's poem, set
 * to a traditional melody). The melody is in the public domain. Arrangements
 * of it are not: the version people know from Tetris is a copyrighted
 * arrangement, and "Tetris" is a trademark. So nothing here is taken from a
 * MIDI file or a recording. The notes below are the folk melody, written out
 * by hand, and the bass line, voices and mix are original work under this
 * repository's licence. Call it Korobeiniki, never "the Tetris theme", in the
 * app and in store copy.
 *
 * ---------------------------------------------------------------------------
 * THE ARRANGEMENT
 * ---------------------------------------------------------------------------
 *
 * A minor, the relative minor of the feedback cues' C, so a correct-answer
 * chime over the music never clashes. 140 BPM. The eight-bar A theme twice:
 * a soft pulse-wave melody over a triangle-ish bass in octave eighths. Sixteen
 * bars of 4/4 is about 27 seconds, and the loop point is the rest at the end
 * of bar 16, so it repeats without a seam.
 *
 * Mono, 22.05 kHz, then AAC at 64 kb/s with macOS `afconvert`: about 220 KB,
 * small enough to ship in an over-the-air update. Without `afconvert` (Linux)
 * the WAV is kept and the script says how to convert it.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 22050;
const BPM = 140;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'audio', 'music');

/** Note name to frequency, A4 = 440. `null` is a rest. */
function hz(name) {
  if (name === null) return null;
  const match = /^([A-G])(#?)(\d)$/.exec(name);
  const semitone = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[match[1]] + (match[2] ? 1 : 0);
  return 440 * 2 ** ((semitone + (Number(match[3]) - 4) * 12) / 12);
}

/**
 * The folk melody, eight bars, as [note, beats]. q = 1, e = 0.5.
 */
const THEME = [
  // 1
  ['E5', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['C5', 0.5], ['B4', 0.5],
  // 2
  ['A4', 1], ['A4', 0.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  // 3
  ['B4', 1.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  // 4
  ['C5', 1], ['A4', 1], ['A4', 1], [null, 1],
  // 5
  ['D5', 1.5], ['F5', 0.5], ['A5', 1], ['G5', 0.5], ['F5', 0.5],
  // 6
  ['E5', 1.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
  // 7
  ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
  // 8
  ['C5', 1], ['A4', 1], ['A4', 1], [null, 1],
];

/** One bass root per bar: Am E Am E | Dm C E Am, voiced low. */
const BASS_ROOTS = ['E2', 'A2', 'E2', 'A2', 'D2', 'C2', 'E2', 'A2'];

/**
 * Adds one note to the buffer: a waveform under a short attack and an
 * exponential release, so nothing clicks at the note's edges.
 *
 * @param {Float64Array} buf The mix.
 * @param {number} at Start, in seconds.
 * @param {number} freq Frequency in Hz.
 * @param {number} dur Length, in seconds.
 * @param {number} gain Peak level.
 * @param {(phase: number) => number} wave One cycle, phase in [0, 1).
 */
function note(buf, at, freq, dur, gain, wave) {
  const start = Math.floor(at * SAMPLE_RATE);
  const len = Math.floor(dur * SAMPLE_RATE);
  const attack = Math.floor(0.006 * SAMPLE_RATE);
  const release = Math.floor(Math.min(0.06, dur * 0.3) * SAMPLE_RATE);
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / SAMPLE_RATE;
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > len - release) env = (len - i) / release;
    // A gentle decay over the note keeps long notes from droning.
    env *= Math.exp(-1.6 * t);
    buf[start + i] += gain * env * wave((freq * t) % 1);
  }
}

/** A 25% pulse, softened: the classic handheld lead without the buzz. */
const pulse = (p) => (p < 0.25 ? 0.8 : -0.27) * 0.9 + Math.sin(2 * Math.PI * p) * 0.1;

/** A triangle, for a round bass that sits under the lead. */
const triangle = (p) => (p < 0.5 ? 4 * p - 1 : 3 - 4 * p);

/** Renders the loop: the theme twice, with bass. */
function render() {
  const bars = 16;
  const buf = new Float64Array(Math.ceil(bars * BAR * SAMPLE_RATE));

  for (let pass = 0; pass < 2; pass++) {
    let at = pass * 8 * BAR;
    for (const [name, beats] of THEME) {
      const freq = hz(name);
      // Slightly detached, like a plucked note, so repeated pitches articulate.
      if (freq) note(buf, at, freq, beats * BEAT * 0.9, 0.32, pulse);
      at += beats * BEAT;
    }
    BASS_ROOTS.forEach((root, bar) => {
      const low = hz(root);
      for (let eighth = 0; eighth < 8; eighth++) {
        // The very last eighth is left empty, so the loop seam is silence.
        if (pass === 1 && bar === 7 && eighth === 7) continue;
        const freq = eighth % 2 === 0 ? low : low * 2;
        note(buf, (pass * 8 + bar) * BAR + eighth * (BEAT / 2), freq, BEAT / 2 * 0.85, 0.22, triangle);
      }
    });
  }

  // One gain stage for the whole loop, peaking at -3 dBFS.
  let peak = 0;
  for (const sample of buf) peak = Math.max(peak, Math.abs(sample));
  const scale = 0.707 / peak;
  for (let i = 0; i < buf.length; i++) buf[i] *= scale;
  return buf;
}

/** 16-bit mono PCM WAV. */
function wav(buf) {
  const data = Buffer.alloc(buf.length * 2);
  buf.forEach((sample, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

mkdirSync(OUT_DIR, { recursive: true });
const wavPath = join(OUT_DIR, 'korobeiniki.wav');
const m4aPath = join(OUT_DIR, 'korobeiniki.m4a');
const loop = render();
writeFileSync(wavPath, wav(loop));

try {
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', wavPath, m4aPath]);
  rmSync(wavPath);
  console.log(`wrote ${m4aPath} (${(loop.length / SAMPLE_RATE).toFixed(1)} s)`);
} catch {
  console.log(`wrote ${wavPath}; convert it to ${m4aPath} (AAC, 64 kb/s), e.g. with ffmpeg`);
}
