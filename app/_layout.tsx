/**
 * Root layout.
 *
 * Mounts the provider stack once and hosts the Expo Router `Stack`. Route
 * files under `app/` are the only place navigation is declared.
 */

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

import { env } from '@/config/env';
import { MODULES } from '@/content/registry';
import { validateModules } from '@/content/validate';
import { setHapticsEnabled, setSoundEnabled } from '@/feedback';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProgressProvider } from '@/providers/ProgressProvider';
import { palette } from '@/theme/tokens';

export default function RootLayout() {
  // Apply the feedback switches from .env once, at boot.
  useEffect(() => {
    setHapticsEnabled(env.hapticsEnabled);
    setSoundEnabled(env.soundEnabled);
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
        <AuthProvider>
          <ProgressProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: palette.canvas },
              }}
            >
              <Stack.Screen name="index" />
              {/* The runner is a full-screen, focused context — present it modally. */}
              <Stack.Screen
                name="lesson/[lessonId]"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </Stack>
          </ProgressProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
