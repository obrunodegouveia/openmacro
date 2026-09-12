/**
 * ============================================================================
 * The floating tab bar
 * ============================================================================
 *
 * A capsule that hovers over the content rather than a bar welded to the
 * bottom edge — the shape iOS 26 moved the whole system to, and what apps
 * built for it look like now.
 *
 * WHY THE MATERIAL IS REAL AND NOT A PAINTED APPROXIMATION. `GlassView`
 * renders `UIVisualEffectView`, so on iOS 26 this is genuine Liquid Glass:
 * it samples and refracts whatever scrolls beneath it, carries the specular
 * edge, and respects Reduce Transparency and Increase Contrast without being
 * asked. A translucent `View` with a border can match it in a screenshot and
 * cannot match it in motion, which is the only place anyone actually sees it.
 *
 * `isLiquidGlassAvailable()` is the honest gate. Below iOS 26, on Android and
 * on web the component would fall back to a plain transparent `View`, which
 * over a scrolling course map reads as a rendering fault rather than a
 * design — so those platforms get an opaque capsule with a hairline and a
 * soft shadow instead. Two deliberate looks, no third-rate imitation of the
 * first.
 *
 * Everything else is what the shape demands once you commit to floating:
 * content scrolls underneath, so screens pad their scroll by `TAB_BAR_SPACE`;
 * the selected item takes a tinted capsule because a floating bar has no edge
 * to anchor an underline to; and the icons are SF Symbols, which is what the
 * fill-on-selection convention is designed around.
 */

import { memo, useCallback, type ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SymbolView } from 'expo-symbols';
import type { BottomTabBarProps } from 'expo-router/tabs';

import { emitFeedback } from '@/feedback';
import { palette, radius, spacing, typography } from '@/theme/tokens';

/**
 * What a screen has to clear at the bottom of its scroll.
 *
 * The bar floats, so nothing reserves this space in layout — a screen that
 * forgets it ends with its last row permanently under the capsule.
 */
export const TAB_BAR_SPACE = 96;

type SymbolName = ComponentProps<typeof SymbolView>['name'];

/** Per-route presentation. Icons are SF Symbols on iOS, Material elsewhere. */
const ICONS: Record<string, { default: SymbolName; selected: SymbolName }> = {
  index: {
    default: { ios: 'house', android: 'home', web: 'home' },
    selected: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  progress: {
    default: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
    selected: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  },
  account: {
    default: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
    selected: {
      ios: 'person.crop.circle.fill',
      android: 'account_circle',
      web: 'account_circle',
    },
  },
};

function GlassTabBarComponent({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const liquid = isLiquidGlassAvailable();
  const Capsule = liquid ? GlassView : View;

  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <Capsule
        // `glassEffectStyle` is ignored by the plain View fallback, and
        // `isInteractive` is what makes the material respond to touch.
        {...(liquid ? { glassEffectStyle: 'regular' as const, isInteractive: true } : null)}
        style={[styles.bar, liquid ? styles.barGlass : styles.barSolid]}
      >
        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const focused = state.index === index;
          const label =
            typeof options?.tabBarLabel === 'string'
              ? options.tabBarLabel
              : (options?.title ?? route.name);
          return (
            <TabItem
              key={route.key}
              routeName={route.name}
              label={label}
              focused={focused}
              onPress={() => {
                // `canPreventDefault` lets a screen intercept; honour it.
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (focused || event.defaultPrevented) return;
                emitFeedback('select');
                navigation.navigate(route.name);
              }}
            />
          );
        })}
      </Capsule>
    </View>
  );
}

interface TabItemProps {
  routeName: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}

function TabItem({ routeName, label, focused, onPress }: TabItemProps) {
  const icons = ICONS[routeName];
  const tint = focused ? palette.mintDark : palette.inkMuted;

  const fallback = useCallback(
    () => <View style={[styles.iconFallback, { backgroundColor: tint }]} />,
    [tint],
  );

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.item}
    >
      <View style={[styles.itemInner, focused && styles.itemInnerFocused]}>
        {icons ? (
          <SymbolView
            name={focused ? icons.selected : icons.default}
            size={24}
            tintColor={tint}
            fallback={fallback()}
          />
        ) : (
          fallback()
        )}
        <Text numberOfLines={1} style={[styles.label, { color: tint }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export const GlassTabBar = memo(GlassTabBarComponent);

const styles = StyleSheet.create({
  dock: {
    // The dock spans the width but must not swallow taps outside the capsule.
    pointerEvents: 'box-none',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    // Fully rounded: half the height, which is the capsule iOS 26 uses.
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  barGlass: {
    // The material supplies its own ground; a background here would sit on
    // top of it and flatten the refraction.
    borderWidth: 0,
  },
  barSolid: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    ...Platform.select({
      ios: {
        shadowColor: palette.ink,
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 8 },
      default: { boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)' },
    }),
  },
  item: { flex: 1 },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  itemInnerFocused: {
    backgroundColor: palette.mintSoft,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
  },
  iconFallback: {
    width: 20,
    height: 20,
    borderRadius: 6,
    opacity: 0.9,
  },
});
