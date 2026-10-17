/**
 * The tab bar.
 *
 * `Tabs` supplies the routing, focus state and accessibility wiring; the bar
 * itself is ours, because the shape wanted here — a capsule floating over the
 * content, in Liquid Glass on iOS 26 — is not what the system bar draws and
 * not something a system bar can be configured into. See `GlassTabBar` for
 * what that costs and what it buys.
 *
 * The bar floats, so it reserves no layout space and every screen under it
 * pads its own scroll by `TAB_BAR_SPACE`.
 */

import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { GlassTabBar } from '@/components/ui/GlassTabBar';
import { SeasonalBats } from '@/components/ui/SeasonalDecor';
import { useLocale } from '@/providers/LocaleProvider';

export default function TabLayout() {
  const { t } = useLocale();

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // The scene must run to the bottom edge; the capsule sits on top of it.
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Today answers "what next?", Course is the map, Profile is you. */}
      <Tabs.Screen name="index" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="course" options={{ title: t('tabs.course') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
    {/* Over every tab, so they keep flying when the learner switches. */}
    <SeasonalBats />
    </View>
  );
}
