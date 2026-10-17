/**
 * Profile — how far you are, who you are signed in as, and settings.
 *
 * The old Progress and Account tabs, merged. Per-module progress bars are
 * gone from here because the Course tab now shows a ring on every module,
 * and a second list of the same 33 modules was the reason Progress felt like
 * a dead end: none of it could be tapped. What stays is what only this screen
 * says — totals, streak, what memory is holding — and the modules slipping
 * from memory now open their page.
 *
 * Order, top to bottom: the numbers (what people open this for most), sign-in
 * (because sync explains where those numbers live), language, about, and the
 * destructive controls last and closed.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { AccountBar } from '@/components/ui/AccountBar';
import { Chevron } from '@/components/ui/CourseRows';
import { DeleteAccount } from '@/components/ui/DeleteAccount';
import { TAB_BAR_SPACE } from '@/components/ui/GlassTabBar';
import { LanguagePicker } from '@/components/ui/LanguagePicker';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MusicToggle } from '@/components/ui/MusicToggle';
import { SeasonToggle } from '@/components/ui/SeasonToggle';
import { SeasonalFooter, SeasonalScreenCorner, useSeasonalEmoji } from '@/components/ui/SeasonalDecor';
import { TopScrim } from '@/components/ui/TopScrim';
import { useCourse } from '@/hooks/useCourse';
import { useReview } from '@/hooks/useReview';
import { openModule } from '@/navigation/routes';
import { useLocale } from '@/providers/LocaleProvider';
import { useProgress } from '@/providers/ProgressProvider';
import { fontScale, palette, radius, spacing, typography } from '@/theme/tokens';

/** Where the course is written in the open. */
const REPOSITORY_URL = 'https://github.com/obrunodegouveia/openmacro';

/**
 * The Dynamic Type scale above which a row of three stat tiles stacks into a
 * column. Three tiles side by side leave each about 100pt, and past this a
 * label such as "Day streak" no longer fits a word to a line and breaks it
 * mid-word.
 */
const STACK_STATS_AT = 1.3;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();
  const streakEmoji = useSeasonalEmoji('streak', '🔥');
  const { profile } = useProgress();
  const { summary } = useReview();
  const { lessonsDone, lessonsTotal, statusOf } = useCourse();

  // The scheduler reports ids; anything that no longer resolves is dropped.
  const weakest = (summary?.weakestModules ?? [])
    .slice(0, 3)
    .map((id) => statusOf(id))
    .filter((status) => status !== undefined);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + TAB_BAR_SPACE },
        ]}
        scrollIndicatorInsets={{ bottom: TAB_BAR_SPACE }}
        // Keeps the delete-account email field above the keyboard.
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <SeasonalScreenCorner />
          <Text maxFontSizeMultiplier={fontScale.title} style={styles.title}>{t('profile.title')}</Text>
        </View>

        {/* ---- the numbers --------------------------------------------- */}
        <StatRow>
          <Stat value={profile?.totalXp ?? 0} label={t('progress.stat.xp')} />
          <Stat value={lessonsDone} label={t('progress.stat.lessons', { total: lessonsTotal })} />
          <Stat
            value={profile?.dayStreak ?? 0}
            label={t('progress.stat.streak')}
            accessibilityLabel={t('path.streak', { count: profile?.dayStreak ?? 0 })}
            emoji={streakEmoji}
            // Dimmed until today's goal is met, as in the Today header.
            dimEmoji={!(profile?.streakActiveToday ?? false)}
          />
        </StatRow>
        {/* Labelled, so the bar says what it measures; and only once there
            is something to measure — an empty grey bar reads as broken. */}
        {lessonsDone > 0 ? (
          <View style={styles.courseBar}>
            <ProgressBar progress={lessonsTotal ? lessonsDone / lessonsTotal : 0} height={10} />
            <Text style={styles.courseBarLabel}>
              {t('profile.coursePercent', {
                percent: lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0,
              })}
            </Text>
          </View>
        ) : null}

        {/* ---- memory ----------------------------------------------------
          Hidden before the first lesson: "0 tracked" to someone who has not
          started is noise dressed as information. */}
        {summary && summary.tracked > 0 ? (
          <View style={styles.block}>
            <Text style={styles.sectionTitle}>{t('progress.memory.title')}</Text>
            <Text style={styles.sectionBlurb}>{t('progress.memory.blurb')}</Text>
            <StatRow>
              <Stat value={summary.tracked} label={t('progress.memory.tracked')} />
              <Stat value={summary.dueThisWeek} label={t('progress.memory.week')} />
              <Stat value={summary.lapsed} label={t('progress.memory.lapsed')} />
            </StatRow>
            {weakest.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>{t('progress.memory.weakest')}</Text>
                {weakest.map((status) => (
                  <Pressable
                    key={status.module.id}
                    accessibilityRole="button"
                    onPress={() => openModule(status.module.id)}
                    style={({ pressed }) => [styles.weakRow, pressed && styles.pressed]}
                  >
                    <Text style={styles.weakTitle} numberOfLines={1}>
                      {status.module.title}
                    </Text>
                    <Chevron />
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* ---- account and settings ------------------------------------ */}
        <AccountBar />

        <View style={styles.card}>
          <LanguagePicker />
        </View>

        <View style={styles.card}>
          <MusicToggle />
        </View>

        {/* Renders nothing unless a season is on the calendar. */}
        <SeasonToggle />

        {/* ---- about ----------------------------------------------------
          This used to close the learning path, telling learners mid-course
          how to add a TypeScript file. It is true and worth saying; it is
          just not what a learner is looking for between lessons. */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>{t('profile.about')}</Text>
          <View style={styles.about}>
            <Text style={styles.aboutTitle}>{t('profile.about.title')}</Text>
            <Text style={styles.aboutBody}>{t('profile.about.body')}</Text>
            <Pressable
              accessibilityRole="link"
              onPress={() => void Linking.openURL(REPOSITORY_URL)}
              hitSlop={8}
              style={({ pressed }) => [styles.aboutLink, pressed && styles.pressed]}
            >
              <Text style={styles.aboutLinkText}>{t('profile.about.github')}</Text>
              <Chevron />
            </Pressable>
          </View>
        </View>

        <DangerZone />

        <SeasonalFooter />
      </ScrollView>
      <TopScrim />
    </View>
  );
}

// ---------------------------------------------------------------------------

/**
 * Whether stat tiles stack into a column, at the learner's text size.
 *
 * @return True past `STACK_STATS_AT`.
 */
function useStatsStacked(): boolean {
  return useWindowDimensions().fontScale > STACK_STATS_AT;
}

/**
 * A row of stat tiles, stacked into a column at large Dynamic Type sizes.
 *
 * @param props.children The tiles.
 * @return The row.
 */
function StatRow({ children }: { children: ReactNode }) {
  const stacked = useStatsStacked();
  return <View style={[styles.stats, stacked && styles.statsStacked]}>{children}</View>;
}

/**
 * One stat tile: a large number over what it counts.
 *
 * @param props.value The number.
 * @param props.label What it counts.
 * @param props.accessibilityLabel Read instead of "value, label" when that would not make a sentence.
 * @param props.emoji Shown beside the number, such as the streak flame.
 * @param props.dimEmoji Fades the emoji, for a streak not yet kept today.
 * @return The tile.
 */
function Stat({
  value,
  label,
  accessibilityLabel,
  emoji,
  dimEmoji = false,
}: {
  value: number;
  label: string;
  accessibilityLabel?: string;
  emoji?: string;
  dimEmoji?: boolean;
}) {
  // Stacked, a tile is full width and sized by its content, not shared space.
  const stacked = useStatsStacked();
  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.stat, stacked && styles.statStacked]}>
      <View style={styles.statValueRow}>
        <Text maxFontSizeMultiplier={fontScale.display} style={styles.statValue}>
          {value}
        </Text>
        {emoji ? (
          <Text
            maxFontSizeMultiplier={fontScale.display}
            style={[styles.statEmoji, dimEmoji && styles.statEmojiDim]}
          >
            {emoji}
          </Text>
        ) : null}
      </View>
      <Text maxFontSizeMultiplier={fontScale.title} style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

/**
 * The two controls that destroy something, behind one closed door.
 *
 * Reopens closed on every visit: a learner who opened it once to reset their
 * progress should not find the delete button waiting the next time they come
 * to change language.
 *
 * This is the only route to account deletion, which Apple requires under
 * guideline 5.1.1(v) for any app that lets you create an account. One tap
 * behind a labelled section on the Profile tab satisfies "discoverable" — if a
 * review is ever rejected for it, the fix is to surface it, not to argue.
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
        style={({ pressed }) => [styles.dangerHead, pressed && styles.pressed]}
      >
        <Text style={styles.dangerTitle}>{t('account.danger')}</Text>
        <SymbolView
          // Decorative: the control around it carries the label and state.
          accessible={false}
          accessibilityElementsHidden
          name={
            open
              ? { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' }
              : { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }
          }
          size={16}
          tintColor={palette.coralDark}
          weight="semibold"
        />
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

/**
 * Clears XP, streak and completion records. Confirmation is a second tap
 * rather than a dialog: `Alert.alert` is a no-op on react-native-web, which
 * would leave this destructive control silently unconfirmed there.
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
      onPress={handlePress}
      style={({ pressed }) => [styles.reset, pressed && styles.pressed]}
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
  pressed: { opacity: 0.6 },
  title: { ...typography.display, color: palette.ink },

  stats: { flexDirection: 'row', gap: spacing.md },
  statsStacked: { flexDirection: 'column' },
  statStacked: { flex: 0 },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statValue: { ...typography.title, color: palette.ink, fontVariant: ['tabular-nums'] },
  statEmoji: { fontSize: typography.heading.fontSize },
  statEmojiDim: { opacity: 0.35 },
  statLabel: { ...typography.caption, color: palette.inkMuted, textAlign: 'center' },

  block: { gap: spacing.sm },
  sectionTitle: { ...typography.heading, color: palette.ink },
  sectionBlurb: { ...typography.caption, color: palette.inkMuted },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  cardLabel: {
    ...typography.overline,
    color: palette.inkMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  weakTitle: { ...typography.body, color: palette.ink, flex: 1 },

  courseBar: { gap: spacing.xs },
  courseBarLabel: { ...typography.caption, color: palette.inkMuted, alignSelf: 'flex-end' },

  about: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  aboutTitle: { ...typography.bodyStrong, color: palette.ink },
  aboutBody: { ...typography.body, color: palette.inkMuted },
  aboutLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 44 },
  aboutLinkText: { ...typography.bodyStrong, color: palette.blueDark },

  danger: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.coralSoft,
    overflow: 'hidden',
  },
  dangerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dangerTitle: { ...typography.bodyStrong, color: palette.coralDark },
  dangerBody: { gap: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  reset: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  resetText: { ...typography.caption, color: palette.inkFaint },
  resetTextArmed: { color: palette.coralDark },
});
