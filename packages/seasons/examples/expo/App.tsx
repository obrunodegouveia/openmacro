/**
 * All six seasons in a fresh Expo app: one controller, one provider, a few
 * decorations, and the palette roles mapped onto this app's two colours.
 *
 * Try any season today: `EXPO_PUBLIC_SEASON=halloween npx expo start`
 * (or `christmas:calm`, or `none`).
 */

import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { createSeasonController } from '@openmacro/seasons';
import { NORTHERN_CALENDAR, PRESET_PACKS, createTranslator } from '@openmacro/seasons/presets';
import {
  SeasonAtmosphere,
  SeasonCardCorner,
  SeasonFooter,
  SeasonGarland,
  SeasonGreeting,
  SeasonProvider,
  SeasonSky,
  SeasonToy,
  expoHaptics,
  useSeason,
} from '@openmacro/seasons/native';

/**
 * Created once, before the first frame. In a real app give it storage (a
 * synchronous key-value store) so the user's On/Calm/Off choice persists,
 * and a remote config URL for the kill switch.
 */
const seasons = createSeasonController({
  calendar: NORTHERN_CALENDAR,
  override: process.env.EXPO_PUBLIC_SEASON,
});

/** Words in the bundled English, or swap in `createTranslator('pt-PT')` or your own `t`. */
const translate = createTranslator('en');

/**
 * The home screen: the atmosphere behind, a garland and a greeting on top,
 * a card with its corner ornament, the footer row, and the toy last.
 *
 * @return The screen.
 */
function Home() {
  const { top } = useSafeAreaInsets();
  const season = useSeason();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  // Map the palette roles onto this app's own tokens: the whole design-system integration.
  const colors = useMemo(() => {
    const roles = season?.pack.palette[scheme];
    return { background: roles?.canvas ?? '#F7F9FB', card: roles?.surface ?? '#FFFFFF', text: roles?.ink ?? '#1F2933' };
  }, [season, scheme]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SeasonAtmosphere mist />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: top + 16 }]}>
        <SeasonGarland style={styles.garland} />
        <Text style={[styles.title, { color: colors.text }]}>My app</Text>
        <SeasonGreeting />
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SeasonCardCorner />
          <Text style={{ color: colors.text }}>Whatever the app is about.</Text>
        </View>
        <SeasonFooter style={styles.footer} />
      </ScrollView>
      <SeasonToy top={top} left="70%" />
    </View>
  );
}

/**
 * The app: gesture handler and safe area at the root, the season provider
 * inside them, and the sky over everything.
 *
 * @return The app.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SeasonProvider controller={seasons} packs={PRESET_PACKS} translate={translate} feedback={expoHaptics(Haptics)}>
          <Home />
          <Sky />
        </SeasonProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * The flyers and the nearest particles, over every screen.
 *
 * @return The sky.
 */
function Sky() {
  const { top } = useSafeAreaInsets();
  return <SeasonSky top={top} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, gap: 16 },
  garland: { marginTop: -16, marginHorizontal: -16 },
  title: { fontSize: 28, fontWeight: '800' },
  card: { borderRadius: 24, padding: 24, overflow: 'visible' },
  footer: { marginTop: 32 },
});
