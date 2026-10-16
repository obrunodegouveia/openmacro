/**
 * A backdrop behind the status bar, for screens whose content scrolls under it.
 *
 * Without one, lesson titles slid straight through the clock and the battery
 * icon. On iOS 26 it is real Liquid Glass, like the tab bar at the other end
 * of the screen; elsewhere it is the canvas colour, nearly opaque, for the
 * same reason GlassTabBar gives: a transparent fallback over moving text reads
 * as a rendering fault.
 *
 * Absolutely positioned and untouchable, so it never steals a tap.
 */

import { StyleSheet, View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/theme/tokens';

export function TopScrim() {
  const insets = useSafeAreaInsets();
  if (insets.top === 0) return null;
  const style = [styles.scrim, { height: insets.top }];

  return isLiquidGlassAvailable() ? (
    <GlassView pointerEvents="none" glassEffectStyle="regular" style={style} />
  ) : (
    <View pointerEvents="none" style={[style, styles.solid]} />
  );
}

const styles = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, left: 0, right: 0 },
  solid: { backgroundColor: palette.canvas, opacity: 0.94 },
});
