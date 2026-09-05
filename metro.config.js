// ============================================================================
// Metro — monorepo configuration
// ============================================================================
//
// The lesson content and grading engine live in `packages/core`, outside this
// app's folder. Metro does not follow files outside the project root by
// default, so without `watchFolders` the bundler reports the package as
// missing even though npm has linked it into node_modules.
//
// `disableHierarchicalLookup` is deliberately NOT set: the app still needs the
// normal upward search to find its own dependencies at the workspace root.

const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = projectRoot; // app lives at the repo root; packages/ is a sibling

const config = getDefaultConfig(projectRoot);

// Watch the shared package so edits to a lesson hot-reload in the app.
config.watchFolders = [path.resolve(workspaceRoot, 'packages/core')];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
