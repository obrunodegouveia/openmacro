/**
 * Expo config.
 *
 * Static values live in `app.json`; this file exists only to inject the one
 * setting that depends on where the build is being hosted.
 *
 * `experiments.baseUrl` has to match the path the site is served from. A host
 * that serves the app at the domain root (openmacro.org) needs it unset, while
 * a project-page host serves at a subpath and needs it set, or every asset
 * request 404s:
 *
 *   npx expo export --platform web                              # root
 *   OPENMACRO_BASE_URL=/openmacro npx expo export --platform web  # subpath
 */
const app = require('./app.json');

module.exports = () => {
  const baseUrl = process.env.OPENMACRO_BASE_URL;
  return {
    ...app.expo,
    experiments: {
      ...app.expo.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};
