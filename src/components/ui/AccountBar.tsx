/**
 * Sign-in / account strip on the learning path.
 *
 * Renders nothing at all when this build has no Supabase project configured,
 * so the offline clone never advertises accounts it cannot provide.
 */

import { memo } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import type { SyncState } from '@/services/syncedDataProvider';
import type { Translator } from '@openmacro/core/i18n';
import { palette, radius, spacing, typography } from '@/theme/tokens';

function AccountBarComponent() {
  const { enabled, loading, identity, signingIn, error, signInWithGoogle, signOut } = useAuth();
  const { merging, sync } = useProgress();
  const { t } = useLocale();

  if (!enabled || loading) return null;

  // ---- signed in --------------------------------------------------------
  if (identity) {
    return (
      <View style={styles.signedInBlock}>
      <View style={styles.row}>
        {identity.avatarUrl ? (
          <Image
            source={{ uri: identity.avatarUrl }}
            style={styles.avatar}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {identity.displayName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {identity.displayName}
          </Text>
          <Text style={[styles.status, sync?.pending && styles.statusPending]}>
            {statusLine(t, merging, sync)}
          </Text>
        </View>

        {merging || sync?.pushing ? <ActivityIndicator color={palette.inkFaint} /> : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('account.signOutOf', { name: identity.displayName })}
          hitSlop={8}
          onPress={() => void signOut()}
        >
          <Text style={styles.signOut}>{t('account.signOut')}</Text>
        </Pressable>
      </View>
      </View>
    );
  }

  // ---- signed out -------------------------------------------------------
  return (
    <View style={styles.signedOut}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.signIn')}
        accessibilityState={{ disabled: signingIn, busy: signingIn }}
        disabled={signingIn}
        onPress={() => void signInWithGoogle()}
        style={({ pressed }) => [styles.googleButton, pressed && styles.googleButtonPressed]}
      >
        {signingIn ? (
          <ActivityIndicator color={palette.ink} />
        ) : (
          <>
            <GoogleMark />
            <Text style={styles.googleLabel}>{t('account.signIn')}</Text>
          </>
        )}
      </Pressable>
      <Text style={styles.signedOutHint}>{t('account.optional')}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

/**
 * The one line under the learner's name.
 *
 * Pending work is stated as *saved*, not as failed, because that is what is
 * true: the lesson is committed to this device and the account is a retry
 * away. Telling someone their progress did not save, when it did, is the
 * worse error.
 */
function statusLine(t: Translator, merging: boolean, sync: SyncState | null): string {
  if (merging) return t('account.sync.merging');
  if (sync?.pushing) return t('account.sync.pushing');
  if (sync?.pending) return t('account.sync.pending');
  return t('account.sync.synced');
}

/**
 * Google's "G", drawn with four coloured wedges rather than shipping the
 * official asset — no image request, and no branding file in the repo.
 */
function GoogleMark() {
  return (
    <View style={styles.mark} accessibilityElementsHidden importantForAccessibility="no">
      <Text style={styles.markText}>G</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signedInBlock: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: palette.canvas,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  avatarInitial: {
    ...typography.bodyStrong,
    color: palette.inkMuted,
  },
  identity: {
    flex: 1,
    gap: 1,
  },
  name: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  status: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
  },
  statusPending: {
    color: palette.goldDark,
  },
  signOut: {
    ...typography.caption,
    color: palette.inkMuted,
  },
  signedOut: {
    gap: spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    minHeight: 52,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: palette.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  googleButtonPressed: {
    borderBottomWidth: 2,
    marginTop: 2,
    backgroundColor: palette.canvas,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  markText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleLabel: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  signedOutHint: {
    ...typography.caption,
    color: palette.inkFaint,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  error: {
    ...typography.caption,
    color: palette.coralDark,
    textAlign: 'center',
  },
});

export const AccountBar = memo(AccountBarComponent);
