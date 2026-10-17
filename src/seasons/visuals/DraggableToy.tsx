/**
 * A toy on a thread from the top of the screen that a finger can pick up.
 *
 * It bobs on its own. Dragged, it follows the finger on a stretching thread
 * and tilts with it; let go, it springs back and swings on the thread like a
 * pendulum, carrying the speed it was thrown with. A tap drops it down the
 * screen and lets it climb back (`drop`), or rings it (`swing`). The caller
 * hears about every grab, release and tap, for haptics and jokes.
 *
 * Built on Gesture Handler and Reanimated: the drag, the spring and the
 * thread all run on the UI thread, and the only React work is the caller's
 * own reaction to a tap. Without motion (Reduce Motion, a calm look) it
 * hangs still and comes back from a drag without swinging. See `shared.ts`
 * for the rules every visual here follows.
 */

import { useEffect } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { HIDDEN } from './shared';

/** How far the toy bobs on its own, in points. */
const BOB = 8;

/** The spring that brings it back: loose, so it swings past and settles. */
const PENDULUM = { damping: 5, stiffness: 70, mass: 1 } as const;

/** The spring for the vertical: a bounce on the thread, quicker to settle. */
const BOUNCE = { damping: 9, stiffness: 110, mass: 1 } as const;

/** Coming back without motion: no overshoot. */
const STILL = { duration: 260, easing: Easing.out(Easing.cubic) } as const;

/** How far a finger must move before a touch is a drag, not a tap. */
const DRAG_SLOP = 6;

/** Touch padding around the toy, in points. */
const HIT_SLOP = 14;

/**
 * The toy.
 *
 * @param props.restY How far below the top of the screen it hangs at rest.
 * @param props.size The toy's box, square, in points.
 * @param props.dropBy How far a tap drops a `drop` toy, in points.
 * @param props.maxDrag How far it can be pulled down, in points.
 * @param props.move `drop` falls and climbs back; `swing` rings like a bell.
 * @param props.thread The thread's colour.
 * @param props.animate Whether it may move on its own.
 * @param props.onTap A tap, after the toy has started its move.
 * @param props.onGrab A finger picked it up.
 * @param props.onRelease The finger let go.
 * @param props.children The toy's artwork.
 * @param props.attached Drawn beside the toy and moving with it, such as a
 *     speech bubble or a burst.
 * @return The toy and its thread. Place it in a `box-none` container
 *     positioned where the thread hangs from.
 */
export function DraggableToy({
  restY,
  size,
  dropBy,
  maxDrag,
  move,
  thread,
  animate,
  onTap,
  onGrab,
  onRelease,
  children,
  attached,
}: {
  restY: number;
  size: number;
  dropBy: number;
  maxDrag: number;
  move: 'drop' | 'swing';
  thread: ColorValue;
  animate: boolean;
  onTap?: () => void;
  onGrab?: () => void;
  onRelease?: () => void;
  children: React.ReactNode;
  attached?: React.ReactNode;
}) {
  const bob = useSharedValue(0);
  const drop = useSharedValue(0);
  const ring = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      bob.value = 0;
      return;
    }
    bob.value = withRepeat(
      withSequence(
        withTiming(BOB, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    return () => cancelAnimation(bob);
  }, [animate, bob]);

  const tapped = () => {
    if (animate && move === 'drop') {
      drop.value = withSequence(
        withSpring(dropBy, { damping: 7, stiffness: 90 }),
        withDelay(500, withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) })),
      );
    } else if (animate) {
      ring.value = withSequence(
        withTiming(22, { duration: 120 }),
        withTiming(-18, { duration: 180 }),
        withTiming(12, { duration: 180 }),
        withTiming(-6, { duration: 180 }),
        withSpring(0, { damping: 6 }),
      );
    }
    onTap?.();
  };

  const grabbed = () => onGrab?.();
  const released = () => onRelease?.();

  const pan = Gesture.Pan()
    .minDistance(DRAG_SLOP)
    .hitSlop(HIT_SLOP)
    .onStart(() => {
      cancelAnimation(x);
      cancelAnimation(y);
      cancelAnimation(drop);
      startX.value = x.value;
      startY.value = y.value + drop.value;
      drop.value = 0;
      scheduleOnRN(grabbed);
    })
    .onUpdate((event) => {
      x.value = startX.value + event.translationX;
      // Not above the anchor, and not off the bottom of the thread.
      y.value = Math.max(-restY * 0.6, Math.min(maxDrag, startY.value + event.translationY));
    })
    .onEnd((event) => {
      if (animate) {
        x.value = withSpring(0, { ...PENDULUM, velocity: event.velocityX });
        y.value = withSpring(0, { ...BOUNCE, velocity: event.velocityY });
      } else {
        x.value = withTiming(0, STILL);
        y.value = withTiming(0, STILL);
      }
      scheduleOnRN(released);
    });

  const tap = Gesture.Tap()
    .hitSlop(HIT_SLOP)
    .onEnd((_event, success) => {
      if (success) scheduleOnRN(tapped);
    });

  const gesture = Gesture.Race(pan, tap);

  // The thread runs from the anchor to the top of the toy, at whatever angle
  // the toy has been pulled to.
  const threadStyle = useAnimatedStyle(() => {
    const dy = restY + bob.value + drop.value + y.value;
    return {
      height: Math.hypot(x.value, dy),
      transform: [{ rotate: `${-Math.atan2(x.value, dy)}rad` }],
    };
  });

  const toyStyle = useAnimatedStyle(() => {
    const dy = restY + bob.value + drop.value + y.value;
    // Hangs along the thread, plus its own idle sway and any ring.
    const lean = (Math.atan2(x.value, dy) * 180) / Math.PI;
    return {
      transform: [
        { translateX: x.value },
        { translateY: bob.value + drop.value + y.value },
        { rotate: `${-lean + bob.value * 0.6 - 3 + ring.value}deg` },
      ],
    };
  });

  return (
    <View pointerEvents="box-none" style={[styles.anchor, { width: size }]}>
      <Animated.View style={[styles.thread, { left: size / 2 - 1, backgroundColor: thread }, threadStyle]} {...HIDDEN} />
      <Animated.View style={[styles.body, { top: restY - size * 0.3, width: size }, toyStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} {...HIDDEN}>
            {children}
          </View>
        </GestureDetector>
        {attached}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', top: 0, bottom: 0 },
  thread: { position: 'absolute', top: 0, width: 2, opacity: 0.6, transformOrigin: 'top' },
  body: { position: 'absolute', left: 0, alignItems: 'center', transformOrigin: 'top' },
});
