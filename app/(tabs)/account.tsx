/**
 * Account — sign-in, language, and the two destructive controls.
 *
 * These were scattered down the learning path because there was nowhere else
 * for them: the account bar at the top, the language picker and reset at the
 * very bottom, past every module. Language in particular was effectively
 * hidden — a learner who wanted the course in Portuguese had to scroll the
 * entire course to find out they could have it.
 *
 * Order is deliberate. Identity first, because sync status explains where
 * progress lives; language next, because it is the control people come here
 * for; destructive actions last and visually quieter, because nobody should
 * arrive at "delete" while looking for "Português".
 */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import { AccountBar } from '@/components/ui/AccountBar';
import { DeleteAccount } from '@/components/ui/DeleteAccount';
import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { LanguagePicker } from '@/components/ui/LanguagePicker';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
      ]}
      scrollIndicatorInsets={{ bottom: TAB_BAR_SPACE }}
    >
      <Text style={styles.title}>{t('account.title')}</Text>

      <AccountBar />

      <View style={styles.section}>
        <LanguagePicker />
      </View>

      <DangerZone />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

/**
 * The two controls that destroy something, behind one closed door.
 *
 * Both were previously loose at the foot of the screen, which put "delete my
 * account" one stray tap from the language picker — the control people
 * actually come to this screen for. Collapsing them costs a deliberate tap
 * and removes an accidental one.
 *
 * It reopens closed on every visit. This is state, not a preference: a
 * learner who opened it once to reset their progress should not find the
 * delete button waiting for them the next time they come to change language.
 * Compare the video collapse, which is remembered precisely because getting
 * it wrong costs nothing.
 */
function DangerZone() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.danger}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t('account.danger')}
        onPress={() => setOpen((was) => !was)}
        style={styles.dangerHead}
      >
        <Text style={styles.dangerTitle}>{t('account.danger')}</Text>
        <Text style={styles.dangerChevron}>{open ? '⌃' : '⌄'}</Text>
      </Pressable>

      {open ? (
        <View style={styles.dangerBody}>
          <ResetProgressButton />
          <DeleteAccount />
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------

/**
 * Clears XP, streak and completion records.
 *
 * Progress persists on the device, so there has to be a way back to zero —
 * for a learner who wants a clean run, and for contributors testing the first
 * session. Confirmation is a second tap rather than a dialog: `Alert.alert` is
 * a no-op on react-native-web, which would leave this destructive control
 * silently unconfirmed on one of our three platforms.
 */
function ResetProgressButton() {
  const { reset } = useProgress();
  const { t } = useLocale();
  const [armed, setArmed] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  const handlePress = useCallback(() => {
    if (!armed) {
      setArmed(true);
      timeout.current = setTimeout(() => setArmed(false), 4000);
      return;
    }
    if (timeout.current) clearTimeout(timeout.current);
    setArmed(false);
    void reset();
  }, [armed, reset]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={armed ? t('path.reset.armedA11y') : t('path.reset')}
      hitSlop={8}
      onPress={handlePress}
      style={styles.reset}
    >
      <Text style={[styles.resetText, armed && styles.resetTextArmed]}>
        {armed ? t('path.reset.armed') : t('path.reset')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  title: { ...typography.display, color: palette.ink },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: spacing.md,
  },
  danger: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.coralSoft,
    overflow: 'hidden',
  },
  dangerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dangerTitle: { ...typography.bodyStrong, color: palette.coralDark },
  dangerChevron: { ...typography.body, color: palette.coralDark },
  dangerBody: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  reset: { alignSelf: 'flex-start', paddingVertical: spacing.sm },
  resetText: { ...typography.caption, color: palette.inkFaint },
  resetTextArmed: { color: palette.coralDark },
});
