/**
 * babel-preset-expo already wires up:
 *   - expo-router (route file transforms)
 *   - react-native-reanimated / react-native-worklets plugin
 * so no extra plugins are required here. Keep this file minimal.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
