/**
 * A challenge's speaker — Olivia, Breno — drawn as a small flat portrait.
 *
 * Which face to show is not decided here: `@openmacro/core/engine/speaker`
 * maps the moment (question, correct, incorrect) to an expression for both
 * clients, and this only turns that pair into an image. The website draws the
 * same faces from SVG (`web/src/components/challenges/character-avatar.tsx`).
 *
 * Decorative. The prompt and the feedback sheet already say everything the
 * picture does, so it is hidden from screen readers rather than announced as
 * "Olivia, thinking" before every question.
 */

import { memo, useEffect } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Asset } from 'expo-asset';

import type { CharacterExpression, CharacterId } from '@openmacro/core/content/characters';
import type { Lesson } from '@openmacro/core/content/schema';

/**
 * Every face, by character and expression.
 *
 * Typed against the registry in core, so a character added there without art
 * here fails the typecheck instead of drawing an empty box. Each `require`
 * resolves to `@2x`/`@3x` by screen density.
 */
const FACES: Record<CharacterId, Record<CharacterExpression, ImageSourcePropType>> = {
  olivia: {
    happy: require('../../../assets/characters/olivia-happy.png'),
    excited: require('../../../assets/characters/olivia-excited.png'),
    thinking: require('../../../assets/characters/olivia-thinking.png'),
    oops: require('../../../assets/characters/olivia-oops.png'),
  },
  breno: {
    happy: require('../../../assets/characters/breno-happy.png'),
    excited: require('../../../assets/characters/breno-excited.png'),
    thinking: require('../../../assets/characters/breno-thinking.png'),
    oops: require('../../../assets/characters/breno-oops.png'),
  },
};

/** All of a lesson's speakers' faces, so a reaction never waits on a decode. */
export function lessonSpeakerFaces(lesson: Pick<Lesson, 'challenges'>): number[] {
  const ids = new Set<CharacterId>();
  for (const challenge of lesson.challenges) if (challenge.speaker) ids.add(challenge.speaker);
  return [...ids].flatMap((id) => Object.values(FACES[id]) as number[]);
}

/**
 * Load every face a lesson can show before its first question.
 *
 * Eight small images at most. Without this the first excited/oops face of a
 * run arrives a frame or two after the sheet, which reads as a flicker. A
 * failure is harmless — the image loads on demand instead — so it is
 * swallowed rather than reported.
 */
export function usePreloadSpeakers(lesson: Pick<Lesson, 'challenges'>): void {
  useEffect(() => {
    const faces = lessonSpeakerFaces(lesson);
    if (faces.length) void Asset.loadAsync(faces).catch(() => {});
  }, [lesson]);
}

export interface CharacterAvatarProps {
  character: CharacterId;
  expression: CharacterExpression;
  /** Edge length in points. The art is square. */
  size?: number;
  /**
   * Spring in when it mounts — the feedback sheet's reaction. Skipped when
   * the learner has asked the system to reduce motion.
   */
  pop?: boolean;
  style?: StyleProp<ViewStyle>;
}

function CharacterAvatarComponent({ character, expression, size = 64, pop = false, style }: CharacterAvatarProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(pop && !reduceMotion ? 0.55 : 1);

  useEffect(() => {
    if (!pop || reduceMotion) return;
    scale.value = withSequence(
      withTiming(0.55, { duration: 0 }),
      withSpring(1, { damping: 9, stiffness: 260, mass: 0.7 }),
    );
  }, [pop, reduceMotion, scale, expression]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View
      // The size is reserved even before the image decodes, so nothing shifts.
      style={[{ width: size, height: size }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      <Animated.View style={[styles.fill, popStyle]}>
        <Image source={FACES[character][expression]} style={styles.fill} resizeMode="contain" fadeDuration={0} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
});

export const CharacterAvatar = memo(CharacterAvatarComponent);
