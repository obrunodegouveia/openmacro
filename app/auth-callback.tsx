/**
 * Where Google sign-in returns to, on Android.
 *
 * `signInWithGoogle` (`src/providers/AuthProvider.tsx`) opens Google in a
 * browser tab and waits for it to come back to `openmacro://auth-callback`.
 * On iOS the browser session catches that address itself. On Android it
 * reaches the app as an ordinary deep link as well, and Expo Router opens it
 * like any other link: with no screen here, the learner got "Unmatched Route"
 * on top of a sign-in that had worked.
 *
 * The code in the link is exchanged by `signInWithGoogle`, not here: it is a
 * one-time code, and exchanging it twice would fail the second time. This
 * screen only steps out of the way, back to wherever sign-in was started.
 */

import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { palette } from '@/theme/tokens';

export default function AuthCallback() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);

  return <View style={{ flex: 1, backgroundColor: palette.canvas }} />;
}
