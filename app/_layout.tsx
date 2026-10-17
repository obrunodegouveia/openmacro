/**
 * Root layout.
 *
 * Mounts the provider stack once and hosts the Expo Router `Stack`. Route
 * files under `app/` are the only place navigation is declared.
 */

import { useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';

import { env } from '@/config/env';
import { MODULES } from '@openmacro/core/content/registry';
import { validateModules } from '@openmacro/core/content/validate';
import {
  preloadSounds,
  setAudioTimingEnabled,
  setHapticsEnabled,
  setSoundEnabled,
  setSoundPack,
} from '@/feedback';
import { startMusic } from '@/feedback/music';
import { AuthProvider } from '@/providers/AuthProvider';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { ContentUpdateProvider } from '@/providers/ContentUpdateProvider';
import { ProgressProvider } from '@/providers/ProgressProvider';
import { palette, resolvePalette } from '@/theme/tokens';

export default function RootLayout() {
  /*
   * The navigation theme, from the same tokens. Without it React Navigation
   * assumes light, and the native header resolves its blur as light over a
   * dark page. Theme colours must be strings, hence resolvePalette.
   */
  const scheme = useColorScheme();
  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const colors = resolvePalette(scheme);
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.mintDark,
        background: colors.canvas,
        card: colors.surface,
        text: colors.ink,
        border: colors.border,
      },
    };
  }, [scheme]);
  // Apply the feedback switches from .env once, at boot.
  useEffect(() => {
    setHapticsEnabled(env.hapticsEnabled);
    setSoundEnabled(env.soundEnabled);
    setSoundPack(env.soundPack);
    setAudioTimingEnabled(env.audioTiming);

    /**
     * Build the audio players now rather than on first use. A player created
     * lazily has to decode its clip before it can sound, which made the first
     * cue of a session land after the animation it belonged to — and only the
     * first, which is what made the timing feel unpredictable.
     */
    preloadSounds();

    // Optional background loop; on unless the learner turned it off.
    void startMusic();
  }, []);

  /**
   * Validate the bundled content on boot in development, so a contributor who
   * mistypes a formula id or a dangling event id sees it on the very next
   * hot-reload instead of discovering it mid-lesson.
   */
  useEffect(() => {
    if (!env.validateContentOnBoot) return;
    const issues = validateModules(MODULES);
    if (issues.length === 0) return;
    console.error(
      `[OpenMacro] ${issues.length} content issue(s) found. Run \`npm run lint:content\` for details.`,
    );
    for (const issue of issues) {
      console.error(`  • ${issue.path}: ${issue.message}`);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LocaleProvider>
        <AuthProvider>
          <ContentUpdateProvider>
          <ProgressProvider>
            <StatusBar style="auto" />
            <ThemeProvider value={navigationTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: palette.canvas },
              }}
            >
              {/* The tab bar owns the top level; the runner sits outside it
                  so a lesson is not interruptible by a tab. */}
              <Stack.Screen name="(tabs)" />
              {/* A module's page: a plain push, so the system back swipe
                  returns to wherever the learner came from. The bar carries
                  only "Module N" and the share button; the full title is in
                  the page, because iOS large titles truncate long ones. */}
              <Stack.Screen
                name="module/[moduleId]"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  headerBlurEffect: 'systemChromeMaterial',
                  headerShadowVisible: false,
                  headerTintColor: palette.mintDark,
                  headerTitleStyle: { color: palette.ink },
                  headerBackButtonDisplayMode: 'minimal',
                }}
              />
              {/* The runner is a full-screen, focused context — present it modally. */}
              <Stack.Screen
                name="lesson/[lessonId]"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              {/* Review is the same kind of focused context as a lesson. */}
              <Stack.Screen
                name="review"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </Stack>
            </ThemeProvider>
          </ProgressProvider>
          </ContentUpdateProvider>
        </AuthProvider>
        </LocaleProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
