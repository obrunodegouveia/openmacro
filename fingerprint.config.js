/**
 * What counts as a native change.
 *
 * `runtimeVersion` uses the `fingerprint` policy, so this file decides which
 * updates can reach which binaries. An update is only offered to an app whose
 * fingerprint matches it exactly; get this wrong in the permissive direction
 * and a JavaScript bundle calls into native code that is not in the app, which
 * crashes on launch. That is why the default is to hash almost everything.
 *
 * One default is wrong for this project. `@expo/fingerprint` hashes the whole
 * `scripts` block of `package.json`, because a script can be a native build
 * hook — `postinstall`, `eas-build-pre-install`. Ours are not: they are
 * content tooling, linting and the i18n round trip, none of which the native
 * build ever runs.
 *
 * The cost of leaving it on was not theoretical. Adding `i18n:fixspelling`
 * moved the fingerprint from f010afee to b19b4646, which silently orphaned
 * TestFlight build 15: a hand-run `npm run update:store` would have published
 * cleanly, reported success and reached nobody — the failure
 * `docs/mobile-release.md` warns about in those words.
 *
 * CI would not have made that mistake. `content-update.yml` refuses to publish
 * when `package.json` changes at all, which without this file is the only
 * correct thing it could do. It stays that way: the guard fails closed, and
 * being conservative about a file that also declares dependencies is cheap.
 * What changes here is that a scripts-only edit is now genuinely safe rather
 * than something the guard has to be trusted to stop.
 *
 * The skip narrows nothing that matters: `package.json` contributes
 * no other fingerprint source, and the lockfile contributes none at all.
 * Native dependencies are tracked where they are real rather than where they
 * are declared — `expoAutolinkingConfig`, `rncoreAutolinkingConfig`, and a
 * hash of every installed module's own `ios`/`android` directory. Adding
 * expo-localization moved the fingerprint by adding
 * `node_modules/expo-localization/ios` to that list, which is the mechanism
 * working correctly. Editing a script is not that, and now does not pretend
 * to be.
 */
/** @type {import('@expo/fingerprint').Config} */
module.exports = {
  sourceSkips: ['PackageJsonScriptsAll'],
};
