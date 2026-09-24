/**
 * Fetch the Piper voice models.
 *
 * Kept out of git: 170MB of weights that are byte-identical for everybody and
 * reproducible from here. `voices/` is gitignored for the same reason the
 * renders are.
 *
 *   node fetch-voices.mjs
 */
import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';

/**
 * English is `high` quality; Portuguese has exactly one voice at `medium`,
 * which is the whole selection Piper offers for pt_PT rather than a choice.
 * A Brazilian voice would have been the wrong call for a European Portuguese
 * course even at higher quality.
 */
export const VOICE_FILES = [
  'en/en_GB/cori/high/en_GB-cori-high.onnx',
  'en/en_GB/cori/high/en_GB-cori-high.onnx.json',
  'pt/pt_PT/tugão/medium/pt_PT-tugão-medium.onnx',
  'pt/pt_PT/tugão/medium/pt_PT-tugão-medium.onnx.json',
];

async function main() {
  const dir = join(HERE, 'voices');
  mkdirSync(dir, { recursive: true });
  for (const path of VOICE_FILES) {
    const name = path.split('/').pop();
    const target = join(dir, name);
    if (existsSync(target) && statSync(target).size > 0) {
      console.log(`  have  ${name}`);
      continue;
    }
    const response = await fetch(`${BASE}/${encodeURI(path)}`);
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
    console.log(`  got   ${name}  ${(statSync(target).size / 1e6).toFixed(0)}MB`);
  }
}

await main();
