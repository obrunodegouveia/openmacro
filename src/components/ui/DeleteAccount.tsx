/**
 * ============================================================================
 * Delete account
 * ============================================================================
 *
 * Required by Apple guideline 5.1.1(v) and Google Play: an app that lets people
 * create an account must let them delete it from inside the app, without
 * emailing anyone and without being talked out of it.
 *
 * Three deliberate choices about how it behaves.
 *
 * IT IS FINDABLE. Reviewers look for this, and so do people who want out. It
 * sits in plain sight under the account strip rather than behind a settings
 * screen that does not otherwise exist.
 *
 * IT ASKS FOR THE EMAIL. Typing the address of the account you are deleting is
 * a hard thing to do by accident, and unlike a "are you sure?" it cannot be
 * dismissed by muscle memory. The server checks it too; this is not the guard,
 * only the part the learner sees.
 *
 * IT DOES NOT ARGUE. No offer to export, no "you will lose your streak", no
 * dark pattern. The learner has decided.
 */

import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { supabase } from '@/services/supabaseClient';
import { palette, radius, spacing, typography } from '@/theme/tokens';

/** Where the deletion endpoint lives. The app has no server of its own. */
const ENDPOINT = 'https://openmacro.org/api/account/delete';

export function DeleteAccount() {
  const { session, identity, signOut } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nothing to delete when nobody is signed in.
  if (!session || !identity) return null;

  async function remove() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const token = session?.access_token;
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ confirmEmail: email.trim() }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? t('account.delete.failed'));
        return;
      }
      /**
       * The account is gone, so the stored session now refers to nothing.
       * Signing out clears it and returns the app to its offline state, which
       * is exactly what a fresh install looks like.
       */
      await signOut();
    } catch {
      setError(t('account.delete.unreachable'));
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.delete.open')}
        hitSlop={8}
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <Text style={styles.triggerText}>{t('account.delete')}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{t('account.delete.title')}</Text>
      <Text style={styles.body}>{t('account.delete.body')}</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={
          identity.displayName.includes('@')
            ? identity.displayName
            : t('account.delete.placeholder')
        }
        placeholderTextColor={palette.inkFaint}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        accessibilityLabel={t('account.delete.confirmLabelGeneric')}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setOpen(false);
            setEmail('');
            setError(null);
          }}
          style={styles.cancel}
        >
          <Text style={styles.cancelText}>{t('account.delete.keep')}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('account.delete.confirmA11y')}
          accessibilityState={{ disabled: busy, busy }}
          disabled={busy}
          onPress={() => void remove()}
          style={[styles.confirm, busy ? styles.confirmBusy : null]}
        >
          {busy ? (
            <ActivityIndicator color={palette.surface} />
          ) : (
            <Text style={styles.confirmText}>{t('account.delete.confirm')}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  triggerText: {
    ...typography.caption,
    color: palette.inkMuted,
    textDecorationLine: 'underline',
  },
  panel: {
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.coralSoft,
    backgroundColor: palette.coralSoft,
    gap: spacing.md,
  },
  title: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  body: {
    ...typography.caption,
    color: palette.ink,
  },
  input: {
    ...typography.body,
    color: palette.ink,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surface,
  },
  error: {
    ...typography.caption,
    color: palette.coralDark,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancel: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: palette.surface,
  },
  cancelText: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  confirm: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: palette.coralDark,
  },
  confirmBusy: {
    opacity: 0.7,
  },
  confirmText: {
    ...typography.bodyStrong,
    color: palette.surface,
  },
});
