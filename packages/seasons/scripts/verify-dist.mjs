/**
 * Proves the built package works in a project that is not this one.
 *
 * Packs `dist/` into a tarball, installs it into an empty temporary project,
 * then runs a consumer script on plain Node and type-checks a TypeScript
 * consumer with Node-style module resolution — what another app would do.
 * Run `npm run build` first.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** The repository's TypeScript compiler, found by walking up to node_modules. */
function findTsc(from) {
  for (let dir = from; ; dir = dirname(dir)) {
    const candidate = join(dir, 'node_modules', 'typescript-native', 'bin', 'tsc');
    if (existsSync(candidate)) return candidate;
    if (dirname(dir) === dir) throw new Error('typescript-native not found; run npm ci at the repository root');
  }
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tsc = findTsc(root);
const work = mkdtempSync(join(tmpdir(), 'seasons-consumer-'));
const run = (cmd, args, cwd = work) => execFileSync(cmd, args, { cwd, stdio: 'pipe', encoding: 'utf8' });

try {
  const tarball = run('npm', ['pack', '--silent', '--pack-destination', work], join(root, 'dist')).trim().split('\n').pop();
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }));
  run('npm', ['install', '--silent', '--no-audit', '--no-fund', join(work, tarball)]);

  // 1. Runs on plain Node, no TypeScript involved.
  writeFileSync(join(work, 'run.mjs'), `
    import { decide, parseRemoteConfig } from '@openmacro/seasons';
    import { createBootScript } from '@openmacro/seasons/web';
    const calendar = [{ id: 'winter', from: { month: 12, day: 15 }, to: { month: 1, day: 6 } }];
    const d = decide({ calendar, now: new Date(2026, 11, 20) });
    if (d.season !== 'winter') throw new Error('expected winter, got ' + d.season);
    if (decide({ calendar, now: new Date(2026, 6, 1) }).season !== null) throw new Error('expected no season in July');
    if (!createBootScript({ calendar }).includes('data-season')) throw new Error('boot script missing');
    parseRemoteConfig({ version: 1, calm: true }, ['winter']);
    console.log('run ok');
  `);
  console.log(run(process.execPath, ['run.mjs']).trim());

  // 2. Type-checks as a TypeScript consumer would see it.
  writeFileSync(join(work, 'consumer.ts'), `
    import { createSeasonController, type SeasonWindow } from '@openmacro/seasons';
    import type { SeasonDecision } from '@openmacro/seasons/types';
    const calendar: SeasonWindow<'winter'>[] = [{ id: 'winter', from: { month: 12, day: 15 }, to: { month: 1, day: 6 } }];
    const store = new Map<string, string>();
    const c = createSeasonController({ calendar, storage: { get: (k) => store.get(k) ?? null, set: (k, v) => { store.set(k, v); } } });
    const d: SeasonDecision<'winter'> = c.getSnapshot();
    export const look: string = d.look;
  `);
  writeFileSync(join(work, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { target: 'ES2022', module: 'nodenext', moduleResolution: 'nodenext', strict: true, noEmit: true, skipLibCheck: false, lib: ['ES2022', 'DOM'], types: [] },
    files: ['consumer.ts'],
  }));
  run(process.execPath, [tsc, '-p', join(work, 'tsconfig.json')]);
  console.log('types ok');
} catch (error) {
  console.error(error.stdout ?? '', error.stderr ?? '', error.message);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
