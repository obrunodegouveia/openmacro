/**
 * Haptics for the toy and the bursts, without depending on any haptics
 * library: the provider takes a plain `feedback(kind)` callback, and this
 * adapts `expo-haptics` to it when the app has that installed.
 *
 * ```ts
 * import * as Haptics from 'expo-haptics';
 * <SeasonProvider feedback={expoHaptics(Haptics)} … />
 * ```
 *
 * The module is passed in rather than imported, so an app without
 * expo-haptics never resolves it, and the native fingerprint is untouched.
 */

import type { FeedbackKind } from './context.tsx';

/** The few parts of `expo-haptics` this uses, typed structurally. */
export interface HapticsModule {
  selectionAsync(): Promise<void>;
  impactAsync(style?: never): Promise<void>;
  notificationAsync(type?: never): Promise<void>;
  readonly ImpactFeedbackStyle: { readonly Light: unknown; readonly Medium: unknown };
  readonly NotificationFeedbackType: { readonly Success: unknown };
}

/**
 * A `feedback` callback that plays gentle haptics: a selection tick on a
 * tap, a light impact on grab and release, a success on a burst. Errors
 * (no haptic engine, a simulator) are swallowed: haptics are a nicety.
 *
 * @param haptics The `expo-haptics` module (`import * as Haptics`).
 * @return The callback, for `SeasonProvider`'s `feedback`.
 */
export function expoHaptics(haptics: HapticsModule): (kind: FeedbackKind) => void {
  return (kind) => {
    const done =
      kind === 'select'
        ? haptics.selectionAsync()
        : kind === 'complete'
          ? haptics.notificationAsync(haptics.NotificationFeedbackType.Success as never)
          : haptics.impactAsync((kind === 'grab' ? haptics.ImpactFeedbackStyle.Medium : haptics.ImpactFeedbackStyle.Light) as never);
    void done.catch(() => {});
  };
}
