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
 *
 * Because this file exists, eas-cli will not write to the config for you —
 * `eas init` prints a project id and stops. Add it, and the account that owns
 * the project, to `app.json` by hand:
 *
 *   "owner": "your-expo-account",
 *   "extra": { "eas": { "projectId": "…" } }
 *
 * `npm run preflight:store` fails while either is missing, because a build in
 * CI cannot prompt for them. See docs/mobile-release.md.
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
