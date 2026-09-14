/**
 * ============================================================================
 * In-app video for a lesson
 * ============================================================================
 *
 * The YouTube iframe player inside a WebView, rather than throwing the learner
 * out to the browser and hoping they come back.
 *
 * Two constraints shape this, and both are deliberate.
 *
 * NOTHING LOADS UNTIL PLAY IS PRESSED. The site promises it does not track
 * people, and a mounted iframe contacts Google whether or not anyone watches.
 * So this renders a plain card, and the WebView is only created once the
 * learner has asked for it. The web version of this component makes the same
 * promise and keeps it the same way — including refusing to fetch YouTube's
 * thumbnail, because `i.ytimg.com` is a Google host and requesting an image
 * from it hands over an IP address before anyone has decided to watch.
 *
 * THE OFFICIAL PLAYER, UNMODIFIED. `youtube-nocookie.com/embed` is the
 * embed YouTube publishes and permits. Extracting a stream URL to feed a
 * native player would be smoother and would also breach their terms, strip the
 * creator's attribution, and break the first time they change anything.
 *
 * The module this exists for is somebody else's teaching, used with the
 * player they provide.
 *
 * THE PLAYER IS LOADED FROM OUR OWN SITE, AND HAS TO BE. Two simpler things
 * were tried and both return "Video player configuration error — Error 153".
 *
 * Pointing the WebView at `youtube-nocookie.com/embed/...` loads it as a
 * top-level navigation: there is no embedding page, so the player cannot
 * establish which origin is embedding it and refuses rather than guess.
 * Wrapping the iframe in local HTML and setting `baseUrl` does not help either
 * — that goes through `loadHTMLString`, which does not give the document a real
 * origin as far as a cross-origin subframe is concerned, so the player sees the
 * same nothing.
 *
 * Measured, not assumed. The same embed was loaded four ways in a real browser:
 * top-level → 153, inside a document with no real origin → 153, inside an
 * iframe on a genuine https origin → plays, and openmacro.org itself → plays.
 * Only a real origin works, so the app borrows the one the website already has.
 *
 * `/embed/<id>` is a bare page that exists for this and nothing else. The
 * privacy promise above is unchanged: the WebView is not mounted until play, so
 * nothing is requested until then — and then it is this site and
 * youtube-nocookie.com, which is what it always was.
 *
 * COLLAPSING IS A PREFERENCE, NOT CARD STATE. A 16:9 frame is the tallest
 * thing on the screen, and a learner who has already watched a module's
 * videos elsewhere — or who simply reads faster than anyone talks — should be
 * able to put them away and have them stay away. See `videoPreference`.
 */

import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { useLocale } from '@/providers/LocaleProvider';
import { useVideosCollapsed } from '@/services/videoPreference';
import { palette, radius, spacing, typography } from '@/theme/tokens';

export interface LessonVideoProps {
  /** A watch URL, a youtu.be link, or a bare 11-character id. */
  url: string;
  /** Shown on the placeholder, so the learner knows what they are about to play. */
  title: string;
  minutes?: number;
  /** Attribution — a viewer is owed the knowledge of whose video this is. */
  source?: string;
}

export function LessonVideo({ url, title, minutes, source }: LessonVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useVideosCollapsed();
  const { t } = useLocale();
  const id = youTubeId(url);
  if (!id) return null;

  const toggle = () => {
    // Collapsing unmounts the player, which stops it. Re-expanding therefore
    // comes back to the placeholder rather than resuming — the same press is
    // still required to contact Google, which is the promise this card makes.
    if (!collapsed) setPlaying(false);
    setCollapsed(!collapsed);
  };

  return (
    <View style={styles.card}>
      {collapsed ? null : (
        <View style={styles.frame}>
          {playing ? (
            <WebView
              source={{ uri: `${SITE_ORIGIN}/embed/${id}` }}
              originWhitelist={['*']}
              style={styles.web}
              // The player needs its own JS, and on iOS inline playback has to be
              // allowed or tapping play throws it into the fullscreen overlay.
              javaScriptEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loading}>
                  <ActivityIndicator color={palette.inkFaint} />
                </View>
              )}
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('lesson.video.play', { title })}
              style={styles.placeholder}
              onPress={() => setPlaying(true)}
            >
              <View style={styles.playButton}>
                <Text style={styles.playGlyph}>▶︎</Text>
              </View>
              <Text style={styles.placeholderTitle} numberOfLines={2}>
                {title}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: !collapsed }}
        accessibilityLabel={collapsed ? t('lesson.video.show') : t('lesson.video.hide')}
        style={styles.meta}
        onPress={toggle}
      >
        <View style={styles.metaLines}>
          {/* Collapsed, this row is all that is left of the card, so it has to
              carry the title the frame was showing. */}
          {collapsed ? (
            <Text style={styles.metaTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          <Text style={styles.metaText}>
            {minutes ? t('lesson.video.minutes', { count: minutes }) : t('lesson.video.watchFirst')}
            {source ? ` · ${source}` : ''}
          </Text>
          {!playing && !collapsed ? (
            <Text style={styles.metaQuiet}>{t('lesson.video.privacy')}</Text>
          ) : null}
        </View>
        <Text style={styles.toggle}>
          {collapsed ? t('lesson.video.show') : t('lesson.video.hide')}
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Where the embed page lives.
 *
 * Hardcoded to production on purpose. A build pointed at a local dev server
 * would play videos for whoever is running one and silently fail for everybody
 * else, and this is the one screen where a fallback that half-works is worse
 * than an obvious break.
 */
const SITE_ORIGIN = 'https://openmacro.org';

/** Accepts a watch URL, a youtu.be link, or a bare id. */
function youTubeId(url: string): string | null {
  const bare = /^[\w-]{11}$/;
  if (bare.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return bare.test(id) ? id : null;
    }
    const v = parsed.searchParams.get('v');
    if (v && bare.test(v)) return v;
    const embed = /\/(?:embed|shorts)\/([\w-]{11})/.exec(parsed.pathname);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    overflow: 'hidden',
  },
  frame: {
    // 16:9, which is what the player expects; anything else letterboxes.
    aspectRatio: 16 / 9,
    width: '100%',
    backgroundColor: palette.ink,
  },
  web: {
    flex: 1,
    backgroundColor: palette.ink,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.mint,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  playGlyph: {
    fontSize: 24,
    color: palette.mint,
    // The glyph is optically left-heavy; nudge it back into the circle.
    marginLeft: 4,
  },
  placeholderTitle: {
    ...typography.bodyStrong,
    color: palette.surface,
    textAlign: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  metaLines: {
    flex: 1,
    gap: 2,
  },
  metaTitle: {
    ...typography.bodyStrong,
    color: palette.ink,
  },
  toggle: {
    ...typography.caption,
    color: palette.mint,
  },
  metaText: {
    ...typography.caption,
    color: palette.ink,
  },
  metaQuiet: {
    ...typography.caption,
    color: palette.inkMuted,
  },
});
