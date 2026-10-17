/**
 * Builds the package for use outside this repository.
 *
 * Inside the monorepo the package is consumed as TypeScript source (Metro and
 * Next transpile it, Node strips the types). Another project cannot rely on
 * that, so this compiles `src/` to plain ES modules with type definitions in
 * `dist/`, and writes a `dist/package.json` whose exports point at them. The
 * result installs anywhere:
 *
 *   npm run build --workspace @openmacro/seasons
 *   npm install /path/to/openmacro/packages/seasons/dist
 *
 * or `npm pack` inside `dist/` for a tarball.
 */

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });

// The repository's TypeScript (7, native); `rewriteRelativeImportExtensions`
// turns the source's `./engine.ts` imports into `./engine.js`.
const tsc = findTsc(root);
execFileSync(process.execPath, [tsc, '-p', join(root, 'tsconfig.build.json')], { stdio: 'inherit' });

const source = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

/** One export entry: types first, as TypeScript requires, then the module. */
const entry = (name) => ({ types: `./${name}.d.ts`, default: `./${name}.js` });

const published = {
  name: source.name,
  version: source.version,
  description: source.description,
  license: source.license,
  type: 'module',
  exports: {
    '.': entry('index'),
    './react': entry('react'),
    './types': entry('types'),
    './web': entry('web'),
  },
  peerDependencies: source.peerDependencies,
  peerDependenciesMeta: source.peerDependenciesMeta,
  sideEffects: false,
};
writeFileSync(join(dist, 'package.json'), `${JSON.stringify(published, null, 2)}\n`);

for (const file of ['README.md', 'CHANGELOG.md']) copyFileSync(join(root, file), join(dist, file));
copyFileSync(join(root, '..', '..', 'LICENSE'), join(dist, 'LICENSE'));

console.log(`Built ${source.name}@${source.version} into dist/`);
