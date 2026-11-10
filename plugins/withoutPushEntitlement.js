/**
 * Removes the push entitlement that `expo-notifications` adds on iOS.
 *
 * The app only schedules local notifications (daily reminders; see
 * `src/services/reminders.ts`). Local notifications need no entitlement, but
 * the library's config plugin writes `aps-environment` unconditionally, and
 * that entitlement is for remote push: it makes every signing profile need the
 * Push Notifications capability, and with its default value of `development`
 * a store build would claim the development push environment.
 *
 * Listed *before* `expo-notifications` in app.json: mods run in reverse order
 * of the plugin list, so this one runs after the library has written it.
 * If remote push is ever added, delete this plugin and set the library's
 * `mode` option instead.
 */
const { withEntitlementsPlist } = require('expo/config-plugins');

module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
