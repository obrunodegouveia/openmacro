/**
 * The home-screen widget: the day streak and the next lesson, one tap from
 * continuing.
 *
 * This function runs in the widget extension, not in the app, and the
 * `'widget'` directive tells the bundler to compile it on its own. That is
 * why it is self-contained: inside it there are only `@expo/ui/swift-ui`
 * components, no hooks, no app state, and nothing declared outside the
 * function, not even a constant in this file. Every string arrives in props,
 * already translated, from `WidgetSync`.
 *
 * A tap opens the next lesson itself (`widgetURL`), not just the app.
 *
 * Colours are SwiftUI semantic ones ('primary', 'secondary') plus the brand
 * greens, so it reads in light and dark home screens without a palette.
 */

import { HStack, Image, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding, widgetURL } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export interface StreakWidgetProps {
  /** Consecutive days with a lesson. */
  streak: number;
  /** Whether today already counts. */
  keptToday: boolean;
  /** "4 days" / "4 dias", formatted by the app. */
  streakLabel: string;
  /** "Next" / "A seguir". */
  nextLabel: string;
  /** The next lesson's title, or the "all done" line. */
  lessonTitle: string;
  /** "Module 3 · 2 of 6", or empty. */
  detail: string;
  /** Where a tap goes: the next lesson, or Today when there is none. */
  url: string;
}

const StreakWidget = (props: StreakWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const medium = environment.widgetFamily === 'systemMedium';
  const flame = props.keptToday ? '#FF9500' : '#8E9AA8';

  return (
    <VStack alignment="leading" spacing={6} modifiers={[padding({ all: 4 }), widgetURL(props.url)]}>
      <HStack spacing={6}>
        <Image systemName="flame.fill" size={medium ? 22 : 18} color={flame} />
        <Text modifiers={[font({ weight: 'bold', size: medium ? 20 : 17 }), foregroundStyle('primary')]}>
          {props.streakLabel}
        </Text>
        <Spacer />
      </HStack>
      <Spacer />
      <Text modifiers={[font({ weight: 'semibold', size: 12 }), foregroundStyle('#2FBF71')]}>
        {props.nextLabel}
      </Text>
      <Text modifiers={[font({ weight: 'bold', size: medium ? 17 : 14 }), foregroundStyle('primary')]}>
        {props.lessonTitle}
      </Text>
      {medium && props.detail ? (
        <Text modifiers={[font({ size: 13 }), foregroundStyle('secondary')]}>{props.detail}</Text>
      ) : null}
    </VStack>
  );
};

export default createWidget('StreakWidget', StreakWidget);
